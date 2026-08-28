// @ts-check
import { defineConfig } from 'astro/config';

// The lexicon itself lives one level up in ../entries. This site is only a view
// of those files: nothing here is a source of truth.
export default defineConfig({
  // GitHub Pages serves a project site under /<repo>/, so every link has to
  // carry that prefix. `astro dev` uses the same base, which keeps local and
  // deployed URLs identical instead of only breaking in production.
  site: 'https://onyxblade.github.io',
  base: '/abstract-structure-lexicon',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
