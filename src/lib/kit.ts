/**
 * Kit de rédaction : tout chiffre écrit dans une page vient d'ici, jamais tapé à la main.
 *   K.P        paramètres datés (params-2026.json : verordeningen, sources)
 *   K.NPR      moteur et données du Nationaal Parkeer Register (engine/parking.ts)
 *   K.tool(kind, lang, args, valeurs)  lance une rekenhulp de tool-specs.ts
 */
import P from '../data/params-2026.json';
import * as NPR from './engine/parking';
import { runTool, STEDEN, NAH_MAX, defaultZone, spansText, dayName } from './tool-specs';
import { LAST_UPDATED } from '../data/site-config';

export const KIT = { P, NPR, STEDEN, NAH_MAX, defaultZone, spansText, dayName, tool: runTool, LECTURA: LAST_UPDATED };
export type Kit = typeof KIT;
