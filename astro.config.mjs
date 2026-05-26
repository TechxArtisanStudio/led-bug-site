// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { rehypeFigures } from './src/lib/rehype-figures.ts';
import { legacyRedirects } from './src/lib/legacy-redirects.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://led-bug.com',
  trailingSlash: 'ignore',
  redirects: legacyRedirects,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    rehypePlugins: [rehypeFigures],
  },
});