/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://parkeertabel.nl";
export const SITE_NAMES: Record<string, string> = {"nl": "Parkeertabel", "en": "Parkeertabel"};
// Partie du nom affichée en couleur dans l'en-tête (RECETTE §10.3), « » pour aucune.
export const BRAND_ACCENT = "tabel";
export const LANG_TAGS: Record<string, string> = {"nl": "nl-NL", "en": "en-NL"};
export const OG_LOCALES: Record<string, string> = {"nl": "nl_NL", "en": "en_GB"};
export const LOCALE_TAG = 'nl-NL';
/** Locale de formatage des nombres par langue de page : « 8,01 € » en néerlandais, « €8.01 » en anglais (RECETTE §4). */
export const NUM_TAGS: Record<string, string> = {"nl": "nl-NL", "en": "en-GB"};
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-11-13';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"nl": "Onafhankelijke uitgever van parkeerrekenhulpen op basis van het Nationaal Parkeer Register (open data RDW)", "en": "Independent publisher of parking-cost calculators built on the Dutch National Parking Register (RDW open data)"};
export const AUTHOR_DESC: Record<string, string> = {"nl": "Radif Partners leest de open parkeerdata van het Nationaal Parkeer Register (NPR), die de RDW onder CC0 publiceert, en rekent er per gemeente en per zone mee uit wat een uur, een dag of een avond parkeren kost en op welke dagen en tijden u betaalt. Vergunningtarieven en de kosten van een naheffingsaanslag komen uit de parkeerbelastingverordening van elke gemeente. Wij zijn geen gemeente, geen parkeerbedrijf en geen betaalapp; wij verkopen niets en vragen geen gegevens.", "en": "Radif Partners reads the open data of the Dutch National Parking Register (NPR), published by the RDW under CC0, and works out per municipality and per zone what an hour, a day or an evening of parking costs and on which days and hours you pay. Permit prices and the cost of a parking penalty (naheffingsaanslag) come from each municipality's parking tax by-law. We are not a municipality, a parking operator or a payment app; we sell nothing and ask for no personal data."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"nl": ["Parkeertarieven per gemeente en per zone (Nationaal Parkeer Register)", "Tijden van betaald parkeren per dag van de week", "Dagkaarten, avondkaarten en P+R-tarieven", "Kosten van bewonersvergunningen per gemeente", "Naheffingsaanslag parkeerbelasting"], "en": ["Parking rates by Dutch municipality and zone (National Parking Register)", "Paid-parking hours by day of the week", "Day tickets, evening tickets and park-and-ride rates", "Resident parking permit costs by municipality", "Parking penalty (naheffingsaanslag) amounts"]};
export const CONTACT_EMAIL = "contact@parkeertabel.nl";
export const THEME_COLOR = '#1D4F91';
export const LOGO_SYMBOL = 'P';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = 'G-GF2BC237JS';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'zdgdg17mjy';
export const INDEXNOW_KEY = '713f7aa6ccd4584792b6084ae13a03ec';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : comme les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "Frankrijk / France",
  phone: '',
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "btw / VAT",
  vatNumber: '',
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city']; // legalForm vide à dessein, comme les 32 sites en ligne du portefeuille

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
