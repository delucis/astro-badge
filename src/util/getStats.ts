import { objSum } from './objSum';

export function getStats({ issues, merged_pulls, reviews }) {
  return [
    { type: 'issues', count: formatInt(objSum(issues)) },
    { type: 'pulls', count: formatInt(objSum(merged_pulls)) },
    { type: 'reviews', count: formatInt(objSum(reviews)) }
  ].filter(({ count }) => count !== '0');
}

const formatInt = (int: number) =>
  int < 1000 ? int.toString() : (int / 1000).toFixed(1) + 'k';
