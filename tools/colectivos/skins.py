# Arma un atlas por skin: costado izq, costado der, cola, frente (o frente bajo)
from PIL import Image, ImageDraw
import numpy as np, sys, json
from scipy import ndimage
SRC = sys.argv[1]; OUT = sys.argv[2]
D = SRC + '/'
MET = dict(L=(12,12,2828,756), R=(0,764,2812,1508), B=(0,1730,1000,2810), F=(1024,1700,1984,2824), full=True)
GR1 = dict(L=(60,40,2790,740), R=(24,740,2770,1450), B=(1850,1790,2790,2786), F=(880,2370,1810,2780), full=False)
GR2 = dict(L=(24,8,2796,736), R=(0,776,2772,1500), B=(1728,1808,2672,2764), F=(104,2492,1032,2812), full=False, backglass=(1860,1860,2540,2195))
SK = {
 'diadema18': ('MB Metalpar Tronador II OF-1519-BP 2/skins/18 new.png', MET, 'DIADEMA'),
 'diadema19': ('MB Metalpar Tronador II OF-1519-BP 2/skins/Diadema.png', MET, 'DIADEMA'),
 'diadema12': ('La Favorita GR-1 MB OF-1418/skins/19_20260825201103.png', GR1, 'DIADEMA'),
 'diadema04': ('La Favorita GR 2 OF-1621-1519 By Uriel Lescano/Textures/no funciona/04.png', GR2, 'DIADEMA'),
 'patagonia55': ('La Favorita GR 2 OF-1621-1519 By Uriel Lescano/Textures/no funciona/55.png', GR2, 'PATAGONIA ARGENTINA'),
 'patagonia92': ('La Favorita GR 2 OF-1621-1519 By Uriel Lescano/Textures/no funciona/92.png', GR2, 'PATAGONIA ARGENTINA'),
 'patagonia68': ('La Favorita GR 2 OF-1621-1519 By Uriel Lescano/Textures/no funciona/68.png', GR2, 'PATAGONIA ARGENTINA'),
}
AW, AH = 2048, 1024
SLOTS = {'L': (0, 0, 2048, 352), 'R': (0, 352, 2048, 352), 'B': (0, 704, 384, 320), 'F': (384, 704, 384, 320) }
GLASS = np.array([24, 33, 40])
def piece(im, rect, glassAll=False):
    a = np.asarray(im.crop(rect)).astype(np.float32).copy()
    dark = (a[..., 3] < 40) | (a[..., :3].max(-1) < 80)
    lab, n = ndimage.label(dark)
    h, w = dark.shape
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    out = a.copy()
    for i in range(1, n + 1):
        m = lab == i
        if i in border and not glassAll: out[m, 3] = 0
        else:
            # vidrio polarizado con un brillo suave de arriba
            ys = np.nonzero(m)[0]
            g = 1 + 0.35 * np.clip(1 - (ys - ys.min()) / max(1, ys.max() - ys.min()), 0, 1)
            out[m, 0:3] = GLASS[None, :] * g[:, None]
            out[m, 3] = 255
    return Image.fromarray(out.clip(0, 255).astype(np.uint8), 'RGBA')
meta = {}
for k, (f, lay, emp) in SK.items():
    im = Image.open(D + f).convert('RGBA')
    if 'backglass' in lay:
        dr = ImageDraw.Draw(im); x0, y0, x1, y1 = lay['backglass']; dr.rounded_rectangle((x0, y0, x1, y1), 40, fill=(0, 0, 0, 255))
    at = Image.new('RGBA', (AW, AH), (0, 0, 0, 0))
    for s, (x, y, w, h) in SLOTS.items():
        p = piece(im, lay[s])
        at.paste(p.resize((w, h), Image.LANCZOS), (x, y))
    at.save(f'{OUT}/colectivo_{k}.webp', 'WEBP', quality=80, method=6)
    meta[k] = {'empresa': emp, 'frente': 'entero' if lay['full'] else 'bajo'}
print(meta)
