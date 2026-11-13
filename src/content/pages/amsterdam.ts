import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm, NAH_MAX } from './_f';

const f = facts('amsterdam');
const T11 = f.z;
const ticket = f.best;

export default definePage({
  id: 'amsterdam', group: 'randstad', order: 1, tool: 'kosten', toolArg: { stad: 'amsterdam' }, city: 'amsterdam',
  related: ['home', 'dagkaart', 'pr', 'naheffing'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_gebied', 'npr_geo', 'vo_almere'],
  nl: {
    slug: 'parkeren-amsterdam',
    nav: 'Parkeren in Amsterdam', card: `Uurtarief tot ${eur(f.info.hMax, 'nl')}, ${num(f.zs.length, 'nl')} zones, dagkaarten en P+R`,
    title: 'Parkeren Amsterdam 2026: uurtarief, zones en betaaltijden',
    description: `Parkeren in Amsterdam in 2026: van ${eur(f.info.hMin, 'nl')} tot ${eur(f.info.hMax, 'nl')} per uur, de betaaltijden per zone, avondkaart, dagkaart en P+R, uit het Nationaal Parkeer Register.`,
    h1: 'Parkeren in Amsterdam 2026: tarief per zone en tijd',
    intro: 'Parkeren in Amsterdam is duur in de grachtengordel en goedkoop aan de rand. Kies de zone, de dag en de tijd: de kosten staan meteen naast de vragen.',
    resume: `Amsterdam heeft ${num(f.zs.length, 'nl')} betaalde straatzones in het Nationaal Parkeer Register. Het uurtarief loopt van ${eur(f.info.hMin, 'nl')} in de buitenwijken tot ${eur(f.info.hMax, 'nl')} in tariefzone 1, de binnenstad binnen de Singelgracht. Daar betaalt u van maandag tot en met zaterdag van ${hhmm(f.tue[0][0])} tot middernacht en op zondag vanaf ${hhmm(f.sun[0][0])}. Twee uur parkeren op een dinsdagochtend kost in die zone ${eur(f.cost2h, 'nl')}, een werkdag van acht uur ${eur(f.cost8h, 'nl')}. Wie de hele avond blijft, kan een avondkaart van ${eur(ticket.a, 'nl')} nemen. In ${num(f.sundayFree, 'nl')} van de zones is zondag gratis. Aan de rand liggen ${num(f.prs.length, 'nl')} P+R-terreinen in het register, waar een dag parkeren veel minder kost dan in het centrum. Vergeet u te betalen, dan volgt een naheffingsaanslag; de kosten daarvan zijn in 2026 wettelijk begrensd op ${eur(NAH_MAX, 'nl')}.`,
    faqs: [
      { q: 'Waar parkeer ik het goedkoopst in Amsterdam?', a: `Op een P+R-terrein aan de rand van de stad, zoals bij de ArenA of Sloterdijk, met daarna het openbaar vervoer naar het centrum. Op straat zijn de zones met het laagste tarief de buitenwijken, maar daar staan weinig bezoekers. In de binnenstad betaalt u ${eur(f.info.hMax, 'nl')} per uur; een garage is daar soms goedkoper, maar garages buiten het register rekenen wij niet.` },
      { q: 'Tot hoe laat is parkeren betaald in de Amsterdamse binnenstad?', a: `In tariefzone 1 betaalt u van ${hhmm(f.tue[0][0])} tot middernacht, op zondag vanaf ${hhmm(f.sun[0][0])}. Sommige zones in het centrum rekenen zelfs door tot vier uur ’s nachts. De tabel op deze pagina toont de tijden voor de zone die u kiest; het bord bij de automaat geldt als het afwijkt.` },
      { q: 'Wat betekenen codes als T11A en T12A bij de Amsterdamse zones?', a: 'Het zijn de tariefcodes die Amsterdam in het register gebruikt. Het eerste cijfer na de T1 is de tariefgroep: 1 is de binnenstad, hoe hoger het cijfer, hoe goedkoper. De letter erachter zegt welke betaaltijden gelden, bijvoorbeeld tot middernacht of tot vier uur. U vindt de code op de automaat of in uw parkeerapp.' },
    ],
    body: (h) => `<h2>Parkeren in Amsterdam: ${num(f.byRate.length, 'nl')} uurtarieven</h2>
<p>De gemeente deelt de stad op in tariefgroepen. Hoe dichter bij de Dam, hoe hoger het uurtarief. De tabel telt de straatzones per uurtarief, met enkele zonenamen zoals ze in het register staan.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('amsterdam', 'nl'), 'Straatzones in Amsterdam per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>De goedkoopste regels, een paar cent per uur, gelden vooral voor bezoekers van bewoners en voor speciale plekken. Ze zijn niet bedoeld voor wie zomaar in de stad parkeert.</p>
<h2>Betaaltijden in tariefzone 1</h2>
<p>In ${T11.n} betaalt u bijna de hele dag. Alleen de nacht en de zondagochtend zijn gratis.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('amsterdam', 'nl'), 'Betaaltijden in de duurste zone van Amsterdam')}
<h2>Dagkaart, avondkaart of per uur?</h2>
<p>In ${num(f.tickets, 'nl')} Amsterdamse zones staat een dagkaart, avondkaart of zondagkaart in het register. Bij een kort bezoek betaalt u per uur; vanaf een paar uur wint de kaart. De ${h.a('dagkaart', 'dagkaart-rekenhulp')} zegt vanaf welk uur.</p>
<p>Wilt u naar het centrum zonder het hoge tarief, kijk dan bij ${h.a('pr', 'P+R')}. Wie zonder geldig parkeerrecht staat, krijgt een ${h.a('naheffing', 'naheffingsaanslag')}.</p>`,
  },
  en: {
    slug: 'parking-amsterdam',
    nav: 'Parking in Amsterdam', card: `Hourly rate up to ${eur(f.info.hMax, 'en')}, ${num(f.zs.length, 'en')} zones, day tickets and P+R`,
    title: 'Parking Amsterdam 2026: hourly rate, zones and paid hours',
    description: `Parking in Amsterdam in 2026: from ${eur(f.info.hMin, 'en')} to ${eur(f.info.hMax, 'en')} an hour, paid hours by zone, day tickets and park-and-ride, from the Dutch National Parking Register.`,
    h1: 'Parking in Amsterdam 2026: rate by zone and time',
    intro: 'Parking in Amsterdam is expensive along the canal ring and cheap on the outskirts. Pick the zone, the day and the time: the cost appears right next to the questions.',
    resume: `Amsterdam has ${num(f.zs.length, 'en')} paid street zones in the National Parking Register. The hourly rate runs from ${eur(f.info.hMin, 'en')} in outer districts to ${eur(f.info.hMax, 'en')} in tariff zone 1, the old town inside the Singelgracht canal. There you pay from Monday to Saturday from ${hhmm(f.tue[0][0])} until midnight, and on Sunday from ${hhmm(f.sun[0][0])}. Two hours on a Tuesday morning in that zone cost ${eur(f.cost2h, 'en')}, an eight-hour working day ${eur(f.cost8h, 'en')}. If you stay all evening, an evening ticket of ${eur(ticket.a, 'en')} is available. In ${num(f.sundayFree, 'en')} zones, Sunday is free. The register also lists ${num(f.prs.length, 'en')} park-and-ride sites on the edge of town, where a day costs far less than in the centre. Forget to pay and you receive a parking penalty assessment, whose costs are capped by law at ${eur(NAH_MAX, 'en')} in 2026.`,
    faqs: [
      { q: 'Where is the cheapest place to park in Amsterdam?', a: `At a park-and-ride site on the edge of the city, such as the ArenA or Sloterdijk, then public transport into the centre. On the street, the lowest rates are in outer districts, which few visitors need. In the old town you pay ${eur(f.info.hMax, 'en')} an hour; a garage can be cheaper there, but garages outside the register are not covered here.` },
      { q: 'Until what time do you pay to park in central Amsterdam?', a: `In tariff zone 1 you pay from ${hhmm(f.tue[0][0])} until midnight, and on Sunday from ${hhmm(f.sun[0][0])}. Some central zones even charge until four in the morning. The table on this page shows the hours for the zone you pick; if the sign by the meter differs, the sign applies.` },
      { q: 'What do codes such as T11A and T12A mean for Amsterdam zones?', a: 'They are the tariff codes Amsterdam uses in the register. The digit after T1 is the tariff group: 1 is the old town, and the higher the digit, the cheaper the rate. The letter that follows says which paid hours apply, for example until midnight or until four. You will find the code on the meter or in your parking app.' },
    ],
    body: (h) => `<h2>Parking in Amsterdam: ${num(f.byRate.length, 'en')} hourly rates</h2>
<p>The city is split into tariff groups. The closer to Dam Square, the higher the hourly rate. The table counts street zones by hourly rate, with a few zone names as they appear in the register.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('amsterdam', 'en'), 'Street zones in Amsterdam by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>The cheapest lines, a few cents an hour, mostly apply to residents' visitors and special bays. They are not meant for drivers who just park in the city.</p>
<h2>Paid hours in tariff zone 1</h2>
<p>In ${T11.n} you pay nearly all day. Only the night and Sunday morning are free.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('amsterdam', 'en'), "Paid hours in Amsterdam's most expensive zone")}
<h2>Day ticket, evening ticket or by the hour?</h2>
<p>In ${num(f.tickets, 'en')} Amsterdam zones the register lists a day, evening or Sunday ticket. For a short visit you pay by the hour; after a few hours the ticket wins. The ${h.a('dagkaart', 'day ticket calculator')} tells you from which hour.</p>
<p>To reach the centre without the top rate, see ${h.a('pr', 'park and ride')}. Parking without a valid right leads to a ${h.a('naheffing', 'parking penalty assessment')}.</p>`,
  },
});
