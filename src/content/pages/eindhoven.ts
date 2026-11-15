import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm } from './_f';

const f = facts('eindhoven');
const st = f.st!;
const second = Math.round((f.cost2h - f.z.h) * 100) / 100;

export default definePage({
  id: 'eindhoven', group: 'stad', order: 6, tool: 'kosten', toolArg: { stad: 'eindhoven' }, city: 'eindhoven',
  related: ['home', 'naheffing', 'vergunning', 'dagkaart'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_geo', 'vo_eindhoven'],
  nl: {
    slug: 'parkeren-eindhoven',
    nav: 'Parkeren in Eindhoven', card: `Centrum ${eur(f.z.h, 'nl')} het eerste uur, ook op zondag betaald, boete ${eur(st.nah, 'nl')}`,
    title: 'Parkeren Eindhoven 2026: uurtarief centrum en tijden',
    description: `Parkeren in Eindhoven in 2026: ${eur(f.z.h, 'nl')} het eerste uur in het centrum, ook op zondag, de tijden per dag, een naheffing van ${eur(st.nah, 'nl')} en de bewonersvergunning.`,
    h1: 'Parkeren in Eindhoven 2026: centrum, tijden en boete',
    intro: 'Parkeren in Eindhoven kost in het centrum elke dag geld, ook op zondag. Kies zone, dag en tijd: de rekenhulp toont het bedrag voor uw verblijf.',
    resume: `Eindhoven heeft weinig betaalde straatzones in het Nationaal Parkeer Register: ${num(f.zs.length, 'nl')} met een gewoon uurtarief. Het duurst is ${f.zn}, waar het eerste uur ${eur(f.z.h, 'nl')} kost. Het tweede uur is daar iets goedkoper: twee uur samen kosten ${eur(f.cost2h, 'nl')}, dus ${eur(second, 'nl')} voor het tweede uur. Opvallend is dat het centrum ook op zondag betaald is, van ${hhmm(f.sun[0][0])} tot ${hhmm(f.sun[0][1])}, net als door de week. Na ${hhmm(f.tue[0][1])} parkeert u gratis. In de andere zones ligt het tarief tussen ${eur(f.info.hMin, 'nl')} en ${eur(f.rates[1], 'nl')} per uur. Een werkdag van acht uur in het centrum kost ${eur(f.cost8h, 'nl')}; voor zo’n dag is een garage vaak voordeliger, maar garages buiten het register rekenen wij niet. De kosten van een naheffingsaanslag zijn in Eindhoven ${eur(st.nah, 'nl')}, lager dan het wettelijke maximum.`,
    faqs: [
      { q: 'Moet je in Eindhoven op zondag betalen voor parkeren?', a: `In het centrum wel. Het register zet de betaaltijden daar op alle zeven dagen van ${hhmm(f.sun[0][0])} tot ${hhmm(f.sun[0][1])}, ook op zondag. Dat is anders dan in veel andere steden, waar de zondagochtend gratis is. Alleen in ${num(f.sundayFree, 'nl')} zones is zondag helemaal gratis.` },
      { q: 'Hoeveel kost een parkeerboete in Eindhoven?', a: `De verordening parkeerbelastingen 2026 zet de kosten van een naheffingsaanslag op ${eur(st.nah, 'nl')}. Daar komt de parkeerbelasting bij die u niet betaalde. Het bedrag ligt onder het wettelijke maximum voor 2026, omdat de gemeente haar eigen kosten per aanslag lager raamt.` },
      { q: 'Wat kost een bewonersvergunning in Eindhoven?', a: `${st.verg.nl}. De bedragen gelden voor een vergunning op kenteken voor iemand die in het gebied woont. Een tweede vergunning is duurder. Of er in uw straat een vergunning wordt uitgegeven, beslist de gemeente.` },
    ],
    body: (h) => `<h2>Parkeren in Eindhoven: de zones</h2>
<p>Het Eindhovense register is kort. Het centrum heeft een eigen uurtarief; de zones eromheen zijn goedkoper.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('eindhoven', 'nl'), 'Straatzones in Eindhoven per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>Het uurtarief in de tabel is wat het eerste uur kost. Door de opbouw van het tarief kost een langer verblijf per uur iets minder, zoals de rekenhulp laat zien. Kies zelf de duur om te zien wat dat voor u betekent.</p>
<h2>Betaaltijden in het centrum</h2>
<p>Zeven dagen per week dezelfde tijden: dat is ongewoon in Nederland. Een zondagmiddag winkelen kost dus net zoveel als een dinsdag.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('eindhoven', 'nl'), `Betaaltijden in ${f.zn}`)}
<h2>Boete en vergunning in Eindhoven</h2>
<p>Een naheffingsaanslag kost ${h.eur(st.nah)} aan kosten. ${st.verg.nl}. Bron: de ${h.src('vo_eindhoven', 'verordening op de heffing en invordering van parkeerbelastingen 2026')}. Wat dezelfde boete elders kost, staat bij ${h.a('naheffing', 'de naheffingsaanslag per stad')}. Bezwaar tegen een aanslag maakt u bij de gemeente, binnen zes weken na de datum op de aanslag.</p>`,
  },
  en: {
    slug: 'parking-eindhoven',
    nav: 'Parking in Eindhoven', card: `Centre ${eur(f.z.h, 'en')} for the first hour, paid on Sunday too, penalty ${eur(st.nah, 'en')}`,
    title: 'Parking Eindhoven 2026: city-centre rate and paid hours',
    description: `Parking in Eindhoven in 2026: ${eur(f.z.h, 'en')} for the first hour in the centre, paid on Sundays as well, hours by day, a ${eur(st.nah, 'en')} penalty and the resident permit amounts.`,
    h1: 'Parking in Eindhoven 2026: centre, paid hours and fines',
    intro: 'Parking in Eindhoven costs money in the centre every day, Sunday included. Pick zone, day and time: the calculator shows the amount for your stay.',
    resume: `Eindhoven has few paid street zones in the National Parking Register: ${num(f.zs.length, 'en')} with a standard hourly rate. The dearest is ${f.zn}, where the first hour costs ${eur(f.z.h, 'en')}. The second hour is a little cheaper there: two hours together cost ${eur(f.cost2h, 'en')}, so ${eur(second, 'en')} for the second hour. What stands out is that the centre is paid on Sunday too, from ${hhmm(f.sun[0][0])} to ${hhmm(f.sun[0][1])}, just as on weekdays. After ${hhmm(f.tue[0][1])} you park free. In the other zones the rate lies between ${eur(f.info.hMin, 'en')} and ${eur(f.rates[1], 'en')} an hour. An eight-hour working day in the centre costs ${eur(f.cost8h, 'en')}; for such a day a garage is often better value, but garages outside the register are not covered here. The costs of a parking penalty in Eindhoven are ${eur(st.nah, 'en')}, below the legal maximum.`,
    faqs: [
      { q: 'Do you pay to park in Eindhoven on Sunday?', a: `In the centre, yes. The register sets the paid hours there on all seven days from ${hhmm(f.sun[0][0])} to ${hhmm(f.sun[0][1])}, Sunday included. That differs from many other cities, where Sunday morning is free. Only ${num(f.sundayFree, 'en')} zones have an entirely free Sunday.` },
      { q: 'How much is a parking fine in Eindhoven?', a: `The 2026 parking tax by-law sets the costs of a penalty assessment at ${eur(st.nah, 'en')}. The parking tax you did not pay comes on top. The amount is below the 2026 legal maximum, because the municipality estimates its own cost per assessment lower.` },
      { q: 'What does a resident permit cost in Eindhoven?', a: `${st.verg.en}. The amounts apply to a permit tied to a number plate for someone who lives in the area. A second permit costs more. Whether a permit is issued in your street is up to the municipality.` },
    ],
    body: (h) => `<h2>Parking in Eindhoven: the zones</h2>
<p>Eindhoven’s register is short. The centre has its own hourly rate; the zones around it are cheaper.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('eindhoven', 'en'), 'Street zones in Eindhoven by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>The hourly rate in the table is what the first hour costs. Because of how the fare is built, a longer stay costs a little less per hour, as the calculator shows. Set the duration yourself to see what that means for you.</p>
<h2>Paid hours in the centre</h2>
<p>The same hours seven days a week: unusual in the Netherlands. A Sunday afternoon of shopping costs as much as a Tuesday.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('eindhoven', 'en'), `Paid hours in ${f.zn}`)}
<h2>Fines and permits in Eindhoven</h2>
<p>A parking penalty assessment carries ${h.eur(st.nah)} in costs. ${st.verg.en}. Source: the ${h.src('vo_eindhoven', '2026 parking tax by-law')}. What the same fine costs elsewhere is under ${h.a('naheffing', 'parking penalty by city')}. Objections to an assessment go to the municipality, within six weeks of the date on it.</p>`,
  },
});
