/** Moteur de stationnement : cas tirés du registre NPR (lu le 2026-11-12) et vérifiés à la main sur les CSV. */
import { describe, it, expect } from 'vitest';
import * as K from '../src/lib/engine/parking';
import { runTool, defaultZone } from '../src/lib/tool-specs';
import { CITY_PAGES } from '../src/lib/planned';

describe('tarifs du registre', () => {
  it('Utrecht TAR01 : 0,1335 €/min = 8,01 €/h', () => expect(K.fareCost(K.city('utrecht').f['TAR01'], 60)).toBe(8.01));
  it('Amsterdam TC1 : 8,05 €/h, dagkaart 09-19 h 48,30 €', () => {
    const c = K.city('amsterdam');
    expect(K.hourly(c, 'TC1')).toBe(8.05);
    expect(K.zone(c, defaultZone(c).i).p.some((p) => p.a === 48.3)).toBe(true);
  });
  it('Rotterdam : 7,20 €/h en zone 10, 3,00 €/h ailleurs, payant mardi 09:00-23:00', () => {
    const c = K.city('rotterdam'), z = defaultZone(c);
    expect(z.h).toBe(7.2);
    expect(K.paidSpans(c, z, 2)).toEqual([[540, 1380, 7.2]]);
    expect(K.streetZones(c).some((x) => x.h === 3)).toBe(true);
  });
});
describe('calcul d\'un stationnement', () => {
  const c = K.city('amsterdam'), z = defaultZone(c);
  it('2 h un mardi à 10:00 dans la zone 1 = 2 × 8,05', () => expect(K.stay(c, z, 2, 600, 120).total).toBe(16.1));
  it('de 23:00 à 01:00 : seule la première heure est payante', () => { const r = K.stay(c, z, 2, 1380, 120); expect(r.paid).toBe(60); expect(r.total).toBe(8.05); });
  it('dimanche avant midi : gratuit', () => expect(K.stay(c, z, 7, 540, 120).total).toBe(0));
  it('prochaine minute gratuite après 10:00 un mardi = minuit', () => expect(K.nextFree(c, z, 2, 600)).toEqual([3, 0]));
  it('point dans un polygone', () => expect(K.inRing([0.5, 0.5], [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]])).toBe(true));
});
describe('outils', () => {
  for (const kind of ['kosten', 'gratis', 'dagkaart', 'vergunning', 'naheffing', 'pr']) for (const l of ['nl', 'en'] as const)
    it(`${kind} (${l}) rend un chiffre`, () => { const o = runTool(kind, l); expect(o.value).toMatch(/\d/); expect(JSON.stringify(o)).not.toMatch(/undefined|NaN/); });
  for (const s of CITY_PAGES) it(`kosten ${s} : zone par défaut payante`, () => expect(runTool('kosten', 'nl', { stad: s }).value).not.toBe('€ 0,00'));
});
