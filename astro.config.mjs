import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://cyril-jnr.vercel.app',

  // Astro ignores process.env.PORT on its own, so read it here — lets the
  // dev/preview server take an assigned port instead of always binding 4321.
  server: {
    port: Number(process.env.PORT) || 4321,
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  markdown: {
    syntaxHighlight: 'shiki',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx()],
});