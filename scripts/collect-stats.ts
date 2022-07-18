import { writeFile } from 'node:fs/promises';
import { Octokit } from '@octokit/core';

interface Contributor {
  avatar_url: string;
  issues: Record<string, number>;
  pulls: Record<string, number>;
  merged_pulls: Record<string, number>;
}

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
    }
    console.log('Done processing data!');

    console.log('Writing to disk...');
    await this.#writeData(contributors);
    console.log('Mission complete!');
  }

  #newContributor({ avatar_url }): Contributor {
    return { avatar_url, issues: {}, pulls: {}, merged_pulls: {} };
  }

  async #getRepos() {
    return (
      await this.#app.request(`GET /orgs/{org}/repos`, {
        org: this.#org,
        type: 'sources',
      })
    ).data.filter((repo) => !repo.private);
  }

  async #getAllContributors(repo: string, page = 1) {
    const per_page = 100;

    const { data: contributors } = await this.#app.request(
      'GET /repos/{owner}/{repo}/contributors',
      { owner: this.#org, repo, page, per_page }
    );

    if (contributors.length === per_page) {
      const nextPage = await this.#getAllContributors(repo, page + 1);
      contributors.push(...nextPage);
    }

    return contributors;
  }

  async #getAllIssues(repo: string, page = 1) {
    if (page === 1) console.log(`Fetching issues for ${this.#org}/${repo}...`);
    const per_page = 100;

    const { data: issues } = await this.#app.request(
      'GET /repos/{owner}/{repo}/issues',
      { owner: this.#org, repo, page, per_page, state: 'all' }
    );

    if (issues.length === per_page) {
      const nextPage = await this.#getAllIssues(repo, page + 1);
      issues.push(...nextPage);
    }

    if (page === 1)
      console.log(`Done fetching issues for ${this.#org}/${repo}`);
    return issues;
  }

  async #getReposWithExtraStats() {
    console.log('Fetching repos...');
    const repos = await this.#getRepos();
    console.log('Done fetching repos!');
    return await Promise.all(
      repos.map(async (repo) => ({
        ...repo,
        // contributors: await this.#getAllContributors(repo.name),
        issues: await this.#getAllIssues(repo.name),
      }))
    );
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
