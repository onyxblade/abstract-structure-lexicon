// The concept-tag graph.
//
// 相近概念 tags are multi-word English phrases, so exact matches between entries
// are rare. Tokenising to words instead tells us which tags are shared at all,
// which is what decides whether a tag renders as a link into search.
//
// This used to rank related entries too. It no longer does: two tags containing
// the same word is a coincidence, not a decision, so the neighbour list on an
// entry page is built from declared traits instead (src/lib/traits.ts).

import type { Entry } from './parse';
import { STOPWORDS } from './overlays';

const tokenise = (s: string) =>
  s
    .toLowerCase()
    .split(/[^a-z一-鿿]+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));

export interface Graph {
  /** token -> entry names carrying it */
  index: Map<string, Set<string>>;
  /** tokens carried by more than one entry */
  shared: Set<string>;
}

export function buildGraph(entries: Entry[]): Graph {
  const index = new Map<string, Set<string>>();
  for (const e of entries) {
    for (const c of e.concepts) {
      for (const t of tokenise(c)) {
        if (!index.has(t)) index.set(t, new Set());
        index.get(t)!.add(e.name);
      }
    }
  }
  const shared = new Set([...index].filter(([, s]) => s.size > 1).map(([t]) => t));
  return { index, shared };
}

/** Does this tag appear in another entry too? Unshared tags render as plain text. */
export const isLinked = (concept: string, g: Graph) =>
  tokenise(concept).some((t) => g.shared.has(t));
