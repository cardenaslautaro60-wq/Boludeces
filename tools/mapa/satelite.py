#!/usr/bin/env python3
"""Colores del suelo desde la imagen satelital: Sentinel-2 cloudless 2016 de EOX (CC BY 4.0).

Toma los tiles z13 que baja descargar.sh (carpeta sat/), los reproyecta al marco del juego
(deshaciendo la deformación de build_map.py, que queda guardada en MAP_META) y guarda una imagen
chica en src/world/comodoro-sat.js: un píxel cada 20 m del juego, con el tono ajustado para que el
promedio de la estepa coincida con la paleta del juego. El terreno y el mapa la usan para teñir el
suelo (manchas de mata, salitrales, picadas y locaciones petroleras reales).

Uso: python3 tools/mapa/satelite.py [carpeta_cache] [comodoro-data.js] [salida.js]
"""
import base64
import io
import json
import math
import os
import re
import sys
import zlib

import numpy as np
from PIL import Image

HERE = os.path.dirname(__file__)
CACHE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'cache')
DATA = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, '..', '..', 'src', 'world', 'comodoro-data.js')
OUT = sys.argv[3] if len(sys.argv) > 3 else os.path.join(HERE, '..', '..', 'src', 'world', 'comodoro-sat.js')

CELL = 20.0      # metros del juego por píxel
MARGIN = 700.0   # igual que el terreno (terrain.js): la malla sigue más allá del borde
Z = 13
TARGET = np.array([0.63, 0.57, 0.40])  # color medio de la estepa en el juego (sRGB)

# Mismos parámetros de proyección que build_map.py
LAT0, LON0 = -45.8632, -67.4753
KX = 111320 * math.cos(math.radians(LAT0))
KY = 110540

src = open(DATA).read()
meta = json.loads(re.search(r'export const MAP_META = (\{.*\});\n', src).group(1))
blob = zlib.decompress(base64.b64decode(re.search(r"export const MAP_BLOB = '([^']*)'", src).group(1)))
F = meta['frame']
UX, UZ, VX, VZ = F['ux'], F['uz'], F['vx'], F['vz']


def inv_band(bp, sl):
    """Inversa de la deformación por tramos (F(0) = 0), extendida con pendiente 1 afuera."""
    f = [0.0]
    for i, s in enumerate(sl):
        f.append(f[-1] + (bp[i + 1] - bp[i]) * s)
    i = int(np.searchsorted(bp, 0)) - 1
    f = np.array(f) - (f[i] + (0 - bp[i]) * sl[i])
    bp = np.array(bp, dtype=float)

    def g(v):
        r = np.interp(v, f, bp)
        r = np.where(v < f[0], bp[0] + (v - f[0]), r)
        return np.where(v > f[-1], bp[-1] + (v - f[-1]), r)
    return g


Ainv = inv_band(meta['bands']['a']['bp'], meta['bands']['a']['sl'])
Binv = inv_band(meta['bands']['b']['bp'], meta['bands']['b']['sl'])

a0, b0 = F['a0'] - MARGIN, F['b0'] - MARGIN
W = int(math.ceil((F['a1'] - F['a0'] + 2 * MARGIN) / CELL)) + 1
Hh = int(math.ceil((F['b1'] - F['b0'] + 2 * MARGIN) / CELL)) + 1
A = a0 + np.arange(W) * CELL
B = b0 + np.arange(Hh) * CELL
ra, rb = np.meshgrid(Ainv(A), Binv(B))
x = ra * UX + rb * VX
z = ra * UZ + rb * VZ
lat = LAT0 - z / KY
lon = LON0 + x / KX
n = 2 ** Z * 256
px = (lon + 180) / 360 * n
py = (1 - np.log(np.tan(np.radians(lat)) + 1 / np.cos(np.radians(lat))) / math.pi) / 2 * n

# mosaico con los tiles bajados
tx0, ty0 = int(px.min() // 256), int(py.min() // 256)
tx1, ty1 = int(px.max() // 256), int(py.max() // 256)
mos = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256, 3), dtype=np.float32)
falta = []
for tx in range(tx0, tx1 + 1):
    for ty in range(ty0, ty1 + 1):
        f = os.path.join(CACHE, 'sat', f'{tx}_{ty}.jpg')
        if not os.path.exists(f):
            falta.append(f)
            continue
        mos[(ty - ty0) * 256:(ty - ty0 + 1) * 256, (tx - tx0) * 256:(tx - tx0 + 1) * 256] = np.asarray(Image.open(f).convert('RGB'), dtype=np.float32)
if falta:
    sys.exit('faltan tiles satelitales (correr descargar.sh):\n' + '\n'.join(falta[:5]))

# el píxel del juego (20 m) cubre ~1,5 píxeles de la imagen: suavizar un poco y muestrear bilineal
img = Image.fromarray(mos.astype(np.uint8))
from PIL import ImageFilter  # noqa: E402
mos = np.asarray(img.filter(ImageFilter.GaussianBlur(0.8)), dtype=np.float32) / 255.0
fx = px - tx0 * 256 - 0.5
fy = py - ty0 * 256 - 0.5
ix = np.clip(np.floor(fx).astype(int), 0, mos.shape[1] - 2)
iy = np.clip(np.floor(fy).astype(int), 0, mos.shape[0] - 2)
u = np.clip(fx - ix, 0, 1)[..., None]
v = np.clip(fy - iy, 0, 1)[..., None]
col = (mos[iy, ix] * (1 - u) * (1 - v) + mos[iy, ix + 1] * u * (1 - v) + mos[iy + 1, ix] * (1 - u) * v + mos[iy + 1, ix + 1] * u * v)

# tono: la estepa (tierra, fuera de la ciudad) promedia el color del juego
hs = meta['sections']['heights']
hgt = np.frombuffer(blob, dtype=np.int16, count=hs['n'], offset=hs['off']).reshape(meta['heights']['nb'], meta['heights']['na']) * 0.1
hc = meta['heights']['cell']
gi = np.clip(np.round((A - F['a0']) / hc).astype(int), 0, hgt.shape[1] - 1)
gj = np.clip(np.round((B - F['b0']) / hc).astype(int), 0, hgt.shape[0] - 1)
land = hgt[np.ix_(gj, gi)] > 3
lum = col.mean(axis=2)
ref = land & (lum < np.percentile(lum[land], 90))   # sin la ciudad ni los salitrales
# menos saturación y contraste que la foto (el juego tiene su propia luz), y sin verdes fuertes:
# la laguna de Rada Tilly o las chacras no son pasto
lum = col.mean(axis=2, keepdims=True)
mlum = lum[ref].mean()
col = lum + (col - lum) * 0.6
col = col - lum + (mlum + (lum - mlum) * 0.8)
col[..., 1] = np.minimum(col[..., 1], col[..., 0] * 1.01)
mean = col[ref].mean(axis=0)
gain = TARGET / mean
col = np.clip(col * gain, 0, 1)
print('marco', W, 'x', Hh, 'px; media estepa', np.round(mean, 3), 'ganancia', np.round(gain, 2))

im = Image.fromarray((col * 255 + 0.5).astype(np.uint8))
buf = io.BytesIO()
im.save(buf, 'JPEG', quality=80, optimize=True, progressive=False)
jpg = buf.getvalue()
if os.environ.get('PREVIEW'):
    im.save(os.environ['PREVIEW'])
with open(OUT, 'w') as f:
    f.write('// Generado por tools/mapa/satelite.py — no editar a mano.\n')
    f.write('// Imagen: Sentinel-2 cloudless - https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016 & 2017), CC BY 4.0.\n')
    f.write('export const SAT_META = ' + json.dumps({'a0': a0, 'b0': b0, 'cell': CELL, 'w': W, 'h': Hh}) + ';\n')
    f.write("export const SAT_JPG = '" + base64.b64encode(jpg).decode('ascii') + "';\n")
print('listo:', OUT, round(len(jpg) / 1024), 'KB')
