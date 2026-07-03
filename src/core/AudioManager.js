class AudioManager {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.masterGain = null;
    this.buses = {};
    this.activeSources = new Set();
  }

  async init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.7;
      this.masterGain.connect(this.ctx.destination);

      // Create audio buses
      this.buses.ambience = this._createBus(0.5); // convolution reverb
      this.buses.sfx = this._createBus(0.7);      // short delay
      this.buses.music = this._createBus(0.6);     // long reverb

      this.initialized = true;
    } catch (e) {
      console.warn('AudioContext not available:', e);
    }
  }

  _createBus(volume) {
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    gain.connect(this.masterGain);
    return gain;
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // === Synth Sounds ===

  beep(freq = 1000, duration = 80, bus = 'sfx') {
    if (!this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(this.buses[bus] || this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration / 1000);
    this.activeSources.add(osc);
    osc.onended = () => this.activeSources.delete(osc);
  }

  tripleBeep(freqs = [800, 1200, 1600], durations = [50, 50, 150]) {
    if (!this.initialized) return;
    let offset = 0;
    for (let i = 0; i < freqs.length; i++) {
      setTimeout(() => this.beep(freqs[i], durations[i]), offset);
      offset += durations[i] + 20;
    }
  }

  sweep(fromFreq = 200, toFreq = 4000, duration = 1000, bus = 'sfx') {
    if (!this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(fromFreq, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(toFreq, this.ctx.currentTime + duration / 1000);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(this.buses[bus] || this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration / 1000);
  }

  heartbeat() {
    if (!this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();

    osc.type = 'sine';
    osc.frequency.value = 40;

    lfo.type = 'sine';
    lfo.frequency.value = 1.2; // BPM ~72
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.15;

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(this.buses.music || this.masterGain);

    osc.start();
    lfo.start();
    return { osc, lfo, gain, stop: () => { osc.stop(); lfo.stop(); } };
  }

  engine(speed = 0.5, bus = 'sfx') {
    if (!this.initialized) return null;
    // White noise → bandpass filter → speed-modulated gain
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 80 + speed * 200;
    filter.Q.value = 0.5;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.08 * speed;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.buses[bus] || this.masterGain);
    source.start();

    return {
      source, filter, gain,
      setSpeed: (s) => {
        filter.frequency.value = 80 + s * 200;
        gain.gain.value = 0.08 * Math.max(s, 0.1);
      },
      stop: () => source.stop(),
    };
  }

  drone(freqs = [60, 120, 180, 240], bus = 'ambience') {
    if (!this.initialized) return null;
    const oscillators = freqs.map(f => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f + (Math.random() - 0.5) * 4; // slight detune
      gain.gain.value = 0.03 / freqs.length;
      osc.connect(gain);
      gain.connect(this.buses[bus] || this.masterGain);
      osc.start();
      return { osc, gain };
    });
    return {
      oscillators,
      stop: () => oscillators.forEach(o => o.osc.stop()),
    };
  }

  playBuffer(key, loader, bus = 'sfx') {
    if (!this.initialized) return;
    const buffer = loader ? loader.getAudio(key) : null;
    if (!buffer) return;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.buses[bus] || this.masterGain);
    source.start();
    return source;
  }

  // === Vibration ===

  vibrate(pattern) {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  vibrateShort() { this.vibrate(15); }
  vibrateMedium() { this.vibrate(200); }
  vibrateSuccess() { this.vibrate([15, 30, 15]); }

  setMasterVolume(v) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, v));
    }
  }

  destroy() {
    this.activeSources.forEach(s => {
      try { s.stop(); } catch (e) { /* already stopped */ }
    });
    this.activeSources.clear();
    if (this.ctx) {
      this.ctx.close();
    }
  }
}

export { AudioManager };
