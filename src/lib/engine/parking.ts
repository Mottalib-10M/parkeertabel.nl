/**
 * Moteur de calcul du stationnement, sur les données du Nationaal Parkeer Register (RDW, CC0) réduites par
 * scripts/build-npr.py (src/data/npr/lite.json). Fonctions pures : aucune donnée n'est tapée à la main ici.
 *   Fenêtre `w` : [jour, début, fin, code tarif, durée max]  (jour 1 = lundi … 7 = dimanche, 'F' = jour férié ;
 *   début et fin en minutes depuis minuit, fin exclue).
 *   Tarif : tranches { a, b, amt, step } ; coût d'une durée = Σ ceil(part de la tranche / step) × amt (méthode NPR).
 */
import LITE from '../../data/npr/lite.json';
import INDEX from '../../data/npr/index.json';

export type Day = number | 'F';
export type Win = [Day, number, number, string, number];
export interface Part { a: number; b: number; amt: number; step: number }
export interface Zone { i: string; n: string; k: 'straat' | 'pr' | 'garage'; g: boolean; h: number; x: boolean; w: Win[]; p: Array<{ l: string; a: number }> }
export interface City { s: string; n: string; z: Zone[]; f: Record<string, Part[]> }
export const CITIES = LITE as unknown as City[];
export const CITY_INDEX = INDEX as { read: string; cities: Array<{ slug: string; name: string; mgr: string; zones: number; pr: number; garages: number; geo: number; hMin: number; hMax: number }> };
export const READ = CITY_INDEX.read;

export const city = (slug: string): City => CITIES.find((c) => c.s === slug) ?? CITIES[0];
export const cityInfo = (slug: string) => CITY_INDEX.cities.find((c) => c.slug === slug)!;
export const streetZones = (c: City) => c.z.filter((z) => z.k === 'straat' && z.w.length > 0);
export const prZones = (c: City) => c.z.filter((z) => z.k === 'pr');
export const zone = (c: City, id: string): Zone => c.z.find((z) => z.i === id) ?? streetZones(c)[0] ?? c.z[0];

/** Coût d'une durée (minutes) sur un tarif. */
export function fareCost(parts: Part[], minutes: number): number {
  let t = 0;
  for (const p of parts) {
    if (minutes <= p.a) continue;
    const span = Math.min(minutes, p.b) - p.a;
    if (span > 0) t += Math.ceil(span / p.step - 1e-9) * p.amt;
  }
  return Math.round(t * 100) / 100;
}
export const hourly = (c: City, code: string) => fareCost(c.f[code] ?? [], 60);

const nextDay = (d: Day): Day => (d === 'F' ? 1 : (d % 7) + 1);
/** La fenêtre payante qui couvre une minute d'un jour (la plus chère si deux se chevauchent). */
export function winAt(c: City, z: Zone, d: Day, m: number): Win | undefined {
  let best: Win | undefined;
  for (const w of z.w) if (w[0] === d && w[1] <= m && m < w[2] && (!best || hourly(c, w[3]) > hourly(c, best[3]))) best = w;
  // Jour férié sans fenêtre propre : la gemeente applique alors le tarif du jour de la semaine, que l'outil ne connaît pas.
  return best;
}
export const hasHoliday = (z: Zone) => z.w.some((w) => w[0] === 'F');

export interface Segment { from: number; to: number; win?: Win; cost: number }
export interface Stay { total: number; paid: number; free: number; segments: Segment[]; overMax: boolean; maxMin: number }
/** Coût d'un stationnement : jour d'arrivée, heure d'arrivée (minutes), durée (minutes). Chaque fenêtre payante
 *  traversée est facturée à part, depuis sa première minute (comme un nouvel enregistrement dans l'application). */
export function stay(c: City, z: Zone, d: Day, start: number, minutes: number): Stay {
  const segs: Segment[] = [];
  let day = d, m = start;
  for (let i = 0; i < minutes; i++) {
    if (m >= 1440) { m -= 1440; day = nextDay(day); }
    const w = winAt(c, z, day, m);
    const last = segs[segs.length - 1];
    if (last && last.win === w && last.to === i) last.to = i + 1;
    else segs.push({ from: i, to: i + 1, win: w, cost: 0 });
    m++;
  }
  let paid = 0, overMax = false, maxMin = 0;
  for (const s of segs) {
    if (!s.win) continue;
    const len = s.to - s.from;
    s.cost = fareCost(c.f[s.win[3]] ?? [], len);
    paid += len;
    if (s.win[4] > 0) { maxMin = maxMin ? Math.min(maxMin, s.win[4]) : s.win[4]; if (len > s.win[4]) overMax = true; }
  }
  const total = Math.round(segs.reduce((a, s) => a + s.cost, 0) * 100) / 100;
  return { total, paid, free: minutes - paid, segments: segs, overMax, maxMin };
}

/** Plages payantes d'un jour, fusionnées : [[début, fin, €/h], …]. */
export function paidSpans(c: City, z: Zone, d: Day): Array<[number, number, number]> {
  const ws = z.w.filter((w) => w[0] === d).sort((a, b) => a[1] - b[1]);
  const out: Array<[number, number, number]> = [];
  for (const w of ws) {
    const h = hourly(c, w[3]);
    const last = out[out.length - 1];
    if (last && w[1] <= last[1] && h === last[2]) last[1] = Math.max(last[1], w[2]);
    else out.push([w[1], w[2], h]);
  }
  return out;
}
/** Première minute gratuite à partir d'un moment (jour, minute), au plus 7 jours plus loin : [jour, minute] ou null. */
export function nextFree(c: City, z: Zone, d: Day, m: number): [Day, number] | null {
  let day = d, t = m;
  for (let i = 0; i < 7 * 1440; i++) {
    if (t >= 1440) { t -= 1440; day = nextDay(day); }
    if (!winAt(c, z, day, t)) return [day, t];
    t++;
  }
  return null;
}
/** Nombre de jours de la semaine (lundi à dimanche) entièrement gratuits dans la zone. */
export const freeDays = (c: City, z: Zone) => [1, 2, 3, 4, 5, 6, 7].filter((d) => paidSpans(c, z, d).length === 0);
/** Heures payantes par semaine (lundi à dimanche). */
export const paidHoursWeek = (c: City, z: Zone) => [1, 2, 3, 4, 5, 6, 7].reduce((a, d) => a + paidSpans(c, z, d).reduce((x, s) => x + (s[1] - s[0]), 0), 0) / 60;

/** Durée à partir de laquelle le ticket fixe (dagkaart) coûte moins que le tarif horaire, en minutes, ou null. */
export function breakEven(c: City, z: Zone, d: Day, start: number, price: number, maxMin = 1440): number | null {
  for (let t = 15; t <= maxMin; t += 15) if (stay(c, z, d, start, t).total >= price) return t;
  return null;
}

/* ------------------------------------------------------------------ adresse → zone */
/** Point dans un anneau (lon, lat), méthode du rayon. */
export function inRing(pt: [number, number], ring: number[][]): boolean {
  let ins = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) ins = !ins;
  }
  return ins;
}
export function zoneAt(geo: Array<{ id: string; rings: number[][][] }>, pt: [number, number]): string | null {
  for (const g of geo) if (g.rings.some((r) => inRing(pt, r))) return g.id;
  return null;
}
