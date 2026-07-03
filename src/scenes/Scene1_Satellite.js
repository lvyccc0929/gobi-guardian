import { COLORS, COLORS_HEX, DESIGN_WIDTH, DESIGN_HEIGHT, TRANSITIONS } from '../utils/Constants.js';

class Scene1Satellite {
  constructor() {
    this.name = 'scene1_satellite';
    this.manager = null;
    this.active = false;
    this.visible = false;
    this.ready = false;

    // Three.js
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.threeScene = null; // for TransitionSystem

    // Objects
    this.earth = null;
    this.atmosphereInner = null;
    this.atmosphereOuter = null;
    this.satelliteParticles = null;
    this.chinaHighlight = null; // TODO: shader-based
    this.trajectoryLine = null;

    // Terrain plane (for zoomed-in view)
    this.terrainPlane = null;
    this.terrainVisible = false;

    // Stage state
    this.stage = 'orbit'; // 'orbit' | 'zooming' | 'terrain' | 'anomaly' | 'comparison'
    this.zoomLevel = 535; // km altitude
    this.targetZoom = 535;
    this.currentZoom = 535;

    // Anomaly
    this.anomalyBox = null;
    this.anomalyConfirmed = false;

    // Comparison slider
    this.splitX = 0.5;
    this.isDraggingSlider = false;
    this.comparisonStage = false;

    // DOM elements
    this.container = null;
    this.hudTop = null;
    this.hudCoords = null;
    this.hudZoom = null;
    this.terminalWindow = null;
    this.sliderHandle = null;
    this.confirmBtn = null;
  }

  async preload() {
    if (this.ready) return;

    // Create Three.js scene
    this.scene = new THREE.Scene();
    this.threeScene = this.scene;

    // Camera - perspective for 3D earth
    this.camera = new THREE.PerspectiveCamera(45, DESIGN_WIDTH / DESIGN_HEIGHT, 0.1, 1000);
    this.camera.position.set(0, 0, 8);

    // Build earth
    this._createEarth();
    this._createAtmosphere();
    this._createSatelliteParticles();
    this._createTrajectory();
    this._createTerrainPlane();

    // Lighting
    const ambient = new THREE.AmbientLight(0x444444);
    this.scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(5, 3, 5);
    this.scene.add(sun);

    this.ready = true;
  }

  _createEarth() {
    // Procedural earth-like sphere (no texture needed for P1 demo)
    const geo = new THREE.SphereGeometry(2, 64, 64);

    // Generate procedural earth colors on vertices
    const colors = [];
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      // Simple continent simulation with noise-like pattern
      const lat = Math.asin(y / 2);
      const lon = Math.atan2(z, x);
      const noiseVal = Math.sin(lon * 5) * Math.cos(lat * 8) + Math.sin(lon * 13 + lat * 7) * 0.5;
      if (noiseVal > 0.1) {
        // Land - brownish green
        colors.push(0.3 + Math.random() * 0.15, 0.4 + Math.random() * 0.15, 0.2 + Math.random() * 0.1);
      } else {
        // Ocean - blue
        colors.push(0.1 + Math.random() * 0.05, 0.25 + Math.random() * 0.1, 0.5 + Math.random() * 0.2);
      }
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.7,
      metalness: 0.05,
    });
    this.earth = new THREE.Mesh(geo, mat);
    this.scene.add(this.earth);
  }

  _createAtmosphere() {
    // Inner atmosphere (Rayleigh scattering blue)
    const geoInner = new THREE.SphereGeometry(2.04, 48, 48);
    const matInner = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = 1.0 - abs(dot(viewDir, vNormal));
          fresnel = pow(fresnel, 3.0);
          float alpha = fresnel * 0.25;
          gl_FragColor = vec4(0.27, 0.53, 0.80, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    this.atmosphereInner = new THREE.Mesh(geoInner, matInner);
    this.scene.add(this.atmosphereInner);

    // Outer atmosphere (Mie scattering white)
    const geoOuter = new THREE.SphereGeometry(2.1, 48, 48);
    const matOuter = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = 1.0 - abs(dot(viewDir, vNormal));
          fresnel = pow(fresnel, 5.0);
          float alpha = fresnel * 0.12;
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    this.atmosphereOuter = new THREE.Mesh(geoOuter, matOuter);
    this.scene.add(this.atmosphereOuter);
  }

  _createSatelliteParticles() {
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.0 + Math.random() * 2.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.04,
      color: COLORS.signalGreen,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.satelliteParticles = new THREE.Points(geo, mat);
    this.scene.add(this.satelliteParticles);
  }

  _createTrajectory() {
    // Dashed line from outside to China region
    const points = [];
    const start = new THREE.Vector3(6, 3, -4);
    const end = new THREE.Vector3(0.8, 1.2, 1.5); // approx China
    for (let i = 0; i <= 30; i++) {
      points.push(new THREE.Vector3().lerpVectors(start, end, i / 30));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineDashedMaterial({
      color: COLORS.confirmGold,
      dashSize: 0.5,
      gapSize: 0.3,
      linewidth: 1,
      transparent: true,
      opacity: 0.7,
    });
    this.trajectoryLine = new THREE.Line(geo, mat);
    this.scene.add(this.trajectoryLine);
  }

  _createTerrainPlane() {
    // Flat ground plane for zoomed-in terrain view
    const geo = new THREE.PlaneGeometry(30, 30, 64, 64);
    const positions = geo.attributes.position;
    // Perlin-like height displacement
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const noise = Math.sin(x * 1.5) * Math.cos(y * 1.8) * 0.3
        + Math.sin(x * 3.7 + y * 2.3) * 0.15
        + Math.cos(x * 6.1 - y * 5.4) * 0.08;
      positions.setZ(i, noise);
    }
    geo.computeVertexNormals();

    const colors = [];
    for (let i = 0; i < positions.count; i++) {
      const z = positions.getZ(i);
      // Color by height: low=alkali, mid=sand, high=gravel
      const r = z < -0.05 ? 0.83 : (z < 0.05 ? 0.77 : 0.36);
      const g = z < -0.05 ? 0.77 : (z < 0.05 ? 0.64 : 0.29);
      const b = z < -0.05 ? 0.66 : (z < 0.05 ? 0.42 : 0.23);
      colors.push(r, g, b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });
    this.terrainPlane = new THREE.Mesh(geo, mat);
    this.terrainPlane.rotation.x = -Math.PI / 2;
    this.terrainPlane.position.y = -8;
    this.terrainPlane.visible = false;
    this.scene.add(this.terrainPlane);
  }

  async show() {
    this.visible = true;
    this._setupDOM();
    if (this.container) {
      this.container.style.display = 'block';
      this.container.style.opacity = '1';
    }
    this.stage = 'orbit';
    this.currentZoom = 535;
    this.camera.position.set(0, 0, 8);
    this.earth.visible = true;
    this.atmosphereInner.visible = true;
    this.atmosphereOuter.visible = true;
    this.terrainPlane.visible = false;
  }

  async hide() {
    this.visible = false;
    if (this.container) {
      this.container.style.opacity = '0';
    }
  }

  activate() {
    this.active = true;
    this._bindEvents();
    this._setupPinchZoom();
  }

  deactivate() {
    this.active = false;
    this._unbindEvents();
  }

  _setupDOM() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.className = 'scene-wrapper';
    this.container.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:10;';

    // HUD Top Bar
    this.hudTop = document.createElement('div');
    this.hudTop.style.cssText = `
      position:absolute;top:0;left:0;right:0;
      padding:44px 20px 12px;
      background:linear-gradient(180deg,rgba(0,0,0,0.7),transparent);
      display:flex;justify-content:space-between;align-items:flex-start;
      font-family:'Noto Sans SC',sans-serif;
    `;
    this.hudTop.innerHTML = `
      <span style="font-size:13px;color:#00D4FF;"> 返回</span>
      <div style="text-align:center;">
        <div style="font-size:14px;font-weight:600;color:#F5F0E8;">吉林一号·光学A星</div>
        <div style="font-size:12px;color:rgba(0,212,255,0.7);">轨道高度 <span id="hud-alt">535</span>km</div>
      </div>
      <span style="font-size:16px;color:rgba(0,212,255,0.6);">ⓘ</span>
    `;
    this.container.appendChild(this.hudTop);

    // HUD Coordinates
    this.hudCoords = document.createElement('div');
    this.hudCoords.style.cssText = `
      position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
      margin-top:170px;
      font-family:'JetBrains Mono',monospace;font-size:15px;color:#00FF88;
      background:rgba(0,0,0,0.5);padding:6px 12px;border-radius:8px;
      text-shadow:0 0 6px rgba(0,255,136,0.4);
      opacity:0;transition:opacity 0.5s;
    `;
    this.hudCoords.textContent = '42.5°N, 93.8°E';
    this.container.appendChild(this.hudCoords);

    // Zoom bar
    this.hudZoom = document.createElement('div');
    this.hudZoom.style.cssText = `
      position:absolute;bottom:50px;left:20px;right:20px;
      display:flex;align-items:center;gap:8px;
      font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(0,212,255,0.7);
      opacity:0;transition:opacity 0.5s;
    `;
    this.hudZoom.innerHTML = `
      <span>535km</span>
      <div style="flex:1;height:2px;background:rgba(255,255,255,0.15);position:relative;">
        <div id="zoom-dot" style="position:absolute;top:-7px;width:16px;height:16px;border-radius:50%;background:rgba(0,212,255,0.6);border:2px solid #00D4FF;left:0;"></div>
      </div>
      <span>5km</span>
    `;
    this.container.appendChild(this.hudZoom);

    // Terminal window (hidden)
    this.terminalWindow = document.createElement('div');
    this.terminalWindow.style.cssText = `
      position:absolute;left:20px;bottom:120px;width:280px;
      background:rgba(0,0,0,0.85);
      border:1px solid rgba(0,255,136,0.3);border-radius:8px;
      overflow:hidden;opacity:0;transition:opacity 0.5s;
    `;
    this.terminalWindow.innerHTML = `
      <div style="height:24px;background:rgba(0,255,136,0.1);display:flex;align-items:center;padding:0 10px;gap:6px;">
        <span style="width:8px;height:8px;border-radius:50%;background:#FF5F57;"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#FFBD2E;"></span>
        <span style="width:8px;height:8px;border-radius:50%;background:#28CA41;"></span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(0,255,136,0.5);margin-left:8px;">orbit_analysis.log</span>
      </div>
      <div id="terminal-content" style="padding:12px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#00FF88;line-height:1.6;"></div>
    `;
    this.container.appendChild(this.terminalWindow);

    // Confirm button (hidden)
    this.confirmBtn = document.createElement('button');
    this.confirmBtn.style.cssText = `
      position:absolute;bottom:80px;left:50%;transform:translateX(-50%);
      width:200px;height:48px;border:none;border-radius:24px;
      background:#FF4444;color:#fff;font-size:16px;font-weight:600;
      box-shadow:0 4px 16px rgba(255,68,68,0.3);
      cursor:pointer;opacity:0;transition:opacity 0.3s,background 0.3s;
    `;
    this.confirmBtn.textContent = '确认标记';
    this.confirmBtn.addEventListener('click', () => this._confirmAnomaly());
    this.container.appendChild(this.confirmBtn);

    // Comparison slider (hidden)
    this._setupComparisonUI();

    document.getElementById('scene-container').appendChild(this.container);
  }

  _setupComparisonUI() {
    this.comparisonContainer = document.createElement('div');
    this.comparisonContainer.style.cssText = `
      position:absolute;inset:0;display:none;pointer-events:auto;
    `;
    this.comparisonContainer.innerHTML = `
      <div id="comp-left" style="position:absolute;left:0;top:0;bottom:0;width:50%;overflow:hidden;">
        <div style="width:393px;height:100%;background:#5a4a3a;display:flex;align-items:center;justify-content:center;font-size:24px;color:#F5F0E8;font-family:'Noto Serif SC',serif;">
          为 人 民 服 务<br><span style="font-size:14px;color:#C4A46C;">完整地标 · 2023</span>
        </div>
        <div style="position:absolute;top:12px;left:12px;font-size:11px;color:#fff;background:rgba(0,0,0,0.6);padding:2px 8px;border-radius:4px;">2023.10 · 破坏前</div>
      </div>
      <div id="comp-right" style="position:absolute;right:0;top:0;bottom:0;width:50%;overflow:hidden;">
        <div style="width:393px;height:100%;background:#4a3a2a;margin-left:-197px;display:flex;align-items:center;justify-content:center;font-size:24px;color:#F5F0E8;font-family:'Noto Serif SC',serif;">
          为 人 <span style="color:#FF4444;">◎◎</span> 民 服 务<br><span style="font-size:14px;color:#FF4444;">车辙痕迹 · 2025</span>
        </div>
        <div style="position:absolute;top:12px;right:12px;font-size:11px;color:#fff;background:rgba(0,0,0,0.6);padding:2px 8px;border-radius:4px;">2025.10 · 破坏后</div>
      </div>
      <div id="comp-split" style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:#FF4444;box-shadow:0 0 6px rgba(255,68,68,0.4);transform:translateX(-50%);">
        <div id="comp-handle" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.6);border:2px solid rgba(245,240,232,0.8);display:flex;align-items:center;justify-content:center;color:#F5F0E8;font-size:14px;cursor:grab;"></div>
      </div>
      <div style="position:absolute;bottom:44px;left:0;right:0;text-align:center;font-size:14px;color:rgba(245,240,232,0.6);"> 滑动对比 ▸</div>
    `;
    this.container.appendChild(this.comparisonContainer);
  }

  _setupPinchZoom() {
    // Track pinch on the container
    let initialDist = 0;
    let initialZoom = 535;

    const getTouchDist = (e) => {
      if (e.touches.length < 2) return 0;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    this._onTouchStart = (e) => {
      if (this.stage === 'comparison') {
        // Handle slider drag
        this._handleSliderStart(e);
        return;
      }
      if (e.touches.length === 2) {
        initialDist = getTouchDist(e);
        initialZoom = this.currentZoom;
      }
    };

    this._onTouchMove = (e) => {
      if (this.stage === 'comparison') {
        this._handleSliderMove(e);
        return;
      }
      if (e.touches.length === 2 && initialDist > 0) {
        e.preventDefault();
        const dist = getTouchDist(e);
        const scale = initialDist / dist;
        this.targetZoom = Math.max(0.5, Math.min(535, initialZoom * scale));
      }
    };

    this._onTouchEnd = () => {
      initialDist = 0;
      this.isDraggingSlider = false;
    };

    this._onWheel = (e) => {
      if (this.stage !== 'comparison') {
        e.preventDefault();
        this.targetZoom = Math.max(0.5, Math.min(535, this.targetZoom - e.deltaY * 0.5));
      }
    };

    this.container.addEventListener('touchstart', this._onTouchStart, { passive: false });
    this.container.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this.container.addEventListener('touchend', this._onTouchEnd);
    this.container.addEventListener('wheel', this._onWheel, { passive: false });
  }

  _handleSliderStart(e) {
    this.isDraggingSlider = true;
    this._updateSliderFromTouch(e);
  }

  _handleSliderMove(e) {
    if (!this.isDraggingSlider) return;
    this._updateSliderFromTouch(e);
  }

  _updateSliderFromTouch(e) {
    const touch = e.touches[0];
    const rect = this.container.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    this.splitX = Math.max(0.1, Math.min(0.9, x));
    this._updateComparisonView();
  }

  _updateComparisonView() {
    const leftEl = document.getElementById('comp-left');
    const rightEl = document.getElementById('comp-right');
    const splitEl = document.getElementById('comp-split');
    if (!leftEl || !rightEl || !splitEl) return;
    const pct = (this.splitX * 100) + '%';
    leftEl.style.width = pct;
    rightEl.style.width = (100 - this.splitX * 100) + '%';
    splitEl.style.left = pct;
  }

  _bindEvents() {
    // Click on anomaly area to confirm
    this._onClickAnomaly = (e) => {
      if (this.stage === 'anomaly' && !this.anomalyConfirmed) {
        this._showConfirmButton();
      }
    };
    this.container.addEventListener('click', this._onClickAnomaly);
  }

  _unbindEvents() {
    if (this._onClickAnomaly) {
      this.container.removeEventListener('click', this._onClickAnomaly);
    }
  }

  _showAnomalyUI() {
    this.stage = 'anomaly';
    this.terminalWindow.style.opacity = '1';

    // Type terminal text
    const termContent = document.getElementById('terminal-content');
    if (termContent) {
      const lines = [
        '> 对比分析 2023.10 / 2025.10',
        '> 检测到地表异常...',
        '> 异常坐标: 42°27\'18"N 93°38\'42"E',
        '> 异常面积: ≈127m²',
        '> 置信度: 98.7%',
      ];
      termContent.innerHTML = '';
      lines.forEach((line, i) => {
        setTimeout(() => {
          termContent.innerHTML += line + '<br>';
        }, i * 400);
      });
    }
  }

  _showConfirmButton() {
    this.confirmBtn.style.opacity = '1';
  }

  _confirmAnomaly() {
    this.anomalyConfirmed = true;
    this.confirmBtn.style.background = '#00FF88';
    this.confirmBtn.textContent = '✓ 已标记';

    // Flash confirmation then show comparison
    setTimeout(() => {
      this._showComparison();
    }, 800);
  }

  _showComparison() {
    this.stage = 'comparison';
    this.confirmBtn.style.opacity = '0';
    this.terminalWindow.style.opacity = '0';
    this.hudTop.style.opacity = '0.5';
    this.comparisonContainer.style.display = 'block';
    this._updateComparisonView();
  }

  update(dt) {
    if (!this.active) return;

    // Smooth zoom
    this.currentZoom += (this.targetZoom - this.currentZoom) * 0.08;

    // Update camera based on zoom level
    const zoomFrac = this.currentZoom / 535;
    const camDist = 3 + (1 - zoomFrac) * 15; // 3 (far) to 18 (close)
    this.camera.position.z += (camDist - this.camera.position.z) * 0.05;

    // Rotate earth slowly
    if (this.earth && this.stage !== 'comparison') {
      this.earth.rotation.y += 0.002;
    }

    // Update satellite particles
    if (this.satelliteParticles) {
      this.satelliteParticles.rotation.y += 0.001;
      this.satelliteParticles.rotation.x += 0.0005;
    }

    // Terrain visibility
    const shouldShowTerrain = this.currentZoom < 10;
    if (shouldShowTerrain !== this.terrainVisible) {
      this.terrainVisible = shouldShowTerrain;
      if (this.terrainPlane) this.terrainPlane.visible = shouldShowTerrain;
      if (this.earth) this.earth.visible = !shouldShowTerrain;
      if (this.atmosphereInner) this.atmosphereInner.visible = !shouldShowTerrain;
      if (this.atmosphereOuter) this.atmosphereOuter.visible = !shouldShowTerrain;
    }

    // Anomaly trigger at close zoom
    if (this.currentZoom < 2 && this.stage === 'orbit' && this.terrainVisible) {
      this._showAnomalyUI();
    }

    // Update HUD
    const altEl = document.getElementById('hud-alt');
    if (altEl) altEl.textContent = Math.round(this.currentZoom);
    if (this.hudCoords && this.stage !== 'comparison') {
      this.hudCoords.style.opacity = this.currentZoom < 100 ? '1' : '0';
    }
    if (this.hudZoom) {
      this.hudZoom.style.opacity = this.stage !== 'comparison' ? '1' : '0';
      const dot = document.getElementById('zoom-dot');
      if (dot) {
        const pct = Math.max(0, Math.min(100, (1 - this.currentZoom / 535) * 100));
        dot.style.left = pct + '%';
      }
    }

    // Animate trajectory dash offset
    if (this.trajectoryLine && this.trajectoryLine.material) {
      this.trajectoryLine.material.dashOffset = (this.trajectoryLine.material.dashOffset || 0) - 0.02;
    }
  }

  render() {
    if (!this.renderer) return;
    // Three.js renders via TransitionSystem or directly
  }

  resize(w, h) {
    if (this.camera) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    // Dispose Three.js objects
    if (this.scene) {
      this.scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }
  }
}

export { Scene1Satellite };
