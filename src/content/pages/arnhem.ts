import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm } from './_f';

const f = facts('arnhem');
const st = f.st!;
const nLow = f.byRate.find((x) => x.h === f.rates[1])?.n ?? 0;

export default definePage({
  id: 'arnhem', group: 'stad', order: 12, tool: 'kosten', toolArg: { stad: 'arnhem' }, city: 'arnhem',
  related: ['home', 'naheffing', 'vergunning', 'nijmegen'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_geo', 'vo_arnhem'],
  nl: {
    slug: 'parkeren-arnhem',
    nav: 'Parkeren in Arnhem', card: `Centrum ${eur(f.z.h, 'nl')} per uur, ook op zondagmiddag, vergunning ${eur(st.verg.bedrag, 'nl')} per jaar`,
    title: 'Parkeren Arnhem 2026: tarief centrum, schil en zondag',
    description: `Parkeren in Arnhem in 2026: ${eur(f.z.h, 'nl')} per uur in het centrum, ${eur(f.rates[1], 'nl')} in de schil, betalen tot ${hhmm(f.tue[0][1])} en zondag vanaf ${hhmm(f.sun[0][0])}, met de naheffing en de vergunning.`,
    h1: 'Parkeren in Arnhem 2026: centrum, schil en zondag',
    intro: `Parkeren in Arnhem kent maar twee uurtarieven: ${eur(f.z.h, 'nl')} in het centrum en ${eur(f.rates[1], 'nl')} daaromheen. Kies zone, dag en tijd en zie het bedrag.`,
    resume: `Arnhem heeft ${num(f.zs.length, 'nl')} betaalde straatzones in het Nationaal Parkeer Register, en dat is overzichtelijk. In ${num(f.byRate[0].n, 'nl')} zones, waaronder het ${f.z.n}, kost een uur ${eur(f.z.h, 'nl')}, het hoogste tarief van de steden in Gelderland op deze site. In de ${num(nLow, 'nl')} andere zones betaalt u ${eur(f.rates[1], 'nl')} per uur. Doordeweeks en op zaterdag betaalt u in het centrum van ${hhmm(f.tue[0][0])} tot ${hhmm(f.tue[0][1])}. Op zondag begint het betalen om ${hhmm(f.sun[0][0])} en loopt het ook tot ${hhmm(f.sun[0][1])}, langer dan in Nijmegen. Twee uur in het centrum kosten ${eur(f.cost2h, 'nl')}, een hele werkdag ${eur(f.cost8h, 'nl')}. Het register kent voor Arnhem geen dagkaart op straat en geen P+R-terrein. Zondag is in ${num(f.sundayFree, 'nl')} zones gratis. De verordening parkeerbelastingen 2026 zet de kosten van een naheffingsaanslag op ${eur(st.nah, 'nl')}, iets onder het wettelijke maximum. Een bewonersvergunning kost ${eur(st.verg.bedrag, 'nl')} per jaar.`,
    faqs: [
      { q: 'Hoeveel kost een parkeerboete in Arnhem?', a: `De kosten van een naheffingsaanslag zijn in Arnhem ${eur(st.nah, 'nl')}, volgens de verordening parkeerbelastingen 2026. Daar komt de parkeerbelasting zelf nog bij, die de gemeente meestal als één uur tarief rekent. Het wettelijke maximum aan kosten is ${eur(82, 'nl')}; Arnhem zit daar net onder.` },
      { q: 'Moet je in Arnhem op zondag betalen voor parkeren?', a: `In het centrum wel, van ${hhmm(f.sun[0][0])} tot ${hhmm(f.sun[0][1])}. De zondagochtend is gratis. Volgens het register is zondag in ${num(f.sundayFree, 'nl')} van de ${num(f.zs.length, 'nl')} zones helemaal gratis. Kies uw zone in de rekenhulp en zet de dag op zondag om het voor uw plek te zien.` },
      { q: 'Wat kost een bewonersvergunning in Arnhem?', a: `${st.verg.nl}. Dat staat in de tarieventabel bij de verordening parkeerbelastingen 2026. Of u een vergunning krijgt en hoeveel per adres, regelt de gemeente in een apart besluit. Kijk dus ook op de gemeentesite voor wachtlijsten of beperkingen in uw wijk.` },
    ],
    body: (h) => `<h2>Parkeren in Arnhem: twee uurtarieven</h2>
<p>De binnenstad en de randen ervan hebben het hoge tarief, de wijken eromheen het lage. Het verschil is ${h.eur(f.z.h - f.rates[1])} per uur, wat bij een middag winkelen al snel een paar euro scheelt.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('arnhem', 'nl'), 'Straatzones in Arnhem per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>Arnhem levert de grenzen van alle zones aan het register. Typ een adres in de zoeker bovenaan en de rekenhulp zet de zone klaar. Staat er in de straat iets anders op de automaat, dan geldt de automaat.</p>
<h2>Betaaltijden in het centrum van Arnhem</h2>
<p>Elke dag tot elf uur ’s avonds, ook op zondag. Alleen de nacht en de zondagochtend zijn vrij. Een avondvoorstelling of een etentje in de binnenstad kost dus parkeergeld tot het eind.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('arnhem', 'nl'), `Betaaltijden in ${f.z.n}`)}
<h2>Naheffing en vergunning</h2>
<p>De kosten van een naheffing zijn ${h.eur(st.nah)}. ${st.verg.nl}. Beide bedragen komen uit de ${h.src('vo_arnhem', 'verordening parkeerbelastingen Arnhem 2026')}. Vergelijk met de buurstad op ${h.a('nijmegen', 'parkeren in Nijmegen')}.</p>`,
  },
  en: {
    slug: 'parking-arnhem',
    nav: 'Parking in Arnhem', card: `Centre ${eur(f.z.h, 'en')} an hour, Sunday afternoon too, permit ${eur(st.verg.bedrag, 'en')} a year`,
    title: 'Parking Arnhem 2026: centre rate, outer zones and Sunday',
    description: `Parking in Arnhem in 2026: ${eur(f.z.h, 'en')} an hour in the centre, ${eur(f.rates[1], 'en')} in the outer zones, paid until ${hhmm(f.tue[0][1])} and Sunday from ${hhmm(f.sun[0][0])}, with penalty and permit costs.`,
    h1: 'Parking in Arnhem 2026: centre, outer zones and Sunday',
    intro: `Parking in Arnhem has only two hourly rates: ${eur(f.z.h, 'en')} in the centre and ${eur(f.rates[1], 'en')} around it. Pick zone, day and time and see the amount.`,
    resume: `Arnhem has ${num(f.zs.length, 'en')} paid street zones in the National Parking Register, which keeps things simple. In ${num(f.byRate[0].n, 'en')} zones, including ${f.z.n}, an hour costs ${eur(f.z.h, 'en')}, the highest rate among the Gelderland cities on this site. In the other ${num(nLow, 'en')} zones you pay ${eur(f.rates[1], 'en')} an hour. On weekdays and Saturday you pay in the centre from ${hhmm(f.tue[0][0])} to ${hhmm(f.tue[0][1])}. On Sunday paying starts at ${hhmm(f.sun[0][0])} and also runs until ${hhmm(f.sun[0][1])}, longer than in Nijmegen. Two hours in the centre cost ${eur(f.cost2h, 'en')}, a whole working day ${eur(f.cost8h, 'en')}. The register lists no street day ticket and no park-and-ride site for Arnhem. Sunday is free in ${num(f.sundayFree, 'en')} zones. The 2026 parking tax by-law sets the costs of a parking penalty at ${eur(st.nah, 'en')}, just under the legal maximum. A resident permit costs ${eur(st.verg.bedrag, 'en')} a year.`,
    faqs: [
      { q: 'How much is a parking fine in Arnhem?', a: `The costs of a parking penalty assessment in Arnhem are ${eur(st.nah, 'en')}, under the 2026 parking tax by-law. The parking tax itself comes on top, which the municipality usually charges as one hour of the rate. The legal maximum for the costs is ${eur(82, 'en')}; Arnhem stays just below it.` },
      { q: 'Do you have to pay for parking in Arnhem on Sunday?', a: `In the centre, yes, from ${hhmm(f.sun[0][0])} to ${hhmm(f.sun[0][1])}. Sunday morning is free. According to the register, Sunday is entirely free in ${num(f.sundayFree, 'en')} of the ${num(f.zs.length, 'en')} zones. Pick your zone in the calculator and set the day to Sunday to see it for your spot.` },
      { q: 'What does a resident permit cost in Arnhem?', a: `${st.verg.en}. That is in the tariff table attached to the 2026 parking tax by-law. Whether you get a permit, and how many per address, the municipality sets in a separate decision. Check its website too for waiting lists or limits in your district.` },
    ],
    body: (h) => `<h2>Parking in Arnhem: two hourly rates</h2>
<p>The old town and its edges carry the high rate, the districts around them the low one. The gap is ${h.eur(f.z.h - f.rates[1])} an hour, which soon adds up to a few euros over an afternoon of shopping.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('arnhem', 'en'), 'Street zones in Arnhem by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>Arnhem supplies the outlines of every zone to the register. Type an address in the search box at the top and the calculator sets the zone. If the meter in the street says something else, the meter applies.</p>
<h2>Paid hours in central Arnhem</h2>
<p>Every day until eleven at night, Sunday included. Only the night and Sunday morning are free. An evening show or a dinner in the old town therefore costs parking money until the end.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('arnhem', 'en'), `Paid hours in ${f.z.n}`)}
<h2>Penalties and permits</h2>
<p>The costs of a penalty are ${h.eur(st.nah)}. ${st.verg.en}. Both amounts come from the ${h.src('vo_arnhem', 'Arnhem 2026 parking tax by-law')}. Compare with the neighbouring city on ${h.a('nijmegen', 'parking in Nijmegen')}.</p>`,
  },
});
