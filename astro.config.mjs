import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://bytesbourbonbbq.com',
  integrations: [mdx(), tailwind()],
  output: 'static'
});
