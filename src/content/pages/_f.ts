/** Chiffres partagés par les pages (non chargé comme page : préfixe _). Tout vient du registre NPR ou de params-2026.json. */
import * as K from '../../lib/engine/parking';
import { defaultZone, STEDEN, NAH_MAX, spansText, dayName } from '../../lib/tool-specs';
import { formatMoney, formatNumber, displayDate, hhmm, duree } from '../../lib/format';
import P from '../../data/params-2026.json';
export type L = 'nl' | 'en';
export const eur = (x: number, l: L) => formatMoney(x, 2, l);
export const num = (x: number, l: L, d = 0) => formatNumber(x, d, l);
export const day = (iso: string, l: L) => displayDate(iso, l);
export { hhmm, duree, dayName, spansText, STEDEN, NAH_MAX, P, K };
export const READ = K.READ;

/** Les faits d'une ville, calculés une fois : zones, fourchette horaire, zone centrale, coût type, tickets, P+R. */
export function facts(slug: string) {
  const c = K.city(slug), info = K.cityInfo(slug), z = defaultZone(c);
  const zs = K.streetZones(c);
  const sundayFree = zs.filter((x) => K.paidSpans(c, x, 7).length === 0).length;
  const eveningFree = zs.filter((x) => !K.winAt(c, x, 2, 20 * 60)).length;
  const tue = K.paidSpans(c, z, 2), sat = K.paidSpans(c, z, 6), sun = K.paidSpans(c, z, 7);
  const cost2h = K.stay(c, z, 2, 600, 120).total, cost4h = K.stay(c, z, 2, 600, 240).total, cost8h = K.stay(c, z, 2, 540, 480).total;
  const tickets = zs.filter((x) => x.p.length > 0).length;
  const prs = K.prZones(c);
  const rates = [...new Set(zs.map((x) => x.h).filter((h) => h > 0))].sort((a, b) => b - a);
  const byRate = rates.map((h) => ({ h, n: zs.filter((x) => x.h === h).length }));
  const odd = zs.filter((x) => x.x);
  const st = STEDEN[slug];
  return { c, info, z, zs, sundayFree, eveningFree, tue, sat, sun, cost2h, cost4h, cost8h, tickets, prs, rates, byRate, odd, st,
    best: z.p[0], hours: K.paidHoursWeek(c, z), freeDays: K.freeDays(c, z) };
}
/** Tableau « zones et tarifs » : les zones de rue d'une ville regroupées par tarif horaire (jusqu'à `max` lignes). */
export function rateRows(slug: string, l: L, max = 8): string[][] {
  const f = facts(slug);
  return f.byRate.slice(0, max).map(({ h, n }) => {
    const ex = f.zs.filter((x) => x.h === h).slice(0, 3).map((x) => x.n).join(', ');
    return [eur(h, l), num(n, l), ex];
  });
}
/** Lignes « jour : heures payantes » de la zone centrale. */
export const weekRows = (slug: string, l: L) => { const f = facts(slug); return [1, 2, 3, 4, 5, 6, 7].map((d) => [dayName(d, l), spansText(f.c, f.z, d, l)]); };

/** Lien vers la page ville si elle existe, sinon le nom seul. */
import { CITY_PAGES } from '../../lib/planned';
export { CITY_PAGES };
/** Villes couvertes (rekenhulp et tableaux) et leur nombre : une seule source, src/lib/couverture.ts. */
export { COVER, N_CITIES, N_ZONES } from '../../lib/couverture';
export const cityLink = (h: { a: (id: string, t: string) => string }, slug: string, name: string) => (CITY_PAGES.includes(slug) ? h.a(slug, name) : name);
/** Coût annuel d'une vergunning (bedrag + per). */
export const yearOf = (x: { bedrag: number; per: string }) => (x.per === 'maand' ? x.bedrag * 12 : x.per === 'kwartaal' ? x.bedrag * 4 : x.bedrag);
