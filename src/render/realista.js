import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
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
  },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uFlash, uGrey, uVig, uSat, uWarm; varying vec2 vUv;
    void main(){
      vec4 t = texture2D(tDiffuse, vUv);
      vec3 c = t.rgb;
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = max(mix(vec3(l), c, uSat), 0.0);
      c *= mix(vec3(1.0), vec3(1.05, 1.0, 0.93), uWarm);
      c = mix(c, vec3(l * 0.85), uGrey);
      vec2 d = vUv - 0.5;
      c *= 1.0 - dot(d, d) * uVig * 1.8;
      c += uFlash;
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
    const gc = this.envGround.material.color;
    gc.setRGB(0.36, 0.32, 0.26).multiplyScalar(Math.max(0.05, env.dayLight));

    // luz: sol más fuerte y cielo como luz ambiente (la hemisférica queda como relleno)
    // (el cielo físico tiene radiancias altas: exposición baja, como una cámara de día)
    const day = clamp(env.dayLight, 0, 1);
    env.sun.intensity *= 3.3;
    env.hemi.intensity *= 0.08;
    g.scene.environmentIntensity = lerp(0.5, 1.0, day) * (1 + clouds * 0.25);
    const exposure = lerp(2.4, 1.0, day);
    g.renderer.toneMappingExposure = exposure;
    // el resplandor trabaja antes de la exposición: el umbral acompaña (solo el sol, reflejos
    // fuertes y luces de noche)
    if (g.post && g.post.bloom) g.post.bloom.threshold = 1.6 / exposure;

    // regenerar los reflejos cuando cambia el sol o el clima
    this.envT -= dt;
    const moved = this.lastSun.distanceToSquared(this.sunV) > 0.0006 || Math.abs(this.lastClouds - clouds) > 0.04;
    if (!this.envRT || (moved && this.envT <= 0)) {
      this.envT = 1.5;
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
