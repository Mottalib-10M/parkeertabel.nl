/** Accueil, néerlandais et anglais. Chiffres : registre NPR et params-2026.json via _f, jamais tapés à la main. */
import type { FAQ } from '../lib/page-types';
import { facts, eur, num, day, READ, NAH_MAX, K, P } from './pages/_f';
import { N_CITIES, N_ZONES } from '../lib/couverture';

type L = 'nl' | 'en';
interface HomeLang {
  title: string; description: string; h1: string; intro: string; resume: string; homeCard: string;
  stepsTitle: string; steps: Array<{ id: string; q: string; a: string }>;
  citiesTitle: string; citiesNote: string; guidesTitle: string; faqs: FAQ[];
}
const ams = facts('amsterdam'), utr = facts('utrecht'), rot = facts('rotterdam');
const nCities = N_CITIES, nZones = N_ZONES;
const cheapest = [...K.CITY_INDEX.cities].filter((c) => c.hMax > 0).sort((a, b) => a.hMax - b.hMax)[0];

const nl: HomeLang = {
  title: 'Parkeren 2026: tarief, zone en tijden per stad berekend',
  description: `Wat kost parkeren in 2026 in uw straat? Zone, betaaltijden en uurtarief uit het Nationaal Parkeer Register voor ${num(nCities, 'nl')} steden, met dagkaart, vergunning en boete.`,
  h1: 'Parkeren in 2026: wat kost het in uw zone?',
  homeCard: 'Kies stad, zone, dag en tijd: de parkeerkosten en wanneer het gratis wordt',
  intro: 'Wat kost parkeren bij u in de straat? Kies uw stad en zone, de dag, het uur van aankomst en hoe lang u blijft: het bedrag verschijnt direct onder de vragen.',
  resume: `Parkeren kost in Nederland per gemeente en per zone iets anders, en de tijden verschillen per dag. Alle betaalde zones staan in het Nationaal Parkeer Register (NPR) van de RDW, de dienst die ook de kentekens beheert. Deze site rekent met dat register, stand van ${day(READ, 'nl')}: ${num(nCities, 'nl')} steden en ${num(nZones, 'nl')} betaalde straatzones. Het duurste uur kost ${eur(ams.info.hMax, 'nl')} in het centrum van Amsterdam en ${eur(utr.info.hMax, 'nl')} in de binnenstad van Utrecht. In Rotterdam is het hoogste uurtarief ${eur(rot.info.hMax, 'nl')}. Twee uur op een dinsdagochtend in de duurste zone van Amsterdam komt zo op ${eur(ams.cost2h, 'nl')}. In ${cheapest.name} is het duurste uur maar ${eur(cheapest.hMax, 'nl')}. Buiten de betaaltijden parkeert u gratis, vaak ’s avonds en op zondagochtend. Wie niet of te kort betaalt, krijgt een naheffingsaanslag: de kosten daarvan zijn wettelijk begrensd op ${eur(NAH_MAX, 'nl')} in 2026.`,
  stepsTitle: 'Parkeren: drie vragen die het bedrag bepalen',
  steps: [
    { id: 'amsterdam', q: '1. In welke zone staat de auto?', a: 'Elke gemeente deelt de stad op in zones met een eigen tarief. Het zonenummer staat op de automaat en in de parkeerapp.' },
    { id: 'gratis', q: '2. Valt de tijd binnen de betaaltijden?', a: 'Buiten de betaaltijden is parkeren gratis. Die tijden verschillen per dag: zondag begint vaak later.' },
    { id: 'dagkaart', q: '3. Is een dagkaart goedkoper?', a: 'Wie lang blijft, is soms goedkoper uit met een dagkaart of met een P+R aan de rand van de stad.' },
  ],
  citiesTitle: 'Uurtarief per stad',
  citiesNote: 'Laagste en hoogste uurtarief op straat in het register. Klik op een stad voor de zones en tijden.',
  guidesTitle: 'Steden en onderwerpen',
  faqs: [
    { q: 'Is deze site van de gemeente of van een parkeerapp?', a: 'Nee. Parkeertabel is een onafhankelijke site van Radif Partners. Wij verkopen geen parkeerrechten en hebben geen afspraken met parkeerapps of garages. Wij lezen het openbare Nationaal Parkeer Register van de RDW en rekenen ermee. Betalen doet u bij de automaat of in een app; wat daar staat, geldt.' },
    { q: 'Hoe actueel zijn de tarieven op deze site?', a: `De gegevens zijn de stand van het register op ${day(READ, 'nl')}. Gemeenten passen hun tarieven meestal op 1 januari aan en soms midden in het jaar. Het register wordt elke maandag automatisch opnieuw gelezen; de bedragen uit de verordeningen (vergunning en naheffing) werken wij met de hand bij. Verschilt het bedrag van wat de automaat zegt, dan geldt de automaat. Meld het verschil gerust via de contactpagina.` },
    { q: 'Waarom zegt de app een iets ander bedrag?', a: 'Parkeerapps rekenen per minuut en vragen vaak transactiekosten of een abonnement. Die kosten staan niet in het register en tellen hier niet mee. Sommige gemeenten ronden ook af per blok van een paar minuten. Het verschil is meestal enkele tientallen centen per keer parkeren.' },
    { q: 'Wat gebeurt er als ik vergeet te betalen?', a: `Dan krijgt u een naheffingsaanslag. Die bestaat uit de parkeerbelasting die u niet betaalde en kosten. De kosten mogen in 2026 wettelijk niet hoger zijn dan ${eur(NAH_MAX, 'nl')}; elke gemeente zet het bedrag in haar verordening. Op de pagina over de parkeerboete staat het bedrag per stad.` },
    { q: 'Hoe vind ik mijn zone als ik de naam niet weet?', a: 'Typ het adres in de adreszoeker boven de rekenhulp. De site zoekt de coördinaten op bij PDOK, de adresdienst van het Kadaster, en kijkt op de kaart van het register in welke zone dat punt ligt. Niet elke gemeente levert een kaart aan; dan kiest u de zone in de lijst.' },
    { q: 'Wordt wat ik invul ergens naartoe gestuurd?', a: 'Nee. De tarieven zitten in de pagina zelf en de berekening gebeurt in uw browser. Er is geen account en geen formulier. Alleen een adres dat u in de adreszoeker typt, gaat naar de adresdienst van PDOK om de coördinaten op te halen. Een gedeelde link bevat alleen de gekozen stad, zone en tijden.' },
    { open: true, q: 'Wanneer is parkeren gratis?', a: 'Buiten de betaaltijden van uw zone. In veel steden betaalt u tot ’s avonds laat, maar op zondag pas vanaf de middag of helemaal niet. De tabel onder het bedrag toont de tijden voor elke dag van de week. Let op borden ter plaatse: vergunninghoudersplaatsen en blauwe zones staan niet in het register.' },
  ],
};

const en: HomeLang = {
  title: 'Parking in the Netherlands 2026: rates, zones and hours',
  description: `What does parking cost in your Dutch street in 2026? Zone, paid hours and hourly rate from the National Parking Register for ${num(nCities, 'en')} cities, day tickets and fines.`,
  h1: 'Parking in the Netherlands in 2026: what does it cost in your zone?',
  homeCard: 'Pick city, zone, day and time: the parking cost and when parking turns free',
  intro: 'What does parking in the Netherlands cost in your street? Pick your city and zone, the day, your arrival time and how long you stay: the amount appears right below the questions.',
  resume: `Parking in the Netherlands is priced by each municipality, zone by zone, and the paid hours change with the day of the week. Every paid zone is listed in the National Parking Register (NPR), run by the RDW, the Dutch vehicle authority. This site calculates with that register as it stood on ${day(READ, 'en')}: ${num(nCities, 'en')} cities and ${num(nZones, 'en')} paid street zones. The most expensive hour costs ${eur(ams.info.hMax, 'en')} in central Amsterdam and ${eur(utr.info.hMax, 'en')} in Utrecht's old town; Rotterdam tops out at ${eur(rot.info.hMax, 'en')}. Two hours on a Tuesday morning in Amsterdam's dearest zone therefore come to ${eur(ams.cost2h, 'en')}, while the top hourly rate in ${cheapest.name} is only ${eur(cheapest.hMax, 'en')}. Outside the paid hours, parking is free, often in the evening and on Sunday mornings. Drivers who do not pay, or pay too little, receive a parking penalty assessment (naheffingsaanslag), whose costs are capped by law at ${eur(NAH_MAX, 'en')} in 2026.`,
  stepsTitle: 'Parking in the Netherlands: three questions that set the amount',
  steps: [
    { id: 'amsterdam', q: '1. Which zone is the car in?', a: 'Each municipality divides the city into zones with their own rate. The zone number is on the meter and in the parking app.' },
    { id: 'gratis', q: '2. Is it within the paid hours?', a: 'Outside the paid hours parking is free. Those hours differ by day: Sunday often starts later.' },
    { id: 'dagkaart', q: '3. Is a day ticket cheaper?', a: 'For a long stay, a day ticket or a park-and-ride site on the edge of town is sometimes cheaper.' },
  ],
  citiesTitle: 'Hourly rate by city',
  citiesNote: 'Lowest and highest street hourly rate in the register. Click a city for its zones and hours.',
  guidesTitle: 'Cities and topics',
  faqs: [
    { q: 'Is this site run by a municipality or a parking app?', a: 'No. Parkeertabel is an independent site published by Radif Partners. We sell no parking rights and have no deals with parking apps or garages. We read the public National Parking Register kept by the RDW and calculate with it. You pay at the meter or in an app, and what they show is what applies.' },
    { q: 'How current are the rates on this site?', a: `The figures are the register as it stood on ${day(READ, 'en')}. Municipalities usually change their rates on 1 January and sometimes mid-year. The register is read again automatically every Monday; the by-law amounts (permits and penalties) are updated by hand. If the amount differs from what the meter says, the meter wins. Please report the difference through the contact page so we can check it.` },
    { q: 'Why does my parking app show a slightly different amount?', a: 'Parking apps charge by the minute and often add a transaction fee or a subscription. Those fees are not in the register and are not included here. Some municipalities also round up to blocks of a few minutes. The gap is usually a few tens of cents per parking session.' },
    { q: 'What happens if I forget to pay?', a: `You receive a parking penalty assessment, called a naheffingsaanslag. It is made up of the parking tax you did not pay plus costs. By law the costs cannot exceed ${eur(NAH_MAX, 'en')} in 2026, and each municipality sets its own amount in its by-law. The parking penalty page lists the amount for each city.` },
    { q: 'How do I find my zone if I do not know its name?', a: 'Type the address into the address search above the calculator. The site looks up the coordinates with PDOK, the address service of the Dutch Cadastre, and checks on the register map which zone contains that point. Not every municipality supplies a map; where it does not, you pick the zone from the list.' },
    { q: 'Is anything I type sent anywhere?', a: 'No. The rates are inside the page itself and the calculation runs in your browser. There is no account and no form. Only an address typed into the address search goes to the PDOK address service to fetch its coordinates. A shared link holds nothing but the chosen city, zone and times.' },
    { open: true, q: 'When is parking free?', a: 'Outside the paid hours of your zone. Many cities charge until late in the evening, but on Sunday only from the afternoon, or not at all. The table under the amount shows the hours for each day of the week. Watch the signs on the spot: permit-holder bays and blue zones are not in the register.' },
  ],
};

export const HOME = { nl, en, sources: ['npr_tarief', 'npr_tijdvak', 'npr_gebied', 'npr_geo', 'pdok', 'vo_almere', 'vo_utrecht', 'vo_rotterdam'], P };
