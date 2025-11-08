export function objSum(obj: Record<string, number>): number {
  return Object.values(obj).reduce((sum, i) => sum + i, 0);
}
