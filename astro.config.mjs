import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://shiftby-pro.vercel.app',
  trailingSlash: 'always',
  integrations: [mdx()],
});
