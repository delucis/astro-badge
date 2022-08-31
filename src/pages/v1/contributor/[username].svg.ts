import type { APIContext, EndpointOutput } from 'astro';
import sharp from 'sharp';
import { contributors } from "../../../util/getContributors";

export function getStaticPaths() {
  return contributors.map(({ username }) => ({ params: { username } }));
}

const icons = {
  commits:
    '<path fill-rule="evenodd" d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"></path>',
  issues:
    '<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path><path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path>',
  pulls:
    '<path fill-rule="evenodd" d="M5 3.254V3.25v.005a.75.75 0 110-.005v.004zm.45 1.9a2.25 2.25 0 10-1.95.218v5.256a2.25 2.25 0 101.5 0V7.123A5.735 5.735 0 009.25 9h1.378a2.251 2.251 0 100-1.5H9.25a4.25 4.25 0 01-3.8-2.346zM12.75 9a.75.75 0 100-1.5.75.75 0 000 1.5zm-8.5 4.5a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>',
  reviews:
    '<path fill-rule="evenodd" d="M1.5 2.8a.3.3 0 0 1 .3-.3h12.4a.3.3 0 0 1 .3.3v8.4a.3.3 0 0 1-.3.3H7.8a.8.8 0 0 0-.6.2l-2.7 2.7v-2.2a.8.8 0 0 0-.8-.7h-2a.3.3 0 0 1-.2-.3V2.8zM1.8 1A1.8 1.8 0 0 0 0 2.8v8.4c0 1 .8 1.8 1.8 1.8H3v1.5a1.5 1.5 0 0 0 2.5 1L8 13h6.2a1.8 1.8 0 0 0 1.7-1.8V2.8A1.8 1.8 0 0 0 14.2 1H1.8zm5 3.5a.8.8 0 0 1 0 1L5.3 7l1.5 1.5a.8.8 0 0 1-1 1l-2-2a.8.8 0 0 1 0-1l2-2a.8.8 0 0 1 1 0zm2.4 0a.8.8 0 0 0 0 1L10.7 7 9.2 8.5a.8.8 0 0 0 1 1l2-2a.8.8 0 0 0 0-1l-2-2a.8.8 0 0 0-1 0z"/>'
};

const SidebarBG = `<rect fill="#000" x="0" y="0" width="40" height="200" rx="19" ry="19" />`;

const Stat = ({ count, type }: { count: string; type: keyof typeof icons }, i: number) => `<svg x="13" y="${45 + i * 38}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="14" height="14">
${icons[type]}
</svg>
<text font-weight="bold" font-size="11" x="20" y="${71 + i * 38}" text-anchor="middle">${count}</text>`

const Achievement = ({ achievements }: { achievements: { title: string; details: string }[] }, i: number) =>
`<text x="50" y="${50 + i * 22}">${achievements[0].title} <tspan font-size="12" fill="#bbb">${achievements[0].details}</tspan></text>`

const AstroLogo = `<svg fill="none" viewBox="0 0 1281 1280" x="5" y="160" width="30" height="30">
<path fill="#fff" fill-rule="evenodd" d="M816 95c10 12 15 28 25 61l216 711c-80-42-167-72-259-88L657 303a18 18 0 0 0-35 0L483 779c-93 16-180 46-260 88l217-712c10-32 15-48 25-60 8-11 20-19 32-24 15-6 32-6 66-6h155c34 0 51 0 65 6 13 5 24 13 33 24Z" clip-rule="evenodd"/>
<path fill="#FF5D01" fill-rule="evenodd" d="M842 901c-36 30-107 51-189 51-101 0-185-31-208-73-8 24-10 51-10 69 0 0-5 87 56 147 0-31 25-57 56-57 54 0 54 47 54 85v4c0 57 35 107 85 128-7-16-11-33-11-51 0-55 32-76 69-100 30-19 64-40 86-82a155 155 0 0 0 12-121Z" clip-rule="evenodd"/>
</svg>`

export async function get({ params }: APIContext): Promise<EndpointOutput> {
  const { username } = params;
  const { achievements, stats, avatar_url } = contributors.find((c) => c.username === username);
  const avatarRes = await fetch(avatar_url);
  const avatarBuffer = Buffer.from(await (await avatarRes.blob()).arrayBuffer());
  const b64 = (await sharp(avatarBuffer).resize(60, 60).toBuffer()).toString('base64');

  const body = `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 300 200" width="300" font-family="sans-serif" direction="ltr">
  <defs>
    <linearGradient id="a" x1="0" x2="0" y1="200%" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#602199"/>
      <stop offset="1" stop-color="rgb(15 23 42)"/>
    </linearGradient>
    <clipPath id="avatar-clip"><circle cx="20" cy="20" r="15" /></clipPath>
  </defs>

  <rect fill="url(#a)" x="0" y="0" width="300" height="200" rx="19" ry="19" />
  ${SidebarBG}

  <g fill="white">
    ${stats.map(Stat).join('')}
    <g font-size="14">
      <text x="50" y="26" font-weight="bold">@${username}</text>
      ${achievements.slice(0, 7).map(Achievement)}
    </g>
  </g>
  ${AstroLogo}
  <!-- User avatar -->
  <image href="data:image/jpeg;base64,${b64}" x="5" y="5" width="30" height="30" clip-path="url(#avatar-clip)" />
</svg>`;

  return { body };
}

export const head = get;
