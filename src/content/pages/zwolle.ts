import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm } from './_f';

const f = facts('zwolle');
const st = f.st!;
const second = Math.round((f.cost2h - f.z.h) * 100) / 100;
const terrein = f.zs.find((x) => /Parkeerterrein/.test(x.n) && x.p.length)?.p[0]?.a ?? 0;

export default definePage({
  id: 'zwolle', group: 'stad', order: 15, tool: 'kosten', toolArg: { stad: 'zwolle' }, city: 'zwolle',
  related: ['home', 'dagkaart', 'vergunning', 'gratis'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_gebied', 'vo_zwolle'],
  nl: {
    slug: 'parkeren-zwolle',
    nav: 'Parkeren in Zwolle', card: `Centrum ${eur(f.z.h, 'nl')} het eerste uur, daarna duurder; terreinen met dagkaart ${eur(terrein, 'nl')}`,
    title: 'Parkeren Zwolle 2026: oplopend tarief centrum en zones',
    description: `Parkeren in Zwolle in 2026: in zone 1 kost het eerste uur ${eur(f.z.h, 'nl')} en het tweede ${eur(second, 'nl')}, zone 2 tot 4 zijn goedkoper, met dagkaarten van ${eur(terrein, 'nl')} en de vergunning.`,
    h1: 'Parkeren in Zwolle 2026: oplopend tarief en vier zones',
    intro: `Parkeren in Zwolle wordt in het centrum per uur duurder: twee uur kosten ${eur(f.cost2h, 'nl')}, niet ${eur(2 * f.z.h, 'nl')}. Kies zone, dag en tijd en zie het bedrag.`,
    resume: `Zwolle werkt met vier genummerde zones. Zone 1 Centrum is de enige met het hoogste tarief, en daar loopt het bedrag op naarmate u langer blijft. Het eerste uur kost ${eur(f.z.h, 'nl')}, het tweede ${eur(second, 'nl')}. Vier uur kosten volgens het register ${eur(f.cost4h, 'nl')}, acht uur ${eur(f.cost8h, 'nl')}. Wie lang blijft, is in de zones eromheen dus goedkoper uit. In zone 2 Centrumschil en zone 3 Spoorzone kost een uur ${eur(f.rates[1], 'nl')}, in zone 4 Schil en op de parkeerterreinen ${eur(f.rates[2], 'nl')}. Op ${num(f.tickets, 'nl')} plekken, vooral parkeerterreinen, staat een dagkaart in het register, meestal van ${eur(terrein, 'nl')}. In zone 1 betaalt u doordeweeks en op zaterdag van ${hhmm(f.tue[0][0])} tot ${hhmm(f.tue[0][1])}, op zondag alleen van ${hhmm(f.sun[0][0])} tot ${hhmm(f.sun[0][1])}. In de andere zones stopt het betalen meestal om 20:00. De kosten van een naheffing zijn ${eur(st.nah, 'nl')}, het wettelijke maximum. Een eerste bewonersvergunning in zone I kost ${eur(st.verg.bedrag, 'nl')} per jaar.`,
    faqs: [
      { q: 'Waarom kost parkeren in het centrum van Zwolle per uur steeds meer?', a: `In zone 1 Centrum rekent het register een oplopend tarief: het tweede uur kost ${eur(second, 'nl')}, meer dan het eerste van ${eur(f.z.h, 'nl')}. Kort parkeren in de binnenstad blijft zo betaalbaar, lang parkeren wordt snel duur. Voor een lange dag is een parkeerterrein met dagkaart in zone 2 veel goedkoper.` },
      { q: 'Waar parkeer je in Zwolle met een dagkaart?', a: `Op ${num(f.tickets, 'nl')} plekken in het register, vooral parkeerterreinen in zone 2 Centrumschil zoals Turfmarkt en Schuttervaerkade, en Hanzehoven in de Spoorzone. Een dagkaart kost daar meestal ${eur(terrein, 'nl')}. Kies de plek in de dagkaart-rekenhulp om te zien vanaf welk uur de kaart voordeliger is.` },
      { q: 'Wat kost een bewonersvergunning in Zwolle?', a: `${st.verg.nl}. Dat staat in de tarieventabel bij de verordening parkeerbelastingen 2026. Het verschil tussen het centrum en de zones eromheen is groot. Of u een vergunning krijgt, hangt af van uw adres en de regels van de gemeente.` },
    ],
    body: (h) => `<h2>Parkeren in Zwolle per zone</h2>
<p>Vier uurtarieven. Het hoogste geldt alleen in zone 1; de terreinen in de schil zijn het goedkoopst. De tabel toont het eerste uur; in zone 1 kosten de volgende uren meer, zoals de rekenhulp laat zien als u een langere duur kiest.</p>
${h.table(['Uurtarief (eerste uur)', 'Zones', 'Bijvoorbeeld'], rateRows('zwolle', 'nl'), 'Straatzones en terreinen in Zwolle per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>Zwolle levert voor ${num(f.info.geo, 'nl')} zones grenzen aan het register. Voor de rest kiest u de zone of het terrein zelf in de lijst; het nummer van de zone staat op de automaat.</p>
<h2>Betaaltijden in zone 1 Centrum</h2>
<p>Doordeweeks lang, op zondag kort: alleen de middag is betaald. De avond tot elf uur telt in zone 1 wel mee.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('zwolle', 'nl'), `Betaaltijden in ${f.zn}`)}
<h2>Dagkaart, vergunning en naheffing</h2>
<p>Voor een lange dag is een ${h.a('dagkaart', 'dagkaart')} op een terrein de voor de hand liggende keuze. ${st.verg.nl}. Een naheffing kost ${h.eur(st.nah)} aan kosten. Bron: de ${h.src('vo_zwolle', 'verordening parkeerbelastingen Zwolle 2026')}.</p>`,
  },
  en: {
    slug: 'parking-zwolle',
    nav: 'Parking in Zwolle', card: `Centre ${eur(f.z.h, 'en')} for the first hour, dearer after that; car parks with ${eur(terrein, 'en')} day tickets`,
    title: 'Parking Zwolle 2026: rising centre rate and four zones',
    description: `Parking in Zwolle in 2026: in zone 1 the first hour costs ${eur(f.z.h, 'en')} and the second ${eur(second, 'en')}, zones 2 to 4 are cheaper, with day tickets of ${eur(terrein, 'en')} and permits.`,
    h1: 'Parking in Zwolle 2026: rising rate and four zones',
    intro: `Parking in Zwolle gets dearer by the hour in the centre: two hours cost ${eur(f.cost2h, 'en')}, not ${eur(2 * f.z.h, 'en')}. Pick zone, day and time and see the amount.`,
    resume: `Zwolle works with four numbered zones. Zone 1 Centrum is the only one with the top rate, and there the amount rises the longer you stay. The first hour costs ${eur(f.z.h, 'en')}, the second ${eur(second, 'en')}. Four hours cost ${eur(f.cost4h, 'en')} according to the register, eight hours ${eur(f.cost8h, 'en')}. If you stay long, the zones around it are therefore cheaper. In zone 2 Centrumschil and zone 3 Spoorzone an hour costs ${eur(f.rates[1], 'en')}, in zone 4 Schil and in the car parks ${eur(f.rates[2], 'en')}. At ${num(f.tickets, 'en')} places, mostly car parks, the register lists a day ticket, usually ${eur(terrein, 'en')}. In zone 1 you pay on weekdays and Saturday from ${hhmm(f.tue[0][0])} to ${hhmm(f.tue[0][1])}, on Sunday only from ${hhmm(f.sun[0][0])} to ${hhmm(f.sun[0][1])}. In the other zones paying usually stops at 20:00. The costs of a parking penalty are ${eur(st.nah, 'en')}, the legal maximum. A first resident permit in zone I costs ${eur(st.verg.bedrag, 'en')} a year.`,
    faqs: [
      { q: 'Why does parking in central Zwolle cost more each hour?', a: `In zone 1 Centrum the register applies a rising rate: the second hour costs ${eur(second, 'en')}, more than the first at ${eur(f.z.h, 'en')}. Short stays in the old town remain affordable, long ones soon get expensive. For a long day, a car park with a day ticket in zone 2 is far cheaper.` },
      { q: 'Where can you park with a day ticket in Zwolle?', a: `At ${num(f.tickets, 'en')} places in the register, mostly car parks in zone 2 Centrumschil such as Turfmarkt and Schuttervaerkade, and Hanzehoven in the Spoorzone. A day ticket there usually costs ${eur(terrein, 'en')}. Pick the place in the day ticket calculator to see from which hour the ticket is the better deal.` },
      { q: 'What does a resident permit cost in Zwolle?', a: `${st.verg.en}. That is in the tariff table attached to the 2026 parking tax by-law. The gap between the centre and the zones around it is large. Whether you get a permit depends on your address and the municipality’s rules.` },
    ],
    body: (h) => `<h2>Parking in Zwolle by zone</h2>
<p>Four hourly rates. The highest applies only in zone 1; the car parks in the outer ring are the cheapest. The table shows the first hour; in zone 1 the following hours cost more, as the calculator shows when you choose a longer stay.</p>
${h.table(['Hourly rate (first hour)', 'Zones', 'For example'], rateRows('zwolle', 'en'), 'Street zones and car parks in Zwolle by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>Zwolle supplies outlines to the register for ${num(f.info.geo, 'en')} zones. For the rest you pick the zone or car park yourself from the list; the zone number is on the meter.</p>
<h2>Paid hours in zone 1 Centrum</h2>
<p>Long on weekdays, short on Sunday: only the afternoon is paid. The evening until eleven does count in zone 1.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('zwolle', 'en'), `Paid hours in ${f.zn}`)}
<h2>Day tickets, permits and penalties</h2>
<p>For a long day, a ${h.a('dagkaart', 'day ticket')} in a car park is the obvious choice. ${st.verg.en}. A penalty carries ${h.eur(st.nah)} in costs. Source: the ${h.src('vo_zwolle', 'Zwolle 2026 parking tax by-law')}.</p>`,
  },
});
