import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm } from './_f';

const f = facts('utrecht');
const st = f.st!;
const avond = f.best!;

export default definePage({
  id: 'utrecht', group: 'randstad', order: 2, tool: 'kosten', toolArg: { stad: 'utrecht' }, city: 'utrecht',
  related: ['home', 'vergunning', 'gratis', 'pr'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_gebied', 'vo_utrecht'],
  nl: {
    slug: 'parkeren-utrecht',
    nav: 'Parkeren in Utrecht', card: `${eur(f.info.hMin, 'nl')} tot ${eur(f.info.hMax, 'nl')} per uur, betalen tot 01:00, vergunning A1`,
    title: 'Parkeren Utrecht 2026: uurtarief per zone en tijden',
    description: `Parkeren in Utrecht in 2026: ${eur(f.info.hMax, 'nl')} per uur in de binnenstad, ${eur(f.info.hMin, 'nl')} in de wijken, betalen tot 01:00, avondkaart, naheffing en de bewonersvergunning per maand.`,
    h1: 'Parkeren in Utrecht 2026: zones, uurtarief en tijden',
    intro: `Parkeren in Utrecht kent maar ${num(f.byRate.length, 'nl')} uurtarieven, maar de betaaltijden zijn lang. Kies zone, dag en aankomsttijd: het bedrag verschijnt direct onder de vragen.`,
    resume: `Utrecht heeft ${num(f.zs.length, 'nl')} betaalde straatzones in het Nationaal Parkeer Register, met drie uurtarieven: ${eur(f.rates[0], 'nl')} in de binnenstad, ${eur(f.rates[1], 'nl')} in de schil eromheen en ${eur(f.rates[2], 'nl')} in de wijken daarbuiten. De gemeente rekent per minuut. In het centrum betaalt u van maandag tot en met zaterdag van ${hhmm(f.tue[1][0])} 's ochtends tot 01:00 's nachts, langer dan in de meeste steden. Op zondag is het betaald van ${hhmm(f.sun[1][0])} tot ${hhmm(f.sun[1][1])}. Twee uur winkelen op dinsdag kost daar ${eur(f.cost2h, 'nl')}. Wie 's avonds naar het theater gaat, kan een avondkaart van ${eur(avond.a, 'nl')} nemen. In ${num(f.sundayFree, 'nl')} van de ${num(f.zs.length, 'nl')} zones is zondag gratis. De verordening zet de kosten van een naheffingsaanslag op ${eur(st.nah, 'nl')}. Een eerste bewonersvergunning in zone A1 kost ${eur(st.verg.bedrag, 'nl')} per maand.`,
    faqs: [
      { q: 'Waarom betaal je in Utrecht tot 1 uur ’s nachts?', a: 'Zo heeft de gemeente het in het register gezet: in de binnenstad loopt de betaalperiode van maandag tot en met zaterdag door tot 01:00, en op zondag stopt ze om 18:00. Waarom precies tot 01:00 staat niet in het register. In de buitenwijken eindigt het betalen vaak eerder. De tabel op deze pagina toont de tijden per dag voor de zone die u kiest.' },
      { q: 'Kan ik in Utrecht mijn zone op adres opzoeken?', a: 'Nog niet automatisch. Utrecht levert geen zonegrenzen aan het Nationaal Parkeer Register, dus de adreszoeker kan het punt niet in een zone plaatsen. Kies de zone in de lijst: de naam staat op de parkeerautomaat en in uw parkeerapp. De wijknamen in het register, zoals Wijk C of Kanaleneiland, helpen bij het zoeken.' },
      { q: 'Is een dagkaart in Utrecht goedkoper dan per uur betalen?', a: `In de duurste zone pas na vele uren. Een werkdag van acht uur kost daar per minuut gerekend ${eur(f.cost8h, 'nl')}. Een dagkaart staat in de verordening voor zone A1; vergelijk het bedrag met de rekenhulp. Voor een lange dag is een P+R-terrein aan de rand, zoals Westraven of het Utrecht Science Park, vaak goedkoper.` },
    ],
    body: (h) => `<h2>Parkeren in Utrecht per zone</h2>
<p>De drie uurtarieven gelden elk voor een groep wijken. De duurste groep is klein: de oude binnenstad binnen de singels. De goedkoopste telt de meeste zones.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('utrecht', 'nl'), 'Straatzones in Utrecht per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>Omdat Utrecht per minuut rekent, kost een kwartier precies een kwart van het uurtarief. Er is geen begonnen uur dat u helemaal betaalt.</p>
<h2>Betaaltijden in de binnenstad</h2>
<p>Het ochtenduur is vroeg en het einde laat. Wie om half acht parkeert om de trein te halen, betaalt al.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('utrecht', 'nl'), 'Betaaltijden in de binnenstad')}
<p>Een zondagmiddag in de stad is dus niet gratis, maar ’s ochtends wel. Zie ook ${h.a('gratis', 'gratis parkeren per stad')}.</p>
<h2>Vergunning en naheffing in Utrecht</h2>
<p>${st.verg.nl}. Voor de schil en de wijken gelden lagere bedragen, en in veel wijken is er een wachtlijst. Een naheffingsaanslag kost ${h.eur(st.nah)} aan kosten. Alle bedragen staan in de ${h.src('vo_utrecht', 'verordening parkeerbelastingen 2026')}. Vergelijk de bedragen per stad op de pagina ${h.a('vergunning', 'bewonersvergunning')}.</p>`,
  },
  en: {
    slug: 'parking-utrecht',
    nav: 'Parking in Utrecht', card: `${eur(f.info.hMin, 'en')} to ${eur(f.info.hMax, 'en')} an hour, paid until 1 am, zone A1 permit`,
    title: 'Parking Utrecht 2026: hourly rate by zone and paid hours',
    description: `Parking in Utrecht in 2026: ${eur(f.info.hMax, 'en')} an hour in the old town, ${eur(f.info.hMin, 'en')} further out, paid until 1 am, evening ticket, penalty costs and a monthly resident permit.`,
    h1: 'Parking in Utrecht 2026: zones, hourly rate and hours',
    intro: `Parking in Utrecht has only ${num(f.byRate.length, 'en')} hourly rates, but the paid hours are long. Pick a zone, a day and an arrival time: the amount appears right below the questions.`,
    resume: `Utrecht has ${num(f.zs.length, 'en')} paid street zones in the National Parking Register, with three hourly rates: ${eur(f.rates[0], 'en')} in the old town, ${eur(f.rates[1], 'en')} in the ring around it and ${eur(f.rates[2], 'en')} in the districts beyond. The city charges by the minute. In the centre you pay from Monday to Saturday from ${hhmm(f.tue[1][0])} in the morning until 1 am, later than in most Dutch cities. On Sunday the paid period runs from ${hhmm(f.sun[1][0])} to ${hhmm(f.sun[1][1])}. Two hours of shopping on a Tuesday cost ${eur(f.cost2h, 'en')} there. For a night at the theatre, an evening ticket costs ${eur(avond.a, 'en')}. In ${num(f.sundayFree, 'en')} of the ${num(f.zs.length, 'en')} zones Sunday is free. The by-law sets the costs of a parking penalty at ${eur(st.nah, 'en')}, and a first resident permit in zone A1 costs ${eur(st.verg.bedrag, 'en')} a month.`,
    faqs: [
      { q: 'Why does Utrecht charge for parking until 1 am?', a: 'That is how the municipality entered it in the register: in the old town the paid period runs from Monday to Saturday until 1 am, and on Sunday it stops at 6 pm. The register does not say why it runs until 1 am. In outer districts paying often ends earlier. The table on this page shows the hours per day for the zone you pick.' },
      { q: 'Can I look up my Utrecht zone by address?', a: 'Not automatically yet. Utrecht supplies no zone outlines to the National Parking Register, so the address search cannot place a point in a zone. Pick the zone from the list instead: its name is on the meter and in your parking app. District names in the register, such as Wijk C or Kanaleneiland, help you find it.' },
      { q: 'Is a day ticket in Utrecht cheaper than paying by the hour?', a: `In the most expensive zone, only after many hours. An eight-hour working day there costs ${eur(f.cost8h, 'en')}, charged by the minute. The by-law sets a day ticket for zone A1; compare it with the calculator. For a long day, a park-and-ride site on the edge, such as Westraven or Utrecht Science Park, is often cheaper.` },
    ],
    body: (h) => `<h2>Parking in Utrecht by zone</h2>
<p>Each of the three hourly rates covers a group of districts. The dearest group is small: the old town inside the canals. The cheapest has the most zones.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('utrecht', 'en'), 'Street zones in Utrecht by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>Because Utrecht charges by the minute, a quarter of an hour costs exactly a quarter of the hourly rate. You never pay for a whole hour you only started.</p>
<h2>Paid hours in the old town</h2>
<p>The day starts early and ends late. Park at half past seven to catch a train and you are already paying.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('utrecht', 'en'), 'Paid hours in the old town')}
<p>A Sunday afternoon in town is therefore not free, but Sunday morning is. See also ${h.a('gratis', 'free parking by city')}.</p>
<h2>Permits and penalties in Utrecht</h2>
<p>${st.verg.en}. Lower amounts apply in the ring and the outer districts, and many districts have a waiting list. A parking penalty assessment carries ${h.eur(st.nah)} in costs. All amounts are in the ${h.src('vo_utrecht', '2026 parking tax by-law')}. Compare cities on the ${h.a('vergunning', 'resident permit')} page.</p>`,
  },
});
