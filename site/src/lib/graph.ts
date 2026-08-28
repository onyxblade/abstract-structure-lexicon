// The concept graph.
//
// 相近概念 tags are multi-word English phrases, so exact matches between entries
// are rare. Tokenising to words instead turns a handful of coincidences into a
// usable graph, and the shared tokens double as the reason for each link.

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

export interface Related {
  name: string;
  why: string;
}

export function relatedTo(e: Entry, g: Graph, limit = 4): Related[] {
  const score = new Map<string, number>();
  const why = new Map<string, Set<string>>();
  for (const c of e.concepts) {
    for (const t of tokenise(c)) {
      if (!g.shared.has(t)) continue;
      for (const other of g.index.get(t)!) {
        if (other === e.name) continue;
        score.set(other, (score.get(other) ?? 0) + 1);
        if (!why.has(other)) why.set(other, new Set());
        why.get(other)!.add(t);
      }
    }
  }
  return [...score]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => ({ name, why: [...why.get(name)!].slice(0, 3).join(', ') }));
}

/** Does this tag participate in any link? Unlinked tags render as plain text. */
export const isLinked = (concept: string, g: Graph) =>
  tokenise(concept).some((t) => g.shared.has(t));
