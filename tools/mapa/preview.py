#!/usr/bin/env python3
"""Dibuja una vista previa (PNG) del mapa generado: relieve, costa, calles, barrios e hitos.
Uso: python3 tools/mapa/preview.py src/world/comodoro-data.js salida.png [escala_px_por_m]
"""
import base64
import json
import sys
import zlib

import numpy as np
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
S = float(sys.argv[3]) if len(sys.argv) > 3 else 0.12
txt = open(src).read()
meta = json.loads(txt.split('export const MAP_META = ', 1)[1].split(';\nexport const MAP_BLOB', 1)[0])
blob = zlib.decompress(base64.b64decode(txt.split("MAP_BLOB = '", 1)[1].split("'", 1)[0]))


def sec(name):
    s = meta['sections'][name]
    return np.frombuffer(blob, dtype=np.dtype(s['t']), count=s['n'], offset=s['off'])


F = meta['frame']
hm = meta['heights']
H = sec('heights').astype(np.float32).reshape(hm['nb'], hm['na']) * hm['scale']
ux, uz, vx, vz = F['ux'], F['uz'], F['vx'], F['vz']
# bbox del mundo
cs = [(a * ux + b * vx, a * uz + b * vz) for a in (F['a0'], F['a1']) for b in (F['b0'], F['b1'])]
x0, x1 = min(c[0] for c in cs), max(c[0] for c in cs)
z0, z1 = min(c[1] for c in cs), max(c[1] for c in cs)
W, Hh = int((x1 - x0) * S), int((z1 - z0) * S)
img = np.zeros((Hh, W, 3), dtype=np.uint8)
img[:] = (30, 60, 90)
jj, ii = np.mgrid[0:Hh, 0:W]
X = x0 + ii / S
Z = z0 + jj / S
A = X * ux + Z * uz
B = X * vx + Z * vz
fi = (A - F['a0']) / hm['cell']
fj = (B - F['b0']) / hm['cell']
ok = (fi >= 0) & (fj >= 0) & (fi < hm['na'] - 1) & (fj < hm['nb'] - 1)
h = np.zeros_like(X)
h[ok] = H[fj[ok].astype(int), fi[ok].astype(int)]
land = ok & (h > 0)
sea = ok & (h <= 0)
t = np.clip(h / 200, 0, 1)
img[land] = np.stack([200 - t * 90, 185 - t * 80, 150 - t * 70], -1)[land].astype(np.uint8)
img[sea] = np.stack([60 + h * 2, 110 + h * 3, 150 + h * 2], -1)[sea].clip(0, 255).astype(np.uint8)
im = Image.fromarray(img)
d = ImageDraw.Draw(im)
P = lambda x, z: ((x - x0) * S, (z - z0) * S)
# polígonos
pm = sec('polyMeta').reshape(-1, 4)
pp = sec('polyPts')
k = 0
for kind, typ, ni, n in pm:
    pts = [P(pp[k + 2 * m] / 2, pp[k + 2 * m + 1] / 2) for m in range(n)]
    k += 2 * n
    if kind == 0:
        d.polygon(pts, outline=(120, 60, 140))
    else:
        col = {0: (150, 120, 160), 1: (220, 150, 120), 4: (80, 150, 60), 5: (60, 170, 60), 6: (200, 200, 120)}.get(int(typ), (120, 120, 120))
        d.polygon(pts, fill=col)
nodes = sec('nodes').reshape(-1, 2).astype(np.float32) / 2
ways = sec('ways').reshape(-1, 4)
refs = sec('refs')
cols = {0: (200, 30, 30), 1: (230, 140, 20), 2: (90, 90, 90), 3: (150, 110, 70), 4: (200, 200, 200)}
k = 0
for kind, w2, ni, n in ways:
    ids = refs[k:k + n]
    k += n
    pts = [P(*nodes[i]) for i in ids]
    d.line(pts, fill=cols[int(kind)], width=max(1, int(w2 / 2 * S * 0.8)))
f = ImageFont.load_default()
for pl in meta['places']:
    x, z = P(pl['x'], pl['z'])
    d.text((x, z), pl['name'], fill=(60, 0, 80), font=f)
for lm in meta['landmarks']:
    x, z = P(lm['x'], lm['z'])
    d.rectangle((x - 3, z - 3, x + 3, z + 3), fill=(0, 0, 200))
    d.text((x + 4, z - 4), lm['k'], fill=(0, 0, 160), font=f)
pts = sec('points').reshape(-1, 3)
for kind, px, pz in pts:
    x, z = P(px / 2, pz / 2)
    c = [(0, 0, 0), (255, 255, 255), (255, 0, 255), (0, 255, 255)][int(kind)]
    d.point((x, z), fill=c)
im.save(out)
print(W, Hh)
