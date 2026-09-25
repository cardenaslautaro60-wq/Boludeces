import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import { clamp, lerp, smoothstep } from '../util.js';

// Versión realista: cielo físico con nubes, reflejos del cielo en todos los materiales
// (mapa de entorno), luz de sol fuerte con exposición de cámara y postproceso
// (oclusión ambiental, resplandor, antialias y gradación de color).

// Gradación final (en color lineal, antes del tone mapping): viñeta, destello al recibir
// daño y blanco y negro al morir. Mantiene los uniforms del filtro PS2 (uFlash, uGrey, uTrail).
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uFlash: { value: 0 }, uGrey: { value: 0 }, uTrail: { value: 0 },
    uVig: { value: 0.28 }, uSat: { value: 1.12 }, uWarm: { value: 0.45 },
    uTime: { value: 0 }, uGrain: { value: 0.035 }, uCA: { value: 0.0022 },
  },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uFlash, uGrey, uVig, uSat, uWarm, uTime, uGrain, uCA; varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec4 t = texture2D(tDiffuse, vUv);
      vec3 c = t.rgb;
      // aberración cromática leve hacia los bordes (lente de cámara)
      vec2 dd = (vUv - 0.5) * uCA;
      c.r = texture2D(tDiffuse, vUv + dd).r;
      c.b = texture2D(tDiffuse, vUv - dd).b;
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = max(mix(vec3(l), c, uSat), 0.0);
      c *= mix(vec3(1.0), vec3(1.05, 1.0, 0.93), uWarm);
      c = mix(c, vec3(l * 0.85), uGrey);
      vec2 d = vUv - 0.5;
      c *= 1.0 - dot(d, d) * uVig * 1.8;
      c += uFlash;
      // grano de película (proporcional a la luz, como en una foto)
      float n = hash(vUv * 1731.0 + fract(uTime * 13.7)) - 0.5;
      c *= 1.0 + n * uGrain;
      gl_FragColor = vec4(c, t.a);
    }`,
};

export class RealPost {
  constructor(game) {
    this.game = game;
    const r = game.renderer;
    this.renderer = r;
    this.enabled = true;
    this.ao = false;
    this.composer = new EffectComposer(r);
    this.renderPass = new RenderPass(game.scene, game.camera);
    this.composer.addPass(this.renderPass);
    this.gtao = null;
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.12, 0.4, 1.6);
    this.composer.addPass(this.bloom);
    this.grade = new ShaderPass(GradeShader);
    this.composer.addPass(this.grade);
    this.composer.addPass(new OutputPass());
    this.smaa = new SMAAPass();
    this.composer.addPass(this.smaa);
    // compatibilidad con el filtro PS2 (game.js toca post.mat.uniforms)
    this.mat = this.grade.material;
  }

  // Oclusión ambiental (sombras de contacto): cara, así que solo en calidad alta
  setAO(on) {
    if (on === this.ao) return;
    this.ao = on;
    if (on) {
      const g = this.game;
      this.gtao = new GTAOPass(g.scene, g.camera, 256, 256);
      this.gtao.output = GTAOPass.OUTPUT.Default;
      this.gtao.blendIntensity = 0.85;
      this.gtao.updateGtaoMaterial({ radius: 1.6, distanceExponent: 1.4, thickness: 1.5, scale: 1, samples: 12 });
      this.gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
      this.composer.insertPass(this.gtao, 1);
      if (this.size) this.setSize(...this.size);
    } else if (this.gtao) {
      this.composer.removePass(this.gtao);
      this.gtao.dispose();
      this.gtao = null;
    }
  }

  setSize(w, h, scale) {
    this.size = [w, h, scale];
    this.composer.setPixelRatio(1);
    const W = Math.max(2, Math.floor(w * scale)), H = Math.max(2, Math.floor(h * scale));
    this.composer.setSize(W, H);
    this.bloom.setSize(Math.floor(W / 2), Math.floor(H / 2));
  }

  render(scene, camera) {
    this.grade.uniforms.uTime.value = performance.now() * 0.001;
    this.renderPass.scene = scene;
    this.renderPass.camera = camera;
    if (this.gtao) { this.gtao.scene = scene; this.gtao.camera = camera; }
    this.composer.render();
  }
}

// Cielo físico (dispersión atmosférica con nubes) y reflejos del cielo en toda la escena
export class RealSky {
  constructor(game) {
    this.game = game;
    const env = game.env;
    this.sky = new Sky();
    this.sky.scale.setScalar(1200);
    this.sky.frustumCulled = false;
    this.sky.renderOrder = -10;
    // el cielo de Three sale muy brillante para esta escena: se atenúa (skyGain) para que una
    // pared al sol se vea más clara que el cielo, como en una foto
    const addGain = (m) => {
      m.fragmentShader = m.fragmentShader.replace('void main() {', 'uniform float skyGain;\nvoid main() {')
        .replace('#include <tonemapping_fragment>', 'gl_FragColor.rgb *= skyGain;\n#include <tonemapping_fragment>');
    };
    addGain(this.sky.material);
    const U = this.U = this.sky.material.uniforms;
    U.skyGain = { value: 0.22 };
    U.turbidity.value = 3.2;
    U.rayleigh.value = 1.1;
    U.mieCoefficient.value = 0.004;
    U.mieDirectionalG.value = 0.82;
    U.cloudScale.value = 0.00022;
    U.cloudSpeed.value = 0.00003;
    U.cloudElevation.value = 0.55;
    // de noche se funde el cielo original (azul noche con estrellas) sobre el físico
    const om = env.sky.material;
    om.transparent = true;
    om.uniforms.uMix = { value: 0 };
    om.fragmentShader = om.fragmentShader.replace('uniform vec3 uTop', 'uniform float uMix;\nuniform vec3 uTop')
      .replace('gl_FragColor = vec4(col, 1.0);', 'gl_FragColor = vec4(col * 0.9, uMix);');
    om.needsUpdate = true;
    env.sky.renderOrder = -9;
    env.sky.visible = false;
    env.realSun = true;
    env.fogScale = 1.7;
    game.scene.add(this.sky);
    // escena aparte con una copia del cielo para generar el mapa de entorno (reflejos)
    this.envScene = new THREE.Scene();
    this.envSky = new Sky();
    addGain(this.envSky.material);
    this.envSky.material.uniforms = U;
    this.envSky.scale.setScalar(500);
    this.envScene.add(this.envSky);
    // el suelo que refleja el cielo: un disco del color de la estepa (evita reflejos azules abajo)
    const ground = new THREE.Mesh(new THREE.CircleGeometry(400, 24), new THREE.MeshBasicMaterial({ color: 0x5e5446 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -8;
    this.envGround = ground;
    this.envScene.add(ground);
    // silueta de ciudad alrededor (solo en el reflejo): los vidrios y los autos reflejan
    // edificios cuando se anda por el Centro, y casas bajas en los barrios
    this.envCity = {};
    const skyline = (n, h0, h1, r0, r1, seed) => {
      let sd = seed;
      const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
      const geo = new THREE.BoxGeometry(1, 1, 1);
      geo.translate(0, 0.5, 0);
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mesh = new THREE.InstancedMesh(geo, mat, n);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(), c = new THREE.Color();
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rnd() * 0.2, r = r0 + rnd() * (r1 - r0);
        p.set(Math.cos(a) * r, -8, Math.sin(a) * r);
        q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a);
        sc.set(8 + rnd() * 30, h0 + rnd() * rnd() * (h1 - h0) + 8, 10 + rnd() * 25);
        m4.compose(p, q, sc);
        mesh.setMatrixAt(i, m4);
        const k = 0.75 + rnd() * 0.5;
        mesh.setColorAt(i, c.setRGB(0.55 * k, 0.52 * k, 0.47 * k));
      }
      mesh.visible = false;
      this.envScene.add(mesh);
      return mesh;
    };
    this.envCity.centro = skyline(90, 8, 70, 60, 260, 7);
    this.envCity.barrio = skyline(120, 2, 9, 30, 200, 13);
    this.envZone = '';
    // destello del sol en la lente
    const flareTex = (draw) => { const c = document.createElement('canvas'); c.width = c.height = 128; draw(c.getContext('2d')); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
    const glow = flareTex((g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,250,235,1)'); gr.addColorStop(0.15, 'rgba(255,235,190,0.55)'); gr.addColorStop(1, 'rgba(255,220,160,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
    const ring = flareTex((g) => { const gr = g.createRadialGradient(64, 64, 34, 64, 64, 60); gr.addColorStop(0, 'rgba(120,200,255,0)'); gr.addColorStop(0.5, 'rgba(160,210,255,0.35)'); gr.addColorStop(1, 'rgba(120,200,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
    const dot = flareTex((g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,0.5)'); gr.addColorStop(0.7, 'rgba(255,230,200,0.18)'); gr.addColorStop(1, 'rgba(255,230,200,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
    const lf = new Lensflare();
    lf.addElement(new LensflareElement(glow, 420, 0, new THREE.Color(1, 0.95, 0.85)));
    lf.addElement(new LensflareElement(dot, 60, 0.35, new THREE.Color(0.7, 0.85, 1)));
    lf.addElement(new LensflareElement(ring, 140, 0.6, new THREE.Color(0.8, 0.9, 1)));
    lf.addElement(new LensflareElement(dot, 90, 0.85, new THREE.Color(1, 0.8, 0.6)));
    lf.addElement(new LensflareElement(ring, 240, 1.0, new THREE.Color(0.6, 0.8, 1)));
    lf.frustumCulled = false;
    this.flare = lf;
    game.scene.add(lf);
    this.pmrem = new THREE.PMREMGenerator(game.renderer);
    this.envRT = null;
    this.lastSun = new THREE.Vector3(0, -2, 0);
    this.lastClouds = -1;
    this.envT = 0;
    this.sunV = new THREE.Vector3();
  }

  update(dt) {
    const g = this.game, env = g.env, SU = env.skyUniforms, U = this.U;
    const sd = SU.uSunDir.value;
    const clouds = SU.uClouds.value, night = SU.uNight.value, dust = SU.uDust.value;
    // de noche el "sol" del cielo físico queda bajo el horizonte y el cielo se oscurece solo
    const elev = sd.y;
    this.sunV.copy(sd);
    if (elev < 0) this.sunV.y = elev;
    U.sunPosition.value.copy(this.sunV).multiplyScalar(1000);
    U.turbidity.value = 3 + dust * 7 + clouds * 2;
    U.rayleigh.value = lerp(1.0, 2.2, 1 - smoothstep(0.0, 0.3, elev)) * (1 - night * 0.6);
    U.cloudCoverage.value = clamp(0.18 + clouds * 0.75, 0, 0.95);
    U.cloudDensity.value = 0.35 + clouds * 0.45;
    U.time.value = g.time || 0;
    this.sky.position.copy(g.camera.position);
    // el destello va lejos, en la dirección del sol (y se apaga con nubes, polvo o de noche)
    this.flare.position.copy(g.camera.position).addScaledVector(sd, 900);
    this.flare.visible = elev > 0.02 && clouds < 0.6 && dust < 0.5 && !(g.cameraRig && g.cameraRig.cinematic && g.cameraRig.cinematic.noFlare);
    const gc = this.envGround.material.color;
    gc.setRGB(0.36, 0.32, 0.26).multiplyScalar(Math.max(0.05, env.dayLight));
    // qué ciudad se refleja según dónde está la cámara
    const zt = g.city && g.city.zoneTypeAt ? g.city.zoneTypeAt(g.camera.position.x, g.camera.position.z) : null;
    const zone = zt === 'centro' ? 'centro' : zt ? 'barrio' : '';
    for (const k in this.envCity) {
      this.envCity[k].visible = k === zone;
      this.envCity[k].material.color.setScalar(Math.max(0.04, env.dayLight) * (1 - clouds * 0.3));
    }

    // luz: sol más fuerte y cielo como luz ambiente (la hemisférica queda como relleno)
    // (el cielo físico tiene radiancias altas: exposición baja, como una cámara de día)
    const day = clamp(env.dayLight, 0, 1);
    const mix = smoothstep(0.35, 0.85, night);
    env.skyUniforms && (env.sky.material.uniforms.uMix.value = mix);
    env.sky.visible = mix > 0.01;
    // luna: más tenue que en la PS2 (de noche manda la luz de los faroles y las ventanas)
    env.sun.intensity *= elev > 0 ? 3.3 : 1.2;
    env.hemi.intensity *= 0.08;
    g.scene.environmentIntensity = lerp(0.5, 1.0, day) * (1 + clouds * 0.25);
    const exposure = lerp(1.6, 1.0, day);
    g.renderer.toneMappingExposure = exposure;
    // el resplandor trabaja antes de la exposición: el umbral acompaña (solo el sol, reflejos
    // fuertes y luces de noche)
    if (g.post && g.post.bloom) g.post.bloom.threshold = 1.6 / exposure;

    // regenerar los reflejos cuando cambia el sol o el clima
    this.envT -= dt;
    const moved = this.lastSun.distanceToSquared(this.sunV) > 0.0006 || Math.abs(this.lastClouds - clouds) > 0.04 || zone !== this.envZone;
    if (zone !== this.envZone) this.envT = 0;
    if (!this.envRT || (moved && this.envT <= 0)) {
      this.envT = 1.5;
      this.envZone = zone;
      this.lastSun.copy(this.sunV);
      this.lastClouds = clouds;
      const old = this.envRT;
      this.envRT = this.pmrem.fromScene(this.envScene, 0, 0.1, 1000);
      g.scene.environment = this.envRT.texture;
      if (old) old.dispose();
    }
  }
}

// Ajustes del renderer para la versión realista
export function setupRealRenderer(renderer) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.type = THREE.PCFShadowMap;
}
