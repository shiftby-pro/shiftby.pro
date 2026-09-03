import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://www.shiftby.pro',
  trailingSlash: 'always',
  integrations: [mdx()],
});
