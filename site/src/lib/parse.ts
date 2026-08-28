// Parses one entry file into sections and blocks.
//
// The entry format is not standard Markdown structure: a top-level `標籤：`
// line opens a section, fenced blocks belong to whichever section is open, and
// blank lines inside a fence are significant (they separate structure groups).
// Everything below preserves that.

export type Block =
  | { type: 'code'; lines: string[] }
  | { type: 'list'; items: string[] }
  | { type: 'text'; text: string };

export interface Section {
  label: string;
  inline: string;
  blocks: Block[];
}

export interface Example {
  domain: string | null;
  text: string;
}

export interface Entry {
  /** File name inside ../entries, e.g. 同步張力.md */
  file: string;
  name: string;
  oneLine: string;
  status: string;
  concepts: string[];
  examples: Example[];
  /** Sections other than the four template fields — the entry's own thinking. */
  body: Section[];
  /** Every section, in file order, including the template fields. */
  sections: Section[];
}

/** Template fields, pulled out and rendered on their own. */
export const META_LABELS = ['一句話', '例子', '相近概念', '狀態'];

/** A section label opens a section: short, no leading dash, ends in a full-width colon. */
const SECTION_LINE = /^([^：\-].{0,13}?)：(.*)$/;

export function parseEntry(file: string, md: string): Entry {
  const lines = md.split('\n');
  const name = (lines[0] ?? '').replace(/^#+\s*/, '').trim();
  const sections: Section[] = [];
  let cur: Section | null = null;
  let inFence = false;
  let buf: string[] = [];

  for (const raw of lines.slice(1)) {
    const line = raw.replace(/\s+$/, '');

    if (line.trimStart().startsWith('```')) {
      if (!inFence) {
        inFence = true;
        buf = [];
      } else {
        inFence = false;
        if (cur) cur.blocks.push({ type: 'code', lines: buf });
      }
      continue;
    }
    if (inFence) {
      buf.push(line); // blank lines matter in here
      continue;
    }
    if (!line.trim()) continue;

    const m = line.match(SECTION_LINE);
    if (m) {
      cur = { label: m[1].trim(), inline: m[2].trim(), blocks: [] };
      sections.push(cur);
      continue;
    }
    if (!cur) continue;

    if (line.startsWith('- ')) {
      const last = cur.blocks[cur.blocks.length - 1];
      if (last && last.type === 'list') last.items.push(line.slice(2).trim());
      else cur.blocks.push({ type: 'list', items: [line.slice(2).trim()] });
    } else {
      cur.blocks.push({ type: 'text', text: line.trim() });
    }
  }

  const get = (label: string) => sections.find((s) => s.label === label);

  return {
    file,
    name,
    oneLine: get('一句話')?.inline ?? '',
    status: get('狀態')?.inline ?? '',
    concepts: (get('相近概念')?.inline ?? '')
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean),
    examples: (
      get('例子')?.blocks.find((b): b is Extract<Block, { type: 'list' }> => b.type === 'list')
        ?.items ?? []
    ).map(splitExample),
    body: sections.filter((s) => !META_LABELS.includes(s.label)),
    sections,
  };
}

/** `動物：過去被捕獵 → 怕人` splits into a domain tag and the example itself. */
export function splitExample(s: string): Example {
  const i = s.indexOf('：');
  const head = s.slice(0, i);
  if (i > 0 && i <= 24 && !/[，。；]/.test(head)) {
    return { domain: head.trim(), text: s.slice(i + 1).trim() };
  }
  return { domain: null, text: s.trim() };
}

/** Everything an entry can be searched by, flattened and lowercased. */
export function haystack(e: Entry): string {
  const parts: string[] = [
    e.name,
    e.oneLine,
    e.status,
    e.concepts.join(' '),
    e.examples.map((x) => (x.domain ?? '') + x.text).join(' '),
  ];
  for (const s of e.body) {
    parts.push(s.label, s.inline);
    for (const b of s.blocks) {
      if (b.type === 'code') parts.push(b.lines.join(' '));
      else if (b.type === 'list') parts.push(b.items.join(' '));
      else parts.push(b.text);
    }
  }
  return parts.join(' ').toLowerCase();
}
