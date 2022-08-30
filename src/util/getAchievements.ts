import { Contributor } from '../types';
import { objSum } from './objSum';
import { Achievement, AchievementClass } from './achievementsHelpers';
import spec from '../achievements.config';

function getAchievementsFromSpec(contributor: Contributor) {
  const achieved: {
    groupID: string;
    repo?: string;
    class: AchievementClass;
    achievements: Achievement[];
  }[] = [];
  for (const groupID in spec) {
    const group = spec[groupID];
    const groupAchieved: Achievement[] = [];
    const { repo, achievements } = group;
    let count: number;
    if ('getCount' in group) {
      count = group.getCount(contributor);
    } else {
      const stat = group.stat === 'merges' ? 'merged_pulls' : group.stat;
      count = repo ? contributor[stat][repo] : objSum(contributor[stat]);
    }
    for (const achievement of Object.values(achievements)) {
      if (count >= achievement.count) {
        groupAchieved.push(achievement);
        achievement.numAchieved++;
      }
    }
    if (groupAchieved.length === 0) continue;
    groupAchieved.sort((a, b) => b.class - a.class);
    achieved.push({
      groupID,
      repo,
      class: groupAchieved[0].class,
      achievements: groupAchieved,
    });
  }
  achieved.sort((a, b) => b.class - a.class);
  return achieved;
}

export function getAchievements(contributor: Contributor) {
  return getAchievementsFromSpec(contributor);
}
