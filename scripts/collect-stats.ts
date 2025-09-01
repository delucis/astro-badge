import { Octokit } from '@octokit/core';
import { paginateGraphQL, type PageInfoForward } from '@octokit/plugin-paginate-graphql';
import { paginateRest, type PaginatingEndpoints } from '@octokit/plugin-paginate-rest';
import { retry } from '@octokit/plugin-retry';
import { minimatch } from 'minimatch';
import { writeFile } from 'node:fs/promises';
import type { Contributor } from '../src/types';

type APIData<T extends keyof PaginatingEndpoints> = PaginatingEndpoints[T]['response']['data'];
type Repo = APIData<'GET /orgs/{org}/repos'>[number];
type CustomCategories = {
  [key: string]: {
    [key: string]: string[];
  };
};
interface Review {
  login: string | undefined;
  avatarUrl: string | undefined;
  prNumber: number;
  labels: string[];
}
interface AugmentedRepo extends Repo {
  reviewComments: APIData<'GET /repos/{owner}/{repo}/pulls/comments'>;
  issues: APIData<'GET /repos/{owner}/{repo}/issues'>;
  reviews: Review[];
}

const OctokitWithPlugins = Octokit.plugin(paginateRest, paginateGraphQL, retry);

class StatsCollector {
  #org: string;
  #app: InstanceType<typeof OctokitWithPlugins>;
  #customCategories: CustomCategories;

  constructor(opts: {
    org: string;
    token: string | undefined;
    customCategories: CustomCategories;
  }) {
    this.#org = opts.org;
    this.#app = new OctokitWithPlugins({ auth: opts.token });
    this.#customCategories = opts.customCategories;
  }

  async run() {
    const repos = await this.#getReposWithExtraStats();

    const contributors: Record<string, Contributor> = {};

    console.log('Processing data...');
    for (const repo of repos) {
      for (const issue of repo.issues) {
        const { user, pull_request, labels } = issue;
        if (!user) {
          console.warn(`No user found for ${repo.full_name}#${issue.number}`);
          continue;
        }
        const { avatar_url, login } = user;
        const contributor = (contributors[login] =
          contributors[login] || this.#newContributor({ avatar_url }));
        if (pull_request) {
          contributor.pulls[repo.name] = (contributor.pulls[repo.name] || 0) + 1;
          if (pull_request.merged_at) {
            contributor.merged_pulls[repo.name] = (contributor.merged_pulls[repo.name] || 0) + 1;
            if (labels.length) {
              if (!contributor.merged_pulls_by_label[repo.name]) {
                contributor.merged_pulls_by_label[repo.name] = {};
              }
              for (const labelOrObject of labels) {
                const label =
                  typeof labelOrObject === 'string' ? labelOrObject : labelOrObject.name;
                if (!label) continue;
                contributor.merged_pulls_by_label[repo.name]![label] =
                  (contributor.merged_pulls_by_label[repo.name]![label] || 0) + 1;
              }
            }
          }
        } else {
          contributor.issues[repo.name] = (contributor.issues[repo.name] || 0) + 1;
        }
      }

      /** Temporary store for deduplicating multiple reviews on the same PR. */
      const reviewedPRs: Record<string, Set<number>> = {};

      const customCategories = this.#customCategories;

      for (const review of repo.reviewComments) {
        const { user, pull_request_url, path } = review;
        const prNumber = parseInt(pull_request_url.split('/').pop()!);
        if (!user) {
          console.warn(`No user found for PR review: ${review.url}`);
          continue;
        }
        const { avatar_url, login } = user;
        const contributor = (contributors[login] =
          contributors[login] || this.#newContributor({ avatar_url }));
        const contributorReviews = (reviewedPRs[login] = reviewedPRs[login] || new Set());
        if (!contributorReviews.has(prNumber)) {
          contributor.reviews[repo.name] = (contributor.reviews[repo.name] || 0) + 1;

          if (!contributor.reviews_by_category[repo.name]) {
            contributor.reviews_by_category[repo.name] = {};
          }

          for (const categoryName in customCategories) {
            for (const repoName in customCategories[categoryName]) {
              if (repoName !== repo.name) continue;
              for (const glob of customCategories[categoryName]![repoName]!) {
                if (minimatch(path, glob)) {
                  contributor.reviews_by_category[repo.name]![categoryName] =
                    (contributor.reviews_by_category[repo.name]![categoryName] || 0) + 1;
                }
              }
            }
          }

          const associatedIssue = repo.issues.find((issue) => issue.number === prNumber);
          if (!associatedIssue) {
            console.warn(`No associated PR ${repo.full_name}#${prNumber} found`);
            continue;
          }
          if (associatedIssue.labels.length) {
            if (!contributor.reviews_by_label[repo.name]) {
              contributor.reviews_by_label[repo.name] = {};
            }
            for (const labelOrObject of associatedIssue.labels) {
              const label = typeof labelOrObject === 'string' ? labelOrObject : labelOrObject.name;
              if (!label) continue;
              contributor.reviews_by_label[repo.name]![label] =
                (contributor.reviews_by_label[repo.name]![label] || 0) + 1;
            }
            contributorReviews.add(prNumber);
          }
        }
      }

      for (const review of repo.reviews) {
        const { login, avatarUrl, prNumber, labels } = review;
        if (!login || !avatarUrl) {
          console.warn(`No user found for PR review on ${repo.full_name}#${prNumber}`);
          continue;
        }
        const contributor = (contributors[login] =
          contributors[login] || this.#newContributor({ avatar_url: avatarUrl }));
        const contributorReviews = (reviewedPRs[login] = reviewedPRs[login] || new Set());
        if (!contributorReviews.has(prNumber)) {
          contributor.reviews[repo.name] = (contributor.reviews[repo.name] || 0) + 1;
          if (!contributor.reviews_by_label[repo.name]) {
            contributor.reviews_by_label[repo.name] = {};
          }
          for (const label of labels) {
            contributor.reviews_by_label[repo.name]![label] =
              (contributor.reviews_by_label[repo.name]![label] || 0) + 1;
          }
          contributorReviews.add(prNumber);
        }
      }
    }
    console.log('Done processing data!');

    console.log('Writing to disk...');
    await this.#writeData(contributors);
    console.log('Mission complete!');
  }

  #newContributor({ avatar_url }: { avatar_url: string }): Contributor {
    return {
      avatar_url,
      issues: {},
      pulls: {},
      merged_pulls: {},
      merged_pulls_by_label: {},
      reviews: {},
      reviews_by_category: {},
      reviews_by_label: {},
    };
  }

  async #getRepos() {
    return (
      await this.#app.paginate(`GET /orgs/{org}/repos`, {
        org: this.#org,
        type: 'sources',
        per_page: 100,
      })
    ).filter((repo) => !repo.private);
  }

  async #getAllIssuesAndPRs(repo: string) {
    console.log(`Fetching issues and PRs for ${this.#org}/${repo}...`);
    const issues = await this.#app.paginate('GET /repos/{owner}/{repo}/issues', {
      owner: this.#org,
      repo,
      per_page: 100,
      state: 'all',
    });
    console.log(`Done fetching ${issues.length} issues and PRs for ${this.#org}/${repo}`);
    return issues;
  }

  async #getAllReviewComments(repo: string) {
    console.log(`Fetching PR review comments for ${this.#org}/${repo}...`);
    const reviews = await this.#app.paginate('GET /repos/{owner}/{repo}/pulls/comments', {
      owner: this.#org,
      repo,
      per_page: 100,
    });
    console.log(`Done fetching ${reviews.length} PR review comments for ${this.#org}/${repo}`);
    return reviews;
  }

  async #getAllReviews(repo: string) {
    console.log(`Fetching PR reviews for ${this.#org}/${repo}...`);
    const {
      repository: {
        pullRequests: { nodes: pullRequests },
      },
    } = await this.#app.graphql.paginate<{
      repository: {
        pullRequests: {
          pageInfo: PageInfoForward;
          nodes: Array<{
            number: number;
            labels: { nodes: Array<{ name: string }> };
            latestReviews: {
              nodes: Array<{ author: null | { login: string; avatarUrl: string } }>;
            };
          }>;
        };
      };
    }>(
      `
      query ($org: String!, $repo: String!, $cursor: String) {
        repository(owner: $org, name: $repo) {
          pullRequests(first: 100, after: $cursor) {
            nodes {
              number
              labels(first: 10) {
                nodes {
                  name
                }
              }
              latestReviews(first: 15) {
                nodes {
                  author {
                    login
                    avatarUrl
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
`,
      { org: this.#org, repo },
    );
    const reviews: Review[] = [];
    for (const { number, labels, latestReviews } of pullRequests) {
      for (const { author } of latestReviews.nodes) {
        reviews.push({
          prNumber: number,
          labels: labels.nodes.map(({ name }) => name),
          login: author?.login,
          avatarUrl: author?.avatarUrl,
        });
      }
    }
    console.log(`Done fetching ${reviews.length} PR reviews for ${this.#org}/${repo}`);
    return reviews;
  }

  async #getReposWithExtraStats() {
    console.log('Fetching repos...');
    const repos = await this.#getRepos();
    console.log(`Done fetching ${repos.length} repos!`);
    const reposWithStats: AugmentedRepo[] = [];
    for (const repo of repos) {
      reposWithStats.push({
        ...repo,
        issues: await this.#getAllIssuesAndPRs(repo.name),
        reviewComments: await this.#getAllReviewComments(repo.name),
        reviews: await this.#getAllReviews(repo.name),
      });
    }
    return reposWithStats;
  }

  async #writeData(data: any) {
    return await writeFile('src/data/contributors.json', JSON.stringify(data), 'utf8');
  }
}

const collector = new StatsCollector({
  org: 'withastro',
  token: process.env.GITHUB_TOKEN,
  customCategories: {
    i18n: {
      docs: [
        // Astro Docs content translations
        'src/content/docs/!(en)/**/*',
        // Astro Docs labels translations
        'src/i18n/!(en)/**/*',
        // Astro Docs translations before migrating to Content Collections
        'src/pages/+(ar|de|es|fr|ja|pl|pt-br|ru|zh-cn|zh-tw)/**/*',
      ],
      starlight: [
        // Starlight Docs content translations
        'docs/src/content/docs/!(en)/**/*',
        // Starlight package labels translations
        'packages/starlight/translations/!(en.json)',
      ],
    },
  },
});
await collector.run();
