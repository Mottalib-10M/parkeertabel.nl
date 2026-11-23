/**
 * Rekenhulpen van de site (déclaratifs, rendus par components/calc/SpecTool.tsx et MiniSim.tsx).
 * Tarifs, horaires et zones : Nationaal Parkeer Register (RDW, CC0) via engine/parking.ts ;
 * vergunningen et naheffing : params-2026.json (verordeningen lues dans le CVDR). Rien ne sort du navigateur.
 */
import type { ToolSpec, V, ToolOut, Input, Opt } from './tool-types';
import { resolve } from './tool-types';
import { formatMoney, formatNumber, formatPercent, displayDate, hhmm, duree, type Lang } from './format';
import * as K from './engine/parking';
import P from '../data/params-2026.json';
import { COVER } from './couverture';

export type Args = Record<string, number | string>;
const T = (l: Lang, nl: string, en: string) => (l === 'nl' ? nl : en);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k] ?? '');
const eur = (x: number, l: Lang) => formatMoney(x, 2, l);
const perU = (x: number, l: Lang) => `${eur(x, l)} ${T(l, 'per uur', 'an hour')}`;
const DAYS: Record<Lang, string[]> = {
  nl: ['', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'],
  en: ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
};
export const dayName = (d: K.Day, l: Lang) => (d === 'F' ? T(l, 'feestdag', 'public holiday') : DAYS[l][d]);
const read = (l: Lang) => displayDate(K.READ, l);
type Steden = Record<string, { nah: number; uur: boolean; verg: { bedrag: number; per: string; nl: string; en: string } }>;
export const STEDEN = P.steden as unknown as Steden;
export const NAH_MAX = P.naheffingMax.bedrag;

/* ------------------------------------------------------------------ keuzelijsten */
const cityOpts = (): Opt[] => [...K.CITIES].sort((a, b) => a.n.localeCompare(b.n, 'nl')).map((c) => ({ value: c.s, label: c.n }));
/** Zone par défaut d'une ville : la zone de rue au tarif horaire le plus haut (le centre), celle qui a le plus de tickets. */
/** Zone du centre quand le nom le dit mieux que le tarif (Den Haag : la plage de Scheveningen a le même tarif). */
const PREF: Record<string, RegExp> = { 'den-haag': /Kernwinkelstraten/, maastricht: /^Centrum betaald/, amsterdam: /\(T11A\)/ };
export function defaultZone(c: K.City): K.Zone {
  const zs = K.streetZones(c);
  const pref = PREF[c.s] && zs.find((z) => PREF[c.s].test(z.n));
  if (pref) return pref;
  return [...zs].sort((a, b) => b.h - a.h || b.p.length - a.p.length)[0] ?? c.z[0];
}
/** Libellé d'une zone dans la liste : son nom sans les heures abrégées, puis le tarif horaire en clair. Les heures
 *  payantes de la zone choisie s'affichent en mots sous la liste (testeurs 2026-11-14, 3e tour : « Tariefzone 1
 *  ma-za 09-24 zo 12-24 (T11A) » ne disait rien). */
/** Une zone en mots : la wijk (quartier du CBS, via PDOK) puis le nom lisible du registre, et le tarif en clair.
 *  Testeurs 2026-11-14 : « Tariefzone 1 (T11V) », « Zuid Pijp (10c max 60 po 60) », « Wijk C. » ne disaient rien
 *  (4e et 5e tours) ; le code du registre n'apparaît plus qu'en « registercode » dans la liste, pour départager.
 *  `rate: false` dans les listes, qui disent déjà le tarif. */
export function placeName(c: K.City, z: K.Zone, l: Lang): string {
  // « Spaarndammerbuurt/Zeeheldenbuurt » ne se coupait pas sur téléphone : espaces autour de la barre.
  const sl = (x?: string) => x?.replace(/\s*\/\s*/g, ' / ');
  const wk = sl(K.wijkOf(c, z)), pn = sl(K.plainName(z.n)) ?? '';
  const w = wk && l === 'en' ? wk.replace(/ en omgeving$/, ' area') : wk;
  if (!w) return pn;
  if (!pn || pn.toLowerCase().includes(w.toLowerCase())) return pn || w;
  return w.toLowerCase().includes(pn.toLowerCase()) ? w : `${w}, ${pn}`;
}
/** Le tarif d'une zone en clair : « € 6,98 per uur », « € 0,10 tot € 6,98 per uur, op sommige tijden hooguit 1 uur ». */
export function tariffText(c: K.City, z: K.Zone, l: Lang): string {
  const paid = z.w.filter((w) => K.hourly(c, w[3]) > 0);
  const hs = paid.map((w) => K.hourly(c, w[3])), lo = Math.min(...hs, z.h), hi = Math.max(...hs, z.h);
  const rate = lo < hi ? T(l, `${eur(lo, l)} tot ${perU(hi, l)}`, `${eur(lo, l)} to ${perU(hi, l)}`) : perU(hi, l);
  const caps = paid.map((w) => w[4]).filter((m) => m > 0);
  if (!caps.length) return rate;
  const max = duree(Math.min(...caps), l);
  return caps.length === paid.length ? T(l, `${rate}, hooguit ${max}`, `${rate}, ${max} max`) : T(l, `${rate}, op sommige tijden hooguit ${max}`, `${rate}, ${max} max at some times`);
}
export function zoneWords(c: K.City, z: K.Zone, l: Lang, rate = true): string {
  const place = placeName(c, z, l);
  const tar = rate && z.k === 'straat' && z.h > 0 ? tariffText(c, z, l) : '';
  if (place) return tar ? `${place} (${tar})` : place;
  if (tar) return T(l, `zone met ${tar}`, `zone at ${tar}`);
  return z.x ? T(l, 'zone met oplopend tarief', 'zone with a rising rate') : T(l, 'deze zone', 'this zone');
}
/** « in … » : zoneWords se lit déjà après « in » (« in Zuid Pijp (€ 6,98 per uur) », « in zone met € 8,01 per uur »). */
export const inZoneW = (c: K.City, z: K.Zone, l: Lang) => zoneWords(c, z, l);
/** Code du registre, sans le numéro de gemeente de tête (« 363_PRAR » → « PRAR »). */
const regCode = (z: K.Zone) => z.i.replace(/^\d+_(?=\S)/, '');
const zoneLabel = (c: K.City, z: K.Zone, l: Lang) => {
  const name = z.k === 'pr' ? `P+R ${placeName(c, z, l).replace(/^P\+R\s*/i, '') || regCode(z)}` : placeName(c, z, l) || 'Zone';
  if (z.h > 0) return `${name} · ${perU(z.h, l)}`;
  if (z.x) return `${name} · ${T(l, 'oplopend tarief', 'rising rate')}`;
  return `${name} · ${T(l, 'dagkaart', 'day ticket')}`;
};
/** Aucune zone n'est choisie d'avance : la zone fixe le montant, une zone pré-remplie donnait un faux résultat à qui
 *  ne la changeait pas (testeurs 2026-11-14, 3e tour). La première option invite à choisir. */
export const GEEN_ZONE = '';
const zoneOpts = (l: Lang, kinds: Array<K.Zone['k']> = ['straat', 'pr']) => (v: V): Opt[] => {
  const c = K.city(s(v, 'stad'));
  const zs = c.z.filter((z) => kinds.includes(z.k) && (z.w.length > 0 || z.p.length > 0));
  // Rue avant P+R, puis du tarif le plus haut (le centre) au plus bas, puis par nom.
  const list = [...zs].sort((a, b) => (a.k === b.k ? b.h - a.h || a.n.localeCompare(b.n, 'nl') : a.k === 'straat' ? -1 : 1));
  // Deux zones du même libellé : le code du registre les départage, en petite mention « registercode ».
  const labels = list.map((z) => zoneLabel(c, z, l));
  const count = (xs: string[], x: string) => xs.filter((y) => y === x).length;
  return [{ value: GEEN_ZONE, label: T(l, `Kies uw zone in ${c.n}`, `Choose your zone in ${c.n}`) },
    ...list.map((z, i) => ({ value: z.i, label: count(labels, labels[i]) > 1 || !placeName(c, z, l) ? `${labels[i]} · registercode ${regCode(z)}` : labels[i] }))];
};
const DAGEN_KORT: Record<Lang, string[]> = { nl: DAYS.nl, en: DAYS.en };
/** Heures payantes d'une zone sur la semaine, en clair : « maandag tot en met zaterdag 09:00-24:00, zondag 12:00-24:00 ». */
export function paidHoursText(c: K.City, z: K.Zone, l: Lang): string {
  const one = (d: number) => K.paidSpans(c, z, d).map(([a, b]) => `${hhmm(a)}-${hhmm(b)}`).join(T(l, ' en ', ' and '));
  const groups: Array<{ from: number; to: number; t: string }> = [];
  for (let d = 1; d <= 7; d++) {
    const t = one(d), last = groups[groups.length - 1];
    if (last && last.t === t && last.to === d - 1) last.to = d; else groups.push({ from: d, to: d, t });
  }
  const paid = groups.filter((g) => g.t);
  if (!paid.length) return z.p.length ? T(l, 'alleen met een vast ticket', 'fixed ticket only') : T(l, 'geen betaaltijden in het register', 'no paid hours in the register');
  const days = (g: { from: number; to: number }) => (g.from === g.to ? DAGEN_KORT[l][g.from] : g.to === g.from + 1 ? `${DAGEN_KORT[l][g.from]} ${T(l, 'en', 'and')} ${DAGEN_KORT[l][g.to]}` : `${DAGEN_KORT[l][g.from]} ${T(l, 'tot en met', 'to')} ${DAGEN_KORT[l][g.to]}`);
  const txt = paid.map((g) => `${days(g)} ${g.t}`).join(', ');
  return `${txt.charAt(0).toUpperCase()}${txt.slice(1)}`;
}
const zoneHelp = (l: Lang) => (v: V) => {
  const c = K.city(s(v, 'stad')), z = c.z.find((x) => x.i === s(v, 'zone'));
  if (!z) return T(l, 'De zone bepaalt het bedrag. Hij staat op de parkeerautomaat en in uw parkeerapp. Weet u hem niet? Zoek hierboven op adres.', 'The zone sets the amount. It is on the parking meter and in your parking app. Not sure? Search by address above.');
  return T(l, `Betaald: ${paidHoursText(c, z, l)}. Buiten die uren gratis.`, `Paid: ${paidHoursText(c, z, l)}. Free outside those hours.`);
};
const dayOpts = (l: Lang): Opt[] => [1, 2, 3, 4, 5, 6, 7].map((d) => ({ value: String(d), label: dayName(d, l) }));
const timeOpts = (): Opt[] => Array.from({ length: 48 }, (_, i) => ({ value: String(i * 30), label: hhmm(i * 30) }));
const STAD = (l: Lang, def: string): Input => ({ kind: 'select', id: 'stad', label: T(l, 'Stad', 'City'), def, options: cityOpts() });
const ZONE = (l: Lang, kinds?: Array<K.Zone['k']>): Input => ({ kind: 'select', id: 'zone', label: T(l, 'Zone', 'Zone'), def: GEEN_ZONE, options: zoneOpts(l, kinds), wide: true, help: zoneHelp(l) });
const DAG = (l: Lang): Input => ({ kind: 'select', id: 'dag', label: T(l, 'Dag', 'Day'), def: '2', options: dayOpts(l) });
const AANKOMST = (l: Lang): Input => ({ kind: 'select', id: 'aankomst', label: T(l, 'Aankomst', 'Arrival'), def: '600', options: timeOpts() });
const DUUR = (l: Lang, def = 2): Input => ({ id: 'duur', label: T(l, 'Hoe lang parkeert u?', 'How long will you park?'), def, unit: T(l, 'uur', 'h'), decimals: 1, max: 24, help: T(l, 'In uren: 1,5 is anderhalf uur.', 'In hours: 1.5 is an hour and a half.') });

/** Plages payantes d'un jour, en clair. */
export function spansText(c: K.City, z: K.Zone, d: number, l: Lang): string {
  const sp = K.paidSpans(c, z, d);
  if (!sp.length) return T(l, 'gratis', 'free');
  // Une plage qui commence à 00:00 est la fin de la soirée de la veille (Utrecht paie jusqu'à 01:00) : on le dit.
  return sp.map(([a, b, h]) => `${a === 0 && b < 1440 && sp.length > 1 ? T(l, "'s nachts ", 'overnight ') : ''}${hhmm(a)} ${T(l, 'tot', 'to')} ${hhmm(b)}${h > 0 ? ` (${eur(h, l)}/${T(l, 'u', 'h')})` : ''}`).join(', ');
}
export function weekTable(c: K.City, z: K.Zone, l: Lang) {
  return { caption: T(l, `Betaald parkeren in ${inZoneW(c, z, l)}, per dag`, `Paid parking in ${inZoneW(c, z, l)}, by day`), headers: [T(l, 'Dag', 'Day'), T(l, 'Betaald (uurtarief)', 'Paid hours (hourly rate)')],
    rows: [1, 2, 3, 4, 5, 6, 7].map((d) => [dayName(d, l), spansText(c, z, d, l)]) };
}
/** Ville et zone choisies ; z = null tant qu'aucune zone n'est choisie. */
const cityZone = (v: V) => { const c = K.city(s(v, 'stad')); return { c, z: c.z.find((x) => x.i === s(v, 'zone')) ?? null }; };
/** Un moment [jour, minute] vu depuis le jour `d` : « 18:00 » le jour même, « 24:00 » pour minuit qui suit,
 *  sinon avec le nom du jour. Testeurs du 2026-11-14 : « Gratis parkeren vanaf woensdag 00:00 » se lisait
 *  « mercredi gratuit toute la journée », alors que le stationnement redevient payant à 09:00. */
const momentText = (d: K.Day, f: [K.Day, number], l: Lang) => {
  if (f[0] === d) return hhmm(f[1]);
  if (f[1] === 0 && f[0] === K.dayAfter(d)) return '24:00';
  return `${dayName(f[0], l)} ${hhmm(f[1])}`;
};
const nextFreeText = (c: K.City, z: K.Zone, d: number, m: number, l: Lang) => {
  const f = K.nextFree(c, z, d, m);
  if (!f) return T(l, 'niet binnen 7 dagen', 'not within 7 days');
  if (f[0] === d && f[1] === m) return T(l, 'nu al gratis', 'free already');
  return momentText(d, f, l);
};
/** « 24:00 tot woensdag 09:00 » : début et fin de la prochaine période gratuite. */
export const freeSpanText = (c: K.City, z: K.Zone, d: number, m: number, l: Lang) => {
  const f = K.nextFree(c, z, d, m);
  if (!f) return T(l, 'niet binnen 7 dagen', 'not within 7 days');
  const start = f[0] === d && f[1] === m ? T(l, 'nu', 'now') : momentText(d, f, l);
  const p = K.nextPaid(c, z, f[0], f[1]);
  if (!p) return start;
  const end = momentText(d, p, l);
  return T(l, `${start} tot ${end}`, `${start} to ${end}`);
};

/* ------------------------------------------------------------------ kosten (accueil, pages de ville) */
function kostenSpec(l: Lang, a?: Args): ToolSpec {
  const c0 = K.city(String(a?.stad ?? 'amsterdam'));
  return {
    inputs: [STAD(l, c0.s), ZONE(l), DAG(l), AANKOMST(l), DUUR(l)],
    run: (v) => {
      const { c, z } = cityZone(v), d = Number(s(v, 'dag')) || 2, st = n(v, 'aankomst'), dur = Math.round(Math.min(24, Math.max(0, n(v, 'duur'))) * 60);
      const when = T(l, `${duree(dur, l)} vanaf ${hhmm(st)} op ${dayName(d, l)}`, `${duree(dur, l)} from ${hhmm(st)} on ${dayName(d, l)}`);
      if (!z) {
        // Pas encore de zone : la fourchette de la ville pour ce moment, chaque bout avec sa zone.
        const all = K.streetZones(c).map((x) => ({ x, t: K.stay(c, x, d, st, dur).total })).sort((p, q) => p.t - q.t);
        // La fourchette porte sur les zones où l'on paie à ce moment ; les zones gratuites sont comptées à part.
        const paid = all.filter((p) => p.t > 0), free = all.length - paid.length;
        const lo = paid[0] ?? all[0], hi = paid[paid.length - 1] ?? all[all.length - 1];
        // Testeurs 2026-11-14 (4e tour) : « € 0,20 tot € 16,10 » n'était pas une réponse. Le grand chiffre est le prix de la
        // zone la plus chère, nommée en mots ; la moins chère suit, nommée aussi, puis ce qu'il faut faire.
        return {
          label: T(l, `Parkeerkosten in ${c.n}, duurste zone`, `Parking cost in ${c.n}, dearest zone`), value: eur(hi.t, l),
          hyp: `${when}, ${zoneWords(c, hi.x, l)}`,
          sub: [T(l, `In de goedkoopste betaalde zone, ${zoneWords(c, lo.x, l)}: ${eur(lo.t, l)}.`, `In the cheapest paid zone, ${zoneWords(c, lo.x, l)}: ${eur(lo.t, l)}.`),
            T(l, 'Uw eigen bedrag? Kies hierboven uw zone, of zoek op adres.', 'Your own amount? Choose your zone above, or search by address.')].join('\n'),
          rows: [[T(l, 'Zones waar u op dat moment niets betaalt', 'Zones where you pay nothing at that time'), `${formatNumber(free, 0, l)} / ${formatNumber(all.length, 0, l)}`]],
          note: T(l, `Tarieven en tijden uit het Nationaal Parkeer Register (RDW, de Rijksdienst voor het Wegverkeer), stand van ${read(l)}.`, `Rates and hours from the National Parking Register (RDW, the Dutch vehicle authority), as of ${read(l)}.`),
        };
      }
      const r = K.stay(c, z, d, st, dur), w = K.winAt(c, z, d, st);
      const cheapest = z.p[0];
      const rows: Array<[string, string]> = [
        [T(l, 'Betaalde tijd', 'Paid time'), duree(r.paid, l)],
        [T(l, 'Gratis tijd', 'Free time'), duree(r.free, l)],
        [T(l, 'Tarief bij aankomst', 'Rate on arrival'), w ? (z.x ? T(l, 'oplopend tarief', 'rising rate') : perU(K.hourly(c, w[3]), l)) : T(l, 'gratis', 'free')],
        [T(l, 'Gratis parkeren', 'Free parking'), freeSpanText(c, z, d, st, l)],
      ];
      // Le ticket fixe n'est montré que s'il fait payer moins (testeurs 2026-11-14 : une avondkaart de 32,20 € sous
      // un stationnement de 16,10 € faisait croire qu'il fallait la payer).
      if (cheapest && cheapest.a < r.total) rows.push([T(l, `Goedkoper: ${cheapest.l}`, `Cheaper: ${cheapest.l}`), eur(cheapest.a, l)]);
      const lines = [T(l, `Op ${dayName(d, l)} betaald: ${spansText(c, z, d, l)}.`, `Paid on ${dayName(d, l)}: ${spansText(c, z, d, l)}.`)];
      if (r.overMax) lines.push(T(l, `Let op: hier mag u maximaal ${duree(r.maxMin, l)} achter elkaar parkeren.`, `Note: the maximum stay here is ${duree(r.maxMin, l)} in one go.`));
      if (z.x) lines.push(T(l, 'Deze zone heeft een tarief dat per minuut oploopt of per blok telt: kort parkeren is duur.', 'This zone has a rate that rises by the minute or counts in blocks: short stays are expensive.'));
      if (cheapest && cheapest.a < r.total) lines.push(T(l, `Een ${cheapest.l.toLowerCase()} van ${eur(cheapest.a, l)} is hier goedkoper.`, `A ${cheapest.l} ticket of ${eur(cheapest.a, l)} is cheaper here.`));
      return {
        label: T(l, `Parkeerkosten in ${c.n}`, `Parking cost in ${c.n}`), value: eur(r.total, l),
        hyp: `${when}, ${inZoneW(c, z, l)}`,
        sub: lines.join('\n'), rows, table: weekTable(c, z, l),
        note: T(l, `Tarieven en tijden uit het Nationaal Parkeer Register (RDW, de Rijksdienst voor het Wegverkeer), stand van ${read(l)}. Zonder transactiekosten van de parkeerapp. De automaat of app ter plaatse beslist.`, `Rates and hours from the National Parking Register (RDW, the Dutch vehicle authority), as of ${read(l)}. Parking app fees not included. The meter or app on the spot decides.`),
      };
    },
  };
}

/* ------------------------------------------------------------------ gratis */
function gratisSpec(l: Lang, a?: Args): ToolSpec {
  const c0 = K.city(String(a?.stad ?? 'utrecht'));
  return {
    inputs: [STAD(l, c0.s), ZONE(l, ['straat']), { ...DAG(l), def: '7' }, { ...AANKOMST(l), def: '780' }],
    run: (v) => {
      const { c, z } = cityZone(v), d = Number(s(v, 'dag')) || 7, st = n(v, 'aankomst');
      const zs = K.streetZones(c), sunday = zs.filter((x) => K.paidSpans(c, x, 7).length === 0).length;
      // Le moment compté est celui que l'on a choisi (testeurs 2026-11-14 : « gratis op dinsdag om 20:00 » sous un dimanche).
      const freeNow = zs.filter((x) => !K.winAt(c, x, d, st)).length;
      const nowRow: [string, string] = [T(l, `Zones in ${c.n} gratis op ${dayName(d, l)} om ${hhmm(st)}`, `Zones in ${c.n} free on ${dayName(d, l)} at ${hhmm(st)}`), `${formatNumber(freeNow, 0, l)} / ${formatNumber(zs.length, 0, l)}`];
      const sunRow: [string, string] = [T(l, `Zones in ${c.n} de hele zondag gratis`, `Zones in ${c.n} free all Sunday`), `${formatNumber(sunday, 0, l)} / ${formatNumber(zs.length, 0, l)}`];
      const note = T(l, `Nationaal Parkeer Register, stand van ${read(l)}. Blauwe zones en plaatsen voor vergunninghouders staan er niet in.`, `National Parking Register, as of ${read(l)}. Blue zones and permit-holder bays are not in it.`);
      if (!z) return {
        label: T(l, `Gratis parkeren in ${c.n} op ${dayName(d, l)} om ${hhmm(st)}`, `Free parking in ${c.n} on ${dayName(d, l)} at ${hhmm(st)}`),
        value: T(l, `${formatNumber(freeNow, 0, l)} van ${formatNumber(zs.length, 0, l)} zones`, `${formatNumber(freeNow, 0, l)} of ${formatNumber(zs.length, 0, l)} zones`),
        hyp: T(l, 'Zones waar u op dat moment niet hoeft te betalen', 'Zones where you do not have to pay at that moment'),
        sub: T(l, 'Kies hierboven uw zone, of zoek op adres: dan ziet u vanaf hoe laat het daar gratis is.', 'Choose your zone above, or search by address, to see from what time it is free there.'),
        rows: d === 7 ? [nowRow] : [nowRow, sunRow], note,
      };
      const w = K.winAt(c, z, d, st), free = K.freeDays(c, z);
      return {
        label: w ? T(l, `In ${inZoneW(c, z, l)} gratis vanaf`, `In ${inZoneW(c, z, l)}, free from`) : T(l, `In ${inZoneW(c, z, l)}`, `In ${inZoneW(c, z, l)}`),
        value: w ? nextFreeText(c, z, d, st, l) : T(l, 'Nu gratis', 'Free now'),
        hyp: T(l, `Op ${dayName(d, l)} om ${hhmm(st)} in ${c.n}`, `On ${dayName(d, l)} at ${hhmm(st)} in ${c.n}`),
        sub: w ? T(l, `Op dit moment betaalt u hier ${perU(K.hourly(c, w[3]), l)}. Daarna is het gratis tot de volgende betaaltijd.`, `Right now you pay ${perU(K.hourly(c, w[3]), l)} here. After that it is free until the next paid period.`)
          : T(l, 'Op dit moment hoeft u hier niet te betalen, tenzij een bord ter plaatse iets anders zegt (vergunninghouders, laden en lossen).', 'You do not have to pay here right now, unless a sign on the spot says otherwise (permit holders, loading).'),
        rows: [[T(l, 'Hele dagen gratis in deze zone', 'Whole free days in this zone'), free.length ? free.map((x) => dayName(x, l)).join(', ') : T(l, 'geen', 'none')], nowRow, ...(d === 7 ? [] : [sunRow])],
        table: weekTable(c, z, l), note,
      };
    },
  };
}

/* ------------------------------------------------------------------ dagkaart */
/** Valeurs par défaut de la rekenhulp dagkaart : la page s'en sert pour son chapeau (même calcul, même seuil). */
export const DAGKAART_DEF = { dag: 2, aankomst: 540, duur: 6 } as const;
function dagkaartSpec(l: Lang, a?: Args): ToolSpec {
  const c0 = K.city(String(a?.stad ?? 'amsterdam'));
  return {
    inputs: [STAD(l, c0.s), ZONE(l), { ...DAG(l), def: String(DAGKAART_DEF.dag) }, { ...AANKOMST(l), def: String(DAGKAART_DEF.aankomst) }, DUUR(l, DAGKAART_DEF.duur)],
    run: (v) => {
      const { c, z } = cityZone(v), d = Number(s(v, 'dag')) || 2, st = n(v, 'aankomst'), dur = Math.round(Math.min(24, Math.max(0, n(v, 'duur'))) * 60);
      const when = T(l, `${duree(dur, l)} vanaf ${hhmm(st)} op ${dayName(d, l)}`, `${duree(dur, l)} from ${hhmm(st)} on ${dayName(d, l)}`);
      const zs = K.streetZones(c);
      const withDay = zs.filter((x) => x.p.some((p) => K.isDayTicket(p.l)));
      const tick = withDay.map((x) => ({ x, p: x.p.find((p) => K.isDayTicket(p.l))! })).sort((p, q) => p.p.a - q.p.a);
      const lo = tick[0], hi = tick[tick.length - 1];
      const spread: Array<[string, string]> = [];
      if (lo) spread.push([T(l, `Goedkoopste dagkaart: ${zoneWords(c, lo.x, l)}`, `Cheapest day ticket: ${zoneWords(c, lo.x, l)}`), eur(lo.p.a, l)]);
      if (hi && hi !== lo) spread.push([T(l, `Duurste dagkaart: ${zoneWords(c, hi.x, l)}`, `Dearest day ticket: ${zoneWords(c, hi.x, l)}`), eur(hi.p.a, l)]);
      // Testeurs 2026-11-14 (4e tour) : sans zone, « 9 van 9 » ne répondait pas à « vanaf welk uur loont hij? ». La réponse
      // est donnée pour le centre (la zone que prend le chapeau de la page), sinon pour la dagkaart la moins chère.
      const centre = defaultZone(c), implicit = !z;
      const zz = z ?? (withDay.includes(centre) ? centre : lo?.x);
      if (!zz) {
        const rows: Array<[string, string]> = [[T(l, 'Dagkaart', 'Day ticket'), T(l, 'geen in het register', 'none in the register')]];
        return {
          label: T(l, `Zones met een dagkaart in ${c.n}`, `Zones with a day ticket in ${c.n}`),
          value: T(l, `${formatNumber(withDay.length, 0, l)} van ${formatNumber(zs.length, 0, l)}`, `${formatNumber(withDay.length, 0, l)} of ${formatNumber(zs.length, 0, l)}`),
          hyp: T(l, 'Een dagkaart geldt alleen in zijn eigen zone', 'A day ticket is valid only in its own zone'),
          sub: T(l, 'Kies hierboven uw zone, of zoek op adres: dan vergelijkt de rekenhulp de dagkaart met per uur betalen.', 'Choose your zone above, or search by address: the calculator then compares the day ticket with paying by the hour.'),
          rows,
        };
      }
      const r = K.stay(c, zz, d, st, dur), best = zz.p.find((p) => K.isDayTicket(p.l)) ?? zz.p[0];
      if (!best) return {
        label: T(l, 'Per uur betalen, over deze tijd', 'Paying by the hour, for this stay'), value: eur(r.total, l),
        hyp: `${when}, ${inZoneW(c, zz, l)}`,
        sub: T(l, `In deze zone staat geen dagkaart in het register. In ${c.n} hebben ${formatNumber(withDay.length, 0, l)} zones er wel een.`, `No day ticket is registered for this zone. In ${c.n}, ${formatNumber(withDay.length, 0, l)} zones have one.`),
        rows: [[T(l, 'Betaalde tijd', 'Paid time'), duree(r.paid, l)]],
      };
      const be = K.breakEven(c, zz, d, st, best.a);
      const kaart = r.total > best.a;
      // Testeurs 2026-11-14 (3e tour) : « Betaal per uur: u bespaart € 7,50 » se lisait « 7,50 € de l'heure ». Le grand
      // chiffre est ce que l'on paie avec l'option la moins chère ; l'écart et les deux prix sont dits en toutes lettres,
      // avec le temps réellement payé (à Delft la première heure est gratuite : d'où « 7 u 45 » et non 8 h).
      const lines = [kaart ? T(l, `De dagkaart is ${eur(r.total - best.a, l)} goedkoper dan per uur betalen.`, `The day ticket is ${eur(r.total - best.a, l)} cheaper than paying by the hour.`)
        : T(l, `Per uur betalen is ${eur(best.a - r.total, l)} goedkoper dan de dagkaart.`, `Paying by the hour is ${eur(best.a - r.total, l)} cheaper than the day ticket.`)];
      if (be) lines.push(T(l, `De dagkaart wordt voordeliger vanaf ${duree(be, l)} parkeren, bij aankomst om ${hhmm(st)}.`, `The day ticket pays off from ${duree(be, l)} of parking, arriving at ${hhmm(st)}.`));
      else lines.push(T(l, 'Op deze dag haalt het uurtarief de dagkaart niet in.', 'On this day the hourly rate never catches up with the day ticket.'));
      if (implicit) lines.unshift(T(l, `Voorbeeld voor ${zz === centre ? 'de duurste zone, zoals in de tekst bovenaan' : 'de goedkoopste dagkaart'}. Kies hierboven uw zone voor uw eigen uitkomst.`, `Example for ${zz === centre ? 'the dearest zone, as in the text at the top' : 'the cheapest day ticket'}. Choose your zone above for your own result.`));
      return {
        label: kaart ? T(l, 'Goedkoopst: de dagkaart', 'Cheapest: the day ticket') : T(l, 'Goedkoopst: per uur betalen', 'Cheapest: paying by the hour'),
        value: eur(Math.min(r.total, best.a), l),
        hyp: `${when}, ${inZoneW(c, zz, l)}`,
        sub: lines.join('\n'),
        rows: [[T(l, 'Betaalde tijd', 'Paid time'), duree(r.paid, l)], [T(l, 'Per uur betalen', 'Paying by the hour'), eur(r.total, l)], ...zz.p.filter((p) => K.isDayTicket(p.l)).slice(0, 3).map((p) => [p.l, eur(p.a, l)] as [string, string]), ...(implicit ? spread : [])],
        note: T(l, 'Een dagkaart geldt alleen in de zone en op de tijden die op de kaart of in de app staan.', 'A day ticket is valid only in the zone and at the times shown on the ticket or in the app.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ vergunning */
export const STEDEN_VERG = () => Object.keys(STEDEN);
/** Villes de la rekenhulp dont nous n'avons pas lu la verordening (pas de montant de vergunning ni de naheffing). */
export const NIET_GELEZEN = () => COVER.filter((x) => !STEDEN[x]).map((x) => K.city(x).n);
const joinNames = (xs: string[], l: Lang) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${T(l, 'en', 'and')} ${xs[xs.length - 1]}`);
export const nietGelezenText = (l: Lang) => T(l,
  `Voor ${joinNames(NIET_GELEZEN(), l)} tonen wij nog geen bedrag: wij hebben hun verordening nog niet gecontroleerd. U vindt het bedrag op de site van uw gemeente.`,
  `For ${joinNames(NIET_GELEZEN(), l)} we show no amount yet: we have not checked their by-laws yet. You will find the amount on your municipality's website.`);
const perTxtOf = (p: string, l: Lang) => ({ jaar: T(l, 'per jaar', 'a year'), maand: T(l, 'per maand', 'a month'), kwartaal: T(l, 'per kwartaal', 'a quarter'), eenmalig: T(l, 'eenmalig', 'one-off') }[p] ?? p);
function vergunningSpec(l: Lang, a?: Args): ToolSpec {
  const opts = cityOpts().filter((o) => STEDEN[o.value]);
  const perTxt = (p: string) => perTxtOf(p, l);
  const yearOf = (x: { bedrag: number; per: string }) => (x.per === 'maand' ? x.bedrag * 12 : x.per === 'kwartaal' ? x.bedrag * 4 : x.bedrag);
  return {
    inputs: [{ kind: 'select', id: 'stad', label: T(l, 'Stad', 'City'), def: String(a?.stad ?? 'utrecht'), options: opts }, { id: 'jaren', label: T(l, 'Hoeveel jaar?', 'How many years?'), def: 1, max: 10 }],
    run: (v) => {
      const st = STEDEN[s(v, 'stad')] ?? STEDEN.utrecht, c = K.city(s(v, 'stad')), yrs = Math.max(1, Math.round(n(v, 'jaren')));
      const y = yearOf(st.verg);
      const once = st.verg.per === 'eenmalig';
      const total = once ? st.verg.bedrag : y * yrs;
      const zone = defaultZone(c), visitorDays = st.verg.bedrag > 0 && zone.h > 0 ? total / (zone.h * 8) : 0;
      // La question porte sur des années : le grand chiffre est le total sur ces années, le montant de la verordening
      // (par mois, par trimestre) vient en dessous (testeurs 2026-11-14 : « Hoeveel jaar? » puis « € 54,78 per maand »).
      return {
        label: T(l, `Bewonersvergunning ${c.n}, ${once ? 'eenmalig' : `samen over ${yrs} jaar`}`, `Resident permit in ${c.n}, ${once ? 'one-off' : `total over ${yrs} year${yrs > 1 ? 's' : ''}`}`), value: eur(total, l),
        hyp: T(l, 'Eerste vergunning op het adres, zoals in de verordening parkeerbelastingen', 'First permit at the address, as set in the parking tax by-law'),
        sub: st.verg[l],
        rows: [
          [T(l, 'Bedrag in de verordening', 'Amount in the by-law'), `${eur(st.verg.bedrag, l)} ${perTxt(st.verg.per)}`],
          [T(l, `Voor ${eur(total, l)} parkeert u in de duurste zone op straat`, `${eur(total, l)} buys street parking in the dearest zone for`), visitorDays > 0 ? T(l, `${formatNumber(visitorDays, 0, l)} werkdagen van 8 uur`, `${formatNumber(visitorDays, 0, l)} 8-hour workdays`) : T(l, 'n.v.t.', 'n/a')],
          [T(l, 'Naheffingsaanslag zonder vergunning (kosten)', 'Penalty assessment without a permit (costs)'), eur(st.nah, l) + (st.uur ? T(l, ' + 1 uur parkeergeld', ' + 1 hour of parking') : T(l, ' + het parkeergeld', ' + the parking fee'))],
        ],
        note: `${T(l, 'Een vergunning krijgt u alleen als de gemeente er een uitgeeft op uw adres; in veel wijken is er een wachtlijst.', 'You only get a permit if the municipality issues one for your address; many districts have a waiting list.')} ${nietGelezenText(l)}`,
      };
    },
  };
}

/* ------------------------------------------------------------------ jaar2027 */
type S27 = { nah: number; verg: { bedrag: number; per: string; nl: string; en: string }; uur?: { zone: string; oud: number; nieuw: number } };
export const J27 = P.jaar2027 as unknown as { read: string; naheffingMax: { bedrag: number; van: number; ingang: string }; steden: Record<string, S27> };
const jaarbedrag = (x: { bedrag: number; per: string }) => (x.per === 'maand' ? x.bedrag * 12 : x.per === 'kwartaal' ? x.bedrag * 4 : x.bedrag);
/** 2026 → 2027 : vergunning et naheffing d'une ville ; « nog niet gepubliceerd » tant que sa verordening 2027 n'est pas au CVDR. */
function jaar2027Spec(l: Lang, a?: Args): ToolSpec {
  const opts = cityOpts().filter((o) => STEDEN[o.value]);
  return {
    inputs: [{ kind: 'select', id: 'stad', label: T(l, 'Stad', 'City'), def: String(a?.stad ?? 'utrecht'), options: opts }],
    run: (v) => {
      const slug = STEDEN[s(v, 'stad')] ? s(v, 'stad') : 'utrecht', c = K.city(slug), oud = STEDEN[slug], nieuw = J27.steden[slug];
      const y26 = jaarbedrag(oud.verg), once = oud.verg.per === 'eenmalig';
      const max27 = J27.naheffingMax.bedrag, rd = displayDate(J27.read, l);
      if (!nieuw) return {
        label: T(l, `Bewonersvergunning ${c.n} in 2027`, `Resident permit in ${c.n} in 2027`), value: T(l, 'nog niet gepubliceerd', 'not published yet'),
        hyp: T(l, `Stand van ${rd}: de verordening parkeerbelastingen 2027 van ${c.n} stond nog niet in het register van lokale regelgeving`, `As of ${rd}: ${c.n}'s 2027 parking tax by-law was not yet in the official register of local regulations`),
        rows: [
          [T(l, 'Eerste vergunning in 2026', 'First permit in 2026'), once ? `${eur(oud.verg.bedrag, l)} ${T(l, 'eenmalig', 'one-off')}` : `${eur(y26, l)} ${T(l, 'per jaar', 'a year')}`],
          [T(l, 'Kosten naheffingsaanslag in 2026', 'Penalty assessment costs in 2026'), eur(oud.nah, l)],
          [T(l, 'Wettelijk maximum voor de kosten in 2027', 'Legal maximum for the costs in 2027'), eur(max27, l)],
        ],
        note: T(l, 'De gemeenteraad stelt de tarieven voor 2027 meestal in november of december vast. Tot dan tonen wij geen bedrag voor 2027.', 'The council usually sets the 2027 rates in November or December. Until then we show no 2027 amount.'),
      };
      const y27 = jaarbedrag(nieuw.verg), diff = y27 - y26;
      const rows: Array<[string, string]> = [
        [T(l, 'Eerste vergunning in 2026', 'First permit in 2026'), `${eur(y26, l)} ${T(l, 'per jaar', 'a year')}`],
        [T(l, 'Eerste vergunning in 2027', 'First permit in 2027'), `${eur(y27, l)} ${T(l, 'per jaar', 'a year')}`],
        [T(l, 'Verschil per jaar', 'Difference per year'), `${diff >= 0 ? '+' : '−'}${eur(Math.abs(diff), l)} (${formatPercent(diff / y26, 1, l)})`],
        [T(l, 'Kosten naheffingsaanslag', 'Penalty assessment costs'), `${eur(oud.nah, l)} → ${eur(nieuw.nah, l)}`],
      ];
      if (nieuw.uur) rows.push([T(l, `Uurtarief op straat, zone ${nieuw.uur.zone}`, `Street rate per hour, zone ${nieuw.uur.zone}`), `${eur(nieuw.uur.oud, l)} → ${eur(nieuw.uur.nieuw, l)}`]);
      return {
        label: T(l, `Bewonersvergunning ${c.n} in 2027`, `Resident permit in ${c.n} in 2027`), value: `${eur(y27, l)} ${T(l, 'per jaar', 'a year')}`,
        hyp: T(l, 'Eerste vergunning op het adres, zoals in de verordening parkeerbelastingen 2027', 'First permit at the address, as set in the 2027 parking tax by-law'),
        sub: nieuw.verg[l],
        rows,
        note: T(l, `Gelezen in de verordening 2027 op ${rd}. Het wettelijke maximum voor de kosten van een naheffingsaanslag is ${eur(max27, l)} vanaf 1 januari 2027.`, `Read in the 2027 by-law on ${rd}. The legal maximum for penalty assessment costs is ${eur(max27, l)} from 1 January 2027.`),
      };
    },
  };
}

/* ------------------------------------------------------------------ naheffing */
/** Ce que la verordening ajoute aux kosten, en mots simples (« niet betaalde belasting » ne se comprenait pas). */
export const nahPlusText = (uur: boolean, l: Lang) => (uur ? T(l, '1 uur parkeergeld van die zone', '1 hour of parking in that zone') : T(l, 'het parkeergeld dat u niet betaalde', 'the parking fee you did not pay'));
function naheffingSpec(l: Lang, a?: Args): ToolSpec {
  const c0 = K.city(String(a?.stad ?? 'rotterdam'));
  return {
    inputs: [STAD(l, c0.s), ZONE(l, ['straat'])],
    run: (v) => {
      const { c, z } = cityZone(v), st = STEDEN[c.s];
      const known = !!st;
      const kosten = known ? st.nah : NAH_MAX;
      // Sans zone choisie, l'heure de parkeergeld ajoutée (Rotterdam…) n'est pas connue : on donne la fourchette de la ville.
      // Même fourchette que la liste « Uurtarief per stad » de l'accueil (testeurs 2026-11-14, 4e tour : Rotterdam € 1,48 là, € 1,70 ici).
      const info = K.cityInfo(c.s), hs = info.hMax > 0 ? [info.hMin, info.hMax] : [];
      const extra = st?.uur && z ? z.h : 0;
      const zn = z ? inZoneW(c, z, l) : '';
      // Le wettelijke maximum porte sur les kosten seules ; le total peut le dépasser du parkeergeld (testeurs
      // 2026-11-14 : « maximum € 82,00 » puis « € 89,20 »). Chaque ligne dit donc ce qu'elle mesure.
      const rows: Array<[string, string]> = [
        [T(l, 'Kosten (vastgesteld door de gemeente)', 'Costs (set by the municipality)'), known ? eur(kosten, l) : T(l, `max. ${eur(NAH_MAX, l)}`, `max. ${eur(NAH_MAX, l)}`)],
      ];
      if (known && st.uur && z) rows.push([T(l, `Daarbij komt: 1 uur parkeergeld (${zn})`, `Plus: 1 hour of parking (${zn})`), eur(extra, l)]);
      else if (known && st.uur) rows.push([T(l, 'Daarbij komt: 1 uur parkeergeld van uw zone', 'Plus: 1 hour of parking in your zone'), hs.length ? T(l, `${eur(Math.min(...hs), l)} tot ${eur(Math.max(...hs), l)}`, `${eur(Math.min(...hs), l)} to ${eur(Math.max(...hs), l)}`) : T(l, 'kies uw zone', 'choose your zone')]);
      else rows.push([T(l, 'Daarbij komt', 'Plus'), nahPlusText(false, l)]);
      rows.push([T(l, 'Wettelijk maximum voor de kosten alleen', 'Legal maximum for the costs alone'), eur(NAH_MAX, l)]);
      const total = known && st.uur && z;
      return {
        label: total ? T(l, `Naheffingsaanslag in ${c.n}: totaal`, `Parking penalty in ${c.n}: total`) : T(l, `Naheffingsaanslag in ${c.n}: kosten`, `Parking penalty in ${c.n}: costs`),
        value: known ? eur(kosten + extra, l) : T(l, `tot ${eur(NAH_MAX, l)}`, `up to ${eur(NAH_MAX, l)}`),
        hyp: z ? T(l, `${zn.charAt(0).toUpperCase()}${zn.slice(1)}, niet of te kort betaald`, `${zn.charAt(0).toUpperCase()}${zn.slice(1)}, not paid or paid too short`) : T(l, `In ${c.n}, niet of te kort betaald`, `In ${c.n}, not paid or paid too short`),
        sub: known
          ? (st.uur
            ? (z ? T(l, `${eur(st.nah, l)} kosten plus ${eur(extra, l)} voor één uur parkeergeld = ${eur(kosten + extra, l)}. Het wettelijke maximum van ${eur(NAH_MAX, l)} geldt alleen voor de kosten.`, `${eur(st.nah, l)} in costs plus ${eur(extra, l)} for one hour of parking = ${eur(kosten + extra, l)}. The legal maximum of ${eur(NAH_MAX, l)} applies to the costs only.`)
              : T(l, `De gemeente rekent ${eur(st.nah, l)} kosten, plus één uur parkeergeld van de zone. Kies hierboven uw zone voor het totaal.`, `The municipality charges ${eur(st.nah, l)} in costs, plus one hour of parking in the zone. Choose your zone above for the total.`))
            : T(l, `De gemeente rekent ${eur(st.nah, l)} kosten. Daar komt het parkeergeld bij dat u niet betaalde.`, `The municipality charges ${eur(st.nah, l)} in costs. The parking fee you did not pay comes on top.`))
          : T(l, `Voor ${c.n} hebben wij het bedrag nog niet gecontroleerd in de verordening. De kosten zijn wettelijk maximaal ${eur(NAH_MAX, l)} in 2026; daar komt het parkeergeld bij.`, `We have not checked ${c.n}'s by-law yet. The costs are capped by law at ${eur(NAH_MAX, l)} in 2026; the parking fee comes on top.`),
        rows,
        note: T(l, 'Bezwaar maken kan binnen 6 weken na de datum op de aanslag, bij de gemeente.', 'You can object within 6 weeks of the date on the assessment, with the municipality.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ P+R */
const PR_CITIES = () => K.CITIES.filter((c) => K.prZones(c).some((z) => z.p.length || z.w.length));
function prSpec(l: Lang, a?: Args): ToolSpec {
  const opts = cityOpts().filter((o) => PR_CITIES().some((c) => c.s === o.value));
  return {
    inputs: [{ kind: 'select', id: 'stad', label: T(l, 'Stad', 'City'), def: String(a?.stad ?? 'amsterdam'), options: opts }, { ...DAG(l), def: '2' }, { ...AANKOMST(l), def: '540' }, DUUR(l, 8)],
    run: (v) => {
      // Jour et heure d'arrivée sont des champs (testeurs 2026-11-14, 3e tour : « op een dinsdag vanaf 09:00 » était imposé).
      const c = K.city(s(v, 'stad')), d = Number(s(v, 'dag')) || 2, st = n(v, 'aankomst'), dur = Math.round(Math.min(24, Math.max(0, n(v, 'duur'))) * 60), centre = defaultZone(c);
      const street = K.stay(c, centre, d, st, dur).total;
      // Un P+R sans montant dans le registre (0 €) n'est pas montré : gratuit ou non renseigné, on ne sait pas.
      const prs = K.prZones(c).map((z) => ({ z, price: z.p.length ? z.p[0].a : K.stay(c, z, d, st, dur).total })).filter((p) => p.price > 0).sort((p, q) => p.price - q.price);
      const best = prs[0];
      return {
        label: T(l, `Goedkoopste P+R in ${c.n}`, `Cheapest P+R in ${c.n}`), value: best ? eur(best.price, l) : T(l, 'geen', 'none'),
        hyp: T(l, `${duree(dur, l)} vanaf ${hhmm(st)} op ${dayName(d, l)}, reis met bus, tram of trein niet meegerekend`, `${duree(dur, l)} from ${hhmm(st)} on ${dayName(d, l)}, public transport fare not included`),
        sub: best ? T(l, `${best.z.n}. Dezelfde parkeertijd (${duree(dur, l)}) in het centrum, ${zoneWords(c, centre, l)}: ${eur(street, l)}.`, `${best.z.n}. The same stay (${duree(dur, l)}) in the centre, ${zoneWords(c, centre, l)}: ${eur(street, l)}.`) : '',
        rows: [[T(l, `Centrum, ${duree(dur, l)} vanaf ${hhmm(st)}`, `Centre, ${duree(dur, l)} from ${hhmm(st)}`), eur(street, l)], [T(l, 'Verschil', 'Difference'), best ? eur(Math.max(0, street - best.price), l) : T(l, 'n.v.t.', 'n/a')]],
        table: { caption: T(l, `P+R-terreinen in ${c.n} in het register`, `P+R sites in ${c.n} in the register`), headers: ['P+R', T(l, 'Prijs', 'Price')], align: ['l', 'r'], rows: prs.map((p) => [p.z.n, eur(p.price, l)]) },
        note: T(l, 'Het P+R-tarief geldt vaak alleen als u met bus, tram of trein naar het centrum reist; de voorwaarden staan bij de ingang en in de app.', 'The P+R fare often applies only with a public transport trip to the centre; the conditions are at the entrance and in the app.'),
      };
    },
  };
}

export const SPECS: Record<string, (l: Lang, arg?: Args) => ToolSpec> = {
  kosten: kostenSpec, gratis: gratisSpec, dagkaart: dagkaartSpec, vergunning: vergunningSpec, naheffing: naheffingSpec, pr: prSpec, jaar2027: jaar2027Spec,
};
export const TOOL_KINDS = Object.keys(SPECS);
export function getTool(kind: string, l: Lang, arg?: Args): ToolSpec {
  const f = SPECS[kind]; if (!f) throw new Error(`onbekende rekenhulp: ${kind}`);
  return f(l, arg);
}
/** Lance un outil avec ses valeurs par défaut (ou données) : sert aux pages et aux tests. */
export function runTool(kind: string, l: Lang, arg?: Args, values?: V): ToolOut {
  const spec = getTool(kind, l, arg);
  const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as V;
  return spec.run(resolve(spec.inputs, { ...v, ...(values ?? {}) }));
}
/** Résumé d'un champ replié (aucun ici). */
export const resumenCampo = (_id: string, _v: V, _l: Lang): string | undefined => undefined;
