#!/usr/bin/env python3
"""Nom de wijk (quartier) de chaque zone de rue qui a une géométrie dans le registre.

Testeurs naïfs du 2026-11-14 (4e tour) : « Tariefzone 1 (T11V) », « 10c max 60 po 60 » ne disent rien.
Le registre ne donne pas de quartier ; la Locatieserver de PDOK (Kadaster, déjà citée pour la recherche par
adresse) donne la wijk du CBS qui contient un point. On interroge quelques points à l'intérieur de chaque zone
(public/data/geo/<ville>.json) et on garde la wijk la plus fréquente ; « en omgeving » si la zone en touche
plusieurs. Résultat : src/data/npr/wijken.json { ville: { zone: wijk } }. Sans réseau, le fichier existant reste.
Utrecht et Maastricht n'ont pas de géométrie : leurs zones gardent leur nom du registre.
"""
import collections, concurrent.futures, json, os, sys, time, urllib.request, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEO = os.path.join(ROOT, 'public', 'data', 'geo')
OUT = os.path.join(ROOT, 'src', 'data', 'npr', 'wijken.json')
URL = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?'


def inside(pt, ring):
    x, y, ins = pt[0], pt[1], False
    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i]; xj, yj = ring[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi: ins = not ins
        j = i
    return ins


def samples(rings, n=5):
    """Au plus n points dans la zone : le centre de la plus grande boucle, puis une grille 3 × 3 sur son emprise."""
    big = max(rings, key=len)
    xs, ys = [p[0] for p in big], [p[1] for p in big]
    cand = [(sum(xs) / len(xs), sum(ys) / len(ys))]
    for fx in (0.25, 0.5, 0.75):
        for fy in (0.25, 0.5, 0.75):
            cand.append((min(xs) + fx * (max(xs) - min(xs)), min(ys) + fy * (max(ys) - min(ys))))
    pts = [p for p in cand if any(inside(p, r) for r in rings)]
    return (pts or [tuple(big[0])])[:n]


def wijk(pt):
    q = urllib.parse.urlencode({'lat': f'{pt[1]:.6f}', 'lon': f'{pt[0]:.6f}', 'type': 'wijk', 'rows': 1, 'fl': 'wijknaam'})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(URL + q, timeout=20) as r:
                docs = json.load(r)['response']['docs']
                return docs[0]['wijknaam'] if docs else None
        except Exception:
            time.sleep(1 + attempt)
    return None


def label(names):
    c = collections.Counter(x for x in names if x)
    if not c: return None
    top = c.most_common(1)[0][0]
    return top if len(c) == 1 else f'{top} en omgeving'


def main():
    out = {}
    jobs = []
    for f in sorted(os.listdir(GEO)):
        slug = f[:-5]
        for g in json.load(open(os.path.join(GEO, f))):
            if g['rings']: jobs.append((slug, g['id'], samples(g['rings'])))
    with concurrent.futures.ThreadPoolExecutor(8) as ex:
        res = ex.map(lambda j: (j[0], j[1], label([wijk(p) for p in j[2]])), jobs)
        for slug, zid, name in res:
            if name: out.setdefault(slug, {})[zid] = name
    found = sum(len(v) for v in out.values())
    if found < len(jobs) * 0.8:
        sys.exit(f'build-wijken: {found} / {len(jobs)} zones gevonden, PDOK onbereikbaar? Bestand niet overschreven.')
    json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=0, sort_keys=True)
    print(f'wijken.json: {found} / {len(jobs)} zones')


if __name__ == '__main__':
    main()
