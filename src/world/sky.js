import * as THREE from 'three';
import { clamp, lerp, smoothstep, noise2 } from '../util.js';
import { sampleTimecycle, newSample } from './timecycle.js';

// Los colores del cielo, la luz y el filtro de cámara por hora y clima están en timecycle.js
const SHADOW_R = 70;
const WEATHER = {
  despejado: { name: 'Despejado', wind: 9, fogNear: 140, fogFar: 760, clouds: 0.15, dust: 0.0, snow: 0 },
  nublado: { name: 'Nublado', wind: 13, fogNear: 110, fogFar: 600, clouds: 0.75, dust: 0.1, snow: 0 },
  ventoso: { name: 'Viento fuerte', wind: 22, fogNear: 60, fogFar: 430, clouds: 0.35, dust: 0.55, snow: 0 },
  temporal: { name: 'Temporal de viento', wind: 34, fogNear: 15, fogFar: 190, clouds: 0.6, dust: 1.0, snow: 0 },
  // rara vez, en invierno: nieva en Comodoro
  nevada: { name: 'Nevada', wind: 7, fogNear: 40, fogFar: 330, clouds: 0.95, dust: 0.0, snow: 1 },
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
    this.snow = 0;
    this.extraWind = 0;  // eventos: ráfagas y temporal de tierra
    this.extraDust = 0;
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
    this.windSpeed = base * (0.65 + g * 0.7) + this.extraWind * (0.75 + g * 0.5);
    const ang = 0.15 + (noise2(realT * 0.05, 1.1) - 0.5) * 0.6;
    this.windDir.set(Math.cos(ang), Math.sin(ang));

    // colores: la fila de la hora en la tabla del clima actual, mezclada con la del que viene
    const tc = sampleTimecycle(this.weather, this.weatherTarget, this.weatherT, h, this.tc || (this.tc = newSample()));
    this.tmpTop.copy(tc.top);
    this.tmpHor.copy(tc.hor);
    const light = tc.light;
    this.dayLight = light;
    this.night = clamp(1 - (light - 0.16) / 0.5, 0, 1);
    // filtro de color de la cámara (lo aplica el postproceso)
    this.filter = tc.filter;

    const clouds = this.current('clouds');
    const dust = clamp(this.current('dust') + this.extraDust, 0, 1);
    this.dust = dust;
    this.snow = this.current('snow');
    // el polvo de los eventos (ráfagas, temporal de tierra) tiñe el horizonte encima de la tabla
    const dustCol = this.tmpB.setRGB(0.66, 0.56, 0.4).multiplyScalar(0.35 + light * 0.65);
    this.tmpHor.lerp(dustCol, this.extraDust * 0.7);

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
    U.uSunColor.value.setRGB(tc.sun.r, lerp(0.92, 0.55, low) * tc.sun.g, lerp(0.8, 0.35, low) * tc.sun.b);

    this.fog.color.copy(this.tmpHor);
    this.fog.near = lerp(this.current('fogNear'), 8, this.extraDust) * this.fogScale;
    this.fog.far = lerp(this.current('fogFar'), 140, this.extraDust) * lerp(1, 0.75, this.night) * this.fogScale;

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
