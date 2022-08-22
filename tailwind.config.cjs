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
      },
    },
  },
  plugins: [
		require('@tailwindcss/typography'),
	],
};
