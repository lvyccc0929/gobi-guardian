import { TRANSITIONS, TIMING } from '../utils/Constants.js';

// Shader sources for 5 transition effects
const SHADERS = {
  vertex: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  pixelDissolve: `
    uniform sampler2D tFrom;
    uniform sampler2D tTo;
    uniform float uProgress;
    uniform vec2 uCenter;
    uniform float uTime;
    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      float dist = distance(uv, uCenter);
      float threshold = uProgress * 1.5;
      float noise = random(floor(uv * 40.0));
      float dissolve = smoothstep(threshold - 0.15, threshold + 0.15, dist + noise * 0.2);
      vec4 fromColor = texture2D(tFrom, uv);
      vec4 toColor = texture2D(tTo, uv);
      gl_FragColor = mix(fromColor, toColor, dissolve);
    }
  `,

  sandstormWipe: `
    uniform sampler2D tFrom;
    uniform sampler2D tTo;
    uniform float uProgress;
    uniform float uTime;
    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      float wipe = uProgress * 1.3;
      float noise = random(vec2(uv.y * 30.0, uTime * 0.5)) * 0.15;
      float reveal = smoothstep(wipe - 0.1 - noise, wipe + 0.1 + noise, uv.x);
      vec4 fromColor = texture2D(tFrom, uv);
      vec4 toColor = texture2D(tTo, uv);

      // Sand color overlay on wipe edge
      vec3 sandColor = vec3(0.769, 0.643, 0.424);
      float edge = 1.0 - abs(uv.x - wipe) * 5.0;
      edge = clamp(edge, 0.0, 1.0) * 0.3;

      vec4 color = mix(fromColor, toColor, reveal);
      color.rgb = mix(color.rgb, sandColor, edge);
      gl_FragColor = color;
    }
  `,

  gravelShatter: `
    uniform sampler2D tFrom;
    uniform sampler2D tTo;
    uniform float uProgress;
    uniform vec2 uCenter;
    uniform float uTime;
    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      vec2 dir = uv - uCenter;
      float dist = length(dir);
      float angle = atan(dir.y, dir.x);
      float cell = random(vec2(floor(angle * 6.0), floor(dist * 8.0)));
      float shatter = uProgress * 1.8;
      float displace = (shatter - cell * 0.3) * (1.0 + dist);
      float reveal = smoothstep(displace - 0.05, displace + 0.05, dist);

      // Fragment rotation
      float rot = random(vec2(cell)) * uProgress * 6.28;
      mat2 rotMat = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
      vec2 fragUV = uv + dir * uProgress * 0.3 * cell;
      fragUV = uCenter + rotMat * (fragUV - uCenter);

      vec4 fromColor = texture2D(tFrom, fragUV);
      vec4 toColor = texture2D(tTo, uv);
      gl_FragColor = mix(fromColor, toColor, reveal);
    }
  `,

  satelliteScan: `
    uniform sampler2D tFrom;
    uniform sampler2D tTo;
    uniform float uProgress;
    uniform float uTime;
    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      float scanPos = uProgress;
      float scanWidth = 0.04;
      float dist = abs(uv.y - scanPos);
      float scan = smoothstep(scanWidth, scanWidth - 0.02, dist);

      // Noise near scan line
      float noise = random(vec2(uv.y * 100.0, uTime * 10.0)) * 0.1;
      float noiseZone = 1.0 - smoothstep(0.0, scanWidth * 2.0, dist);
      noise *= noiseZone;

      float reveal = smoothstep(scanPos - scanWidth, scanPos + scanWidth, uv.y);

      vec4 fromColor = texture2D(tFrom, uv);
      vec4 toColor = texture2D(tTo, uv);
      vec4 color = mix(fromColor, toColor, reveal);

      // Add scan line glow
      color.rgb += vec3(0.0, 1.0, 0.53) * scan * 0.3;
      color.rgb += noise;

      // Desaturate unscanned area
      float gray = dot(fromColor.rgb, vec3(0.299, 0.587, 0.114));
      vec3 desat = mix(fromColor.rgb, vec3(gray), 0.5);
      color.rgb = mix(desat, color.rgb, reveal);

      gl_FragColor = color;
    }
  `,

  glowExpand: `
    uniform sampler2D tFrom;
    uniform sampler2D tTo;
    uniform float uProgress;
    uniform vec2 uCenter;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      float dist = distance(uv, uCenter);
      float maxDist = 1.5;
      float glowRadius = uProgress * maxDist;
      float glowWidth = 0.08;

      float glow = 1.0 - smoothstep(glowRadius - glowWidth, glowRadius, dist);
      float reveal = smoothstep(glowRadius - glowWidth * 0.5, glowRadius, dist);

      vec4 fromColor = texture2D(tFrom, uv);
      vec4 toColor = texture2D(tTo, uv);
      vec4 color = mix(fromColor, toColor, reveal);

      // Golden glow overlay
      vec3 glowColor = mix(vec3(1.0, 0.843, 0.0), vec3(1.0, 1.0, 1.0), glow);
      color.rgb = mix(color.rgb, glowColor, glow * 0.6);

      gl_FragColor = color;
    }
  `,
};

export class TransitionSystem {
  constructor(renderer) {
    this.renderer = renderer;
    this.width = 393;
    this.height = 852;

    // Create offscreen render targets
    const rtOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    };

    this.rtFrom = new THREE.WebGLRenderTarget(393, 852, rtOptions);
    this.rtTo = new THREE.WebGLRenderTarget(393, 852, rtOptions);

    // Fullscreen quad
    this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
    this.scene = new THREE.Scene();

    // Compile all shader materials
    this.materials = {};
    for (const [name, frag] of Object.entries(SHADERS)) {
      if (name === 'vertex') continue;
      this.materials[name] = new THREE.ShaderMaterial({
        vertexShader: SHADERS.vertex,
        fragmentShader: frag,
        uniforms: {
          tFrom: { value: null },
          tTo: { value: null },
          uProgress: { value: 0 },
          uCenter: { value: new THREE.Vector2(0.5, 0.48) },
          uTime: { value: 0 },
        },
      });
    }

    this.quad = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      this.materials.pixelDissolve
    );
    this.scene.add(this.quad);

    this.active = false;
    this.activeTransition = null;
    this.fromScene = null;
    this.toScene = null;
    this.progress = 0;
    this.startTime = 0;
    this.resolveCb = null;
  }

  async execute(fromScene, toScene, transitionType) {
    return new Promise(resolve => {
      this.resolveCb = resolve;
      this.fromScene = fromScene;
      this.toScene = toScene;
      this.progress = 0;
      this.active = true;
      this.startTime = performance.now();

      const matName = this._getMaterialName(transitionType);
      this.activeTransition = matName;
      this.quad.material = this.materials[matName];

      // Show target scene
      if (toScene) toScene.show();

      // Render both scenes to textures
      this._renderToTargets();
    });
  }

  _getMaterialName(type) {
    const map = {
      [TRANSITIONS.PIXEL_DISSOLVE]: 'pixelDissolve',
      [TRANSITIONS.SANDSTORM_WIPE]: 'sandstormWipe',
      [TRANSITIONS.GRAVEL_SHATTER]: 'gravelShatter',
      [TRANSITIONS.SATELLITE_SCAN]: 'satelliteScan',
      [TRANSITIONS.GLOW_EXPAND]: 'glowExpand',
    };
    return map[type] || 'pixelDissolve';
  }

  _renderToTargets() {
    if (!this.active) return;
    if (!this.renderer) return;

    const origTarget = this.renderer.getRenderTarget();

    // Render from scene
    if (this.fromScene && this.fromScene.threeScene) {
      this.renderer.setRenderTarget(this.rtFrom);
      this.renderer.render(
        this.fromScene.threeScene,
        this.fromScene.camera || this.camera
      );
    }

    // Render to scene
    if (this.toScene && this.toScene.threeScene) {
      this.renderer.setRenderTarget(this.rtTo);
      this.renderer.render(
        this.toScene.threeScene,
        this.toScene.camera || this.camera
      );
    }

    this.renderer.setRenderTarget(origTarget);
  }

  update(dt) {
    if (!this.active) return;

    const elapsed = (performance.now() - this.startTime) / 1000;
    const duration = TIMING.TRANSITION_DURATION / 1000;
    this.progress = Math.min(elapsed / duration, 1.0);

    const mat = this.quad.material;
    if (mat.uniforms) {
      mat.uniforms.uProgress.value = this.progress;
      mat.uniforms.uTime.value = elapsed;
      mat.uniforms.tFrom.value = this.rtFrom.texture;
      mat.uniforms.tTo.value = this.rtTo.texture;
    }

    // Render fullscreen quad
    if (this.renderer) {
      const origTarget = this.renderer.getRenderTarget();
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.camera);
      this.renderer.setRenderTarget(origTarget);
    }

    if (this.progress >= 1.0) {
      this.active = false;

      // Hide from scene
      if (this.fromScene) this.fromScene.hide();

      if (this.resolveCb) {
        this.resolveCb();
        this.resolveCb = null;
      }
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.rtFrom.setSize(width, height);
    this.rtTo.setSize(width, height);
  }

  destroy() {
    this.rtFrom.dispose();
    this.rtTo.dispose();
    Object.values(this.materials).forEach(m => m.dispose());
    this.quad.geometry.dispose();
  }
}
