'use strict';
// Malla del terreno: parches de 2 m alineados (sin costuras), colores por vértice y cáusticas bajo el agua.

const TERR = { grupo: null, mat: null, uTime: { value: 0 }, uSol: { value: 1 } };

function colorTerreno(out, x, z, h, pend, isla, enIsla) {
  const C = TERR.paleta;
  const n = ruido2(x * 0.17, z * 0.17), n2 = ruido2(x * 0.5 + 9, z * 0.5 + 4);
  if (h < -0.15) {
    const t = smooth(-0.15, -9, h);
    out.copy(C.arenaSub).lerp(C.fondo, t);
    if (n2 > 0.72 && h > -3) out.lerp(C.alga, 0.25);
  } else if (h < 0.55) {
    out.copy(C.arenaMoj).lerp(C.arena, smooth(0.1, 0.55, h));
  } else {
    out.copy(C.arena);
    const g = smooth(0.95, 1.7, h + (n - 0.5) * 0.7);
    if (isla && isla.tipo === 'arsenal') {
      // selva, roca volcánica, ceniza y vetas de lava en la cumbre
      const alt = h + (n - 0.5) * 1.4;
      const selva = smooth(1.2, 3.4, alt) * (1 - smooth(21, 30, alt));
      out.lerp(n2 > 0.5 ? C.selva : C.selva2, selva);
      if (alt > 21) out.lerp(C.volcan, smooth(21, 30, alt));
      if (alt > 33) out.lerp(C.ceniza, smooth(33, 39, alt) * 0.75);
      if (pend > 0.85) out.lerp(C.volcan, smooth(0.85, 1.5, pend) * 0.85);
      const dv = Math.hypot(x - (isla.x + 18), z - (isla.z - 34));
      if (dv < 24 && alt > 28) { out.lerp(C.ceniza, smooth(24, 14, dv) * 0.55); out.lerp(C.lava, smooth(22, 10, dv) * smooth(0.58, 0.8, n2) * 0.95); }
    } else if (isla && isla.tipo === 'roca') {
      out.lerp(C.roca, smooth(1.5, 5, h));
      out.lerp(C.pasto2, g * (1 - smooth(4, 12, h)) * 0.8);
    } else {
      out.lerp(n2 > 0.5 ? C.pasto : C.pasto3, g);
      if (h > 6) out.lerp(C.pasto2, smooth(6, 9, h) * 0.7);
    }
    if (pend > 0.75) out.lerp(C.roca, smooth(0.75, 1.3, pend) * 0.85);
    if (enIsla) {
      const dc = distCamino(x, z);
      if (dc < 0.6) out.lerp(C.tierra, 1 - smooth(-0.6, 0.6, dc));
    }
  }
  // un toque de variación para que no se vea plano
  const k = 0.94 + n * 0.12;
  out.r *= k; out.g *= k; out.b *= k;
}

function construirParche(x0, z0, x1, z1, paso, mat, excluir) {
  const nx = (x1 - x0) / paso, nz = (z1 - z0) / paso;
  const W = nx + 1;
  const hg = new Float32Array(W * (nz + 1));
  for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) hg[j * W + i] = H(x0 + i * paso, z0 + j * paso);
  const pos = new Float32Array(W * (nz + 1) * 3), col = new Float32Array(W * (nz + 1) * 3);
  const c = new THREE.Color();
  for (let j = 0; j <= nz; j++) {
    for (let i = 0; i <= nx; i++) {
      const k = j * W + i, x = x0 + i * paso, z = z0 + j * paso, h = hg[k];
      pos[k * 3] = x; pos[k * 3 + 1] = h; pos[k * 3 + 2] = z;
      const hx = hg[j * W + Math.min(nx, i + 1)] - hg[j * W + Math.max(0, i - 1)];
      const hz = hg[Math.min(nz, j + 1) * W + i] - hg[Math.max(0, j - 1) * W + i];
      const pend = Math.hypot(hx, hz) / (2 * paso);
      let isla = null;
      for (const is of ISLAS) if (Math.hypot(x - is.x, z - is.z) < is.base * 1.8) { isla = is; break; }
      colorTerreno(c, x, z, h, pend, isla, (isla === PRINCIPAL || (isla && isla.tipo === 'arsenal')) && h > 0.5);
      col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
    }
  }
  const idx = [];
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      const cx = x0 + (i + 0.5) * paso, cz = z0 + (j + 0.5) * paso;
      if (excluir.some((r) => cx > r.x0 && cx < r.x1 && cz > r.z0 && cz < r.z1)) continue;
      const a = j * W + i, b = a + 1, d = a + W, e = d + 1;
      // la diagonal sigue la pendiente para que no se vean "dientes"
      if (Math.abs(hg[a] - hg[e]) < Math.abs(hg[b] - hg[d])) idx.push(a, d, e, a, e, b); else idx.push(a, d, b, b, d, e);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setIndex(new THREE.BufferAttribute(new Uint32Array(idx), 1));
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  const m = new THREE.Mesh(geo, mat);
  m.receiveShadow = true;
  return m;
}

function crearTerreno(escena) {
  TERR.paleta = {
    arenaSub: new THREE.Color('#d9c894'), fondo: new THREE.Color('#2c6a7e'), alga: new THREE.Color('#5d9a6a'), arenaMoj: new THREE.Color('#e0cb92'),
    arena: new THREE.Color('#f3dfa8'), pasto: new THREE.Color('#79c05a'), pasto2: new THREE.Color('#4e9e46'), pasto3: new THREE.Color('#8ccb62'),
    roca: new THREE.Color('#8f959c'), tierra: new THREE.Color('#d8bf88'),
    selva: new THREE.Color('#2f7f3c'), selva2: new THREE.Color('#3f9447'), volcan: new THREE.Color('#4a4448'), ceniza: new THREE.Color('#7a7076'), lava: new THREE.Color('#d2492a'),
  };
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95, metalness: 0 });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTimeT = TERR.uTime;
    sh.uniforms.uSolT = TERR.uSol;
    sh.uniforms.uFar = { value: new THREE.Color('#0a2c4a') };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; uniform float uTimeT; uniform float uSolT; uniform vec3 uFar;')
      .replace('#include <opaque_fragment>', '#include <opaque_fragment>\n      gl_FragColor.rgb = mix(gl_FragColor.rgb, uFar, smoothstep(-10.0, -24.0, vWP.y));')
      .replace('#include <color_fragment>', `#include <color_fragment>
      {
        float bajo = smoothstep(0.15, -0.5, vWP.y);
        vec2 cp = vWP.xz * 0.42;
        float c1 = sin(cp.x * 3.1 + uTimeT * 1.3) * sin(cp.y * 2.7 - uTimeT * 1.1);
        float c2 = sin(cp.x * 5.3 - uTimeT * 1.9 + cp.y * 1.7) * sin(cp.y * 4.9 + uTimeT * 1.5);
        float cau = pow(abs(c1 * 0.5 + c2 * 0.5), 0.45);
        diffuseColor.rgb *= 1.0 + bajo * cau * 0.45 * uSolT;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.04, 0.28, 0.4), smoothstep(-0.5, -14.0, vWP.y) * 0.75);
      }`);
  };
  TERR.mat = mat;
  const grupo = new THREE.Group();
  const rects = [];
  const defs = [[0, 0, 196], [-208, 98, 120], [66, 338, 100], [-330, -300, 136], [465, 119, 190]];
  for (const [cx, cz, half] of defs) {
    const x0 = Math.round((cx - half) / 2) * 2, x1 = Math.round((cx + half) / 2) * 2, z0 = Math.round((cz - half) / 2) * 2, z1 = Math.round((cz + half) / 2) * 2;
    grupo.add(construirParche(x0, z0, x1, z1, 2, mat, rects));
    rects.push({ x0, z0, x1, z1 });
  }
  // fondo lejano (se ve apenas, a través del agua profunda)
  const fondo = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#0a2c4a' }));
  fondo.position.y = -70;
  grupo.add(fondo);
  TERR.grupo = grupo;
  escena.add(grupo);
}
