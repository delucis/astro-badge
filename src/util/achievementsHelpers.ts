import { Contributor } from '../types';

export enum AchievementClass {
  Bronze,
  Silver,
  Gold,
}

export interface Achievement {
  title: string;
  details: string;
  class: AchievementClass;
  numAchieved: number;
}

interface AchievementDef {
  /** The title for this achievement. Short, sweet and entertaining. */
  title: string;
  /** Description of how this was achieved, e.g. `'First docs PR'`. */
  details: string;
  /** The stat count required to receive this achievement. */
  count: number;
}

interface AchievementGroupBase {
  /**
   * The repository this achievement is for.
   * If omitted, built-in achievements are calculated for all repos.
   */
  repo?: string;
  /** Tuple of achievements in ascending order: `[bronze, silver, gold]`. */
  achievements: [
    bronze: AchievementDef,
    silver: AchievementDef,
    gold: AchievementDef
  ];
}

interface BuiltinAchievementGroup extends AchievementGroupBase {
  /** Specify a built-in stat count type. */
  stat: 'merges' | 'issues' | 'reviews';
}

interface CustomAchievementGroup extends AchievementGroupBase {
  /** A custom function to calculate the stat count for this achievement. */
  getCount: (contributor: Contributor) => number;
}

type AchievementGroup = BuiltinAchievementGroup | CustomAchievementGroup;

export function AchievementSpec(spec: Record<string, AchievementGroup>) {
  return Object.fromEntries(
    Object.entries(spec).map(([groupID, group]) => {
      return [
        groupID,
        {
          ...group,
          achievements: group.achievements.map((achievement, index) => ({
            ...achievement,
            class: index as AchievementClass,
            numAchieved: 0,
          })),
        },
      ];
    })
  );
}
