import { COLORS_HEX, TIMING } from '../utils/Constants.js';

class BootScene {
  constructor() {
    this.name = 'boot';
    this.manager = null;
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.active = false;
    this.visible = false;
    this.ready = false;

    // Animation state
    this.startTime = 0;
    this.titleParticles = [];
    this.titleFormed = false;
    this.subtitleText = '';
    this.subtitleComplete = false;
    this.hintVisible = false;

    // "戈壁守望者" pixel data
    this.titleGlyphs = [];
  }

  async preload() {
    if (this.ready) return;
    this.ready = true;
  }

  async show() {
    this.visible = true;
    this._setupDOM();
    this._setupCanvas();
    this._precomputeTitleGlyphs();
    this._initTitleParticles();
    this.startTime = performance.now();
    this.titleFormed = false;
    this.subtitleText = '';
    this.subtitleComplete = false;
    this.hintVisible = false;

    if (this.container) {
      this.container.style.display = 'block';
      this.container.style.opacity = '1';
    }
  }

  async hide() {
    this.visible = false;
    if (this.container) {
      this.container.style.opacity = '0';
      setTimeout(() => {
        if (this.container && !this.visible) {
          this.container.style.display = 'none';
        }
      }, 300);
    }
  }

  activate() {
    this.active = true;
    this._bindEvents();
  }

  deactivate() {
    this.active = false;
    this._unbindEvents();
  }

  _setupDOM() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.className = 'scene-wrapper';
    this.container.style.cssText = 'position:absolute;inset:0;background:#000;display:block;z-index:10;';

    // GPS Dot
    this.gpsDot = document.createElement('div');
    this.gpsDot.style.cssText = `
      position:absolute; width:6px; height:6px; border-radius:50%;
      background:${COLORS_HEX.signalGreen};
      left:50%; top:45%; transform:translate(-50%,-50%);
      box-shadow: 0 0 8px rgba(0,255,136,0.6), 0 0 20px rgba(0,255,136,0.3);
      opacity:0;
    `;
    this.container.appendChild(this.gpsDot);

    // Grid lines
    this.gridContainer = document.createElement('div');
    this.gridContainer.style.cssText = 'position:absolute;inset:0;opacity:0;';
    this.container.appendChild(this.gridContainer);

    // Title container (for DOM fallback)
    this.titleEl = document.createElement('div');
    this.titleEl.style.cssText = `
      position:absolute; left:0; right:0; top:42%; text-align:center;
      font-family:'Noto Serif SC',serif; font-size:48px; font-weight:700;
      color:${COLORS_HEX.skyWhite}; letter-spacing:8px; opacity:0;
    `;
    this.titleEl.textContent = '戈壁守望者';
    this.container.appendChild(this.titleEl);

    // Subtitle
    this.subtitleEl = document.createElement('div');
    this.subtitleEl.style.cssText = `
      position:absolute; left:0; right:0; top:52%; text-align:center;
      font-family:'Noto Sans SC',sans-serif; font-size:14px; font-weight:400;
      color:${COLORS_HEX.gobiEarth}; letter-spacing:4px; opacity:0;
    `;
    this.container.appendChild(this.subtitleEl);

    // Hint
    this.hintContainer = document.createElement('div');
    this.hintContainer.style.cssText = `
      position:absolute; left:0; right:0; bottom:80px; text-align:center; opacity:0;
    `;
    this.hintContainer.innerHTML = `
      <div style="width:80px;height:1px;background:rgba(139,115,85,0.3);margin:0 auto 12px;"></div>
      <div style="font-family:'Noto Sans SC',sans-serif;font-size:13px;font-weight:300;color:rgba(245,240,232,0.6);">基于真实事件改编</div>
      <div style="font-family:'Noto Sans SC',sans-serif;font-size:14px;font-weight:400;color:rgba(245,240,232,0.8);margin-top:4px;">滑动屏幕，开启这段旅程</div>
      <div style="margin-top:8px;color:rgba(245,240,232,0.5);" class="float-vertical">▼</div>
    `;
    this.container.appendChild(this.hintContainer);

    document.getElementById('scene-container').appendChild(this.container);
  }

  _setupCanvas() {
    // Canvas for particle title effect
    this.canvas = document.createElement('canvas');
    this.canvas.width = 393 * 2; // @2x
    this.canvas.height = 852 * 2;
    this.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:11;';
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(2, 2);
    this.container.appendChild(this.canvas);
  }

  _precomputeTitleGlyphs() {
    // Draw title text on offscreen canvas to get pixel data
    const offscreen = document.createElement('canvas');
    offscreen.width = 393;
    offscreen.height = 200;
    const octx = offscreen.getContext('2d');
    octx.font = '700 48px "Noto Serif SC", serif';
    octx.fillStyle = '#fff';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillText('戈壁守望者', 196.5, 100);

    const imageData = octx.getImageData(0, 0, 393, 200);
    this.titleGlyphs = [];
    // Sample at intervals for particle targets
    for (let y = 0; y < 200; y += 3) {
      for (let x = 0; x < 393; x += 3) {
        const idx = (y * 393 + x) * 4;
        if (imageData.data[idx + 3] > 128) {
          // Map to screen coordinates (title centered, top ~42%)
          const sx = x + (0); // already centered in offscreen
          const sy = y + (393 * 0.42 - 100); // map to screen position
          this.titleGlyphs.push({ x: sx, y: sy });
        }
      }
    }
  }

  _initTitleParticles() {
    this.titleParticles = this.titleGlyphs.map((target, i) => ({
      x: 393 / 2 + (Math.random() - 0.5) * 300,
      y: 393 * 0.42 + (Math.random() - 0.5) * 200,
      tx: target.x,
      ty: target.y,
      size: 2 + Math.random() * 2,
      color: Math.random() > 0.5 ? COLORS_HEX.gobiSand : COLORS_HEX.gravelBlack,
      delay: Math.random() * 0.3,
    }));
  }

  _bindEvents() {
    this._onClick = () => {
      if (this.manager && this.subtitleComplete) {
        this.manager.goto('scene1_satellite', 'pixel_dissolve');
      }
    };
    this.container.addEventListener('click', this._onClick);
  }

  _unbindEvents() {
    if (this._onClick) {
      this.container.removeEventListener('click', this._onClick);
    }
  }

  update(dt) {
    if (!this.active) return;
    const elapsed = (performance.now() - this.startTime) / 1000;

    // t=0.0: GPS dot appears
    if (elapsed >= 0.0 && this.gpsDot.style.opacity === '0') {
      this.gpsDot.style.opacity = '1';
      this.gpsDot.style.transition = 'opacity 0.5s';
    }

    // t=0.2: breathing animation (via CSS class)
    if (elapsed >= 0.2 && !this.gpsDot.classList.contains('breathing')) {
      this.gpsDot.classList.add('breathing');
      this.gpsDot.style.animation = 'loadingPulse 2s ease-in-out infinite';
    }

    // t=1.5: Grid lines
    if (elapsed >= 1.5 && this.gridContainer.style.opacity === '0') {
      this.gridContainer.style.opacity = '0.15';
      this.gridContainer.style.transition = 'opacity 0.8s';
      this._drawGrid();
      setTimeout(() => {
        this.gridContainer.style.opacity = '0';
      }, 1300);
    }

    // t=2.5: Title particles converge
    if (elapsed >= 2.5 && !this.titleFormed) {
      const convergeProgress = Math.min((elapsed - 2.5) / 0.8, 1.0);
      this._updateTitleParticles(convergeProgress);
      if (convergeProgress >= 1.0) {
        this.titleFormed = true;
        this.titleEl.style.opacity = '1';
        this.titleEl.style.transition = 'opacity 0.3s';
      }
    }

    // t=3.5: Subtitle typewriter
    if (elapsed >= 3.5 && !this.subtitleComplete) {
      const typeProgress = (elapsed - 3.5) * 1000;
      const fullText = 'GUARDIAN OF THE GOBI';
      const charCount = Math.min(Math.floor(typeProgress / 80), fullText.length);
      this.subtitleText = fullText.slice(0, charCount);
      this.subtitleEl.textContent = this.subtitleText + (charCount < fullText.length ? '|' : '');
      this.subtitleEl.style.opacity = '1';
      this.subtitleEl.style.transition = 'opacity 0.3s';
      if (charCount >= fullText.length) {
        this.subtitleComplete = true;
        this.subtitleEl.textContent = fullText;
      }
    }

    // t=4.5: Hint
    if (elapsed >= 4.5 && !this.hintVisible) {
      this.hintVisible = true;
      this.hintContainer.style.opacity = '1';
      this.hintContainer.style.transition = 'opacity 0.6s';
    }
  }

  _drawGrid() {
    this.gridContainer.innerHTML = '';
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.cssText = 'position:absolute;inset:0;';

    const cx = '50%', cy = '45%';
    const spacing = 24;
    for (let i = -10; i <= 10; i++) {
      const hline = document.createElementNS(svgNS, 'line');
      hline.setAttribute('x1', '0');
      hline.setAttribute('x2', '100%');
      hline.setAttribute('y1', `${45 + i * (spacing / 852 * 100)}%`);
      hline.setAttribute('y2', `${45 + i * (spacing / 852 * 100)}%`);
      hline.setAttribute('stroke', COLORS_HEX.signalGreen);
      hline.setAttribute('stroke-opacity', '0.15');
      hline.setAttribute('stroke-width', '0.5');
      svg.appendChild(hline);

      const vline = document.createElementNS(svgNS, 'line');
      vline.setAttribute('y1', '0');
      vline.setAttribute('y2', '100%');
      vline.setAttribute('x1', `${50 + i * (spacing / 393 * 100)}%`);
      vline.setAttribute('x2', `${50 + i * (spacing / 393 * 100)}%`);
      vline.setAttribute('stroke', COLORS_HEX.signalGreen);
      vline.setAttribute('stroke-opacity', '0.15');
      vline.setAttribute('stroke-width', '0.5');
      svg.appendChild(vline);
    }
    this.gridContainer.appendChild(svg);
  }

  _updateTitleParticles(progress) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 393, 852);

    const eased = 1 - Math.pow(1 - progress, 3); // ease-out

    for (const p of this.titleParticles) {
      const localProgress = Math.max(0, Math.min(1, (eased - p.delay) / (1 - p.delay)));
      if (localProgress <= 0) continue;
      const x = p.x + (p.tx - p.x) * localProgress;
      const y = p.y + (p.ty - p.y) * localProgress;

      // Color transitions from sand to gravel
      const r = parseInt(p.color.slice(1, 3), 16);
      const g = parseInt(p.color.slice(3, 5), 16);
      const b = parseInt(p.color.slice(5, 7), 16);
      const alpha = 0.7 + 0.3 * localProgress;

      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fillRect(x - p.size / 2, y - p.size / 2, p.size * localProgress, p.size * localProgress);
    }
  }

  render() {
    // DOM-driven, no WebGL render needed
  }

  resize(w, h) {
    if (this.canvas) {
      this.canvas.width = w * 2;
      this.canvas.height = h * 2;
      if (this.ctx) {
        this.ctx.setTransform(2, 0, 0, 2, 0, 0);
      }
    }
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

export { BootScene };
