#!/usr/bin/env python3
"""Baja texturas fotográficas CC0 de Poly Haven para la versión realista y las deja
listas para embeber en el juego (src/render/real/*.webp).

Por cada material: color (512 px), normal (512 px, OpenGL) y ARM (256 px:
R = oclusión, G = rugosidad, B = metal, el formato que usa Three.js).
Los materiales marcados 'tint' se pasan a gris con brillo parejo para poder teñirlos
(paredes y chapas de colores).

Uso: python3 tools/realista/texturas.py [carpeta_cache]
Licencia de las texturas: CC0 (https://polyhaven.com/license).
"""
import io, json, os, sys, urllib.request
from PIL import Image, ImageOps, ImageStat

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'render', 'real')
CACHE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), 'cache')

MATS = {
    'asfalto': ('asphalt_02', {}),
    'ripio': ('gravel_road', {}),
    'vereda': ('concrete_pavement_02', {}),
    'estepa': ('withered_grass', {}),
    'tierra': ('dry_ground_rocks', {}),
    'roca': ('aerial_ground_rock', {}),
    'arena': ('coast_sand_01', {}),
    'arenah': ('damp_beach_sand', {}),
    'pasto': ('leafy_grass', {}),
    'cancha': ('park_dirt', {}),
    'revoque': ('white_plaster_rough_01', {'tint': True}),
    'revoque2': ('painted_plaster_wall', {'tint': True}),
    'ladrillo': ('brick_wall_02', {}),
    'hormigon': ('concrete_wall_004', {}),
    'chapa': ('corrugated_iron', {'tint': True}),
    'chapavieja': ('rusty_corrugated_iron', {}),
    'tejas': ('clay_roof_tiles', {}),
    'metal': ('rusty_metal_sheet', {}),
    'madera': ('wood_planks_grey', {}),
}


def get(url):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, url.split('/')[-1])
    if not os.path.exists(path):
        req = urllib.request.Request(url, headers={'User-Agent': 'gta-san-jorge'})
        with urllib.request.urlopen(req, timeout=60) as r, open(path, 'wb') as f:
            f.write(r.read())
    return Image.open(path)


def main():
    os.makedirs(OUT, exist_ok=True)
    total = 0
    for key, (asset, opt) in MATS.items():
        files = json.load(urllib.request.urlopen(urllib.request.Request(f'https://api.polyhaven.com/files/{asset}', headers={'User-Agent': 'gta-san-jorge'}), timeout=60))
        diff = get(files['Diffuse']['1k']['jpg']['url']).convert('RGB').resize((512, 512), Image.LANCZOS)
        if opt.get('tint'):
            g = ImageOps.grayscale(diff)
            mean = ImageStat.Stat(g).mean[0]
            g = g.point(lambda v: max(0, min(255, int(v * 200 / max(mean, 1)))))
            diff = Image.merge('RGB', (g, g, g))
        nor = get(files['nor_gl']['1k']['jpg']['url']).convert('RGB').resize((512, 512), Image.LANCZOS)
        arm = get(files['arm']['1k']['jpg']['url']).convert('RGB').resize((256, 256), Image.LANCZOS)
        for suf, im, q in (('c', diff, 80), ('n', nor, 88), ('m', arm, 80)):
            p = os.path.join(OUT, f'{key}_{suf}.webp')
            im.save(p, 'WEBP', quality=q, method=6)
            total += os.path.getsize(p)
        print(key, asset)
    print('total', round(total / 1024), 'KB')


if __name__ == '__main__':
    main()
