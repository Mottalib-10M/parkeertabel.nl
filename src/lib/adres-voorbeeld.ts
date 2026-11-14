/**
 * Adresse d'exemple de la recherche par adresse. Testeurs naïfs du 2026-11-14 (3e tour) : l'exemple « Oudegracht 1
 * Utrecht » tombait dans une ville sans carte dans le registre (la Méthode le dit), donc la première action proposée
 * échouait. L'exemple est une adresse d'Amsterdam que la Locatieserver de PDOK situe dans une zone payante ;
 * tests/adres-voorbeeld.test.ts vérifie le point (coordonnées relevées chez PDOK le 2026-11-14) et, s'il y a du
 * réseau, la réponse de PDOK elle-même.
 */
import { CITY_INDEX } from './engine/parking';

export const VOORBEELD = { adres: 'Damrak 1 Amsterdam', stad: 'amsterdam', punt: [4.89803846, 52.37714446] as [number, number] };
/** Villes dont le registre n'a aucune carte de zones : la recherche par adresse n'y trouve pas la zone. */
export const ZONDER_KAART = CITY_INDEX.cities.filter((c) => c.geo === 0).map((c) => c.name);
