// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO(client): replace with the real domain once bought.
export default defineConfig({
  site: 'https://majorgayrimenkul.com',
  output: 'static',
  // One inline <style> instead of a render-blocking request: the hero text is the LCP element.
  build: { inlineStylesheets: 'always' },
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap({ i18n: { defaultLocale: 'tr', locales: { tr: 'tr-TR', en: 'en-US' } } })],
  vite: { plugins: [tailwindcss()] },
});
