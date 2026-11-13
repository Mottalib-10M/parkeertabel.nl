import { makeRouter, type RouteDef } from './routes-core';
import { PAGES } from '../lib/pages';
/** Néerlandais d'abord, anglais sur toutes les pages (RECETTE §3 : langue locale + anglais). */
export const LOCALES = ['nl', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'nl';
const R = (id: string, nl: string, en: string, noindex = false) => ({ id, paths: { nl: `/nl/${nl}/`, en: `/en/${en}/` }, ...(noindex ? { noindex } : {}) });
const CORE: RouteDef<Locale>[] = [
  { id: 'home', paths: { nl: '/nl/', en: '/en/' } },
  R('method', 'methode', 'method'),
  R('about', 'over-ons', 'about'),
  R('widget', 'widget', 'widget', true),
  R('contact', 'contact', 'contact', true),
  R('editorial', 'redactiebeleid', 'editorial-policy', true),
  R('privacy', 'privacy', 'privacy', true),
  R('terms', 'disclaimer', 'legal-notice', true),
  R('cookies', 'cookies', 'cookies', true),
];
const P = (p: (typeof PAGES)[number]): RouteDef<Locale> => ({ id: p.id, paths: { nl: `/nl/${p.nl.slug}/`, en: `/en/${p.en.slug}/` } });
export const ROUTES: RouteDef<Locale>[] = [CORE[0], ...PAGES.map(P), ...CORE.slice(1)];
export const { NOINDEX_PATHS, route, hasRoute, altPaths } = makeRouter(LOCALES, ROUTES);
