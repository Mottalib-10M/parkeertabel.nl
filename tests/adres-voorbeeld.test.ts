/**
 * L'adresse d'exemple de la recherche par adresse doit trouver une zone (testeurs naïfs du 2026-11-14, 3e tour :
 * « Oudegracht 1 Utrecht » tombait dans une ville sans carte, la première action proposée échouait).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import * as K from '../src/lib/engine/parking';
import { VOORBEELD, ZONDER_KAART } from '../src/lib/adres-voorbeeld';

const geo = (slug: string) => JSON.parse(readFileSync(`public/data/geo/${slug}.json`, 'utf8')) as Array<{ id: string; rings: number[][][] }>;

describe('adresse d\'exemple', () => {
  it('n\'est pas dans une ville sans carte', () => {
    expect(ZONDER_KAART).not.toContain(K.city(VOORBEELD.stad).n);
    expect(VOORBEELD.adres).not.toMatch(new RegExp(ZONDER_KAART.join('|')));
  });
  it('son point (relevé chez PDOK) tombe dans une zone de rue payante du registre', () => {
    const id = K.zoneAt(geo(VOORBEELD.stad), VOORBEELD.punt);
    expect(id).not.toBeNull();
    const z = K.city(VOORBEELD.stad).z.find((x) => x.i === id)!;
    expect(z.k).toBe('straat');
    expect(z.w.length).toBeGreaterThan(0);
  });
  it('PDOK la géocode vers une zone (si le réseau répond)', async () => {
    let d: { gemeentenaam?: string; centroide_ll?: string } | undefined;
    try {
      const u = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?rows=1&fq=type:adres&q=${encodeURIComponent(VOORBEELD.adres)}`;
      const r = await fetch(u, { signal: AbortSignal.timeout(8000) });
      d = (await r.json())?.response?.docs?.[0];
    } catch { return; /* hors ligne : le test du point enregistré suffit */ }
    expect(d, 'adresse inconnue de PDOK').toBeTruthy();
    expect(d!.gemeentenaam).toBe(K.city(VOORBEELD.stad).n);
    const m = /POINT\(([-\d.]+) ([-\d.]+)\)/.exec(d!.centroide_ll ?? '')!;
    expect(K.zoneAt(geo(VOORBEELD.stad), [Number(m[1]), Number(m[2])])).not.toBeNull();
  }, 15000);
  it('le composant affiche cette adresse et plus « Oudegracht »', () => {
    const src = readFileSync('src/components/calc/AdresZoeker.tsx', 'utf8');
    expect(src).toContain('placeholder={VOORBEELD.adres}');
    expect(src).not.toMatch(/Oudegracht/);
  });
});
