import { objSum } from './objSum';

export function getAchievements(contributor, { exhaustive = false } = {}) {
  const { issues, merged_pulls: merges } = contributor;

  const badges: { title: string; details: string }[] = [];

  if (issues && (exhaustive || objSum(issues) < 10)) {
    badges.push({ title: 'Little Green Bug', details: 'Opened an issue' });
  }
  if (merges.astro && (exhaustive || merges.astro < 10)) {
    badges.push({ title: 'Space Cadet', details: 'First astro PR' });
  }
  if (merges.docs && (exhaustive || merges.docs < 10)) {
    badges.push({ title: 'Docs Padawan', details: 'First docs PR' });
  }
  if (merges.rfcs && (exhaustive || merges.rfcs < 10)) {
    badges.push({ title: 'Visionary', details: 'First rfcs PR' });
  }
  if (merges['prettier-plugin-astro']) {
    badges.push({
      title: 'Aesthete',
      details: 'First prettier-plugin-astro PR',
    });
  }
  if (objSum(issues) >= 10) {
    badges.push({ title: 'Entomologist', details: 'Opened 10 issues' });
  }
  if (merges.astro >= 10 && (exhaustive || merges.astro < 30)) {
    badges.push({ title: 'Technician', details: '10 astro PRs' });
  }
  if (merges.compiler >= 10 && (exhaustive || merges.compiler < 30)) {
    badges.push({ title: 'Mechanic', details: '10 compiler PRs' });
  }
  if (merges.docs >= 10 && (exhaustive || merges.docs < 30)) {
    badges.push({ title: 'Scholar', details: '10 docs PRs' });
  }
  if (
    merges['language-tools'] >= 10 &&
    (exhaustive || merges['language-tools'] < 30)
  ) {
    badges.push({ title: 'Linguist', details: '10 language-tools PRs' });
  }
  if (merges.rfcs >= 10) {
    badges.push({ title: 'Mission Control', details: '10 rfcs PRs' });
  }
  if (merges.astro >= 30) {
    badges.push({ title: 'Rocket Scientist', details: '30 astro PRs' });
  }
  if (merges.compiler >= 30) {
    badges.push({
      title: 'Spline Reticulator',
      details: '30 compiler PRs',
    });
  }
  if (merges.docs >= 30) {
    badges.push({ title: 'Galactic Librarian', details: '30 docs PRs' });
  }
  if (merges['language-tools'] >= 30) {
    badges.push({
      title: 'Token Wrangler',
      details: '30 language-tools PRs',
    });
  }
  if (Object.keys(merges).length >= 4) {
    badges.push({ title: 'Astrologer', details: 'PRs in 4 Astro repos' });
  }

  return badges.reverse();
}
