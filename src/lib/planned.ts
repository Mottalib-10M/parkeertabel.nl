/** Pages prévues : un lien vers l'une d'elles ne casse pas le test tant qu'elle n'existe pas. */
/** Les 16 villes dont la requête « parkeren [stad] » a été mesurée au Keyword Planner le 2026-11-02. */
export const CITY_PAGES = ['amsterdam', 'utrecht', 'rotterdam', 'den-haag', 'groningen', 'eindhoven', 'leiden', 'den-bosch', 'haarlem', 'maastricht', 'nijmegen', 'arnhem', 'breda', 'delft', 'zwolle', 'amersfoort'];
export const PLANNED_THEMES = ['vergunning', 'gratis', 'dagkaart', 'naheffing', 'pr'];
export const PLANNED_IDS = new Set<string>([...CITY_PAGES, ...PLANNED_THEMES]);
