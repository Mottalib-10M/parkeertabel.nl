import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm } from './_f';

const f = facts('breda');
const st = f.st!;
const nMid = f.byRate.find((x) => x.h === f.rates[1])?.n ?? 0;
const nLow = f.byRate.find((x) => x.h === f.rates[2])?.n ?? 0;

export default definePage({
  id: 'breda', group: 'stad', order: 13, tool: 'kosten', toolArg: { stad: 'breda' }, city: 'breda',
  related: ['home', 'vergunning', 'naheffing', 'den-bosch'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_gebied', 'vo_breda'],
  nl: {
    slug: 'parkeren-breda',
    nav: 'Parkeren in Breda', card: `Centrum ${eur(f.z.h, 'nl')} per uur tot 01:00, singels ${eur(f.rates[1], 'nl')}, eerste vergunning gratis`,
    title: 'Parkeren Breda 2026: tarief centrum, singels en tijden',
    description: `Parkeren in Breda in 2026: ${eur(f.z.h, 'nl')} per uur in het centrum tot één uur ’s nachts, ${eur(f.rates[1], 'nl')} langs de singels tot 22:00, de naheffing en de gratis eerste vergunning.`,
    h1: 'Parkeren in Breda 2026: centrum, singels en de nacht',
    intro: `Parkeren in Breda betaalt u in het centrum tot één uur ’s nachts, ook op zondag. Langs de singels is het goedkoper. Kies zone, dag en tijd en zie het bedrag.`,
    resume: `Breda heeft ${num(f.zs.length, 'nl')} betaalde straatzones in het Nationaal Parkeer Register, en de naam van elke zone vertelt al veel: straat, tijden en soms een maximale parkeerduur. In ${num(f.byRate[0].n, 'nl')} zones in het centrum, zoals Spoorstraat, Nonnenveld en Chasséveld, kost een uur ${eur(f.z.h, 'nl')}. Langs de singels en in de wijken eromheen betaalt u in ${num(nMid, 'nl')} zones ${eur(f.rates[1], 'nl')} per uur. In ${num(nLow, 'nl')} zones rekent het register een eerste uur van ${eur(f.rates[2], 'nl')}. In het centrum loopt het betalen door tot ${hhmm(60)} ’s nachts, langs de singels tot ${hhmm(1320)}. Twee uur in het centrum kosten ${eur(f.cost2h, 'nl')}. In een deel van de centrumzones mag u maximaal drie uur blijven. Een gratis zondag of avond is er in geen enkele zone. Voor bewoners is Breda gunstig: de eerste vergunning in het Stadshart en de singels kost volgens de verordening niets. De kosten van een naheffingsaanslag zijn ${eur(st.nah, 'nl')}.`,
    faqs: [
      { q: 'Tot hoe laat is parkeren in Breda betaald?', a: `In het centrum tot ${hhmm(60)} ’s nachts, elke dag. Langs de singels tot ${hhmm(1320)}. De namen van de zones noemen op zondag een begin om 12:00; in de tijdvakken van het register begint het betalen in het centrum ook op zondag om ${hhmm(f.sun[1][0])}. De borden en de automaat ter plaatse gaan voor.` },
      { q: 'Is een bewonersvergunning in Breda gratis?', a: `Voor de eerste vergunning in het Stadshart en binnen en buiten de singels noemt de verordening een bedrag van ${eur(0, 'nl')}. Een tweede vergunning kost ${eur(8, 'nl')} per maand. Of u in aanmerking komt, hangt af van uw adres en de regels van de gemeente, bijvoorbeeld over een eigen parkeerplaats.` },
      { q: 'Hoeveel kost een naheffingsaanslag in Breda?', a: `De kosten van een naheffing zijn in Breda ${eur(st.nah, 'nl')}, volgens de verordening parkeerbelastingen 2026. Dat is minder dan het wettelijke maximum van ${eur(82, 'nl')}. Daarbij komt de parkeerbelasting die u niet betaalde. Bezwaar maakt u binnen zes weken bij de gemeente.` },
    ],
    body: (h) => `<h2>Parkeren in Breda per zone</h2>
<p>Drie uurtarieven: het centrum, de singels en een handvol zones met een verlaagd eerste uur. Bij die laatste noemt de naam van een paar zones een ander bedrag dan het register; kijk daar op de automaat.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('breda', 'nl'), 'Straatzones in Breda per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>Breda levert voor ${num(f.info.geo, 'nl')} van de ${num(f.zs.length, 'nl')} zones grenzen aan het register. Voor de meeste adressen kiest u de zone dus zelf in de lijst; de straatnaam in de zonenaam helpt daarbij.</p>
<h2>Betaaltijden in het centrum</h2>
<p>Breda betaalt lang: van de ochtend tot één uur ’s nachts, zeven dagen per week. Een avond in de horeca rond de Grote Markt kost zo parkeergeld tot de laatste ronde.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('breda', 'nl'), `Betaaltijden in de zone ${f.z.n}`)}
<h2>Vergunning en naheffing in Breda</h2>
<p>${st.verg.nl}. De kosten van een naheffing zijn ${h.eur(st.nah)}. Bron: de ${h.src('vo_breda', 'verordening parkeerbelastingen Breda 2026')}. Vergelijk met andere steden op ${h.a('vergunning', 'de vergunningspagina')} en bij ${h.a('naheffing', 'naheffingsaanslag')}.</p>`,
  },
  en: {
    slug: 'parking-breda',
    nav: 'Parking in Breda', card: `Centre ${eur(f.z.h, 'en')} an hour until 1 am, canal ring ${eur(f.rates[1], 'en')}, first permit free`,
    title: 'Parking Breda 2026: centre rate, canal ring and hours',
    description: `Parking in Breda in 2026: ${eur(f.z.h, 'en')} an hour in the centre until one in the morning, ${eur(f.rates[1], 'en')} along the canal ring until 22:00, penalty costs and the free first permit.`,
    h1: 'Parking in Breda 2026: centre, canal ring and late hours',
    intro: 'Parking in Breda is paid in the centre until one in the morning, Sunday included. Along the canal ring it is cheaper. Pick zone, day and time and see the amount.',
    resume: `Breda has ${num(f.zs.length, 'en')} paid street zones in the National Parking Register, and each zone name already tells you a lot: street, hours and sometimes a maximum stay. In ${num(f.byRate[0].n, 'en')} central zones, such as Spoorstraat, Nonnenveld and Chasséveld, an hour costs ${eur(f.z.h, 'en')}. Along the canal ring (singels) and in the districts around it you pay ${eur(f.rates[1], 'en')} an hour in ${num(nMid, 'en')} zones. In ${num(nLow, 'en')} zones the register charges a first hour of ${eur(f.rates[2], 'en')}. In the centre paying runs until ${hhmm(60)} at night, along the canal ring until ${hhmm(1320)}. Two hours in the centre cost ${eur(f.cost2h, 'en')}. In some central zones you may stay three hours at most. No zone has a free Sunday or evening. Residents do well: under the by-law, the first permit in the Stadshart and the canal ring costs nothing. The costs of a parking penalty are ${eur(st.nah, 'en')}.`,
    faqs: [
      { q: 'Until what time is parking paid in Breda?', a: `In the centre until ${hhmm(60)} at night, every day. Along the canal ring until ${hhmm(1320)}. The zone names give a Sunday start of 12:00; in the register’s time slots, paying in the centre also starts at ${hhmm(f.sun[1][0])} on Sunday. Signs and the meter on the spot take precedence.` },
      { q: 'Is a resident permit free in Breda?', a: `For the first permit in the Stadshart and inside and outside the canal ring, the by-law sets an amount of ${eur(0, 'en')}. A second permit costs ${eur(8, 'en')} a month. Whether you qualify depends on your address and the municipality’s rules, for example on having your own parking space.` },
      { q: 'How much is a parking penalty in Breda?', a: `The costs of a penalty assessment in Breda are ${eur(st.nah, 'en')}, under the 2026 parking tax by-law. That is less than the legal maximum of ${eur(82, 'en')}. The parking tax you did not pay comes on top. Objections go to the municipality within six weeks.` },
    ],
    body: (h) => `<h2>Parking in Breda by zone</h2>
<p>Three hourly rates: the centre, the canal ring and a handful of zones with a reduced first hour. For those, the names of a few zones give a different amount from the register; check the meter there.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('breda', 'en'), 'Street zones in Breda by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>Breda supplies outlines to the register for ${num(f.info.geo, 'en')} of its ${num(f.zs.length, 'en')} zones. For most addresses you therefore pick the zone yourself from the list; the street name inside the zone name helps.</p>
<h2>Paid hours in the centre</h2>
<p>Breda charges for a long time: from the morning until one at night, seven days a week. An evening in the bars around the Grote Markt therefore costs parking money until last orders.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('breda', 'en'), `Paid hours in the zone ${f.z.n}`)}
<h2>Permits and penalties in Breda</h2>
<p>${st.verg.en}. The costs of a penalty are ${h.eur(st.nah)}. Source: the ${h.src('vo_breda', 'Breda 2026 parking tax by-law')}. Compare other cities on ${h.a('vergunning', 'the permit page')} and under ${h.a('naheffing', 'parking penalty')}.</p>`,
  },
});
