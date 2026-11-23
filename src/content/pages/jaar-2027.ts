import { definePage } from '../../lib/page-types';
import { eur, num, day, STEDEN, K, cityLink, yearOf } from './_f';
import { J27 } from '../../lib/tool-specs';
import { formatPercent } from '../../lib/format';

type Lg = 'nl' | 'en';
const M = J27.naheffingMax;
const list = Object.entries(STEDEN).map(([s, x]) => ({ s, n: K.city(s).n, x, y: yearOf(x.verg), n27: J27.steden[s] })).sort((a, b) => a.n.localeCompare(b.n, 'nl'));
const pub = list.filter((c) => c.n27), open = list.filter((c) => !c.n27);
const ut = list.find((c) => c.s === 'utrecht')!, gr = list.find((c) => c.s === 'groningen')!;
const y27 = (c: (typeof list)[number]) => (c.n27 ? yearOf(c.n27.verg) : 0);
const pct = (a: number, b: number, l: Lg) => formatPercent((b - a) / a, 1, l);
const and = (xs: string[], l: Lg) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${l === 'nl' ? 'en' : 'and'} ${xs[xs.length - 1]}`);
const verg = (c: (typeof list)[number], l: Lg) => (c.x.verg.per === 'eenmalig' ? `${eur(c.x.verg.bedrag, l)} ${l === 'nl' ? 'eenmalig' : 'one-off'}` : eur(c.y, l));
const rows = (h: { a: (id: string, t: string) => string }, l: Lg) => list.map((c) => [
  cityLink(h, c.s, c.n), verg(c, l), c.n27 ? eur(y27(c), l) : (l === 'nl' ? 'nog niet gepubliceerd' : 'not published yet'),
  eur(c.x.nah, l), c.n27 ? eur(c.n27.nah, l) : `max. ${eur(M.bedrag, l)}`,
]);
const utU = ut.n27!.uur!;

export default definePage({
  id: 'jaar-2027', group: 'thema', order: 19, tool: 'jaar2027', toolArg: { stad: 'utrecht' },
  related: ['home', 'vergunning', 'naheffing', 'utrecht', 'groningen'],
  sources: ['stcrt_2026_26024', 'vo27_utrecht', 'vo27_groningen', 'vo_utrecht', 'vo_groningen'],
  nl: {
    slug: 'parkeren-2027',
    nav: 'Parkeren in 2027: wat verandert er', card: `Naheffing maximaal ${eur(M.bedrag, 'nl')}; de nieuwe tarieven van ${and(pub.map((c) => c.n), 'nl')}`,
    title: 'Parkeren 2027: vergunning en naheffing, 2026 en 2027',
    description: `Parkeren in 2027: de kosten van een naheffingsaanslag mogen naar ${eur(M.bedrag, 'nl')} (2026: ${eur(M.van, 'nl')}), en wat de vergunning kost in de steden met een nieuwe verordening.`,
    h1: 'Parkeren in 2027: wat verandert er per stad?',
    intro: `Vanaf 1 januari 2027 mogen de kosten van een naheffingsaanslag parkeren ${eur(M.bedrag, 'nl')} zijn, en ${and(pub.map((c) => c.n), 'nl')} hebben hun tarieven voor 2027 al vastgesteld. Kies uw stad en zie wat er verandert.`,
    resume: `Parkeren wordt in 2027 duurder op drie punten. Ten eerste stijgt het wettelijke maximum voor de kosten van een naheffingsaanslag parkeerbelasting op 1 januari 2027 van ${eur(M.van, 'nl')} naar ${eur(M.bedrag, 'nl')}: zo bepaalt een regeling van de minister van Binnenlandse Zaken van 29 juni 2026, die het bedrag elk jaar aan de consumentenprijsindex aanpast. Ten tweede kost de eerste bewonersvergunning in zone A1 in Utrecht ${eur(ut.n27!.verg.bedrag, 'nl')} per maand in plaats van ${eur(ut.x.verg.bedrag, 'nl')}, en in de Groningse binnenstad ${eur(y27(gr), 'nl')} per jaar in plaats van ${eur(gr.y, 'nl')}. Ten derde gaat het uurtarief in de duurste Utrechtse zone van ${eur(utU.oud, 'nl')} naar ${eur(utU.nieuw, 'nl')}. Dat zijn de twee steden van de ${num(list.length, 'nl')} die wij volgen waarvan de verordening parkeerbelastingen 2027 op ${day(J27.read, 'nl')} al in het officiële register stond. De andere gemeenteraden stellen hun tarieven meestal in november of december vast; tot die tijd gelden hier alleen de bedragen van 2026, en noemen wij geen bedrag voor 2027.`,
    faqs: [
      { q: 'Hoe hoog is een naheffingsaanslag parkeren in 2027?', a: `De kosten mogen vanaf 1 januari 2027 hoogstens ${eur(M.bedrag, 'nl')} zijn, ${eur(M.bedrag - M.van, 'nl')} meer dan in 2026. Daar komt het parkeergeld bij dat u had moeten betalen. Een gemeente mag minder rekenen: Utrecht zet de kosten voor 2027 op ${eur(ut.n27!.nah, 'nl')}, Groningen op het maximum.` },
      { q: 'Waarom stijgt het maximum elk jaar?', a: 'Het Besluit gemeentelijke parkeerbelastingen laat de minister van Binnenlandse Zaken het maximumbedrag jaarlijks aanpassen aan de consumentenprijsindex. De regeling voor 2027 is van 29 juni 2026 en verscheen op 21 augustus 2026 in de Staatscourant. Gemeenten mogen alleen hun werkelijke kosten doorberekenen, tot dat maximum.' },
      { q: 'Wanneer weet ik wat mijn bewonersvergunning in 2027 kost?', a: `Zodra de gemeenteraad de verordening parkeerbelastingen 2027 vaststelt en publiceert, meestal in november of december. Op ${day(J27.read, 'nl')} hadden ${and(pub.map((c) => c.n), 'nl')} dat gedaan; voor ${num(open.length, 'nl')} andere steden in de tabel tonen wij nog het bedrag van 2026. De rekenhulp bovenaan zegt per stad wat er bekend is.` },
      { q: 'Wordt de vergunning in Utrecht en Groningen veel duurder?', a: `In Utrecht stijgt de eerste vergunning in zone A1 met ${pct(ut.y, y27(ut), 'nl')}, naar ${eur(y27(ut), 'nl')} per jaar. In Groningen gaat de binnenstad met ${pct(gr.y, y27(gr), 'nl')} omhoog, naar ${eur(y27(gr), 'nl')} per jaar. De tweede zone in Groningen kost in 2027 ${eur(138.7, 'nl')} per jaar.` },
    ],
    body: (h) => `<h2>Parkeren 2026 en 2027 per stad</h2>
<p>De eerste bewonersvergunning per jaar en de kosten van een naheffingsaanslag, uit de verordening parkeerbelastingen van elke stad. Waar de verordening 2027 nog niet is gepubliceerd, geldt voor de kosten alleen het wettelijke maximum.</p>
${h.table(['Stad', 'Vergunning 2026', 'Vergunning 2027', 'Naheffing 2026', 'Naheffing 2027'], rows(h, 'nl'), `Bedragen uit de verordeningen parkeerbelastingen; 2027 gelezen op ${day(J27.read, 'nl')}`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Het maximum voor een naheffingsaanslag: ${eur(M.bedrag, 'nl')}</h2>
<p>Wie niet of te kort betaalt, krijgt een naheffingsaanslag: de parkeerbelasting plus kosten. Die kosten zijn wettelijk begrensd. De ${h.src('stcrt_2026_26024', 'regeling van 29 juni 2026')} stelt het maximum voor 2027 vast op ${eur(M.bedrag, 'nl')}, tegen ${eur(M.van, 'nl')} in 2026, met ingang van 1 januari 2027. Elke gemeente zet in haar verordening een eigen bedrag, op basis van haar kosten, en mag niet boven het maximum uitkomen. Lees meer over de kosten per stad op de pagina ${h.a('naheffing', 'naheffingsaanslag parkeren')}.</p>
<h2>Utrecht, Groningen en de andere steden in 2027</h2>
<p>De ${h.src('vo27_utrecht', 'verordening parkeerbelastingen Utrecht 2027')} geldt vanaf 1 januari 2027. ${ut.n27!.verg.nl}, tegen ${eur(ut.x.verg.bedrag, 'nl')} per maand in 2026. Op straat kost een uur in zone ${utU.zone} ${eur(utU.nieuw, 'nl')} in plaats van ${eur(utU.oud, 'nl')}. De kosten van een naheffingsaanslag gaan van ${eur(ut.x.nah, 'nl')} naar ${eur(ut.n27!.nah, 'nl')}: de gemeente blijft onder het maximum omdat haar berekende kosten lager zijn. Meer over de zones in ${h.a('utrecht', 'parkeren in Utrecht')}.</p>
<p>De ${h.src('vo27_groningen', 'verordening parkeerbelastingen Groningen 2027')} gaat ook op 1 januari 2027 in. ${gr.n27!.verg.nl}; in 2026 was dat ${eur(gr.y, 'nl')}. De kosten van een naheffingsaanslag volgen het nieuwe maximum en worden ${eur(gr.n27!.nah, 'nl')}. De gemeente berekent zelf hogere kosten per aanslag, maar mag niet meer rekenen dan het wettelijke bedrag.</p>
<p>Voor ${and(open.map((c) => c.n), 'nl')} stond op ${day(J27.read, 'nl')} nog geen verordening 2027 in het register van lokale regelgeving. Wij tonen daar de bedragen van 2026 en vullen 2027 aan zodra de gemeente publiceert. Tot de nieuwe verordening ingaat, blijven de tarieven van 2026 gelden. De uurtarieven op straat in de rekenhulp van elke stadspagina komen uit het Nationaal Parkeer Register en lopen mee met wat de gemeente daar invoert.</p>`,
  },
  en: {
    slug: 'parking-netherlands-2027',
    nav: 'Parking in 2027: what changes', card: `Penalty capped at ${eur(M.bedrag, 'en')}; the new rates of ${and(pub.map((c) => c.n), 'en')}`,
    title: 'Parking Netherlands 2027: permits and penalties vs 2026',
    description: `Parking in the Netherlands in 2027: the cap on penalty costs rises from ${eur(M.van, 'en')} in 2026 to ${eur(M.bedrag, 'en')}, and the 2027 resident permit in cities with a new by-law.`,
    h1: 'Parking in the Netherlands in 2027: what changes by city?',
    intro: `From 1 January 2027 the costs of a parking penalty may reach ${eur(M.bedrag, 'en')}, and ${and(pub.map((c) => c.n), 'en')} have already set their 2027 rates. Pick your city to see what changes.`,
    resume: `Parking in Dutch cities costs more in 2027 in three ways. First, the legal cap on the costs of a parking tax penalty assessment (naheffingsaanslag) rises on 1 January 2027 from ${eur(M.van, 'en')} to ${eur(M.bedrag, 'en')}, under an order of the Interior Minister of 29 June 2026 that adjusts the amount to the consumer price index each year. Second, the first resident permit in Utrecht's zone A1 costs ${eur(ut.n27!.verg.bedrag, 'en')} a month instead of ${eur(ut.x.verg.bedrag, 'en')}, and in Groningen's city centre ${eur(y27(gr), 'en')} a year instead of ${eur(gr.y, 'en')}. Third, the hourly street rate in Utrecht's dearest zone goes from ${eur(utU.oud, 'en')} to ${eur(utU.nieuw, 'en')}. These are the two cities, of the ${num(list.length, 'en')} we follow, whose 2027 parking tax by-law was in the official register on ${day(J27.read, 'en')}. The other councils usually set their rates in November or December; until then this page shows only their 2026 amounts and no 2027 figure.`,
    faqs: [
      { q: 'How much is a parking penalty in the Netherlands in 2027?', a: `The costs may be at most ${eur(M.bedrag, 'en')} from 1 January 2027, ${eur(M.bedrag - M.van, 'en')} more than in 2026. The parking fee you should have paid comes on top. A municipality may charge less: Utrecht sets its 2027 costs at ${eur(ut.n27!.nah, 'en')}, Groningen at the cap.` },
      { q: 'Why does the cap on penalty costs rise every year?', a: 'The decree on municipal parking taxes lets the Interior Minister adjust the cap to the consumer price index every year. The order for 2027 is dated 29 June 2026 and appeared in the Staatscourant, the government gazette, on 21 August 2026. Municipalities may only pass on their actual costs, up to that cap.' },
      { q: 'When will I know what my 2027 resident permit costs?', a: `As soon as the council adopts and publishes its 2027 parking tax by-law, usually in November or December. On ${day(J27.read, 'en')} ${and(pub.map((c) => c.n), 'en')} had done so; for ${num(open.length, 'en')} other cities in the table we still show the 2026 amount. The calculator at the top says what is known for each city.` },
      { q: 'Do permits in Utrecht and Groningen go up a lot?', a: `In Utrecht the first permit in zone A1 rises by ${pct(ut.y, y27(ut), 'en')}, to ${eur(y27(ut), 'en')} a year. In Groningen the city centre goes up by ${pct(gr.y, y27(gr), 'en')}, to ${eur(y27(gr), 'en')} a year. Groningen's second zone costs ${eur(138.7, 'en')} a year in 2027. Both by-laws apply from 1 January 2027.` },
    ],
    body: (h) => `<h2>Parking in 2026 and 2027 by city</h2>
<p>The first resident permit per year and the costs of a penalty assessment, from each city's parking tax by-law. Where the 2027 by-law is not published yet, only the legal cap is known for the costs.</p>
${h.table(['City', 'Permit 2026', 'Permit 2027', 'Penalty 2026', 'Penalty 2027'], rows(h, 'en'), `Amounts from the parking tax by-laws; 2027 read on ${day(J27.read, 'en')}`, ['l', 'r', 'r', 'r', 'r'])}
<h2>The cap on penalty costs: ${eur(M.bedrag, 'en')}</h2>
<p>If you do not pay, or pay too little, you receive a penalty assessment: the parking tax plus costs. Those costs are capped by law. The ${h.src('stcrt_2026_26024', 'order of 29 June 2026')} sets the cap for 2027 at ${eur(M.bedrag, 'en')}, against ${eur(M.van, 'en')} in 2026, from 1 January 2027. Each municipality sets its own amount in its by-law, based on its costs, and may not go above the cap. The ${h.a('naheffing', 'parking fine page')} compares the costs by city.</p>
<h2>Utrecht, Groningen and the other cities in 2027</h2>
<p>The ${h.src('vo27_utrecht', '2027 Utrecht parking tax by-law')} applies from 1 January 2027. ${ut.n27!.verg.en}, against ${eur(ut.x.verg.bedrag, 'en')} a month in 2026. On the street an hour in zone ${utU.zone} costs ${eur(utU.nieuw, 'en')} instead of ${eur(utU.oud, 'en')}. The costs of a penalty assessment go from ${eur(ut.x.nah, 'en')} to ${eur(ut.n27!.nah, 'en')}: the city stays below the cap because its calculated costs are lower. Zones are explained on ${h.a('utrecht', 'parking in Utrecht')}.</p>
<p>The ${h.src('vo27_groningen', '2027 Groningen parking tax by-law')} also takes effect on 1 January 2027. ${gr.n27!.verg.en}; in 2026 it was ${eur(gr.y, 'en')}. Penalty costs follow the new cap and become ${eur(gr.n27!.nah, 'en')}. The city calculates higher costs per assessment itself, but may not charge more than the legal amount.</p>
<p>For ${and(open.map((c) => c.n), 'en')} no 2027 by-law was in the register of local regulations on ${day(J27.read, 'en')}. We show their 2026 amounts and add 2027 as soon as the municipality publishes. Until the new by-law takes effect, the 2026 rates apply. The hourly street rates in the calculator on each city page come from the National Parking Register and follow what the municipality enters there.</p>`,
  },
});
