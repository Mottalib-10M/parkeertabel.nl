import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm } from './_f';

const f = facts('groningen');
const st = f.st!;

export default definePage({
  id: 'groningen', group: 'stad', order: 5, tool: 'kosten', toolArg: { stad: 'groningen' }, city: 'groningen',
  related: ['home', 'vergunning', 'gratis', 'naheffing'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_geo', 'vo_groningen'],
  nl: {
    slug: 'parkeren-groningen',
    nav: 'Parkeren in Groningen', card: `Binnen de Diepenring ${eur(f.z.h, 'nl')} per uur, zondag tot ${hhmm(f.sun[0][1])}, vergunning per jaar`,
    title: 'Parkeren Groningen 2026: tarief binnen de Diepenring',
    description: `Parkeren in Groningen in 2026: ${eur(f.z.h, 'nl')} per uur binnen de Diepenring, lager in de schil, de betaaltijden per dag, de naheffing en de bewonersvergunning.`,
    h1: 'Parkeren in Groningen 2026: Diepenring, schil en wijken',
    intro: 'Parkeren in Groningen draait om de Diepenring: daarbinnen is het duur, daarbuiten neemt het tarief af. Kies zone, dag en tijd om het bedrag te zien.',
    resume: `In Groningen staan ${num(f.zs.length, 'nl')} betaalde straatzones in het Nationaal Parkeer Register. De binnenstad binnen de Diepenring is het duurst: in ${f.zn} kost een uur ${eur(f.z.h, 'nl')}. Daaromheen liggen zones van ${eur(f.rates[1], 'nl')} en ${eur(f.rates[2], 'nl')} per uur, en een paar zones met een symbolisch tarief van ${eur(f.rates[f.rates.length - 1], 'nl')}. Binnen de Diepenring betaalt u van maandag tot en met zaterdag van ${hhmm(f.tue[0][0])} tot middernacht. Op zondag is het korter: van ${hhmm(f.sun[0][0])} tot ${hhmm(f.sun[0][1])}. Twee uur in de binnenstad op dinsdagochtend kost ${eur(f.cost2h, 'nl')}, een werkdag van acht uur ${eur(f.cost8h, 'nl')}. In ${num(f.sundayFree, 'nl')} zones is zondag helemaal gratis. Een naheffingsaanslag kost in Groningen ${eur(st.nah, 'nl')}. Bewoners van de binnenstad betalen ${eur(st.verg.bedrag, 'nl')} per jaar voor een vergunning in de eerste zone, veel meer dan in de tweede.`,
    faqs: [
      { q: 'Wat kost een bewonersvergunning in de binnenstad van Groningen?', a: `De verordening parkeerbelastingen 2026 noemt ${eur(st.verg.bedrag, 'nl')} per jaar voor een bewonersvergunning in de eerste zone, de binnenstad. Voor de tweede zone, rond het centrum, noemt dezelfde verordening een veel lager bedrag, dat verderop op deze pagina staat. Of u een vergunning krijgt, hangt af van de regels voor uw straat; daarvoor gaat u naar de gemeente.` },
      { q: 'Is parkeren in Groningen op zondag gratis?', a: `In ${num(f.sundayFree, 'nl')} van de ${num(f.zs.length, 'nl')} zones wel. In de binnenstad niet: daar betaalt u op zondag van ${hhmm(f.sun[0][0])} tot ${hhmm(f.sun[0][1])}. Wie op zondagochtend komt of na vijf uur ’s middags, parkeert ook daar gratis. De tabel op deze pagina toont de tijden per dag.` },
      { q: 'Waarom staan er zones van een paar cent per uur in Groningen?', a: `Het register noemt ${num(f.byRate.find((x) => x.h === f.rates[f.rates.length - 1])?.n ?? 0, 'nl')} zones met een tarief van ${eur(f.rates[f.rates.length - 1], 'nl')} per uur. Zulke lage tarieven horen meestal bij bezoekersregelingen of bijzondere plekken, niet bij gewone parkeerplaatsen. Op straat geldt het tarief op de automaat; de zonenaam op de automaat zegt welk tarief dat is.` },
    ],
    body: (h) => `<h2>Parkeren in Groningen: tarieven per zone</h2>
<p>De tarieven dalen in ringen rond de Grote Markt. De tabel geeft per uurtarief het aantal zones en enkele namen uit het register.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('groningen', 'nl'), 'Straatzones in Groningen per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>Groningen levert de grenzen van de zones aan het register. Typ een adres in de zoeker bovenaan en de rekenhulp kiest de juiste zone voor u. Twijfelt u op de grens van twee zones, dan geldt het nummer op de automaat in uw straat.</p>
<h2>Betaaltijden binnen de Diepenring</h2>
<p>Doordeweeks en op zaterdag is de dag lang, op zondag kort. Na middernacht betaalt niemand meer.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('groningen', 'nl'), `Betaaltijden in ${f.zn}`)}
<h2>Boete en vergunning</h2>
<p>De kosten van een naheffingsaanslag zijn ${h.eur(st.nah)}, gelijk aan het wettelijke maximum. ${st.verg.nl}. Beide bedragen staan in de ${h.src('vo_groningen', 'Groningse verordening parkeerbelastingen 2026')}. Vergelijk met andere steden op ${h.a('vergunning', 'de vergunningspagina')}. Bezoekers van bewoners parkeren vaak via een bezoekersregeling; die staat niet in het register en rekent de site niet uit.</p>`,
  },
  en: {
    slug: 'parking-groningen',
    nav: 'Parking in Groningen', card: `Inside the Diepenring ${eur(f.z.h, 'en')} an hour, Sunday until ${hhmm(f.sun[0][1])}, yearly permit`,
    title: 'Parking Groningen 2026: rates inside the Diepenring canal',
    description: `Parking in Groningen in 2026: ${eur(f.z.h, 'en')} an hour inside the Diepenring canal, lower rates further out, paid hours by day, penalty costs and the resident permit.`,
    h1: 'Parking in Groningen 2026: Diepenring, ring and districts',
    intro: 'Parking in Groningen revolves around the Diepenring canal: inside it is expensive, outside the rate drops. Pick zone, day and time to see the amount.',
    resume: `Groningen has ${num(f.zs.length, 'en')} paid street zones in the National Parking Register. The old town inside the Diepenring canal is the dearest: in ${f.zn} an hour costs ${eur(f.z.h, 'en')}. Around it lie zones at ${eur(f.rates[1], 'en')} and ${eur(f.rates[2], 'en')} an hour, plus a few with a token rate of ${eur(f.rates[f.rates.length - 1], 'en')}. Inside the Diepenring you pay from Monday to Saturday from ${hhmm(f.tue[0][0])} until midnight. Sunday is shorter, from ${hhmm(f.sun[0][0])} to ${hhmm(f.sun[0][1])}. Two hours in the old town on a Tuesday morning cost ${eur(f.cost2h, 'en')}, an eight-hour working day ${eur(f.cost8h, 'en')}. In ${num(f.sundayFree, 'en')} zones Sunday is entirely free. A parking penalty assessment costs ${eur(st.nah, 'en')} in Groningen. Residents of the old town pay ${eur(st.verg.bedrag, 'en')} a year for a permit in the first zone, far more than in the second.`,
    faqs: [
      { q: 'What does a resident permit cost in central Groningen?', a: `The 2026 parking tax by-law sets ${eur(st.verg.bedrag, 'en')} a year for a resident permit in the first zone, the old town. For the second zone, around the centre, the same by-law gives a much lower amount, shown further down this page. Whether you can get a permit depends on the rules for your street, which the municipality applies.` },
      { q: 'Is parking in Groningen free on Sunday?', a: `In ${num(f.sundayFree, 'en')} of the ${num(f.zs.length, 'en')} zones, yes. Not in the old town: there you pay on Sunday from ${hhmm(f.sun[0][0])} to ${hhmm(f.sun[0][1])}. Arrive on Sunday morning or after five in the afternoon and you park free there too. The table on this page shows the hours for each day.` },
      { q: 'Why do some Groningen zones cost a few cents an hour?', a: `The register lists ${num(f.byRate.find((x) => x.h === f.rates[f.rates.length - 1])?.n ?? 0, 'en')} zones at ${eur(f.rates[f.rates.length - 1], 'en')} an hour. Such low rates usually belong to visitor schemes or special bays, not to ordinary parking spaces. On the street the rate on the meter applies; the zone name on the meter tells you which rate that is.` },
    ],
    body: (h) => `<h2>Parking in Groningen: rates by zone</h2>
<p>Rates fall in rings around the Grote Markt. The table gives the number of zones per hourly rate and a few names from the register.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('groningen', 'en'), 'Street zones in Groningen by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>Groningen supplies its zone outlines to the register. Type an address in the search box at the top and the calculator picks the right zone for you. If you are on the border of two zones, the number on the meter in your street applies.</p>
<h2>Paid hours inside the Diepenring</h2>
<p>Weekdays and Saturday are long, Sunday is short. After midnight nobody pays.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('groningen', 'en'), `Paid hours in ${f.zn}`)}
<h2>Fines and permits</h2>
<p>The costs of a parking penalty are ${h.eur(st.nah)}, equal to the legal maximum. ${st.verg.en}. Both amounts are in the ${h.src('vo_groningen', 'Groningen 2026 parking tax by-law')}. Compare with other cities on ${h.a('vergunning', 'the permit page')}. Residents’ visitors often park under a visitor scheme; it is not in the register and the site does not calculate it.</p>`,
  },
});
