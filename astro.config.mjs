import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://portfolio-screeching.brimble.app',

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