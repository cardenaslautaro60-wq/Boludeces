// Texturas fotográficas (CC0, Poly Haven) de la versión realista.
// Las genera tools/realista/texturas.py; acá se embeben como data URL.
import * as THREE from 'three';
import { STYLE } from '../style.js';
import { RealPost, RealSky, setupRealRenderer } from '../realista.js';
import { realTextures, worldUV, tintMask, terrainMaterial, waterMaterial, GROUND_SCALE } from './materials.js';
import asfalto_c from './asfalto_c.webp';
import asfalto_n from './asfalto_n.webp';
import asfalto_m from './asfalto_m.webp';
import ripio_c from './ripio_c.webp';
import ripio_n from './ripio_n.webp';
import ripio_m from './ripio_m.webp';
import vereda_c from './vereda_c.webp';
import vereda_n from './vereda_n.webp';
import vereda_m from './vereda_m.webp';
import estepa_c from './estepa_c.webp';
import estepa_n from './estepa_n.webp';
import estepa_m from './estepa_m.webp';
import tierra_c from './tierra_c.webp';
import tierra_n from './tierra_n.webp';
import tierra_m from './tierra_m.webp';
import roca_c from './roca_c.webp';
import roca_n from './roca_n.webp';
import roca_m from './roca_m.webp';
import arena_c from './arena_c.webp';
import arena_n from './arena_n.webp';
import arena_m from './arena_m.webp';
import arenah_c from './arenah_c.webp';
import arenah_n from './arenah_n.webp';
import arenah_m from './arenah_m.webp';
import pasto_c from './pasto_c.webp';
import pasto_n from './pasto_n.webp';
import pasto_m from './pasto_m.webp';
import cancha_c from './cancha_c.webp';
import cancha_n from './cancha_n.webp';
import cancha_m from './cancha_m.webp';
import revoque_c from './revoque_c.webp';
import revoque_n from './revoque_n.webp';
import revoque_m from './revoque_m.webp';
import revoque2_c from './revoque2_c.webp';
import revoque2_n from './revoque2_n.webp';
import revoque2_m from './revoque2_m.webp';
import ladrillo_c from './ladrillo_c.webp';
import ladrillo_n from './ladrillo_n.webp';
import ladrillo_m from './ladrillo_m.webp';
import hormigon_c from './hormigon_c.webp';
import hormigon_n from './hormigon_n.webp';
import hormigon_m from './hormigon_m.webp';
import chapa_c from './chapa_c.webp';
import chapa_n from './chapa_n.webp';
import chapa_m from './chapa_m.webp';
import chapavieja_c from './chapavieja_c.webp';
import chapavieja_n from './chapavieja_n.webp';
import chapavieja_m from './chapavieja_m.webp';
import tejas_c from './tejas_c.webp';
import tejas_n from './tejas_n.webp';
import tejas_m from './tejas_m.webp';
import metal_c from './metal_c.webp';
import metal_n from './metal_n.webp';
import metal_m from './metal_m.webp';
import madera_c from './madera_c.webp';
import madera_n from './madera_n.webp';
import madera_m from './madera_m.webp';

const SRC = {
  asfalto: [asfalto_c, asfalto_n, asfalto_m],
  ripio: [ripio_c, ripio_n, ripio_m],
  vereda: [vereda_c, vereda_n, vereda_m],
  estepa: [estepa_c, estepa_n, estepa_m],
  tierra: [tierra_c, tierra_n, tierra_m],
  roca: [roca_c, roca_n, roca_m],
  arena: [arena_c, arena_n, arena_m],
  arenah: [arenah_c, arenah_n, arenah_m],
  pasto: [pasto_c, pasto_n, pasto_m],
  cancha: [cancha_c, cancha_n, cancha_m],
  revoque: [revoque_c, revoque_n, revoque_m],
  revoque2: [revoque2_c, revoque2_n, revoque2_m],
  ladrillo: [ladrillo_c, ladrillo_n, ladrillo_m],
  hormigon: [hormigon_c, hormigon_n, hormigon_m],
  chapa: [chapa_c, chapa_n, chapa_m],
  chapavieja: [chapavieja_c, chapavieja_n, chapavieja_m],
  tejas: [tejas_c, tejas_n, tejas_m],
  metal: [metal_c, metal_n, metal_m],
  madera: [madera_c, madera_n, madera_m],
};

function image(src) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error('textura'));
    im.src = src;
  });
}

// Carga todas las texturas (una sola vez) y las deja en STYLE.tex
async function loadRealTextures(renderer) {
  if (STYLE.loaded) return STYLE.tex;
  const aniso = renderer ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;
  const mk = (im, color) => {
    const t = new THREE.Texture(im);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = aniso;
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  };
  await Promise.all(Object.entries(SRC).map(async ([k, [c, n, m]]) => {
    const [ic, inn, im] = await Promise.all([image(c), image(n), image(m)]);
    STYLE.tex[k] = { map: mk(ic, true), normalMap: mk(inn, false), arm: mk(im, false), img: ic, nimg: inn, mimg: im };
  }));
  STYLE.loaded = true;
  return STYLE.tex;
}

STYLE.realista = true;
STYLE.load = loadRealTextures;
STYLE.RealPost = RealPost;
STYLE.RealSky = RealSky;
STYLE.setupRenderer = setupRealRenderer;
STYLE.realTextures = realTextures;
STYLE.worldUV = worldUV;
STYLE.tintMask = tintMask;
STYLE.terrainMaterial = terrainMaterial;
STYLE.waterMaterial = waterMaterial;
STYLE.GROUND_SCALE = GROUND_SCALE;
