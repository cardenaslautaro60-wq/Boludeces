import * as THREE from 'three';

// Filtro "PS2": baja resolución, estela de cuadros (trails) y corrección de color
export class Post {
  constructor(renderer) {
    this.renderer = renderer;
    this.enabled = true;
    this.scale = 1;
    const gl = renderer.getContext();
    const half = !!(gl.getExtension('EXT_color_buffer_half_float') || gl.getExtension('EXT_color_buffer_float'));
    // Los buffers guardan color lineal; la conversión a sRGB se hace al final
    const opts = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, type: half ? THREE.HalfFloatType : THREE.UnsignedByteType };
    this.sceneRT = new THREE.WebGLRenderTarget(4, 4, { ...opts, depthBuffer: true });
    this.histA = new THREE.WebGLRenderTarget(4, 4, opts);
    this.histB = new THREE.WebGLRenderTarget(4, 4, opts);
    this.quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        tScene: { value: null }, tPrev: { value: null },
        uTrail: { value: 0.35 }, uTint: { value: new THREE.Vector3(1.04, 1.0, 0.94) },
        uSat: { value: 1.08 }, uVig: { value: 0.35 }, uFlash: { value: 0 }, uGrey: { value: 0 },
      },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: `
        uniform sampler2D tScene, tPrev; uniform float uTrail, uSat, uVig, uFlash, uGrey; uniform vec3 uTint; varying vec2 vUv;
        // un NaN o infinito en la escena quedaría pegado para siempre en la estela
        bool bad(float x){ return !(x >= 0.0 && x < 60000.0); }
        vec3 safe(vec3 v){ return (bad(v.r) || bad(v.g) || bad(v.b)) ? vec3(0.0) : min(v, vec3(64.0)); }
        void main(){
          vec3 c = texture2D(tScene, vUv).rgb;
          vec3 p = safe(texture2D(tPrev, vUv).rgb);
          c = bad(c.r) || bad(c.g) || bad(c.b) ? p : min(c, vec3(64.0));
          c = mix(c, p, uTrail);
          float l = dot(c, vec3(0.299, 0.587, 0.114));
          c = mix(vec3(l), c, uSat) * uTint;
          c = mix(c, vec3(l * 0.9), uGrey);
          vec2 d = vUv - 0.5;
          c *= 1.0 - dot(d, d) * uVig * 1.6;
          c += uFlash;
          gl_FragColor = vec4(c, 1.0);
        }`,
      depthTest: false, depthWrite: false,
    });
    this.copyMat = new THREE.ShaderMaterial({
      uniforms: { t: { value: null } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: `uniform sampler2D t; varying vec2 vUv;
        vec3 toSRGB(vec3 c){ c = max(c, 0.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
        void main(){ gl_FragColor = vec4(toSRGB(texture2D(t, vUv).rgb), 1.0); }`,
      depthTest: false, depthWrite: false,
    });
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mat);
    this.quad.frustumCulled = false;
    this.quadScene = new THREE.Scene();
    this.quadScene.add(this.quad);
  }

  setSize(w, h, scale) {
    this.scale = scale;
    const W = Math.max(2, Math.floor(w * scale)), H = Math.max(2, Math.floor(h * scale));
    this.sceneRT.setSize(W, H);
    this.histA.setSize(W, H);
    this.histB.setSize(W, H);
  }

  render(scene, camera) {
    const r = this.renderer;
    if (!this.enabled) {
      r.setRenderTarget(null);
      r.render(scene, camera);
      return;
    }
    r.setRenderTarget(this.sceneRT);
    r.render(scene, camera);
    this.quad.material = this.mat;
    this.mat.uniforms.tScene.value = this.sceneRT.texture;
    this.mat.uniforms.tPrev.value = this.histA.texture;
    r.setRenderTarget(this.histB);
    r.render(this.quadScene, this.quadCam);
    this.quad.material = this.copyMat;
    this.copyMat.uniforms.t.value = this.histB.texture;
    r.setRenderTarget(null);
    r.render(this.quadScene, this.quadCam);
    const tmp = this.histA; this.histA = this.histB; this.histB = tmp;
  }
}
