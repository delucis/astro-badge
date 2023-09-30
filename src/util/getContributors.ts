import sharp from 'sharp';
import data from '../data/contributors.json';
import { Contributor } from '../types';
import { getAchievements } from './getAchievements';
import { getStats } from './getStats';
import { objSum } from './objSum';
import { resizedGitHubAvatarURL } from './resizedGitHubAvatarURL';

export interface EnhancedContributor extends Contributor {
	username: string;
	achievements: ReturnType<typeof getAchievements>;
	stats: ReturnType<typeof getStats>;
	getBase64Avatar: () => Promise<string>;
}

const avatarCache = new Map<string, string>();
async function getBase64Avatar(avatar_url: string) {
	const cached = avatarCache.get(avatar_url);
	if (cached) {
		return cached;
	}
	const avatarRes = await fetch(resizedGitHubAvatarURL(avatar_url, 60));
	let avatarBuffer = Buffer.from(await (await avatarRes.blob()).arrayBuffer());
	if (avatarRes.headers.get('content-type') !== 'image/jpeg') {
		// resvg doesn’t like PNG avatars, so force to JPEG:
		avatarBuffer = await sharp(avatarBuffer).flatten().jpeg().toBuffer();
	}
	const b64 = avatarBuffer.toString('base64');
	avatarCache.set(avatar_url, b64);
	return b64;
}

function enhanceContributor(username: string, contributor: Contributor): EnhancedContributor {
	return {
		username,
		...contributor,
		achievements: getAchievements(contributor),
		stats: getStats(contributor),
		getBase64Avatar: () => getBase64Avatar(contributor.avatar_url),
	};
}

function contributorSum({ issues, merged_pulls, reviews }: Contributor) {
	return objSum(issues) + objSum(merged_pulls) + objSum(reviews);
}

function sortContributors(contributors: EnhancedContributor[]) {
	return contributors.sort((a, b) => contributorSum(b) - contributorSum(a));
}

function loadContributors(contributors: typeof data) {
	const enhancedContributors: EnhancedContributor[] = [];
	for (const username in contributors) {
		const contributor = contributors[username as keyof typeof contributors];
		enhancedContributors.push(enhanceContributor(username, contributor));
	}
	return sortContributors(enhancedContributors);
}

export const contributors = loadContributors(data);
