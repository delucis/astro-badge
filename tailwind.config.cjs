// @ts-check
// @ts-expect-error: no type defs yet
const config = require('@astrojs/site-kit/tailwind');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  theme: {
    ...config.theme,
    extend: {
      ...config.theme.extend,
      colors: {
        ...config.theme.extend.colors,
        neutral: config.theme.extend.colors['astro-gray'],
        primary: colors.purple,
        secondary: colors.orange,
        accent: colors.fuchsia,
        bronze: 'hsl(20, 30%, 55%)',
        silver: 'hsl(210, 6%, 72%)',
        gold: 'hsl(48, 100%, 50%)',
      },
      fontFamily: {
        ...config.theme.extend.fontFamily,
        sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            h1: {
              fontFamily: theme('fontFamily.obviously'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), ...config.plugins],
};
