// @ts-check
import config from '@astrojs/site-kit/tailwind-preset';
import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [config],
  theme: {
    extend: {
      screens: {
        xs: '320px',
      },
      colors: {
        neutral: config.theme.extend.colors['astro-gray'],
        accent: colors.fuchsia,
        bronze: '#FF9E58',
        silver: '#BFC1C9',
        gold: '#FFCA58',
      },
      fontFamily: {
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
};
