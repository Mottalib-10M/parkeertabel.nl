import { route, hasRoute, type Locale } from './routes';
import { PAGES, pageById } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  nl: { home: 'Wat kost parkeren hier?', method: 'Hoe wij rekenen', about: 'Over ons', widget: 'Rekenhulp insluiten', contact: 'Contact', editorial: 'Redactiebeleid', privacy: 'Privacy', terms: 'Juridische informatie', cookies: 'Cookies' },
  en: { home: 'What does parking cost here?', method: 'How we calculate', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' },
};
export const GROUPS: Array<{ id: Group; label: Record<Locale, string> }> = [
  { id: 'randstad', label: { nl: 'Randstad', en: 'Randstad cities' } },
  { id: 'stad', label: { nl: 'Andere steden', en: 'Other cities' } },
  { id: 'thema', label: { nl: 'Vergunning, boete, gratis', en: 'Permits, penalties, free parking' } },
];
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? pageById(id)?.[lang]?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => PAGES.filter((p) => p.group === g && hasRoute(p.id, lang)).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return GROUPS.map((g) => ({ label: g.label[lang], links: inGroup(g.id, lang) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => {
  const site = { label: { nl: 'Deze site', en: 'This site' }[lang], links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) };
  return [...navCategories(lang), site];
};
/** Les pages les plus demandées, à un clic de partout (RECETTE §18.2) : les quatre villes à 10 k – 100 k. */
export const popularLinks = (lang: Locale): NavLink[] => [link('home', lang), ...['amsterdam', 'utrecht', 'rotterdam', 'den-haag', 'vergunning'].filter((id) => hasRoute(id, lang)).map((id) => link(id, lang))];
