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

// --- the teaching order ------------------------------------------------------
//
// Which traits can be taught before which. This is `needs` in overlays.ts read
// as a graph, and it is a different order from the lattice: the lattice ranks
// by which entries a trait picks out, this ranks by what you have to already
// hold to understand it at all.

const DEPTH = (() => {
  // Relaxation rather than recursion, because a cycle in `needs` would hang a
  // naive walk and complaining about one is verify's job, not this file's.
  // A trait inside a cycle simply never gets a depth.
  const d = new Map<TraitId, number>();
  for (let pass = 0; pass < TRAITS.length; pass++) {
    for (const t of TRAITS) {
      const seen = t.needs.map((n) => d.get(n));
      if (seen.every((x) => x !== undefined)) {
        d.set(t.id, seen.length ? Math.max(...(seen as number[])) + 1 : 0);
      }
    }
  }
  return d;
})();

/** How many layers down a trait sits. 0 needs nothing before it. */
export const depthOf = (id: TraitId) => DEPTH.get(id);

export const traitById = (id: TraitId) => TRAITS.find((t) => t.id === id);
export const needsOf = (t: TraitDef) => TRAITS.filter((x) => t.needs.includes(x.id));
/** Traits that name this one as a prerequisite. */
export const buildsOn = (id: TraitId) => TRAITS.filter((x) => x.needs.includes(id));

/** Everything to hold before this trait, transitively. */
export function beforeOf(id: TraitId): TraitDef[] {
  const out = new Set<TraitId>();
  const walk = (x: TraitId) => {
    for (const n of traitById(x)?.needs ?? []) {
      if (out.has(n)) continue;
      out.add(n);
      walk(n);
    }
  };
  walk(id);
  return TRAITS.filter((t) => out.has(t.id));
}

/** The traits in teaching order, grouped by layer. */
export function levels(): { n: number; traits: TraitDef[] }[] {
  const deepest = Math.max(...TRAITS.map((t) => depthOf(t.id) ?? -1));
  const rows = [];
  for (let n = 0; n <= deepest; n++) {
    const traits = TRAITS.filter((t) => depthOf(t.id) === n);
    if (traits.length) rows.push({ n, traits });
  }
  return rows;
}

/** Traits a cycle in `needs` left without a layer. Should always be empty. */
export const stranded = () => TRAITS.filter((t) => depthOf(t.id) === undefined);

/** Flat teaching order, shallowest first, for prev/next on a trait page. */
export const taught = () => levels().flatMap((l) => l.traits);
