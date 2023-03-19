import type { APIContext, EndpointOutput } from 'astro';
import { contributors } from "../../../util/getContributors";
import satori from 'satori';
import { html as toReactElement } from 'satori-html';

export function getStaticPaths() {
  return contributors.map(({ username }) => ({ params: { username } }));
}

const fontFile = await fetch(
  'https://og-playground.vercel.app/inter-latin-ext-700-normal.woff'
);
const fontData: ArrayBuffer = await fontFile.arrayBuffer();

const icons = {
  issues:
    '<svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="65" height="65"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path></svg>',
  pulls:
    '<svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="65" height="65"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg>',
  reviews:
    '<svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="65" height="65"><path d="M1.75 1h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 13H8.061l-2.574 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25v-8.5C0 1.784.784 1 1.75 1ZM1.5 2.75v8.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25Zm5.28 1.72a.75.75 0 0 1 0 1.06L5.31 7l1.47 1.47a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-2-2a.75.75 0 0 1 0-1.06l2-2a.75.75 0 0 1 1.06 0Zm2.44 0a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L10.69 7 9.22 5.53a.75.75 0 0 1 0-1.06Z"></path></svg>'
};

const Achievement = ({ achievements }: { achievements: { title: string; details: string }[] }, i: number) =>
`<li style="display: flex; align-items: center;"><span style="font-size: 58px;">${achievements[0].title}</span><span style="font-size: 32px;">- ${achievements[0].details}</span></li>`

const AstroLogo = `<svg fill="none" viewBox="0 0 1281 1280" x="5" y="160" width="30" height="30">
<path fill="#fff" fill-rule="evenodd" d="M816 95c10 12 15 28 25 61l216 711c-80-42-167-72-259-88L657 303a18 18 0 0 0-35 0L483 779c-93 16-180 46-260 88l217-712c10-32 15-48 25-60 8-11 20-19 32-24 15-6 32-6 66-6h155c34 0 51 0 65 6 13 5 24 13 33 24Z" clip-rule="evenodd"/>
<path fill="#FF5D01" fill-rule="evenodd" d="M842 901c-36 30-107 51-189 51-101 0-185-31-208-73-8 24-10 51-10 69 0 0-5 87 56 147 0-31 25-57 56-57 54 0 54 47 54 85v4c0 57 35 107 85 128-7-16-11-33-11-51 0-55 32-76 69-100 30-19 64-40 86-82a155 155 0 0 0 12-121Z" clip-rule="evenodd"/>
</svg>`

const height = 800;
const width = 1200;

export async function get({ params }: APIContext): Promise<EndpointOutput> {
  const { username } = params;
  const { achievements, stats, avatar_url } = contributors.find((c) => c.username === username);

  const getStatistics = () => {
    try {
      return {
        issues: stats.findIndex((stat) => stat.type === 'issues') >= 0 ? stats[stats.findIndex((stat) => stat.type === 'issues')].count : '0',
        pulls: stats.findIndex((stat) => stat.type === 'pulls') >= 0 ? stats[stats.findIndex((stat) => stat.type === 'pulls')].count : '0',
        reviews: stats.findIndex((stat) => stat.type === 'reviews') >= 0 ? stats[stats.findIndex((stat) => stat.type === 'reviews')].count : 0,
      };
    } catch (e) {
      console.log(stats);
    }
  }
  const statistics = getStatistics();

  const html = toReactElement(`
    <div style="background-color: blue; display: flex; height: 100%; width: 100%; border-radius: 1.5rem;">
      <div style="background-color: black; display: flex; flex-direction: column; gap: 32px; align-items: center; justify-items: space-between; height: 100%; width: 15%; border-radius: 9999px">
        <img src="${avatar_url}" width="135px" height="135px" style="border: 5px solid purple; border-radius: 9999px;" />
        <div style="display: flex; flex-direction: column; align-items: center;">
          ${icons.issues}
          <span style="font-size: 48px; color: white;">${statistics.issues}</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center">
          ${icons.pulls}
          <span style="font-size: 48px; color: white;">${statistics.pulls}</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center">
          ${icons.reviews}
          <span style="font-size: 48px; color: white;">${statistics.reviews}</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; height: 100%; width: 85%; background-color: green; padding: 38px 24px">
        <span style="color: white; font-size: 56px; font-weight: 600;">@${username}</span>
        <ul style="padding: 24px 0; display: flex; flex-direction: column; margin: 0; gap: 0.25rem">${achievements.slice(0,7).map(Achievement).join('')}</ul>
      </div>
    </div>
  `);

  const svg = await satori(html, {
    fonts: [
      {
        name: 'Inter Latin',
        data: fontData,
        style: 'normal',
      },
    ],
    height,
    width,
  });

  return { body: svg };
}

export const head = get;
