/**
 * Cohérence texte / calcul (testeurs naïfs du 2026-11-14) : un chiffre écrit dans une page doit être celui que
 * la rekenhulp affiche, et les comptes (villes, zones, villes sous le maximum) viennent des données, jamais tapés.
 * Aucun nombre n'est figé ici : le registre est relu chaque semaine (scripts/update-data.sh).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import * as K from '../src/lib/engine/parking';
import { runTool, STEDEN, NAH_MAX, defaultZone, DAGKAART_DEF } from '../src/lib/tool-specs';
import { COVER, N_CITIES, N_ZONES } from '../src/lib/couverture';
import { pageById } from '../src/lib/pages';
import { helpers } from '../src/lib/helpers';
import { HOME } from '../src/content/home';
import { formatNumber, formatMoney } from '../src/lib/format';
import { delftBreakEven } from '../src/content/pages/dagkaart';
import { below } from '../src/content/pages/naheffing';

const page = (id: string) => pageById(id)!;
const minutes = (txt: string, re: RegExp) => { const m = re.exec(txt); if (!m) throw new Error(`pas de durée dans : ${txt}`); return Number(m[1]) * 60 + Number(m[2] ?? 0); };

describe('dagkaart : le chapeau et la rekenhulp donnent le même seuil', () => {
  it('page dagkaart = rekenhulp dagkaart (Delft, valeurs par défaut)', () => {
    const tool = runTool('dagkaart', 'nl', page('dagkaart').toolArg);
    const fromTool = minutes(tool.sub ?? '', /vanaf (\d+) u(?: (\d+))? parkeren/);
    const fromIntro = minutes(page('dagkaart').nl.intro, /vanaf (\d+) uur(?: en (\d+) minuten)? parkeren/);
    expect(fromIntro).toBe(fromTool);
    expect(delftBreakEven()).toBe(fromTool);
    const en = minutes(page('dagkaart').en.intro, /from (\d+) hours(?: and (\d+) minutes)? of parking/);
    expect(en).toBe(fromTool);
  });
  it('le chapeau nomme le jour et l\'heure d\'arrivée du calcul', () => {
    expect(page('dagkaart').nl.intro).toContain(`om ${String(DAGKAART_DEF.aankomst / 60).padStart(2, '0')}:00`);
  });
});

describe('une seule source pour le nombre de villes et de zones', () => {
  it('toutes les villes du registre sont dans la rekenhulp', () => {
    expect(COVER.length).toBe(K.CITIES.length);
    expect(N_ZONES).toBe(COVER.reduce((a, s) => a + K.streetZones(K.city(s)).length, 0));
  });
  it('accueil, gratis et dagkaart : un seul nombre de villes', () => {
    const nl = formatNumber(N_CITIES, 0, 'nl');
    const texts = [HOME.nl.description, HOME.nl.resume, ...['gratis', 'dagkaart'].flatMap((id) => { const p = page(id).nl; return [p.title, p.description, p.intro, p.resume, p.card ?? '', ...p.faqs.map((q) => q.a)]; })];
    for (const t of texts) for (const m of t.matchAll(/(\d+) steden/g)) expect(m[1], t).toBe(nl);
    const methode = readFileSync('src/pages/nl/methode.astro', 'utf8');
    expect(methode).toContain('formatNumber(N_CITIES');
    expect(methode).toContain('formatNumber(N_ZONES');
    expect(methode).not.toMatch(/CITY_INDEX\.cities\.(length|reduce)/);
    expect(HOME.nl.resume).toContain(`${formatNumber(N_CITIES, 0, 'nl')} steden en ${formatNumber(N_ZONES, 0, 'nl')} betaalde straatzones`);
    expect(HOME.nl.description).toContain(`${formatNumber(N_CITIES, 0, 'nl')} steden`);
  });
  it('aucun nombre de villes tapé à la main dans les sources de pages', () => {
    const dir = 'src/content/pages';
    for (const f of readdirSync(dir)) {
      const src = readFileSync(join(dir, f), 'utf8');
      expect(src, f).not.toMatch(/\b(16|24) (steden|cities)\b/);
    }
    expect(readFileSync('src/content/home.ts', 'utf8')).not.toMatch(/\b(16|24) (steden|cities)\b/);
  });
  it('le build, s\'il existe, ne contient qu\'un seul nombre de villes « op deze site »', () => {
    const f = 'dist/nl/methode/index.html';
    if (!existsSync(f)) return;
    expect(readFileSync(f, 'utf8').replace(/&nbsp;|&#160;|\u00a0|\u202f/g, ' ')).toContain(`${formatNumber(N_CITIES, 0, 'nl')} steden en ${formatNumber(N_ZONES, 0, 'nl')} betaalde straatzones`);
  });
});

describe('naheffing : maximum, total et villes moins chères', () => {
  it('les villes sous le maximum viennent des données, toutes nommées sur la carte et dans le texte', () => {
    const expected = Object.entries(STEDEN).filter(([, x]) => x.nah < NAH_MAX).map(([s]) => K.city(s).n).sort();
    expect(below.map((x) => x.n).sort()).toEqual(expected);
    const p = page('naheffing').nl;
    expect(p.card).toContain(`${formatNumber(expected.length, 0, 'nl')} van ${formatNumber(Object.keys(STEDEN).length, 0, 'nl')} steden rekenen minder`);
    for (const n of expected) expect(p.resume).toContain(n);
    expect(p.card).not.toMatch(/Breda en Eindhoven/);
  });
  it('total = kosten + 1 uur parkeergeld, et le maximum est dit « voor de kosten »', () => {
    const o = runTool('naheffing', 'nl', { stad: 'rotterdam' });
    const z = defaultZone(K.city('rotterdam'));
    expect(o.value).toBe(formatMoney(STEDEN.rotterdam.nah + z.h, 2, 'nl'));
    expect(o.sub).toContain(`= ${o.value}`);
    expect(o.sub).toMatch(/maximum .* geldt alleen voor de kosten/);
    expect(o.rows!.some(([k]) => /maximum voor de kosten/.test(k))).toBe(true);
  });
  it('plus de jargon « niet betaalde belasting » ni « Zone Zone »', () => {
    for (const s of COVER) for (const l of ['nl', 'en'] as const) {
      const o = JSON.stringify(runTool('naheffing', l, { stad: s }));
      expect(o).not.toMatch(/niet betaalde belasting|unpaid tax/);
      expect(o).not.toMatch(/\b[Zz]one Zone\b/);
    }
    expect(page('naheffing').nl.body(helpers('nl'))).not.toMatch(/niet betaalde belasting/);
  });
});

describe('rekenhulp kosten et vergunning : ce que dit chaque chiffre', () => {
  it('« Gratis parkeren » ne fait pas croire que le lendemain est gratuit toute la journée', () => {
    const o = runTool('kosten', 'nl', { stad: 'amsterdam' });
    const row = o.rows!.find(([k]) => k === 'Gratis parkeren')!;
    expect(row[1]).toMatch(/^24:00 tot woensdag \d\d:\d\d$/);
  });
  it('un ticket plus cher que le stationnement n\'est pas proposé', () => {
    const o = runTool('kosten', 'nl', { stad: 'amsterdam' });
    expect(o.rows!.some(([k]) => /Dagkaart of vast tarief|Goedkoper/.test(k))).toBe(false);
  });
  it('vergunning : le grand chiffre est le total sur les années demandées', () => {
    const o = runTool('vergunning', 'nl', { stad: 'utrecht' }, { jaren: 2 });
    expect(o.value).toBe(formatMoney(STEDEN.utrecht.verg.bedrag * 12 * 2, 2, 'nl'));
    expect(o.label).toContain('over 2 jaar');
    expect(o.note).toMatch(/Amsterdam/);
    expect(o.table).toBeUndefined();
  });
});
