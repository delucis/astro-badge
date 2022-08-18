import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: process.env.URL || 'https://localhost:3000/',
});
