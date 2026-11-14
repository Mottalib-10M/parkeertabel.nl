/**
 * Couverture du site : une seule source pour « combien de villes, combien de zones » (testeurs naïfs du 2026-11-14 :
 * « 24 steden en 831 straatzones » sur l'accueil et la méthode, « 16 steden » et « 686 zones » ailleurs).
 * Toutes les villes du registre réduit (src/data/npr/lite.json) sont dans la rekenhulp et dans les tableaux ;
 * une zone compte si c'est une zone de rue avec des heures payantes (K.streetZones), partout la même définition.
 */
import * as K from './engine/parking';
import { CITY_PAGES } from './planned';

/** Les villes couvertes, dans l'ordre de l'index du registre. */
export const COVER: string[] = K.CITY_INDEX.cities.map((c) => c.slug).filter((s) => K.CITIES.some((c) => c.s === s));
export const N_CITIES = COVER.length;
/** Zones de rue payantes, toutes villes couvertes. */
export const N_ZONES = COVER.reduce((a, s) => a + K.streetZones(K.city(s)).length, 0);
/** Villes qui ont leur propre page. */
export const N_CITY_PAGES = CITY_PAGES.length;
