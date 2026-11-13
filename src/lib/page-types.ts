/**
 * Une page = UN fichier de contenu : `src/content/pages/<id>.ts`, avec la version néerlandaise (`nl`) et
 * anglaise (`en`) côte à côte. Routes, menus, sitemap, hreflang, schémas et liens internes lisent ces fichiers.
 */
import type { Kit } from './kit';
import type { Lang } from './format';

/** `open` : question ouverte d'emblée (la question que se pose le visiteur type de la page). */
export interface FAQ { q: string; a: string; open?: boolean }
export interface MiniOpts { /** titre */ t?: string; /** champs montrés */ p?: string[]; /** valeurs par défaut */ d?: Record<string, number | string>; /** texte du lien */ c?: string }

export interface Helpers extends Kit {
  lang: Lang;
  /** Lien interne par id de page, dans la langue de la page. Id inconnu = test en échec. */
  a: (id: string, text: string) => string;
  /** Tableau ; les nombres sont formatés dans la langue, les chaînes insérées en HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Lien vers une source de params-2026.json (clé). */
  src: (key: string, text?: string) => string;
  ext: (url: string, text: string) => string;
  box: (title: string, html: string) => string;
  /** Mini-simulateur bâti sur un calculateur de tool-specs.ts. */
  mini: (kind: string, opts?: MiniOpts) => string;
  /** Formats de la langue : nombre, euros, date (AAAA-MM-JJ), heure (minutes → hh:mm), durée. */
  n: (x: number, d?: number) => string; eur: (x: number, d?: number) => string; day: (iso: string) => string; hm: (min: number) => string; dur: (min: number) => string;
}

export type Group = 'randstad' | 'stad' | 'thema';

export interface LangPage {
  /** Segment d'URL, minuscules et tirets, sans accent. */
  slug: string;
  nav: string; card: string;
  /** 50 à 60 caractères, terme clé d'abord, année comprise (RECETTE §11). */
  title: string;
  /** 150 à 160 caractères, année comprise. */
  description: string;
  h1: string; intro: string;
  /** UN paragraphe de 120 mots ou plus : la réponse directe, chiffrée (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
}
export interface PageDef {
  id: string; group: Group; order: number;
  /** Outil en tête : une clé de tool-specs.ts. */
  tool: string;
  toolArg?: Record<string, number | string>;
  /** Ville NPR dont les données nourrissent l'outil de tête (slug de src/data/npr). */
  city?: string;
  related: string[];
  /** Clés de params-2026.json > sources. */
  sources: string[];
  nl: LangPage; en: LangPage;
}
export const definePage = (p: PageDef): PageDef => p;
