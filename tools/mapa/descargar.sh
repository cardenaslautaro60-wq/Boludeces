#!/usr/bin/env bash
# Descarga los datos crudos de Comodoro Rivadavia que usa build_map.py:
#   - calles, costa, barrios y lugares de OpenStreetMap (Overpass API)
#   - relieve (tiles "terrarium" públicos de AWS, zoom 13)
# Uso: tools/mapa/descargar.sh [carpeta]   (por defecto tools/mapa/cache)
set -euo pipefail
DIR="${1:-$(dirname "$0")/cache}"
mkdir -p "$DIR/dem"
OVERPASS="${OVERPASS:-https://overpass.kumi.systems/api/interpreter}"
BBOX="-45.99,-67.72,-45.69,-67.33"
WIDE="-46.00,-67.75,-45.68,-67.30"

q() { # q archivo consulta
  for i in 1 2 3 4; do
    curl -sS -m 300 -X POST --data-urlencode "data=$2" "$OVERPASS" -o "$DIR/$1" && head -c 40 "$DIR/$1" | grep -q '{' && return 0
    echo "reintentando $1..." >&2; sleep $((i * 15))
  done
  echo "no se pudo bajar $1" >&2; return 1
}

q roads.json "[out:json][timeout:240];way[\"highway\"~\"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|living_street|motorway_link|trunk_link|primary_link|secondary_link|tertiary_link|pedestrian)$\"]($BBOX);out geom tags;"
q feat.json "[out:json][timeout:240];(way[\"natural\"=\"coastline\"]($WIDE);node[\"place\"]($WIDE);nwr[\"natural\"=\"peak\"]($WIDE);nwr[\"amenity\"~\"^(hospital|police|bus_station|place_of_worship|townhall|university|casino|marketplace|fire_station)$\"]($BBOX);nwr[\"tourism\"~\"^(museum|viewpoint|attraction)$\"]($WIDE);nwr[\"leisure\"~\"^(stadium)$\"]($BBOX);way[\"aeroway\"~\"^(runway|aerodrome)$\"]($WIDE););out geom tags;"
q admin.json "[out:json][timeout:240];relation[\"boundary\"=\"administrative\"][\"admin_level\"~\"^(8|9|10)$\"]($WIDE);out geom;"
q extra.json "[out:json][timeout:240];(way[\"landuse\"~\"^(industrial|commercial|retail|cemetery|military|port)$\"]($BBOX);way[\"leisure\"~\"^(park|pitch|stadium|sports_centre|golf_course)$\"]($BBOX);node[\"amenity\"~\"^(fuel|school)$\"]($BBOX);way[\"amenity\"~\"^(fuel|school|hospital)$\"]($BBOX);node[\"power\"=\"generator\"](-45.99,-67.95,-45.60,-67.33);node[\"man_made\"~\"^(mast|tower|communications_tower|lighthouse|storage_tank|petroleum_well)$\"]($WIDE);way[\"man_made\"~\"^(storage_tank|pier|breakwater|groyne)$\"]($WIDE);way[\"building\"][\"name\"]($BBOX););out geom tags;"

python3 - "$DIR" <<'EOF'
import math, os, sys
d = sys.argv[1]
z = 13; n = 2 ** z
def tile(lat, lon):
    x = (lon + 180) / 360 * n
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return int(x), int(y)
x0, y0 = tile(-45.69, -67.72); x1, y1 = tile(-45.99, -67.33)
with open(os.path.join(d, 'dem', 'list.txt'), 'w') as f:
    for x in range(x0, x1 + 1):
        for y in range(y0, y1 + 1):
            f.write(f'url = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"\noutput = "{d}/dem/{x}_{y}.png"\n')
with open(os.path.join(d, 'dem', 'tiles.txt'), 'w') as f:
    f.write(f'{z} {x0} {x1} {y0} {y1}\n')
EOF
curl -sS -m 600 -K "$DIR/dem/list.txt" --parallel --parallel-max 8
echo "Listo: $DIR"
