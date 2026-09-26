import * as THREE from 'three';

// Instancias agrupadas por sector (para que la cámara y la sombra descarten lo que no ven)
export class InstChunks {
  constructor(geo, mat, size = 360) {
    this.geo = geo; this.mat = mat; this.size = size;
    this.buckets = new Map();
    this.meshes = [];
  }

  add(x, z, matrix, color = null) {
    const k = `${Math.floor(x / this.size)},${Math.floor(z / this.size)}`;
    let b = this.buckets.get(k);
    if (!b) { b = { mats: [], cols: [], refs: [] }; this.buckets.set(k, b); }
    b.mats.push(matrix.clone());
    b.cols.push(color ? color.clone() : null);
    const ref = { bucket: b, index: b.mats.length - 1 };
    b.refs.push(ref);
    return ref;
  }

  get count() { let n = 0; for (const b of this.buckets.values()) n += b.mats.length; return n; }

  build(parent, opts = {}) {
    for (const b of this.buckets.values()) {
      const mesh = new THREE.InstancedMesh(this.geo, this.mat, b.mats.length);
      b.mats.forEach((m, i) => mesh.setMatrixAt(i, m));
      if (b.cols.some((c) => c)) b.cols.forEach((c, i) => mesh.setColorAt(i, c || new THREE.Color(1, 1, 1)));
      mesh.computeBoundingSphere();
      // margen para las piezas animadas (balancines, rotores)
      if (opts.pad) mesh.boundingSphere.radius += opts.pad;
      mesh.castShadow = !!opts.castShadow;
      mesh.receiveShadow = !!opts.receiveShadow;
      if (opts.noShadow) mesh.userData.noShadow = true;
      if (opts.cullDist) mesh.userData.cullDist = opts.cullDist;
      if (opts.minDist) mesh.userData.minDist = opts.minDist;
      b.mesh = mesh;
      for (const r of b.refs) r.mesh = mesh;
      parent.add(mesh);
      this.meshes.push(mesh);
    }
    return this.meshes;
  }
}

// Apaga lo que queda más lejos que la niebla (no se ve, pero se dibujaba igual)
export class DistanceCuller {
  constructor() { this.items = []; this.t = 0; }

  add(obj, cullDist = null) {
    if (obj.userData.noCull) return;
    let sphere = null;
    if (obj.isInstancedMesh) { if (!obj.boundingSphere) obj.computeBoundingSphere(); sphere = obj.boundingSphere; }
    else if (obj.geometry) { if (!obj.geometry.boundingSphere) obj.geometry.computeBoundingSphere(); sphere = obj.geometry.boundingSphere.clone().applyMatrix4(obj.matrixWorld); }
    if (!sphere) return;
    this.items.push({ obj, x: sphere.center.x, z: sphere.center.z, r: sphere.radius, cd: cullDist || obj.userData.cullDist || null, md: obj.userData.minDist || 0 });
  }

  addTree(root, cullDist = null) {
    root.updateMatrixWorld(true);
    root.traverse((o) => { if ((o.isMesh || o.isInstancedMesh) && !o.isSkinnedMesh) this.add(o, cullDist); });
  }

  update(cam, maxDist, dt, force = false) {
    this.t -= dt;
    // si la cámara saltó (corte de cinemática, teletransporte), actualizar ya
    const jump = !this.last || Math.abs(this.last.x - cam.x) + Math.abs(this.last.z - cam.z) > 50;
    if (this.t > 0 && !force && !jump) return;
    this.last = { x: cam.x, z: cam.z };
    this.t = 0.25;
    for (const it of this.items) {
      const d = Math.hypot(it.x - cam.x, it.z - cam.z) - it.r;
      // minDist: versión lejana de algo que de cerca se dibuja con más detalle (árboles)
      it.obj.visible = (!it.md || d >= it.md) && d < (it.cd ? Math.min(it.cd, maxDist) : maxDist);
    }
  }
}
