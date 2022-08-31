# Astro Badges

[![Built with Astro](https://astro.badg.es/v1/built-with-astro.svg)](https://astro.build)

This project aims to celebrate the contributions of the [Astro](https://astro.build/) community.

Get badges to show off on your sites and READMEs!  
👉 **<https://astro.badg.es>** 👈

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command        | Action                                       |
| :------------- | :------------------------------------------- |
| `pnpm i`       | Installs dependencies                        |
| `pnpm start`   | Starts local dev server at `localhost:3000`  |
| `pnpm build`   | Build your production site to `./dist/`      |
| `pnpm preview` | Preview your build locally, before deploying |

### Data collection

This project uses the GitHub REST API to gather public data about contributions to [the `withastro` org](https://github.com/withastro/). Data collection is run once per day in a GitHub action and automatically committed to this repository.

You can run `pnpm collect-stats` to run data collection locally (for example to test changes to the script), but should first ensure a `GITHUB_TOKEN` [environment variable](https://docs.astro.build/en/guides/environment-variables/) is set up, containing a GitHub personal access token.
