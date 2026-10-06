'use strict';
// Nivel 2 (Isla Arsenal): lo que no se arma con los edificios comunes: humo del volcán, brasas y la gente del lugar.

const ARS3D = { humoT: 0, brasaT: 0, glow: null };

function crearArsenal(escena) {
  // resplandor de la lava en la cumbre (disco aditivo que late)
  const v = ARSENAL.volcan;
  if (!v) return;
  const g = new THREE.Mesh(new THREE.CircleGeometry(9, 28).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ff5a1e', transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  g.position.set(v.x, v.h + 0.25, v.z);
  g.renderOrder = 3;
  escena.add(g);
  ARS3D.glow = g;
}
function actualizarArsenal(dt) {
  const v = ARSENAL.volcan;
  if (!v || !ARS3D.glow) return;
  const d = Math.hypot(P.pos.x - v.x, P.pos.z - v.z);
  const cerca = d < 360;
  ARS3D.glow.visible = cerca;
  if (!cerca) return;
  ARS3D.glow.material.opacity = (0.16 + 0.1 * Math.sin(J.t * 1.7) + J.noche * 0.18) * (0.7 + 0.3 * Math.sin(J.t * 4.1));
  ARS3D.humoT -= dt;
  if (ARS3D.humoT <= 0) {
    ARS3D.humoT = d < 180 ? 0.12 : 0.3;
    humo(v.x + rand(-3, 3), v.h + 1.5, v.z + rand(-3, 3), J.noche > 0.5 ? '#5a4a4a' : '#6a6262');
    if (Math.random() < 0.35) particula({ x: v.x + rand(-2, 2), y: v.h + 1, z: v.z + rand(-2, 2), vx: rand(-1.5, 1.5), vy: rand(6, 11), vz: rand(-1.5, 1.5), vida: rand(1.0, 1.8), size: rand(0.12, 0.26), col: pick(['#ff7a2a', '#ffb23a', '#ff4a1a']), tipo: T_CHISPA, g: 7 });
  }
}

// La gente de la isla
function crearNPCsArsenal() {
  const arm = ARSENAL.armeria;
  if (!arm) return;
  const mk = (id, x, z, o, frases, mirar) => {
    const rig = crearPersona(Object.assign({ fase: Math.random() * 10 }, o));
    const y = alturaPiso(x, z);
    rig.grupo.position.set(x, y, z);
    ESC.escena.add(rig.grupo);
    const n = { id, rig, x, z, y, yaw: mirar || 0, frases, fraseT: rand(3), burbuja: null };
    PJ.npcs.push(n); NPCS.push(n);
    MUN.circulos.push({ x, z, r: 0.5 });
  };
  mk('sargento', arm.x + 5.2, arm.z + arm.d / 2 + 3.2, { camisa: '#5f6d3c', chaleco: '#3b4429', sombrero: 'casco', piel: piel.moreno, bigote: '#2a1c12', flores: false }, [
    '¡Armería abierta! Fierros para valientes y para tontos.', 'Un rifle no te salva de un jefe. Tu cabeza sí.', 'El gorila protege la selva. El escorpión, el pedregal. Y arriba... mejor no hablar.', 'Munición nunca sobra, soldado.']);
  const pie = ARSENAL.plaza;
  mk('marinero', pie.x + 4.2, pie.z + 5.5, { camisa: '#2b6a9a', sombrero: 'gorra', piel: piel.claro, barba: '#8a6a3a', flores: false }, [
    'Bienvenido al Nivel 2. Acá se pelea en serio.', 'Si llegaste en lancha, ya sos de los buenos.', 'El volcán respira. Y no es el viento.']);
}
