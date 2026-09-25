import * as THREE from 'three';
import { clamp, lerp, smoothstep, noise2 } from '../util.js';

// Paleta del cielo por hora (0..24)
const KEYS = [
  [0, 0x070b1c, 0x151c30, 0.16],
  [5, 0x0d1330, 0x2a2a44, 0.2],
  [6.3, 0x2a3566, 0x9a6a6a, 0.45],
  [7.2, 0x4a6ea8, 0xe8a878, 0.8],
  [9, 0x4d7fc4, 0xbccbd8, 1.0],
  [13, 0x3f75c2, 0xc4d2de, 1.0],
  [17.5, 0x4e79b8, 0xd2c8b0, 0.95],
  [19.3, 0x3a4c88, 0xe89060, 0.75],
  [20.3, 0x1c2352, 0x7a4a5a, 0.4],
  [21.3, 0x0a1026, 0x1e2238, 0.2],
  [24, 0x070b1c, 0x151c30, 0.16],
];

const SHADOW_R = 70;
const WEATHER = {
  despejado: { name: 'Despejado', wind: 9, fogNear: 140, fogFar: 760, clouds: 0.15, dust: 0.0 },
  nublado: { name: 'Nublado', wind: 13, fogNear: 110, fogFar: 600, clouds: 0.75, dust: 0.1 },
  ventoso: { name: 'Viento fuerte', wind: 22, fogNear: 60, fogFar: 430, clouds: 0.35, dust: 0.55 },
  temporal: { name: 'Temporal de viento', wind: 34, fogNear: 15, fogFar: 190, clouds: 0.6, dust: 1.0 },
};

export class Environment {
  constructor(scene, renderer) {
    this.scene = scene;
    this.time = 9 * 60; // minutos de juego
    this.weather = 'despejado';
    this.weatherTarget = 'despejado';
    this.weatherT = 1;
    this.forcedWeather = null;
    this.windDir = new THREE.Vector2(1, 0.15).normalize(); // viene del Oeste, sopla hacia el Este
    this.windSpeed = 9;
    this.gust = 0;
    this.night = 0;
    this.dayLight = 1;
    this.dust = 0;
    this.nextWeatherChange = 180;
    this.moonDir = new THREE.Vector3(0.3, 0.8, -0.4).normalize();
    // la versión realista usa el recorrido real del sol y ve más lejos (aire patagónico)
    this.realSun = false;
    this.fogScale = 1;

    this.hemi = new THREE.HemisphereLight(0xcfe0ff, 0x8a7a5a, 1.2);
    this.sun = new THREE.DirectionalLight(0xfff2e0, 2.2);
    this.sun.position.set(-100, 200, 50);
    // sombras: un mapa de 140 m alrededor de la cámara que acompaña al jugador
    this.sun.shadow.mapSize.set(2048, 2048);
    const sc = this.sun.shadow.camera;
    sc.left = -SHADOW_R; sc.right = SHADOW_R; sc.top = SHADOW_R; sc.bottom = -SHADOW_R; sc.near = 20; sc.far = 520;
    sc.updateProjectionMatrix();
    this.sun.shadow.bias = -0.0002;
    this.sun.shadow.normalBias = 0.03;
    this.shadowR = new THREE.Vector3(); this.shadowU = new THREE.Vector3(); this.shadowC = new THREE.Vector3();
    scene.add(this.hemi, this.sun, this.sun.target);

    this.fog = new THREE.Fog(0xbccbd8, 140, 760);
    scene.fog = this.fog;

    this.skyUniforms = {
      uTop: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
      uSunDir: { value: new THREE.Vector3(0, 1, 0) },
      uSunColor: { value: new THREE.Color(0xffe8c0) },
      uClouds: { value: 0.2 },
      uTime: { value: 0 },
      uNight: { value: 0 },
      uDust: { value: 0 },
      uDustColor: { value: new THREE.Color(0xb49a70) },
    };
    const skyMat = new THREE.ShaderMaterial({
      uniforms: this.skyUniforms,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*p; gl_Position.z = gl_Position.w; }`,
      fragmentShader: `
        uniform vec3 uTop, uHorizon, uSunDir, uSunColor, uDustColor; uniform float uClouds, uTime, uNight, uDust;
        varying vec3 vDir;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
        float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
        float fbm(vec2 p){ float s=0.0,a=0.5; for(int i=0;i<5;i++){ s+=a*noise(p); p*=2.03; a*=0.5;} return s; }
        void main(){
          vec3 d = normalize(vDir);
          float h = clamp(d.y, -1.0, 1.0);
          float t = pow(clamp(h, 0.0, 1.0), 0.45);
          vec3 col = mix(uHorizon, uTop, t);
          if (h < 0.0) col = mix(uHorizon, uHorizon*0.7, clamp(-h*3.0,0.0,1.0));
          float sd = max(dot(d, normalize(uSunDir)), 0.0);
          col += uSunColor * (pow(sd, 900.0)*6.0 + pow(sd, 12.0)*0.25) * (1.0-uNight*0.9);
          // estrellas
          if (uNight > 0.01 && h > 0.0) {
            vec2 sp = d.xz / (d.y + 0.3) * 120.0;
            float st = step(0.985, hash(floor(sp))) * hash(floor(sp)+3.1);
            col += vec3(st) * uNight * (0.6 + 0.4*sin(uTime*3.0 + hash(floor(sp))*20.0));
          }
          // nubes
          if (h > 0.0) {
            vec2 uv = d.xz / (d.y + 0.08) * 1.6 + vec2(uTime*0.02, uTime*0.006);
            float c = fbm(uv);
            float cov = smoothstep(1.0 - uClouds, 1.2 - uClouds*0.5, c);
            vec3 cc = mix(vec3(1.0,0.98,0.95), uHorizon*0.9, 0.35) * (1.0 - uNight*0.85);
            col = mix(col, cc, cov * smoothstep(0.0, 0.25, h) * 0.9);
          }
          col = mix(col, uDustColor * (1.0-uNight*0.8), uDust * (1.0 - smoothstep(0.0, 0.6, h)) * 0.85);
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(900, 24, 16), skyMat);
    this.sky.frustumCulled = false;
    this.sky.renderOrder = -10;
    scene.add(this.sky);

    this.tmpTop = new THREE.Color();
    this.tmpHor = new THREE.Color();
    this.tmpA = new THREE.Color();
    this.tmpB = new THREE.Color();
    void renderer;
  }

  get hours() { return this.time / 60; }

  setWeather(w, instant = false) {
    this.weatherTarget = w;
    this.weatherT = instant ? 1 : 0;
    if (instant) this.weather = w;
  }

  current(field) {
    const a = WEATHER[this.weather][field], b = WEATHER[this.weatherTarget][field];
    return lerp(a, b, this.weatherT);
  }

  update(dt, camPos, realT) {
    this.time = (this.time + dt) % 1440; // 1 segundo real = 1 minuto de juego
    const h = this.hours;

    // clima
    if (this.weatherT < 1) {
      this.weatherT = Math.min(1, this.weatherT + dt / 40);
      if (this.weatherT >= 1) this.weather = this.weatherTarget;
    }
    this.nextWeatherChange -= dt;
    if (this.nextWeatherChange <= 0 && !this.forcedWeather) {
      this.nextWeatherChange = 240 + Math.random() * 360;
      const r = Math.random();
      this.setWeather(r < 0.45 ? 'despejado' : r < 0.7 ? 'nublado' : r < 0.93 ? 'ventoso' : 'temporal');
    }
    if (this.forcedWeather && this.weatherTarget !== this.forcedWeather) this.setWeather(this.forcedWeather);

    // viento con ráfagas
    const base = this.current('wind');
    const g = noise2(realT * 0.35, 3.7) * 0.7 + noise2(realT * 1.3, 8.1) * 0.3;
    this.gust = g;
    this.windSpeed = base * (0.65 + g * 0.7);
    const ang = 0.15 + (noise2(realT * 0.05, 1.1) - 0.5) * 0.6;
    this.windDir.set(Math.cos(ang), Math.sin(ang));

    // colores
    let i = 0;
    while (i < KEYS.length - 2 && KEYS[i + 1][0] < h) i++;
    const k0 = KEYS[i], k1 = KEYS[i + 1];
    const t = clamp((h - k0[0]) / (k1[0] - k0[0]), 0, 1);
    this.tmpTop.setHex(k0[1]).lerp(this.tmpA.setHex(k1[1]), t);
    this.tmpHor.setHex(k0[2]).lerp(this.tmpB.setHex(k1[2]), t);
    const light = lerp(k0[3], k1[3], t);
    this.dayLight = light;
    this.night = clamp(1 - (light - 0.16) / 0.5, 0, 1);

    const clouds = this.current('clouds');
    const dust = this.current('dust');
    this.dust = dust;
    const grey = this.tmpA.setRGB(0.62, 0.64, 0.66).multiplyScalar(light);
    this.tmpTop.lerp(grey, clouds * 0.55);
    this.tmpHor.lerp(grey, clouds * 0.4);
    const dustCol = this.tmpB.setRGB(0.66, 0.56, 0.4).multiplyScalar(0.35 + light * 0.65);
    this.tmpHor.lerp(dustCol, dust * 0.7);

    const U = this.skyUniforms;
    U.uTop.value.copy(this.tmpTop);
    U.uHorizon.value.copy(this.tmpHor);
    U.uClouds.value = clouds;
    U.uTime.value = realT;
    U.uNight.value = this.night;
    U.uDust.value = dust * 0.6;

    // sol
    const sunAng = ((h - 7) / 13) * Math.PI; // 7h amanece, 20h anochece
    const elev = Math.sin(sunAng);
    // versión realista: el sol de Comodoro (45° Sur) va por el norte (-z) y sube menos
    const sx = -Math.cos(sunAng), sy = Math.max(elev, -0.3) * (this.realSun ? 0.78 : 1), sz = this.realSun ? -0.62 : 0.35;
    U.uSunDir.value.set(sx, sy, sz).normalize();
    const low = 1 - smoothstep(0.0, 0.35, elev);
    U.uSunColor.value.setRGB(1, lerp(0.92, 0.55, low), lerp(0.8, 0.35, low));

    this.fog.color.copy(this.tmpHor);
    this.fog.near = this.current('fogNear') * this.fogScale;
    this.fog.far = this.current('fogFar') * lerp(1, 0.75, this.night) * this.fogScale;

    const sunI = Math.max(0, elev) > 0 ? lerp(0.3, 2.4, smoothstep(0, 0.5, elev)) * (1 - clouds * 0.45) * (1 - dust * 0.4) : 0;
    this.sun.intensity = sunI + this.night * 0.25;
    this.sun.color.copy(U.uSunColor.value);
    if (elev <= 0) this.sun.color.setRGB(0.55, 0.62, 0.9); // luz de luna
    const L = elev > 0 ? U.uSunDir.value : this.moonDir;
    // centro del mapa de sombras encajado a la grilla de texels (evita el "titileo" al moverse)
    const Ld = this.tmpLd || (this.tmpLd = new THREE.Vector3());
    Ld.set(L.x, Math.max(0.2, L.y), L.z).normalize();
    const R = this.shadowR.set(0, 1, 0).cross(Ld).normalize();
    const Up = this.shadowU.copy(Ld).cross(R);
    const texel = (SHADOW_R * 2) / this.sun.shadow.mapSize.x;
    const C = this.shadowC.copy(camPos);
    const r = Math.round(C.dot(R) / texel) * texel, u = Math.round(C.dot(Up) / texel) * texel, f = C.dot(Ld);
    C.copy(R).multiplyScalar(r).addScaledVector(Up, u).addScaledVector(Ld, f);
    this.sun.target.position.copy(C);
    this.sun.position.copy(C).addScaledVector(Ld, 260);
    this.sun.target.updateMatrixWorld();
    this.hemi.intensity = lerp(0.35, 1.25, light) * (1 + clouds * 0.1);
    this.hemi.color.copy(this.tmpTop).lerp(this.tmpA.setRGB(1, 1, 1), 0.55);
    this.hemi.groundColor.setRGB(0.55, 0.47, 0.35).multiplyScalar(lerp(0.4, 1, light));

    this.sky.position.copy(camPos);
  }

  weatherName() { return WEATHER[this.weatherT > 0.5 ? this.weatherTarget : this.weather].name; }

  clockString() {
    const hh = Math.floor(this.time / 60), mm = Math.floor(this.time % 60);
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }
}

export { WEATHER };
