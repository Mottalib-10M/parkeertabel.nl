#!/usr/bin/env bash
# Relecture planifiée (npm run update-data, .github/workflows/deploy.yml) : retélécharge les jeux Open Data Parkeren
# (RDW, CC0) dans data-raw/npr (hors git), date la lecture par la dernière mise à jour publiée des jeux
# (métadonnées Socrata rowsUpdatedAt), puis relance scripts/build-npr.py (tarifs en vigueur ce jour).
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf data-raw/npr
export NPR_READ="$(python3 - <<'PY'
import json, re, urllib.request, datetime
src = open('scripts/build-npr.py', encoding='utf-8').read()
ids = re.findall(r"'([a-z0-9]{4}-[a-z0-9]{4})'", src[src.index('SETS = {'):src.index('}', src.index('SETS = {'))])
ts = []
for i in ids:
    with urllib.request.urlopen(f'https://opendata.rdw.nl/api/views/{i}.json', timeout=60) as r:
        m = json.load(r)
    ts.append(m.get('rowsUpdatedAt') or m.get('viewLastModified') or 0)
print(datetime.datetime.fromtimestamp(max(ts), datetime.timezone.utc).date().isoformat())
PY
)"
echo "NPR_READ=$NPR_READ"
python3 scripts/build-npr.py
