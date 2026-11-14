import { definePage } from '../../lib/page-types';
import { foldTable, num, K, cityLink, COVER, N_CITIES } from './_f';

type Lg = 'nl' | 'en';
const all = COVER.map((s) => { const c = K.city(s), zs = K.streetZones(c);
  return { s, n: c.n, zs: zs.length, sun: zs.filter((x) => K.paidSpans(c, x, 7).length === 0).length, eve: zs.filter((x) => !K.winAt(c, x, 2, 20 * 60)).length }; });
const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) : 0);
const bySun = [...all].sort((a, b) => pct(b.sun, b.zs) - pct(a.sun, a.zs));
const tot = all.reduce((m, x) => m + x.zs, 0), totSun = all.reduce((m, x) => m + x.sun, 0), totEve = all.reduce((m, x) => m + x.eve, 0);
const noSun = all.filter((x) => x.sun === 0).map((x) => x.n);
const allEve = all.filter((x) => x.eve === x.zs).map((x) => x.n);
const NC = (l: Lg) => num(N_CITIES, l);
const rows = (h: { a: (id: string, t: string) => string }, l: Lg) => bySun.map((x) => [cityLink(h, x.s, x.n), num(x.zs, l), `${num(x.sun, l)} (${num(pct(x.sun, x.zs), l)} %)`, `${num(x.eve, l)} (${num(pct(x.eve, x.zs), l)} %)`]);

export default definePage({
  id: 'gratis', group: 'thema', order: 21, tool: 'gratis', toolArg: { stad: 'utrecht' },
  related: ['home', 'maastricht', 'amsterdam', 'dagkaart'],
  sources: ['npr_tijdvak', 'npr_regeling', 'npr_gebied'],
  nl: {
    slug: 'gratis-parkeren',
    nav: 'Gratis parkeren per stad', card: `Zondag gratis in ${num(totSun, 'nl')} van ${num(tot, 'nl')} zones in ${NC('nl')} steden`,
    title: `Gratis parkeren 2026: zondag en avond in ${NC('nl')} steden`,
    description: `Gratis parkeren in 2026: in welke zones van ${NC('nl')} steden u op zondag of ’s avonds niets betaalt, volgens de betaaltijden in het Nationaal Parkeer Register.`,
    h1: 'Gratis parkeren 2026: wanneer betaalt u niets?',
    intro: `Gratis parkeren kan op zondag in ${num(totSun, 'nl')} van de ${num(tot, 'nl')} betaalde zones in ${NC('nl')} steden. Kies stad, zone, dag en tijd: de rekenhulp zegt wanneer het gratis wordt.`,
    resume: `Betaald parkeren geldt bijna nooit de hele week. Elke zone heeft betaaltijden, en daarbuiten parkeert u op straat gratis, tenzij een bord iets anders zegt. Wij telden in het Nationaal Parkeer Register voor ${NC('nl')} steden hoeveel betaalde straatzones op zondag helemaal gratis zijn, en hoeveel op een dinsdagavond om acht uur. Op zondag is het in ${num(totSun, 'nl')} van de ${num(tot, 'nl')} zones gratis, ${num(pct(totSun, tot), 'nl')} procent. Op dinsdag om 20:00 zijn het er ${num(totEve, 'nl')}. De verschillen per stad zijn groot. In ${bySun[0].n} is zondag in bijna alle zones gratis, in ${noSun.join(' en ')} in geen enkele. In ${allEve.join(' en ')} is ’s avonds om acht uur elke zone gratis. Let op: een zone die op zondag gratis is, kan op een koopzondag of bij een evenement toch betaald zijn. Blauwe zones, waar u gratis maar met een parkeerschijf staat, zitten niet in het register en dus niet in deze telling.`,
    faqs: [
      { q: 'Is parkeren op zondag gratis in Nederland?', a: `Niet overal. Van de ${num(tot, 'nl')} betaalde straatzones in de ${NC('nl')} steden op deze site zijn er op zondag ${num(totSun, 'nl')} helemaal gratis. In de grote steden betaalt u op zondag vaak vanaf het middaguur. Kies uw stad en zone in de rekenhulp en zet de dag op zondag om het voor uw plek te zien.` },
      { q: 'Vanaf hoe laat is parkeren ’s avonds gratis?', a: `Dat verschilt per stad en per zone. In Maastricht stopt het betalen om 18:00, in Leiden om 21:00, in Amsterdam, Delft en Amersfoort pas om middernacht en in Breda om één uur ’s nachts. De rekenhulp toont voor elke zone de betaaltijden per dag en het moment waarop het gratis wordt.` },
      { q: 'Wat is een blauwe zone?', a: 'In een blauwe zone parkeert u gratis, maar maximaal een beperkte tijd. U legt een parkeerschijf met uw aankomsttijd achter de voorruit. Blauwe zones staan niet in het Nationaal Parkeer Register als betaalde zone, dus de rekenhulp kent ze niet. De borden ter plaatse noemen de maximale duur.' },
    ],
    body: (h) => `<h2>Gratis parkeren op zondag en ’s avonds per stad</h2>
<p>Per stad het aantal betaalde straatzones in het register, hoeveel daarvan op zondag de hele dag gratis zijn, en hoeveel op een dinsdag om 20:00. Gesorteerd op het aandeel gratis zondagen. P+R-terreinen en garages tellen niet mee. Een hoog aandeel betekent niet dat het centrum gratis is: vaak betaalt u juist daar wel.</p>
${foldTable(bySun.length, 'nl', h.table(['Stad', 'Zones', 'Zondag gratis', 'Dinsdag 20:00 gratis'], rows(h, 'nl'), `Gratis zones op zondag en dinsdagavond (Nationaal Parkeer Register, ${NC('nl')} steden)`, ['l', 'r', 'r', 'r']))}
<h2>Hoe wij tellen</h2>
<p>Een zone telt als gratis op zondag als het register voor die dag geen enkel betaald tijdvak noemt. Voor de avond kijken wij of er op dinsdag om 20:00 een betaald tijdvak loopt. Feestdagen, koopzondagen en evenementen kunnen anders zijn; het register noemt die soms apart, en dan geldt het bord. Ook garages en P+R-terreinen hebben eigen tijden; die tellen hier niet mee.</p>
<h2>Liever niet zoeken?</h2>
<p>Voor een lange dag is een ${h.a('dagkaart', 'dagkaart')} of een ${h.a('pr', 'P+R-terrein')} vaak goedkoper dan wachten tot het gratis wordt. Wie toch op een betaald moment staat zonder te betalen, riskeert een ${h.a('naheffing', 'naheffingsaanslag')}.</p>`,
  },
  en: {
    slug: 'free-parking',
    nav: 'Free parking by city', card: `Free on Sunday in ${num(totSun, 'en')} of ${num(tot, 'en')} zones in ${NC('en')} cities`,
    title: 'Free parking in the Netherlands 2026: Sundays and evenings',
    description: `Free parking in the Netherlands in 2026: which zones in ${NC('en')} Dutch cities are free on Sunday or in the evening, from the paid hours in the national register.`,
    h1: 'Free parking in the Netherlands 2026: when do you pay nothing?',
    intro: `Free parking is possible on Sunday in ${num(totSun, 'en')} of the ${num(tot, 'en')} paid zones in ${NC('en')} cities. Pick city, zone, day and time: the calculator tells you when it turns free.`,
    resume: `Paid parking almost never applies all week. Every zone has paid hours, and outside them street parking is free unless a sign says otherwise. In the National Parking Register we counted, for ${NC('en')} cities, how many paid street zones are entirely free on Sunday, and how many on a Tuesday evening at eight. On Sunday ${num(totSun, 'en')} of the ${num(tot, 'en')} zones are free, ${num(pct(totSun, tot), 'en')} percent. On Tuesday at 20:00 the figure is ${num(totEve, 'en')}. The differences between cities are large. In ${bySun[0].n} Sunday is free in nearly every zone, in ${noSun.join(' and ')} in none. In ${allEve.join(' and ')} every zone is free at eight in the evening. Note that a zone that is free on Sunday can still be paid on a shopping Sunday or during an event. Blue zones, where you park free with a parking disc, are not in the register and therefore not in this count.`,
    faqs: [
      { q: 'Is parking free on Sunday in the Netherlands?', a: `Not everywhere. Of the ${num(tot, 'en')} paid street zones in the ${NC('en')} cities on this site, ${num(totSun, 'en')} are entirely free on Sunday. In the big cities you often pay from noon on Sunday. Pick your city and zone in the calculator and set the day to Sunday to see it for your spot.` },
      { q: 'From what time is parking free in the evening?', a: 'It depends on the city and the zone. In Maastricht paying stops at 18:00, in Leiden at 21:00, in Amsterdam, Delft and Amersfoort only at midnight, and in Breda at one in the morning. The calculator shows the paid hours by day for each zone and the moment it turns free.' },
      { q: 'What is a blue zone?', a: 'In a blue zone you park for free, but only for a limited time. You place a parking disc showing your arrival time behind the windscreen. Blue zones are not listed as paid zones in the National Parking Register, so the calculator does not know them. Signs on the spot give the maximum stay.' },
    ],
    body: (h) => `<h2>Free parking on Sunday and in the evening by city</h2>
<p>For each city, the number of paid street zones in the register, how many are free all day on Sunday, and how many on a Tuesday at 20:00. Sorted by the share of free Sundays. Park-and-ride sites and garages are not counted. A high share does not mean the centre is free: that is often exactly where you do pay.</p>
${foldTable(bySun.length, 'en', h.table(['City', 'Zones', 'Free on Sunday', 'Free Tuesday 20:00'], rows(h, 'en'), `Free zones on Sunday and Tuesday evening (National Parking Register, ${NC('en')} cities)`, ['l', 'r', 'r', 'r']))}
<h2>How we count</h2>
<p>A zone counts as free on Sunday if the register lists no paid time slot for that day. For the evening we check whether a paid slot runs on Tuesday at 20:00. Public holidays, shopping Sundays and events can differ; the register sometimes lists them separately, and then the sign applies. Garages and park-and-ride sites have their own hours too; they are not counted here.</p>
<h2>Rather not wait?</h2>
<p>For a long day, a ${h.a('dagkaart', 'day ticket')} or a ${h.a('pr', 'park-and-ride site')} is often cheaper than waiting until it turns free. If you stand at a paid time without paying, you risk a ${h.a('naheffing', 'parking penalty')}.</p>`,
  },
});
