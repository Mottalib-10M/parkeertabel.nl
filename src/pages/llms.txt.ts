/** llms.txt (RECETTE §21), généré à partir du registre de pages. */
import { PAGES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { CITY_INDEX, READ } from '../lib/engine/parking';
import P from '../data/params-2026.json';
import { N_CITIES } from '../lib/couverture';
export function GET() {
  const top = [...CITY_INDEX.cities].sort((a, b) => b.hMax - a.hMax).slice(0, 6).map((c) => `${c.name} ${c.hMin.toFixed(2)}-${c.hMax.toFixed(2)} EUR/h`).join(', ');
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> Street parking costs in ${N_CITIES} Dutch cities (Dutch and English): zone, paid hours by weekday, hourly rate, day tickets, park-and-ride, resident permits and penalty costs. Rates and hours come from the National Parking Register (Open Data Parkeren, RDW, CC0 licence), read on ${READ}; resident permit and penalty amounts from each municipality's 2026 parking tax by-law (CVDR), read on ${P.retrieved_at}. Street hourly ranges: ${top}. Legal cap on penalty costs in 2026: ${P.naheffingMax.bedrag.toFixed(2)} EUR. Browser-only calculators; an address typed into the address search goes only to PDOK Locatieserver. Independent site published by Radif Partners: not a municipality, a parking operator or a payment app. The register is re-read automatically every Monday; by-law amounts are updated by hand. Last updated ${LAST_UPDATED}.`, '',
    `- [Parkeerkosten berekenen](${SITE_URL}${route('home', 'nl')})`, `- [Parking cost calculator](${SITE_URL}${route('home', 'en')})`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label.en} / ${g.label.nl}`, ...PAGES.filter((p) => p.group === g.id).flatMap((p) => [
      `- [${p.nl.nav}](${SITE_URL}${route(p.id, 'nl')}): ${p.nl.card}`,
      `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`,
    ]), '']),
    '## About', `- [Methode](${SITE_URL}${route('method', 'nl')})`, `- [Method](${SITE_URL}${route('method', 'en')})`, `- [Over ons](${SITE_URL}${route('about', 'nl')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
