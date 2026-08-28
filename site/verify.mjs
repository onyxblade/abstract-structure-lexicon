// Checks that the structure renderer understands every fenced block in
// ../entries, and reports what the lexicon currently looks like.
//
// The renderer classifies pseudo-code into typed nodes. If an entry uses
// notation it does not recognise, the text still survives but lands in a
// generic prose node — this catches the case where it does not survive at all,
// which would mean silently dropped content.
//
//   node verify.mjs        (npm run verify)

import { createServer } from 'vite';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ENTRIES = join(process.cwd(), '..', 'entries');
const INDEX = join(process.cwd(), '..', 'abstract-structure-lexicon.md');

const server = await createServer({
  configFile: false,
  logLevel: 'silent',
  server: { middlewareMode: true },
  appType: 'custom',
});
const { parseEntry } = await server.ssrLoadModule('/src/lib/parse.ts');
const { renderBlock, TENSION_LABELS } = await server.ssrLoadModule('/src/lib/structure.ts');
const { buildGraph } = await server.ssrLoadModule('/src/lib/graph.ts');
const { FAMILIES, DOMAIN_BUCKETS } = await server.ssrLoadModule('/src/lib/overlays.ts');

// Operators and whitespace are the renderer's job, so they are dropped before
// comparing. What is left must match exactly on both sides.
const norm = (s) => s.replace(/[\s→≠↔⇀、：=+]/g, '');

/** Every piece of text a node puts on the page, in order. */
function textOf(g) {
  switch (g.kind) {
    case 'sublabel': return [g.text];
    case 'vflow': return g.steps.map((s) => s.text);
    case 'chain': return g.nodes;
    case 'rows': return [g.head ?? '', ...g.rows.flat()];
    case 'poles': return g.poles.flat();
    case 'compare': return [g.a, g.b];
    case 'axis': return [g.a, g.b];
    case 'equation': return [g.text];
    case 'chips': return g.items;
    default: return [g.text];
  }
}

const files = readdirSync(ENTRIES).filter((f) => f.endsWith('.md')).sort();
const entries = files.map((f) => parseEntry(f, readFileSync(join(ENTRIES, f), 'utf8')));

const census = new Map();
const problems = [];
let blocks = 0;

for (const e of entries) {
  for (const s of e.sections) {
    const tension = TENSION_LABELS.includes(s.label);
    for (const b of s.blocks) {
      if (b.type !== 'code') continue;
      blocks++;
      const groups = renderBlock(b.lines, { tension });
      for (const g of groups) census.set(g.kind, (census.get(g.kind) ?? 0) + 1);

      const want = norm(b.lines.join(''));
      const got = norm(groups.flatMap(textOf).join(''));
      if (want !== got) {
        problems.push(`${e.name} · ${s.label}\n    source: ${want}\n    render: ${got}`);
      }
    }
  }
}

// --- report -----------------------------------------------------------------
const order = [...readFileSync(INDEX, 'utf8').matchAll(/^- \[([^\]]+)\]/gm)].map((m) => m[1]);
const unlisted = entries.filter((e) => !order.includes(e.name)).map((e) => e.name);
const missingFiles = order.filter((n) => !entries.some((e) => e.name === n));
const placed = new Set(FAMILIES.flatMap(([, ns]) => ns));
const unfamilied = entries.filter((e) => !placed.has(e.name)).map((e) => e.name);
const knownDomains = new Set(DOMAIN_BUCKETS.flatMap(([, ds]) => ds));
const rawDomains = new Set(entries.flatMap((e) => e.examples.map((x) => x.domain).filter(Boolean)));
const unbucketed = [...rawDomains].filter((d) => !knownDomains.has(d));
const noTension = entries.filter((e) => !e.body.some((s) => TENSION_LABELS.includes(s.label)));
const untagged = entries.filter((e) => e.examples.some((x) => !x.domain));
const graph = buildGraph(entries);

const line = (k, v) => console.log(`  ${String(k).padEnd(22)} ${v}`);
console.log(`\n${entries.length} entries · ${blocks} structure blocks\n`);
console.log('nodes rendered');
for (const [k, n] of [...census].sort((a, b) => b[1] - a[1])) line(k, n);
console.log('\nlexicon');
line('examples', entries.reduce((n, e) => n + e.examples.length, 0));
line('domain tags', rawDomains.size);
line('concept links', graph.shared.size);
line('entries with 核心張力', `${entries.length - noTension.length} / ${entries.length}`);

const warn = (label, list) => {
  if (list.length) console.log(`\n! ${label}\n    ${list.join('\n    ')}`);
};
warn('in the index but no file', missingFiles);
warn('files not listed in the index', unlisted);
warn('not in any family (src/lib/overlays.ts)', unfamilied);
warn('domain tags in no bucket (src/lib/overlays.ts)', unbucketed);
warn('no 核心張力 yet', noTension.map((e) => e.name));
warn('examples with no domain tag', untagged.map((e) => `${e.name} (${e.examples.filter((x) => !x.domain).length})`));

await server.close();

if (problems.length) {
  console.log(`\nFAIL — ${problems.length} block(s) did not survive rendering:\n  ${problems.join('\n  ')}\n`);
  process.exit(1);
}
console.log('\nok — every structure block rendered without losing text\n');
