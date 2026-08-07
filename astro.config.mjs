import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'http://localhost:3000',
  markdown: {
    syntaxHighlight: 'shiki',
  },
  vite: {
    plugins: [tailwindcss()],    
  },
});
