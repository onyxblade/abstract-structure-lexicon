import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Points at the real lexicon, outside this site directory. Editing any file in
// ../entries is picked up by the dev server without touching anything in here.
const entries = defineCollection({
  loader: glob({ pattern: '*.md', base: '../entries' }),
});

export const collections = { entries };
