/** Formatage localisé, une locale par langue de page (RECETTE §4) : « 8,01 € » en néerlandais,
 *  « €8.01 » en anglais. Chaque fonction prend la langue. */
import { NUM_TAGS, CURRENCY } from '../data/site-config';

export type Lang = 'nl' | 'en';
const cache = new Map<string, Intl.NumberFormat>();
function nf(lang: Lang, opts: Intl.NumberFormatOptions): Intl.NumberFormat {
  const k = lang + JSON.stringify(opts);
  if (!cache.has(k)) cache.set(k, new Intl.NumberFormat(NUM_TAGS[lang] ?? 'nl-NL', opts));
  return cache.get(k)!;
}
export function formatMoney(value: number, decimals = 2, lang: Lang = 'nl'): string {
  const v = Math.abs(value) < 0.005 ? 0 : value;
  return nf(lang, { style: 'currency', currency: CURRENCY, minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);
}
export function formatNumber(value: number, decimals = 0, lang: Lang = 'nl'): string {
  return nf(lang, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
}
/** Nombre tiré des paramètres dans un texte : décimales utiles seulement (RECETTE §4.1). */
export function formatDecimal(value: number, max = 2, lang: Lang = 'nl'): string {
  return nf(lang, { maximumFractionDigits: max }).format(value);
}
/** Taux : espace insécable avant % en néerlandais, collé en anglais. */
export function formatPercent(value: number, decimals = 1, lang: Lang = 'nl'): string {
  return nf(lang, { style: 'percent', minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value).replace(/(\d)\s?%/, lang === 'nl' ? '$1 %' : '$1%');
}
export function parseLocaleNumber(input: string): number {
  const cleaned = input.replace(/[^\d.,-]/g, '');
  const lastComma = cleaned.lastIndexOf(','), lastDot = cleaned.lastIndexOf('.');
  let s = cleaned;
  if (/^-?\d{1,3}(,\d{3})+$/.test(cleaned)) s = cleaned.replace(/,/g, '');
  else if (lastComma > lastDot) s = cleaned.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(cleaned)) s = cleaned.replace(/\./g, '');
  else s = cleaned.replace(/,/g, '');
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}
/** Date en toutes lettres, dans la langue de la page. Accepte une étiquette de langue (« nl-NL ») ou une langue du site. */
export function displayDate(iso: string, langTag: string): string {
  const tag = NUM_TAGS[langTag] ?? (langTag.startsWith('en') ? 'en-GB' : langTag);
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(tag, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
/** Heure « 9:00 » / « 09:00 » à partir de minutes depuis minuit ; 1440 → « 24:00 ». */
export function hhmm(min: number): string {
  const h = Math.floor(min / 60), m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
/** Durée en mots : « 2 u 30 » / « 2 h 30 », « 45 min ». */
export function duree(min: number, lang: Lang): string {
  const h = Math.floor(min / 60), m = Math.round(min % 60);
  const u = lang === 'nl' ? 'u' : 'h';
  if (h === 0) return `${m} min`;
  return m ? `${h} ${u} ${String(m).padStart(2, '0')}` : `${h} ${u}`;
}
