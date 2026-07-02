import { SCENES, TRANSITIONS } from '../utils/Constants.js';
import { TransitionSystem } from './TransitionSystem.js';

class SceneManager {
  constructor() {
    this.currentScene = null;
    this.scenes = new Map();
    this.transitionSystem = null;
    this.isTransitioning = false;

    this.onSceneChange = null;
  }

  init(renderer) {
    this.transitionSystem = new TransitionSystem(renderer);
  }

  registerScene(name, scene) {
    this.scenes.set(name, scene);
    scene.manager = this;
  }

  async goto(targetScene, transitionType) {
    if (this.isTransitioning) return;
    if (this.currentScene === targetScene) return;

    this.isTransitioning = true;

    const from = this.currentScene;
    const to = targetScene;

    const fromScene = from ? this.scenes.get(from) : null;
    const toScene = this.scenes.get(to);

    if (!toScene) {
      this.isTransitioning = false;
      return;
    }

    // Preload target scene
    await toScene.preload();

    if (transitionType && this.transitionSystem) {
      // Shader transition
      await this.transitionSystem.execute(fromScene, toScene, transitionType);
    } else {
      // Simple crossfade
      if (fromScene) await fromScene.hide();
      await toScene.show();
    }

    if (fromScene) fromScene.deactivate();

    this.currentScene = to;
    toScene.activate();

    this.isTransitioning = false;

    if (this.onSceneChange) {
      this.onSceneChange(to, from);
    }
  }

  update(dt) {
    if (this.currentScene) {
      const scene = this.scenes.get(this.currentScene);
      if (scene && scene.update) scene.update(dt);
    }
    if (this.transitionSystem) {
      this.transitionSystem.update(dt);
    }
  }

  render() {
    if (this.currentScene) {
      const scene = this.scenes.get(this.currentScene);
      if (scene && scene.render) scene.render();
    }
  }

  resize(width, height) {
    this.scenes.forEach(scene => {
      if (scene.resize) scene.resize(width, height);
    });
    if (this.transitionSystem) {
      this.transitionSystem.resize(width, height);
    }
  }

  destroy() {
    this.scenes.forEach(scene => {
      if (scene.destroy) scene.destroy();
    });
    this.scenes.clear();
    if (this.transitionSystem) this.transitionSystem.destroy();
  }
}

export { SceneManager };
