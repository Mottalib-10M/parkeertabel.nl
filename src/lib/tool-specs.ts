/**
 * Rekenhulpen van de site (déclaratifs, rendus par components/calc/SpecTool.tsx et MiniSim.tsx).
 * Tarifs, horaires et zones : Nationaal Parkeer Register (RDW, CC0) via engine/parking.ts ;
 * vergunningen et naheffing : params-2026.json (verordeningen lues dans le CVDR). Rien ne sort du navigateur.
 */
import type { ToolSpec, V, ToolOut, Input, Opt } from './tool-types';
import { resolve } from './tool-types';
import { formatMoney, formatNumber, displayDate, hhmm, duree, type Lang } from './format';
import * as K from './engine/parking';
import P from '../data/params-2026.json';

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
const zoneLabel = (c: K.City, z: K.Zone, l: Lang) => {
  const name = z.k === 'pr' ? `P+R ${z.n.replace(/^P\+R\s*/i, '')}` : z.n;
  // Le nom seul, tel qu'il figure sur l'automate : le tarif est dans le résultat. Avec le tarif en plus, les noms longs
  // (Breda, Den Haag) passaient sur trois lignes à 320 px et le champ dépassait les autres (check-layout).
  if (z.h > 0) return name;
  if (z.x) return `${name} · ${T(l, 'oplopend tarief', 'rising rate')}`;
  return `${name} · ${T(l, 'dagkaart', 'day ticket')}`;
};
const zoneOpts = (l: Lang, kinds: Array<K.Zone['k']> = ['straat', 'pr']) => (v: V): Opt[] => {
  const c = K.city(s(v, 'stad')), d = defaultZone(c);
  const zs = c.z.filter((z) => kinds.includes(z.k) && (z.w.length > 0 || z.p.length > 0));
  const rest = zs.filter((z) => z !== d).sort((a, b) => (a.k === b.k ? a.n.localeCompare(b.n, 'nl') : a.k === 'straat' ? -1 : 1));
  const list = [d, ...rest].filter(Boolean);
  // Deux zones du même nom (Amsterdam, Tilburg, Dordrecht) : le tarif, puis le code du registre, les départagent.
  const labels = list.map((z) => zoneLabel(c, z, l));
  const count = (xs: string[], x: string) => xs.filter((y) => y === x).length;
  const withRate = labels.map((x, i) => (count(labels, x) > 1 && list[i].h > 0 ? `${x} · ${eur(list[i].h, l)}/${T(l, 'u', 'h')}` : x));
  return list.map((z, i) => ({ value: z.i, label: count(withRate, withRate[i]) > 1 ? `${withRate[i]} (${z.i})` : withRate[i] }));
};
const dayOpts = (l: Lang): Opt[] => [1, 2, 3, 4, 5, 6, 7].map((d) => ({ value: String(d), label: dayName(d, l) }));
const timeOpts = (): Opt[] => Array.from({ length: 48 }, (_, i) => ({ value: String(i * 30), label: hhmm(i * 30) }));
const STAD = (l: Lang, def: string): Input => ({ kind: 'select', id: 'stad', label: T(l, 'Stad', 'City'), def, options: cityOpts() });
const ZONE = (l: Lang, def: string, kinds?: Array<K.Zone['k']>): Input => ({ kind: 'select', id: 'zone', label: T(l, 'Zone (naam in het parkeerregister)', 'Zone (name in the parking register)'), def, options: zoneOpts(l, kinds), wide: true,
  help: T(l, 'De naam staat op de parkeerautomaat en in uw parkeerapp. Weet u hem niet? Zoek uw adres hierboven.', 'The name is on the parking meter and in your parking app. Not sure? Look up your address above.') });
const DAG = (l: Lang): Input => ({ kind: 'select', id: 'dag', label: T(l, 'Dag', 'Day'), def: '2', options: dayOpts(l) });
const AANKOMST = (l: Lang): Input => ({ kind: 'select', id: 'aankomst', label: T(l, 'Aankomst', 'Arrival'), def: '600', options: timeOpts() });
const DUUR = (l: Lang, def = 2): Input => ({ id: 'duur', label: T(l, 'Hoe lang parkeert u?', 'How long will you park?'), def, unit: T(l, 'uur', 'h'), decimals: 1, max: 24, help: T(l, 'In uren: 1,5 is anderhalf uur.', 'In hours: 1.5 is an hour and a half.') });

/** Plages payantes d'un jour, en clair. */
export function spansText(c: K.City, z: K.Zone, d: number, l: Lang): string {
  const sp = K.paidSpans(c, z, d);
  if (!sp.length) return T(l, 'gratis', 'free');
  return sp.map(([a, b, h]) => `${hhmm(a)} ${T(l, 'tot', 'to')} ${hhmm(b)}${h > 0 ? ` (${eur(h, l)}/${T(l, 'u', 'h')})` : ''}`).join(', ');
}
export function weekTable(c: K.City, z: K.Zone, l: Lang) {
  return { caption: T(l, `Betaald parkeren in ${z.n}, per dag`, `Paid parking in ${z.n}, by day`), headers: [T(l, 'Dag', 'Day'), T(l, 'Betaald (uurtarief)', 'Paid hours (hourly rate)')],
    rows: [1, 2, 3, 4, 5, 6, 7].map((d) => [dayName(d, l), spansText(c, z, d, l)]) };
}
const cityZone = (v: V) => { const c = K.city(s(v, 'stad')); return { c, z: K.zone(c, s(v, 'zone')) }; };
const nextFreeText = (c: K.City, z: K.Zone, d: number, m: number, l: Lang) => {
  const f = K.nextFree(c, z, d, m);
  if (!f) return T(l, 'niet binnen 7 dagen', 'not within 7 days');
  if (f[0] === d && f[1] === m) return T(l, 'nu al gratis', 'free already');
  return `${f[0] === d ? '' : `${dayName(f[0], l)} `}${hhmm(f[1])}`;
};

/* ------------------------------------------------------------------ kosten (accueil, pages de ville) */
function kostenSpec(l: Lang, a?: Args): ToolSpec {
  const c0 = K.city(String(a?.stad ?? 'amsterdam'));
  return {
    inputs: [STAD(l, c0.s), ZONE(l, defaultZone(c0).i), DAG(l), AANKOMST(l), DUUR(l)],
    run: (v) => {
      const { c, z } = cityZone(v), d = Number(s(v, 'dag')) || 2, st = n(v, 'aankomst'), dur = Math.round(Math.min(24, Math.max(0, n(v, 'duur'))) * 60);
      const r = K.stay(c, z, d, st, dur), w = K.winAt(c, z, d, st);
      const cheapest = z.p[0];
      const rows: Array<[string, string]> = [
        [T(l, 'Betaalde tijd', 'Paid time'), duree(r.paid, l)],
        [T(l, 'Gratis tijd', 'Free time'), duree(r.free, l)],
        [T(l, 'Tarief bij aankomst', 'Rate on arrival'), w ? (z.x ? T(l, 'oplopend tarief', 'rising rate') : perU(K.hourly(c, w[3]), l)) : T(l, 'gratis', 'free')],
        [T(l, 'Gratis parkeren vanaf', 'Free parking from'), nextFreeText(c, z, d, st, l)],
      ];
      if (cheapest) rows.push([T(l, `Dagkaart of vast tarief (${cheapest.l})`, `Day ticket or flat fare (${cheapest.l})`), eur(cheapest.a, l)]);
      const lines = [T(l, `Op ${dayName(d, l)} betaald: ${spansText(c, z, d, l)}.`, `Paid on ${dayName(d, l)}: ${spansText(c, z, d, l)}.`)];
      if (r.overMax) lines.push(T(l, `Let op: hier mag u maximaal ${duree(r.maxMin, l)} achter elkaar parkeren.`, `Note: the maximum stay here is ${duree(r.maxMin, l)} in one go.`));
      if (z.x) lines.push(T(l, 'Deze zone heeft een tarief dat per minuut oploopt of per blok telt: kort parkeren is duur.', 'This zone has a rate that rises by the minute or counts in blocks: short stays are expensive.'));
      if (cheapest && cheapest.a < r.total) lines.push(T(l, `Een ${cheapest.l.toLowerCase()} van ${eur(cheapest.a, l)} is hier goedkoper.`, `A ${cheapest.l} ticket of ${eur(cheapest.a, l)} is cheaper here.`));
      return {
        label: T(l, `Parkeerkosten in ${c.n}`, `Parking cost in ${c.n}`), value: eur(r.total, l),
        hyp: T(l, `${duree(dur, l)} vanaf ${hhmm(st)} op ${dayName(d, l)}, zone ${z.n}`, `${duree(dur, l)} from ${hhmm(st)} on ${dayName(d, l)}, zone ${z.n}`),
        sub: lines.join('\n'), rows, table: weekTable(c, z, l),
        note: T(l, `Tarieven en tijden uit het Nationaal Parkeer Register (RDW), gelezen op ${read(l)}. Zonder transactiekosten van de parkeerapp. De automaat of app ter plaatse beslist.`, `Rates and hours from the National Parking Register (RDW), read on ${read(l)}. Parking app fees not included. The meter or app on the spot decides.`),
      };
    },
  };
}

/* ------------------------------------------------------------------ gratis */
function gratisSpec(l: Lang, a?: Args): ToolSpec {
  const c0 = K.city(String(a?.stad ?? 'utrecht'));
  return {
    inputs: [STAD(l, c0.s), ZONE(l, defaultZone(c0).i, ['straat']), { ...DAG(l), def: '7' }, { ...AANKOMST(l), def: '780' }],
    run: (v) => {
      const { c, z } = cityZone(v), d = Number(s(v, 'dag')) || 7, st = n(v, 'aankomst');
      const w = K.winAt(c, z, d, st), free = K.freeDays(c, z);
      const zs = K.streetZones(c), sunday = zs.filter((x) => K.paidSpans(c, x, 7).length === 0).length;
      const evening = zs.filter((x) => !K.winAt(c, x, 2, 20 * 60)).length;
      return {
        label: T(l, `Gratis parkeren in ${z.n}`, `Free parking in ${z.n}`), value: w ? nextFreeText(c, z, d, st, l) : T(l, 'Nu gratis', 'Free now'),
        hyp: T(l, `Op ${dayName(d, l)} om ${hhmm(st)} in ${c.n}`, `On ${dayName(d, l)} at ${hhmm(st)} in ${c.n}`),
        sub: w ? T(l, `Nu betaald (${eur(K.hourly(c, w[3]), l)} per uur). Daarna gratis tot de volgende betaalde periode.`, `Paid now (${eur(K.hourly(c, w[3]), l)} an hour). Free after that until the next paid period.`)
          : T(l, 'Op dit moment hoeft u hier niet te betalen, tenzij een bord ter plaatse iets anders zegt (vergunninghouders, laden en lossen).', 'You do not have to pay here right now, unless a sign on the spot says otherwise (permit holders, loading).'),
        rows: [
          [T(l, 'Hele dagen gratis in deze zone', 'Whole free days in this zone'), free.length ? free.map((x) => dayName(x, l)).join(', ') : T(l, 'geen', 'none')],
          [T(l, `Zones in ${c.n} gratis op zondag`, `Zones in ${c.n} free on Sunday`), `${formatNumber(sunday, 0, l)} / ${formatNumber(zs.length, 0, l)}`],
          [T(l, `Zones gratis op dinsdag om 20:00`, `Zones free on Tuesday at 8 pm`), `${formatNumber(evening, 0, l)} / ${formatNumber(zs.length, 0, l)}`],
        ],
        table: weekTable(c, z, l),
        note: T(l, `Nationaal Parkeer Register, gelezen op ${read(l)}. Blauwe zones en vergunninghoudersplaatsen staan er niet in.`, `National Parking Register, read on ${read(l)}. Blue zones and permit-holder bays are not in it.`),
      };
    },
  };
}

/* ------------------------------------------------------------------ dagkaart */
function dagkaartSpec(l: Lang, a?: Args): ToolSpec {
  const c0 = K.city(String(a?.stad ?? 'amsterdam'));
  return {
    inputs: [STAD(l, c0.s), ZONE(l, defaultZone(c0).i), DAG(l), { ...AANKOMST(l), def: '540' }, DUUR(l, 6)],
    run: (v) => {
      const { c, z } = cityZone(v), d = Number(s(v, 'dag')) || 2, st = n(v, 'aankomst'), dur = Math.round(Math.min(24, Math.max(0, n(v, 'duur'))) * 60);
      const r = K.stay(c, z, d, st, dur), best = z.p[0];
      const withTicket = K.streetZones(c).filter((x) => x.p.length > 0).length;
      if (!best) return {
        label: T(l, 'Uurtarief over deze tijd', 'Hourly cost for this stay'), value: eur(r.total, l),
        hyp: T(l, `${duree(dur, l)} vanaf ${hhmm(st)} op ${dayName(d, l)}`, `${duree(dur, l)} from ${hhmm(st)} on ${dayName(d, l)}`),
        sub: T(l, `In deze zone staat geen dagkaart in het register. In ${c.n} hebben ${formatNumber(withTicket, 0, l)} zones er wel een.`, `No day ticket is registered for this zone. In ${c.n}, ${formatNumber(withTicket, 0, l)} zones have one.`),
        rows: [[T(l, 'Betaalde tijd', 'Paid time'), duree(r.paid, l)]],
      };
      const be = K.breakEven(c, z, d, st, best.a);
      return {
        label: r.total > best.a ? T(l, 'Neem de dagkaart: u bespaart', 'Take the day ticket: you save') : T(l, 'Betaal per uur: u bespaart', 'Pay by the hour: you save'),
        value: eur(Math.abs(r.total - best.a), l),
        hyp: T(l, `${duree(dur, l)} vanaf ${hhmm(st)} op ${dayName(d, l)}, zone ${z.n}`, `${duree(dur, l)} from ${hhmm(st)} on ${dayName(d, l)}, zone ${z.n}`),
        sub: be ? T(l, `De dagkaart wordt voordeliger vanaf ${duree(be, l)} parkeren.`, `The day ticket pays off from ${duree(be, l)} of parking.`) : T(l, 'Op deze dag haalt het uurtarief de dagkaart niet in.', 'On this day the hourly rate never catches up with the day ticket.'),
        rows: [[T(l, 'Per uur betalen', 'Paying by the hour'), eur(r.total, l)], ...z.p.slice(0, 4).map((p) => [p.l, eur(p.a, l)] as [string, string])],
        note: T(l, 'Een dagkaart geldt alleen in de zone en op de tijden die op de kaart of in de app staan.', 'A day ticket is valid only in the zone and at the times shown on the ticket or in the app.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ vergunning */
export const STEDEN_VERG = () => Object.keys(STEDEN);
function vergunningSpec(l: Lang, a?: Args): ToolSpec {
  const opts = cityOpts().filter((o) => STEDEN[o.value]);
  const perTxt = (p: string) => ({ jaar: T(l, 'per jaar', 'a year'), maand: T(l, 'per maand', 'a month'), kwartaal: T(l, 'per kwartaal', 'a quarter'), eenmalig: T(l, 'eenmalig', 'one-off') }[p] ?? p);
  const yearOf = (x: { bedrag: number; per: string }) => (x.per === 'maand' ? x.bedrag * 12 : x.per === 'kwartaal' ? x.bedrag * 4 : x.bedrag);
  return {
    inputs: [{ kind: 'select', id: 'stad', label: T(l, 'Stad', 'City'), def: String(a?.stad ?? 'utrecht'), options: opts }, { id: 'jaren', label: T(l, 'Hoeveel jaar?', 'How many years?'), def: 1, max: 10 }],
    run: (v) => {
      const st = STEDEN[s(v, 'stad')] ?? STEDEN.utrecht, c = K.city(s(v, 'stad')), yrs = Math.max(1, Math.round(n(v, 'jaren')));
      const y = yearOf(st.verg);
      const zone = defaultZone(c), visitorDays = st.verg.bedrag > 0 && zone.h > 0 ? (y * yrs) / (zone.h * 8) : 0;
      return {
        label: T(l, `Bewonersvergunning ${c.n}`, `Resident permit in ${c.n}`), value: `${eur(st.verg.bedrag, l)} ${perTxt(st.verg.per)}`,
        hyp: T(l, 'Eerste vergunning op het adres, zoals in de verordening parkeerbelastingen', 'First permit at the address, as set in the parking tax by-law'),
        sub: st.verg[l],
        rows: [
          [T(l, `Over ${yrs} jaar`, `Over ${yrs} year${yrs > 1 ? 's' : ''}`), st.verg.per === 'eenmalig' ? eur(st.verg.bedrag, l) : eur(y * yrs, l)],
          [T(l, 'Zelfde bedrag aan straatparkeren', 'Same amount in street parking'), visitorDays > 0 ? T(l, `${formatNumber(visitorDays, 0, l)} werkdagen van 8 uur`, `${formatNumber(visitorDays, 0, l)} 8-hour workdays`) : T(l, 'n.v.t.', 'n/a')],
          [T(l, 'Boete (naheffing) zonder vergunning', 'Penalty (naheffing) without a permit'), eur(st.nah, l) + (st.uur ? T(l, ' + 1 uur tarief', ' + 1 hour rate') : '')],
        ],
        table: { caption: T(l, 'Eerste bewonersvergunning per stad (verordeningen 2026)', 'First resident permit by city (2026 by-laws)'), headers: [T(l, 'Stad', 'City'), T(l, 'Bedrag', 'Amount'), T(l, 'Per jaar', 'Per year')], align: ['l', 'r', 'r'],
          rows: opts.map((o) => { const x = STEDEN[o.value].verg; return [o.label, `${eur(x.bedrag, l)} ${perTxt(x.per)}`, x.per === 'eenmalig' ? T(l, 'eenmalig', 'one-off') : eur(yearOf(x), l)]; }) },
        note: T(l, 'Een vergunning krijgt u alleen als de gemeente er een uitgeeft op uw adres; in veel wijken is er een wachtlijst.', 'You only get a permit if the municipality issues one for your address; many districts have a waiting list.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ naheffing */
function naheffingSpec(l: Lang, a?: Args): ToolSpec {
  const c0 = K.city(String(a?.stad ?? 'rotterdam'));
  return {
    inputs: [STAD(l, c0.s), ZONE(l, defaultZone(c0).i, ['straat'])],
    run: (v) => {
      const { c, z } = cityZone(v), st = STEDEN[c.s], h = z.h;
      const kosten = st ? st.nah : NAH_MAX;
      const extra = st?.uur ? h : 0;
      const known = !!st;
      return {
        label: T(l, `Naheffingsaanslag in ${c.n}`, `Parking penalty in ${c.n}`), value: known ? eur(kosten + extra, l) : T(l, `tot ${eur(NAH_MAX, l)}`, `up to ${eur(NAH_MAX, l)}`),
        hyp: T(l, `Zone ${z.n}, niet of te kort betaald`, `Zone ${z.n}, not paid or paid too short`),
        sub: known
          ? (st.uur ? T(l, `De verordening rekent ${eur(st.nah, l)} kosten plus één uur van het tarief ter plaatse.`, `The by-law charges ${eur(st.nah, l)} in costs plus one hour of the local rate.`)
            : T(l, `De verordening zet de kosten op ${eur(st.nah, l)}; daar komt de parkeerbelasting bij die u niet betaalde.`, `The by-law sets the costs at ${eur(st.nah, l)}; the parking tax you did not pay comes on top.`))
          : T(l, `De verordening van ${c.n} hebben wij niet gelezen. Het wettelijke maximum voor de kosten is in 2026 ${eur(NAH_MAX, l)}.`, `We have not read ${c.n}'s by-law. The legal maximum for the costs in 2026 is ${eur(NAH_MAX, l)}.`),
        rows: [
          [T(l, 'Kosten naheffingsaanslag', 'Penalty costs'), known ? eur(kosten, l) : T(l, `max. ${eur(NAH_MAX, l)}`, `max. ${eur(NAH_MAX, l)}`)],
          [T(l, 'Uurtarief in deze zone', 'Hourly rate in this zone'), h > 0 ? perU(h, l) : T(l, 'geen gewoon uurtarief', 'no standard hourly rate')],
          [T(l, 'Wettelijk maximum kosten 2026', 'Legal maximum costs 2026'), eur(NAH_MAX, l)],
        ],
        table: { caption: T(l, 'Kosten van een naheffingsaanslag per stad (verordeningen)', 'Cost of a parking penalty by city (by-laws)'), headers: [T(l, 'Stad', 'City'), T(l, 'Kosten', 'Costs'), T(l, 'Plus', 'Plus')], align: ['l', 'r', 'l'],
          rows: Object.entries(STEDEN).map(([k, x]) => [K.city(k).n, eur(x.nah, l), x.uur ? T(l, '1 uur tarief', '1 hour rate') : T(l, 'niet betaalde belasting', 'unpaid tax')]).sort((p, q) => p[0].localeCompare(q[0], 'nl')) },
        note: T(l, 'Bezwaar maken kan binnen 6 weken na de dagtekening van de aanslag, bij de gemeente.', 'You can object within 6 weeks of the date on the assessment, with the municipality.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ P+R */
const PR_CITIES = () => K.CITIES.filter((c) => K.prZones(c).some((z) => z.p.length || z.w.length));
function prSpec(l: Lang, a?: Args): ToolSpec {
  const opts = cityOpts().filter((o) => PR_CITIES().some((c) => c.s === o.value));
  return {
    inputs: [{ kind: 'select', id: 'stad', label: T(l, 'Stad', 'City'), def: String(a?.stad ?? 'amsterdam'), options: opts }, DUUR(l, 8)],
    run: (v) => {
      const c = K.city(s(v, 'stad')), dur = Math.round(Math.min(24, Math.max(0, n(v, 'duur'))) * 60), centre = defaultZone(c);
      const street = K.stay(c, centre, 2, 540, dur).total;
      // Un P+R sans montant dans le registre (0 €) n'est pas montré : gratuit ou non renseigné, on ne sait pas.
      const prs = K.prZones(c).map((z) => ({ z, price: z.p.length ? z.p[0].a : K.stay(c, z, 2, 540, dur).total })).filter((p) => p.price > 0).sort((p, q) => p.price - q.price);
      const best = prs[0];
      return {
        label: T(l, `Goedkoopste P+R in ${c.n}`, `Cheapest P+R in ${c.n}`), value: best ? eur(best.price, l) : T(l, 'geen', 'none'),
        hyp: T(l, `${duree(dur, l)} op een dinsdag vanaf 09:00, OV-reis niet meegerekend`, `${duree(dur, l)} on a Tuesday from 9 am, public transport fare not included`),
        sub: best ? T(l, `${best.z.n}. Dezelfde tijd in het centrum (${centre.n}): ${eur(street, l)}.`, `${best.z.n}. The same time in the centre (${centre.n}): ${eur(street, l)}.`) : '',
        rows: [[T(l, 'Centrum, zelfde tijd', 'Centre, same time'), eur(street, l)], [T(l, 'Verschil', 'Difference'), best ? eur(Math.max(0, street - best.price), l) : T(l, 'n.v.t.', 'n/a')]],
        table: { caption: T(l, `P+R-terreinen in ${c.n} in het register`, `P+R sites in ${c.n} in the register`), headers: ['P+R', T(l, 'Prijs', 'Price')], align: ['l', 'r'], rows: prs.map((p) => [p.z.n, eur(p.price, l)]) },
        note: T(l, 'Het P+R-tarief geldt vaak alleen met een OV-reis naar het centrum; de voorwaarden staan bij de ingang en in de app.', 'The P+R fare often applies only with a public transport trip to the centre; the conditions are at the entrance and in the app.'),
      };
    },
  };
}

export const SPECS: Record<string, (l: Lang, arg?: Args) => ToolSpec> = {
  kosten: kostenSpec, gratis: gratisSpec, dagkaart: dagkaartSpec, vergunning: vergunningSpec, naheffing: naheffingSpec, pr: prSpec,
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
