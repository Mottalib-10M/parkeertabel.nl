import { definePage } from '../../lib/page-types';
import { eur, num, K, cityLink, COVER, N_CITIES, facts, hhmm, dayName } from './_f';
import { DAGKAART_DEF } from '../../lib/tool-specs';

type Lg = 'nl' | 'en';
const isDay = K.isDayTicket;
// Testeurs 2026-11-14 (3e tour) : « dagkaart € 8,05 » (zone Tarief 8, € 1,29 per uur) à côté de « 8 uur centrum € 64,40 »
// (zone 1, € 8,05 per uur) : deux zones différentes sur une ligne. La dagkaart se compare maintenant à sa propre zone :
// toute la betaaltijd de ce jour payée à l'heure. Le moteur ne garde que les dagkaarten comprises entre une heure et
// cette journée (K.dayTicketOk) ; tests/coherence.test.ts le vérifie.
const all = COVER.map((s) => { const f = facts(s);
  const day = f.zs.flatMap((z) => z.p.filter((p) => isDay(p.l)).map((p) => {
    const d = K.dayTicketDay(f.c, z, p.a) ?? 2;
    return { z: K.zoneName(z.n), a: p.a, d, full: K.fullDayCost(f.c, z, d), h: K.dayHourly(f.c, z, d), spans: K.paidSpans(f.c, z, d) };
  })).sort((a, b) => a.a - b.a);
  return { s, n: f.c.n, zs: f.zs.length, tk: f.tickets, t: f.zs.filter((z) => z.p.some((p) => isDay(p.l))).length, day: day[0], c8: f.cost8h }; });
export const DAGKAART_ROWS = all;
const withDay = all.filter((x) => x.day);
const cheapest = [...withDay].sort((a, b) => a.day!.a - b.day!.a)[0];
const centreDay = COVER.filter((s) => { const b = facts(s).best; return b && isDay(b.l); }).length;
const none = all.filter((x) => x.tk === 0).map((x) => x.n);
const tot = all.reduce((m, x) => m + x.zs, 0), totT = all.reduce((m, x) => m + x.tk, 0);
// Le seuil vient du même calcul que la rekenhulp (même zone, même jour, même heure d'arrivée : DAGKAART_DEF).
// Avant le 2026-11-14 la page partait de 10:00 et la rekenhulp de 09:00 : « 6 uur en 45 minuten » contre « 7 u 45 ».
export const delftBreakEven = () => { const d = facts('delft'); return d.best ? K.breakEven(d.c, d.z, DAGKAART_DEF.dag, DAGKAART_DEF.aankomst, d.best.a) ?? 0 : 0; };
const d = facts('delft'), dBest = d.best?.a ?? 0, be = delftBreakEven();
const NC = (l: Lg) => num(N_CITIES, l);
const arrive = (l: Lg) => (l === 'nl' ? `bij aankomst op ${dayName(DAGKAART_DEF.dag, 'nl')} om ${hhmm(DAGKAART_DEF.aankomst)}` : `arriving on ${dayName(DAGKAART_DEF.dag, 'en')} at ${hhmm(DAGKAART_DEF.aankomst)}`);
const hours = (sp: Array<[number, number, number]>) => sp.map(([a, b]) => `${hhmm(a)}-${hhmm(b)}`).join(', ');
const rows = (h: { a: (id: string, t: string) => string }, l: Lg) => all.map((x) => [cityLink(h, x.s, x.n), `${num(x.t, l)} / ${num(x.zs, l)}`,
  x.day ? `${eur(x.day.a, l)} (${x.day.z}, ${dayName(x.day.d, l)} ${hours(x.day.spans)})` : (l === 'nl' ? 'geen' : 'none'),
  x.day ? `${eur(x.day.full, l)} (${eur(x.day.h, l)} ${l === 'nl' ? 'per uur' : 'an hour'})` : (l === 'nl' ? 'n.v.t.' : 'n/a')]);
const hm = (m: number, l: Lg) => { const hh = Math.floor(m / 60), mm = m % 60; return l === 'nl' ? `${hh} uur${mm ? ` en ${mm} minuten` : ''}` : `${hh} hours${mm ? ` and ${mm} minutes` : ''}`; };

export default definePage({
  id: 'dagkaart', group: 'thema', order: 22, tool: 'dagkaart', toolArg: { stad: 'delft' },
  related: ['home', 'delft', 'zwolle', 'pr'],
  sources: ['npr_tarief', 'npr_regeling', 'npr_tijdvak'],
  nl: {
    slug: 'dagkaart-parkeren',
    nav: 'Dagkaart of per uur?', card: `Dagkaarten in ${num(withDay.length, 'nl')} van ${NC('nl')} steden; vanaf welk uur loont het?`,
    title: 'Dagkaart parkeren 2026: wanneer goedkoper dan per uur?',
    description: `Dagkaart parkeren in 2026: welke van ${NC('nl')} steden een dagkaart of maximaal dagtarief hebben, wat die kost en vanaf hoeveel uur hij goedkoper is dan per uur.`,
    h1: 'Dagkaart parkeren 2026: vanaf welk uur loont hij?',
    intro: `Een dagkaart voor parkeren loont pas als u lang genoeg blijft. In Delft is het maximale dagtarief ${eur(dBest, 'nl')}: goedkoper dan per uur vanaf ${be ? hm(be, 'nl') : 'een lange dag'} parkeren, ${arrive('nl')}.`,
    resume: `Een dagkaart is een vast bedrag voor een hele dag in één zone. Sommige steden noemen het een maximaal dagtarief: u betaalt per uur, maar nooit meer dan dat bedrag. In het Nationaal Parkeer Register vonden wij voor ${num(withDay.length, 'nl')} van de ${NC('nl')} steden op deze site een dagkaart of dagmaximum op straat. In totaal hebben ${num(totT, 'nl')} van de ${num(tot, 'nl')} betaalde zones een vast ticket, maar dat is niet altijd een dagkaart: Amsterdam en Utrecht kennen ook avondkaarten, en Amsterdam zondagkaarten. In ${none.join(', ')} staat er in het register geen enkel vast ticket op straat. De goedkoopste dagkaarten liggen in zones buiten het centrum, zoals de terreinen in de schil van Zwolle of de wijken van Maastricht. Van de ${NC('nl')} centrumzones die de rekenhulp standaard kiest, heeft er maar ${num(centreDay, 'nl')} een dagkaart of dagmaximum. Dan blijft voor een lange dag vaak alleen de garage of de P+R over. De rekenhulp vergelijkt voor elke zone de dagkaart met per uur betalen en toont vanaf welk uur de kaart voordeliger is.`,
    faqs: [
      { q: 'Wat is het verschil tussen een dagkaart en een maximaal dagtarief?', a: 'Een dagkaart koopt u vooraf voor een vast bedrag. Bij een maximaal dagtarief betaalt u gewoon per uur, maar stopt de teller bij het maximum. Voor uw portemonnee komt het vaak op hetzelfde neer. In het register staan beide als vast ticket bij de zone, met de naam die de gemeente gebruikt.' },
      { q: 'Waar vind ik de goedkoopste dagkaart?', a: `Van de ${NC('nl')} steden op deze site is de goedkoopste dagkaart in het register ${eur(cheapest.day!.a, 'nl')}, in de zone ${cheapest.day!.z} in ${cheapest.n}. In de tabel staat per stad de goedkoopste dagkaart met de zone. Let op: de goedkoopste kaart ligt zelden in de straat waar u wilt zijn.` },
      { q: 'Geldt een dagkaart ook de volgende dag?', a: 'Nee. Een dagkaart geldt voor de dag en de zone die op de kaart of in de app staan, meestal tot het einde van de betaaltijd. Wie na middernacht blijft, of op een tijd waarop weer betaald moet worden, koopt een nieuwe kaart of betaalt per uur.' },
    ],
    body: (h) => `<h2>Dagkaart parkeren per stad</h2>
<p>Per stad het aantal zones met een dagkaart, de goedkoopste dagkaart of het laagste dagmaximum in het register, met zijn zone en betaaltijd, en ter vergelijking wat dezelfde zone kost als u die hele betaaltijd per uur betaalt. Een dagkaart geldt alleen in zijn eigen zone.</p>
${h.table(['Stad', 'Zones met een dagkaart', 'Goedkoopste dagkaart (zone, betaaltijd)', 'Zelfde zone, hele betaaltijd per uur'], rows(h, 'nl'), `Goedkoopste dagkaart per stad, ${NC('nl')} steden (Nationaal Parkeer Register)`, ['l', 'r', 'l', 'r'])}
<h2>Wanneer loont een dagkaart?</h2>
<p>Deel het bedrag van de dagkaart door het uurtarief: dat is ongeveer het aantal uren waarna de kaart goedkoper is. In Delft is dat ${be ? hm(be, 'nl') : 'een lange dag'}, ${arrive('nl')}. Een dagkaart die meer kost dan de hele betaaltijd per uur in dezelfde zone, levert nooit iets op: die tonen wij niet. Waar het tarief per uur oploopt, zoals in het centrum van Zwolle, loont een kaart al veel eerder. Gebruik de rekenhulp bovenaan voor de exacte grens in uw zone; hij houdt rekening met de betaaltijden. Komt u pas laat in de ochtend, dan zijn er minder betaalde uren over en loont de kaart minder snel.</p>
<h2>Andere opties voor een lange dag</h2>
<p>Geen dagkaart in uw zone? Kijk dan naar ${h.a('pr', 'P+R')} aan de rand van de stad, of kom na de betaaltijd: ${h.a('gratis', 'gratis parkeren per stad')}.</p>`,
  },
  en: {
    slug: 'day-ticket',
    nav: 'Day ticket or by the hour?', card: `Day tickets in ${num(withDay.length, 'en')} of ${NC('en')} cities; from which hour do they pay off?`,
    title: 'Parking day ticket 2026: when is it cheaper than hourly?',
    description: `Parking day ticket in the Netherlands in 2026: which of ${NC('en')} cities have a day ticket or maximum day rate, its price and after how many hours it beats hourly.`,
    h1: 'Parking day ticket 2026: from which hour does it pay off?',
    intro: `A parking day ticket only pays off if you stay long enough. In Delft the maximum day rate is ${eur(dBest, 'en')}: cheaper than hourly from ${be ? hm(be, 'en') : 'a long day'} of parking, ${arrive('en')}.`,
    resume: `A day ticket (dagkaart) is a fixed amount for a whole day in one zone. Some cities call it a maximum day rate: you pay by the hour, but never more than that amount. In the National Parking Register we found a street day ticket or day maximum for ${num(withDay.length, 'en')} of the ${NC('en')} cities on this site. In total ${num(totT, 'en')} of the ${num(tot, 'en')} paid zones have a fixed ticket, but that is not always a day ticket: Amsterdam and Utrecht also have evening tickets, and Amsterdam Sunday tickets. In ${none.join(', ')} the register lists no fixed street ticket at all. The cheapest day tickets are in zones outside the centre, such as the car parks in Zwolle’s outer ring or Maastricht’s districts. Of the ${NC('en')} central zones the calculator picks by default, only ${num(centreDay, 'en')} has a day ticket or day maximum. For a long day that often leaves only a garage or park and ride. The calculator compares the day ticket with paying by the hour for each zone and shows from which hour the ticket is cheaper.`,
    faqs: [
      { q: 'What is the difference between a day ticket and a maximum day rate?', a: 'A day ticket is bought up front for a fixed amount. With a maximum day rate you simply pay by the hour, but the meter stops at the maximum. For your wallet it often comes to the same. In the register both are listed as a fixed ticket for the zone, under the name the municipality uses.' },
      { q: 'Where is the cheapest day ticket?', a: `Of the ${NC('en')} cities on this site, the cheapest day ticket in the register is ${eur(cheapest.day!.a, 'en')}, in the zone ${cheapest.day!.z} in ${cheapest.n}. The table gives the cheapest day ticket per city with its zone. Note that the cheapest ticket is rarely in the street where you want to be.` },
      { q: 'Is a day ticket valid the next day too?', a: 'No. A day ticket is valid for the day and the zone shown on the ticket or in the app, usually until the end of the paid hours. If you stay past midnight, or into a new paid period, you buy a new ticket or pay by the hour.' },
    ],
    body: (h) => `<h2>Parking day ticket by city</h2>
<p>For each city, the number of zones with a day ticket, the cheapest day ticket or lowest day maximum in the register, with its zone and paid hours, and for comparison what the same zone costs if you pay those whole paid hours by the hour. A day ticket is valid only in its own zone.</p>
${h.table(['City', 'Zones with a day ticket', 'Cheapest day ticket (zone, paid hours)', 'Same zone, all paid hours by the hour'], rows(h, 'en'), `Cheapest day ticket by city, ${NC('en')} cities (National Parking Register)`, ['l', 'r', 'l', 'r'])}
<h2>When does a day ticket pay off?</h2>
<p>Divide the day ticket by the hourly rate: that is roughly the number of hours after which the ticket is cheaper. In Delft that is ${be ? hm(be, 'en') : 'a long day'}, ${arrive('en')}. A day ticket that costs more than paying the whole paid period by the hour in the same zone never saves anything, so we do not show it. Where the hourly rate rises, as in central Zwolle, a ticket pays off much sooner. Use the calculator at the top for the exact point in your zone; it takes the paid hours into account. If you arrive late in the morning, fewer paid hours remain and the ticket pays off less quickly.</p>
<h2>Other options for a long day</h2>
<p>No day ticket in your zone? Look at ${h.a('pr', 'park and ride')} on the edge of the city, or arrive after the paid hours: ${h.a('gratis', 'free parking by city')}.</p>`,
  },
});
