// The concept lattice.
//
// /traits/ puts the whole entry × trait table on one screen. That is the right
// shape for a reference and the wrong shape for reading: seventeen rows and ten
// columns arrive at once and nothing is first. This file builds the other view
// of the same table. Start holding no trait, with all the entries in front of
// you; add one trait; watch the set shrink. Each step shows one new thing.
//
// Formally this is Formal Concept Analysis over ENTRY_TRAITS. A node is a
// *formal concept*: a pair (entries, traits) where the traits are exactly those
// every one of those entries carries, and the entries are exactly those
// carrying every one of those traits. Any other trait set names the same
// entries as some concept does, just with a longer description, so the concepts
// are the only stable places to stand.
//
// The part worth having is that the lattice, not the author, decides how many
// choices a page may offer. The root offers seven of the ten traits, because
// 可逆, 多解讀器 and 全定義 have no entry that carries them alone: they can only
// be reached after the trait they always travel with.

import type { Entry } from './parse';
import { TRAITS, type TraitId } from './overlays';
import { carries, type TraitDef } from './traits';

/** One move along a covering edge: the traits it changes, and where it lands. */
export interface Step {
  to: string;
  /** Added when stepping down, removed when stepping up, in TRAITS order. */
  moved: TraitDef[];
  n: number;
}

export interface Node {
  /** Trait ids in TRAITS order joined by '-'. The root's id is empty. */
  id: string;
  intent: TraitDef[];
  extent: string[];
  /** One more trait. */
  down: Step[];
  /** One fewer. */
  up: Step[];
}

export interface Lattice {
  nodes: Node[];
  byId: Map<string, Node>;
  root: Node;
  /**
   * Traits no entry carries alone, and what comes with them. These are the
   * implications the table hides: every entry that can be undone also weighs
   * competing inputs, so 可逆 never arrives without 權重.
   */
  bundled: { trait: TraitDef; with: TraitDef[] }[];
}

const defsOf = (ids: TraitId[]) => TRAITS.filter((t) => ids.includes(t.id));
const key = (ids: TraitId[]) => ids.join('-');

export function buildLattice(entries: Entry[]): Lattice {
  const names = entries.map((e) => e.name);
  const extentOf = (ids: TraitId[]) => names.filter((n) => ids.every((id) => carries(n, id)));
  const intentOf = (ns: string[]) =>
    TRAITS.filter((t) => ns.every((n) => carries(n, t.id))).map((t) => t.id);

  // Grow down from the top, closing one more trait at a time. A concept with no
  // entries names nothing, so it never enters the map; that drops the formal
  // bottom, which would otherwise be a node listing all ten traits and nobody.
  const found = new Map<string, { intent: TraitId[]; extent: string[] }>();
  const queue = [{ intent: intentOf(names), extent: names }];
  while (queue.length) {
    const c = queue.pop()!;
    const k = key(c.intent);
    if (found.has(k)) continue;
    found.set(k, c);
    for (const t of TRAITS) {
      if (c.intent.includes(t.id)) continue;
      const extent = extentOf([...c.intent, t.id]);
      if (extent.length) queue.push({ intent: intentOf(extent), extent });
    }
  }

  const raw = [...found.values()].sort(
    (a, b) => b.extent.length - a.extent.length || a.intent.length - b.intent.length
  );
  const nodes: Node[] = raw.map((c) => ({
    id: key(c.intent),
    intent: defsOf(c.intent),
    extent: c.extent,
    down: [],
    up: [],
  }));
  const byId = new Map(nodes.map((n) => [n.id, n]));

  // b sits under a when it demands strictly more. Covering edges only: a step
  // that skips a node in between is two steps, and showing it as one would be
  // the pile this view exists to avoid.
  const under = (b: Node, a: Node) =>
    b.intent.length > a.intent.length && a.intent.every((t) => b.intent.includes(t));
  const rank = (t: TraitDef) => TRAITS.indexOf(t);
  const order = (x: Step, y: Step) => y.n - x.n || rank(x.moved[0]) - rank(y.moved[0]);

  for (const a of nodes) {
    const lower = nodes.filter((b) => under(b, a));
    for (const b of lower.filter((b) => !lower.some((m) => m !== b && under(b, m)))) {
      // The same trait set either way: added going down, dropped coming back up.
      const gap = b.intent.filter((t) => !a.intent.includes(t));
      a.down.push({ to: b.id, moved: gap, n: b.extent.length });
      b.up.push({ to: a.id, moved: gap, n: a.extent.length });
    }
  }
  for (const n of nodes) {
    n.down.sort(order);
    n.up.sort(order);
  }

  const bundled = TRAITS.map((t) => {
    const ext = extentOf([t.id]);
    return { trait: t, with: ext.length ? defsOf(intentOf(ext).filter((id) => id !== t.id)) : [] };
  }).filter((b) => b.with.length);

  return { nodes, byId, root: nodes[0], bundled };
}
