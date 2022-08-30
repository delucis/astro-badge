const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        neutral: colors.slate,
        primary: colors.purple,
        secondary: colors.orange,
        accent: colors.fuchsia,
        bronze: 'hsl(20, 30%, 55%)',
        silver: 'hsl(210, 6%, 72%)',
        gold: 'hsl(48, 100%, 50%)',
      },
    },
  },
  plugins: [
		require('@tailwindcss/typography'),
	],
};
