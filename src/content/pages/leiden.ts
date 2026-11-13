import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm } from './_f';

const f = facts('leiden');
const st = f.st!;
const pr = f.prs[0];

export default definePage({
  id: 'leiden', group: 'randstad', order: 7, tool: 'kosten', toolArg: { stad: 'leiden' }, city: 'leiden',
  related: ['home', 'dagkaart', 'pr', 'vergunning'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_geo', 'vo_leiden'],
  nl: {
    slug: 'parkeren-leiden',
    nav: 'Parkeren in Leiden', card: `Binnenstad ${eur(f.z.h, 'nl')} per uur tot ${hhmm(f.tue[0][1])}, dagkaarten en P+R Haagweg`,
    title: 'Parkeren Leiden 2026: tarief binnenstad, dagkaart en P+R',
    description: `Parkeren in Leiden in 2026: ${eur(f.z.h, 'nl')} per uur in de binnenstad tot ${hhmm(f.tue[0][1])}, zondag vanaf ${hhmm(f.sun[0][0])}, dagkaarten in veel zones en het P+R-terrein aan de Haagweg.`,
    h1: 'Parkeren in Leiden 2026: binnenstad, dagkaart en P+R',
    intro: `Parkeren in Leiden is overzichtelijk: één duur tarief in de binnenstad, een lager tarief eromheen. Kies zone, dag en tijd en de rekenhulp toont het bedrag.`,
    resume: `Leiden heeft ${num(f.zs.length, 'nl')} betaalde straatzones in het Nationaal Parkeer Register. In de binnenstad, ${f.z.n}, kost een uur ${eur(f.z.h, 'nl')}; in ${num(f.byRate.find((x) => x.h === f.rates[1])?.n ?? 0, 'nl')} zones rond het centrum is het ${eur(f.rates[1], 'nl')}. De betaaltijden zijn korter dan in de grote steden: doordeweeks en op zaterdag van ${hhmm(f.tue[0][0])} tot ${hhmm(f.tue[0][1])}, op zondag van ${hhmm(f.sun[0][0])} tot ${hhmm(f.sun[0][1])}. Twee uur in de binnenstad kosten ${eur(f.cost2h, 'nl')}, een dag van acht uur ${eur(f.cost8h, 'nl')}. Bijzonder is het aantal dagkaarten: in ${num(f.tickets, 'nl')} zones staat er een in het register. Wie met de auto naar Leiden komt voor een hele dag, kan ook de P+R ${pr ? pr.n.replace(/^P\+R\s*/, '').replace(/\s*\(Leiden\)/, '') : ''} gebruiken. De laatst gepubliceerde verordening, die van 2025, zet de kosten van een naheffingsaanslag op ${eur(st.nah, 'nl')}. Een eerste bewonersvergunning kost volgens diezelfde tabel ${eur(st.verg.bedrag, 'nl')} per jaar of een bedrag per kwartaal, afhankelijk van de zone.`,
    faqs: [
      { q: 'Tot hoe laat moet je in Leiden betalen voor parkeren?', a: `In de binnenstad tot ${hhmm(f.tue[0][1])}, ook op zondag. Daarna parkeert u gratis tot de volgende ochtend om ${hhmm(f.tue[0][0])}. Op zondag begint het betalen pas om ${hhmm(f.sun[0][0])}. Andere zones kunnen andere tijden hebben: kies uw zone in de rekenhulp voor de tabel per dag.` },
      { q: 'Welke verordening gebruikt deze site voor Leiden?', a: 'De verordening parkeerbelastingen van Leiden voor 2025, de laatst gepubliceerde in de officiële databank met lokale regelgeving toen wij keken. Een versie voor 2026 vonden wij daar nog niet. De straattarieven komen niet uit die verordening, maar uit het Nationaal Parkeer Register, dat de gemeente zelf bijhoudt.' },
      { q: 'Is een dagkaart in Leiden de moeite waard?', a: `Dat hangt af van de zone en de duur. In de binnenstad kost acht uur per uur betaald ${eur(f.cost8h, 'nl')}. In ${num(f.tickets, 'nl')} zones staat een dagkaart in het register; kies zo’n zone in de dagkaart-rekenhulp en u ziet vanaf welk uur de kaart goedkoper is.` },
    ],
    body: (h) => `<h2>Parkeren in Leiden per zone</h2>
<p>Leiden kent drie uurtarieven. Het hoogste geldt alleen in de binnenstad zelf, het middelste in de wijken eromheen. Het laagste, een paar dubbeltjes per uur, hoort bij bijzondere plekken.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('leiden', 'nl'), 'Straatzones in Leiden per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>De gemeente levert de zonegrenzen aan het register. Met de adreszoeker bovenaan ziet u dus in een paar seconden in welke zone een adres ligt, ook buiten het centrum.</p>
<h2>Betaaltijden in de binnenstad</h2>
<p>De avond is vroeg gratis, de zondagochtend ook. Voor een avond uit in Leiden hoeft u na negen uur niet meer te betalen. Wie vroeg in de ochtend komt, voor de markt of het station, parkeert tot negen uur ook gratis.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('leiden', 'nl'), `Betaaltijden in ${f.z.n}`)}
<h2>Dagkaart, P+R, vergunning en boete</h2>
<p>Voor een lange dag is een ${h.a('dagkaart', 'dagkaart')} of de ${h.a('pr', 'P+R')} vaak goedkoper dan per uur betalen. ${st.verg.nl}. Een naheffingsaanslag kost ${h.eur(st.nah)} aan kosten. Bron voor beide: de ${h.src('vo_leiden', 'Leidse verordening parkeerbelastingen')}.</p>`,
  },
  en: {
    slug: 'parking-leiden',
    nav: 'Parking in Leiden', card: `Old town ${eur(f.z.h, 'en')} an hour until ${hhmm(f.tue[0][1])}, day tickets and P+R Haagweg`,
    title: 'Parking Leiden 2026: old town rate, day tickets and P+R',
    description: `Parking in Leiden in 2026: ${eur(f.z.h, 'en')} an hour in the old town until ${hhmm(f.tue[0][1])}, Sunday from ${hhmm(f.sun[0][0])}, day tickets in many zones and the Haagweg park-and-ride site.`,
    h1: 'Parking in Leiden 2026: old town, day tickets and P+R',
    intro: 'Parking in Leiden is easy to follow: one high rate in the old town, a lower rate around it. Pick zone, day and time and the calculator shows the amount.',
    resume: `Leiden has ${num(f.zs.length, 'en')} paid street zones in the National Parking Register. In the old town, ${f.z.n}, an hour costs ${eur(f.z.h, 'en')}; in ${num(f.byRate.find((x) => x.h === f.rates[1])?.n ?? 0, 'en')} zones around the centre it is ${eur(f.rates[1], 'en')}. Paid hours are shorter than in the big cities: on weekdays and Saturday from ${hhmm(f.tue[0][0])} to ${hhmm(f.tue[0][1])}, on Sunday from ${hhmm(f.sun[0][0])} to ${hhmm(f.sun[0][1])}. Two hours in the old town cost ${eur(f.cost2h, 'en')}, an eight-hour day ${eur(f.cost8h, 'en')}. The number of day tickets stands out: ${num(f.tickets, 'en')} zones have one in the register. Driving to Leiden for a whole day, you can also use the park-and-ride ${pr ? pr.n.replace(/^P\+R\s*/, '').replace(/\s*\(Leiden\)/, '') : ''}. The latest published by-law, the 2025 one, sets the costs of a parking penalty assessment at ${eur(st.nah, 'en')}. A first resident permit costs ${eur(st.verg.bedrag, 'en')} a year or an amount per quarter under the same table, depending on the zone.`,
    faqs: [
      { q: 'Until what time do you pay to park in Leiden?', a: `In the old town until ${hhmm(f.tue[0][1])}, Sunday included. After that you park free until ${hhmm(f.tue[0][0])} the next morning. On Sunday paying only starts at ${hhmm(f.sun[0][0])}. Other zones can have other hours: pick your zone in the calculator for the table by day.` },
      { q: 'Which by-law does this site use for Leiden?', a: 'Leiden’s 2025 parking tax by-law, the latest published in the official database of local regulations when we looked. We found no 2026 version there yet. Street rates do not come from that by-law but from the National Parking Register, which the municipality keeps up to date itself.' },
      { q: 'Is a day ticket worth it in Leiden?', a: `It depends on the zone and the length of stay. In the old town eight hours paid by the hour cost ${eur(f.cost8h, 'en')}. In ${num(f.tickets, 'en')} zones the register lists a day ticket; pick such a zone in the day ticket calculator and you see from which hour the ticket is cheaper.` },
    ],
    body: (h) => `<h2>Parking in Leiden by zone</h2>
<p>Leiden has three hourly rates. The highest applies only in the old town itself, the middle one in the districts around it. The lowest, a few tens of cents an hour, belongs to special bays.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('leiden', 'en'), 'Street zones in Leiden by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>The municipality supplies its zone outlines to the register. With the address search at the top you see in seconds which zone an address is in, outside the centre too.</p>
<h2>Paid hours in the old town</h2>
<p>Evenings turn free early, and so does Sunday morning. For a night out in Leiden you no longer pay after nine.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('leiden', 'en'), `Paid hours in ${f.z.n}`)}
<h2>Day tickets, P+R, permits and fines</h2>
<p>For a long day, a ${h.a('dagkaart', 'day ticket')} or ${h.a('pr', 'park and ride')} is often cheaper than paying by the hour. ${st.verg.en}. A parking penalty carries ${h.eur(st.nah)} in costs. Source for both: the ${h.src('vo_leiden', 'Leiden parking tax by-law')}.</p>`,
  },
});
