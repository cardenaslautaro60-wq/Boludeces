#!/usr/bin/env python3
"""Convierte el cuerpo humano CC0 de Quaternius (Universal Base Characters) a un formato
compacto para la versión realista, ya re-enganchado a los 17 huesos del juego.

Salida (src/render/real/):
  humano.bin   geometrías empaquetadas (cuerpo, ojos, cejas, pelos, barba)
  humano.json  índice: offsets, cantidades, articulaciones en la pose de enlace
  piel_c.webp / piel_n.webp / piel_r.webp, ojo_c.webp, pelo_c.webp / pelo_n.webp

Por vértice guarda: posición, normal, UV, 4 huesos del juego + pesos (bytes), la zona del
cuerpo (para vestirlo: torso, brazo, pierna, pie...) y cuánto avanzó a lo largo del hueso.

Uso: python3 tools/realista/personajes.py Universal_Base_Characters.zip
Licencia de los modelos: CC0 (Quaternius, https://quaternius.com).
"""
import io, json, os, struct, sys, zipfile
import numpy as np
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'render', 'real')
ZIP = sys.argv[1]
z = zipfile.ZipFile(ZIP)
ROOT = 'Universal Base Characters[Standard]/'
BODY = ROOT + 'Base Characters/Godot - UE/Superhero_Male_FullBody'
HAIR = ROOT + 'Hairstyles/Origin at 0/glTF (Godot)/'

# huesos del juego (mismo orden que makeSkeleton en humanoid.js)
OURS = ['root', 'hips', 'spine', 'neck', 'head', 'shL', 'elL', 'haL', 'shR', 'elR', 'haR', 'thL', 'knL', 'ftL', 'thR', 'knR', 'ftR']
OI = {n: i for i, n in enumerate(OURS)}

CT = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
NC = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}


def load(prefix):
    g = json.loads(z.read(prefix + '.gltf'))
    buf = z.read(prefix + '.bin')

    def acc(i):
        a = g['accessors'][i]
        bv = g['bufferViews'][a['bufferView']]
        dt = CT[a['componentType']]
        n = NC[a['type']]
        off = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
        stride = bv.get('byteStride', 0)
        item = np.dtype(dt).itemsize * n
        if stride and stride != item:
            raw = np.frombuffer(buf, dtype=np.uint8, count=stride * a['count'], offset=off).reshape(a['count'], stride)[:, :item]
            arr = np.frombuffer(raw.tobytes(), dtype=dt).reshape(a['count'], n)
        else:
            arr = np.frombuffer(buf, dtype=dt, count=a['count'] * n, offset=off).reshape(a['count'], n)
        if a.get('normalized') and dt != np.float32:
            arr = arr.astype(np.float32) / np.iinfo(dt).max
        return arr
    return g, acc


g, acc = load(BODY)
skin = g['skins'][0]
jn = [g['nodes'][j]['name'] for j in skin['joints']]
ibm = acc(skin['inverseBindMatrices']).reshape(-1, 4, 4).transpose(0, 2, 1)  # glTF: column-major
jw = np.linalg.inv(ibm)
jpos = {jn[i]: jw[i][:3, 3] for i in range(len(jn))}
left_is_plus_x = jpos['upperarm_l'][0] > 0
L, R = ('L', 'R') if left_is_plus_x else ('R', 'L')


def our_bone(name):
    s = L if name.endswith('_l') else R
    if name in ('root',):
        return [('root', 1)]
    if name == 'pelvis':
        return [('hips', 1)]
    if name == 'spine_01':
        return [('hips', 0.5), ('spine', 0.5)]
    if name in ('spine_02', 'spine_03') or name.startswith('clavicle'):
        return [('spine', 1)]
    if name == 'neck_01':
        return [('neck', 1)]
    if name == 'Head':
        return [('head', 1)]
    if name.startswith('upperarm'):
        return [('sh' + s, 1)]
    if name.startswith('lowerarm'):
        return [('el' + s, 1)]
    if name.startswith(('hand', 'index', 'middle', 'pinky', 'ring', 'thumb')):
        return [('ha' + s, 1)]
    if name.startswith('thigh'):
        return [('th' + s, 1)]
    if name.startswith('calf'):
        return [('kn' + s, 1)]
    if name.startswith(('foot', 'ball')):
        return [('ft' + s, 1)]
    raise ValueError(name)


# zonas del cuerpo para vestir
ZONE = {'head': 0, 'neck': 1, 'torso': 2, 'upperarm': 3, 'lowerarm': 4, 'hand': 5, 'thigh': 6, 'calf': 7, 'foot': 8}


def zone_of(name):
    if name == 'Head':
        return 'head'
    if name == 'neck_01':
        return 'neck'
    if name.startswith(('pelvis', 'spine', 'clavicle', 'root')):
        return 'torso'
    if name.startswith('upperarm'):
        return 'upperarm'
    if name.startswith('lowerarm'):
        return 'lowerarm'
    if name.startswith(('hand', 'index', 'middle', 'pinky', 'ring', 'thumb')):
        return 'hand'
    if name.startswith('thigh'):
        return 'thigh'
    if name.startswith('calf'):
        return 'calf'
    return 'foot'


SEG = {  # a lo largo de qué segmento se mide el avance (0 = inicio del hueso, 1 = fin)
    'upperarm': ('upperarm', 'lowerarm'), 'lowerarm': ('lowerarm', 'hand'),
    'thigh': ('thigh', 'calf'), 'calf': ('calf', 'foot'),
}

chunks = []   # bytes
index = {}
off = 0


def push(name, arr):
    global off
    b = np.ascontiguousarray(arr).tobytes()
    pad = (-len(b)) % 4
    chunks.append(b + b'\0' * pad)
    index[name] = [off, len(b)]
    off += len(b) + pad


def skinned(mesh_name, key, with_zone):
    m = next(mm for mm in g['meshes'] if mm['name'] == mesh_name)
    p = m['primitives'][0]
    A = p['attributes']
    pos = acc(A['POSITION']).astype(np.float32)
    nrm = acc(A['NORMAL']).astype(np.float32)
    uv = acc(A['TEXCOORD_0']).astype(np.float32)
    J = acc(A['JOINTS_0']).astype(np.int32)
    W = acc(A['WEIGHTS_0']).astype(np.float32)
    idx = acc(p['indices']).reshape(-1).astype(np.uint16)
    n = len(pos)
    ob = np.zeros((n, 4), np.uint8)
    ow = np.zeros((n, 4), np.uint8)
    zone = np.zeros(n, np.uint8)
    along = np.zeros(n, np.uint8)
    for i in range(n):
        acc_w = {}
        best, bw = None, -1
        for k in range(4):
            w = W[i, k]
            if w <= 0:
                continue
            name = jn[J[i, k]]
            if w > bw:
                bw, best = w, name
            for ob_name, f in our_bone(name):
                acc_w[ob_name] = acc_w.get(ob_name, 0) + w * f
        items = sorted(acc_w.items(), key=lambda t: -t[1])[:4]
        tot = sum(w for _, w in items) or 1
        q = [int(round(w / tot * 255)) for _, w in items]
        q[0] += 255 - sum(q)
        for k, (nm, _) in enumerate(items):
            ob[i, k] = OI[nm]
            ow[i, k] = q[k]
        if with_zone:
            zn = zone_of(best)
            zone[i] = ZONE[zn]
            if zn in SEG:
                a, b = SEG[zn]
                side = best[-2:]
                pa, pb = jpos[a + side], jpos[b + side]
                d = pb - pa
                t = np.dot(pos[i] - pa, d) / max(1e-6, np.dot(d, d))
                along[i] = int(np.clip(t, 0, 1) * 255)
    push(key + '.pos', pos)
    push(key + '.nrm', np.clip(nrm * 127, -127, 127).astype(np.int8))
    push(key + '.uv', uv)
    push(key + '.bi', ob)
    push(key + '.bw', ow)
    push(key + '.idx', idx)
    if with_zone:
        push(key + '.zone', zone)
        push(key + '.along', along)
    return {'count': n, 'tris': len(idx) // 3}


def rigid(prefix, key):
    """Pelo / barba: 100 % a la cabeza"""
    g2, acc2 = load(prefix)
    p = g2['meshes'][0]['primitives'][0]
    A = p['attributes']
    pos = acc2(A['POSITION']).astype(np.float32)
    nrm = acc2(A['NORMAL']).astype(np.float32)
    uv = acc2(A['TEXCOORD_0']).astype(np.float32)
    idx = acc2(p['indices']).reshape(-1).astype(np.uint16)
    push(key + '.pos', pos)
    push(key + '.nrm', np.clip(nrm * 127, -127, 127).astype(np.int8))
    push(key + '.uv', uv)
    push(key + '.idx', idx)
    return {'count': len(pos), 'tris': len(idx) // 3}


meta = {'meshes': {}}
meta['meshes']['body'] = skinned('Sphere.005_Retopology.004', 'body', True)
meta['meshes']['eyes'] = skinned('Face.001', 'eyes', False)
meta['meshes']['brows'] = skinned('Face', 'brows', False)
for key, fn in [('buzzed', 'Hair_Buzzed'), ('parted', 'Hair_SimpleParted'), ('long', 'Hair_Long'), ('beard', 'Hair_Beard')]:
    meta['meshes'][key] = rigid(HAIR + fn, key)
names = {'hips': 'pelvis', 'spine': 'spine_02', 'neck': 'neck_01', 'head': 'Head',
         'shL': 'upperarm_l', 'elL': 'lowerarm_l', 'haL': 'hand_l', 'thL': 'thigh_l', 'knL': 'calf_l', 'ftL': 'foot_l',
         'shR': 'upperarm_r', 'elR': 'lowerarm_r', 'haR': 'hand_r', 'thR': 'thigh_r', 'knR': 'calf_r', 'ftR': 'foot_r'}
if not left_is_plus_x:
    names = {k: (v.replace('_l', '_X').replace('_r', '_l').replace('_X', '_r') if v.endswith(('_l', '_r')) else v) for k, v in names.items()}
meta['joints'] = {k: [round(float(c), 5) for c in jpos[v]] for k, v in names.items()}
meta['joints']['ballL'] = [round(float(c), 5) for c in jpos['ball_l' if left_is_plus_x else 'ball_r']]
meta['zones'] = ZONE
meta['index'] = index
meta['height'] = float(max(p[1] for p in [jpos['Head']]))

os.makedirs(OUT, exist_ok=True)
open(os.path.join(OUT, 'humano.bin'), 'wb').write(b''.join(chunks))
json.dump(meta, open(os.path.join(OUT, 'humano.json'), 'w'), separators=(',', ':'))

# texturas
T = ROOT + 'Base Characters/Textures/'


def tex(src, dst, size, q, mode='RGB'):
    im = Image.open(io.BytesIO(z.read(src))).convert(mode).resize((size, size), Image.LANCZOS)
    im.save(os.path.join(OUT, dst), 'WEBP', quality=q, method=6)
    return os.path.getsize(os.path.join(OUT, dst))


tot = os.path.getsize(os.path.join(OUT, 'humano.bin'))
tot += tex(T + 'T_Superhero_Male_Ligh.png', 'piel_c.webp', 1024, 84)
tot += tex(T + 'Normals Unity - Godot/T_Superhero_Male_Normal.png', 'piel_n.webp', 1024, 88)
tot += tex(T + 'T_Superhero_Male_Roughness.png', 'piel_r.webp', 512, 80)
tot += tex(T + 'T_Eye_Brown.png', 'ojo_c.webp', 256, 85)
tot += tex(HAIR + 'T_Hair_1_BaseColor.png', 'pelo_c.webp', 512, 82)
tot += tex(HAIR + 'T_Hair_1_Normal.png', 'pelo_n.webp', 512, 85)
print('mallas', {k: v for k, v in meta['meshes'].items()})
print('total', round(tot / 1024), 'KB')
