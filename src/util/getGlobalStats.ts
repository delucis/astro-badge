import type { Achievement, AchievementClass } from './achievementsHelpers';
import { contributors } from './getContributors';

interface Stat extends Achievement {
  groupID: string;
  repo?: string | undefined;
  contributors: typeof contributors;
}

export const globalAchievements: Stat[] = Object.values(
  contributors.reduce((stats, contributor) => {
    contributor.achievements.forEach((group) => {
      if (!stats[group.groupID]) {
        stats[group.groupID] = {};
      }
      for (const achievement of group.achievements) {
        if (!stats[group.groupID]![achievement.class]) {
          stats[group.groupID]![achievement.class] = {
            ...achievement,
            groupID: group.groupID,
            repo: group.repo,
            contributors: [],
          };
        }
        stats[group.groupID]![achievement.class]!.contributors.push(contributor);
      }
    });
    return stats;
  }, {} as Record<string, Partial<Record<AchievementClass, Stat>>>)
).flatMap((group) => Object.values(group));
