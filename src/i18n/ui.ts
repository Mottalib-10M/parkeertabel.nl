import type { Locale } from './routes';
import type { LibellesTrame } from '../lib/libelles-trame';
const nl = {
  updatedOn: 'Bijgewerkt op', editorialPolicy: 'Redactiebeleid', contactLabel: 'Contact', reviewedBy: 'Samengesteld door',
  skipToContent: 'Naar de inhoud', mainNav: 'Hoofdmenu', breadcrumbLabel: 'Kruimelpad', breadcrumbHome: 'Home', menuOpen: 'Menu openen',
  faqTitle: 'Veelgestelde vragen', relatedCalculators: 'Verder kijken', sourcesTitle: 'Bronnen van deze pagina', writtenBy: 'Samengesteld door',
  asOf: 'Stand', lastUpdated: 'bijgewerkt op', footerValidated: 'Tarieven uit het Nationaal Parkeer Register (RDW, open data CC0) en de parkeerbelastingverordeningen van de gemeenten',
  footerBrowser: 'De rekenhulpen draaien in uw browser · wat u invult wordt nergens heen gestuurd · geen account, geen app',
  footerDisclaimer: 'Parkeertabel is een onafhankelijke site van Radif Partners: geen gemeente, geen parkeerbedrijf en geen betaalapp. De bedragen zijn een indicatie op basis van het Nationaal Parkeer Register; de parkeerautomaat of de app ter plaatse bepaalt wat u betaalt. Geen juridisch advies.',
  footerPopular: 'Veel bezocht',
  notFound: 'Op dit adres staat geen pagina. Op de homepage rekent u uit wat parkeren kost in uw straat: zone, tijden en uurtarief.',
  readMore: 'Verder lezen',
  trama: { plusDeReglages: 'Waar we van uitgingen (open het en pas aan wat niet klopt)' } as Partial<LibellesTrame>,
  privacyLine: 'Wij vragen geen naam, kenteken of e-mailadres: de berekening gebeurt in uw browser en er wordt niets verstuurd. Een adres dat u intypt gaat alleen naar de adreszoeker van het Kadaster (PDOK) om de coördinaten op te halen.',
  copyLink: 'Link kopiëren', copied: 'Link gekopieerd', print: 'Afdrukken', howComputed: 'Hoe dit is berekend', openFull: 'Volledige rekenhulp openen',
  independent: 'Onafhankelijke site: geen gemeente en geen parkeerapp',
};
const en: typeof nl = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Prepared by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Where next', sourcesTitle: 'Sources for this page', writtenBy: 'Prepared by',
  asOf: 'As of', lastUpdated: 'updated on', footerValidated: 'Rates from the National Parking Register (RDW, CC0 open data) and the municipal parking tax by-laws',
  footerBrowser: 'The calculators run in your browser · nothing you type is sent anywhere · no account, no app',
  footerDisclaimer: 'Parkeertabel is an independent site by Radif Partners: not a municipality, a parking operator or a payment app. Amounts are an estimate based on the National Parking Register; the meter or app at the kerb decides what you pay. Not legal advice.',
  footerPopular: 'Most visited',
  notFound: 'Nothing lives at this address. The home page works out what parking costs in your street: zone, paid hours and hourly rate.',
  readMore: 'Read more',
  trama: { plusDeReglages: 'What we assumed (open it and change anything that is not your case)' } as Partial<LibellesTrame>,
  privacyLine: 'We ask for no name, number plate or email: the calculation runs in your browser and nothing is sent. An address you type goes only to the Dutch Cadastre address search (PDOK) to fetch its coordinates.',
  copyLink: 'Copy share link', copied: 'Link copied', print: 'Print', howComputed: 'How this is calculated', openFull: 'Open the full calculator',
  independent: 'Independent site: not a municipality and not a parking app',
};
const ALL = { nl, en };
export function t(lang: Locale) { return ALL[lang] ?? nl; }
