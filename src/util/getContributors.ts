import data from '../data/contributors.json';
import { Contributor } from '../types';
import { getAchievements } from './getAchievements';
import { getStats } from './getStats';
import { objSum } from './objSum';

interface EnhancedContributor extends Contributor {
  username: string;
  achievements: ReturnType<typeof getAchievements>;
  stats: ReturnType<typeof getStats>;
}

function enhanceContributor(username: string, contributor: Contributor) {
  return {
    username,
    ...contributor,
    achievements: getAchievements(contributor),
    stats: getStats(contributor),
  };
}

function contributorSum({ issues, merged_pulls, reviews }: Contributor) {
  return objSum(issues) + objSum(merged_pulls) + objSum(reviews);
}

function sortContributors(contributors: EnhancedContributor[]) {
  return contributors.sort((a, b) => contributorSum(b) - contributorSum(a));
}

function loadContributors(contributors: typeof data) {
  const enhancedContributors: EnhancedContributor[] = [];
  for (const username in contributors) {
    const contributor = contributors[username as keyof typeof contributors];
    enhancedContributors.push(enhanceContributor(username, contributor));
  }
  return sortContributors(enhancedContributors);
}

export const contributors = loadContributors(data);
