import { Contributor } from '../types';

export enum AchievementClass {
	Bronze = 0,
	Silver = 1,
	Gold = 2,
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
	achievements: [bronze: AchievementDef, silver: AchievementDef, gold: AchievementDef];
}

interface BuiltinAchievementGroup extends AchievementGroupBase {
	/** Specify a built-in stat count type. */
	stat: 'merges' | 'issues' | 'reviews';
}

interface LabelAchievementGroup extends AchievementGroupBase {
	stat: 'merged_pulls_by_label';
	label: string;
}

interface CategoryAchievementGroup extends AchievementGroupBase {
	stat: 'reviews_by_category';
	category: string;
}

interface CustomAchievementGroup extends AchievementGroupBase {
	/** A custom function to calculate the stat count for this achievement. */
	getCount: (contributor: Contributor) => number;
}

type AchievementGroup =
	| BuiltinAchievementGroup
	| LabelAchievementGroup
	| CustomAchievementGroup
	| CategoryAchievementGroup;

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
