export interface Contributor {
  avatar_url: string;
  issues: Record<string, number>;
  pulls: Record<string, number>;
  merged_pulls: Record<string, number>;
  reviews: Record<string, number>;
}
