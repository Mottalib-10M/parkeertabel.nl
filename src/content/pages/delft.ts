import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm, NAH_MAX } from './_f';

const f = facts('delft');
const nLow = f.byRate.find((x) => x.h === f.rates[1])?.n ?? 0;
const dag = f.best?.a ?? 0;

export default definePage({
  id: 'delft', group: 'randstad', order: 14, tool: 'kosten', toolArg: { stad: 'delft' }, city: 'delft',
  related: ['home', 'dagkaart', 'den-haag', 'naheffing'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_geo', 'vo_almere'],
  nl: {
    slug: 'parkeren-delft',
    nav: 'Parkeren in Delft', card: `Binnenstad ${eur(f.z.h, 'nl')} per uur vanaf ${hhmm(f.tue[0][0])}, maximaal dagtarief ${eur(dag, 'nl')}`,
    title: 'Parkeren Delft 2026: tarief binnenstad en dagtarief',
    description: `Parkeren in Delft in 2026: ${eur(f.z.h, 'nl')} per uur in de binnenstad van ${hhmm(f.tue[0][0])} tot middernacht, ${eur(f.rates[1], 'nl')} in de andere gebieden en een maximaal dagtarief van ${eur(dag, 'nl')}.`,
    h1: 'Parkeren in Delft 2026: binnenstad, gebieden en dagtarief',
    intro: `Parkeren in Delft begint pas om ${hhmm(f.tue[0][0])} en loopt in de binnenstad door tot middernacht. Kies het gebied, de dag en de tijd en zie wat het kost.`,
    resume: `Delft deelt de stad in gebieden met een letter. Het Nationaal Parkeer Register noemt ${num(f.zs.length, 'nl')} betaalde straatgebieden met tijden. In ${num(f.byRate[0].n, 'nl')} daarvan, rond de Paardenmarkt en de Voorstraat in gebied B, kost een uur ${eur(f.z.h, 'nl')}. In de ${num(nLow, 'nl')} andere gebieden, zoals C, E, F en het gebied rond de TU, is het ${eur(f.rates[1], 'nl')} per uur en begint het betalen pas om ${hhmm(720)}. In de binnenstad betaalt u doordeweeks en op zaterdag van ${hhmm(f.tue[0][0])} tot middernacht, op zondag van ${hhmm(f.sun[0][0])} tot middernacht. Twee uur kosten er ${eur(f.cost2h, 'nl')}. Bijna elk gebied kent een maximaal dagtarief: in de binnenstad ${eur(dag, 'nl')}, zodat acht uur per uur betaald (${eur(f.cost8h, 'nl')}) iets duurder is dan het maximum. Het Delftse bedrag uit de verordening parkeerbelastingen hebben wij nog niet gecontroleerd; u vindt het op de site van de gemeente. Voor de kosten van een naheffing tonen wij daarom alleen het wettelijke maximum van ${eur(NAH_MAX, 'nl')}.`,
    faqs: [
      { q: 'Wat is het maximale dagtarief voor parkeren in Delft?', a: `In de binnenstad noemt het register een maximaal dagtarief van ${eur(dag, 'nl')}. In ${num(f.tickets, 'nl')} gebieden staat zo’n maximum. Wie de hele dag blijft, betaalt dus nooit meer dan dat bedrag per dag, ook al zou het uurtarief hoger uitkomen. Controleer bij de automaat of het maximum ook in uw app geldt.` },
      { q: 'Hoe laat begint betaald parkeren in Delft?', a: `In de binnenstad om ${hhmm(f.tue[0][0])}, op zondag om ${hhmm(f.sun[0][0])}. In de meeste andere gebieden pas om ${hhmm(720)}. Dat is later dan in de meeste steden op deze site. Wie ’s ochtends vroeg in Delft is, parkeert dus vaak nog gratis. De borden in de straat gaan altijd voor.` },
      { q: 'Hoeveel kost een parkeerboete in Delft?', a: `Een verordening parkeerbelastingen van Delft vonden wij niet in de databank met lokale regelgeving, dus wij noemen geen Delfts bedrag. Wettelijk mag een gemeente maximaal ${eur(NAH_MAX, 'nl')} aan kosten per naheffing rekenen, plus de niet betaalde parkeerbelasting. Het precieze bedrag staat op de aanslag zelf.` },
    ],
    body: (h) => `<h2>Parkeren in Delft per gebied</h2>
<p>Twee uurtarieven: hoog in het hart van de binnenstad, laag in de gebieden eromheen. Het verschil is groot, ${h.eur(f.z.h - f.rates[1])} per uur, dus het loont om net buiten gebied B te zoeken.</p>
${h.table(['Uurtarief', 'Gebieden', 'Bijvoorbeeld'], rateRows('delft', 'nl'), 'Straatgebieden in Delft per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>Delft levert de grenzen van de gebieden aan het register. Met de adreszoeker bovenaan vindt u zo het gebied van een adres. In gebied H stopt het betalen al om acht uur ’s avonds, en daar is het maximale dagtarief lager.</p>
<h2>Betaaltijden in de binnenstad</h2>
<p>Laat beginnen, laat stoppen. Een vroege ochtend in de binnenstad is gratis, een avond daar niet: tot middernacht loopt de meter door, ook op zondag.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('delft', 'nl'), `Betaaltijden in ${f.zn}`)}
<h2>Dagtarief en naheffing</h2>
<p>Bereken met de ${h.a('dagkaart', 'dagkaart-rekenhulp')} vanaf welk uur het maximum geldt. Voor de naheffing tonen wij het wettelijke maximum van ${h.eur(NAH_MAX)}, zoals de ${h.src('vo_almere', 'verordening van Almere')} het formuleert; het Delftse bedrag hebben wij nog niet gecontroleerd. Meer over de buurstad op ${h.a('den-haag', 'parkeren in Den Haag')}.</p>`,
  },
  en: {
    slug: 'parking-delft',
    nav: 'Parking in Delft', card: `Old town ${eur(f.z.h, 'en')} an hour from ${hhmm(f.tue[0][0])}, maximum day rate ${eur(dag, 'en')}`,
    title: 'Parking Delft 2026: old town rate and maximum day rate',
    description: `Parking in Delft in 2026: ${eur(f.z.h, 'en')} an hour in the old town from ${hhmm(f.tue[0][0])} until midnight, ${eur(f.rates[1], 'en')} in the other lettered areas and a maximum day rate of ${eur(dag, 'en')}.`,
    h1: 'Parking in Delft 2026: old town, areas and day rate',
    intro: `Parking in Delft only starts at ${hhmm(f.tue[0][0])} and runs until midnight in the old town. Pick the area, the day and the time and see what it costs.`,
    resume: `Delft divides the city into lettered areas. The National Parking Register lists ${num(f.zs.length, 'en')} paid street areas with hours. In ${num(f.byRate[0].n, 'en')} of them, around the Paardenmarkt and the Voorstraat in area B, an hour costs ${eur(f.z.h, 'en')}. In the other ${num(nLow, 'en')} areas, such as C, E, F and the area around the university (TU), it is ${eur(f.rates[1], 'en')} an hour and paying only starts at ${hhmm(720)}. In the old town you pay on weekdays and Saturday from ${hhmm(f.tue[0][0])} until midnight, on Sunday from ${hhmm(f.sun[0][0])} until midnight. Two hours there cost ${eur(f.cost2h, 'en')}. Nearly every area has a maximum day rate: ${eur(dag, 'en')} in the old town, so eight hours paid by the hour (${eur(f.cost8h, 'en')}) come to slightly more than the maximum. We have not yet checked the Delft amount in its parking tax by-law; you will find it on the municipality's website. For the costs of a parking penalty we therefore only show the legal maximum of ${eur(NAH_MAX, 'en')}.`,
    faqs: [
      { q: 'What is the maximum day rate for parking in Delft?', a: `In the old town the register lists a maximum day rate of ${eur(dag, 'en')}. ${num(f.tickets, 'en')} areas have such a maximum. If you stay all day, you never pay more than that amount per day, even if the hourly rate would add up higher. Check at the meter whether the maximum also applies in your app.` },
      { q: 'What time does paid parking start in Delft?', a: `In the old town at ${hhmm(f.tue[0][0])}, on Sunday at ${hhmm(f.sun[0][0])}. In most other areas only at ${hhmm(720)}. That is later than in most cities on this site. If you are in Delft early in the morning, you often still park for free. Signs in the street always take precedence.` },
      { q: 'How much is a parking fine in Delft?', a: `We did not find a Delft parking tax by-law in the database of local regulations, so we give no Delft amount. By law a municipality may charge at most ${eur(NAH_MAX, 'en')} in costs per penalty assessment, plus the unpaid parking tax. The exact amount is printed on the assessment itself.` },
    ],
    body: (h) => `<h2>Parking in Delft by area</h2>
<p>Two hourly rates: high in the heart of the old town, low in the areas around it. The gap is large, ${h.eur(f.z.h - f.rates[1])} an hour, so it pays to look just outside area B.</p>
${h.table(['Hourly rate', 'Areas', 'For example'], rateRows('delft', 'en'), 'Street areas in Delft by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>Delft supplies its area outlines to the register. With the address search at the top you find the area of an address. In area H paying already stops at eight in the evening, and the maximum day rate there is lower.</p>
<h2>Paid hours in the old town</h2>
<p>Late to start, late to stop. An early morning in the old town is free, an evening there is not: the meter runs until midnight, Sunday included.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('delft', 'en'), `Paid hours in ${f.zn}`)}
<h2>Day rate and penalties</h2>
<p>Use the ${h.a('dagkaart', 'day ticket calculator')} to see from which hour the maximum applies. For penalties we show the legal maximum of ${h.eur(NAH_MAX)}, as the ${h.src('vo_almere', 'Almere by-law')} puts it; we have not yet checked the Delft amount. More on the neighbouring city on ${h.a('den-haag', 'parking in The Hague')}.</p>`,
  },
});
