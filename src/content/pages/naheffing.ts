import { definePage } from '../../lib/page-types';
import { eur, num, STEDEN, NAH_MAX, K, cityLink, facts } from './_f';

const rot = facts('rotterdam');

type Lg = 'nl' | 'en';
const list = Object.entries(STEDEN).map(([s, x]) => ({ s, n: K.city(s).n, nah: x.nah, uur: x.uur })).sort((a, b) => b.nah - a.nah || a.n.localeCompare(b.n, 'nl'));
const atMax = list.filter((x) => x.nah >= NAH_MAX);
const low = [...list].sort((a, b) => a.nah - b.nah)[0];
const plusHour = list.filter((x) => x.uur).map((x) => x.n);
const rows = (h: { a: (id: string, t: string) => string }, l: Lg) => [
  ...list.map((x) => [cityLink(h, x.s, x.n), eur(x.nah, l), x.uur ? (l === 'nl' ? '1 uur tarief ter plaatse' : '1 hour of the local rate') : (l === 'nl' ? 'niet betaalde belasting' : 'unpaid tax')]),
  ...[['amsterdam', 'Amsterdam'], ['den-haag', 'Den Haag'], ['delft', 'Delft']].map(([s, n]) => [cityLink(h, s, n), `max. ${eur(NAH_MAX, l)}`, l === 'nl' ? 'verordening niet gelezen' : 'by-law not read']),
];

export default definePage({
  id: 'naheffing', group: 'thema', order: 23, tool: 'naheffing', toolArg: { stad: 'rotterdam' },
  related: ['home', 'vergunning', 'rotterdam', 'gratis'],
  sources: ['vo_almere', 'vo_rotterdam', 'vo_utrecht', 'vo_eindhoven', 'vo_breda'],
  nl: {
    slug: 'naheffingsaanslag-parkeren',
    nav: 'Naheffingsaanslag per stad', card: `Wettelijk maximaal ${eur(NAH_MAX, 'nl')} kosten; Breda en Eindhoven rekenen minder`,
    title: 'Naheffingsaanslag parkeren 2026: de kosten per stad',
    description: `Naheffingsaanslag parkeren in 2026: kosten per stad volgens de verordeningen, van ${eur(low.nah, 'nl')} in ${low.n} tot het wettelijke maximum van ${eur(NAH_MAX, 'nl')}, plus wat er bij komt.`,
    h1: 'Naheffingsaanslag parkeren 2026: wat kost hij per stad?',
    intro: `Een naheffingsaanslag voor parkeren kost in ${num(atMax.length, 'nl')} van de ${num(list.length, 'nl')} steden die wij lazen het maximum van ${eur(NAH_MAX, 'nl')}. Kies stad en zone en zie het totaal.`,
    resume: `Wie parkeert zonder te betalen, of langer staat dan betaald, krijgt geen boete maar een naheffingsaanslag parkeerbelasting. Dat is een belastingaanslag: de parkeerbelasting die u had moeten betalen, plus kosten. De gemeente bepaalt die kosten in haar verordening, maar er is een wettelijk maximum. De verordening van Almere zegt het zo: wettelijk mag er maximaal ${eur(NAH_MAX, 'nl')} per naheffing in rekening worden gebracht. Wij lazen de verordening van ${num(list.length, 'nl')} steden. In ${num(atMax.length, 'nl')} daarvan zijn de kosten precies dat maximum. Het laagste bedrag vonden wij in ${low.n}: ${eur(low.nah, 'nl')}. In ${plusHour.join(', ')} komt er volgens de verordening één uur van het tarief ter plaatse bij; elders noemt de verordening de niet betaalde parkeerbelasting. Voor Amsterdam, Den Haag en Delft hebben wij de verordening niet gelezen, dus daar tonen wij alleen het maximum. Bezwaar maakt u binnen zes weken na de datum op de aanslag, bij de gemeente.`,
    faqs: [
      { q: 'Is een naheffingsaanslag een boete?', a: 'Nee, juridisch niet. Niet betalen voor parkeren is geen overtreding maar het niet voldoen van een gemeentelijke belasting. De gemeente heft die belasting daarom achteraf na, met kosten erbij. Een boete van de politie of een handhaver, bijvoorbeeld voor parkeren op een invalidenplaats, is iets anders en staat niet op deze pagina.' },
      { q: 'Hoeveel mag een naheffingsaanslag maximaal kosten?', a: `De kosten mogen in 2026 wettelijk niet hoger zijn dan ${eur(NAH_MAX, 'nl')}, zoals onder meer de verordening van Almere vermeldt. Daarbij komt de parkeerbelasting zelf. In ${num(atMax.length, 'nl')} van de ${num(list.length, 'nl')} steden die wij lazen, rekent de gemeente precies dat maximum aan kosten.` },
      { q: 'Hoe maak ik bezwaar tegen een naheffingsaanslag?', a: 'Binnen zes weken na de datum op de aanslag, schriftelijk of via het formulier van de gemeente. Voeg bewijs toe, zoals een parkeerbewijs uit de app, een foto van een onduidelijk bord of een geldige vergunning. Een bezwaar schort de betaling meestal niet op; betaal op tijd om aanmaningskosten te voorkomen.' },
      { q: 'Kan ik een naheffing krijgen als de parkeerapp niet werkte?', a: 'Ja, de gemeente controleert het kenteken en ziet alleen of er betaald is. Werkte de app of de automaat niet, maak dan direct een schermafbeelding of foto en probeer een andere manier van betalen. Met dat bewijs heeft een bezwaar meer kans. De gemeente beslist per geval.' },
    ],
    body: (h) => `<h2>Kosten van een naheffingsaanslag parkeren per stad</h2>
<p>Het bedrag aan kosten uit de verordening parkeerbelastingen van elke stad, en wat er volgens die verordening bij komt. Gesorteerd van hoog naar laag. De kosten gelden per aanslag; het bedrag staat op de aanslag die u thuis krijgt.</p>
${h.table(['Stad', 'Kosten', 'Daarbij komt'], rows(h, 'nl'), 'Kosten van een naheffingsaanslag parkeerbelasting per stad (verordeningen 2025 en 2026)', ['l', 'r', 'l'])}
<h2>Hoe hoog wordt het totaal?</h2>
<p>Tel de kosten en de niet betaalde belasting op. In Rotterdam, waar één uur tarief bij de kosten komt, betaalt u in de centrumzone ${h.eur(STEDEN.rotterdam.nah + rot.z.h)}: ${h.eur(STEDEN.rotterdam.nah)} kosten plus ${h.eur(rot.z.h)}. In Breda of Eindhoven blijft het totaal onder de ${h.eur(70)}. De rekenhulp bovenaan rekent het voor uw zone uit, met het uurtarief uit het Nationaal Parkeer Register. Komen er aanmaningskosten bij omdat u te laat betaalt, dan wordt het meer.</p>
<h2>Bronnen</h2>
<p>Het maximum staat onder meer in de ${h.src('vo_almere', 'verordening van Almere')}. De stadsbedragen komen uit elke verordening, zoals die van ${h.src('vo_rotterdam', 'Rotterdam')}, ${h.src('vo_utrecht', 'Utrecht')} en ${h.src('vo_eindhoven', 'Eindhoven')}. Voorkomen is goedkoper: zie ${h.a('gratis', 'wanneer parkeren gratis is')} en ${h.a('vergunning', 'de bewonersvergunning')}.</p>`,
  },
  en: {
    slug: 'parking-fine',
    nav: 'Parking penalty by city', card: `Legal maximum ${eur(NAH_MAX, 'en')} in costs; Breda and Eindhoven charge less`,
    title: 'Parking fine Netherlands 2026: penalty costs by city',
    description: `Parking fine in the Netherlands in 2026: penalty costs by city under each by-law, from ${eur(low.nah, 'en')} in ${low.n} to the legal maximum of ${eur(NAH_MAX, 'en')}, plus what comes on top.`,
    h1: 'Parking fine in the Netherlands 2026: costs by city',
    intro: `A parking fine (naheffingsaanslag) costs the maximum of ${eur(NAH_MAX, 'en')} in ${num(atMax.length, 'en')} of the ${num(list.length, 'en')} cities whose by-law we read. Pick city and zone and see the total.`,
    resume: `If you park without paying, or stay longer than you paid for, you do not get a fine in the legal sense but a parking tax penalty assessment (naheffingsaanslag). It is a tax assessment: the parking tax you should have paid, plus costs. The municipality sets those costs in its by-law, but there is a legal maximum. The Almere by-law puts it this way: by law, at most ${eur(NAH_MAX, 'en')} may be charged per penalty assessment. We read the by-law of ${num(list.length, 'en')} cities. In ${num(atMax.length, 'en')} of them the costs are exactly that maximum. The lowest amount we found was in ${low.n}: ${eur(low.nah, 'en')}. In ${plusHour.join(', ')} the by-law adds one hour of the local rate; elsewhere it names the unpaid parking tax. We have not read the by-laws of Amsterdam, The Hague and Delft, so there we only show the maximum. You can object within six weeks of the date on the assessment, with the municipality.`,
    faqs: [
      { q: 'Is a naheffingsaanslag a fine?', a: 'Not legally. Failing to pay for parking is not an offence but non-payment of a municipal tax. The municipality therefore levies the tax afterwards, with costs added. A fine from the police or an enforcement officer, for example for parking in a disabled bay, is something else and is not covered on this page.' },
      { q: 'What is the maximum for a parking penalty?', a: `In 2026 the costs may by law not exceed ${eur(NAH_MAX, 'en')}, as the Almere by-law among others states. The parking tax itself comes on top. In ${num(atMax.length, 'en')} of the ${num(list.length, 'en')} cities we read, the municipality charges exactly that maximum in costs.` },
      { q: 'How do I object to a parking penalty?', a: 'Within six weeks of the date on the assessment, in writing or through the municipality’s form. Add evidence, such as a parking receipt from the app, a photo of an unclear sign or a valid permit. An objection usually does not suspend payment; pay on time to avoid reminder costs.' },
      { q: 'Can I get a penalty if the parking app did not work?', a: 'Yes, the municipality checks the licence plate and only sees whether payment was made. If the app or the meter failed, take a screenshot or photo straight away and try another way to pay. With that evidence an objection stands a better chance. The municipality decides case by case.' },
    ],
    body: (h) => `<h2>Parking fine costs by city</h2>
<p>The amount of costs from each city’s parking tax by-law, and what that by-law adds on top. Sorted from high to low. The costs apply per assessment; the amount is on the assessment you receive at home.</p>
${h.table(['City', 'Costs', 'Plus'], rows(h, 'en'), 'Costs of a parking tax penalty assessment by city (2025 and 2026 by-laws)', ['l', 'r', 'l'])}
<h2>How high does the total get?</h2>
<p>Add the costs and the unpaid tax. In Rotterdam, where one hour of the rate is added to the costs, you pay ${h.eur(STEDEN.rotterdam.nah + rot.z.h)} in the central zone: ${h.eur(STEDEN.rotterdam.nah)} in costs plus ${h.eur(rot.z.h)}. In Breda or Eindhoven the total stays below ${h.eur(70)}. The calculator at the top works it out for your zone, using the hourly rate from the National Parking Register. If reminder costs are added because you pay late, it comes to more.</p>
<h2>Sources</h2>
<p>The maximum is stated in the ${h.src('vo_almere', 'Almere by-law')}, among others. City amounts come from each by-law, such as those of ${h.src('vo_rotterdam', 'Rotterdam')}, ${h.src('vo_utrecht', 'Utrecht')} and ${h.src('vo_eindhoven', 'Eindhoven')}. Prevention is cheaper: see ${h.a('gratis', 'when parking is free')} and ${h.a('vergunning', 'the resident permit')}.</p>`,
  },
});
