import { definePage } from '../../lib/page-types';
import { eur, num, K, cityLink, COVER, N_CITIES, facts } from './_f';

type Lg = 'nl' | 'en';
const sites = COVER.flatMap((s) => { const f = facts(s);
  return f.prs.map((z) => ({ s, cn: f.c.n, n: z.n.replace(/\s*\([^)]*\)\s*$/, ''), a: z.p.length ? z.p[0].a : K.stay(f.c, z, 2, 540, 480).total, c8: f.cost8h }))
    .filter((x) => x.a > 0); });
const cities = [...new Set(sites.map((x) => x.s))];
const cheapest = [...sites].sort((a, b) => a.a - b.a)[0];
const rows = (h: { a: (id: string, t: string) => string }, l: Lg) => sites.map((x) => [cityLink(h, x.s, x.cn), x.n, eur(x.a, l), eur(x.c8, l)]);
const ut = sites.filter((x) => x.s === 'utrecht');
const NC = (l: Lg) => num(N_CITIES, l);
const noPr = COVER.filter((s) => !cities.includes(s)).map((s) => K.city(s).n);
const noPrEx = (l: Lg) => `${noPr.slice(0, 2).join(', ')} ${l === 'nl' ? 'en' : 'and'} ${noPr[2]}`;

export default definePage({
  id: 'pr', group: 'thema', order: 24, tool: 'pr', toolArg: { stad: 'utrecht' },
  related: ['home', 'dagkaart', 'nijmegen', 'leiden'],
  sources: ['npr_gebied', 'npr_tarief', 'npr_regeling'],
  nl: {
    slug: 'p-en-r',
    nav: 'P+R per stad', card: `${num(sites.length, 'nl')} P+R-terreinen met een prijs in ${num(cities.length, 'nl')} steden, vanaf ${eur(cheapest.a, 'nl')}`,
    title: 'P+R parkeren 2026: prijzen per stad en het verschil',
    description: `P+R parkeren in 2026: de ${num(sites.length, 'nl')} P+R-terreinen met een prijs in het Nationaal Parkeer Register, in ${num(cities.length, 'nl')} steden, naast acht uur parkeren in het centrum van die stad.`,
    h1: 'P+R parkeren 2026: wat kost het per stad?',
    intro: `P+R parkeren kost aan de rand van Utrecht ${eur(ut[0]?.a ?? 0, 'nl')} per dag; acht uur in het centrum ${eur(ut[0]?.c8 ?? 0, 'nl')}. Kies uw stad en de duur: de rekenhulp toont het verschil.`,
    resume: `P+R staat voor Parkeren en Reizen: u zet de auto aan de rand van de stad en reist verder met het openbaar vervoer, de fiets of te voet. In het Nationaal Parkeer Register vonden wij voor ${num(cities.length, 'nl')} van de ${NC('nl')} steden op deze site P+R-terreinen met een prijs, samen ${num(sites.length, 'nl')}. Het goedkoopste bedrag in het register is ${eur(cheapest.a, 'nl')} bij ${cheapest.n} in ${cheapest.cn}. In Utrecht kosten de drie terreinen elk ${eur(ut[0]?.a ?? 0, 'nl')}. Daar staat tegenover dat acht uur in het centrum van dezelfde stad al snel tientallen euro’s kost. Let op twee dingen. Het P+R-tarief geldt vaak alleen als u met het openbaar vervoer naar het centrum reist en dat aantoont, bijvoorbeeld met uw OV-chipkaart (de kaart voor bus, tram en trein) of bankpas; zonder die reis betaalt u soms meer. En de kosten van die reis zelf rekenen wij niet mee. Terreinen zonder prijs in het register laten wij weg, omdat wij niet weten of ze gratis zijn. De voorwaarden staan bij de ingang en in de app van de stad.`,
    faqs: [
      { q: 'Is P+R altijd goedkoper dan parkeren in het centrum?', a: `Voor een hele dag bijna altijd, ook met de reis erbij. In de tabel staat naast elk terrein wat acht uur in de centrumzone van die stad kost. Voor een uur of twee kan het centrum goedkoper zijn als u de reiskosten meetelt. De rekenhulp toont het verschil voor de duur die u kiest.` },
      { q: 'Moet ik met het openbaar vervoer reizen om het P+R-tarief te krijgen?', a: 'Bij veel terreinen wel. U checkt in en uit met dezelfde OV-chipkaart of bankpas die u bij het terrein gebruikt, en dan geldt het lage tarief. Wie het terrein alleen als parkeerplaats gebruikt, betaalt soms een hoger tarief. De precieze regels staan bij de ingang en verschillen per stad.' },
      { q: 'Welke steden hebben geen P+R in het register?', a: `Van de ${NC('nl')} steden op deze site hebben er ${num(N_CITIES - cities.length, 'nl')} geen P+R-terrein met een prijs in het register, onder meer ${noPrEx('nl')}. Dat betekent niet dat er geen P+R is: sommige gemeenten melden hun terreinen niet of zonder tarief. Kijk dan op de site van de gemeente.` },
    ],
    body: (h) => `<h2>P+R parkeren per stad</h2>
<p>Elk P+R-terrein met een prijs in het register. De prijs is de goedkoopste dagkaart, of anders acht uur per uur op een dinsdag vanaf 09:00. Ernaast: acht uur in de centrumzone van dezelfde stad.</p>
${h.table(['Stad', 'P+R-terrein', 'Prijs P+R', '8 uur centrum'], rows(h, 'nl'), `P+R-terreinen met een prijs in het Nationaal Parkeer Register (${num(cities.length, 'nl')} steden)`, ['l', 'l', 'r', 'r'])}
<h2>Waar u op let bij P+R</h2>
<p>Kijk vooraf of het tarief een OV-reis vereist en hoe lang u mag blijven: sommige terreinen hebben een maximum van een paar dagen. Reken de reis naar het centrum mee, zeker met meer mensen in de auto. Voor een avond in de stad is een P+R minder handig: de laatste bus of tram kan vroeg gaan. Bij grote evenementen kan een terrein ook vol zijn of een ander tarief hebben; dat staat dan bij de ingang.</p>
<h2>Andere manieren om te besparen</h2>
<p>Blijft u in het centrum? Vergelijk dan met een ${h.a('dagkaart', 'dagkaart')}, of kom op een moment dat het ${h.a('gratis', 'gratis')} is. Per stad: ${h.a('utrecht', 'Utrecht')}, ${h.a('leiden', 'Leiden')} en ${h.a('nijmegen', 'Nijmegen')}.</p>`,
  },
  en: {
    slug: 'park-and-ride',
    nav: 'Park and ride by city', card: `${num(sites.length, 'en')} priced P+R sites in ${num(cities.length, 'en')} cities, from ${eur(cheapest.a, 'en')}`,
    title: 'Park and ride Netherlands 2026: P+R prices by city',
    description: `Park and ride in the Netherlands in 2026: the ${num(sites.length, 'en')} P+R sites with a price in the National Parking Register, in ${num(cities.length, 'en')} cities, next to eight hours in the centre.`,
    h1: 'Park and ride in the Netherlands 2026: prices by city',
    intro: `Park and ride on the edge of Utrecht costs ${eur(ut[0]?.a ?? 0, 'en')} a day; eight hours in the centre cost ${eur(ut[0]?.c8 ?? 0, 'en')}. Pick your city and the duration: the calculator shows the gap.`,
    resume: `P+R stands for park and ride: you leave the car on the edge of the city and continue by public transport, bike or on foot. In the National Parking Register we found priced P+R sites for ${num(cities.length, 'en')} of the ${NC('en')} cities on this site, ${num(sites.length, 'en')} in all. The lowest amount in the register is ${eur(cheapest.a, 'en')} at ${cheapest.n} in ${cheapest.cn}. In Utrecht the three sites each cost ${eur(ut[0]?.a ?? 0, 'en')}. Against that, eight hours in the centre of the same city soon cost tens of euros. Mind two things. The P+R fare often applies only if you travel to the centre by public transport and can show it, for example with your OV-chipkaart (public transport card) or bank card; without that trip you sometimes pay more. And we do not include the cost of that trip. Sites without a price in the register are left out, because we do not know whether they are free. Conditions are posted at the entrance and in the city’s app.`,
    faqs: [
      { q: 'Is park and ride always cheaper than parking in the centre?', a: 'For a whole day almost always, even with the trip added. The table shows, next to each site, what eight hours in that city’s central zone cost. For an hour or two the centre can be cheaper once you count the fare. The calculator shows the gap for the duration you pick.' },
      { q: 'Do I have to use public transport to get the P+R fare?', a: 'At many sites, yes. You check in and out with the same public transport card or bank card you used at the site, and the low fare applies. If you only use the site as a car park, you sometimes pay a higher rate. The exact rules are posted at the entrance and differ by city.' },
      { q: 'Which cities have no park and ride in the register?', a: `Of the ${NC('en')} cities on this site, ${num(N_CITIES - cities.length, 'en')} have no priced P+R site in the register, including ${noPrEx('en')}. That does not mean there is no P+R: some municipalities do not report their sites or report them without a fare. Check the municipality’s website.` },
    ],
    body: (h) => `<h2>Park and ride by city</h2>
<p>Every P+R site with a price in the register. The price is the cheapest day ticket, or otherwise eight hours by the hour on a Tuesday from 09:00. Next to it: eight hours in the central zone of the same city.</p>
${h.table(['City', 'P+R site', 'P+R price', '8 hours centre'], rows(h, 'en'), `P+R sites with a price in the National Parking Register (${num(cities.length, 'en')} cities)`, ['l', 'l', 'r', 'r'])}
<h2>What to check with park and ride</h2>
<p>Check beforehand whether the fare requires a public transport trip and how long you may stay: some sites have a limit of a few days. Count the trip to the centre, especially with more people in the car. For an evening in town a P+R is less convenient: the last bus or tram may leave early. During big events a site can also be full or charge a different fare; that is then posted at the entrance.</p>
<h2>Other ways to save</h2>
<p>Staying in the centre? Compare with a ${h.a('dagkaart', 'day ticket')}, or come when parking is ${h.a('gratis', 'free')}. By city: ${h.a('utrecht', 'Utrecht')}, ${h.a('leiden', 'Leiden')} and ${h.a('nijmegen', 'Nijmegen')}.</p>`,
  },
});
