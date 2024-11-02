import { Octokit } from '@octokit/core';
import { paginateGraphQL } from '@octokit/plugin-paginate-graphql';
import { paginateRest } from '@octokit/plugin-paginate-rest';
import { retry } from '@octokit/plugin-retry';
import type { Endpoints } from '@octokit/types';
import { minimatch } from 'minimatch';
import { writeFile } from 'node:fs/promises';
import type { Contributor } from '../src/types';

type APIData<T extends keyof Endpoints> = Endpoints[T]['response']['data'];
type Repo = APIData<'GET /orgs/{org}/repos'>[number];
type CustomCategories = {
  [key: string]: {
    [key: string]: string[];
  };
};
interface AugmentedRepo extends Repo {
  reviewComments: APIData<'GET /repos/{owner}/{repo}/pulls/comments'>;
  issues: APIData<'GET /repos/{owner}/{repo}/issues'>;
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
              for (const label of labels) {
                const name = typeof label === 'string' ? label : label.name;
                if (!name) continue;
                contributor.merged_pulls_by_label[repo.name]![name] =
                  (contributor.merged_pulls_by_label[repo.name]![name] || 0) + 1;
              }
            }
          }
        } else {
          contributor.issues[repo.name] = (contributor.issues[repo.name] || 0) + 1;
        }
      }

      /** Temporary store for deduplicating multiple reviews on the same PR. */
      const reviewedPRs: Record<string, Set<string>> = {};

      const customCategories = this.#customCategories;

      for (const review of repo.reviewComments) {
        const { user, pull_request_url, path } = review;
        if (!user) {
          console.warn(`No user found for PR review: ${review.url}`);
          continue;
        }
        const { avatar_url, login } = user;
        const contributor = (contributors[login] =
          contributors[login] || this.#newContributor({ avatar_url }));
        const contributorReviews = (reviewedPRs[login] = reviewedPRs[login] || new Set());
        if (!contributorReviews.has(pull_request_url)) {
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
          contributorReviews.add(pull_request_url);
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
    };
  }

  async #getRepos() {
    return (
      await this.#app.request(`GET /orgs/{org}/repos`, {
        org: this.#org,
        type: 'sources',
      })
    ).data.filter((repo) => !repo.private);
  }

  async #getAllIssues(repo: string) {
    console.log(`Fetching issues for ${this.#org}/${repo}...`);
    const issues = await this.#app.paginate('GET /repos/{owner}/{repo}/issues', {
      owner: this.#org,
      repo,
      per_page: 100,
      state: 'all',
    });
    console.log(`Done fetching ${issues.length} issues for ${this.#org}/${repo}`);
    return issues;
  }

  async #getAllReviewComments(repo: string) {
    console.log(`Fetching PR reviews for ${this.#org}/${repo}...`);
    const reviews = await this.#app.paginate('GET /repos/{owner}/{repo}/pulls/comments', {
      owner: this.#org,
      repo,
      per_page: 100,
    });
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
        issues: await this.#getAllIssues(repo.name),
        reviewComments: await this.#getAllReviewComments(repo.name),
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
