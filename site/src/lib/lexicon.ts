// Loads ../entries through Astro's content layer and derives everything the
// pages need. Using a collection rather than plain fs reads is what makes the
// dev server notice when you edit an entry.

import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseEntry, haystack, type Entry } from './parse';
import { buildGraph, type Graph } from './graph';
import { buildLattice, type Lattice } from './lattice';
import { FAMILIES, DOMAIN_BUCKETS } from './overlays';

export interface Lexicon {
  entries: Entry[];
  byName: Map<string, Entry>;
  familyOf: Map<string, string>;
  bucketOf: Map<string, string>;
  graph: Graph;
  /** The trait table read as a lattice, one trait at a time. */
  lattice: Lattice;
  hay: Map<string, string>;
  counts: { entries: number; examples: number; links: number };
  /** Entry names present as files but absent from the index file. */
  unlisted: string[];
}

/** The index file decides the order entries appear in. */
function indexOrder(): string[] {
  const md = readFileSync(join(process.cwd(), '..', 'abstract-structure-lexicon.md'), 'utf8');
  return [...md.matchAll(/^- \[([^\]]+)\]/gm)].map((m) => m[1]);
}

// Memoised for the build, where every page asks for the same data. Never in
// dev: the cache would outlive an edit to ../entries and the page would go
// stale, which is the one thing the dev server is here to prevent.
let cached: Lexicon | null = null;
let warned = false;

export async function loadLexicon(): Promise<Lexicon> {
  if (cached && import.meta.env.PROD) return cached;

  const order = indexOrder();
  const raw = await getCollection('entries');

  const entries = raw
    .map((c) => parseEntry(`${c.id}.md`, c.body ?? ''))
    .filter((e) => e.name)
    .sort((a, b) => {
      const ia = order.indexOf(a.name);
      const ib = order.indexOf(b.name);
      return (ia < 0 ? 1e9 : ia) - (ib < 0 ? 1e9 : ib);
    });

  const graph = buildGraph(entries);
  const familyOf = new Map<string, string>();
  for (const [fam, names] of FAMILIES) for (const n of names) familyOf.set(n, fam);
  const bucketOf = new Map<string, string>();
  for (const [b, ds] of DOMAIN_BUCKETS) for (const d of ds) bucketOf.set(d, b);

  const lex: Lexicon = {
    entries,
    byName: new Map(entries.map((e) => [e.name, e])),
    familyOf,
    bucketOf,
    graph,
    lattice: buildLattice(entries),
    hay: new Map(entries.map((e) => [e.name, haystack(e)])),
    counts: {
      entries: entries.length,
      examples: entries.reduce((n, e) => n + e.examples.length, 0),
      links: graph.shared.size,
    },
    unlisted: entries.filter((e) => order.indexOf(e.name) < 0).map((e) => e.name),
  };

  if (lex.unlisted.length && !warned) {
    warned = true;
    console.warn(`[lexicon] not listed in abstract-structure-lexicon.md: ${lex.unlisted.join(', ')}`);
  }
  cached = lex;
  return lex;
}

/** Entries grouped the way the sidebar groups them, unlisted ones last. */
export function byFamily(lex: Lexicon): [string, Entry[]][] {
  const groups: [string, Entry[]][] = FAMILIES.map(([fam, names]) => [
    fam,
    names.map((n) => lex.byName.get(n)).filter((e): e is Entry => Boolean(e)),
  ]);
  const placed = new Set(groups.flatMap(([, es]) => es.map((e) => e.name)));
  const rest = lex.entries.filter((e) => !placed.has(e.name));
  if (rest.length) groups.push(['尚未分組', rest]);
  return groups.filter(([, es]) => es.length);
}

/** Every in-site link goes through here so the Pages base prefix is applied once. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const href = (path: string) => `${BASE}${path}`;

export const entryUrl = (name: string) => href(`/entries/${encodeURIComponent(name)}/`);

export const traitUrl = (id: string) => href(`/traits/${id}/`);

/** A place in the lattice. The root holds no trait, so it has no path segment. */
export const buildUrl = (id: string) => href(id ? `/build/${id}/` : '/build/');
