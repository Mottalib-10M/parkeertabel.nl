/** Mini-simulateurs de la trame (RECETTE §9.3), lus par calc/MiniSim et calc/MiniSimAutonome.
 *  Ce site n'en déclare aucun : chaque page porte le calculateur complet de son sujet (SpecTool), et le
 *  mini-simulateur propre au site (calc/MiniSimOutil) lit lib/tool-specs.ts. */
import type { MiniSpec } from './mini-types';
const SPECS: Record<string, (lang: string) => MiniSpec> = {};
export function getSpec(kind: string, lang: string): MiniSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`mini-spec inconnue : ${kind}`);
  return f(lang);
}
