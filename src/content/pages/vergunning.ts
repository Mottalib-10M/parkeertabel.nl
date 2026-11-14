import { definePage } from '../../lib/page-types';
import { eur, num, STEDEN, K, cityLink, yearOf, facts } from './_f';
import { nietGelezenText } from '../../lib/tool-specs';

type Lg = 'nl' | 'en';
const list = Object.entries(STEDEN).map(([s, x]) => ({ s, n: K.city(s).n, v: x.verg, y: yearOf(x.verg) }));
const yearly = list.filter((x) => x.v.per !== 'eenmalig' && x.v.bedrag > 0).sort((a, b) => b.y - a.y);
const top = yearly[0], low = yearly[yearly.length - 1];
const per = (p: string, l: Lg) => ({ jaar: l === 'nl' ? 'per jaar' : 'a year', maand: l === 'nl' ? 'per maand' : 'a month', kwartaal: l === 'nl' ? 'per kwartaal' : 'a quarter', eenmalig: l === 'nl' ? 'eenmalig' : 'one-off' }[p] ?? p);
// Une seule colonne de montant : le montant par an, et celui de la verordening seulement s'il est par mois ou par trimestre
// (testeurs 2026-11-14 : « Bedrag € 390,52 per jaar / Per jaar € 390,52 »).
const amount = (x: (typeof list)[number], l: Lg) => (x.v.per === 'eenmalig' ? `${eur(x.v.bedrag, l)} ${per('eenmalig', l)}` : x.v.per === 'jaar' ? `${eur(x.y, l)} ${per('jaar', l)}` : `${eur(x.y, l)} ${per('jaar', l)} (${eur(x.v.bedrag, l)} ${per(x.v.per, l)})`);
const rows = (h: { a: (id: string, t: string) => string }, l: Lg) => [...list].sort((a, b) => b.y - a.y).map((x) => [cityLink(h, x.s, x.n), amount(x, l)]);
const ut = list.find((x) => x.s === 'utrecht')!;
const days = Math.round(top.y / facts(top.s).cost8h);

export default definePage({
  id: 'vergunning', group: 'thema', order: 20, tool: 'vergunning', toolArg: { stad: 'utrecht' },
  related: ['home', 'naheffing', 'utrecht', 'groningen'],
  sources: ['vo_utrecht', 'vo_groningen', 'vo_rotterdam', 'vo_breda', 'vo_nijmegen'],
  nl: {
    slug: 'bewonersvergunning',
    nav: 'Bewonersvergunning per stad', card: `Van ${eur(0, 'nl')} in Breda tot ${eur(top.y, 'nl')} per jaar in ${top.n}`,
    title: `Bewonersvergunning parkeren 2026: kosten in ${num(list.length, 'nl')} steden`,
    description: `Bewonersvergunning parkeren in 2026: wat de eerste vergunning kost in ${num(list.length, 'nl')} steden volgens de verordeningen, van gratis in Breda tot ${eur(top.y, 'nl')} per jaar in ${top.n}.`,
    h1: 'Bewonersvergunning parkeren 2026: wat kost het per stad?',
    intro: `Een bewonersvergunning voor parkeren kost in Breda niets en in ${top.n} ${eur(top.y, 'nl')} per jaar. Kies uw stad en het aantal jaren: de rekenhulp toont het totaal.`,
    resume: `Wie in een gebied met betaald parkeren woont, kan bij de gemeente een bewonersvergunning aanvragen. Daarmee parkeert u in uw eigen wijk zonder per uur te betalen. Het bedrag staat in de verordening parkeerbelastingen van elke gemeente. Wij lazen die verordening voor ${num(list.length, 'nl')} steden en zetten de eerste vergunning op een rij. De verschillen zijn groot. In ${top.n} kost de eerste vergunning ${eur(ut.v.bedrag, 'nl')} per maand, ${eur(top.y, 'nl')} per jaar. In Breda kost de eerste vergunning in het Stadshart en de singels niets, en in Amersfoort betaalt u eenmalig ${eur(30, 'nl')}. Van de steden met een jaarbedrag is ${low.n} het goedkoopst. Let op: een tweede vergunning is bijna overal duurder, soms veel. En een bedrag zegt niets over de wachtlijst: in veel wijken krijgt u niet direct een vergunning. ${nietGelezenText('nl')}`,
    faqs: [
      { q: 'Waar is een bewonersvergunning het duurst?', a: `Van de ${num(list.length, 'nl')} steden die wij lazen, in ${top.n}: ${eur(ut.v.bedrag, 'nl')} per maand, dus ${eur(top.y, 'nl')} per jaar voor de eerste vergunning. Daarna volgen Groningen en ’s-Hertogenbosch met bijna ${eur(400, 'nl')} per jaar. Amsterdam staat nog niet in de vergelijking: dat bedrag hebben wij nog niet gecontroleerd. U vindt het op de site van de gemeente.` },
      { q: 'Is een bewonersvergunning ergens gratis?', a: `Ja. In Breda noemt de verordening voor de eerste vergunning in het Stadshart en binnen en buiten de singels een bedrag van ${eur(0, 'nl')}; een tweede kost ${eur(8, 'nl')} per maand. In Amersfoort is de eerste vergunning een eenmalig bedrag van ${eur(30, 'nl')}. Elders betaalt u elk jaar opnieuw.` },
      { q: 'Wanneer is een vergunning goedkoper dan per uur betalen?', a: `Bijna altijd voor wie er woont. In de rekenhulp ziet u hoeveel werkdagen van acht uur straatparkeren u voor hetzelfde geld zou kunnen betalen. In ${top.n} is dat, tegen het tarief van het centrum, ongeveer ${num(days, 'nl')} werkdagen per jaar. Wie elke dag in de wijk parkeert, haalt de vergunning er dus ruim uit.` },
      { q: 'Wat is het verschil tussen een bewonersvergunning en een bezoekersvergunning?', a: 'De bewonersvergunning hoort bij uw kenteken en uw adres en geldt de hele dag in uw wijk. Een bezoekersregeling is voor gasten: zij parkeren tegen een verlaagd uurtarief, dat u als bewoner via een app aanmeldt. De bedragen van bezoekersregelingen staan niet op deze pagina.' },
    ],
    body: (h) => `<h2>Bewonersvergunning parkeren per stad</h2>
<p>De eerste vergunning op een adres, zoals de verordening parkeerbelastingen van elke gemeente die noemt. Steden met een maandbedrag zijn omgerekend naar een jaar. Gesorteerd van duur naar goedkoop.</p>
${h.table(['Stad', 'Eerste vergunning'], rows(h, 'nl'), 'Eerste bewonersvergunning per stad (verordeningen parkeerbelastingen 2025 en 2026)', ['l', 'r'])}
<p>${nietGelezenText('nl')}</p>
<h2>Waarom de bedragen zo verschillen</h2>
<p>Elke gemeente bepaalt het tarief zelf. Sommige steden rekenen een vast bedrag voor de hele stad, andere per zone: in Groningen, Eindhoven en Zwolle is het centrum duurder dan de wijken eromheen. Kijk daarom bij uw eigen stad naar de zone van uw adres. De bedragen in de tabel zijn de eerste vergunning in de duurste of belangrijkste zone. Ook de periode verschilt: Utrecht en Maastricht rekenen per maand, Leiden per kwartaal of jaar, de meeste andere steden per jaar. Een vergunning is ook altijd gebonden aan één kenteken, en verhuist niet mee als u een andere auto rijdt zonder dat te melden.</p>
<h2>Bronnen</h2>
<p>Elk bedrag komt uit de verordening van de gemeente, onder meer de ${h.src('vo_utrecht', 'verordening van Utrecht')}, ${h.src('vo_groningen', 'Groningen')} en ${h.src('vo_breda', 'Breda')}. Wie zonder vergunning parkeert en niet betaalt, krijgt een ${h.a('naheffing', 'naheffingsaanslag')}.</p>`,
  },
  en: {
    slug: 'resident-parking-permit',
    nav: 'Resident permits by city', card: `From ${eur(0, 'en')} in Breda to ${eur(top.y, 'en')} a year in ${top.n}`,
    title: `Resident parking permit 2026: what it costs in ${num(list.length, 'en')} cities`,
    description: `Resident parking permit in the Netherlands in 2026: the first permit in ${num(list.length, 'en')} cities under their by-laws, from free in Breda to ${eur(top.y, 'en')} a year in ${top.n}.`,
    h1: 'Resident parking permit 2026: what does it cost by city?',
    intro: `A resident parking permit costs nothing in Breda and ${eur(top.y, 'en')} a year in ${top.n}. Pick your city and the number of years: the calculator shows the total.`,
    resume: `If you live in an area with paid parking, you can apply to the municipality for a resident permit (bewonersvergunning). With it you park in your own district without paying by the hour. The amount is set in each municipality’s parking tax by-law. We read that by-law for ${num(list.length, 'en')} cities and lined up the first permit. The differences are large. In ${top.n} the first permit costs ${eur(ut.v.bedrag, 'en')} a month, ${eur(top.y, 'en')} a year. In Breda the first permit in the Stadshart and the canal ring costs nothing, and in Amersfoort you pay a one-off ${eur(30, 'en')}. Of the cities with a yearly amount, ${low.n} is the cheapest. Note that a second permit is dearer almost everywhere, sometimes much dearer. And an amount says nothing about waiting lists: in many districts you do not get a permit straight away. ${nietGelezenText('en')}`,
    faqs: [
      { q: 'Where is a resident permit most expensive?', a: `Of the ${num(list.length, 'en')} cities we read, in ${top.n}: ${eur(ut.v.bedrag, 'en')} a month, so ${eur(top.y, 'en')} a year for the first permit. Groningen and ’s-Hertogenbosch follow at close to ${eur(400, 'en')} a year. Amsterdam is not in the comparison yet: we have not checked that amount yet. You will find it on the municipality's website.` },
      { q: 'Is a resident permit free anywhere?', a: `Yes. In Breda the by-law sets ${eur(0, 'en')} for the first permit in the Stadshart and inside and outside the canal ring; a second costs ${eur(8, 'en')} a month. In Amersfoort the first permit is a one-off ${eur(30, 'en')}. Elsewhere you pay again every year.` },
      { q: 'When is a permit cheaper than paying by the hour?', a: `Almost always for residents. The calculator shows how many eight-hour workdays of street parking the same money would buy. In ${top.n}, at the centre rate, that is about ${num(days, 'en')} workdays a year. If you park in your district every day, the permit pays for itself many times over.` },
      { q: 'What is the difference between a resident and a visitor permit?', a: 'The resident permit is tied to your licence plate and your address and is valid all day in your district. A visitor scheme is for guests: they park at a reduced hourly rate that you register as a resident through an app. Visitor scheme amounts are not on this page.' },
    ],
    body: (h) => `<h2>Resident parking permit by city</h2>
<p>The first permit at an address, as each municipality’s parking tax by-law sets it. Monthly amounts are converted to a year. Sorted from dearest to cheapest.</p>
${h.table(['City', 'First permit'], rows(h, 'en'), 'First resident permit by city (2025 and 2026 parking tax by-laws)', ['l', 'r'])}
<p>${nietGelezenText('en')}</p>
<h2>Why the amounts differ so much</h2>
<p>Each municipality sets its own rate. Some cities charge one amount for the whole city, others by zone: in Groningen, Eindhoven and Zwolle the centre is dearer than the districts around it. So look at the zone of your address in your own city. The amounts in the table are the first permit in the dearest or main zone. The period differs too: Utrecht and Maastricht charge by the month, Leiden by the quarter or year, most other cities by the year. A permit is also always tied to one licence plate and does not follow you to another car unless you report the change.</p>
<h2>Sources</h2>
<p>Each amount comes from the municipality’s by-law, including the ${h.src('vo_utrecht', 'Utrecht by-law')}, ${h.src('vo_groningen', 'Groningen')} and ${h.src('vo_breda', 'Breda')}. If you park without a permit and do not pay, you get a ${h.a('naheffing', 'parking penalty')}.</p>`,
  },
});
