import { definePage } from '../../lib/page-types';
import { facts, rateRows, weekRows, eur, num, hhmm } from './_f';

const f = facts('amersfoort');
const st = f.st!;
const nMid = f.byRate.find((x) => x.h === f.rates[1])?.n ?? 0;
const nLow = f.byRate.find((x) => x.h === f.rates[f.rates.length - 1])?.n ?? 0;

export default definePage({
  id: 'amersfoort', group: 'stad', order: 16, tool: 'kosten', toolArg: { stad: 'amersfoort' }, city: 'amersfoort',
  related: ['home', 'vergunning', 'gratis', 'utrecht'],
  sources: ['npr_tarief', 'npr_tijdvak', 'npr_geo', 'vo_amersfoort'],
  nl: {
    slug: 'parkeren-amersfoort',
    nav: 'Parkeren in Amersfoort', card: `Tot ${eur(f.z.h, 'nl')} per uur in genummerde zones, vergunning eenmalig ${eur(st.verg.bedrag, 'nl')}`,
    title: 'Parkeren Amersfoort 2026: zonenummers, tarief en tijden',
    description: `Parkeren in Amersfoort in 2026: ${eur(f.z.h, 'nl')} per uur in zone 9003 tot middernacht, ${eur(f.rates[1], 'nl')} in zeven zones, de maximale duur, de naheffing en de vergunning per adres.`,
    h1: 'Parkeren in Amersfoort 2026: zonenummers en tarieven',
    intro: 'Parkeren in Amersfoort gaat per zonenummer, zoals 9003 of 9010. Typ uw adres of kies het nummer van de automaat, dan de dag en de tijd: het bedrag volgt.',
    resume: `Amersfoort geeft zijn ${num(f.zs.length, 'nl')} betaalde straatzones in het Nationaal Parkeer Register geen namen maar nummers. Het hoogste uurtarief, ${eur(f.z.h, 'nl')}, geldt in ${num(f.byRate[0].n, 'nl')} zones, waaronder 9003. In ${num(nMid, 'nl')} zones kost een uur ${eur(f.rates[1], 'nl')}, en in ${num(nLow, 'nl')} zones maar ${eur(f.rates[f.rates.length - 1], 'nl')}. Veel zones hebben een maximale parkeerduur van één, twee of vier uur; die staat bij de zone in het register en de rekenhulp waarschuwt als u erboven komt. In zone 9003 betaalt u doordeweeks en op zaterdag van ${hhmm(f.tue[0][0])} tot middernacht, op zondag van ${hhmm(f.sun[0][0])} tot middernacht. Twee uur kosten er ${eur(f.cost2h, 'nl')}. Zone 9005 is bijzonder: daar betaalt u juist ’s nachts. Zondag is in ${num(f.sundayFree, 'nl')} zones gratis. De kosten van een naheffingsaanslag zijn ${eur(st.nah, 'nl')}. Voor bewoners is de eerste vergunning goedkoop: ${eur(st.verg.bedrag, 'nl')}, eenmalig.`,
    faqs: [
      { q: 'Wat betekenen de zonenummers in Amersfoort?', a: 'Amersfoort meldt zijn zones in het register met een nummer, zoals 9003 of 9014, en niet met een straatnaam. Dat nummer staat op de automaat en geeft u in de parkeerapp in. Met de adreszoeker bovenaan vindt u voor de meeste adressen het juiste nummer zonder het te hoeven weten.' },
      { q: 'Wat kost een bewonersvergunning in Amersfoort?', a: `${st.verg.nl}. Dat staat in de tarieventabel bij de verordening parkeerbelastingen 2025 tot 2026. De eerste vergunning is dus geen jaarbedrag maar een eenmalig bedrag. Of u een vergunning krijgt, hangt af van uw adres en de regels van de gemeente.` },
      { q: 'Hoeveel kost een parkeerboete in Amersfoort?', a: `De kosten van een naheffingsaanslag zijn in Amersfoort ${eur(st.nah, 'nl')}, volgens de verordening parkeerbelastingen. Dat is iets onder het wettelijke maximum van ${eur(82, 'nl')}. Daarbij komt de parkeerbelasting die u niet betaalde. Het precieze totaal staat op de aanslag zelf.` },
    ],
    body: (h) => `<h2>Parkeren in Amersfoort per zonenummer</h2>
<p>Vier uurtarieven, met ${h.eur(f.z.h)} als hoogste. De tabel toont per tarief een paar zonenummers uit het register. Het laagste tarief, een paar dubbeltjes per uur, geldt in de zones 9006, 9008 en 9013.</p>
${h.table(['Uurtarief', 'Zones', 'Bijvoorbeeld'], rateRows('amersfoort', 'nl'), 'Straatzones in Amersfoort per uurtarief (Nationaal Parkeer Register)', ['r', 'r', 'l'])}
<p>Amersfoort levert voor ${num(f.info.geo, 'nl')} van de ${num(f.zs.length, 'nl')} zones grenzen aan het register, zodat de adreszoeker meestal de zone vindt. Let op de maximale parkeerduur: in sommige zones mag u maar één of twee uur blijven, ook als u langer zou willen betalen.</p>
<h2>Betaaltijden in zone 9003</h2>
<p>Elke dag tot middernacht, op zondag vanaf het middaguur. Andere zones stoppen eerder, sommige al om vijf uur ’s middags.</p>
${h.table(['Dag', 'Betaald (uurtarief)'], weekRows('amersfoort', 'nl'), `Betaaltijden in zone ${f.z.n}`)}
<h2>Vergunning en naheffing</h2>
<p>${st.verg.nl}. Een naheffing kost ${h.eur(st.nah)} aan kosten. Bron: de ${h.src('vo_amersfoort', 'verordening parkeerbelastingen Amersfoort 2025 tot 2026')}. Vergelijk met ${h.a('utrecht', 'parkeren in Utrecht')} of ${h.a('vergunning', 'de vergunningen per stad')}.</p>`,
  },
  en: {
    slug: 'parking-amersfoort',
    nav: 'Parking in Amersfoort', card: `Up to ${eur(f.z.h, 'en')} an hour in numbered zones, permit ${eur(st.verg.bedrag, 'en')} one-off`,
    title: 'Parking Amersfoort 2026: zone numbers, rates and hours',
    description: `Parking in Amersfoort in 2026: ${eur(f.z.h, 'en')} an hour in zone 9003 until midnight, ${eur(f.rates[1], 'en')} in seven other zones, maximum stays, penalty costs and the resident permit.`,
    h1: 'Parking in Amersfoort 2026: zone numbers and rates',
    intro: 'Parking in Amersfoort works by zone number, such as 9003 or 9010. Type your address or pick the number on the meter, then the day and the time: the amount follows.',
    resume: `Amersfoort gives its ${num(f.zs.length, 'en')} paid street zones in the National Parking Register numbers rather than names. The highest hourly rate, ${eur(f.z.h, 'en')}, applies in ${num(f.byRate[0].n, 'en')} zones, including 9003. In ${num(nMid, 'en')} zones an hour costs ${eur(f.rates[1], 'en')}, and in ${num(nLow, 'en')} zones only ${eur(f.rates[f.rates.length - 1], 'en')}. Many zones have a maximum stay of one, two or four hours; it is attached to the zone in the register and the calculator warns you if you go beyond it. In zone 9003 you pay on weekdays and Saturday from ${hhmm(f.tue[0][0])} until midnight, on Sunday from ${hhmm(f.sun[0][0])} until midnight. Two hours there cost ${eur(f.cost2h, 'en')}. Zone 9005 is unusual: there you pay at night. Sunday is free in ${num(f.sundayFree, 'en')} zones. The costs of a parking penalty are ${eur(st.nah, 'en')}. For residents the first permit is cheap: ${eur(st.verg.bedrag, 'en')}, one-off.`,
    faqs: [
      { q: 'What do the zone numbers in Amersfoort mean?', a: 'Amersfoort reports its zones to the register with a number, such as 9003 or 9014, rather than a street name. That number is on the meter and is what you enter in the parking app. With the address search at the top you find the right number for most addresses without needing to know it.' },
      { q: 'What does a resident permit cost in Amersfoort?', a: `${st.verg.en}. That is in the tariff table attached to the 2025 to 2026 parking tax by-law. The first permit is therefore not a yearly amount but a one-off charge. Whether you get a permit depends on your address and the municipality’s rules.` },
      { q: 'How much is a parking fine in Amersfoort?', a: `The costs of a parking penalty assessment in Amersfoort are ${eur(st.nah, 'en')}, under the parking tax by-law. That is just under the legal maximum of ${eur(82, 'en')}. The parking tax you did not pay comes on top. The exact total is printed on the assessment.` },
    ],
    body: (h) => `<h2>Parking in Amersfoort by zone number</h2>
<p>Four hourly rates, with ${h.eur(f.z.h)} the highest. The table shows a few zone numbers from the register for each rate. The lowest rate, a few tens of cents an hour, applies in zones 9006, 9008 and 9013.</p>
${h.table(['Hourly rate', 'Zones', 'For example'], rateRows('amersfoort', 'en'), 'Street zones in Amersfoort by hourly rate (National Parking Register)', ['r', 'r', 'l'])}
<p>Amersfoort supplies outlines to the register for ${num(f.info.geo, 'en')} of its ${num(f.zs.length, 'en')} zones, so the address search usually finds the zone. Mind the maximum stay: in some zones you may only stay one or two hours, even if you would like to pay for longer.</p>
<h2>Paid hours in zone 9003</h2>
<p>Every day until midnight, on Sunday from noon. Other zones stop earlier, some as early as five in the afternoon.</p>
${h.table(['Day', 'Paid hours (hourly rate)'], weekRows('amersfoort', 'en'), `Paid hours in zone ${f.z.n}`)}
<h2>Permits and penalties</h2>
<p>${st.verg.en}. A penalty carries ${h.eur(st.nah)} in costs. Source: the ${h.src('vo_amersfoort', 'Amersfoort 2025 to 2026 parking tax by-law')}. Compare with ${h.a('utrecht', 'parking in Utrecht')} or ${h.a('vergunning', 'permits by city')}.</p>`,
  },
});
