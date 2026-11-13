import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm } from './_f';

const f = facts('maastricht');
const st = f.st!;
const extra = Math.round((f.cost8h - 8 * f.z.h) * 100) / 100;

export default definePage({
  id: 'maastricht', group: 'stad', order: 10, tool: 'kosten', toolArg: { stad: 'maastricht' }, city: 'maastricht',
  related: ['home', 'gratis', 'dagkaart', 'naheffing'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_gebied', 'vo_maastricht'],
  nl: {
    slug: 'parkeren-maastricht',
    nav: 'Parkeren in Maastricht', card: `Centrum ${eur(f.z.h, 'nl')} per uur, gratis na ${hhmm(f.tue[0][1])}, vergunning per maand`,
    title: 'Parkeren Maastricht 2026: tarief centrum, gratis na 18 uur',
    description: `Parkeren in Maastricht in 2026: ${eur(f.z.h, 'nl')} per uur in het centrum en Wyck, betaald van ${hhmm(f.tue[0][0])} tot ${hhmm(f.tue[0][1])}, daarna gratis, met de naheffing en de bewonersvergunning.`,
    h1: 'Parkeren in Maastricht 2026: centrum, Wyck en de avond',
    intro: `Parkeren in Maastricht is ’s avonds gratis: na ${hhmm(f.tue[0][1])} betaalt u nergens meer op straat. Kies zone, dag en tijd en zie wat uw bezoek kost.`,
    resume: `Maastricht heeft ${num(f.zs.length, 'nl')} betaalde straatzones in het Nationaal Parkeer Register. In ${num(f.byRate.find((x) => x.h === f.z.h)?.n ?? 0, 'nl')} zones, zoals Centrum, Wyck, Jeker en Ceramique, kost een uur ${eur(f.z.h, 'nl')}. Daarbuiten is het ${eur(f.rates[1], 'nl')}, en enkele zones kennen een tarief van ${eur(f.rates[f.rates.length - 1], 'nl')}. De betaaltijden zijn kort: doordeweeks en op zaterdag van ${hhmm(f.tue[0][0])} tot ${hhmm(f.tue[0][1])}, op zondag van ${hhmm(f.sun[0][0])} tot ${hhmm(f.sun[0][1])}. Na zes uur ’s avonds is parkeren op straat in alle ${num(f.eveningFree, 'nl')} zones gratis. Twee uur in het centrum kosten ${eur(f.cost2h, 'nl')}. Een lange dag wordt duurder dan acht keer het uurtarief: acht uur kosten ${eur(f.cost8h, 'nl')}, ${eur(extra, 'nl')} meer, omdat het tarief na een paar uur oploopt. Maastricht levert geen zonegrenzen aan het register, dus de adreszoeker vindt hier geen zone. De naheffing kost ${eur(st.nah, 'nl')} plus het tarief van het eerste uur.`,
    faqs: [
      { q: 'Is parkeren in Maastricht ’s avonds gratis?', a: `Ja, op straat wel. Het register zet de betaaltijden in het centrum op ${hhmm(f.tue[0][0])} tot ${hhmm(f.tue[0][1])}, ook op zaterdag. Op een dinsdag om acht uur ’s avonds is geen enkele van de ${num(f.zs.length, 'nl')} zones betaald. Garages hebben hun eigen tijden en tarieven; die staan niet in de rekenhulp.` },
      { q: 'Waarom kost een dag parkeren in Maastricht meer dan acht keer het uurtarief?', a: `Omdat het tarief in het centrum na een aantal uren stijgt: de latere uren kosten in het register meer dan het eerste. Wie lang blijft, betaalt dus per uur steeds meer. Acht uur kosten volgens het register ${eur(f.cost8h, 'nl')}, terwijl acht losse uren ${eur(8 * f.z.h, 'nl')} zouden zijn.` },
      { q: 'Wat kost een parkeervergunning in de binnenstad van Maastricht?', a: `${st.verg.nl}. Dat staat in de tarieventabel bij de verordening parkeerregulering en parkeerbelastingen. Het verschil tussen binnenstad en de rest van de stad is groot. Of u in aanmerking komt, hangt af van uw adres en de regels van de gemeente.` },
    ],
    body: (h) => `<h2>Parkeren in Maastricht: zones en uurtarief</h2>
<p>Het hoogste tarief geldt in de oude stad aan beide kanten van de Maas. In de wijken daarbuiten is het ongeveer de helft.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('maastricht', 'nl'), 'Straatzones in Maastricht per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>Omdat de gemeente geen zonegrenzen aan het register levert, kiest u de zone zelf in de lijst. De naam, bijvoorbeeld Centrum of Wyck, staat op de automaat en in de parkeerapp. Twijfelt u, kies dan de duurste zone in de buurt: dan valt het bedrag niet tegen.</p>
<h2>Betaaltijden in het centrum</h2>
<p>Maastricht stopt vroeg met betalen. Een avond in de stad kost op straat niets als u na zessen komt. Op zondag begint het betalen pas om twaalf uur, zodat ook de zondagochtend vrij is.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('maastricht', 'nl'), `Betaaltijden in ${f.z.n}`)}
<h2>Naheffing en vergunning</h2>
<p>De kosten van een naheffingsaanslag zijn ${h.eur(st.nah)}, verhoogd met het tarief van het eerste uur ter plaatse. ${st.verg.nl}. Bron: de ${h.src('vo_maastricht', 'verordening parkeerregulering en parkeerbelastingen van Maastricht')}. Zie ook ${h.a('gratis', 'gratis parkeren per stad')}.</p>`,
  },
  en: {
    slug: 'parking-maastricht',
    nav: 'Parking in Maastricht', card: `Centre ${eur(f.z.h, 'en')} an hour, free after ${hhmm(f.tue[0][1])}, monthly permit`,
    title: 'Parking Maastricht 2026: centre rate, free after 6 pm',
    description: `Parking in Maastricht in 2026: ${eur(f.z.h, 'en')} an hour in the centre and Wyck, paid from ${hhmm(f.tue[0][0])} to ${hhmm(f.tue[0][1])} and free after that, with penalty costs and the resident permit.`,
    h1: 'Parking in Maastricht 2026: centre, Wyck and the evening',
    intro: `Parking in Maastricht is free in the evening: after ${hhmm(f.tue[0][1])} you no longer pay on any street. Pick zone, day and time and see what your visit costs.`,
    resume: `Maastricht has ${num(f.zs.length, 'en')} paid street zones in the National Parking Register. In ${num(f.byRate.find((x) => x.h === f.z.h)?.n ?? 0, 'en')} zones, such as Centrum, Wyck, Jeker and Ceramique, an hour costs ${eur(f.z.h, 'en')}. Further out it is ${eur(f.rates[1], 'en')}, and a few zones have a rate of ${eur(f.rates[f.rates.length - 1], 'en')}. Paid hours are short: on weekdays and Saturday from ${hhmm(f.tue[0][0])} to ${hhmm(f.tue[0][1])}, on Sunday from ${hhmm(f.sun[0][0])} to ${hhmm(f.sun[0][1])}. After six in the evening, street parking is free in all ${num(f.eveningFree, 'en')} zones. Two hours in the centre cost ${eur(f.cost2h, 'en')}. A long day costs more than eight times the hourly rate: eight hours cost ${eur(f.cost8h, 'en')}, ${eur(extra, 'en')} more, because the rate rises after a few hours. Maastricht supplies no zone outlines to the register, so the address search cannot find a zone here. A parking penalty costs ${eur(st.nah, 'en')} plus the first-hour rate.`,
    faqs: [
      { q: 'Is parking in Maastricht free in the evening?', a: `On the street, yes. The register sets paid hours in the centre from ${hhmm(f.tue[0][0])} to ${hhmm(f.tue[0][1])}, Saturday included. On a Tuesday at eight in the evening, not one of the ${num(f.zs.length, 'en')} zones is paid. Garages have their own hours and rates, which are not in the calculator.` },
      { q: 'Why does a day of parking in Maastricht cost more than eight hourly rates?', a: `Because the rate in the centre rises after a number of hours: the later hours cost more in the register than the first. The longer you stay, the more each hour costs. Eight hours cost ${eur(f.cost8h, 'en')} according to the register, while eight separate hours would be ${eur(8 * f.z.h, 'en')}.` },
      { q: 'What does a parking permit cost in central Maastricht?', a: `${st.verg.en}. That is in the tariff table attached to the parking regulation and tax by-law. The gap between the city centre and the rest of the city is large. Whether you qualify depends on your address and the municipality’s rules.` },
    ],
    body: (h) => `<h2>Parking in Maastricht: zones and hourly rate</h2>
<p>The highest rate applies in the old city on both banks of the Maas. In the districts beyond it is about half.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('maastricht', 'en'), 'Street zones in Maastricht by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>Because the municipality supplies no zone outlines to the register, you pick the zone yourself from the list. The name, for example Centrum or Wyck, is on the meter and in the parking app. If in doubt, pick the dearest zone nearby, so the amount holds no surprise.</p>
<h2>Paid hours in the centre</h2>
<p>Maastricht stops charging early. An evening in town costs nothing on the street if you arrive after six. On Sunday paying only starts at noon, so Sunday morning is free too.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('maastricht', 'en'), `Paid hours in ${f.z.n}`)}
<h2>Penalties and permits</h2>
<p>The costs of a parking penalty are ${h.eur(st.nah)}, increased by the local first-hour rate. ${st.verg.en}. Source: Maastricht’s ${h.src('vo_maastricht', 'parking regulation and tax by-law')}. See also ${h.a('gratis', 'free parking by city')}.</p>`,
  },
});
