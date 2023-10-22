import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import { getSvg, type Context } from './[username].svg';
export { getStaticPaths } from './[username].svg';

export const GET: APIRoute = async function GET(ctx: Context) {
  const svg = await getSvg(ctx);
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'zoom', value: 1200 / 260 },
    font: {
      loadSystemFonts: false,
      fontDirs: ['./src/fonts'],
      defaultFontFamily: 'Inter Tight',
      monospaceFamily: 'IBM Plex Mono',
    },
  });
  return new Response(resvg.render().asPng(), { headers: { 'Content-Type': 'image/png' } });
};
