import type { APIRoute } from 'astro';
import { loadLexicon } from '../lib/lexicon';

// Fetched on the first keystroke, not shipped with every page.
export const GET: APIRoute = async () => {
  const lex = await loadLexicon();
  return new Response(JSON.stringify(Object.fromEntries(lex.hay)), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
