'use strict';
// Personas 3D de bajo polígono: el pescador y los vecinos de la isla. Cada parte es una malla que rota (sin esqueleto).

const piel = { claro: '#f1b98f', medio: '#d9a67e', moreno: '#b9825a' };

function crearPersona(o = {}) {
  const mat = (clon) => { const m = MAT.vc.clone(); return m; };
  const mk = (geo, parent, x = 0, y = 0, z = 0, m = null) => {
    const me = new THREE.Mesh(geo, m || MAT.vc);
    me.position.set(x, y, z);
    me.castShadow = true;
    parent.add(me);
    return me;
  };
  const rig = { grupo: new THREE.Group(), mats: [] };
  const g = rig.grupo;
  const mt = o.propio ? mat() : MAT.vc;
  if (o.propio) rig.mats.push(mt);
  const camisa = o.camisa || '#ff8a65', pant = o.pantalon || '#35588a', pl = o.piel || piel.claro;
  // piernas (pivote en la cadera)
  const pierna = (sx) => {
    const p = new THREE.Group();
    p.position.set(sx * 0.12, 0.92, 0);
    mk(unir([cil(0.085, 0.075, 0.82, pant, 0, -0.41, 0, 7), caja(0.17, 0.09, 0.3, '#6b4a2b', 0, -0.84, 0.05)]), p, 0, 0, 0, mt);
    g.add(p);
    return p;
  };
  rig.piernaI = pierna(-1); rig.piernaD = pierna(1);
  // torso
  const tor = [caja(0.44, 0.56, 0.26, camisa, 0, 0, 0), caja(0.4, 0.14, 0.24, pant, 0, -0.34, 0)];
  if (o.flores !== false) for (const [x, y, z] of [[-0.1, 0.12, 0.14], [0.12, 0.2, 0.14], [0.1, -0.05, 0.14], [-0.08, -0.12, 0.14], [0.16, 0.06, -0.14], [-0.1, 0.1, -0.14]]) tor.push(esf(0.045, '#ffffff', x, y, z, 1, 1, 0.5, 0));
  if (o.delantal) tor.push(caja(0.34, 0.5, 0.05, o.delantal, 0, -0.1, 0.15));
  if (o.chaleco) { tor.push(caja(0.11, 0.56, 0.28, o.chaleco, -0.17, 0, 0), caja(0.11, 0.56, 0.28, o.chaleco, 0.17, 0, 0)); }
  rig.torso = mk(unir(tor), g, 0, 1.28, 0, mt);
  // brazos
  const brazo = (sx) => {
    const b = new THREE.Group();
    b.position.set(sx * 0.29, 1.5, 0);
    mk(unir([cil(0.065, 0.06, 0.5, camisa, 0, -0.25, 0, 6), cil(0.06, 0.055, 0.2, pl, 0, -0.55, 0, 6), esf(0.07, pl, 0, -0.67, 0, 1, 1, 1, 0)]), b, 0, 0, 0, mt);
    g.add(b);
    return b;
  };
  rig.brazoI = brazo(-1); rig.brazoD = brazo(1);
  rig.mano = new THREE.Object3D();
  rig.mano.position.set(0, -0.67, 0.02);
  rig.brazoD.add(rig.mano);
  // cabeza
  const cab = new THREE.Group();
  cab.position.set(0, 1.72, 0);
  const cara = [esf(0.17, pl, 0, 0, 0, 1, 1.05, 1, 1), esf(0.03, '#2a1a10', -0.065, 0.02, 0.152, 1, 1.3, 0.5, 0), esf(0.03, '#2a1a10', 0.065, 0.02, 0.152, 1, 1.3, 0.5, 0), esf(0.035, pl, 0, -0.03, 0.17, 1, 1, 1, 0)];
  if (o.bigote) cara.push(caja(0.13, 0.025, 0.04, o.bigote, 0, -0.075, 0.16));
  if (o.barba) cara.push(esf(0.15, o.barba, 0, -0.12, 0.05, 1, 0.8, 1, 1));
  if (o.anteojos) cara.push(cil(0.05, 0.05, 0.015, '#222', -0.07, 0.025, 0.165, 8, Math.PI / 2), cil(0.05, 0.05, 0.015, '#222', 0.07, 0.025, 0.165, 8, Math.PI / 2));
  const hat = o.sombrero || 'paja';
  if (hat === 'paja') cara.push(cil(0.46, 0.46, 0.035, '#e9c566', 0, 0.12, 0, 16), cil(0.2, 0.22, 0.17, '#f2d27c', 0, 0.22, 0, 12), cil(0.225, 0.225, 0.05, '#d9473c', 0, 0.17, 0, 12));
  else if (hat === 'capitan') cara.push(cil(0.22, 0.24, 0.1, '#f9fbfc', 0, 0.17, 0, 12), cil(0.24, 0.24, 0.04, '#26354d', 0, 0.12, 0, 12), cil(0.2, 0.2, 0.02, '#26354d', 0, 0.24, 0.0, 12), caja(0.3, 0.02, 0.16, '#26354d', 0, 0.1, 0.2), esf(0.03, '#e8c860', 0, 0.17, 0.23, 1, 1, 0.5, 0));
  else if (hat === 'gorra') cara.push(esf(0.19, '#2b9bb0', 0, 0.06, 0, 1, 0.75, 1, 1), caja(0.28, 0.02, 0.2, '#1d7488', 0, 0.1, 0.2));
  else if (hat === 'panuelo') cara.push(esf(0.18, '#e0553d', 0, 0.07, 0, 1, 0.8, 1, 1), esf(0.04, '#ffffff', -0.08, 0.15, 0.1, 1, 1, 1, 0), esf(0.04, '#ffffff', 0.07, 0.17, 0.05, 1, 1, 1, 0), cono(0.07, 0.2, '#e0553d', 0, 0.06, -0.22, 4, -1.2));
  else if (hat === 'galera') cara.push(cil(0.27, 0.27, 0.03, '#1c1426', 0, 0.14, 0, 14), cil(0.17, 0.17, 0.3, '#1c1426', 0, 0.3, 0, 12), cil(0.175, 0.175, 0.06, '#e8c860', 0, 0.2, 0, 12));
  rig.cabeza = mk(unir(cara), cab, 0, 0, 0, mt);
  g.add(cab);
  rig.cabezaG = cab;
  // herramientas en la mano derecha
  rig.herr = { cana: new THREE.Group(), arpon: new THREE.Group(), red: new THREE.Group(), dinamita: new THREE.Group() };
  if (o.herramientas) {
    const col = o.canaCol || '#c9a45c';
    rig.matCana = new THREE.MeshStandardMaterial({ color: col, roughness: 0.5, metalness: 0.1 });
    // caña: mango + varilla en tres tramos (más finos hacia la punta) apuntando hacia adelante (-z) y arriba
    const c = rig.herr.cana;
    const mango = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8), new THREE.MeshStandardMaterial({ color: '#3a2412', roughness: 0.8 }));
    mango.rotation.x = Math.PI / 2; mango.position.set(0, 0, -0.1);
    c.add(mango);
    const carr = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.07, 10), new THREE.MeshStandardMaterial({ color: '#e8c860', roughness: 0.3, metalness: 0.6 }));
    carr.rotation.z = Math.PI / 2; carr.position.set(0, -0.07, -0.05);
    c.add(carr);
    rig.carretel = carr;
    rig.tramos = [];
    let padre = new THREE.Group();
    padre.position.set(0, 0, -0.32);
    padre.rotation.x = 0.55;
    c.add(padre);
    const largos = [0.9, 0.85, 0.8], rads = [0.026, 0.02, 0.014];
    for (let i = 0; i < 3; i++) {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(rads[i] * 0.78, rads[i], largos[i], 6), rig.matCana);
      t.rotation.x = Math.PI / 2; t.position.set(0, 0, -largos[i] / 2); t.castShadow = true;
      const piv = new THREE.Group();
      piv.add(t);
      padre.add(piv);
      const sig = new THREE.Group();
      sig.position.set(0, 0, -largos[i]);
      piv.add(sig);
      rig.tramos.push(piv);
      padre = sig;
    }
    rig.puntaCana = new THREE.Object3D();
    padre.add(rig.puntaCana);
    c.position.set(0, 0, -0.05);
    rig.mano.add(c);
    // arpón
    const a = rig.herr.arpon;
    const eje = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.7, 6), new THREE.MeshStandardMaterial({ color: '#7a5230', roughness: 0.8 }));
    eje.rotation.x = Math.PI / 2; eje.position.set(0, 0, -0.6);
    rig.matPunta = new THREE.MeshStandardMaterial({ color: '#aab3bd', roughness: 0.3, metalness: 0.7 });
    const punta = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.3, 4), rig.matPunta);
    punta.rotation.x = -Math.PI / 2; punta.position.set(0, 0, -1.6);
    a.add(eje, punta);
    rig.mano.add(a);
    // red
    const r = rig.herr.red;
    const bol = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 1), new THREE.MeshStandardMaterial({ color: '#f1ead0', roughness: 1, flatShading: true }));
    bol.position.set(0, -0.05, -0.1);
    r.add(bol);
    rig.mano.add(r);
    // dinamita
    const d = rig.herr.dinamita;
    const pal = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.34, 8), new THREE.MeshStandardMaterial({ color: '#d9382c', roughness: 0.6 }));
    pal.rotation.x = Math.PI / 2; pal.position.set(0, 0, -0.1);
    const mecha = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshBasicMaterial({ color: '#ffb02e' }));
    mecha.position.set(0, 0.06, -0.3);
    d.add(pal, mecha);
    rig.mano.add(d);
    for (const k in rig.herr) rig.herr[k].visible = false;
  }
  rig.t = o.fase || 0;
  rig.mov = 0;
  return rig;
}

// Animación: vel = velocidad (m/s); accion = 0..1 (lanzar / arpón / comer); nadando
function animarPersona(rig, dt, vel, o = {}) {
  const k = Math.min(1, vel / 4.2);
  rig.t += dt * (1.5 + vel * 1.5);
  const sw = Math.sin(rig.t * 2) * 0.75 * k;
  rig.piernaI.rotation.x = sw;
  rig.piernaD.rotation.x = -sw;
  const respira = Math.sin(J.t * 2.2 + (rig.fase || 0)) * 0.015;
  rig.torso.position.y = 1.28 + Math.abs(Math.sin(rig.t * 2)) * 0.035 * k + respira;
  rig.cabezaG.position.y = 1.72 + Math.abs(Math.sin(rig.t * 2)) * 0.035 * k + respira;
  let bi = -sw * 0.8, bd = sw * 0.8;
  if (o.herr) {
    // brazo derecho sosteniendo la herramienta hacia adelante
    const alza = o.alza !== undefined ? o.alza : 0.55;
    bd = -(Math.PI / 2) * alza - (o.acc || 0) * 1.1;
    bi = o.brazoIzq !== undefined ? o.brazoIzq : bi * 0.5 - 0.2;
  }
  if (o.comiendo) { bd = -2.3; }
  rig.brazoI.rotation.x = bi;
  rig.brazoD.rotation.x = bd;
  rig.brazoD.rotation.z = o.herr ? -0.12 : 0;
  rig.brazoI.rotation.z = 0.05;
  rig.cabezaG.rotation.y = o.mirar || 0;
  rig.cabezaG.rotation.x = o.cabeceo || 0;
}

// Pone la herramienta que corresponde en la mano
function mostrarHerramienta(rig, tool) {
  for (const k in rig.herr) rig.herr[k].visible = k === tool;
}
