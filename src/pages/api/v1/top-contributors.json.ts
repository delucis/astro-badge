import type { APIRoute } from 'astro';
import { contributors } from '../../../util/getContributors';

/**
 * Generate a JSON file with a list of the top 50 contributors.
 *
 * Returns a response like:
 * ```json
 * {
 *  data: [
 *    {
 *      "username": "matthewp",
 *      "avatar_url":"https://avatars.githubusercontent.com/u/361671?v=4"
 *    },
 *    {
 *      "username": "natemoo-re",
 *      "avatar_url":"https://avatars.githubusercontent.com/u/7118177?v=4"
 *    }
 *  ]
 * }
 * ```
 */
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      data: contributors.slice(0, 50).map(({ username, avatar_url }) => ({ username, avatar_url })),
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
