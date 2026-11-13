import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm } from './_f';

const f = facts('den-bosch');
const st = f.st!;

export default definePage({
  id: 'den-bosch', group: 'stad', order: 8, tool: 'kosten', toolArg: { stad: 'den-bosch' }, city: 'den-bosch',
  related: ['home', 'vergunning', 'naheffing', 'gratis'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_geo', 'vo_den-bosch'],
  nl: {
    slug: 'parkeren-den-bosch',
    nav: 'Parkeren in Den Bosch', card: `Binnenstad ${eur(f.z.h, 'nl')} per uur tot middernacht, vergunning ${eur(st.verg.bedrag, 'nl')} per jaar`,
    title: 'Parkeren Den Bosch 2026: tarief binnenstad en tijden',
    description: `Parkeren in Den Bosch (’s-Hertogenbosch) in 2026: ${eur(f.z.h, 'nl')} per uur in de binnenstad tot middernacht, ${num(f.zs.length, 'nl')} zones, de naheffing en de bewonersvergunning per jaar.`,
    h1: 'Parkeren in Den Bosch 2026: binnenstad, schil en tijden',
    intro: 'Parkeren in Den Bosch betaalt u in de binnenstad tot middernacht, ook op zondagmiddag. Kies zone, dag en tijd: het bedrag staat direct naast de vragen.',
    resume: `’s-Hertogenbosch, in de volksmond Den Bosch, heeft ${num(f.zs.length, 'nl')} betaalde straatzones in het Nationaal Parkeer Register. Er zijn drie uurtarieven: ${eur(f.rates[0], 'nl')} in ${f.z.n}, ${eur(f.rates[1], 'nl')} in de schil eromheen en ${eur(f.rates[2], 'nl')} verder weg. In de binnenstad betaalt u van maandag tot en met zaterdag van ${hhmm(f.tue[0][0])} tot middernacht en op zondag van ${hhmm(f.sun[0][0])} tot middernacht. Twee uur in de binnenstad kosten ${eur(f.cost2h, 'nl')}; een hele werkdag ${eur(f.cost8h, 'nl')}. Een zondag zonder betalen is er maar in ${num(f.sundayFree, 'nl')} zones. Het register kent hier geen dagkaarten op straat; voor een lange dag zijn de garages bedoeld, die wij niet meerekenen. De verordening van 2026 rekent voor een naheffingsaanslag ${eur(st.nah, 'nl')} aan kosten, verhoogd met één uur van het tarief ter plaatse. Een bewonersvergunning die de hele dag geldt, kost ${eur(st.verg.bedrag, 'nl')} per jaar.`,
    faqs: [
      { q: 'Hoeveel kost een parkeerboete in Den Bosch?', a: `De verordening parkeerbelastingen 2026 van ’s-Hertogenbosch noemt ${eur(st.nah, 'nl')} aan kosten, te verhogen met één uur van het tarief op de plek. In de binnenstad komt een naheffingsaanslag zo op ${eur(st.nah + f.z.h, 'nl')}, in de goedkoopste zone op ${eur(st.nah + f.rates[2], 'nl')}. Bezwaar maakt u bij de gemeente.` },
      { q: 'Wat kost een bewonersvergunning in Den Bosch?', a: `Een vergunning die 24 uur per dag geldt, kost ${eur(st.verg.bedrag, 'nl')} per jaar, of een kwart daarvan per kwartaal. De verordening kent ook een goedkopere avondvergunning voor bewoners van de binnenstad. Of u een vergunning krijgt, hangt af van uw adres en de regels van de gemeente.` },
      { q: 'Is er gratis parkeren in Den Bosch op zondag?', a: `In de binnenstad alleen ’s ochtends: tot ${hhmm(f.sun[0][0])} betaalt u niets, daarna tot middernacht wel. Volgens het register is zondag maar in ${num(f.sundayFree, 'nl')} van de ${num(f.zs.length, 'nl')} zones helemaal gratis. Kies uw zone in de rekenhulp en zet de dag op zondag om het te zien.` },
    ],
    body: (h) => `<h2>Parkeren in Den Bosch: drie uurtarieven</h2>
<p>Het tarief daalt van de Markt naar buiten. De tabel telt de zones per tarief, met de namen uit het register. Het verschil tussen de duurste en de goedkoopste zone is ruim een euro per uur; op een middag winkelen loopt dat snel op.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('den-bosch', 'nl'), 'Straatzones in ’s-Hertogenbosch per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>Voor ${num(f.info.geo, 'nl')} zones levert de gemeente de grenzen aan het register; daar vindt de adreszoeker uw zone. Voor de andere kiest u de zone in de lijst van de rekenhulp. De naam staat op de automaat in de straat.</p>
<h2>Betaaltijden in de binnenstad</h2>
<p>Lang betalen, zeven dagen per week: tot middernacht, ook op zondag. Alleen de nacht en de zondagochtend zijn vrij. Wie voor een avondvoorstelling komt, betaalt dus tot het einde door.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('den-bosch', 'nl'), `Betaaltijden in ${f.z.n}`)}
<h2>Vergunning en naheffing</h2>
<p>${st.verg.nl}. De kosten van een naheffing zijn ${h.eur(st.nah)} plus één uur tarief. Beide bedragen staan in de ${h.src('vo_den-bosch', 'verordening parkeerbelastingen ’s-Hertogenbosch 2026')}. Andere steden vergelijkt u op ${h.a('vergunning', 'de vergunningspagina')} en bij ${h.a('naheffing', 'naheffingsaanslag')}.</p>`,
  },
  en: {
    slug: 'parking-den-bosch',
    nav: 'Parking in Den Bosch', card: `Old town ${eur(f.z.h, 'en')} an hour until midnight, permit ${eur(st.verg.bedrag, 'en')} a year`,
    title: 'Parking Den Bosch 2026: old town rate and paid hours',
    description: `Parking in Den Bosch (’s-Hertogenbosch) in 2026: ${eur(f.z.h, 'en')} an hour in the old town until midnight, ${num(f.zs.length, 'en')} zones, the parking penalty costs and the yearly permit.`,
    h1: 'Parking in Den Bosch 2026: old town, ring and paid hours',
    intro: 'Parking in Den Bosch is paid in the old town until midnight, Sunday afternoon included. Pick zone, day and time: the amount appears right next to the questions.',
    resume: `’s-Hertogenbosch, known as Den Bosch, has ${num(f.zs.length, 'en')} paid street zones in the National Parking Register. There are three hourly rates: ${eur(f.rates[0], 'en')} in ${f.z.n}, ${eur(f.rates[1], 'en')} in the ring around it and ${eur(f.rates[2], 'en')} further out. In the old town you pay from Monday to Saturday from ${hhmm(f.tue[0][0])} until midnight, and on Sunday from ${hhmm(f.sun[0][0])} until midnight. Two hours in the old town cost ${eur(f.cost2h, 'en')}; a whole working day ${eur(f.cost8h, 'en')}. Only ${num(f.sundayFree, 'en')} zones have a free Sunday. The register lists no street day tickets here; for a long day the garages are the option, which we do not calculate. The 2026 by-law charges ${eur(st.nah, 'en')} in costs for a parking penalty, plus one hour of the local rate. A resident permit valid all day costs ${eur(st.verg.bedrag, 'en')} a year.`,
    faqs: [
      { q: 'How much is a parking fine in Den Bosch?', a: `The 2026 parking tax by-law of ’s-Hertogenbosch sets ${eur(st.nah, 'en')} in costs, increased by one hour of the rate on the spot. In the old town a penalty assessment therefore comes to ${eur(st.nah + f.z.h, 'en')}, in the cheapest zone to ${eur(st.nah + f.rates[2], 'en')}. Objections go to the municipality.` },
      { q: 'What does a resident permit cost in Den Bosch?', a: `A permit valid 24 hours a day costs ${eur(st.verg.bedrag, 'en')} a year, or a quarter of that per quarter. The by-law also has a cheaper evening permit for old-town residents. Whether you can get a permit depends on your address and the municipality’s rules.` },
      { q: 'Is there free parking in Den Bosch on Sunday?', a: `In the old town only in the morning: until ${hhmm(f.sun[0][0])} you pay nothing, after that you pay until midnight. According to the register, Sunday is entirely free in just ${num(f.sundayFree, 'en')} of the ${num(f.zs.length, 'en')} zones. Pick your zone in the calculator and set the day to Sunday to see it.` },
    ],
    body: (h) => `<h2>Parking in Den Bosch: three hourly rates</h2>
<p>The rate falls from the Markt outwards. The table counts zones per rate, with the names from the register. The gap between the dearest and the cheapest zone is over a euro an hour, which adds up quickly over an afternoon of shopping.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('den-bosch', 'en'), 'Street zones in ’s-Hertogenbosch by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>For ${num(f.info.geo, 'en')} zones the municipality supplies outlines to the register; there the address search finds your zone. For the others, pick the zone from the calculator’s list. Its name is on the meter in the street.</p>
<h2>Paid hours in the old town</h2>
<p>Long hours, seven days a week: until midnight, Sunday included. Only the night and Sunday morning are free. If you come for an evening show, you keep paying until it ends.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('den-bosch', 'en'), `Paid hours in ${f.z.n}`)}
<h2>Permits and penalties</h2>
<p>${st.verg.en}. The costs of a penalty are ${h.eur(st.nah)} plus one hour of the rate. Both amounts are in the ${h.src('vo_den-bosch', '’s-Hertogenbosch 2026 parking tax by-law')}. Compare other cities on ${h.a('vergunning', 'the permit page')} and under ${h.a('naheffing', 'parking penalty')}.</p>`,
  },
});
