import { Resvg } from '@resvg/resvg-js';
import { getSvg, getStaticPaths } from './[username].svg';
import type { InferStaticAPIRoute } from '../../../types';
export { getStaticPaths } from './[username].svg';

export const GET: InferStaticAPIRoute<typeof getStaticPaths> = async function GET(ctx) {
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
