import db from '@astrojs/db';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import webVitals from '@astrojs/web-vitals';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: process.env.VERCEL_ENV === 'production' ? 'https://astro.badg.es/' : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/` : 'http://localhost:4321/',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    db(),
    webVitals(),
  ],
  vite: {
    ssr: { external: ['@resvg/resvg-js'] },
    optimizeDeps: { exclude: ['@resvg/resvg-js'] },
    build: { rollupOptions: { external: ["@resvg/resvg-js"] } },
    // Expose Vercel’s analytics ID to client-side scripts.
    define: {
      'import.meta.env.PUBLIC_VERCEL_ANALYTICS_ID':
        JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
    },
  }
});