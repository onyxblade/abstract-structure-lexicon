// @ts-check
import { defineConfig } from 'astro/config';

// The lexicon itself lives one level up in ../entries. This site is only a view
// of those files: nothing here is a source of truth.
export default defineConfig({
  site: 'https://example.com',
  base: '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
