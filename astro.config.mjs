import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://thestackmint.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  output: 'static',
  build: {
    assets: '_assets',
  },
});
