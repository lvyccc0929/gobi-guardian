class ResourceLoader {
  constructor() {
    this.textures = new Map();
    this.audioBuffers = new Map();
    this.loadedCount = 0;
    this.totalCount = 0;
    this.onProgress = null;
    this.onComplete = null;
  }

  async loadAll(manifest) {
    this.totalCount = manifest.length;
    this.loadedCount = 0;

    const promises = manifest.map(item => this._loadItem(item));
    await Promise.allSettled(promises);

    if (this.onComplete) this.onComplete();
  }

  async _loadItem(item) {
    try {
      switch (item.type) {
        case 'texture':
          await this._loadTexture(item);
          break;
        case 'audio':
          await this._loadAudio(item);
          break;
        case 'json':
          await this._loadJSON(item);
          break;
      }
    } catch (e) {
      console.warn(`Failed to load: ${item.key}`, e);
    }

    this.loadedCount++;
    if (this.onProgress) {
      this.onProgress(this.loadedCount / this.totalCount);
    }
  }

  async _loadTexture(item) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        item.url,
        texture => {
          if (item.minFilter) texture.minFilter = item.minFilter;
          if (item.magFilter) texture.magFilter = item.magFilter;
          this.textures.set(item.key, texture);
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }

  async _loadAudio(item) {
    if (!item.audioContext) return;
    try {
      const response = await fetch(item.url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await item.audioContext.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(item.key, audioBuffer);
    } catch (e) {
      console.warn(`Audio load failed: ${item.key}`, e);
    }
  }

  async _loadJSON(item) {
    const response = await fetch(item.url);
    const data = await response.json();
    this.textures.set(item.key, data); // store in textures map for simplicity
  }

  getTexture(key) {
    return this.textures.get(key) || null;
  }

  getAudio(key) {
    return this.audioBuffers.get(key) || null;
  }

  get progress() {
    if (this.totalCount === 0) return 0;
    return this.loadedCount / this.totalCount;
  }

  destroy() {
    this.textures.forEach(t => {
      if (t && t.dispose) t.dispose();
    });
    this.textures.clear();
    this.audioBuffers.clear();
  }
}

export { ResourceLoader };
