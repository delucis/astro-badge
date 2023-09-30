export interface Contributor {
	avatar_url: string;
	issues: Record<string, number>;
	pulls: Record<string, number>;
	merged_pulls: Record<string, number>;
	merged_pulls_by_label: Record<string, Record<string, number>>;
	reviews: Record<string, number>;
	reviews_by_category: Record<string, Record<string, number>>;
}
