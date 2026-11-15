import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm } from './_f';

const f = facts('haarlem');
const st = f.st!;

export default definePage({
  id: 'haarlem', group: 'randstad', order: 9, tool: 'kosten', toolArg: { stad: 'haarlem' }, city: 'haarlem',
  related: ['home', 'gratis', 'vergunning', 'dagkaart'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_geo', 'vo_haarlem'],
  nl: {
    slug: 'parkeren-haarlem',
    nav: 'Parkeren in Haarlem', card: `Binnenstad ${eur(f.z.h, 'nl')} per uur tot ${hhmm(f.tue[0][1])}, wijken ${eur(f.rates[1], 'nl')}, vergunning per zone`,
    title: 'Parkeren Haarlem 2026: binnenstad, wijken en tijden',
    description: `Parkeren in Haarlem in 2026: ${eur(f.z.h, 'nl')} per uur in de binnenstad, ${eur(f.rates[1], 'nl')} in de wijken, betalen tot ${hhmm(f.tue[0][1])} en zondag vanaf ${hhmm(f.sun[0][0])}, plus naheffing en vergunning.`,
    h1: 'Parkeren in Haarlem 2026: binnenstad en wijken',
    intro: 'Parkeren in Haarlem gaat per wijk: Binnenstad, Noord, Oost, Zuid, West en Schalkwijk. Kies de zone, de dag en de tijd en zie wat het kost.',
    resume: `Haarlem heeft een kort register: ${num(f.zs.length, 'nl')} betaalde straatzones, die meestal naar een stadsdeel heten. De ${f.zn} is met ${eur(f.z.h, 'nl')} per uur de duurste. In ${num(f.byRate.find((x) => x.h === f.rates[1])?.n ?? 0, 'nl')} zones, waaronder Noord, Oost, Zuid en West, kost een uur ${eur(f.rates[1], 'nl')}; Schalkwijk is met ${eur(f.rates[f.rates.length - 1], 'nl')} het goedkoopst. In de binnenstad betaalt u doordeweeks en op zaterdag van ${hhmm(f.tue[0][0])} tot ${hhmm(f.tue[0][1])}, op zondag van ${hhmm(f.sun[0][0])} tot ${hhmm(f.sun[0][1])}. Twee uur winkelen in de Grote Houtstraat kosten zo ${eur(f.cost2h, 'nl')}. Een vrije zondag of avond is er nauwelijks: op dinsdag om 20:00 is geen enkele zone gratis. De kosten van een naheffingsaanslag zijn in Haarlem ${eur(st.nah, 'nl')}. Bewoners van zone B of S betalen ${eur(st.verg.bedrag, 'nl')} per jaar voor hun vergunning. Wie in Haarlem woont en geen vergunning heeft, betaalt dus gewoon het straattarief van zijn eigen wijk.`,
    faqs: [
      { q: 'Wat kost parkeren in de binnenstad van Haarlem per dag?', a: `Een werkdag van acht uur kost in de binnenstad ${eur(f.cost8h, 'nl')} als u per uur betaalt. Een dagkaart voor de straat staat voor deze zone niet in het register. Voor een hele dag zijn de zones in de wijken goedkoper; garages vallen buiten het register. De rekenhulp toont wat acht uur in elke zone kost.` },
      { q: 'Welke vergunningzones heeft Haarlem?', a: `De verordening onderscheidt onder meer zone B, zone S en zone C. In zone B of S kost een bewonersvergunning ${eur(st.verg.bedrag, 'nl')} per jaar. In zone C is de eerste vergunning goedkoper en de tweede veel duurder. De exacte grens van elke zone legt de gemeente vast in een apart besluit.` },
      { q: 'Wanneer kan ik in Haarlem gratis parkeren?', a: `’s Nachts na ${hhmm(f.tue[0][1])} en op zondagochtend tot ${hhmm(f.sun[0][0])}. In de rest van de week betaalt u in vrijwel alle zones overdag en ’s avonds. Volgens het register is zondag in ${num(f.sundayFree, 'nl')} van de ${num(f.zs.length, 'nl')} zones helemaal gratis. Borden ter plaatse gaan altijd voor.` },
    ],
    body: (h) => `<h2>Parkeren in Haarlem per stadsdeel</h2>
<p>Haarlem heeft drie uurtarieven. Het centrum is apart, de stadsdelen eromheen delen een tarief, en Schalkwijk is goedkoper. Met zo weinig zones is het register van Haarlem een van de eenvoudigste van de grote steden.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('haarlem', 'nl'), 'Straatzones in Haarlem per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>De gemeente levert de grenzen van alle zones aan het register. Typ een Haarlems adres in de zoeker bovenaan en de rekenhulp zet de juiste zone klaar. Zo ziet u ook of een straat net buiten de binnenstad valt, wat per uur flink scheelt.</p>
<h2>Betaaltijden in de binnenstad</h2>
<p>Haarlem betaalt tot elf uur ’s avonds, ook op zondag. Alleen de nacht en de zondagochtend zijn vrij.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('haarlem', 'nl'), `Betaaltijden in de ${f.zn}`)}
<h2>Vergunning en naheffing in Haarlem</h2>
<p>${st.verg.nl}. Een naheffingsaanslag kost ${h.eur(st.nah)} aan kosten, het wettelijke maximum. De bedragen staan in de ${h.src('vo_haarlem', 'verordening parkeerbelastingen 2026 van Haarlem')}. Meer over gratis tijden in andere steden: ${h.a('gratis', 'gratis parkeren')}.</p>`,
  },
  en: {
    slug: 'parking-haarlem',
    nav: 'Parking in Haarlem', card: `Old town ${eur(f.z.h, 'en')} an hour until ${hhmm(f.tue[0][1])}, districts ${eur(f.rates[1], 'en')}, permits by zone`,
    title: 'Parking Haarlem 2026: old town, districts and paid hours',
    description: `Parking in Haarlem in 2026: ${eur(f.z.h, 'en')} an hour in the old town, ${eur(f.rates[1], 'en')} in the districts, paid until ${hhmm(f.tue[0][1])} and Sunday from ${hhmm(f.sun[0][0])}, plus penalty and permit costs.`,
    h1: 'Parking in Haarlem 2026: old town and districts',
    intro: 'Parking in Haarlem works by district: Binnenstad, Noord, Oost, Zuid, West and Schalkwijk. Pick the zone, the day and the time and see what it costs.',
    resume: `Haarlem has a short register: ${num(f.zs.length, 'en')} paid street zones, mostly named after a part of town. The ${f.zn} (old town) is the dearest at ${eur(f.z.h, 'en')} an hour. In ${num(f.byRate.find((x) => x.h === f.rates[1])?.n ?? 0, 'en')} zones, including Noord, Oost, Zuid and West, an hour costs ${eur(f.rates[1], 'en')}; Schalkwijk is the cheapest at ${eur(f.rates[f.rates.length - 1], 'en')}. In the old town you pay on weekdays and Saturday from ${hhmm(f.tue[0][0])} to ${hhmm(f.tue[0][1])}, on Sunday from ${hhmm(f.sun[0][0])} to ${hhmm(f.sun[0][1])}. Two hours of shopping in the Grote Houtstraat therefore cost ${eur(f.cost2h, 'en')}. Free evenings or Sundays are rare: on a Tuesday at 8 pm no zone at all is free. The costs of a parking penalty in Haarlem are ${eur(st.nah, 'en')}. Residents of zone B or S pay ${eur(st.verg.bedrag, 'en')} a year for their permit. A Haarlem resident without a permit simply pays the street rate of their own district.`,
    faqs: [
      { q: 'What does a day of parking in Haarlem’s old town cost?', a: `An eight-hour working day in the old town costs ${eur(f.cost8h, 'en')} if you pay by the hour. The register lists no street day ticket for this zone. For a whole day the district zones are cheaper; garages are outside the register. The calculator shows what eight hours cost in each zone.` },
      { q: 'Which permit zones does Haarlem have?', a: `The by-law distinguishes zone B, zone S and zone C, among others. In zone B or S a resident permit costs ${eur(st.verg.bedrag, 'en')} a year. In zone C the first permit is cheaper and the second much dearer. The exact boundary of each zone is set by the municipality in a separate decision.` },
      { q: 'When can I park for free in Haarlem?', a: `At night after ${hhmm(f.tue[0][1])} and on Sunday morning until ${hhmm(f.sun[0][0])}. During the rest of the week you pay in nearly every zone during the day and the evening. According to the register, Sunday is entirely free in ${num(f.sundayFree, 'en')} of the ${num(f.zs.length, 'en')} zones.` },
    ],
    body: (h) => `<h2>Parking in Haarlem by district</h2>
<p>Haarlem has three hourly rates. The centre stands apart, the districts around it share one rate, and Schalkwijk is cheaper. With so few zones, Haarlem’s register is one of the simplest among the larger cities.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('haarlem', 'en'), 'Street zones in Haarlem by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>The municipality supplies the outlines of every zone to the register. Type a Haarlem address in the search box at the top and the calculator sets the right zone. You also see whether a street falls just outside the old town, which makes a real difference per hour.</p>
<h2>Paid hours in the old town</h2>
<p>Haarlem charges until eleven at night, Sunday included. Only the night and Sunday morning are free.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('haarlem', 'en'), `Paid hours in the ${f.zn}`)}
<h2>Permits and penalties in Haarlem</h2>
<p>${st.verg.en}. A parking penalty carries ${h.eur(st.nah)} in costs, the legal maximum. The amounts are in Haarlem’s ${h.src('vo_haarlem', '2026 parking tax by-law')}. More on free hours in other cities: ${h.a('gratis', 'free parking')}.</p>`,
  },
});
