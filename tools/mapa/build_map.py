#!/usr/bin/env python3
"""Convierte los datos reales de Comodoro Rivadavia (OpenStreetMap + relieve) al mapa del juego.

Uso:
    tools/mapa/descargar.sh tools/mapa/cache
    python3 tools/mapa/build_map.py tools/mapa/cache src/world/comodoro-data.js

Escala: las zonas urbanas (Rada Tilly, el Centro con los barrios del sur y el Chenque hasta Km 3,
Km 5, Km 8 y Caleta Córdova) conservan su forma real a escala 0,55; los tramos vacíos de ruta entre
ellas se comprimen más, como hizo Rockstar con San Andreas. El Norte sigue arriba.

Datos © colaboradores de OpenStreetMap (ODbL). Relieve: Mapzen/AWS Terrain Tiles.
Necesita: numpy, shapely, pillow.
"""
import base64
import json
import math
import os
import sys
import zlib
from collections import defaultdict

import numpy as np
from PIL import Image
from shapely.geometry import LineString, MultiLineString, Point, Polygon, box
from shapely.ops import linemerge, polygonize, split, unary_union
from shapely.prepared import prep

CACHE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), 'cache')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'world', 'comodoro-data.js')

# ---------------------------------------------------------------------------
# Proyección y deformación
# ---------------------------------------------------------------------------
LAT0, LON0 = -45.8632, -67.4753
KX = 111320 * math.cos(math.radians(LAT0))
KY = 110540


def proj(lat, lon):
    """Metros reales: x = Este, z = Sur."""
    return ((lon - LON0) * KX, -(lat - LAT0) * KY)


def unproj(x, z):
    return (LAT0 - z / KY, LON0 + x / KX)


_n = math.hypot(0.59, -0.807)
UX, UZ = 0.59 / _n, -0.807 / _n       # a lo largo de la costa (de Rada Tilly a Caleta)
VX, VZ = UZ, -UX                       # tierra adentro (hacia el Oeste)

# Tramos a lo largo de la costa: (desde a, pendiente)
A_BP = [-12300, -12000, -10300, -8000, -5300, 2900, 4300, 5800, 7300, 9700, 13500, 15000, 15300]
A_SL = [0.3, 0.45, 0.55, 0.2, 0.55, 0.3, 0.55, 0.3, 0.55, 0.15, 0.55, 0.3]
B_BP = [-3200, 5200, 9200]
B_SL = [0.55, 0.25]
VS = 0.55          # escala vertical
CORE_MIN = 0.5     # pendiente mínima para considerar "zona urbana"
CORE_BMAX = 5200


def _cum(bp, sl):
    f = [0.0]
    for i, s in enumerate(sl):
        f.append(f[-1] + (bp[i + 1] - bp[i]) * s)
    f = np.array(f)
    k = int(np.argmin(np.abs(np.array(bp))))
    # anclar F(0) = 0
    i = np.searchsorted(bp, 0) - 1
    f0 = f[i] + (0 - bp[i]) * sl[i]
    void = k
    return np.array(bp, dtype=float), f - f0


A_BPa, A_F = _cum(A_BP, A_SL)
B_BPa, B_F = _cum(B_BP, B_SL)


def Fa(a):
    return np.interp(a, A_BPa, A_F)


def Fb(b):
    return np.interp(b, B_BPa, B_F)


def Fa_inv(A):
    return np.interp(A, A_F, A_BPa)


def Fb_inv(B):
    return np.interp(B, B_F, B_BPa)


def slope_a(a):
    for i in range(len(A_SL)):
        if A_BP[i] <= a < A_BP[i + 1]:
            return A_SL[i]
    return 0.1


def ab(x, z):
    return x * UX + z * UZ, x * VX + z * VZ


def warp(x, z):
    a, b = ab(x, z)
    A, B = float(Fa(a)), float(Fb(b))
    return (A * UX + B * VX, A * UZ + B * VZ)


def game_ab(X, Z):
    return X * UX + Z * UZ, X * VX + Z * VZ


def inside_world(x, z, margin=0):
    a, b = ab(x, z)
    return A_BP[0] + margin <= a <= A_BP[-1] - margin and B_BP[0] + margin <= b <= B_BP[-1] - margin


def is_core(x, z):
    a, b = ab(x, z)
    return slope_a(a) >= CORE_MIN and b <= CORE_BMAX


def warp_geom_coords(coords):
    return [warp(x, z) for x, z in coords]


def load(name):
    with open(os.path.join(CACHE, name)) as f:
        return json.load(f)['elements']


def geom_xy(el):
    return [proj(g['lat'], g['lon']) for g in el['geometry']]


def el_point(el):
    if 'lat' in el:
        return proj(el['lat'], el['lon'])
    if 'bounds' in el:
        b = el['bounds']
        return proj((b['minlat'] + b['maxlat']) / 2, (b['minlon'] + b['maxlon']) / 2)
    if 'geometry' in el:
        pts = geom_xy(el)
        return (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))
    return None


# ---------------------------------------------------------------------------
# Costa y tierra firme (coordenadas reales)
# ---------------------------------------------------------------------------
print('costa...')
feat = load('feat.json')
coast_lines = [LineString(geom_xy(e)) for e in feat if e.get('tags', {}).get('natural') == 'coastline' and len(e.get('geometry', [])) > 1]
merged = linemerge(unary_union(coast_lines))
parts = list(merged.geoms) if hasattr(merged, 'geoms') else [merged]
parts.sort(key=lambda l: -l.length)
main = parts[0]


def extend(line, d=30000):
    c = list(line.coords)
    (x0, z0), (x1, z1) = c[0], c[1]
    l = math.hypot(x0 - x1, z0 - z1)
    s = (x0 + (x0 - x1) / l * d, z0 + (z0 - z1) / l * d)
    (xa, za), (xb, zb) = c[-1], c[-2]
    l = math.hypot(xa - xb, za - zb)
    e = (xa + (xa - xb) / l * d, za + (za - zb) / l * d)
    return LineString([s] + c + [e])


REG = box(-40000, -40000, 40000, 40000)
pieces = split(REG, extend(main))
land = None
probe = Point(-3000, 0)
for p in pieces.geoms:
    if p.contains(probe):
        land = p
# islotes y rellenos: se suman los anillos cerrados chicos
for p in parts[1:]:
    if p.is_ring and p.length > 60:
        land = land.union(Polygon(p.coords))
land_p = prep(land)
print('  tierra firme ok, largo de costa', round(main.length / 1000, 1), 'km')

# ---------------------------------------------------------------------------
# Relieve
# ---------------------------------------------------------------------------
print('relieve...')
with open(os.path.join(CACHE, 'dem', 'tiles.txt')) as f:
    tz, tx0, tx1, ty0, ty1 = [int(v) for v in f.read().split()]
TN = 2 ** tz
DW, DH = (tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256
DEM = np.zeros((DH, DW), dtype=np.float32)
for x in range(tx0, tx1 + 1):
    for y in range(ty0, ty1 + 1):
        a = np.asarray(Image.open(os.path.join(CACHE, 'dem', f'{x}_{y}.png')).convert('RGB')).astype(np.float32)
        DEM[(y - ty0) * 256:(y - ty0 + 1) * 256, (x - tx0) * 256:(x - tx0 + 1) * 256] = (a[:, :, 0] * 256 + a[:, :, 1] + a[:, :, 2] / 256) - 32768


def dem_at(x, z):
    lat, lon = unproj(x, z)
    px = ((lon + 180) / 360 * TN - tx0) * 256
    py = ((1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * TN - ty0) * 256
    i, j = int(math.floor(px)), int(math.floor(py))
    if i < 0 or j < 0 or i >= DW - 1 or j >= DH - 1:
        return 0.0
    u, v = px - i, py - j
    return float(DEM[j, i] * (1 - u) * (1 - v) + DEM[j, i + 1] * u * (1 - v) + DEM[j + 1, i] * (1 - u) * v + DEM[j + 1, i + 1] * u * v)


# Grilla de alturas en el marco del juego (A a lo largo de la costa, B tierra adentro)
HC = 20.0
A0, A1 = float(A_F[0]), float(A_F[-1])
B0, B1 = float(B_F[0]), float(B_F[-1])
NA = int(math.ceil((A1 - A0) / HC)) + 1
NB = int(math.ceil((B1 - B0) / HC)) + 1
print('  grilla', NA, 'x', NB)
H = np.zeros((NB, NA), dtype=np.float32)
LAND = np.zeros((NB, NA), dtype=bool)
for j in range(NB):
    Bv = B0 + j * HC
    b = float(Fb_inv(Bv))
    for i in range(NA):
        Av = A0 + i * HC
        a = float(Fa_inv(Av))
        x, z = a * UX + b * VX, a * UZ + b * VZ
        is_land = land_p.contains(Point(x, z))
        LAND[j, i] = is_land
        H[j, i] = dem_at(x, z) * VS if is_land else 0


def chamfer(mask):
    """Distancia (en celdas) a la celda más cercana donde mask es True."""
    INF = 1e9
    d = np.where(mask, 0.0, INF)
    ny, nx = d.shape
    s2 = math.sqrt(2)
    for j in range(ny):
        row = d[j]
        if j > 0:
            up = d[j - 1]
            row[:] = np.minimum(row, up + 1)
            row[1:] = np.minimum(row[1:], up[:-1] + s2)
            row[:-1] = np.minimum(row[:-1], up[1:] + s2)
        for i in range(1, nx):
            if row[i - 1] + 1 < row[i]:
                row[i] = row[i - 1] + 1
    for j in range(ny - 1, -1, -1):
        row = d[j]
        if j < ny - 1:
            dn = d[j + 1]
            row[:] = np.minimum(row, dn + 1)
            row[1:] = np.minimum(row[1:], dn[:-1] + s2)
            row[:-1] = np.minimum(row[:-1], dn[1:] + s2)
        for i in range(nx - 2, -1, -1):
            if row[i + 1] + 1 < row[i]:
                row[i] = row[i + 1] + 1
    return d


print('  distancias a la costa...')
d_land = chamfer(LAND) * HC     # para celdas de mar: distancia a tierra
d_sea = chamfer(~LAND) * HC     # para celdas de tierra: distancia al mar
H = np.where(LAND, np.maximum(H, 0.5 + np.minimum(d_sea, 60) * 0.02), -np.minimum(16.0, 0.8 + d_land * 0.045))
# suavizado leve (el DEM tiene escalones de 1 m)
Hs = H.copy()
Hs[1:-1, 1:-1] = (H[1:-1, 1:-1] * 4 + H[:-2, 1:-1] + H[2:, 1:-1] + H[1:-1, :-2] + H[1:-1, 2:]) / 8
H = np.where(LAND, Hs, H)
print('  alturas', round(float(H.min()), 1), round(float(H.max()), 1))

# ---------------------------------------------------------------------------
# Calles
# ---------------------------------------------------------------------------
print('calles...')
roads = load('roads.json')
UNPAVED = {'unpaved', 'gravel', 'dirt', 'ground', 'compacted', 'fine_gravel', 'sand', 'earth', 'mud', 'grass'}
KIND = {'trunk': ('ruta', 15), 'motorway': ('ruta', 16), 'primary': ('avenida', 13), 'secondary': ('avenida', 11.5),
        'tertiary': ('calle', 10), 'residential': ('calle', 8.5), 'living_street': ('calle', 7),
        'unclassified': ('calle', 8), 'pedestrian': ('peatonal', 7)}

nodes_real = {}      # osm id -> (x, z)
ways = []            # {ids, hw, name, oneway, tags}
for e in roads:
    t = e['tags']
    hw = t['highway']
    if hw.endswith('_link'):
        continue
    if hw not in KIND:
        continue
    ids = e.get('nodes')
    geo = e['geometry']
    if not ids:
        # sin ids: se generan ids sintéticos por coordenada
        ids = [f"{round(g['lat'], 7)},{round(g['lon'], 7)}" for g in geo]
    for nid, g in zip(ids, geo):
        nodes_real[nid] = proj(g['lat'], g['lon'])
    ways.append({'ids': list(ids), 'hw': hw, 'tags': t, 'id': e['id']})
print('  vías', len(ways), 'nodos', len(nodes_real))

# nombre visible
def way_name(t):
    n = t.get('name')
    if n:
        return n
    r = t.get('ref', '')
    if r.startswith('RN'):
        return 'Ruta Nacional ' + r[2:].strip()
    if r.startswith('RP'):
        return 'Ruta Provincial ' + r[2:].strip()
    return ''


# Rotondas: se colapsan a un nodo
alias = {}
for w in ways:
    t = w['tags']
    if t.get('junction') in ('roundabout', 'circular') and w['ids'][0] == w['ids'][-1]:
        pts = [nodes_real[i] for i in w['ids']]
        cx = sum(p[0] for p in pts) / len(pts)
        cz = sum(p[1] for p in pts) / len(pts)
        r = max(math.hypot(p[0] - cx, p[1] - cz) for p in pts)
        if r < 70:
            key = f'rot{w["id"]}'
            nodes_real[key] = (cx, cz)
            for i in w['ids']:
                alias[i] = key
            w['drop'] = True
for w in ways:
    w['ids'] = [alias.get(i, i) for i in w['ids']]
    dd = []
    for i in w['ids']:
        if not dd or dd[-1] != i:
            dd.append(i)
    w['ids'] = dd

# Autovías con dos manos separadas: se deja una sola, corrida al medio
groups = defaultdict(list)
for w in ways:
    if w.get('drop'):
        continue
    t = w['tags']
    if t.get('oneway') in ('yes', '1', 'true') and w['hw'] in ('trunk', 'motorway', 'primary', 'secondary', 'tertiary'):
        groups[(way_name(t), w['hw'] if way_name(t) == '' else '')].append(w)
shift = defaultdict(list)
n_dual = 0
for key, ws in groups.items():
    lines = [LineString([nodes_real[i] for i in w['ids']]) for w in ws]
    for k, w in enumerate(ws):
        line = lines[k]
        mid = line.interpolate(0.5, normalized=True)
        best = None
        for m, other in enumerate(lines):
            if m == k:
                continue
            d = other.distance(mid)
            if d < 55 and (best is None or d < best[0]):
                best = (d, m)
        if not best:
            continue
        other = lines[best[1]]
        # sentidos opuestos
        p = other.project(mid)
        q0 = other.interpolate(max(0, p - 5)); q1 = other.interpolate(min(other.length, p + 5))
        c = list(line.coords)
        i0 = min(range(len(c) - 1), key=lambda i: LineString([c[i], c[i + 1]]).distance(mid))
        dx, dz = c[i0 + 1][0] - c[i0][0], c[i0 + 1][1] - c[i0][1]
        ox, oz = q1.x - q0.x, q1.y - q0.y
        if dx * ox + dz * oz > 0:
            continue
        ddx, ddz = c[-1][0] - c[0][0], c[-1][1] - c[0][1]
        du, dv = ddx * UX + ddz * UZ, ddx * VX + ddz * VZ
        keep = du > 0 if abs(du) >= abs(dv) else dv > 0
        n_dual += 1
        if not keep:
            w['drop'] = True
            continue
        w['dual'] = True
        for i in w['ids']:
            px, pz = nodes_real[i]
            np_ = other.interpolate(other.project(Point(px, pz)))
            if np_.distance(Point(px, pz)) < 55:
                shift[i].append(((np_.x - px) / 2, (np_.y - pz) / 2))
for i, s in shift.items():
    x, z = nodes_real[i]
    nodes_real[i] = (x + sum(v[0] for v in s) / len(s), z + sum(v[1] for v in s) / len(s))
print('  manos dobles', n_dual)


def allowed(hw, x, z, total_len, unpaved):
    if not inside_world(x, z, 40):
        return False
    a, b = ab(x, z)
    s = slope_a(a)
    core = s >= CORE_MIN and b <= CORE_BMAX
    if hw in ('trunk', 'motorway', 'primary', 'secondary'):
        return True
    if hw == 'tertiary':
        return core or (s >= 0.3 and b <= 7000)
    if hw in ('residential', 'living_street', 'pedestrian'):
        return core
    if hw == 'unclassified':
        return core or total_len > 1500
    return False


pieces = []   # {ids, kind, width, name, surf}
for w in ways:
    if w.get('drop'):
        continue
    t = w['tags']
    hw = w['hw']
    kind, width = KIND[hw]
    unpaved = t.get('surface') in UNPAVED or t.get('tracktype') not in (None, 'grade1')
    pts = [nodes_real[i] for i in w['ids']]
    total = sum(math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1]) for k in range(len(pts) - 1))
    if hw == 'unclassified':
        a, b = ab(*pts[len(pts) // 2])
        if not (slope_a(a) >= CORE_MIN and b <= CORE_BMAX):
            kind, width, unpaved = 'tierra', 8, True
    if unpaved and kind in ('calle', 'avenida'):
        kind = 'tierra' if hw in ('residential', 'unclassified', 'living_street', 'tertiary') else kind
    if w.get('dual'):
        width += 3
    run = []
    for i, p in zip(w['ids'], pts):
        if allowed(hw, p[0], p[1], total, unpaved):
            run.append(i)
        else:
            if len(run) >= 2:
                pieces.append({'ids': run, 'kind': kind, 'width': width, 'name': way_name(t)})
            run = []
    if len(run) >= 2:
        pieces.append({'ids': run, 'kind': kind, 'width': width, 'name': way_name(t)})
print('  tramos', len(pieces))

# Pasar al marco del juego
G = {}
for p in pieces:
    for i in p['ids']:
        if i not in G:
            G[i] = warp(*nodes_real[i])

# Unir nodos muy cercanos (union-find con grilla)
parent = {}


def find(i):
    while parent.get(i, i) != i:
        parent[i] = parent.get(parent[i], parent[i])
        i = parent[i]
    return i


def union(a, b):
    ra, rb = find(a), find(b)
    if ra != rb:
        parent[rb] = ra


MERGE = 3.0
grid = defaultdict(list)
for i, (x, z) in G.items():
    grid[(int(x // MERGE), int(z // MERGE))].append(i)
for (gx, gz), lst in grid.items():
    for dx in (-1, 0, 1):
        for dz in (-1, 0, 1):
            for j in grid.get((gx + dx, gz + dz), []):
                for i in lst:
                    if i != j and math.hypot(G[i][0] - G[j][0], G[i][1] - G[j][1]) < MERGE:
                        union(i, j)
for p in pieces:
    ids = []
    for i in p['ids']:
        r = find(i)
        if not ids or ids[-1] != r:
            ids.append(r)
    p['ids'] = ids
pieces = [p for p in pieces if len(p['ids']) >= 2]


def degree_map():
    deg = defaultdict(int)
    for p in pieces:
        ids = p['ids']
        for k in range(len(ids) - 1):
            deg[ids[k]] += 1
            deg[ids[k + 1]] += 1
    return deg


# Empalmar puntas sueltas con la calle más cercana (lo que cortaron las manos dobles)
deg = degree_map()
seg_grid = defaultdict(list)
SG = 40.0
for pi, p in enumerate(pieces):
    ids = p['ids']
    for k in range(len(ids) - 1):
        (x0, z0), (x1, z1) = G[ids[k]], G[ids[k + 1]]
        for gx in range(int(min(x0, x1) // SG) - 1, int(max(x0, x1) // SG) + 2):
            for gz in range(int(min(z0, z1) // SG) - 1, int(max(z0, z1) // SG) + 2):
                seg_grid[(gx, gz)].append((pi, k))
snapped = 0
new_id = 0
for pi, p in enumerate(pieces):
    for end in (0, -1):
        nid = p['ids'][end]
        if deg[nid] != 1:
            continue
        x, z = G[nid]
        best = None
        for (qi, k) in seg_grid.get((int(x // SG), int(z // SG)), []):
            if qi == pi:
                continue
            q = pieces[qi]['ids']
            if k + 1 >= len(q):
                continue
            (x0, z0), (x1, z1) = G[q[k]], G[q[k + 1]]
            dx, dz = x1 - x0, z1 - z0
            L2 = dx * dx + dz * dz
            if L2 < 1e-6:
                continue
            t = max(0, min(1, ((x - x0) * dx + (z - z0) * dz) / L2))
            px, pz = x0 + dx * t, z0 + dz * t
            d = math.hypot(px - x, pz - z)
            lim = 6 + (pieces[qi]['width'] + p['width']) / 2
            if d < lim and (best is None or d < best[0]):
                best = (d, qi, k, t, px, pz)
        if not best:
            continue
        d, qi, k, t, px, pz = best
        q = pieces[qi]['ids']
        if t < 0.08 or math.hypot(G[q[k]][0] - px, G[q[k]][1] - pz) < 4:
            target = q[k]
        elif t > 0.92 or math.hypot(G[q[k + 1]][0] - px, G[q[k + 1]][1] - pz) < 4:
            target = q[k + 1]
        else:
            new_id += 1
            target = f'snap{new_id}'
            G[target] = (px, pz)
            q.insert(k + 1, target)
            # la grilla de segmentos queda desfasada para este tramo: se recalcula el índice local
            for gx in range(int(px // SG) - 1, int(px // SG) + 2):
                for gz in range(int(pz // SG) - 1, int(pz // SG) + 2):
                    seg_grid[(gx, gz)].append((qi, k + 1))
        if target == nid:
            continue
        if end == 0:
            p['ids'].insert(0, target)
        else:
            p['ids'].append(target)
        deg[target] += 1
        deg[nid] += 1
        snapped += 1
print('  empalmes', snapped)

# Simplificación (Douglas-Peucker entre cruces)
deg = degree_map()


def dp(pts, tol):
    if len(pts) <= 2:
        return [0, len(pts) - 1]
    (x0, z0), (x1, z1) = pts[0], pts[-1]
    dx, dz = x1 - x0, z1 - z0
    L = math.hypot(dx, dz) or 1e-9
    best, bi = -1, -1
    for i in range(1, len(pts) - 1):
        x, z = pts[i]
        d = abs((x - x0) * dz - (z - z0) * dx) / L
        if d > best:
            best, bi = d, i
    if best <= tol:
        return [0, len(pts) - 1]
    left = dp(pts[:bi + 1], tol)
    right = dp(pts[bi:], tol)
    return left[:-1] + [bi + r for r in right]


for p in pieces:
    ids = p['ids']
    out = [ids[0]]
    start = 0
    for k in range(1, len(ids)):
        if deg[ids[k]] != 2 or k == len(ids) - 1:
            chain = ids[start:k + 1]
            keep = dp([G[i] for i in chain], 1.0)
            out.extend(chain[j] for j in keep[1:])
            start = k
    p['ids'] = out

# Calles que se cruzan sin esquina (puentes, pasos a nivel distinto y errores de OSM): en el
# juego todo va al ras del piso, así que se parten las dos en el punto de cruce y se forma una
# esquina de verdad (si no, las veredas y las marcas de una pasan por encima de la otra)
def seg_cross(a, b, c, d):
    (x1, z1), (x2, z2), (x3, z3), (x4, z4) = a, b, c, d
    den = (x2 - x1) * (z4 - z3) - (z2 - z1) * (x4 - x3)
    if abs(den) < 1e-9:
        return None
    t = ((x3 - x1) * (z4 - z3) - (z3 - z1) * (x4 - x3)) / den
    u = ((x3 - x1) * (z2 - z1) - (z3 - z1) * (x2 - x1)) / den
    if 0.02 < t < 0.98 and 0.02 < u < 0.98:
        return (x1 + t * (x2 - x1), z1 + t * (z2 - z1), t, u)
    return None


def split_crossings():
    CG = 60.0
    segs = []
    sgrid = defaultdict(list)
    for pi, p in enumerate(pieces):
        ids = p['ids']
        for k in range(len(ids) - 1):
            a, b = G[ids[k]], G[ids[k + 1]]
            si = len(segs)
            segs.append((pi, k))
            for gx in range(int(min(a[0], b[0]) // CG), int(max(a[0], b[0]) // CG) + 1):
                for gz in range(int(min(a[1], b[1]) // CG), int(max(a[1], b[1]) // CG) + 1):
                    sgrid[(gx, gz)].append(si)
    cuts = defaultdict(list)   # (pieza, tramo) -> [(t, id)]
    seen = set()
    nid = 0
    for cell, lst in sgrid.items():
        for ii in range(len(lst)):
            for jj in range(ii + 1, len(lst)):
                s1, s2 = lst[ii], lst[jj]
                key = (min(s1, s2), max(s1, s2))
                if key in seen:
                    continue
                seen.add(key)
                (p1, k1), (p2, k2) = segs[s1], segs[s2]
                i1a, i1b = pieces[p1]['ids'][k1], pieces[p1]['ids'][k1 + 1]
                i2a, i2b = pieces[p2]['ids'][k2], pieces[p2]['ids'][k2 + 1]
                if len({i1a, i1b, i2a, i2b}) < 4:
                    continue
                r = seg_cross(G[i1a], G[i1b], G[i2a], G[i2b])
                if not r:
                    continue
                x, z, t, u = r
                # si el cruce cae casi sobre una punta, se usa esa punta (evita tramitos de 1 m)
                ends = [(math.hypot(G[e][0] - x, G[e][1] - z), e) for e in (i1a, i1b, i2a, i2b)]
                dmin, emin = min(ends)
                if dmin < 2.5:
                    if emin not in (i1a, i1b):
                        cuts[(p1, k1)].append((t, emin))
                    if emin not in (i2a, i2b):
                        cuts[(p2, k2)].append((u, emin))
                    continue
                new = ('x', nid)
                nid += 1
                G[new] = (x, z)
                cuts[(p1, k1)].append((t, new))
                cuts[(p2, k2)].append((u, new))
    for pi, p in enumerate(pieces):
        ids = p['ids']
        out = [ids[0]]
        for k in range(len(ids) - 1):
            for _, new in sorted(cuts.get((pi, k), [])):
                out.append(new)
            out.append(ids[k + 1])
        p['ids'] = out
    return nid


n_cross = split_crossings()
print('  cruces sin esquina convertidos en esquina', n_cross)

# Quitar componentes chiquitos aislados
adj = defaultdict(set)
for p in pieces:
    ids = p['ids']
    for k in range(len(ids) - 1):
        adj[ids[k]].add(ids[k + 1])
        adj[ids[k + 1]].add(ids[k])
comp = {}
sizes = {}
for s in adj:
    if s in comp:
        continue
    stack = [s]
    comp[s] = s
    members = []
    while stack:
        u = stack.pop()
        members.append(u)
        for v in adj[u]:
            if v not in comp:
                comp[v] = s
                stack.append(v)
    sizes[s] = len(members)
main_comp = max(sizes, key=sizes.get)
pieces = [p for p in pieces if sizes[comp[p['ids'][0]]] >= 12 or comp[p['ids'][0]] == main_comp]

used = []
index = {}
for p in pieces:
    for i in p['ids']:
        if i not in index:
            index[i] = len(used)
            used.append(i)
print('  nodos finales', len(used), 'tramos', len(pieces))
total_game = 0
for p in pieces:
    ids = p['ids']
    total_game += sum(math.hypot(G[ids[k + 1]][0] - G[ids[k]][0], G[ids[k + 1]][1] - G[ids[k]][1]) for k in range(len(ids) - 1))
print('  km de calles en el juego', round(total_game / 1000, 1))

# ---------------------------------------------------------------------------
# Barrios (zonas con nombre)
# ---------------------------------------------------------------------------
print('barrios...')
admin = load('admin.json')


def relation_polys(rel):
    lines = []
    for m in rel.get('members', []):
        if m.get('type') == 'way' and m.get('role') in ('outer', '') and m.get('geometry'):
            lines.append(LineString([proj(g['lat'], g['lon']) for g in m['geometry']]))
    if not lines:
        return []
    merged = linemerge(unary_union(lines))
    return [pg for pg in polygonize(merged) if pg.area > 5000]


def warp_poly(pg, tol=4.0):
    pg = pg.segmentize(60)
    ext = [warp(x, z) for x, z in pg.exterior.coords]
    wp = Polygon(ext).buffer(0)
    wp = wp.simplify(tol)
    if wp.geom_type == 'MultiPolygon':
        wp = max(wp.geoms, key=lambda g: g.area)
    return wp


def zone_type(name, level, pg):
    c = pg.representative_point()
    a, b = ab(c.x, c.y)
    if name == 'Centro':
        return 'centro'
    if level == 8 or 'Rada' in name or a < -7000:
        return 'rada'
    if a > 1500:
        return 'km'
    return 'barrio'


zones = []
world_real = None
for rel in admin:
    t = rel['tags']
    name = t.get('name')
    lvl = int(t.get('admin_level', '0'))
    if not name or lvl not in (8, 9, 10):
        continue
    if lvl == 8 and 'Rada' not in name:
        continue
    for pg in relation_polys(rel):
        c = pg.representative_point()
        if not inside_world(c.x, c.y):
            continue
        wp = warp_poly(pg)
        if wp.is_empty or wp.area < 1500:
            continue
        zones.append({'name': name, 'level': lvl, 'type': zone_type(name, lvl, pg), 'poly': wp})
# Zonas de respaldo: lugares sin límite cargado en OSM (Rada Tilly, barrios de los kilómetros...)
# se arman con las calles alrededor del nodo del lugar
covered = unary_union([z['poly'] for z in zones]) if zones else Polygon()
piece_lines = [(p['kind'], LineString([G[i] for i in p['ids']])) for p in pieces]
for e in sorted(feat, key=lambda e: {'town': 0, 'village': 1, 'suburb': 2}.get(e.get('tags', {}).get('place'), 3)):
    t = e.get('tags', {})
    if t.get('place') not in ('town', 'village', 'suburb', 'neighbourhood') or not t.get('name') or 'lat' not in e:
        continue
    x, z = proj(e['lat'], e['lon'])
    if not inside_world(x, z):
        continue
    X, Z = warp(x, z)
    if covered.contains(Point(X, Z)):
        continue
    R = 900 if t['place'] == 'town' else 380
    area = Point(X, Z).buffer(R)
    lines = [l for k, l in piece_lines if k in ('calle', 'avenida', 'tierra', 'peatonal') and l.intersects(area)]
    if len(lines) < 6:
        continue
    hull = unary_union([l.buffer(32) for l in lines]).intersection(area).difference(covered)
    if hull.is_empty:
        continue
    if hull.geom_type == 'MultiPolygon':
        hull = max(hull.geoms, key=lambda g: g.area)
    hull = hull.buffer(0).simplify(4)
    if hull.is_empty or hull.area < 25000 or hull.geom_type != 'Polygon':
        continue
    a, b = ab(x, z)
    typ = 'rada' if a < -7000 else 'km' if a > 1500 else 'barrio'
    zones.append({'name': t['name'], 'level': 8 if t['place'] == 'town' else 9, 'type': typ, 'poly': Polygon(hull.exterior)})
    covered = covered.union(hull)
    print('  zona armada con calles:', t['name'], typ, round(hull.area))
print('  barrios', len(zones))

# Lugares sueltos (nodos place) para las zonas sin límite cargado
places = []
for e in feat:
    t = e.get('tags', {})
    if t.get('place') in ('suburb', 'neighbourhood', 'quarter', 'town', 'village', 'hamlet', 'locality') and t.get('name') and 'lat' in e:
        x, z = proj(e['lat'], e['lon'])
        if inside_world(x, z):
            X, Z = warp(x, z)
            places.append({'name': t['name'], 'x': round(X), 'z': round(Z), 'kind': t['place']})

# ---------------------------------------------------------------------------
# Usos del suelo, puntos de interés
# ---------------------------------------------------------------------------
print('usos del suelo y lugares...')
extra = load('extra.json')
areas = []   # {k, name, poly}
for e in extra:
    if e['type'] != 'way' or 'geometry' not in e or len(e['geometry']) < 4:
        continue
    t = e['tags']
    k = None
    if t.get('landuse') == 'industrial':
        k = 'industrial'
    elif t.get('landuse') in ('commercial', 'retail'):
        k = 'comercial'
    elif t.get('landuse') == 'cemetery':
        k = 'cementerio'
    elif t.get('landuse') == 'military':
        k = 'militar'
    elif t.get('leisure') == 'park':
        k = 'plaza'
    elif t.get('leisure') in ('pitch', 'sports_centre', 'stadium'):
        k = 'cancha'
    elif t.get('amenity') == 'school':
        k = 'escuela'
    if not k:
        continue
    pts = geom_xy(e)
    if pts[0] != pts[-1]:
        continue
    pg = Polygon(pts).buffer(0)
    if pg.is_empty:
        continue
    c = pg.representative_point()
    if not inside_world(c.x, c.y, 60):
        continue
    if k in ('plaza', 'cancha', 'escuela') and not is_core(c.x, c.y):
        continue
    wp = warp_poly(pg, 1.5)
    if wp.is_empty:
        continue
    lim = {'industrial': 2500, 'comercial': 800, 'plaza': 250, 'cancha': 300, 'escuela': 400, 'cementerio': 2000, 'militar': 3000}[k]
    if wp.area < lim:
        continue
    if k == 'plaza' and wp.area > 90000:
        continue
    areas.append({'k': k, 'name': t.get('name', ''), 'poly': wp})
print('  áreas', len(areas))


def grid_sample(pts, cell):
    seen = set()
    out = []
    for p in pts:
        key = (int(p[0] // cell), int(p[1] // cell))
        if key in seen:
            continue
        seen.add(key)
        out.append(p)
    return out


wells, turbines, masts, tanks, fuel, piers = [], [], [], [], [], []
for e in extra:
    t = e['tags']
    mm = t.get('man_made')
    pt = el_point(e)
    if not pt or not inside_world(pt[0], pt[1], 60):
        continue
    X, Z = warp(*pt)
    if mm == 'petroleum_well':
        wells.append((X, Z))
    elif t.get('power') == 'generator' and t.get('generator:source', 'wind') == 'wind':
        turbines.append((X, Z))
    elif mm in ('mast', 'tower', 'communications_tower'):
        masts.append((X, Z))
    elif mm == 'storage_tank':
        tanks.append((X, Z))
    elif t.get('amenity') == 'fuel':
        fuel.append((X, Z, t.get('brand') or t.get('name') or ''))
    elif mm == 'pier' and e['type'] == 'way':
        piers.append([warp(x, z) for x, z in geom_xy(e)])
wells = grid_sample(wells, 70)
turbines = grid_sample(turbines, 12)
masts = grid_sample(masts, 8)
tanks = grid_sample(tanks, 10)
print('  pozos', len(wells), 'molinos', len(turbines), 'antenas', len(masts), 'tanques', len(tanks), 'estaciones', len(fuel), 'muelles', len(piers))

landmarks = []
cands = defaultdict(list)
# para hitos repetidos se elige el más cercano a esta referencia (metros reales)
REF = {'anonima': (-800, 0), 'municipalidad': (-800, 0), 'casino': (-800, 0), 'hospital': (-800, 0)}


def add_landmark(key, name, x, z, poly=None):
    if key in ('anonima', 'municipalidad', 'hospital', 'casino') and ab(x, z)[0] < -6000:
        return   # los de Rada Tilly no
    cands[key].append((name, x, z, poly))


WANT = {
    'catedral': lambda t: 'San Juan Bosco' in t.get('name', '') and t.get('amenity') == 'place_of_worship' and 'Catedral' in t.get('name', ''),
    'municipalidad': lambda t: t.get('name') == 'Municipalidad' or t.get('amenity') == 'townhall' and 'Comodoro' in t.get('name', ''),
    'terminal': lambda t: t.get('amenity') == 'bus_station' and 'Solari' in t.get('name', ''),
    'hospital': lambda t: t.get('amenity') == 'hospital' and 'Regional' in t.get('name', ''),
    'museoPetroleo': lambda t: t.get('name') == 'Museo Nacional del Petróleo',
    'museoFerro': lambda t: t.get('name') == 'Museo Ferroportuario',
    'estadio': lambda t: 'Estadio Municipal' in t.get('name', ''),
    'aeropuerto': lambda t: t.get('aeroway') == 'aerodrome',
    'miradorChenque': lambda t: t.get('name') == 'Mirador Cerro Chenque',
    'chenque': lambda t: t.get('natural') == 'peak' and t.get('name') == 'Chenque',
    'torreGreyFox': lambda t: t.get('name') == 'Torre Grey Fox',
    'siglo21': lambda t: t.get('name') == 'Edificio Siglo XXI',
    'concejo': lambda t: 'Concejo Deliberante' in t.get('name', ''),
    'anonima': lambda t: t.get('name') == 'La Anónima',
    'carrefour': lambda t: t.get('name') == 'Carrefour',
    'canal9': lambda t: t.get('name') == 'Canal Nueve',
    'chaletHuergo': lambda t: t.get('name') == 'Chalet Huergo',
    'clubSur': lambda t: t.get('name') == 'Club Atlético del Sur',
    'gimnasio1': lambda t: 'Gimnasio Municipal Nº 1' in t.get('name', ''),
    'puntaMarques': lambda t: t.get('name') == 'Mirador Punta Marqués',
    'puntaMarquesPeak': lambda t: t.get('natural') == 'peak' and t.get('name') == 'Punta del Marqués',
    'casino': lambda t: t.get('amenity') == 'casino',
    'comisariaPrimera': lambda t: t.get('amenity') == 'police' and 'Primera' in t.get('name', ''),
    'puerto': lambda t: t.get('name') == 'Terminal del Puerto',
    'faro': lambda t: t.get('man_made') == 'lighthouse',
    'ypf': lambda t: t.get('name') == 'Adminsitración YPF',
    'restinga': lambda t: t.get('name') == 'Restinga Alí' and t.get('place') == 'suburb',
    'caleta': lambda t: t.get('name') == 'Caleta Córdova' and t.get('place') == 'suburb',
    'rada': lambda t: t.get('name') == 'Rada Tilly' and t.get('place') == 'town',
    'madriguera': lambda t: t.get('name') == 'Estadio de Jorge Newbery',
    'plazaSanMartin': lambda t: t.get('name') == 'Plaza San Martín' and t.get('leisure') == 'park',
    'plazaSoberania': lambda t: 'Soberanía' in t.get('name', '') and t.get('leisure') == 'park',
}
for e in feat + extra:
    t = e.get('tags', {})
    for key, fn in WANT.items():
        try:
            ok = fn(t)
        except Exception:
            ok = False
        if ok:
            pt = el_point(e)
            if pt and inside_world(pt[0], pt[1]):
                if key == 'plazaSanMartin' and pt[0] < -3000:
                    continue
                poly = None
                if e.get('type') == 'way' and e.get('geometry') and ('building' in t or 'leisure' in t):
                    poly = [warp(x, z) for x, z in geom_xy(e)]
                add_landmark(key, t.get('name', key), pt[0], pt[1], poly)
for key, lst in cands.items():
    rx, rz = REF.get(key, (lst[0][1], lst[0][2]))
    name, x, z, poly = min(lst, key=lambda c: math.hypot(c[1] - rx, c[2] - rz))
    X, Z = warp(x, z)
    d = {'k': key, 'name': name, 'x': round(X, 1), 'z': round(Z, 1)}
    if poly is not None:
        d['poly'] = [[round(a, 1), round(b, 1)] for a, b in poly]
    landmarks.append(d)
print('  hitos', len(landmarks), sorted(l['k'] for l in landmarks))
runways = []
for e in feat:
    t = e.get('tags', {})
    if t.get('aeroway') == 'runway' and e.get('geometry'):
        pts = geom_xy(e)
        if all(inside_world(x, z) for x, z in pts):
            runways.append({'w': float(t.get('width', 45)) * 0.55, 'pts': [[round(a, 1), round(b, 1)] for a, b in (warp(x, z) for x, z in pts)]})
print('  pistas', len(runways))

# ---------------------------------------------------------------------------
# Edificios reales: huellas de Microsoft Global ML Building Footprints (ODbL) y OSM
# ---------------------------------------------------------------------------
# Cada edificio va en su lugar real. Se agranda un poco respecto de la escala del mapa (0,55)
# para que la gente y los autos del juego (a tamaño real) no queden gigantes; se recorta donde
# pisaría calles o veredas y se orienta con el frente hacia la calle más cercana.
print('edificios...')
import glob
import gzip
from shapely.affinity import rotate as sh_rotate, scale as sh_scale, translate as sh_translate
from shapely.strtree import STRtree

K_BLD = 1.15      # barrios: casas un poco más grandes que la escala del mapa
K_BLD_CENTRO = 1.0  # Centro: edificación continua entre medianeras, a escala del mapa
SW_GAME = 2.6 + 0.35       # vereda + margen (city.js: SW)
bld_files = sorted(glob.glob(os.path.join(CACHE, 'ms_*.csv.gz')))


def h_game(X, Z):
    a, b = game_ab(X, Z)
    fi, fj = (a - A0) / HC, (b - B0) / HC
    i, j = int(np.clip(fi, 0, NA - 2)), int(np.clip(fj, 0, NB - 2))
    return float(H[j, i])


# pasillos de las calles (calzada + vereda) en el marco del juego
corr = []
for p in pieces:
    pts = [G[i] for i in p['ids']]
    if len(pts) < 2:
        continue
    half = p['width'] / 2 + (SW_GAME if p['kind'] in ('calle', 'avenida', 'peatonal') else 2.0)
    corr.append(LineString(pts).buffer(half, cap_style=2, join_style=2, resolution=2))
corr_tree = STRtree(corr)
road_lines = [LineString([G[i] for i in p['ids']]) for p in pieces if len(p['ids']) >= 2]
road_tree = STRtree(road_lines)
# plazas, canchas y cementerios: sin edificios adentro
open_areas = [Polygon(ar['poly']) if not hasattr(ar['poly'], 'geom_type') else ar['poly'] for ar in areas if ar['k'] in ('plaza', 'cancha', 'cementerio')]
open_areas = [g.buffer(0) for g in open_areas if g.is_valid or g.buffer(0).is_valid]
area_tree = STRtree(open_areas) if open_areas else None
from shapely.prepared import prep
centro_zone = prep(unary_union([z['poly'] for z in zones if z['type'] == 'centro']).buffer(20))

# tipo y pisos de OSM (los pocos edificios cargados con datos)
osm_b = []
try:
    for e in load('bld_osm.json'):
        t = e.get('tags', {})
        if e['type'] != 'way' or not e.get('geometry'):
            continue
        try:
            pg = Polygon([proj(g['lat'], g['lon']) for g in e['geometry']])
        except Exception:
            continue
        if not pg.is_valid or pg.area < 10:
            continue
        osm_b.append((pg, t))
except FileNotFoundError:
    pass
osm_tree = STRtree([pg for pg, _ in osm_b]) if osm_b else None
BKIND = {'house': 1, 'detached': 1, 'residential': 1, 'semidetached_house': 1, 'terrace': 1, 'bungalow': 1,
         'apartments': 2, 'dormitory': 2, 'hotel': 2,
         'commercial': 3, 'retail': 3, 'office': 3, 'supermarket': 3, 'kiosk': 3,
         'industrial': 4, 'warehouse': 4, 'hangar': 4, 'manufacture': 4, 'service': 4, 'storage_tank': 4,
         'church': 5, 'cathedral': 5, 'chapel': 5, 'public': 5, 'school': 5, 'university': 5, 'hospital': 5,
         'civic': 5, 'government': 5, 'college': 5, 'kindergarten': 5, 'sports_hall': 5, 'stadium': 5, 'train_station': 5,
         'garage': 6, 'garages': 6, 'shed': 6, 'roof': 6, 'carport': 6, 'hut': 6}


def osm_info(pg):
    if not osm_tree:
        return 0, 0
    best, ba = None, 0
    for k in osm_tree.query(pg):
        o = osm_b[int(k)][0]
        a = o.intersection(pg).area if o.intersects(pg) else 0
        if a > ba:
            ba, best = a, osm_b[int(k)][1]
    if not best or ba < pg.area * 0.3:
        return 0, 0
    lv = 0
    try:
        lv = int(float(str(best.get('building:levels', '0')).split(';')[0]))
    except ValueError:
        lv = 0
    return min(60, max(0, lv)), BKIND.get(best.get('building', ''), 0)


raw = []
seen_osm = set()
for f in bld_files:
    for line in gzip.open(f, 'rt'):
        d = json.loads(line)
        ring = d['geometry']['coordinates'][0]
        lon = ring[0][0]; lat = ring[0][1]
        if not (-45.995 < lat < -45.685 and -67.73 < lon < -67.32):
            continue
        try:
            pg = Polygon([proj(la, lo) for lo, la in ring])
        except Exception:
            continue
        if not pg.is_valid:
            pg = pg.buffer(0)
            if pg.geom_type != 'Polygon':
                continue
        if pg.area < 16 or pg.area > 40000:
            continue
        c = pg.centroid
        if not inside_world(c.x, c.y, 150):
            continue
        raw.append(pg)
print('  huellas leídas', len(raw))
# edificios de OSM que no están en el relevamiento de Microsoft
if osm_b:
    raw_tree = STRtree(raw)
    extra = 0
    for pg, t in osm_b:
        if any(raw[int(k)].intersects(pg) for k in raw_tree.query(pg)):
            continue
        c = pg.centroid
        if inside_world(c.x, c.y, 150):
            raw.append(pg)
            extra += 1
    print('  sumados de OSM', extra)

acc_grid = defaultdict(list)
AG = 30.0
out_b = []
dropped = defaultdict(int)
raw.sort(key=lambda g: -g.area)
for pg in raw:
    rect = pg.minimum_rotated_rectangle
    if rect.geom_type != 'Polygon':
        dropped['forma'] += 1
        continue
    rc = list(rect.exterior.coords)[:4]
    e1 = (rc[1][0] - rc[0][0], rc[1][1] - rc[0][1]); e2 = (rc[2][0] - rc[1][0], rc[2][1] - rc[1][1])
    L1, L2 = math.hypot(*e1), math.hypot(*e2)
    ang = math.atan2(e1[1], e1[0])
    c = rect.centroid
    a, b = ab(c.x, c.y)
    sA = slope_a(a)
    sB = B_SL[0] if b < B_BP[1] else B_SL[1]
    X, Z = warp(c.x, c.y)
    sc = min(0.55, math.sqrt(sA * sB)) * (K_BLD_CENTRO if centro_zone.contains(Point(X, Z)) else K_BLD)
    if h_game(X, Z) < 0.9:
        dropped['agua'] += 1
        continue
    # rectángulo en el juego (el marco del mapa solo rota y escala: el ángulo se conserva)
    w1, w2 = L1 * sc, L2 * sc
    g_rect = Polygon([(-w1 / 2, -w2 / 2), (w1 / 2, -w2 / 2), (w1 / 2, w2 / 2), (-w1 / 2, w2 / 2)])
    g_rect = sh_translate(sh_rotate(g_rect, ang, use_radians=True, origin=(0, 0)), X, Z)
    if area_tree is not None and any(open_areas[int(k)].contains(Point(X, Z)) for k in area_tree.query(Point(X, Z))):
        dropped['plaza'] += 1
        continue
    # recorte contra calles y veredas
    hits = [corr[int(k)] for k in corr_tree.query(g_rect) if corr[int(k)].intersects(g_rect)]
    if hits:
        rest = g_rect.difference(unary_union(hits))
        if rest.is_empty:
            dropped['calle'] += 1
            continue
        if rest.geom_type != 'Polygon':
            rest = max(rest.geoms, key=lambda q: q.area) if hasattr(rest, 'geoms') else rest
        if rest.area < max(10.0, g_rect.area * 0.35):
            dropped['calle'] += 1
            continue
        g_rect = rest.minimum_rotated_rectangle.buffer(-0.25, join_style=2)
        if g_rect.is_empty or g_rect.geom_type != 'Polygon':
            dropped['calle'] += 1
            continue
    # superposición con los ya aceptados (filas de casas pegadas: se achica un poco)
    ok = True
    for tries in range(4):
        cxg, czg = g_rect.centroid.x, g_rect.centroid.y
        near = []
        for gx in (int(cxg // AG) - 1, int(cxg // AG), int(cxg // AG) + 1):
            for gz in (int(czg // AG) - 1, int(czg // AG), int(czg // AG) + 1):
                near.extend(acc_grid.get((gx, gz), []))
        hits = [q for q in near if q.intersects(g_rect)]
        over = sum(g_rect.intersection(q).area for q in hits)
        if over <= g_rect.area * 0.18:
            break
        # casas pegadas (al agrandarlas se pisan): primero se recorta contra las vecinas
        if tries == 0:
            rest = g_rect.difference(unary_union(hits))
            if not rest.is_empty and rest.geom_type != 'Polygon' and hasattr(rest, 'geoms'):
                rest = max(rest.geoms, key=lambda q: q.area)
            if not rest.is_empty and rest.geom_type == 'Polygon' and rest.area >= g_rect.area * 0.4:
                r2 = rest.minimum_rotated_rectangle.buffer(-0.1, join_style=2)
                if not r2.is_empty and r2.geom_type == 'Polygon':
                    g_rect = r2
                    continue
        g_rect = sh_scale(g_rect, 0.85, 0.85, origin='centroid')
        if tries == 3:
            ok = False
    if not ok or g_rect.area < 9:
        dropped['encimado'] += 1
        continue
    # medidas finales y frente hacia la calle más cercana
    rc = list(g_rect.exterior.coords)[:4]
    e1 = (rc[1][0] - rc[0][0], rc[1][1] - rc[0][1]); e2 = (rc[2][0] - rc[1][0], rc[2][1] - rc[1][1])
    L1, L2 = math.hypot(*e1), math.hypot(*e2)
    if min(L1, L2) < 2.4:
        dropped['finito'] += 1
        continue
    u = (e1[0] / L1, e1[1] / L1)
    ctr = g_rect.centroid
    near_road = road_lines[int(road_tree.nearest(ctr))]
    pr = near_road.interpolate(near_road.project(ctr))
    nx, nz = pr.x - ctr.x, pr.y - ctr.y
    nl = math.hypot(nx, nz) or 1
    nx, nz = nx / nl, nz / nl
    # eje de ancho = el más perpendicular a la calle; el frente (-z local) mira a la calle
    if abs(nx * u[0] + nz * u[1]) > 0.7071:
        wax, waz, width, depth = -u[1], u[0], L2, L1
    else:
        wax, waz, width, depth = u[0], u[1], L1, L2
    if waz * nx - wax * nz < 0:
        wax, waz = -wax, -waz
    lv, kind = osm_info(pg)
    real_area = pg.area
    out_b.append((ctr.x, ctr.y, math.atan2(waz, wax), width, depth, lv, kind, real_area))
    for gx in range(int(g_rect.bounds[0] // AG), int(g_rect.bounds[2] // AG) + 1):
        for gz in range(int(g_rect.bounds[1] // AG), int(g_rect.bounds[3] // AG) + 1):
            acc_grid[(gx, gz)].append(g_rect)
print('  edificios en el juego', len(out_b), 'descartados', dict(dropped))

# ---------------------------------------------------------------------------
# Salida
# ---------------------------------------------------------------------------
print('escribiendo...')
blob = bytearray()
sections = {}


def add_section(name, arr):
    arr = np.ascontiguousarray(arr)
    while len(blob) % 4:
        blob.append(0)
    sections[name] = {'off': len(blob), 'n': int(arr.size), 't': arr.dtype.str.lstrip('<|')}
    blob.extend(arr.tobytes())


def q(v, s=2):
    return int(round(v * s))


# nodos (medios metros)
nodes_arr = np.array([[q(G[i][0]), q(G[i][1])] for i in used], dtype=np.int16).reshape(-1)
add_section('nodes', nodes_arr)
names = ['']
name_idx = {'': 0}
kinds = ['ruta', 'avenida', 'calle', 'tierra', 'peatonal']
way_meta = []
refs = []
for p in pieces:
    nm = p['name']
    if nm not in name_idx:
        name_idx[nm] = len(names)
        names.append(nm)
    way_meta.extend([kinds.index(p['kind']), int(round(p['width'] * 2)), name_idx[nm], len(p['ids'])])
    refs.extend(index[i] for i in p['ids'])
add_section('ways', np.array(way_meta, dtype=np.uint16))
add_section('refs', np.array(refs, dtype=np.uint16 if len(used) < 65536 else np.uint32))
# alturas en decímetros
add_section('heights', np.round(H * 10).astype(np.int16).reshape(-1))


def ring_arr(pg):
    c = list(pg.exterior.coords)[:-1]
    return [v for x, z in c for v in (q(x), q(z))]


poly_meta, poly_pts = [], []
zone_names = []
ztypes = ['centro', 'barrio', 'km', 'rada']
for zn in zones:
    r = ring_arr(zn['poly'])
    zone_names.append(zn['name'])
    poly_meta.extend([0, ztypes.index(zn['type']) * 16 + zn['level'], len(zone_names) - 1, len(r) // 2])
    poly_pts.extend(r)
akinds = ['industrial', 'comercial', 'cementerio', 'militar', 'plaza', 'cancha', 'escuela']
area_names = []
for ar in areas:
    r = ring_arr(ar['poly'])
    area_names.append(ar['name'])
    poly_meta.extend([1, akinds.index(ar['k']), len(area_names) - 1, len(r) // 2])
    poly_pts.extend(r)
add_section('polyMeta', np.array(poly_meta, dtype=np.uint16))
add_section('polyPts', np.array(poly_pts, dtype=np.int16))
pts_flat = []
for (X, Z) in wells:
    pts_flat.extend([0, q(X), q(Z)])
for (X, Z) in turbines:
    pts_flat.extend([1, q(X), q(Z)])
for (X, Z) in masts:
    pts_flat.extend([2, q(X), q(Z)])
for (X, Z) in tanks:
    pts_flat.extend([3, q(X), q(Z)])
add_section('points', np.array(pts_flat, dtype=np.int16))

# edificios: centro (medios metros), ángulo del eje de ancho, ancho y fondo (medios metros),
# pisos de OSM, tipo de OSM y superficie real (m², /4 hasta 1020)
bpos, bdim = [], []
for X, Z, angb, width, depth, lv, kind, ra in out_b:
    bpos.extend([q(X), q(Z)])
    bdim.extend([int(round(((angb % (2 * math.pi)) / (2 * math.pi)) * 255)) % 256, min(255, int(round(width * 2))), min(255, int(round(depth * 2))), lv, kind, min(255, int(round(ra / 4)))])
add_section('bldPos', np.array(bpos, dtype=np.int16))
add_section('bldDim', np.array(bdim, dtype=np.uint8))

comp_blob = zlib.compress(bytes(blob), 9)
b64 = base64.b64encode(comp_blob).decode('ascii')

meta = {
    'frame': {'ux': UX, 'uz': UZ, 'vx': VX, 'vz': VZ, 'a0': A0, 'a1': A1, 'b0': B0, 'b1': B1},
    'heights': {'cell': HC, 'na': NA, 'nb': NB, 'scale': 0.1},
    'bands': {'a': {'bp': A_BP, 'sl': A_SL}, 'b': {'bp': B_BP, 'sl': B_SL}, 'vs': VS},
    'sections': sections,
    'kinds': kinds,
    'names': names,
    'zoneTypes': ztypes,
    'zoneNames': zone_names,
    'areaKinds': akinds,
    'areaNames': area_names,
    'places': places,
    'landmarks': landmarks,
    'fuel': [[round(x, 1), round(z, 1), n] for x, z, n in fuel],
    'piers': [[[round(x, 1), round(z, 1)] for x, z in p] for p in piers],
    'runways': runways,
}

with open(OUT, 'w') as f:
    f.write('// Generado por tools/mapa/build_map.py — no editar a mano.\n')
    f.write('// Datos © colaboradores de OpenStreetMap (ODbL). Relieve: AWS Terrain Tiles (Mapzen).\n')
    f.write('export const MAP_META = ' + json.dumps(meta, ensure_ascii=False, separators=(',', ':')) + ';\n')
    f.write("export const MAP_BLOB = '" + b64 + "';\n")
print('listo:', OUT, round(os.path.getsize(OUT) / 1024), 'KB (blob', round(len(comp_blob) / 1024), 'KB comprimido de', round(len(blob) / 1024), 'KB)')
