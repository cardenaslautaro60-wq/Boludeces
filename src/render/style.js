// Estilo visual del juego. La versión realista (src/main-realista.js) lo activa antes de
// arrancar y deja cargadas las texturas fotográficas en STYLE.tex.
//  - luz: cielo físico, sol con exposición de cámara, reflejos y postproceso (realista y compacta)
//  - realista: además, texturas fotográficas, gente con cuerpo real y follaje detallado
export const STYLE = {
  realista: false,
  luz: false,
  // nombre de la versión (separa las opciones guardadas de cada una)
  variante: 'ps2',
  // { clave: { map, normalMap, arm } } una vez cargadas
  tex: {},
  load: null,
};

import * as THREE from 'three';

// Material "mate" del juego: Lambert en la versión PS2, PBR (Standard) con la luz realista.
// pbr: rugosidad, metal y mapas extra que solo usa la versión realista.
export function lam(opts = {}, pbr = {}) {
  if (!STYLE.luz) return new THREE.MeshLambertMaterial(opts);
  return new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, ...opts, ...pbr });
}
