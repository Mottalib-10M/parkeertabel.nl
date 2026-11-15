import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm } from './_f';

const f = facts('nijmegen');
const st = f.st!;
const pr = f.prs[0];

export default definePage({
  id: 'nijmegen', group: 'stad', order: 11, tool: 'kosten', toolArg: { stad: 'nijmegen' }, city: 'nijmegen',
  related: ['home', 'pr', 'vergunning', 'gratis'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_geo', 'vo_nijmegen'],
  nl: {
    slug: 'parkeren-nijmegen',
    nav: 'Parkeren in Nijmegen', card: `Centrum ${eur(f.z.h, 'nl')} per uur, P+R Nijmegen-Noord, vergunning vanaf ${eur(12, 'nl')} per jaar`,
    title: 'Parkeren Nijmegen 2026: tarief centrum, P+R en tijden',
    description: `Parkeren in Nijmegen in 2026: ${eur(f.z.h, 'nl')} per uur in het centrum, ${eur(f.rates[1], 'nl')} in de schil, betalen tot ${hhmm(f.tue[0][1])}, de P+R aan de noordkant en goedkope bewonersvergunningen.`,
    h1: 'Parkeren in Nijmegen 2026: centrum, schil en P+R',
    intro: 'Parkeren in Nijmegen kost in het centrum het meest, maar bewoners betalen weinig voor een vergunning. Kies uw zone, de dag en de tijd: het bedrag volgt direct.',
    resume: `Nijmegen heeft ${num(f.zs.length, 'nl')} betaalde straatzones in het Nationaal Parkeer Register. In ${num(f.byRate[0].n, 'nl')} zones, waaronder ${f.zn}, kost een uur ${eur(f.z.h, 'nl')}. De grootste groep, ${num(f.byRate.find((x) => x.h === f.rates[1])?.n ?? 0, 'nl')} zones, rekent ${eur(f.rates[1], 'nl')}. In het centrum betaalt u doordeweeks en op zaterdag van ${hhmm(f.tue[0][0])} tot ${hhmm(f.tue[0][1])}; op zondag alleen van ${hhmm(f.sun[0][0])} tot ${hhmm(f.sun[0][1])}. Twee uur in de binnenstad kosten ${eur(f.cost2h, 'nl')}. In ${num(f.sundayFree, 'nl')} zones is zondag gratis. Aan de overkant van de Waal ligt ${pr ? pr.n.replace(/\s*\(Nijmegen\)/, '') : 'een P+R-terrein'}, het enige P+R-terrein van de stad in het register, met een dagkaart van ${eur(pr?.p[0]?.a ?? 0, 'nl')} en een weekkaart van ${eur(pr?.p[1]?.a ?? 0, 'nl')}. Bijzonder zijn de lage vergunningen: een eerste bewonersvergunning kost volgens de verordening ${eur(st.verg.bedrag, 'nl')} per jaar, en in een deel van de stad nog minder. De kosten van een naheffing zijn ${eur(st.nah, 'nl')}.`,
    faqs: [
      { q: 'Waarom is een bewonersvergunning in Nijmegen zo goedkoop?', a: `De verordening parkeerbelastingen 2026 noemt ${eur(st.verg.bedrag, 'nl')} of ${eur(12, 'nl')} per jaar voor de eerste vergunning, afhankelijk van het gebied. De tweede vergunning kost veel meer. De gemeente legt in de verordening niet uit waarom; vergeleken met andere steden op deze site is de eerste vergunning in Nijmegen laag.` },
      { q: 'Waar is de P+R in Nijmegen?', a: `In het register staat ${pr ? pr.n.replace(/\s*\(Nijmegen\)/, '') : 'één P+R-terrein'}, ten noorden van de Waal. Van daaruit bereikt u het centrum met het openbaar vervoer of de fiets over de brug. Het tarief in het register is lager dan een dag in het centrum. Voorwaarden staan bij de ingang.` },
      { q: 'Wat is de zone Woonboulevard Wijchenseweg?', a: 'Een zone bij de woonwinkels aan de Wijchenseweg, met een eigen tarief dat in het register anders is opgebouwd dan een gewoon uurtarief. Kies de zone in de rekenhulp om te zien wat uw bezoek kost. Ook daar gelden de borden ter plaatse als ze afwijken.' },
    ],
    body: (h) => `<h2>Parkeren in Nijmegen per zone</h2>
<p>Vier uurtarieven, met het centrum bovenaan. De meeste zones liggen in de schil rond de binnenstad.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('nijmegen', 'nl'), 'Straatzones in Nijmegen per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>Nijmegen levert de grenzen van alle zones aan het register. Met de adreszoeker bovenaan vindt u zo uw zone, ook in de wijken buiten het centrum. Het nummer op de automaat in de straat gaat voor als het afwijkt.</p>
<h2>Betaaltijden in het centrum</h2>
<p>Lange werkdagen, een korte zondag. Wie op zondagavond in de stad is, parkeert gratis. Op een gewone dinsdag betaalt u in het centrum van negen uur ’s ochtends tot elf uur ’s avonds; een avond in de schouwburg of een restaurant telt dus gewoon mee.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('nijmegen', 'nl'), `Betaaltijden in ${f.zn}`)}
<h2>P+R, vergunning en naheffing</h2>
<p>Voor een dag in Nijmegen is de ${h.a('pr', 'P+R')} de goedkoopste keuze in het register. ${st.verg.nl}. Een naheffingsaanslag kost ${h.eur(st.nah)}. Bron: de ${h.src('vo_nijmegen', 'verordening parkeerbelastingen gemeente Nijmegen 2026')}. Vergelijk met andere steden op ${h.a('vergunning', 'de vergunningspagina')}.</p>`,
  },
  en: {
    slug: 'parking-nijmegen',
    nav: 'Parking in Nijmegen', card: `Centre ${eur(f.z.h, 'en')} an hour, P+R Nijmegen-Noord, permits from ${eur(12, 'en')} a year`,
    title: 'Parking Nijmegen 2026: centre rate, P+R and paid hours',
    description: `Parking in Nijmegen in 2026: ${eur(f.z.h, 'en')} an hour in the centre, ${eur(f.rates[1], 'en')} in the ring, paid until ${hhmm(f.tue[0][1])}, park-and-ride north of the Waal and low resident permits.`,
    h1: 'Parking in Nijmegen 2026: centre, ring and P+R',
    intro: 'Parking in Nijmegen costs most in the centre, but residents pay little for a permit. Pick your zone, the day and the time: the amount follows straight away.',
    resume: `Nijmegen has ${num(f.zs.length, 'en')} paid street zones in the National Parking Register. In ${num(f.byRate[0].n, 'en')} zones, including ${f.zn}, an hour costs ${eur(f.z.h, 'en')}. The largest group, ${num(f.byRate.find((x) => x.h === f.rates[1])?.n ?? 0, 'en')} zones, charges ${eur(f.rates[1], 'en')}. In the centre you pay on weekdays and Saturday from ${hhmm(f.tue[0][0])} to ${hhmm(f.tue[0][1])}; on Sunday only from ${hhmm(f.sun[0][0])} to ${hhmm(f.sun[0][1])}. Two hours in the old town cost ${eur(f.cost2h, 'en')}. In ${num(f.sundayFree, 'en')} zones Sunday is free. Across the Waal river lies ${pr ? pr.n.replace(/\s*\(Nijmegen\)/, '') : 'a park-and-ride site'}, the city’s only park-and-ride site in the register, with a day ticket of ${eur(pr?.p[0]?.a ?? 0, 'en')} and a weekly ticket of ${eur(pr?.p[1]?.a ?? 0, 'en')}. Residents get a good deal on permits, which are notably cheap here: a first resident permit costs ${eur(st.verg.bedrag, 'en')} a year under the by-law, and less in part of the city. The costs of a parking penalty are ${eur(st.nah, 'en')}.`,
    faqs: [
      { q: 'Why is a resident permit so cheap in Nijmegen?', a: `The 2026 parking tax by-law sets ${eur(st.verg.bedrag, 'en')} or ${eur(12, 'en')} a year for the first permit, depending on the area. The second permit costs much more. The by-law does not explain why; compared with the other cities on this site, Nijmegen’s first permit is low.` },
      { q: 'Where is the park-and-ride in Nijmegen?', a: `The register lists ${pr ? pr.n.replace(/\s*\(Nijmegen\)/, '') : 'one park-and-ride site'}, north of the Waal. From there you reach the centre by public transport or by bike over the bridge. Its rate in the register is lower than a day in the centre. Conditions are posted at the entrance.` },
      { q: 'What is the Woonboulevard Wijchenseweg zone?', a: 'A zone by the furniture and home stores on the Wijchenseweg, with its own fare that the register builds differently from a plain hourly rate. Pick the zone in the calculator to see what your visit costs. There too, signs on the spot apply if they differ.' },
    ],
    body: (h) => `<h2>Parking in Nijmegen by zone</h2>
<p>Four hourly rates, with the centre at the top. Most zones lie in the ring around the old town.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('nijmegen', 'en'), 'Street zones in Nijmegen by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>Nijmegen supplies the outlines of every zone to the register. With the address search at the top you find your zone, in the districts outside the centre too. The number on the meter in the street applies if it differs.</p>
<h2>Paid hours in the centre</h2>
<p>Long working days, a short Sunday. If you are in town on Sunday evening, you park for free. On an ordinary Tuesday you pay in the centre from nine in the morning until eleven at night, so an evening at the theatre or a restaurant still counts.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('nijmegen', 'en'), `Paid hours in ${f.zn}`)}
<h2>Park and ride, permits and penalties</h2>
<p>For a day in Nijmegen, ${h.a('pr', 'park and ride')} is the cheapest option in the register. ${st.verg.en}. A parking penalty carries ${h.eur(st.nah)}. Source: the ${h.src('vo_nijmegen', 'Nijmegen 2026 parking tax by-law')}. Compare other cities on ${h.a('vergunning', 'the permit page')}.</p>`,
  },
});
