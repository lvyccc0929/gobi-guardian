import { SceneManager } from './core/SceneManager.js';
import { AudioManager } from './core/AudioManager.js';
import { BootScene } from './scenes/BootScene.js';
import { Scene1Satellite } from './scenes/Scene1_Satellite.js';
import { SCENES, DESIGN_WIDTH, DESIGN_HEIGHT } from './utils/Constants.js';

class App {
  constructor() {
    this.sceneManager = new SceneManager();
    this.audioManager = new AudioManager();
    this.renderer = null;
    this.width = DESIGN_WIDTH;
    this.height = DESIGN_HEIGHT;
    this.rafId = null;
    this.lastTime = 0;
  }

  async init() {
    // Set up WebGL renderer
    this._setupRenderer();

    // Initialize audio (requires user gesture, deferred)
    await this.audioManager.init();

    // Init scene manager with renderer
    this.sceneManager.init(this.renderer);

    // Register scenes
    this.sceneManager.registerScene(SCENES.BOOT, new BootScene());
    this.sceneManager.registerScene(SCENES.SCENE_1, new Scene1Satellite());

    // Scene 1-6 + Finale will be registered lazily or here (stubs for now)
    // We'll add them in their respective phases

    // Handle resize
    window.addEventListener('resize', () => this._onResize());
    this._onResize();

    // First user interaction: resume audio, enter boot scene
    const resumeAudio = () => {
      this.audioManager.resume();
      document.removeEventListener('touchstart', resumeAudio);
      document.removeEventListener('click', resumeAudio);
    };
    document.addEventListener('touchstart', resumeAudio, { once: true });
    document.addEventListener('click', resumeAudio, { once: true });

    // Hide loading screen and start
    this._hideLoading();

    // Start with boot scene
    await this.sceneManager.goto(SCENES.BOOT);

    // Start render loop
    this._startLoop();
  }

  _setupRenderer() {
    const container = document.getElementById('scene-container');
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(this.renderer.domElement);

    // Style the canvas
    this.renderer.domElement.style.cssText = `
      position:absolute; top:0; left:0; width:100%; height:100%;
    `;
  }

  _hideLoading() {
    const loading = document.getElementById('loading-screen');
    if (loading) {
      setTimeout(() => {
        loading.classList.add('hidden');
        setTimeout(() => {
          if (loading.parentNode) loading.parentNode.removeChild(loading);
        }, 600);
      }, 300);
    }
  }

  _onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (this.renderer) {
      this.renderer.setSize(this.width, this.height, false);
    }

    if (this.sceneManager) {
      this.sceneManager.resize(this.width, this.height);
    }
  }

  _startLoop() {
    const loop = (time) => {
      this.rafId = requestAnimationFrame(loop);
      const dt = Math.min((time - this.lastTime) / 1000, 0.1); // cap delta
      this.lastTime = time;

      this.sceneManager.update(dt);
      this.sceneManager.render();
    };
    this.rafId = requestAnimationFrame(loop);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.sceneManager.destroy();
    this.audioManager.destroy();
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

// Boot
const app = new App();
app.init().catch(console.error);

// Expose for debugging
window.__app = app;

