// Estilo visual del juego. La versión realista (src/main-realista.js) lo activa antes de
// arrancar y deja cargadas las texturas fotográficas en STYLE.tex.
export const STYLE = {
  realista: false,
  // { clave: { map, normalMap, arm } } una vez cargadas
  tex: {},
  load: null,
};

import * as THREE from 'three';

// Material "mate" del juego: Lambert en la versión PS2, PBR (Standard) en la realista.
// pbr: rugosidad, metal y mapas extra que solo usa la versión realista.
export function lam(opts = {}, pbr = {}) {
  if (!STYLE.realista) return new THREE.MeshLambertMaterial(opts);
  return new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, ...opts, ...pbr });
}
