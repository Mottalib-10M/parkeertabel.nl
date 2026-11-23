#!/usr/bin/env python3
"""Écrit src/data/params-2026.json : sources (RDW, PDOK, CVDR) et montants des verordeningen parkeerbelastingen.
Chaque montant a été lu dans le XML officiel du CVDR (data-raw/cvdr/<ville>.xml, téléchargé le 2026-11-13) ;
`q` liste les extraits exacts que tests/params.test.ts retrouve mot pour mot dans ce XML. Relance à la main."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
idx = json.load(open(os.path.join(ROOT, 'data-raw/cvdr/index.json')))
def cv(name): a, v = idx[name]['id'].split('_'); return f'https://lokaleregelgeving.overheid.nl/{a}/{v}'
DS = [('npr_gebied', 'adw6-9hsg', 'GEBIED', 'areas'), ('npr_regeling', 'yefi-qfiq', 'REGELING', 'regulations'), ('npr_tijdvak', 'ixf8-gtwq', 'TIJDVAK', 'time frames'),
      ('npr_tarief', '534e-5vdg', 'TARIEFDEEL', 'fare parts'), ('npr_geo', 'nsk3-v9n7', 'GEOMETRIE-GEBIED', 'area geometry')]
src = {}
for k, i, n, en in DS:
    src[k] = {'url': f'https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-{n}/{i}', 'label': {'nl': f'RDW, Open Data Parkeren: {n.replace("-", " ")} (Nationaal Parkeer Register, CC0)', 'en': f'RDW, Open Data Parkeren: {n.replace("-", " ")} ({en}, National Parking Register, CC0)'}}
src['pdok'] = {'url': 'https://www.pdok.nl/introductie/-/article/pdok-locatieserver-1', 'label': {'nl': 'PDOK Locatieserver (Kadaster): adres naar coördinaten', 'en': 'PDOK Locatieserver (Dutch Cadastre): address to coordinates'}}
CITY = {'utrecht': 'Utrecht', 'rotterdam': 'Rotterdam', 'groningen': 'Groningen', 'eindhoven': 'Eindhoven', 'leiden': 'Leiden', 'den-bosch': 's-Hertogenbosch', 'haarlem': 'Haarlem',
        'maastricht': 'Maastricht', 'nijmegen': 'Nijmegen', 'arnhem': 'Arnhem', 'breda': 'Breda', 'zwolle': 'Zwolle', 'amersfoort': 'Amersfoort', 'almere': 'Almere'}
for slug, name in CITY.items():
    t = idx[name]['title']; nm = '’s-Hertogenbosch' if name == 's-Hertogenbosch' else name
    src[f'vo_{slug}'] = {'url': cv(name), 'label': {'nl': f'Gemeente {nm}: {t}', 'en': f'Municipality of {nm}: {t} (parking tax by-law)'}}
STEDEN = {
 'utrecht': {'file': 'Utrecht', 'nah': 77.70, 'uur': False, 'q': ['€ 77,70', '€ 54,78', '€ 164,34'],
   'verg': {'bedrag': 54.78, 'per': 'maand', 'nl': 'Eerste bewonersvergunning zone A1: € 54,78 per maand (€ 164,34 per kwartaal)', 'en': 'First resident permit, zone A1: €54.78 a month (€164.34 a quarter)'}},
 'rotterdam': {'file': 'Rotterdam', 'nah': 82.00, 'uur': True, 'q': ['€ 82,00 te verhogen met één uur', 'eerste vergunning voor bewoners 114,00 9,50', 'elke volgende vergunning voor bewoners 308,40'],
   'verg': {'bedrag': 114.00, 'per': 'jaar', 'nl': 'Eerste vergunning voor bewoners bij een parkeerautomaat: € 114,00 per jaar (€ 9,50 per maand); elke volgende € 308,40', 'en': 'First resident permit at metered spaces: €114.00 a year (€9.50 a month); each further permit €308.40'}},
 'groningen': {'file': 'Groningen', 'nah': 82.00, 'uur': False, 'q': ['bedragen € 82,00', '(Bewonersvergunning eerste zone): € 394,20', '(Bewonersvergunning tweede zone): € 135,05'],
   'verg': {'bedrag': 394.20, 'per': 'jaar', 'nl': 'Bewonersvergunning eerste zone (Binnenstad): € 394,20 per jaar; tweede zone € 135,05', 'en': 'Resident permit, first zone (city centre): €394.20 a year; second zone €135.05'}},
 'eindhoven': {'file': 'Eindhoven', 'nah': 57.60, 'uur': False, 'q': ['bedragen € 57,60', 'Eerste bewonersparkeervergunning in het centrum € 19,10 € 229,20', 'Eerste bewonersparkeervergunning in de schilwijk en buiten de Ring € 11,79 € 141,48'],
   'verg': {'bedrag': 229.20, 'per': 'jaar', 'nl': 'Eerste bewonersvergunning centrum: € 19,10 per maand (€ 229,20 per jaar); schilwijk en buiten de Ring € 11,79 per maand', 'en': 'First resident permit, centre: €19.10 a month (€229.20 a year); inner suburbs and outside the ring road €11.79 a month'}},
 'leiden': {'file': 'Leiden', 'nah': 70.00, 'uur': False, 'q': ['vastgesteld op € 70,00', '1 e bewonersparkeervergunning kwartaal € 54,00 1 e bewonersparkeervergunning Jaar € 61,00'],
   'verg': {'bedrag': 61.00, 'per': 'jaar', 'nl': 'Eerste bewonersvergunning: € 54,00 per kwartaal of € 61,00 per jaar, afhankelijk van de zone (verordening 2025, de laatst gepubliceerde)', 'en': 'First resident permit: €54.00 a quarter or €61.00 a year depending on the zone (2025 by-law, the latest published)'}},
 'den-bosch': {'file': 's-Hertogenbosch', 'nah': 82.00, 'uur': True, 'q': ['bedragen € 82,00 te verhogen met één uur', '€ 390,52 per jaar € 97,63 per kwartaal voor een bewonersvergunning'],
   'verg': {'bedrag': 390.52, 'per': 'jaar', 'nl': 'Bewonersvergunning (24 uur geldig): € 390,52 per jaar (€ 97,63 per kwartaal)', 'en': 'Resident permit (valid 24 hours): €390.52 a year (€97.63 a quarter)'}},
 'haarlem': {'file': 'Haarlem', 'nah': 82.00, 'uur': False, 'q': ['bedragen € 82.', 'zone B of zone S per kalenderjaar € 233,28', 'eerste vergunning / eerste auto per kalenderjaar € 128,88'],
   'verg': {'bedrag': 233.28, 'per': 'jaar', 'nl': 'Bewonersvergunning zone B of S: € 233,28 per jaar; zone C, eerste auto € 128,88', 'en': 'Resident permit, zone B or S: €233.28 a year; zone C, first car €128.88'}},
 'maastricht': {'file': 'Maastricht', 'nah': 82.00, 'uur': True, 'q': ['bedragen € 82,00 Deze worden verhoogd met het ter plaatse geldende tarief van het 1 e uur', '-1 e vergunning € 30,08 Maand', '-1 e vergunning € 5,03 Maand'],
   'verg': {'bedrag': 30.08, 'per': 'maand', 'nl': 'Eerste vergunning Binnenstad: € 30,08 per maand; Overig Gebied € 5,03 per maand', 'en': 'First permit, city centre: €30.08 a month; rest of the city €5.03 a month'}},
 'nijmegen': {'file': 'Nijmegen', 'nah': 82.00, 'uur': False, 'q': ['onderdeel b, bedragen € 82,00', 'Eerste Bewonersvergunning € 48,00 per jaar € 12,00 per jaar'],
   'verg': {'bedrag': 48.00, 'per': 'jaar', 'nl': 'Eerste bewonersvergunning: € 48,00 of € 12,00 per jaar, afhankelijk van het gebied; de tweede € 240,00', 'en': 'First resident permit: €48.00 or €12.00 a year depending on the area; the second €240.00'}},
 'arnhem': {'file': 'Arnhem', 'nah': 78.80, 'uur': False, 'q': ['onderdeel a bedragen: 78,80', 'Bewonersvergunning, per jaar: 149,00'],
   'verg': {'bedrag': 149.00, 'per': 'jaar', 'nl': 'Bewonersvergunning: € 149,00 per jaar (€ 88,00 per half jaar)', 'en': 'Resident permit: €149.00 a year (€88.00 for six months)'}},
 'breda': {'file': 'Breda', 'nah': 57.40, 'uur': False, 'q': ['bedragen € 57,40', '“Buiten Singels” per maand € 0,00', '“Buiten Singels” per maand € 8,00'],
   'verg': {'bedrag': 0.00, 'per': 'maand', 'nl': 'Eerste bewonersvergunning Stadshart, Binnen en Buiten Singels: € 0,00; de tweede € 8,00 per maand', 'en': 'First resident permit in Stadshart and the inner and outer canals: €0.00; the second €8.00 a month'}},
 'zwolle': {'file': 'Zwolle', 'nah': 82.00, 'uur': False, 'q': ['onderdeel a, bedragen € 82,00', 'zone I (parkeersector 1), per jaar: € 225,00', 'zone IV (parkeersectoren 18 t/m 21), per jaar: € 50,00'],
   'verg': {'bedrag': 225.00, 'per': 'jaar', 'nl': 'Eerste bewonersvergunning zone I: € 225,00 per jaar; zone II en III € 70,00; zone IV € 50,00', 'en': 'First resident permit, zone I: €225.00 a year; zones II and III €70.00; zone IV €50.00'}},
 'amersfoort': {'file': 'Amersfoort', 'nah': 78.80, 'uur': False, 'q': ['onder a bedragen € 78,80', 'Eerste bewonersvergunning vergunningzones A t/m D en X t/m Z € 30,-', 'Tweede bewonersvergunning vergunningzones B, X, Y1 en Y2 € 300,- per jaar'],
   'verg': {'bedrag': 30.00, 'per': 'eenmalig', 'nl': 'Eerste bewonersvergunning (zones A t/m D en X t/m Z): € 30,-; de tweede € 150,- of € 300,- per jaar', 'en': 'First resident permit (zones A to D and X to Z): €30; the second €150 or €300 a year'}},
}
# 2027 (campagne du 2026-11-22) : maximum national fixé par la Staatscourant, et les verordeningen 2027 déjà publiées au CVDR
# (data-raw/cvdr/2027/<ville>.xml, téléchargés le 2026-11-22). Les autres villes n'avaient pas publié la leur ce jour-là.
src['stcrt_2026_26024'] = {'url': 'https://zoek.officielebekendmakingen.nl/stcrt-2026-26024.html', 'label': {
    'nl': 'Staatscourant 2026, 26024: Regeling van de minister van BZK van 29 juni 2026, maximum kosten naheffingsaanslag 2027',
    'en': 'Staatscourant 2026, 26024: order of the Interior Minister of 29 June 2026, maximum penalty costs for 2027'}}
V2027 = {'Utrecht': ('CVDR769624_1', 'Verordening parkeerbelastingen gemeente Utrecht 2027'),
         'Groningen': ('CVDR769944_1', 'Verordening op de heffing en invordering van parkeerbelastingen Groningen 2027')}
for name, (cid, t) in V2027.items():
    a_, v_ = cid.split('_')
    src[f'vo27_{name.lower()}'] = {'url': f'https://lokaleregelgeving.overheid.nl/{a_}/{v_}', 'label': {'nl': f'Gemeente {name}: {t}', 'en': f'Municipality of {name}: {t} (parking tax by-law)'}}
JAAR2027 = {
 'read': '2026-11-22',
 'naheffingMax': {'bedrag': 84.30, 'van': 82.00, 'ingang': '2027-01-01', 'src': 'stcrt_2026_26024'},
 'steden': {
  'utrecht': {'file': '2027/Utrecht', 'src': 'vo27_utrecht', 'nah': 78.41, 'q': ['bedragen, ter zake van de belasting bedoeld in artikel 2, eerste lid, onderdeel a: € 78,41', 'Per maand: € 56,75 b. Per kwartaal: € 170,25', 'Zone A1: € 8,30'],
    'verg': {'bedrag': 56.75, 'per': 'maand', 'nl': 'Eerste bewonersvergunning zone A1: € 56,75 per maand (€ 170,25 per kwartaal)', 'en': 'First resident permit, zone A1: €56.75 a month (€170.25 a quarter)'},
    'uur': {'zone': 'A1', 'oud': 8.01, 'nieuw': 8.30}},
  'groningen': {'file': '2027/Groningen', 'src': 'vo27_groningen', 'nah': 84.30, 'q': ['bedragen € 84,30', '(Bewonersvergunning eerste zone): € 408,80', '(Bewonersvergunning tweede zone): € 138,70'],
    'verg': {'bedrag': 408.80, 'per': 'jaar', 'nl': 'Bewonersvergunning eerste zone (Binnenstad): € 408,80 per jaar; tweede zone € 138,70', 'en': 'Resident permit, first zone (city centre): €408.80 a year; second zone €138.70'}},
 }}
P = {'_lisezmoi': 'Paramètres du site, écrits par scripts/build-params.py. Tarifs de rue : src/data/npr/*.json (scripts/build-npr.py, Nationaal Parkeer Register). Vergunningen et naheffing : lus dans la verordening parkeerbelastingen de chaque gemeente (CVDR, data-raw/cvdr/*.xml) le 2026-11-13 ; tests/params.test.ts retrouve chaque montant mot pour mot dans le XML.',
     'year': 2026, 'retrieved_at': '2026-11-13', 'npr_read': '2026-11-12', 'valid_from': '2026-01-01', 'valid_to': '2026-12-31',
     'naheffingMax': {'bedrag': 82.00, 'q': 'Wettelijk mag er maximaal € 82,00 per naheffing in rekening gebracht worden', 'file': 'Almere', 'src': 'vo_almere'},
     'steden': STEDEN, 'jaar2027': JAAR2027, 'sources': src}
json.dump(P, open(os.path.join(ROOT, 'src/data/params-2026.json'), 'w'), ensure_ascii=False, indent=1)
print('params-2026.json :', len(STEDEN), 'villes,', len(src), 'sources')
