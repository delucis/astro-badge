import { objSum } from './objSum';

export function getStats({ issues, merged_pulls }) {
  return [
    { type: 'pulls', count: formatInt(objSum(merged_pulls)) },
    { type: 'issues', count: formatInt(objSum(issues)) },
  ].filter(({ count }) => !!count);
}

const formatInt = (int: number) =>
  int < 1000 ? int.toString() : (int / 1000).toFixed(1) + 'k';
