#!/usr/bin/env python3
"""Construit les données du site à partir d'Open Data Parkeren (Nationaal Parkeer Register, RDW, CC0).

Usage : python3 scripts/build-npr.py            # lit data-raw/npr/*.csv (téléchargés s'ils manquent)
Sorties : src/data/npr/index.json (villes), src/data/npr/<slug>.json (zones, regelingen, tijdvakken,
tarieven, speciale dagen), public/data/geo/<slug>.json (polygones WGS84 des zones, chargés à la demande).
Jeux (opendata.rdw.nl, licence « Creative Commons 0 (CC0) » dans les métadonnées de chaque jeu) :
GEBIED adw6-9hsg · GEBIED REGELING qtex-qwd8 · REGELING yefi-qfiq · TIJDVAK ixf8-gtwq · TARIEFDEEL 534e-5vdg ·
TARIEFBEREKENING nfzq-8g7y · GEBIEDSBEHEERDER 2uc2-nnv3 · GEBRUIKSDOEL qidm-7mkf · SPECIALE DAG hpi4-mynq ·
GEOMETRIE GEBIED nsk3-v9n7. Rien n'est inventé : une zone sans tarif courant n'est pas écrite.
Relance à la main (aucune automatisation ne tourne) ; la date de lecture est celle des fichiers (READ).
"""
import csv, json, os, re, sys, urllib.request, datetime, collections, math
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'data-raw', 'npr'); OUT = os.path.join(ROOT, 'src', 'data', 'npr'); GEO = os.path.join(ROOT, 'public', 'data', 'geo')
for d in (RAW, OUT, GEO): os.makedirs(d, exist_ok=True)
SETS = {'gebied': 'adw6-9hsg', 'gebied_regeling': 'qtex-qwd8', 'regeling': 'yefi-qfiq', 'tijdvak': 'ixf8-gtwq', 'tariefdeel': '534e-5vdg',
        'tariefberekening': 'nfzq-8g7y', 'beheerder': '2uc2-nnv3', 'gebruiksdoel': 'qidm-7mkf', 'speciale_dag': 'hpi4-mynq', 'geometrie': 'nsk3-v9n7'}
READ = os.environ.get('NPR_READ', '2026-11-12')   # date de la dernière mise à jour des jeux au moment du téléchargement
TODAY = os.environ.get('NPR_TODAY', datetime.date.today().strftime('%Y%m%d'))
# Les 24 villes du site (gestionnaire NPR) : les 16 mesurées au Keyword Planner le 2026-11-02 + 8 grandes villes raccordées.
CITIES = [
    ('amsterdam', 'Amsterdam', '363'), ('utrecht', 'Utrecht', '344'), ('rotterdam', 'Rotterdam', '599'), ('den-haag', 'Den Haag', '518'),
    ('groningen', 'Groningen', '14'), ('eindhoven', 'Eindhoven', '772'), ('leiden', 'Leiden', '546'), ('den-bosch', "'s-Hertogenbosch", '796'),
    ('haarlem', 'Haarlem', '392'), ('maastricht', 'Maastricht', '935'), ('nijmegen', 'Nijmegen', '268'), ('arnhem', 'Arnhem', '202'),
    ('breda', 'Breda', '758'), ('delft', 'Delft', '503'), ('zwolle', 'Zwolle', '193'), ('amersfoort', 'Amersfoort', '307'),
    ('tilburg', 'Tilburg', '855'), ('almere', 'Almere', '34'), ('enschede', 'Enschede', '153'), ('apeldoorn', 'Apeldoorn', '200'),
    ('dordrecht', 'Dordrecht', '505'), ('alkmaar', 'Alkmaar', '361'), ('zaanstad', 'Zaanstad', '479'), ('amstelveen', 'Amstelveen', '362'),
]
USAGES = {'BETAALDP': 'straat', 'PARKRIDE': 'pr', 'GARAGEP': 'garage'}
DAYS = {'MAANDAG': 1, 'DINSDAG': 2, 'WOENSDAG': 3, 'DONDERDAG': 4, 'VRIJDAG': 5, 'ZATERDAG': 6, 'ZONDAG': 7, 'FEESTDAG': 'F'}

def load(name):
    p = os.path.join(RAW, f'{SETS[name]}.csv')
    if not os.path.exists(p):
        url = f'https://opendata.rdw.nl/api/views/{SETS[name]}/rows.csv?accessType=DOWNLOAD'
        print('télécharge', url); urllib.request.urlretrieve(url, p)
    with open(p, encoding='utf-8') as f: return list(csv.DictReader(f))

def clean(t):
    """Caractère illisible du CSV (« Chass\ufffdveld ») : é après Alleb/Chass (Allebéplein, Chasséveld), sinon e."""
    return re.sub(r'(?<=Alleb)\ufffd|(?<=Chass)\ufffd', 'é', t or '').replace('\ufffd', 'e')
def cur(s, e): return (s or '0')[:8] <= TODAY < (e or '29991231')[:8]
def hm(x):
    x = int(x or 0); return (x // 100) * 60 + x % 100

mgr = {r['AreaManagerId']: r['AreaManagerDesc'] for r in load('beheerder') if cur(r['StartDateAreaManagerId'], r['EndDateAreaManagerId'])}
areas = {(r['AreaManagerId'], r['AreaId']): r['AreaDesc'] for r in load('gebied') if cur(r['StartDateArea'], r['EndDateArea'])}
ar = collections.defaultdict(list)
for r in load('gebied_regeling'):
    if cur(r['StartDateAreaRegulation'], r['EndDateAreaRegulation']) and r['UsageId'] in USAGES: ar[r['AreaManagerId']].append(r)
reg = {(r['AreaManagerId'], r['RegulationId']): r for r in load('regeling') if cur(r['StartDateRegulation'], r['EndDateRegulation'])}
tv = collections.defaultdict(list)
for r in load('tijdvak'):
    if cur(r['StartDateTimeFrame'], r['EndDateTimeFrame']): tv[(r['AreaManagerId'], r['RegulationId'])].append(r)
fp = collections.defaultdict(list)
for r in load('tariefdeel'):
    if cur(r['StartDateFarePart'], r['EndDateFarePart']): fp[(r['AreaManagerId'], r['FareCalculationCode'])].append(r)
fc = {(r['AreaManagerId'], r['FareCalculationCode']): r for r in load('tariefberekening') if cur(r['StartDateFare'], r['EndDateFare'])}
special = collections.defaultdict(list)
for r in load('speciale_dag'):
    if r['DateSpecialDay'] >= TODAY[:4] + '0101': special[r['AreaManagerId']].append({'d': r['DateSpecialDay'], 'n': r['NameSpecialDay'].strip()})
geom = collections.defaultdict(dict)
for r in load('geometrie'):
    if cur(r['StartDateArea'], r['EndDateArea']): geom[r['AreaManagerId']][r['AreaId']] = (r.get('GeoDataAsText') or r.get('AreaGeometryAsText') or '')

def parts_of(m, code):
    out = []
    for p in sorted(fp.get((m, code), []), key=lambda p: int(p['StartDurationFarePart'])):
        out.append({'a': int(p['StartDurationFarePart']), 'b': int(p['EndDurationFarePart']), 'amt': round(float(p['AmountFarePart']), 6), 'step': max(1, int(p['StepSizeFarePart'] or 1))})
    return out
def cost(parts, minutes):
    t = 0.0
    for p in parts:
        if minutes <= p['a']: continue
        span = min(minutes, p['b']) - p['a']
        if span > 0: t += math.ceil(span / p['step']) * p['amt']
    return round(t, 2)

TICKET = re.compile(r'dag(kaart|tarief)|avondkaart|zondagkaart|evenementen|weekkaart', re.I)
def is_fixed(desc, parts):
    """Ticket à prix fixe (dagkaart, avondkaart…) : tous les pas payants d'au moins 4 h, ou libellé explicite."""
    paid = [p for p in parts if p['amt'] > 0]
    return bool(paid) and (all(p['step'] >= 240 for p in paid) or bool(TICKET.search(desc)))
def is_regular(desc, parts):
    """Tarif horaire ordinaire : pas payants d'une heure au plus, au plus trois tranches (exclut le progressief
    tarief de Den Haag et le « schriktarief » d'Amstelveen, 16 € par bloc de 4 h)."""
    paid = [p for p in parts if p['amt'] > 0]
    return bool(paid) and len(parts) <= 3 and all(p['step'] <= 60 for p in paid) and not TICKET.search(desc)

def wkt(text):
    """MULTIPOLYGON/POLYGON WKT → listes d'anneaux [[lon, lat], …] arrondis à 5 décimales (≈ 1 m)."""
    rings = []
    for m in re.finditer(r'\(\(([^()]+)\)', text):   # chaque polygone : premier anneau (extérieur) suffit
        pts = [[round(float(a), 5), round(float(b), 5)] for a, b in (x.strip().split()[:2] for x in m.group(1).split(','))]
        if len(pts) >= 4: rings.append(pts)
    return rings

index = []
for slug, name, m in CITIES:
    regs, fares, zones = {}, {}, []
    for r in sorted(ar.get(m, []), key=lambda r: (r['AreaId'], r['RegulationId'])):
        k = (m, r['RegulationId']); rg = reg.get(k)
        if not rg or not tv.get(k): continue
        frames = []; codes = set()
        for f in tv[k]:
            d = DAYS.get(f['DayTimeFrame'].strip())
            frames.append({'d': d if d else 'X:' + f['DayTimeFrame'].strip(), 's': hm(f['StartTimeTimeFrame']), 'e': hm(f['EndTimeTimeFrame']), 'f': f['FareCalculationCode'], 'max': int(f['MaxDurationRight'] or 0), 'claim': f['ClaimRightPossible'] == 'J'})
            codes.add(f['FareCalculationCode'])
        for c in codes:
            if c and c not in fares:
                parts = parts_of(m, c)
                if parts:
                    desc = fc.get((m, c), {}).get('FareCalculationDesc', '').strip()
                    fares[c] = {'desc': desc, 'parts': parts, 'h': cost(parts, 60), 'fixed': is_fixed(desc, parts), 'reg': is_regular(desc, parts)}
        if not any(f['f'] in fares for f in frames): continue   # aucune tarification courante : zone non écrite
        if all(fares[f['f']]['h'] == 0 for f in frames if f['f'] in fares): continue
        regs[r['RegulationId']] = {'desc': rg['RegulationDesc'].strip(), 'type': rg['RegulationType'], 'frames': frames}
        zones.append((r['AreaId'], r['UsageId'], r['RegulationId']))
    byzone = collections.OrderedDict()
    for aid, usage, rid in zones:
        z = byzone.setdefault(aid, {'id': aid, 'name': clean(areas.get((m, aid)) or aid).strip(), 'kind': USAGES[usage], 'regs': [], 'geo': aid in geom.get(m, {})})
        if rid not in z['regs']: z['regs'].append(rid)
    zl = list(byzone.values())
    street = [z for z in zl if z['kind'] == 'straat']
    hs = sorted({fares[f['f']]['h'] for z in street for rid in z['regs'] for f in regs[rid]['frames'] if f['f'] in fares and fares[f['f']]['reg'] and fares[f['f']]['h'] > 0})
    data = {'slug': slug, 'name': name, 'mgr': m, 'mgrName': mgr.get(m, name), 'read': READ, 'zones': zl, 'regs': regs, 'fares': fares,
            'special': sorted(special.get(m, []), key=lambda x: x['d'])}
    json.dump(data, open(os.path.join(OUT, f'{slug}.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    g = [{'id': aid, 'rings': wkt(geom[m][aid])} for aid in byzone if aid in geom.get(m, {})]
    json.dump(g, open(os.path.join(GEO, f'{slug}.json'), 'w'), separators=(',', ':'))
    index.append({'slug': slug, 'name': name, 'mgr': m, 'zones': len(street), 'pr': len([z for z in zl if z['kind'] == 'pr']), 'garages': len([z for z in zl if z['kind'] == 'garage']),
                  'geo': len(g), 'hMin': hs[0] if hs else 0, 'hMax': hs[-1] if hs else 0})
    print(f"{name:18s} zones {len(street):4d} pr {index[-1]['pr']:3d} garages {index[-1]['garages']:3d} geo {len(g):4d} €/h {index[-1]['hMin']:.2f}-{index[-1]['hMax']:.2f} regs {len(regs)} fares {len(fares)} special {len(data['special'])}")
json.dump({'read': READ, 'cities': index}, open(os.path.join(OUT, 'index.json'), 'w'), ensure_ascii=False, indent=1)

# ---- lite.json : les 24 villes en un seul fichier compact pour les outils de l'accueil et des pages thème ----
lite = []
for slug, name, m in CITIES:
    d = json.load(open(os.path.join(OUT, f'{slug}.json')))
    fares = {c: f['parts'] for c, f in d['fares'].items()}
    zones = []
    for z in d['zones']:
        if z['kind'] == 'garage': continue
        w = []; prods = {}
        for rid in z['regs']:
            r = d['regs'][rid]
            for f in r['frames']:
                fa = d['fares'].get(f['f'])
                if not fa or fa['h'] == 0: continue
                if fa['fixed']:
                    amt = next(p['amt'] for p in fa['parts'] if p['amt'] > 0)
                    if round(amt, 2) != amt: continue   # montant non arrondi au centime (Delft TAR05) : illisible, non repris
                    prods.setdefault((fa['desc'] or r['desc'])[:60], amt)
                elif isinstance(f['d'], int) or f['d'] == 'F':
                    w.append([f['d'], f['s'], f['e'], f['f'], f['max']])
        hs = [d['fares'][x[3]]['h'] for x in w if d['fares'][x[3]]['reg']]
        sch = any(not d['fares'][x[3]]['reg'] for x in w)
        zones.append({'i': z['id'], 'n': z['name'][:48], 'k': z['kind'], 'g': z['geo'], 'h': max(hs) if hs else 0, 'x': sch, 'w': w,
                      'p': [{'l': l, 'a': a} for l, a in sorted(prods.items(), key=lambda t: t[1])]})
    lite.append({'s': slug, 'n': name, 'z': zones, 'f': {c: p for c, p in fares.items() if any(x[3] == c for z in zones for x in z['w'])}})
json.dump(lite, open(os.path.join(OUT, 'lite.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print('lite.json', os.path.getsize(os.path.join(OUT, 'lite.json')) // 1024, 'Ko')
