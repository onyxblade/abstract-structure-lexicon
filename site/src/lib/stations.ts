// Turns an entry's sections into the spine the entry page walks through.
//
// parse.ts hands back sections in file order, which is the order they were
// written in, not the order they are best read in. Here they are placed into
// the fixed stations from overlays.ts so every entry unfolds the same way:
// what the structure is, what it costs, how to tell, what it is made of.

import type { Entry, Section } from './parse';
import { SECTION_ROLES, STATIONS, type Role } from './overlays';

export interface Placed {
  section: Section;
  role: Role;
  /** The entry's backbone. Rendered full width; everything else is compact. */
  lead: boolean;
}

export interface Station {
  key: string;
  name: string;
  hint: string;
  items: Placed[];
  /** Filled by this entry. Empty body stations still show up in the spine. */
  present: boolean;
  /** 1-based position among the stations this entry actually fills. */
  n: number;
}

/** An unmapped label is an aside, and `npm run verify` says so. */
export const roleOf = (label: string): Role => SECTION_ROLES[label] ?? 'aside';

/** 結構 and 核心張力 are what the entry is about; the rest qualifies them. */
const isLead = (role: Role) => role === 'mechanism' || role === 'tension';

export function stationsOf(entry: Entry): Station[] {
  const placed = entry.body.map((section) => {
    const role = roleOf(section.label);
    return { section, role, lead: isLead(role) };
  });

  let n = 0;
  return STATIONS.map(({ key, name, hint, roles }) => {
    const items = placed.filter((p) => roles.includes(p.role));
    // 例子 and 鄰接 carry no body sections but are always on the page.
    const present = roles.length === 0 || items.length > 0;
    return { key, name, hint, items, present, n: present ? ++n : 0 };
  });
}
