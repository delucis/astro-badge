import { Octokit } from '@octokit/core';
import type { Endpoints } from '@octokit/types';
import { writeFile } from 'node:fs/promises';
import pRretry from 'p-retry';
import { Contributor } from '../src/types';

type APIData<T extends keyof Endpoints> = Endpoints[T]['response']['data'];
type Repo = APIData<'GET /orgs/{org}/repos'>[number];
interface AugmentedRepo extends Repo {
  reviews: APIData<'GET /repos/{owner}/{repo}/pulls/comments'>;
  issues: APIData<'GET /repos/{owner}/{repo}/issues'>;
}

const retry: typeof pRretry = (fn, opts) =>
  pRretry(fn, {
    onFailedAttempt: (e) =>
      console.log(
        `Attempt ${e.attemptNumber} failed. There are ${e.retriesLeft} retries left.\n `,
        e.message
      ),
    ...opts,
  });

class StatsCollector {
  #org: string;
  #app: Octokit;

  constructor(opts: { org: string; token: string | undefined }) {
    this.#org = opts.org;
    this.#app = new Octokit({ auth: opts.token });
  }

  async run() {
    const repos = await this.#getReposWithExtraStats();

    const contributors: Record<string, Contributor> = {};

    console.log('Processing data...');
    for (const repo of repos) {
      for (const issue of repo.issues) {
        const { user, pull_request } = issue;
        const { avatar_url, login } = user;
        contributors[login] =
          contributors[login] || this.#newContributor({ avatar_url });
        if (pull_request) {
          contributors[login].pulls[repo.name] =
            (contributors[login].pulls[repo.name] || 0) + 1;
          if (pull_request.merged_at) {
            contributors[login].merged_pulls[repo.name] =
              (contributors[login].merged_pulls[repo.name] || 0) + 1;
          }
        } else {
          contributors[login].issues[repo.name] =
            (contributors[login].issues[repo.name] || 0) + 1;
        }
      }

      /** Temporary store for deduplicating multiple reviews on the same PR. */
      const reviewedPRs: Record<string, Set<string>> = {};

      for (const review of repo.reviews) {
        const { user, pull_request_url } = review;
        const { avatar_url, login } = user;
        contributors[login] =
          contributors[login] || this.#newContributor({ avatar_url });
        reviewedPRs[login] = reviewedPRs[login] || new Set();
        if (!reviewedPRs[login].has(pull_request_url)) {
          contributors[login].reviews[repo.name] =
            (contributors[login].reviews[repo.name] || 0) + 1;
          reviewedPRs[login].add(pull_request_url);
        }
      }
    }
    console.log('Done processing data!');

    console.log('Writing to disk...');
    await this.#writeData(contributors);
    console.log('Mission complete!');
  }

  #newContributor({ avatar_url }): Contributor {
    return { avatar_url, issues: {}, pulls: {}, merged_pulls: {}, reviews: {} };
  }

  async #getRepos() {
    const request = () =>
      this.#app.request(`GET /orgs/{org}/repos`, {
        org: this.#org,
        type: 'sources',
      });
    return (await retry(request)).data.filter((repo) => !repo.private);
  }

  async #getAllIssues(repo: string, page = 1) {
    if (page === 1) console.log(`Fetching issues for ${this.#org}/${repo}...`);
    const per_page = 100;

    const { data: issues, headers } = await retry(() =>
      this.#app.request('GET /repos/{owner}/{repo}/issues', {
        owner: this.#org,
        repo,
        page,
        per_page,
        state: 'all',
      })
    );

    if (headers.link?.includes('rel="next"')) {
      const nextPage = await this.#getAllIssues(repo, page + 1);
      issues.push(...nextPage);
    }

    if (page === 1)
      console.log(
        `Done fetching ${issues.length} issues for ${this.#org}/${repo}`
      );
    return issues;
  }

  async #getAllReviews(repo: string, page = 1) {
    if (page === 1)
      console.log(`Fetching PR reviews for ${this.#org}/${repo}...`);
    const per_page = 100;

    const { data: reviews, headers } = await retry(() =>
      this.#app.request('GET /repos/{owner}/{repo}/pulls/comments', {
        owner: this.#org,
        repo,
        page,
        per_page,
      })
    );

    if (headers.link?.includes('rel="next"')) {
      const nextPage = await this.#getAllReviews(repo, page + 1);
      reviews.push(...nextPage);
    }

    if (page === 1)
      console.log(
        `Done fetching ${reviews.length} PR reviews for ${this.#org}/${repo}`
      );
    return reviews;
  }

  async #getReposWithExtraStats() {
    console.log('Fetching repos...');
    const repos = await this.#getRepos();
    console.log('Done fetching repos!');
    const reposWithStats: AugmentedRepo[] = [];
    for (const repo of repos) {
      reposWithStats.push({
        ...repo,
        issues: await this.#getAllIssues(repo.name),
        reviews: await this.#getAllReviews(repo.name),
      });
    }
    return reposWithStats;
  }

  async #writeData(data: any) {
    return await writeFile(
      'src/data/contributors.json',
      JSON.stringify(data),
      'utf8'
    );
  }
}

const collector = new StatsCollector({
  org: 'withastro',
  token: process.env.GITHUB_TOKEN,
});
await collector.run();
