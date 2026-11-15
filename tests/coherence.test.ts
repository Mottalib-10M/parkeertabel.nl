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
    const tool = runTool('dagkaart', 'nl', page('dagkaart').toolArg, { zone: defaultZone(K.city('delft')).i });
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
    const z = defaultZone(K.city('rotterdam'));
    const o = runTool('naheffing', 'nl', { stad: 'rotterdam' }, { zone: z.i });
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
    const o = runTool('kosten', 'nl', { stad: 'amsterdam' }, { zone: defaultZone(K.city('amsterdam')).i });
    const row = o.rows!.find(([k]) => k === 'Gratis parkeren')!;
    expect(row[1]).toMatch(/^24:00 tot woensdag \d\d:\d\d$/);
  });
  it('un ticket plus cher que le stationnement n\'est pas proposé', () => {
    const o = runTool('kosten', 'nl', { stad: 'amsterdam' }, { zone: defaultZone(K.city('amsterdam')).i });
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

/* ------------------------------------------------------------------ 3e tour des testeurs (2026-11-14) */
import { DAGKAART_ROWS } from '../src/content/pages/dagkaart';
import { getTool, paidHoursText } from '../src/lib/tool-specs';
import { optsOf, type SelectIn } from '../src/lib/tool-types';

describe('dagkaart : jamais moins qu\'une heure ni plus que la journée payée à l\'heure, dans sa propre zone', () => {
  it('toute dagkaart gardée par le moteur est cohérente avec sa zone', () => {
    let n = 0;
    for (const c of K.CITIES) for (const z of c.z) for (const p of z.p) {
      if (!K.isDayTicket(p.l)) continue;
      const d = K.dayTicketDay(c, z, p.a);
      expect(d, `${c.n} ${z.i} ${p.l} ${p.a}`).not.toBeNull();
      expect(p.a).toBeGreaterThanOrEqual(K.dayHourly(c, z, d!) - 1e-9);
      expect(p.a).toBeLessThanOrEqual(K.fullDayCost(c, z, d!) + 1e-9);
      n++;
    }
    expect(n).toBeGreaterThan(100);
  });
  it('les dagkaarten incohérentes du registre ne sont pas montrées (Amsterdam T14_COMBI, Leiden € 28)', () => {
    expect(K.city('amsterdam').z.find((z) => z.i === 'T14_COMBI')?.p.some((p) => K.isDayTicket(p.l)) ?? false).toBe(false);
    // ZN_B2_8_P1 : dagkaart € 28, toute la journée payée à l'heure € 26,75.
    expect(K.city('leiden').z.find((z) => z.i === 'ZN_B2_8_P1')!.p.some((p) => K.isDayTicket(p.l))).toBe(false);
  });
  it('le tableau de la page compare chaque dagkaart à sa propre zone', () => {
    for (const x of DAGKAART_ROWS) if (x.day) {
      expect(x.day.a, x.n).toBeLessThanOrEqual(x.day.full + 1e-9);
      expect(x.day.a, x.n).toBeGreaterThanOrEqual(x.day.h - 1e-9);
    }
    const ams = DAGKAART_ROWS.find((x) => x.s === 'amsterdam')!;
    expect(ams.day!.a).toBe(8.05);
    expect(ams.day!.full).toBeGreaterThan(8.05);
  });
  it('le grand chiffre de la rekenhulp est un prix payé, pas « u bespaart »', () => {
    const o = runTool('dagkaart', 'nl', { stad: 'delft' }, { zone: defaultZone(K.city('delft')).i });
    expect(o.label).toMatch(/^Goedkoopst: /);
    expect(o.label).not.toMatch(/bespaart/);
    expect(o.sub).toMatch(/goedkoper dan/);
  });
});

describe('zone : pas de valeur par défaut, libellés lisibles', () => {
  for (const kind of ['kosten', 'gratis', 'dagkaart', 'naheffing']) it(`${kind} : aucune zone choisie d'avance`, () => {
    const spec = getTool(kind, 'nl');
    const zi = spec.inputs.find((i) => i.id === 'zone') as SelectIn;
    expect(zi.def).toBe('');
    const opts = optsOf(zi, Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])));
    expect(opts[0].value).toBe('');
    expect(opts[0].label).toMatch(/^Kies uw zone/);
    const o = runTool(kind, 'nl');
    expect(JSON.stringify(o)).not.toMatch(/undefined|NaN/);
    expect(o.sub ?? '').toMatch(/Kies hierboven uw zone/);
  });
  it('les libellés de zone n\'ont plus les heures abrégées et donnent le tarif', () => {
    const spec = getTool('kosten', 'nl');
    const opts = optsOf(spec.inputs.find((i) => i.id === 'zone') as SelectIn, { stad: 'amsterdam' });
    const t11a = opts.find((o) => o.value === 'T11A')!;
    // 5e tour : plus de « Tariefzone 1 (T11A) » ; le code ne reste qu'en mention « registercode ».
    expect(t11a.label).toBe(`Zone · ${formatMoney(8.05, 2, 'nl')} per uur · registercode T11A`);
    for (const o of opts) expect(o.label, o.label).not.toMatch(/\b(ma|di|wo|do|vr|za|zo)-(ma|di|wo|do|vr|za|zo)\s+\d/);
  });
  it('les heures payantes de la zone choisie sont dites en clair sous la liste', () => {
    const c = K.city('amsterdam'), z = defaultZone(c);
    expect(paidHoursText(c, z, 'nl')).toBe('Maandag tot en met zaterdag 09:00-24:00, zondag 12:00-24:00');
    const zi = getTool('kosten', 'nl').inputs.find((i) => i.id === 'zone') as SelectIn;
    expect(typeof zi.help === 'function' ? zi.help({ stad: 'amsterdam', zone: z.i }) : '').toContain('Maandag tot en met zaterdag 09:00-24:00');
  });
  it('sans zone, le coût est un montant (la zone la plus chère), la moins chère est nommée dessous (4e tour)', () => {
    const o = runTool('kosten', 'nl', { stad: 'amsterdam' });
    expect(o.value).not.toMatch(/tot/);
    expect(o.value).toBe(formatMoney(16.1, 2, 'nl'));
    expect(o.label).toMatch(/duurste zone/);
    expect(o.sub).toMatch(/goedkoopste betaalde zone, .+: €/);
    expect(o.sub).toMatch(/Kies hierboven uw zone/);
  });
  it('gratis : la ligne de comparaison suit le jour et l\'heure choisis', () => {
    const o = runTool('gratis', 'nl', { stad: 'utrecht' }, { zone: defaultZone(K.city('utrecht')).i });
    expect(o.rows.some(([k]) => k.includes('op zondag om 13:00'))).toBe(true);
    expect(o.rows.some(([k]) => /dinsdag om 20:00/.test(k))).toBe(false);
    expect(o.label).toMatch(/gratis vanaf$/);
  });
});

/* ------------------------------------------------------------------ 4e tour des testeurs (2026-11-14) */
import { zoneWords, defaultZone as dz } from '../src/lib/tool-specs';
import { rateText } from '../src/content/pages/dagkaart';

describe('4e tour : zones en mots, dagkaart « per uur » juste, même fourchette partout', () => {
  it('un nom de zone qui n\'est qu\'un code est traduit en mots (wijk ou tarif)', () => {
    let named = 0;
    for (const c of K.CITIES) for (const z of K.streetZones(c)) {
      const w = zoneWords(c, z, 'nl');
      if (K.isCodeName(z.n) && z.h > 0) expect(w, `${c.n} ${z.n}`).not.toBe(K.zoneName(z.n));
      if (K.wijkOf(c, z)) named++;
    }
    expect(named).toBeGreaterThan(400);
    expect(K.isCodeName('10c max 60 po 60')).toBe(true);
    expect(K.isCodeName('Wijk C.')).toBe(true);
    expect(K.isCodeName('Nieuw Welgelegen')).toBe(false);
  });
  it('dagkaart : « N uur × € x » seulement si chaque heure coûte x, sinon la fourchette', () => {
    for (const x of DAGKAART_ROWS) if (x.day) {
      const r = x.day.r;
      expect(r.min, x.n).toBeLessThanOrEqual(r.max);
      if (r.min === r.max) expect(Math.abs(r.hours * r.max - x.day.full), x.n).toBeLessThan(0.01 * r.hours + 1e-9);
      else expect(rateText(r, x.day.full, 'nl'), x.n).toMatch(/gemiddeld .* per uur, want niet elk uur kost even veel/);
    }
    const lei = DAGKAART_ROWS.find((x) => x.s === 'leiden')!.day!, nij = DAGKAART_ROWS.find((x) => x.s === 'nijmegen')!.day!;
    expect([lei.full, lei.r.min, lei.r.max]).toEqual([31.4, 0.2, 3.1]);
    expect([nij.full, nij.r.min, nij.r.max]).toEqual([24.9, 0.5, 2.6]);
  });
  it('naheffing : l\'heure de parkeergeld sans zone = la fourchette de l\'accueil (Rotterdam)', () => {
    const o = runTool('naheffing', 'nl', { stad: 'rotterdam' });
    const info = K.cityInfo('rotterdam');
    expect(o.rows.map(([, v]) => v).join(' ')).toContain(`${formatMoney(info.hMin, 2, 'nl')} tot ${formatMoney(info.hMax, 2, 'nl')}`);
  });
  it('dagkaart sans zone : un prix et le seuil, pour la zone du chapeau de la page', () => {
    const o = runTool('dagkaart', 'nl', { stad: 'delft' });
    expect(o.value).toMatch(/^€/);
    expect(o.sub).toMatch(/voordeliger vanaf/);
    expect(o.hyp).toContain(zoneWords(K.city('delft'), dz(K.city('delft')), 'nl'));
  });
});
