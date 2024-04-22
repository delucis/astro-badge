import type { Contributor } from '../types';
import { objSum } from './objSum';
import type { Achievement, AchievementClass } from './achievementsHelpers';
import spec from '../achievements.config';

interface NextAchievement {
  achievement: Achievement & { count: number };
  progress: number;
}

function getAchievementsFromSpec(contributor: Contributor) {
  const achieved: {
    groupID: string;
    repo?: string | undefined;
    class: AchievementClass;
    achievements: [Achievement, ...Achievement[]];
    next?: NextAchievement | undefined;
  }[] = [];
  for (const groupID in spec) {
    const group = spec[groupID]!;
    const groupAchieved: Achievement[] = [];
    const { repo, achievements } = group;
    let count: number;
    if ('getCount' in group) {
      count = group.getCount(contributor);
    } else if (group.stat === 'merged_pulls_by_label' || group.stat === 'reviews_by_category') {
      const key = group.stat === 'merged_pulls_by_label' ? group.label : group.category;
      count = repo
        ? contributor[group.stat][repo]?.[key] || 0
        : Object.values(contributor[group.stat]).reduce((sum, repo) => sum + (repo[key] || 0), 0);
    } else {
      const stat = group.stat === 'merges' ? 'merged_pulls' : group.stat;
      count = repo ? contributor[stat][repo] || 0 : objSum(contributor[stat]);
    }
    let next: NextAchievement | undefined;
    for (const achievement of Object.values(achievements)) {
      if (count >= achievement.count) {
        groupAchieved.push(achievement);
        achievement.numAchieved++;
      } else {
        next = { progress: count / achievement.count, achievement };
        break;
      }
    }
    groupAchieved.sort((a, b) => b.class - a.class);
    const [best, ...rest] = groupAchieved;
    if (!best) continue;

    achieved.push({
      groupID,
      repo,
      class: best.class,
      achievements: [best, ...rest],
      next,
    });
  }
  achieved.sort((a, b) => b.class - a.class);
  return achieved;
}

export function getAchievements(contributor: Contributor) {
  return getAchievementsFromSpec(contributor);
}
