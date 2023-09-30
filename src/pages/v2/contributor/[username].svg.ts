import type { APIContext, EndpointOutput } from 'astro';
import { contributors } from '../../../util/getContributors';

export function getStaticPaths() {
	return contributors.map(({ username }) => ({ params: { username } }));
}

const icons = {
	commits: '',
	issues: `<path d="M6 7.125a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"/>
    <path d="M6 0a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm-4.875 6a4.875 4.875 0 1 0 9.75 0 4.875 4.875 0 0 0-9.75 0Z"/>`,
	pulls:
		'<path d="M4.088 4.865a3.187 3.187 0 0 0 2.85 1.76h1.033a1.688 1.688 0 1 1 0 1.125h-1.034a4.302 4.302 0 0 1-3.187-1.408v2.629a1.688 1.688 0 1 1-1.125 0v-3.942a1.687 1.687 0 1 1 1.463-.163Zm-.9 6.26a.563.563 0 1 0 0-1.125.563.563 0 0 0 0 1.125Zm6.374-3.375a.563.563 0 1 0 0-1.125.563.563 0 0 0 0 1.125Zm-5.812-4.313a.563.563 0 1 0 0 .004v-.004Z"/>',
	reviews:
		'<path d="M 1.313 1.5 h 9.374 c 0.725 0 1.313 0.588 1.313 1.312 v 6.376 a 1.314 1.314 0 0 1 -1.313 1.312 h -4.641 l -1.93 1.93 a 1.097 1.097 0 0 1 -1.19 0.235 a 1.09 1.09 0 0 1 -0.676 -1.008 v -1.157 h -0.938 a 1.313 1.313 0 0 1 -1.312 -1.312 v -6.376 c 0 -0.724 0.588 -1.312 1.313 -1.312 z m -0.188 1.312 v 6.376 c 0 0.103 0.084 0.187 0.188 0.187 h 1.5 a 0.56 0.56 0 0 1 0.562 0.563 v 1.642 l 2.04 -2.04 a 0.561 0.561 0 0 1 0.398 -0.165 h 4.875 a 0.188 0.188 0 0 0 0.187 -0.187 v -6.376 a 0.187 0.187 0 0 0 -0.188 -0.187 h -9.375 a 0.188 0.188 0 0 0 -0.187 0.187 z m 3.96 1.29 a 0.565 0.565 0 0 1 0 0.796 l -1.103 1.102 l 1.103 1.103 a 0.56 0.56 0 0 1 -0.402 0.945 a 0.558 0.558 0 0 1 -0.393 -0.151 l -1.5 -1.499 a 0.565 0.565 0 0 1 0 -0.796 l 1.5 -1.5 a 0.563 0.563 0 0 1 0.795 0 z m 1.83 0 a 0.563 0.563 0 0 1 0.795 0 l 1.5 1.5 a 0.565 0.565 0 0 1 0 0.796 l -1.5 1.499 a 0.56 0.56 0 0 1 -0.795 -0.794 l 1.102 -1.103 l -1.102 -1.102 a 0.565 0.565 0 0 1 0 -0.796 z"/>',
};

const Stat = (
	{ count, type }: { count: string; type: keyof typeof icons },
	i: number
) => `<svg x="11" y="${39 + i * 30}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
${icons[type]}
</svg>
<text font-weight="500" font-size="8.5" x="17" y="${
	61 + i * 30
}" text-anchor="middle">${count}</text>`;

const Achievement = (
	{ achievements }: { achievements: { title: string; details: string }[] },
	i: number
) =>
	`<text x="41" y="${41 + i * 17.5}"><tspan font-weight="500">${
		achievements[0].title
	}</tspan> <tspan dx="2" fill="#BFC1C9">${achievements[0].details}</tspan></text>`;

export async function get({ params }: APIContext): Promise<EndpointOutput> {
	const { username } = params;
	const { achievements, stats, getBase64Avatar } = contributors.find(
		(c) => c.username === username
	);
	const b64 = await getBase64Avatar();

	const body = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 260 156" width="260" font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'" direction="ltr">
  <!--solid backdrop-->
  <rect width="259" height="155" x=".5" y=".5" fill="#1A1B1E" rx="3.5"/>
  <!--gradient background-->
  <rect width="259" height="155" x=".5" y=".5" fill="url(#a)" fill-opacity=".5" rx="3.5"/>
  <!--left panel background-->
  <path fill="#17191E" fill-opacity=".5" d="M0 4a4 4 0 0 1 4-4h30v156H4a4 4 0 0 1-4-4V4Z"/>
  <!--gradient border-->
  <rect width="259" height="155" x=".5" y=".5" stroke="url(#a)" rx="3.5"/>
  <!--avatar image-->
  <image href="data:image/jpeg;base64,${b64}" x="5" y="8" width="24" height="24" clip-path="url(#avatar-clip)" />
  <!--avatar stroke-->
  <circle cx="17" cy="20" r="11.5" stroke="#17191E" stroke-opacity=".18"/>

  <!--Astro logo-->
  <path fill="#fff" d="M14.778 145.628c-.725-.661-.937-2.049-.635-3.055.524.634 1.25.835 2 .948 1.16.175 2.3.11 3.377-.419.123-.061.237-.141.372-.223.1.293.127.588.092.889-.086.732-.451 1.298-1.032 1.726-.233.172-.479.325-.718.487-.738.497-.937 1.079-.66 1.927l.027.092a1.935 1.935 0 0 1-.86-.735 2.06 2.06 0 0 1-.332-1.121c-.003-.198-.003-.397-.03-.592-.065-.475-.289-.688-.71-.7a.83.83 0 0 0-.865.674c-.007.032-.017.064-.027.101v.001Zm-4.136-3.223s2.146-1.042 4.298-1.042l1.622-5.009c.06-.242.238-.406.438-.406s.378.164.439.406l1.622 5.009c2.548 0 4.297 1.042 4.297 1.042l-3.652-9.924c-.104-.292-.28-.481-.519-.481h-4.373c-.239 0-.408.189-.52.481l-3.652 9.924Z"/>

  <g fill="white">
    ${stats.map(Stat).join('')}
    <g font-size="10">
      <text x="41" y="22" font-family="'IBM Plex Mono', monospace" font-size="13">@${username}</text>
      ${achievements.slice(0, 7).map(Achievement)}
    </g>
  </g>
  <defs>
    <clipPath id="avatar-clip"><circle cx="17" cy="20" r="12" /></clipPath>
    <linearGradient id="a" x1="0" x2="259.859" y1="156" y2="108.389" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3245FF"/>
      <stop offset="1" stop-color="#BC52EE"/>
    </linearGradient>
  </defs>
</svg>`;

	return { body };
}

export const head = get;
