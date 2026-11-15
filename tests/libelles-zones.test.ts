/** Testeurs naïfs 2026-11-14 (5e tour) : aucun libellé de zone affiché ne montre un code brut du registre
 *  (« Zuid Pijp (10c max 60 po 60) », « Tariefzone 1, T11V », « Gebied B », « Wijk C. »). Seule la petite mention
 *  « registercode … » de la liste des zones peut porter un code. */
import { describe, it, expect } from 'vitest';
import * as K from '../src/lib/engine/parking';
import { getTool, runTool, zoneWords as zw, placeName } from '../src/lib/tool-specs';
import { optsOf, type SelectIn } from '../src/lib/tool-types';

const RAW = /max\.? ?\d+ (?:po|PO) \d+|\bT1\d[A-Z]?\b|\bT1\d[A-Z]_[A-Z]\d+|Tariefzone \d|Tariefcode \d|\bGebied [A-Z]\b|\bWijk [A-Z]\.|\bWijk \d+ |\b\d+c (?:max|[A-Z])|\bZONE_|\bZN_|Gebiedscode|\b[A-Z][a-z]+\d+\b/;
const clean = (s: string) => s.replace(/registercode \S+/g, '');
const bad = (xs: string[]) => xs.map(clean).filter((x) => RAW.test(x));

describe('libellés de zone sans code brut', () => {
  it('le motif reconnaît les codes relevés par les testeurs', () => {
    for (const x of ['Zuid Pijp (10c max 60 po 60)', 'Tariefzone 1, T11V', 'Straatparkeren Gebied B - Paardenmarkt', 'Wijk C.', 'Wijk 11 Binnenstad', 'Centrum1'])
      expect(RAW.test(x), x).toBe(true);
    expect(RAW.test(clean('Zuid Pijp · € 6,98 per uur · registercode T12A_U21'))).toBe(false);
  });
  it('les exemples des testeurs se lisent', () => {
    const a = K.city('amsterdam'), u = K.city('utrecht'), d = K.city('delft');
    const zoneWords = (...x: Parameters<typeof zw>) => zw(...x).replace(/[\u00a0\u202f]/g, ' ');
    expect(zoneWords(a, K.zone(a, 'T11V'), 'nl')).toBe('Grachtengordel-West en omgeving (€ 8,05 per uur)');
    expect(zoneWords(a, K.zone(a, 'T12A_U25'), 'nl')).toMatch(/^Zuid Pijp \(€ 0,10 tot € 6,98 per uur, op sommige tijden hooguit 1 u/);
    expect(zoneWords(u, K.zone(u, '1100'), 'nl')).toBe('zone met € 8,01 per uur');
    expect(placeName(d, K.zone(d, 'B-PM'), 'nl')).toBe('Binnenstad, Paardenmarkt');
  });
  it('zoneWords et placeName, toutes les zones, nl et en', () => {
    const out: string[] = [];
    for (const c of K.CITIES) for (const z of c.z) for (const l of ['nl', 'en'] as const)
      out.push(zw(c, z, l), zw(c, z, l, false), placeName(c, z, l));
    expect(bad(out)).toEqual([]);
  });
  it('listes de zones et résultats des rekenhulpen, toutes les villes et toutes les zones', () => {
    const out: string[] = [];
    for (const kind of ['kosten', 'gratis', 'dagkaart', 'naheffing']) for (const l of ['nl', 'en'] as const) {
      const sel = getTool(kind, l).inputs.find((i) => i.id === 'zone') as SelectIn;
      for (const c of K.CITIES) {
        const opts = optsOf(sel, { stad: c.s });
        out.push(...opts.map((o) => o.label));
        // Une zone sur trois suffit en anglais (mêmes noms) ; toutes en néerlandais.
        for (const [i, o] of opts.entries()) if (l === 'nl' || i % 3 === 0) out.push(JSON.stringify(runTool(kind, l, undefined, { stad: c.s, zone: o.value })));
      }
    }
    expect(bad(out)).toEqual([]);
  });
});
