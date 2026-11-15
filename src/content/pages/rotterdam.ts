import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm } from './_f';

const f = facts('rotterdam');
const st = f.st!;
const pr = f.prs.map((z) => z.n.replace(/^P\+R\s*/, '').replace(/\s*\(Rotterdam\)/, '')).join(', ');

export default definePage({
  id: 'rotterdam', group: 'randstad', order: 3, tool: 'kosten', toolArg: { stad: 'rotterdam' }, city: 'rotterdam',
  related: ['home', 'naheffing', 'pr', 'vergunning'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_geo', 'vo_rotterdam'],
  nl: {
    slug: 'parkeren-rotterdam',
    nav: 'Parkeren in Rotterdam', card: `${num(f.byRate.length, 'nl')} uurtarieven tot ${eur(f.info.hMax, 'nl')}, ${num(f.prs.length, 'nl')} P+R-terreinen, boete plus een uur`,
    title: 'Parkeren Rotterdam 2026: tarief per zone, tijden en P+R',
    description: `Parkeren in Rotterdam in 2026: van ${eur(f.rates[f.rates.length - 1], 'nl')} tot ${eur(f.info.hMax, 'nl')} per uur over ${num(f.zs.length, 'nl')} zones, de betaaltijden per dag, P+R aan de metro en de naheffing van ${eur(st.nah, 'nl')} plus een uur.`,
    h1: 'Parkeren in Rotterdam 2026: tarief en tijden per zone',
    intro: 'Parkeren in Rotterdam wordt goedkoper naarmate u verder van de Coolsingel staat. Kies uw zone, de dag en de tijd: de rekenhulp toont het bedrag en wanneer het gratis wordt.',
    resume: `Rotterdam telt ${num(f.zs.length, 'nl')} betaalde straatzones in het Nationaal Parkeer Register, verdeeld over ${num(f.byRate.length, 'nl')} uurtarieven. Het centrum, met ${f.zn} als duurste zone, kost ${eur(f.z.h, 'nl')} per uur. De meeste zones, ${num(f.byRate.find((x) => x.h === 3)?.n ?? 0, 'nl')} in totaal, rekenen ${eur(3, 'nl')} per uur. In het centrum betaalt u op dinsdag van ${hhmm(f.tue[0][0])} tot ${hhmm(f.tue[0][1])}; op vrijdag en zaterdag loopt het door tot 01:00, en op zondag begint het om ${hhmm(f.sun[1][0])}. Twee uur in het centrum op een doordeweekse ochtend kost ${eur(f.cost2h, 'nl')}. Gratis op zondag is bijna nergens: dat geldt voor ${num(f.sundayFree, 'nl')} zones. Wie een hele dag blijft, bijvoorbeeld voor werk of een bezoek aan de Markthal en de Kuip, parkeert goedkoper op een van de ${num(f.prs.length, 'nl')} P+R-terreinen aan de metro. Een naheffingsaanslag kost volgens de verordening ${eur(st.nah, 'nl')}, verhoogd met één uur van het tarief ter plaatse.`,
    faqs: [
      { q: 'Hoeveel kost een parkeerboete in Rotterdam?', a: `De verordening parkeerbelastingen 2026 zet de kosten van een naheffingsaanslag op ${eur(st.nah, 'nl')}, verhoogd met één uur van het tarief dat op die plek geldt. In het centrum, waar het uur ${eur(f.z.h, 'nl')} kost, komt het totaal zo op ${eur(st.nah + f.z.h, 'nl')}. In een zone van ${eur(3, 'nl')} per uur is het ${eur(st.nah + 3, 'nl')}.` },
      { q: 'Welke P+R-terreinen in Rotterdam staan in het register?', a: `In het register staan ${pr}. Ze liggen aan metrolijnen, zodat u in een paar haltes in het centrum bent. De voorwaarden, zoals een reis met het openbaar vervoer, staan bij de ingang en in de app. Het aantal plekken en de openingstijden staan niet in het register; kijk daarvoor op de borden ter plaatse.` },
      { q: 'Is parkeren in Rotterdam ’s avonds gratis?', a: `In de meeste zones niet tot laat in de avond. Doordeweeks betaalt u in het centrum tot ${hhmm(f.tue[0][1])}, op vrijdag en zaterdag tot 01:00. Op dinsdag om 20:00 zijn maar ${num(f.eveningFree, 'nl')} van de ${num(f.zs.length, 'nl')} zones gratis. Kies uw zone in de rekenhulp om te zien wanneer u er niet meer hoeft te betalen.` },
    ],
    body: (h) => `<h2>Parkeren in Rotterdam: tarief per zone</h2>
<p>De zones heten in het register gewoon Zone gevolgd door een nummer. Het nummer staat ook op de parkeerautomaat. De tabel groepeert ze per uurtarief.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('rotterdam', 'nl'), 'Straatzones in Rotterdam per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>Rotterdam levert de zonegrenzen aan het register, zodat de adreszoeker bovenaan uw zone meestal vindt. Typ straat, huisnummer en plaats; de rekenhulp springt dan naar de juiste zone. Staat uw auto net op de grens van twee zones, kijk dan op de automaat: het nummer daarop geldt.</p>
<h2>Betaaltijden in het centrum</h2>
<p>Vrijdag en zaterdag zijn de lange dagen. Op zondag heeft u de ochtend gratis. In de zones verder van het centrum kunnen de tijden korter zijn; kies de zone in de rekenhulp voor de juiste tabel.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('rotterdam', 'nl'), `Betaaltijden in ${f.zn}`)}
<h2>Vergunning en boete</h2>
<p>${st.verg.nl}. Op plekken voor vergunninghouders is de eerste vergunning duurder. Bron: de ${h.src('vo_rotterdam', 'verordening parkeerregulering en parkeerbelastingen 2026')}. Wat een vergunning in andere steden kost, staat op ${h.a('vergunning', 'de vergunningspagina')}; de boete per stad bij ${h.a('naheffing', 'naheffingsaanslag')}.</p>`,
  },
  en: {
    slug: 'parking-rotterdam',
    nav: 'Parking in Rotterdam', card: `${num(f.byRate.length, 'en')} hourly rates up to ${eur(f.info.hMax, 'en')}, ${num(f.prs.length, 'en')} park-and-ride sites, fine plus one hour`,
    title: 'Parking Rotterdam 2026: rate by zone, hours and P+R',
    description: `Parking in Rotterdam in 2026: ${eur(f.rates[f.rates.length - 1], 'en')} to ${eur(f.info.hMax, 'en')} an hour across ${num(f.zs.length, 'en')} zones, paid hours by day, park-and-ride by the metro and the ${eur(st.nah, 'en')} penalty plus one hour.`,
    h1: 'Parking in Rotterdam 2026: rate and hours by zone',
    intro: 'Parking in Rotterdam gets cheaper the further you are from the Coolsingel. Pick your zone, the day and the time: the calculator shows the amount and when parking turns free.',
    resume: `Rotterdam has ${num(f.zs.length, 'en')} paid street zones in the National Parking Register, spread over ${num(f.byRate.length, 'en')} hourly rates. The centre, with ${f.zn} as the dearest zone, costs ${eur(f.z.h, 'en')} an hour. Most zones, ${num(f.byRate.find((x) => x.h === 3)?.n ?? 0, 'en')} in all, charge ${eur(3, 'en')} an hour. In the centre you pay on Tuesday from ${hhmm(f.tue[0][0])} to ${hhmm(f.tue[0][1])}; on Friday and Saturday it runs until 1 am, and on Sunday it starts at ${hhmm(f.sun[1][0])}. Two hours in the centre on a weekday morning cost ${eur(f.cost2h, 'en')}. Free Sundays are rare: only ${num(f.sundayFree, 'en')} zones have one. For a whole day, say for work or a visit to the Markthal or the Kuip stadium, one of the ${num(f.prs.length, 'en')} park-and-ride sites by the metro is cheaper. A parking penalty costs ${eur(st.nah, 'en')} under the by-law, plus one hour of the local rate.`,
    faqs: [
      { q: 'How much is a parking fine in Rotterdam?', a: `The 2026 parking tax by-law sets the costs of a penalty assessment at ${eur(st.nah, 'en')}, increased by one hour of the rate that applies on the spot. In the centre, where an hour costs ${eur(f.z.h, 'en')}, the total therefore comes to ${eur(st.nah + f.z.h, 'en')}. In a zone at ${eur(3, 'en')} an hour it is ${eur(st.nah + 3, 'en')}.` },
      { q: 'Which Rotterdam park-and-ride sites are in the register?', a: `The register lists ${pr}. They sit on metro lines, so the centre is a few stops away. Conditions, such as a trip on public transport, are shown at the entrance and in the app. The number of spaces and the opening hours are not in the register; check the signs on site for those.` },
      { q: 'Is parking in Rotterdam free in the evening?', a: `In most zones, not until late. On weekdays you pay in the centre until ${hhmm(f.tue[0][1])}, and on Friday and Saturday until 1 am. On a Tuesday at 8 pm only ${num(f.eveningFree, 'en')} of the ${num(f.zs.length, 'en')} zones are free. Pick your zone in the calculator to see when you no longer need to pay there.` },
    ],
    body: (h) => `<h2>Parking in Rotterdam: rate by zone</h2>
<p>In the register the zones are simply called Zone followed by a number. That number is also on the parking meter. The table groups them by hourly rate.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('rotterdam', 'en'), 'Street zones in Rotterdam by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>Rotterdam supplies its zone outlines to the register, so the address search at the top usually finds your zone. Type street, house number and town, and the calculator jumps to the right zone. If your car is right on the border of two zones, check the meter: the number on it applies.</p>
<h2>Paid hours in the centre</h2>
<p>Friday and Saturday are the long days. On Sunday the morning is free. Zones further from the centre may have shorter hours; pick the zone in the calculator for the right table.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('rotterdam', 'en'), `Paid hours in ${f.zn}`)}
<h2>Permits and fines</h2>
<p>${st.verg.en}. On bays reserved for permit holders the first permit costs more. Source: the ${h.src('vo_rotterdam', '2026 parking regulation and tax by-law')}. What a permit costs in other cities is on ${h.a('vergunning', 'the permit page')}; fines by city under ${h.a('naheffing', 'parking penalty')}.</p>`,
  },
});
