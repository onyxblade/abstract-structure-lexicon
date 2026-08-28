// The trait layer.
//
// Entries relate to each other by sharing parts, not by descending from each
// other, so relatedness is computed as set overlap over the traits declared in
// overlays.ts. This replaces the older 相近概念 token overlap for the neighbour
// list: that one linked entries whenever two English tag phrases happened to
// contain the same word, which produced links nobody had decided on.

import type { Entry } from './parse';
import { TRAITS, ENTRY_TRAITS, type TraitId } from './overlays';

export type TraitDef = (typeof TRAITS)[number];

const idsOf = (name: string): TraitId[] => ENTRY_TRAITS[name] ?? [];

/** An entry's traits, always in TRAITS order, so two signatures line up. */
export function traitsOf(name: string): TraitDef[] {
  const have = new Set(idsOf(name));
  return TRAITS.filter((t) => have.has(t.id));
}

export const carries = (name: string, id: TraitId) => idsOf(name).includes(id);

export interface TraitRow extends TraitDef {
  /** Entries carrying this trait, in lexicon order. */
  entries: string[];
}

export function traitRows(entries: Entry[]): TraitRow[] {
  return TRAITS.map((t) => ({
    ...t,
    entries: entries.filter((e) => carries(e.name, t.id)).map((e) => e.name),
  }));
}

export interface Overlap {
  name: string;
  shared: TraitDef[];
}

/**
 * Entries built from the same parts, closest first. Ranked by how many traits
 * are shared, then by how much of the two signatures that covers, so a
 * two-trait entry matching two of two beats a four-trait entry matching two of
 * four. Entries with no shared trait are left out rather than padded in.
 */
export function neighboursOf(e: Entry, all: Entry[], limit = 4): Overlap[] {
  const mine = idsOf(e.name);
  if (!mine.length) return [];
  const set = new Set(mine);

  return all
    .filter((o) => o.name !== e.name)
    .map((o) => {
      const theirs = idsOf(o.name);
      const shared = theirs.filter((t) => set.has(t));
      return {
        name: o.name,
        shared: traitsOf(o.name).filter((t) => set.has(t.id)),
        n: shared.length,
        cover: shared.length / new Set([...mine, ...theirs]).size,
      };
    })
    .filter((r) => r.n > 0)
    .sort((a, b) => b.n - a.n || b.cover - a.cover)
    .slice(0, limit)
    .map(({ name, shared }) => ({ name, shared }));
}
