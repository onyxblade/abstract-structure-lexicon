// The structure-block grammar.
//
// Fenced blocks in the entries are informal pseudo-code built from a handful of
// operators. This file recognises them and returns typed nodes; the .astro
// components decide what each node looks like. Classification order matters and
// is checked against every block in the lexicon by `npm run verify`.
//
//   → leading a line     a step in a vertical flow
//   → inside a line      a chain, or an aligned term/value row
//   ：                    a labelled row
//   ≠                    two things being told apart
//   ↔                    an axis with two poles
//   =                    a formula
//   、                    a list of short items

export type Group =
  | { kind: 'sublabel'; text: string }
  | { kind: 'vflow'; steps: { connector: string; text: string }[] }
  | { kind: 'chain'; nodes: string[] }
  | { kind: 'rows'; op: string; head?: string; rows: [string, string][] }
  | { kind: 'poles'; poles: [string, string][] }
  | { kind: 'compare'; a: string; b: string }
  | { kind: 'axis'; a: string; b: string }
  | { kind: 'equation'; text: string }
  | { kind: 'chips'; items: string[] }
  | { kind: 'prose'; text: string };

export interface Ctx {
  /** Inside a 核心張力 section, a short row group is a set of opposing poles. */
  tension: boolean;
}

const LEAD = /^([→≠+↔⇀])\s+(.+)$/;
const ARROW = ' → ';
const LABEL_ONLY = /^([^：]{1,10})：$/;
const COLON_ROW = /^([^：]{1,20})：(.+)$/;

const isArrowRow = (l: string) => l.split(ARROW).length === 2;

/** Blank lines split a fenced block into independent groups. */
export function splitGroups(lines: string[]): string[][] {
  const out: string[][] = [];
  let g: string[] = [];
  for (const l of lines) {
    if (!l.trim()) {
      if (g.length) out.push(g);
      g = [];
    } else g.push(l.trim());
  }
  if (g.length) out.push(g);
  return out;
}

export function renderBlock(lines: string[], ctx: Ctx): Group[] {
  return splitGroups(lines).flatMap((g) => classifyGroup(g, ctx));
}

export function classifyGroup(input: string[], ctx: Ctx): Group[] {
  const out: Group[] = [];
  let lines = input;

  const lead = lines[0].match(LABEL_ONLY);
  if (lead && lines.length > 1) {
    out.push({ kind: 'sublabel', text: lead[1] });
    lines = lines.slice(1);
  }
  if (!lines.length) return out;

  // A vertical flow: connectors at the head of lines, none used inline.
  const hasLead = lines.some((l) => LEAD.test(l));
  const hasInline = lines.some((l) => !LEAD.test(l) && l.includes(ARROW));
  if (hasLead && !hasInline) return [...out, vflow(lines)];

  // Colon rows are checked before arrow rows so `錯誤建模：f: A → B` survives.
  if (lines.length >= 2 && lines.every((l) => COLON_ROW.test(l))) {
    return [...out, mkRows(lines.map(colonPair), '：', undefined, ctx)];
  }

  // Aligned rows, optionally introduced by one non-arrow head line.
  let head: string | undefined;
  let body = lines;
  if (
    lines.length >= 3 &&
    !lines[0].includes(ARROW) &&
    !LEAD.test(lines[0]) &&
    lines.slice(1).every(isArrowRow)
  ) {
    head = lines[0];
    body = lines.slice(1);
  }
  if (
    body.length >= 2 &&
    body.every(isArrowRow) &&
    Math.max(...body.map((l) => l.split(ARROW)[0].length)) <= 16
  ) {
    return [...out, mkRows(body.map(arrowPair), '→', head, ctx)];
  }

  if (lines.length >= 2 && lines.every((l) => l.includes(' = ') && !l.includes('→'))) {
    return [...out, mkRows(lines.map(equalsPair), '=', undefined, ctx)];
  }

  // Short bare terms with no operator: a set, not a sequence.
  if (lines.length >= 2 && lines.every((l) => !/[→≠=：]/.test(l) && l.length <= 16)) {
    return [...out, { kind: 'chips', items: lines }];
  }

  return [...out, ...lines.flatMap((l) => classifyLine(l, ctx))];
}

export function classifyLine(l: string, ctx: Ctx): Group[] {
  const label = l.match(LABEL_ONLY);
  if (label) return [{ kind: 'sublabel', text: label[1] }];
  if (LEAD.test(l)) return [vflow([l])];
  if (l.includes(' ↔ ')) {
    const [a, b] = l.split(' ↔ ');
    return [{ kind: 'axis', a, b }];
  }
  const colon = l.match(COLON_ROW);
  if (colon) return [mkRows([[colon[1], colon[2]]], '：', undefined, ctx)];
  if (l.includes(ARROW)) return [{ kind: 'chain', nodes: l.split(ARROW) }];
  if (l.includes(' ≠ ')) {
    const [a, b] = l.split(' ≠ ');
    return [{ kind: 'compare', a, b }];
  }
  if (l.includes(' = ')) return [{ kind: 'equation', text: l }];
  if (isChipLine(l)) return [{ kind: 'chips', items: l.split('、').map((s) => s.trim()) }];
  return [{ kind: 'prose', text: l }];
}

function vflow(lines: string[]): Group {
  return {
    kind: 'vflow',
    steps: lines.map((l) => {
      const m = l.match(LEAD);
      return { connector: m ? m[1] : '', text: m ? m[2] : l };
    }),
  };
}

function mkRows(rows: [string, string][], op: string, head: string | undefined, ctx: Ctx): Group {
  if (ctx.tension && rows.length >= 2 && rows.length <= 3) return { kind: 'poles', poles: rows };
  return { kind: 'rows', op, head, rows };
}

const colonPair = (l: string): [string, string] => {
  const m = l.match(COLON_ROW)!;
  return [m[1], m[2]];
};
const arrowPair = (l: string): [string, string] => {
  const [a, b] = l.split(ARROW);
  return [a, b];
};
const equalsPair = (l: string): [string, string] => {
  const i = l.indexOf(' = ');
  return [l.slice(0, i), l.slice(i + 3)];
};

function isChipLine(l: string): boolean {
  const segs = l.split('、');
  return segs.length >= 3 && segs.every((s) => s.length <= 8) && !/[→≠=：]/.test(l);
}

/** 核心張力 and 失配 get the two-pole treatment. */
export const TENSION_LABELS = ['核心張力', '失配'];
