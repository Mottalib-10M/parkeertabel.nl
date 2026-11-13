import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm, NAH_MAX } from './_f';

const f = facts('den-haag');
const prog = f.odd.length;

export default definePage({
  id: 'den-haag', group: 'randstad', order: 4, tool: 'kosten', toolArg: { stad: 'den-haag' }, city: 'den-haag',
  related: ['home', 'gratis', 'pr', 'naheffing'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_geo', 'vo_almere'],
  nl: {
    slug: 'parkeren-den-haag',
    nav: 'Parkeren in Den Haag', card: `Centrum en Scheveningen ${eur(f.info.hMax, 'nl')} per uur, de meeste wijken ${eur(f.info.hMin, 'nl')}`,
    title: 'Parkeren Den Haag 2026: tarief per zone, Scheveningen',
    description: `Parkeren in Den Haag in 2026: ${eur(f.info.hMin, 'nl')} per uur in de meeste wijken, ${eur(f.info.hMax, 'nl')} in het centrum en aan de kust van Scheveningen, met de betaaltijden per dag en zone.`,
    h1: 'Parkeren in Den Haag 2026: centrum, wijken en Scheveningen',
    intro: 'Parkeren in Den Haag kost in drie op de vier zones hetzelfde lage uurtarief; het centrum en de kust zijn duur. Kies uw zone, dag en tijd en zie het bedrag.',
    resume: `Den Haag heeft ${num(f.zs.length, 'nl')} betaalde straatzones in het Nationaal Parkeer Register. Bijna overal geldt hetzelfde uurtarief van ${eur(f.info.hMin, 'nl')}: in ${num(f.byRate.find((x) => x.h === f.info.hMin)?.n ?? 0, 'nl')} zones. Duur zijn de winkelstraten in het centrum en de kuststrook van Scheveningen, met ${eur(f.info.hMax, 'nl')} per uur. In ${f.z.n} betaalt u doordeweeks van ${hhmm(f.tue[0][0])} tot middernacht, in het weekend tot 02:00 ’s nachts en op zondag vanaf ${hhmm(f.sun[1][0])}. Twee uur winkelen kost er ${eur(f.cost2h, 'nl')}. Daarnaast staan ${num(prog, 'nl')} zones in het register met een oplopend tarief: daar wordt elke minuut duurder naarmate u langer staat, zodat lang parkeren er erg duur is. Aan het strand ligt één P+R-terrein. Een Haagse verordening met het bedrag van een naheffing hebben wij niet gevonden; de kosten zijn wettelijk begrensd op ${eur(NAH_MAX, 'nl')}.`,
    faqs: [
      { q: 'Wat is het oplopende tarief in Den Haag?', a: `In ${num(prog, 'nl')} Haagse zones, waaronder Centrum - Dagtarief en Scheveningen - Dagtarief, rekent het register een prijs per minuut die stijgt met de parkeerduur. Na de eerste twintig minuten verandert de prijs per blok van tien minuten, en vanaf tachtig minuten geldt de hoogste prijs per minuut. Zo blijft kort parkeren betaalbaar en wordt een hele dag erg duur. Kies de zone in de rekenhulp om het bedrag te zien.` },
      { q: 'Hoe laat stopt betaald parkeren in Scheveningen?', a: 'In de kuststrook van Scheveningen betaalt u volgens het register elke dag van 10:00 tot middernacht, in een deel van de zones in het weekend tot 02:00. In de zomer kunnen de borden andere tijden tonen, bijvoorbeeld bij evenementen. De rekenhulp toont per dag de tijden van de zone die u kiest; het bord ter plaatse gaat voor.' },
      { q: 'Kan ik in Den Haag parkeren op een vergunninghoudersplek?', a: 'Alleen met een vergunning of een bezoekersregeling van een bewoner. Die plekken staan niet in het register als betaald parkeren, dus de rekenhulp rekent er niet mee. Parkeert u er zonder recht, dan riskeert u een naheffingsaanslag. Op de borden ziet u welke plekken voor vergunninghouders zijn.' },
    ],
    body: (h) => `<h2>Parkeren in Den Haag: drie uurtarieven</h2>
<p>Het Haagse register is eenvoudig: drie op de vier zones vragen het lage tarief. De tabel toont de zones per uurtarief, met de namen zoals in het register.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('den-haag', 'nl'), 'Straatzones in Den Haag per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>Den Haag levert de zonegrenzen aan het register. Met de adreszoeker bovenaan vindt u de zone van een adres in een paar seconden, ook aan de kust.</p>
<h2>Betaaltijden in de winkelstraten</h2>
<p>In het centrum betaalt u tot laat, in het weekend zelfs tot na middernacht. Zondagochtend is gratis.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('den-haag', 'nl'), `Betaaltijden in ${f.z.n}`)}
<h2>Strand, P+R en boete</h2>
<p>Voor een stranddag is het P+R-terrein bij Scheveningen het overwegen waard; zie ${h.a('pr', 'P+R per stad')}. De kosten van een naheffingsaanslag mogen in 2026 niet hoger zijn dan ${h.eur(NAH_MAX)}, het wettelijke maximum dat onder meer in de ${h.src('vo_almere', 'verordening van Almere')} staat. Het Haagse bedrag zelf hebben wij niet gelezen. Meer bij ${h.a('naheffing', 'naheffingsaanslag')}. Wie vaak in dezelfde wijk parkeert, kan bij de gemeente navragen of een vergunning of bezoekersregeling mogelijk is.</p>`,
  },
  en: {
    slug: 'parking-the-hague',
    nav: 'Parking in The Hague', card: `Centre and Scheveningen ${eur(f.info.hMax, 'en')} an hour, most districts ${eur(f.info.hMin, 'en')}`,
    title: 'Parking The Hague 2026: rate by zone and Scheveningen',
    description: `Parking in The Hague (Den Haag) in 2026: ${eur(f.info.hMin, 'en')} an hour in most districts, ${eur(f.info.hMax, 'en')} in the centre and on the Scheveningen seafront, with paid hours by day.`,
    h1: 'Parking in The Hague 2026: centre, districts and Scheveningen',
    intro: 'Parking in The Hague costs the same low hourly rate in three zones out of four; the centre and the seafront are expensive. Pick your zone, day and time to see the amount.',
    resume: `The Hague (Den Haag) has ${num(f.zs.length, 'en')} paid street zones in the National Parking Register. Nearly everywhere the same hourly rate of ${eur(f.info.hMin, 'en')} applies: in ${num(f.byRate.find((x) => x.h === f.info.hMin)?.n ?? 0, 'en')} zones. The shopping streets in the centre and the Scheveningen seafront are the expensive ones, at ${eur(f.info.hMax, 'en')} an hour. In ${f.z.n} you pay on weekdays from ${hhmm(f.tue[0][0])} until midnight, at weekends until 2 am and on Sunday from ${hhmm(f.sun[1][0])}. Two hours of shopping there cost ${eur(f.cost2h, 'en')}. The register also lists ${num(prog, 'en')} zones with a rising rate, where every minute costs more the longer you stay, which makes a long stay very expensive. There is one park-and-ride site by the beach. We found no Hague by-law stating the penalty amount; by law the costs are capped at ${eur(NAH_MAX, 'en')}.`,
    faqs: [
      { q: 'What is the rising parking rate in The Hague?', a: `In ${num(prog, 'en')} Hague zones, including Centrum - Dagtarief and Scheveningen - Dagtarief, the register sets a price per minute that climbs with the length of stay. After the first twenty minutes the price changes in blocks of ten minutes, and from eighty minutes the highest price per minute applies. Short stays stay affordable and a whole day becomes very expensive. Pick the zone in the calculator to see the amount.` },
      { q: 'When does paid parking stop in Scheveningen?', a: 'On the Scheveningen seafront the register shows paid parking every day from 10 am until midnight, and in some zones until 2 am at weekends. In summer the signs may show other hours, for example during events. The calculator shows the hours per day for the zone you pick; the sign on the spot takes precedence.' },
      { q: 'Can I park in a permit-holder bay in The Hague?', a: 'Only with a permit or a resident’s visitor scheme. Those bays are not in the register as paid parking, so the calculator does not cover them. Park there without a right and you risk a parking penalty assessment. The signs show which bays are for permit holders.' },
    ],
    body: (h) => `<h2>Parking in The Hague: three hourly rates</h2>
<p>The Hague’s register is simple: three zones out of four charge the low rate. The table lists zones by hourly rate, with names as in the register.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('den-haag', 'en'), 'Street zones in The Hague by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>The Hague supplies its zone outlines to the register. With the address search at the top you find the zone of an address in seconds, on the seafront too.</p>
<h2>Paid hours in the shopping streets</h2>
<p>In the centre you pay until late, at weekends even past midnight. Sunday morning is free.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('den-haag', 'en'), `Paid hours in ${f.z.n}`)}
<h2>Beach, park and ride and fines</h2>
<p>For a day at the beach, the park-and-ride site at Scheveningen is worth a look; see ${h.a('pr', 'park and ride by city')}. The costs of a parking penalty cannot exceed ${h.eur(NAH_MAX)} in 2026, the legal maximum stated among others in the ${h.src('vo_almere', 'Almere by-law')}. We have not read The Hague’s own amount. More under ${h.a('naheffing', 'parking penalty')}. If you park in the same district often, ask the municipality whether a permit or visitor scheme is possible.</p>`,
  },
});
