/**
 * CYBER-LAB CUSTOM PC - 3D STUDIO VIEWER (ULTRA-REALISTIC EDITION)
 * Photorealistic PC Hardware Architecture, physically-based materials,
 * procedurally-generated high-resolution textures, hyper-detailed components,
 * realistic cable management, dynamic LCD telemetry, and 6 unique computer cases.
 */

class CyberPC3DViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.animationId = null;

    // Component Root Groups
    this.pcGroup = new THREE.Group();
    this.chassisGroup = new THREE.Group();
    this.glassPanelGroup = new THREE.Group();
    this.componentsGroup = new THREE.Group();

    // Detailed Sub-assembly Groups
    this.mbMeshGroup = new THREE.Group();
    this.cpuChipGroup = new THREE.Group();
    this.thermalPasteMesh = null;
    this.coolerGroup = new THREE.Group();
    this.gpuGroup = new THREE.Group();
    this.ramGroup = new THREE.Group();
    this.ssdGroup = new THREE.Group();
    this.psuGroup = new THREE.Group();
    this.cablesGroup = new THREE.Group();

    // Animated Elements
    this.fansList = [];
    this.fanSpeed = 0.0;
    this.targetFanSpeed = 0.14;
    this.animatedScreens = [];

    // Studio Theme & Colors
    this.studioTheme = 'white'; // 'white' or 'dark'
    this.rgbLights = [];
    this.rgbMaterials = [];
    this.currentRgbColor = new THREE.Color(0x00f3ff);
    this.isRainbow = false;
    this.rainbowHue = 0;

    // Assembly & Power States
    this.isPoweredOn = true;
    this.isGlassOpen = false;
    this.isAutoRotate = false;
    this.thermalPasteApplied = true;

    // Trackers
    this.currentCaseId = 'case-nordic-wood';
    this.currentCoolerId = 'cooler-assassin';
    this.currentGpuId = 'gpu-rtx-4070s';
    this.currentMbId = 'mb-b650-am5';
    this.currentRamId = 'ram-32-ddr5-rgb';
    this.currentSsdId = 'ssd-1tb-990pro';
    this.currentPsuId = 'psu-750w-gold';

    // Texture Cache
    this.textureCache = {};

    this.init();
  }

  // ==========================================================================
  // PROCEDURAL TEXTURE GENERATION SUITE (High-DPI Photorealism)
  // ==========================================================================
  createCanvasTexture(key, width, height, drawFn) {
    if (this.textureCache[key]) return this.textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    drawFn(ctx, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    this.textureCache[key] = texture;
    return texture;
  }

  // Motherboard PCB High-Detail Silkscreen & Traces
  getMotherboardTexture(isWhite = false, brand = 'AORUS') {
    const key = `mb_${isWhite ? 'white' : 'dark'}_${brand}`;
    return this.createCanvasTexture(key, 1024, 1024, (ctx, w, h) => {
      // 1. Solder Mask Background
      ctx.fillStyle = isWhite ? '#f8fafc' : '#0a0d14';
      ctx.fillRect(0, 0, w, h);

      // Subtle PCB ground plane stippling
      ctx.fillStyle = isWhite ? '#f1f5f9' : '#0f1420';
      for (let i = 0; i < 4000; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        ctx.fillRect(x, y, 2, 2);
      }

      // 2. High-Tech Gold & Metallic Bus Traces
      ctx.strokeStyle = isWhite ? '#cbd5e1' : '#b49450';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = isWhite ? 0.6 : 0.45;

      // RAM to CPU serpentine delay-matched traces
      for (let i = 0; i < 28; i++) {
        const startY = 220 + i * 14;
        ctx.beginPath();
        ctx.moveTo(560, startY);
        ctx.lineTo(620, startY);
        ctx.lineTo(650, startY + 8);
        ctx.lineTo(680, startY - 8);
        ctx.lineTo(710, startY);
        ctx.lineTo(780, startY);
        ctx.stroke();
      }

      // PCIe x16 Gold Bus traces
      for (let i = 0; i < 24; i++) {
        const startX = 260 + i * 16;
        ctx.beginPath();
        ctx.moveTo(startX, 620);
        ctx.lineTo(startX + 20, 680);
        ctx.lineTo(startX + 20, 780);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // 3. Audio Isolation Line (Yellow/Orange Neon Glow)
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(40, 600);
      ctx.lineTo(160, 600);
      ctx.lineTo(180, 640);
      ctx.lineTo(180, 960);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 4. White Silkscreen Typography & Component Outlines
      ctx.fillStyle = isWhite ? '#334155' : '#e2e8f0';
      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      ctx.fillText('PCIe 5.0 x16 SAFE-SLOT', 260, 610);
      ctx.fillText('DDR5 DUAL-CHANNEL MEMORY BOOST (7200+ MT/s)', 560, 200);
      ctx.fillText('M.2 PCIE GEN5 x4 HYPER SPEED', 320, 520);
      ctx.fillText('PREMIUM JAPANESE AUDIO CAPACITORS 120dB SNR', 40, 990);

      ctx.font = 'bold 26px "Orbitron", sans-serif';
      ctx.fillStyle = isWhite ? '#0284c7' : '#00f3ff';
      ctx.fillText(brand, 180, 160);

      // Gold-plated test points and solder vias
      ctx.fillStyle = '#f59e0b';
      for (let i = 0; i < 250; i++) {
        const vx = 40 + Math.random() * (w - 80);
        const vy = 40 + Math.random() * (h - 80);
        ctx.beginPath();
        ctx.arc(vx, vy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  // CPU Integrated Heat Spreader (IHS) Laser Engraving
  getCpuIhsTexture(isIntel = false) {
    const key = `cpu_${isIntel ? 'intel' : 'amd'}`;
    return this.createCanvasTexture(key, 512, 512, (ctx, w, h) => {
      // Brushed nickel metal background
      ctx.fillStyle = '#d1d5db';
      ctx.fillRect(0, 0, w, h);

      // Subtle horizontal brushed metal grain
      ctx.fillStyle = '#e5e7eb';
      for (let i = 0; i < h; i += 2) {
        if (Math.random() > 0.4) {
          ctx.fillRect(0, i, w, 1);
        }
      }

      // Laser Etching
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'center';

      if (isIntel) {
        ctx.font = 'bold 34px "Orbitron", sans-serif';
        ctx.fillText('intel®', w / 2, 160);
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('CORE™ i9-14900K', w / 2, 210);
        ctx.font = '16px monospace';
        ctx.fillText('SRN48 3.20GHz', w / 2, 260);
        ctx.fillText('MALAY L338D129', w / 2, 290);
      } else {
        ctx.font = 'bold 36px "Orbitron", sans-serif';
        ctx.fillText('AMD Ryzen™ 7', w / 2, 160);
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText('7800X3D', w / 2, 210);
        ctx.font = '16px monospace';
        ctx.fillText('DIFFUSED IN USA', w / 2, 260);
        ctx.fillText('MADE IN TAIWAN', w / 2, 290);
        ctx.fillText('9NR8347X30129', w / 2, 320);
      }

      // Gold Triangle Alignment Marker
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(35, 35);
      ctx.lineTo(65, 35);
      ctx.lineTo(35, 65);
      ctx.closePath();
      ctx.fill();

      // 2D DataMatrix code in corner
      ctx.fillStyle = '#1f2937';
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if ((r + c) % 2 === 0 || Math.random() > 0.5) {
            ctx.fillRect(w - 90 + c * 7, h - 90 + r * 7, 6, 6);
          }
        }
      }
    });
  }

  // Radiator Corrugated Fin Array Texture
  getRadiatorFinsTexture() {
    return this.createCanvasTexture('rad_fins_corrugated', 256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, w, h);

      // Micro serpentine cooling channels
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1.8;
      const channelW = 8;
      for (let x = 0; x < w; x += channelW) {
        ctx.beginPath();
        for (let y = 0; y < h; y += 4) {
          const offsetX = Math.sin(y * 0.5) * 2;
          if (y === 0) ctx.moveTo(x + offsetX, y);
          else ctx.lineTo(x + offsetX, y);
        }
        ctx.stroke();
      }
    });
  }

  // Fan Hub Metallic Holographic & Infinity Mirror Texture
  getFanHubTexture(isWhite = false) {
    const key = `fanhub_infinity_${isWhite ? 'white' : 'dark'}`;
    return this.createCanvasTexture(key, 512, 512, (ctx, w, h) => {
      // 1. Outer Deep Chamber Background
      ctx.fillStyle = '#05070e';
      ctx.fillRect(0, 0, w, h);

      // 2. Multi-Level Infinity Mirror Concentric Tunnel Rings
      const cx = w / 2;
      const cy = h / 2;
      const rings = 7;
      for (let i = 0; i < rings; i++) {
        const radius = 230 - i * 28;
        const alpha = 0.95 - i * 0.12;
        ctx.strokeStyle = isWhite ? `rgba(56, 189, 248, ${alpha})` : `rgba(0, 243, 255, ${alpha})`;
        ctx.lineWidth = 4 + (rings - i) * 1.5;
        ctx.shadowColor = isWhite ? '#0284c7' : '#00f3ff';
        ctx.shadowBlur = 12 - i;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // 3. Central Concentric Machined Metal Cap
      const capGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 85);
      if (isWhite) {
        capGrad.addColorStop(0, '#ffffff');
        capGrad.addColorStop(0.5, '#e2e8f0');
        capGrad.addColorStop(1, '#94a3b8');
      } else {
        capGrad.addColorStop(0, '#3f3f46');
        capGrad.addColorStop(0.5, '#18181b');
        capGrad.addColorStop(1, '#09090b');
      }
      ctx.fillStyle = capGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 85, 0, Math.PI * 2);
      ctx.fill();

      // Precision CNC Lathe Grooves
      ctx.strokeStyle = isWhite ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 243, 255, 0.5)';
      ctx.lineWidth = 1.5;
      for (let r = 20; r < 80; r += 14) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Outer Diamond-Cut Beveled Border
      ctx.strokeStyle = '#d4d4d8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 84, 0, Math.PI * 2);
      ctx.stroke();

      // Center High-Tech Typography Emblem
      ctx.fillStyle = isWhite ? '#0284c7' : '#00f3ff';
      ctx.font = 'bold 32px "Orbitron", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CYBER', cx, cy - 6);

      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.fillStyle = isWhite ? '#475569' : '#a1a1aa';
      ctx.fillText('FDB PWM', cx, cy + 22);
    });
  }

  // GPU Aluminum Backplate Detail
  getGpuBackplateTexture(isWhite = false, name = 'RTX 4070S') {
    const key = `gpu_bp_${isWhite ? 'w' : 'd'}_${name}`;
    return this.createCanvasTexture(key, 512, 256, (ctx, w, h) => {
      ctx.fillStyle = isWhite ? '#e2e8f0' : '#18181b';
      ctx.fillRect(0, 0, w, h);

      // Brushed grain
      ctx.fillStyle = isWhite ? '#f1f5f9' : '#27272a';
      for (let y = 0; y < h; y += 3) {
        if (Math.random() > 0.4) ctx.fillRect(0, y, w, 1);
      }

      // Geometric CNC Milled Grooves
      ctx.strokeStyle = isWhite ? '#94a3b8' : '#00f3ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(12, 12, w - 24, h - 24);

      // Silk typography
      ctx.fillStyle = isWhite ? '#0f172a' : '#ffffff';
      ctx.font = 'bold 24px "Orbitron", sans-serif';
      ctx.fillText(name.toUpperCase(), 35, 60);

      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = isWhite ? '#475569' : '#71717a';
      ctx.fillText('GEFORCE RTX™ | DUAL BIOS | FLOW THROUGH', 35, 95);

      // Flow-through ventilation window (honeycomb cutouts)
      const flowX = w - 160;
      ctx.fillStyle = '#09090b';
      ctx.fillRect(flowX, 30, 130, h - 60);

      ctx.fillStyle = '#3f3f46';
      for (let r = 40; r < h - 40; r += 16) {
        for (let c = flowX + 15; c < flowX + 115; c += 16) {
          ctx.beginPath();
          ctx.arc(c, r, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  }

  // Cable Braided Pattern
  getCableTexture(isWhite = false) {
    const key = `cable_braid_${isWhite ? 'w' : 'd'}`;
    return this.createCanvasTexture(key, 128, 128, (ctx, w, h) => {
      ctx.fillStyle = isWhite ? '#f8fafc' : '#111827';
      ctx.fillRect(0, 0, w, h);

      // Braided nylon diagonal weave
      ctx.strokeStyle = isWhite ? '#cbd5e1' : '#374151';
      ctx.lineWidth = 3;
      for (let i = -w; i < w * 2; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + h, h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i, h);
        ctx.lineTo(i + h, 0);
        ctx.stroke();
      }
    });
  }

  // ==========================================================================
  // INITIALIZATION & ENVIRONMENT SETUP
  // ==========================================================================
  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 550;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf1f5f9);
    this.scene.fog = new THREE.FogExp2(0xf1f5f9, 0.007);

    // 2. Camera with Film-like Perspective
    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.5, 250);
    this.camera.position.set(24, 14, 28);

    // 3. WebGL Renderer with High Exposure & Soft Shadows
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.4;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.04;
      this.controls.minDistance = 6;
      this.controls.maxDistance = 75;
      this.controls.target.set(0, 0, 0);
      this.controls.autoRotate = this.isAutoRotate;
      this.controls.autoRotateSpeed = 1.2;
    }

    // 5. Lighting Setup
    this.setupLighting();

    // 6. Workbench Pedestal Floor
    this.setupWorkbench();

    // 7. Hierarchy Setup
    this.scene.add(this.pcGroup);
    this.pcGroup.add(this.chassisGroup);
    this.pcGroup.add(this.componentsGroup);
    this.pcGroup.add(this.cablesGroup);

    this.componentsGroup.add(this.mbMeshGroup);
    this.componentsGroup.add(this.cpuChipGroup);
    this.componentsGroup.add(this.ramGroup);
    this.componentsGroup.add(this.ssdGroup);
    this.componentsGroup.add(this.coolerGroup);
    this.componentsGroup.add(this.gpuGroup);
    this.componentsGroup.add(this.psuGroup);

    // 8. Build Initial System
    this.buildCase(this.currentCaseId);
    this.buildMotherboard(this.currentMbId);
    this.buildCpuChip();
    this.buildThermalPaste();
    this.buildRam(this.currentRamId);
    this.buildSsd(this.currentSsdId);
    this.buildCooler(this.currentCoolerId);
    this.buildGpu(this.currentGpuId);
    this.buildCables();

    // 9. Resize Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    document.addEventListener('fullscreenchange', () => this.onWindowResize());

    // 10. Start Animation Loop
    this.animate();
  }

  // ==========================================================================
  // REALISTIC STUDIO LIGHTING
  // ==========================================================================
  setupLighting() {
    // Ambient Fill
    this.ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
    this.scene.add(this.ambientLight);

    // Studio Key Light with High-Resolution Shadow
    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    this.keyLight.position.set(22, 38, 26);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.bias = -0.0003;
    this.keyLight.shadow.camera.near = 5;
    this.keyLight.shadow.camera.far = 80;
    this.keyLight.shadow.camera.left = -22;
    this.keyLight.shadow.camera.right = 22;
    this.keyLight.shadow.camera.top = 22;
    this.keyLight.shadow.camera.bottom = -22;
    this.scene.add(this.keyLight);

    // Rim/Back Light for crisp hardware contours
    this.fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.4);
    this.fillLight.position.set(-25, 20, -18);
    this.scene.add(this.fillLight);

    // Subtle Under-Chassis Bounce Light
    this.bounceLight = new THREE.DirectionalLight(0xffffff, 0.7);
    this.bounceLight.position.set(0, -12, 0);
    this.scene.add(this.bounceLight);

    // Internal ARGB Point Lights for realistic component illumination
    const p1 = new THREE.PointLight(0x00f3ff, 2.8, 22);
    p1.position.set(2, 4, 2);
    this.scene.add(p1);
    this.rgbLights.push(p1);

    const p2 = new THREE.PointLight(0x00f3ff, 2.2, 18);
    p2.position.set(4, -1, 3);
    this.scene.add(p2);
    this.rgbLights.push(p2);

    const p3 = new THREE.PointLight(0x00f3ff, 1.8, 16);
    p3.position.set(-3, 6, 1);
    this.scene.add(p3);
    this.rgbLights.push(p3);
  }

  setupWorkbench() {
    // Large Cyclorama Studio Pedestal Floor
    const floorGeo = new THREE.CylinderGeometry(26, 27, 0.5, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.12,
      metalness: 0.05
    });
    this.studioFloor = new THREE.Mesh(floorGeo, floorMat);
    this.studioFloor.position.y = -8.55;
    this.studioFloor.receiveShadow = true;
    this.scene.add(this.studioFloor);

    // Precision Studio Accent Ring
    const ringGeo = new THREE.RingGeometry(26.1, 26.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, side: THREE.DoubleSide });
    this.rgbMaterials.push(ringMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -8.28;
    this.scene.add(ring);

    // Bottom Ambient Occlusion Shadow Disc right beneath the PC
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(128, 128, 30, 128, 128, 120);
    sGrad.addColorStop(0, 'rgba(0,0,0,0.45)');
    sGrad.addColorStop(0.5, 'rgba(0,0,0,0.18)');
    sGrad.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);

    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 28),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.85 })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -8.27;
    this.scene.add(contactShadow);

    // Delicate Grid Helper
    this.gridHelper = new THREE.GridHelper(80, 50, 0x00f3ff, 0xdbeafe);
    this.gridHelper.position.y = -8.56;
    this.scene.add(this.gridHelper);
  }

  setStudioTheme(themeName) {
    this.studioTheme = themeName;
    if (themeName === 'white') {
      this.scene.background = new THREE.Color(0xf1f5f9);
      this.scene.fog.color = new THREE.Color(0xf1f5f9);
      this.ambientLight.color.setHex(0xffffff);
      this.ambientLight.intensity = 2.1;
      this.studioFloor.material.color.setHex(0xffffff);
      this.gridHelper.material.color.setHex(0xdbeafe);
    } else {
      this.scene.background = new THREE.Color(0x07090f);
      this.scene.fog.color = new THREE.Color(0x07090f);
      this.ambientLight.color.setHex(0x1a2638);
      this.ambientLight.intensity = 1.2;
      this.studioFloor.material.color.setHex(0x0f1522);
      this.gridHelper.material.color.setHex(0x141f2e);
    }
  }

  // ==========================================================================
  // REALISTIC COMPONENT BUILDERS
  // ==========================================================================

  // 1. MOTHERBOARD (Extreme Architectural Fidelity)
  buildMotherboard(mbId = this.currentMbId) {
    this.currentMbId = mbId;
    while (this.mbMeshGroup.children.length > 0) {
      this.mbMeshGroup.remove(this.mbMeshGroup.children[0]);
    }

    const isWhite = mbId.includes('white');
    const isRog = mbId.includes('z790') || mbId.includes('hero');
    const brand = isRog ? 'ROG MAXIMUS' : (isWhite ? 'AORUS ICE' : 'AORUS ELITE');

    // Main 8-Layer PCB
    const mbTex = this.getMotherboardTexture(isWhite, brand);
    const pcbMat = new THREE.MeshStandardMaterial({
      map: mbTex,
      roughness: 0.35,
      metalness: 0.4
    });
    const mbMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 11.2, 9.8), pcbMat);
    mbMesh.position.set(5.5, 1.5, -2);
    mbMesh.castShadow = true;
    mbMesh.receiveShadow = true;
    this.mbMeshGroup.add(mbMesh);

    // Standoff Screws (Solid Brass + Phillips Head detail)
    const standoffMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.2 });
    const screwHeadMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const standoffPositions = [
      [5.3, 6.7, -6.6], [5.3, 6.7, -2.0], [5.3, 6.7, 2.6],
      [5.3, 1.5, -6.6], [5.3, 1.5, 2.6],
      [5.3, -3.7, -6.6], [5.3, -3.7, -2.0], [5.3, -3.7, 2.6]
    ];
    standoffPositions.forEach(([x, y, z]) => {
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.35, 12), standoffMat);
      st.rotation.z = Math.PI / 2;
      st.position.set(x, y, z);
      this.mbMeshGroup.add(st);

      const scr = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 12), screwHeadMat);
      scr.rotation.z = Math.PI / 2;
      scr.position.set(x - 0.12, y, z);
      this.mbMeshGroup.add(scr);
    });

    // Heavy VRM Heatsinks with CNC Fins & Heatpipe
    const vrmColor = isWhite ? 0xe2e8f0 : (isRog ? 0x18181b : 0x1e293b);
    const vrmMat = new THREE.MeshStandardMaterial({
      color: vrmColor,
      roughness: 0.22,
      metalness: isWhite ? 0.3 : 0.92
    });

    // Top VRM Fin Stack
    const vrmTop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 4.4), vrmMat);
    vrmTop.position.set(5.15, 6.0, -2.6);
    this.mbMeshGroup.add(vrmTop);

    // Left I/O VRM Fin Stack
    const vrmLeft = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.8, 1.4), vrmMat);
    vrmLeft.position.set(5.15, 3.8, -4.8);
    this.mbMeshGroup.add(vrmLeft);

    // Nickel-plated Heatpipe bridging the two VRM heatsinks
    const hpCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(5.0, 5.7, -1.0),
      new THREE.Vector3(5.0, 5.7, -4.6),
      new THREE.Vector3(5.0, 2.8, -4.6)
    ]);
    const hpMesh = new THREE.Mesh(
      new THREE.TubeGeometry(hpCurve, 16, 0.12, 12, false),
      new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15 })
    );
    this.mbMeshGroup.add(hpMesh);

    // Integrated Rear I/O Cover with Holographic Logo
    const ioCover = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 4.8, 1.6),
      new THREE.MeshStandardMaterial({ color: isWhite ? 0xffffff : 0x090c12, roughness: 0.2, metalness: 0.85 })
    );
    ioCover.position.set(5.15, 3.8, -5.9);
    this.mbMeshGroup.add(ioCover);

    const logoTex = this.createCanvasTexture(`mb_logo_${brand}`, 256, 128, (ctx, w, h) => {
      ctx.fillStyle = isWhite ? '#ffffff' : '#05070c';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = isRog ? '#ff007f' : (isWhite ? '#0284c7' : '#00f3ff');
      ctx.font = 'bold 30px "Orbitron", sans-serif';
      ctx.fillText(brand, 15, 55);
      ctx.font = '14px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('AURA SYNC RGB', 15, 85);
    });
    const logoBadge = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.8), new THREE.MeshBasicMaterial({ map: logoTex }));
    logoBadge.rotation.y = -Math.PI / 2;
    logoBadge.position.set(4.7, 4.0, -5.9);
    this.mbMeshGroup.add(logoBadge);

    // Rear I/O Ports Array (USB, Type-C, Audio Jacks, WiFi SMA, RJ45)
    this.buildIoPorts();

    // 4x DIMM DDR5 Slots with Latches
    const slotBodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const latchMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.3 });
    for (let s = 0; s < 4; s++) {
      const z = -0.8 + s * 0.48;
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.7, 0.14), slotBodyMat);
      slot.position.set(5.38, 3.8, z);
      this.mbMeshGroup.add(slot);

      // Latches on top and bottom
      const topLatch = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.12), latchMat);
      topLatch.position.set(5.34, 5.2, z);
      this.mbMeshGroup.add(topLatch);

      const botLatch = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.12), latchMat);
      botLatch.position.set(5.34, 2.4, z);
      this.mbMeshGroup.add(botLatch);
    }

    // 24-Pin ATX Main Power Socket
    const atx24 = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 2.2, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6 })
    );
    atx24.position.set(5.3, 3.8, 2.4);
    this.mbMeshGroup.add(atx24);

    // Solid Chokes (14x VRM inductors)
    const chokeMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.7, roughness: 0.4 });
    for (let c = 0; c < 8; c++) {
      const ch = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.28, 0.28), chokeMat);
      ch.position.set(5.3, 2.2 + c * 0.42, -3.9);
      this.mbMeshGroup.add(ch);
    }
    for (let c = 0; c < 6; c++) {
      const ch = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.28, 0.28), chokeMat);
      ch.position.set(5.3, 5.3, -3.6 + c * 0.42);
      this.mbMeshGroup.add(ch);
    }

    // Gold Nichicon Audio Capacitors
    const goldCapMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.2 });
    for (let a = 0; a < 5; a++) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.35, 16), goldCapMat);
      cap.rotation.z = Math.PI / 2;
      cap.position.set(5.3, -2.6 + a * 0.45, -4.5);
      this.mbMeshGroup.add(cap);
    }

    // PCIe 5.0 x16 Reinforced Stainless Armor SafeSlot
    const pcieArmor = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.45, 6.8),
      new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15 })
    );
    pcieArmor.position.set(5.28, 0.5, -1.8);
    this.mbMeshGroup.add(pcieArmor);

    // PCIe Q-Release Lever
    const qRel = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
    );
    qRel.position.set(5.28, 0.5, 1.8);
    this.mbMeshGroup.add(qRel);

    // M.2 Armor Thermal Shield with Milled Fin Ridges
    const m2Armor = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.8, 3.4),
      vrmMat
    );
    m2Armor.position.set(5.25, 1.5, -2.4);
    this.mbMeshGroup.add(m2Armor);

    // Diagnostic Q-LEDs (Boot, VGA, DRAM, CPU)
    this.postLeds = [];
    const ledColors = [0xff3344, 0xffaa00, 0xffffff, 0x00ff66];
    for (let i = 0; i < 4; i++) {
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.12, 0.12),
        new THREE.MeshBasicMaterial({ color: ledColors[i] })
      );
      led.position.set(5.32, 6.4, 1.8 + i * 0.3);
      this.mbMeshGroup.add(led);
      this.postLeds.push(led);
    }
  }

  // Realistic Rear I/O Ports
  buildIoPorts() {
    const metalPortMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.2 });
    const blueUsbMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const goldAudioMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.1 });

    // USB Ports (Stacked)
    for (let i = 0; i < 3; i++) {
      const portBox = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.55), metalPortMat);
      portBox.position.set(5.25, 5.2 - i * 0.7, -6.8);
      this.mbMeshGroup.add(portBox);

      const usbInsert = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.15, 0.35), blueUsbMat);
      usbInsert.position.set(5.25, 5.2 - i * 0.7, -6.8);
      this.mbMeshGroup.add(usbInsert);
    }

    // WiFi Antenna SMA Connectors
    for (let i = 0; i < 2; i++) {
      const sma = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 12), goldAudioMat);
      sma.rotation.x = Math.PI / 2;
      sma.position.set(5.25, 3.2 - i * 0.4, -6.8);
      this.mbMeshGroup.add(sma);
    }

    // Gold 3.5mm Audio Jacks
    for (let i = 0; i < 3; i++) {
      const jack = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.25, 16), goldAudioMat);
      jack.rotation.x = Math.PI / 2;
      jack.position.set(5.25, 2.0 - i * 0.45, -6.8);
      this.mbMeshGroup.add(jack);
    }
  }

  // 2. CPU & SOCKET (AM5/LGA1700 Mechanical Bracket + Lever)
  buildCpuChip() {
    while (this.cpuChipGroup.children.length > 0) {
      this.cpuChipGroup.remove(this.cpuChipGroup.children[0]);
    }

    // Socket Base Plate
    const socketBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 2.8, 2.8),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 })
    );
    socketBase.position.set(5.4, 3.6, -2.6);
    this.cpuChipGroup.add(socketBase);

    // Chrome ILM Retention Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15 });
    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.7, 0.3), frameMat);
    topFrame.position.set(5.3, 3.6, -1.35);
    this.cpuChipGroup.add(topFrame);
    const botFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.7, 0.3), frameMat);
    botFrame.position.set(5.3, 3.6, -3.85);
    this.cpuChipGroup.add(botFrame);

    // Chrome Spring Tension Lever
    const leverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(5.25, 2.2, -1.1),
      new THREE.Vector3(5.25, 5.1, -1.1),
      new THREE.Vector3(5.15, 5.2, -0.9)
    ]);
    const leverMesh = new THREE.Mesh(
      new THREE.TubeGeometry(leverCurve, 12, 0.05, 8, false),
      frameMat
    );
    this.cpuChipGroup.add(leverMesh);

    // High-Detail Laser-Engraved Nickel IHS
    const ihsTex = this.getCpuIhsTexture(false);
    const ihsMat = new THREE.MeshStandardMaterial({
      map: ihsTex,
      metalness: 0.85,
      roughness: 0.2
    });
    const ihsMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.1, 2.1), ihsMat);
    ihsMesh.position.set(5.31, 3.6, -2.6);
    this.cpuChipGroup.add(ihsMesh);
  }

  // Realistic Viscous Thermal Compound Spread
  buildThermalPaste() {
    if (this.thermalPasteMesh) {
      this.componentsGroup.remove(this.thermalPasteMesh);
    }

    const pasteCanvas = document.createElement('canvas');
    pasteCanvas.width = 128;
    pasteCanvas.height = 128;
    const ctx = pasteCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 5, 64, 64, 55);
    grad.addColorStop(0, '#9ca3af');
    grad.addColorStop(0.7, '#6b7280');
    grad.addColorStop(1, 'rgba(75, 85, 99, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(64, 64, 58, 0, Math.PI * 2);
    ctx.fill();

    const pasteTex = new THREE.CanvasTexture(pasteCanvas);
    const pasteMat = new THREE.MeshStandardMaterial({
      map: pasteTex,
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95
    });

    this.thermalPasteMesh = new THREE.Mesh(new THREE.CircleGeometry(0.75, 24), pasteMat);
    this.thermalPasteMesh.rotation.y = -Math.PI / 2;
    this.thermalPasteMesh.position.set(5.22, 3.6, -2.6);
    this.thermalPasteMesh.visible = this.thermalPasteApplied;
    this.componentsGroup.add(this.thermalPasteMesh);
  }

  // 3. RAM (G.SKILL Trident Z5 / Corsair Dominator Style)
  buildRam(ramId = this.currentRamId) {
    this.currentRamId = ramId;
    while (this.ramGroup.children.length > 0) {
      this.ramGroup.remove(this.ramGroup.children[0]);
    }

    const isBasicNoRgb = ramId === 'ram-32-ddr5-basic';
    const isWhite = ramId.includes('white');
    const isPrestige = ramId.includes('prestige') || ramId.includes('64');
    const numSticks = isPrestige ? 4 : 2;

    const stickSpread = isPrestige ? [0, 1, 2, 3] : [1, 3]; // Slots A2/B2 or all 4
    const bodyColor = isWhite ? 0xffffff : 0x111827;
    const bodyMat = new THREE.MeshStandardMaterial({
      color: bodyColor,
      metalness: isWhite ? 0.2 : 0.88,
      roughness: 0.25
    });

    const finAccentMat = new THREE.MeshStandardMaterial({
      color: isWhite ? 0xe2e8f0 : 0x27272a,
      metalness: 0.95,
      roughness: 0.15
    });

    stickSpread.forEach(sIdx => {
      const zOffset = -0.8 + sIdx * 0.48;
      const stick = new THREE.Group();
      stick.position.set(5.22, 3.8, zOffset);

      // Main Heatsink with Chamfered Fins
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.5, 0.16), bodyMat);
      stick.add(body);

      // Brushed Aluminum Center Inlay Plate
      const inlay = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.8, 0.12), finAccentMat);
      stick.add(inlay);

      // Frosted ARGB Lightbar
      if (!isBasicNoRgb) {
        const rgbMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
        this.rgbMaterials.push(rgbMat);
        const lightbar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.5, 0.16), rgbMat);
        lightbar.position.set(0, 1.35, 0);
        stick.add(lightbar);
      }

      this.ramGroup.add(stick);
    });
  }

  // 4. M.2 STORAGE (Samsung 990 PRO / Crucial T700 Gen5 Finned Tower)
  buildSsd(ssdId = this.currentSsdId) {
    this.currentSsdId = ssdId;
    while (this.ssdGroup.children.length > 0) {
      this.ssdGroup.remove(this.ssdGroup.children[0]);
    }

    const isGen5 = ssdId.includes('gen5') || ssdId.includes('t700');
    const isRgb = ssdId.includes('2tb');

    if (isGen5) {
      // Crucial T700 Gen5 Active Finned Heatsink Tower
      const t700Group = new THREE.Group();
      t700Group.position.set(5.1, -0.6, -1.8);

      const base = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.9, 3.2),
        new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.9, roughness: 0.25 })
      );
      t700Group.add(base);

      // Miniature Copper Heatpipes
      const copperMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.2 });
      for (let i = -1; i <= 1; i += 2) {
        const hp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.0, 12), copperMat);
        hp.rotation.x = Math.PI / 2;
        hp.position.set(0.3 * i, 0.5, 0);
        t700Group.add(hp);
      }

      this.ssdGroup.add(t700Group);
    } else {
      // Sleek Samsung 990 PRO Heatsink
      const ssdMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.65, 3.2),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 })
      );
      ssdMesh.position.set(5.28, -0.6, -1.8);
      this.ssdGroup.add(ssdMesh);

      // Phillips Retention Screw
      const scr = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.1, 12),
        new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.95 })
      );
      scr.rotation.z = Math.PI / 2;
      scr.position.set(5.24, -0.6, -3.3);
      this.ssdGroup.add(scr);

      if (isRgb) {
        const neonMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
        this.rgbMaterials.push(neonMat);
        const neon = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 3.2), neonMat);
        neon.position.set(5.28, -0.28, -1.8);
        this.ssdGroup.add(neon);
      }
    }
  }

  // 5. CPU COOLERS (Peerless Assassin 120 SE & NZXT Kraken 360 LCD)
  buildCooler(coolerId = this.currentCoolerId) {
    this.currentCoolerId = coolerId;
    while (this.coolerGroup.children.length > 0) {
      this.coolerGroup.remove(this.coolerGroup.children[0]);
    }
    this.fansList = this.fansList.filter(f => !f.isCoolerFan);

    const isSingleTower = coolerId === 'cooler-ak400';
    const isDualTower = coolerId === 'cooler-assassin';
    const isWhiteAio = coolerId.includes('white');
    const is240Aio = coolerId === 'cooler-aio-240';
    const isAio = !isSingleTower && !isDualTower;

    if (isSingleTower) {
      // Single Tower DeepCool AK400
      const tower = new THREE.Group();
      tower.position.set(3.9, 3.6, -2.6);

      const finMat = new THREE.MeshStandardMaterial({
        color: 0xa1a1aa,
        roughness: 0.25,
        metalness: 0.9
      });
      const finBlock = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.5, 3.2), finMat);
      tower.add(finBlock);

      // 4 Copper Heatpipe Tips
      const copperMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.15 });
      for (let i = -1.1; i <= 1.1; i += 0.7) {
        const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 12), copperMat);
        tip.position.set(0, 1.85, i);
        tower.add(tip);
      }

      // Front PWM Fan with Spring Wire Clips
      const fan = this.createFan3D(1.5, false, false, 'cooler');
      fan.isCoolerFan = true;
      fan.rotation.y = -Math.PI / 2;
      fan.position.set(-1.0, 0, 0);
      tower.add(fan);

      this.coolerGroup.add(tower);

    } else if (isDualTower) {
      // Dual Tower Peerless Assassin 120 SE
      const dualTower = new THREE.Group();
      dualTower.position.set(3.7, 3.6, -2.6);

      const finMat = new THREE.MeshStandardMaterial({
        color: 0xa1a1aa,
        roughness: 0.25,
        metalness: 0.92
      });

      // Tower 1 & 2
      [-1.0, 1.0].forEach(xOffset => {
        const tower = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.5, 3.2), finMat);
        tower.position.set(xOffset, 0, 0);
        dualTower.add(tower);

        // Heatpipe End Caps on top of each tower
        const capMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.9 });
        for (let i = -1.1; i <= 1.1; i += 0.7) {
          const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.3, 12), capMat);
          cap.position.set(xOffset, 1.85, i);
          dualTower.add(cap);
        }
      });

      // 2x 120mm Fans (Front and Middle)
      [-1.8, 0.0].forEach(xOffset => {
        const fan = this.createFan3D(1.45, false, false, 'cooler');
        fan.isCoolerFan = true;
        fan.rotation.y = -Math.PI / 2;
        fan.position.set(xOffset, 0, 0);
        dualTower.add(fan);
      });

      this.coolerGroup.add(dualTower);

    } else {
      // High-End AIO Liquid Cooler (360mm / 240mm with LCD / Infinity Mirror)
      const aio = new THREE.Group();
      const numFans = is240Aio ? 2 : 3;
      const radLen = is240Aio ? 8.2 : 11.8;
      const radColor = isWhiteAio ? 0xffffff : 0x18181b;

      // Heavy 360mm Radiator with Fin Matrix
      const radFinTex = this.getRadiatorFinsTexture();
      const radMat = new THREE.MeshStandardMaterial({
        color: radColor,
        roughness: isWhiteAio ? 0.25 : 0.4,
        metalness: isWhiteAio ? 0.2 : 0.85
      });
      const radMesh = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.85, radLen), radMat);
      radMesh.position.set(2.0, 7.3, 0);
      aio.add(radMesh);

      // Corrugated cooling core visible on radiator underside
      const coreMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, radLen - 0.8),
        new THREE.MeshStandardMaterial({ map: radFinTex, roughness: 0.7 })
      );
      coreMesh.rotation.x = Math.PI / 2;
      coreMesh.position.set(2.0, 6.85, 0);
      aio.add(coreMesh);

      // Radiator Fans (Pushing air through)
      const spacing = 3.6;
      const startZ = is240Aio ? -1.8 : -3.6;
      for (let i = 0; i < numFans; i++) {
        const fan = this.createFan3D(1.35, false, isWhiteAio, 'radiator');
        fan.isCoolerFan = true;
        fan.rotation.x = Math.PI / 2;
        fan.position.set(2.0, 6.45, startZ + i * spacing);
        aio.add(fan);
      }

      // Circular Pump Block with Live Animated LCD Screen (NZXT Kraken Elite)
      const pumpGroup = new THREE.Group();
      pumpGroup.position.set(4.9, 3.6, -2.6);

      const pumpHousing = new THREE.Mesh(
        new THREE.CylinderGeometry(1.35, 1.35, 0.95, 36),
        new THREE.MeshStandardMaterial({
          color: isWhiteAio ? 0xffffff : 0x09090b,
          roughness: 0.2,
          metalness: 0.92
        })
      );
      pumpHousing.rotation.z = Math.PI / 2;
      pumpGroup.add(pumpHousing);

      // Rotary 90-Degree Metal Hose Fittings on Pump
      const fittingMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15 });
      for (let f = 0; f < 2; f++) {
        const fit = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.45, 16), fittingMat);
        fit.rotation.x = Math.PI / 2;
        fit.position.set(-0.2, 0.6 - f * 0.7, 1.25);
        pumpGroup.add(fit);
      }

      // Animated 60Hz Telemetry LCD Display
      this.pumpLcdMesh = this.createAnimatedLcdScreen();
      this.pumpLcdMesh.rotation.y = -Math.PI / 2;
      this.pumpLcdMesh.position.set(-0.49, 0, 0);
      pumpGroup.add(this.pumpLcdMesh);

      aio.add(pumpGroup);

      // High-Density Braided Coolant Hoses with Tube Combs
      const tubeColor = isWhiteAio ? 0xf1f5f9 : 0x1f2937;
      const tubeMat = new THREE.MeshStandardMaterial({
        color: tubeColor,
        roughness: 0.75,
        map: this.getCableTexture(isWhiteAio)
      });

      const curve1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.5, 6.8, -1.2),
        new THREE.Vector3(3.2, 5.8, -0.6),
        new THREE.Vector3(4.2, 4.4, -1.4),
        new THREE.Vector3(4.7, 3.9, -1.4)
      ]);
      const tube1 = new THREE.Mesh(new THREE.TubeGeometry(curve1, 28, 0.24, 16, false), tubeMat);
      aio.add(tube1);

      const curve2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.5, 6.8, -0.6),
        new THREE.Vector3(3.0, 5.4, 0.1),
        new THREE.Vector3(4.0, 4.0, -0.8),
        new THREE.Vector3(4.7, 3.3, -1.4)
      ]);
      const tube2 = new THREE.Mesh(new THREE.TubeGeometry(curve2, 28, 0.24, 16, false), tubeMat);
      aio.add(tube2);

      // Acrylic Tube Separator Clip
      const clipMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.8, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3 })
      );
      clipMesh.position.set(3.4, 5.1, -0.4);
      aio.add(clipMesh);

      this.coolerGroup.add(aio);
    }
  }

  // Dynamic Live LCD Screen on Water Pump
  createAnimatedLcdScreen() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);

    const screenMesh = new THREE.Mesh(
      new THREE.CircleGeometry(1.22, 36),
      new THREE.MeshBasicMaterial({ map: texture })
    );

    // Register screen for real-time canvas animation loop
    this.animatedScreens.push({
      canvas,
      ctx,
      texture,
      type: 'pump',
      draw: (now) => {
        ctx.fillStyle = '#05070e';
        ctx.fillRect(0, 0, 256, 256);

        // Circular Rainbow / Cyan Temperature Gauge
        const progress = 0.42 + Math.sin(now * 0.002) * 0.04;
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(128, 128, 102, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.stroke();

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(128, 128, 102, 0, Math.PI * 2);
        ctx.stroke();

        // CPU Temperature readout
        const temp = Math.round(38 + Math.sin(now * 0.003) * 3);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px "Orbitron", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${temp}°C`, 128, 132);

        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00f3ff';
        ctx.fillText('CPU TEMP', 128, 168);

        ctx.font = '14px monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText('PUMP: 2450 RPM', 128, 88);
        texture.needsUpdate = true;
      }
    });

    return screenMesh;
  }

  // 6. GRAPHICS CARD (Extreme Realism: Heatpipes, Dense Fins, Flow-Through Backplate, Anti-Sag Column)
  buildGpu(gpuId = this.currentGpuId) {
    this.currentGpuId = gpuId;
    while (this.gpuGroup.children.length > 0) {
      this.gpuGroup.remove(this.gpuGroup.children[0]);
    }
    this.fansList = this.fansList.filter(f => !f.isGpuFan);

    const is4090 = gpuId.includes('4090');
    const is4080 = gpuId.includes('4080');
    const isWhite = gpuId.includes('white');
    const isRadeon = gpuId.includes('rx-');
    const is4060 = gpuId.includes('4060');

    const cardLength = is4090 ? 13.8 : (is4080 ? 12.6 : (is4060 ? 9.2 : 11.2));
    const cardHeight = is4090 ? 3.4 : (is4080 ? 2.9 : 2.1);
    const cardWidth = is4090 ? 4.4 : 3.8;

    const gpuAssembly = new THREE.Group();
    gpuAssembly.position.set(3.4, 0.5, -2 + cardLength / 2 - 4.5);

    // 1. Shroud Outer Shell
    const shroudColor = isWhite ? 0xffffff : (is4090 ? 0x090d14 : (isRadeon ? 0x18181b : 0x111622));
    const shroudMat = new THREE.MeshStandardMaterial({
      color: shroudColor,
      roughness: isWhite ? 0.2 : 0.35,
      metalness: isWhite ? 0.2 : 0.88
    });
    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(cardWidth, cardHeight, cardLength), shroudMat);
    gpuAssembly.add(bodyMesh);

    // 2. Dense Aluminum Radiator Fin Core (Visible along top & bottom)
    const finCore = new THREE.Mesh(
      new THREE.BoxGeometry(cardWidth - 0.4, cardHeight - 0.6, cardLength - 0.8),
      new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.18 })
    );
    gpuAssembly.add(finCore);

    // Carbon-Fiber Style Accent Plates on Shroud
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.85,
      roughness: 0.25
    });
    [-cardHeight / 2 + 0.35, cardHeight / 2 - 0.35].forEach(yPos => {
      const trim = new THREE.Mesh(
        new THREE.BoxGeometry(cardWidth + 0.05, 0.2, cardLength - 0.6),
        carbonMat
      );
      trim.position.set(0, yPos, 0);
      gpuAssembly.add(trim);
    });

    // 3. Exposed Heavy Copper Heatpipes (6 Pipes) Weaving Through Shroud Front & Cap Tips
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.15 });
    const chromeCapMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.98, roughness: 0.1 });
    for (let h = 0; h < 6; h++) {
      const yOffset = -cardHeight / 2 + 0.45 + h * (cardHeight - 0.9) / 5;
      const hp = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.9, 14), copperMat);
      hp.rotation.z = Math.PI / 2;
      hp.position.set(-cardWidth / 2 + 0.45, yOffset, cardLength / 2 + 0.18);
      gpuAssembly.add(hp);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 14), chromeCapMat);
      cap.rotation.z = Math.PI / 2;
      cap.position.set(-cardWidth / 2 + 0.95, yOffset, cardLength / 2 + 0.18);
      gpuAssembly.add(cap);
    }

    // 4. Brushed Metal Backplate with Flow-Through Screen Cutout
    const bpTex = this.getGpuBackplateTexture(isWhite, is4090 ? 'ROG MATRIX RTX 4090' : (isRadeon ? 'RADEON RX 7900 XTX' : 'GEFORCE RTX 4070S'));
    const bpMat = new THREE.MeshStandardMaterial({
      map: bpTex,
      roughness: 0.2,
      metalness: 0.9
    });
    const bpMesh = new THREE.Mesh(
      new THREE.BoxGeometry(cardWidth - 0.1, 0.14, cardLength - 0.1),
      bpMat
    );
    bpMesh.position.set(0, cardHeight / 2 + 0.08, 0);
    gpuAssembly.add(bpMesh);

    // 5. Side ARGB Logo Bar
    const logoTex = this.createCanvasTexture(`gpu_logo_${gpuId}`, 256, 64, (ctx, w, h) => {
      ctx.fillStyle = isWhite ? '#f8fafc' : '#05070c';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = isRadeon ? '#ef4444' : (isWhite ? '#0284c7' : '#00f3ff');
      ctx.font = 'bold 22px "Orbitron", monospace';
      ctx.fillText(is4090 ? 'ROG MATRIX RTX 4090' : (isRadeon ? 'RADEON RX 7900 XTX' : 'GEFORCE RTX™'), 12, 40);
    });
    const logoBar = new THREE.Mesh(
      new THREE.PlaneGeometry(cardLength * 0.65, 0.7),
      new THREE.MeshBasicMaterial({ map: logoTex, side: THREE.DoubleSide })
    );
    logoBar.rotation.y = -Math.PI / 2;
    logoBar.position.set(-cardWidth / 2 - 0.02, 0.2, 0);
    gpuAssembly.add(logoBar);

    // 6. Axial-Tech Cooling Fans with Reverse Center Fan
    const numFans = is4060 ? 2 : 3;
    const fanSpacing = (cardLength - 2.8) / (numFans - 1 || 1);
    const startZ = -cardLength / 2 + 1.4;

    for (let i = 0; i < numFans; i++) {
      const gpuFan = this.createFan3D(1.28, false, isWhite, 'gpu');
      gpuFan.isGpuFan = true;
      if (i === 1 && numFans === 3) {
        gpuFan.isReverseFan = true; // Counter-rotating middle fan for laminar zero-turbulence airflow
      }
      gpuFan.rotation.x = Math.PI / 2;
      gpuFan.position.set(0, -cardHeight / 2 - 0.05, startZ + i * fanSpacing);
      gpuAssembly.add(gpuFan);
    }

    // 7. PCIe Gold Contact Fingers with Notch
    const goldPcie = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.55, cardLength * 0.45),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 })
    );
    goldPcie.position.set(cardWidth / 2 - 0.1, cardHeight / 2 + 0.28, -cardLength / 4);
    gpuAssembly.add(goldPcie);

    // 8. 12VHPWR 16-Pin Power Connector Socket with Clip
    const pwrSocket = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.45, 0.95),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.6 })
    );
    pwrSocket.position.set(-cardWidth / 2 + 0.35, cardHeight / 2 + 0.22, 0.8);
    gpuAssembly.add(pwrSocket);

    // 9. Metal Rear Bracket with DisplayPort / HDMI Ports & Thumbscrews
    const bracketMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, cardHeight + 1.2, 3.8),
      new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15 })
    );
    bracketMesh.position.set(cardWidth / 2 - 0.1, 0.5, -cardLength / 2);
    gpuAssembly.add(bracketMesh);

    // 10. Telescoping Aluminum Anti-Sag Support Column
    const sagGroup = new THREE.Group();
    sagGroup.position.set(-cardWidth / 2 + 0.6, -cardHeight / 2, cardLength / 2 - 1.2);

    const sagColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 4.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.9, roughness: 0.2 })
    );
    sagColumn.position.set(0, -2.25, 0);
    sagGroup.add(sagColumn);

    const knurledRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.4, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.3 })
    );
    knurledRing.position.set(0, -1.2, 0);
    sagGroup.add(knurledRing);

    const supportPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.18, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5 })
    );
    supportPad.position.set(0, -0.05, 0);
    sagGroup.add(supportPad);

    gpuAssembly.add(sagGroup);

    this.gpuGroup.add(gpuAssembly);
  }

  // 7. REALISTIC CABLES & ROUTING (24-Pin ATX + 16-Pin 12VHPWR + Combs)
  buildCables() {
    while (this.cablesGroup.children.length > 0) {
      this.cablesGroup.remove(this.cablesGroup.children[0]);
    }

    const isWhite = this.currentCaseId === 'case-panoramic-snow';
    const cableMat = new THREE.MeshStandardMaterial({
      color: isWhite ? 0xffffff : 0x111827,
      roughness: 0.8,
      map: this.getCableTexture(isWhite)
    });
    const combMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2 });

    // 1. 24-Pin ATX Main Motherboard Cable (Sweeping Ribbon)
    const atxGroup = new THREE.Group();
    for (let w = -5; w <= 5; w++) {
      const zOffset = w * 0.12;
      const atxCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(5.15, 3.8, 2.4 + zOffset),
        new THREE.Vector3(4.2, 3.8, 3.2 + zOffset),
        new THREE.Vector3(3.4, 3.8, 5.2 + zOffset),
        new THREE.Vector3(5.2, 3.8, 6.2 + zOffset)
      ]);
      const wire = new THREE.Mesh(new THREE.TubeGeometry(atxCurve, 20, 0.055, 8, false), cableMat);
      atxGroup.add(wire);
    }

    // Acrylic Cable Combs holding 24-Pin ATX
    const comb1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 1.4), combMat);
    comb1.position.set(4.3, 3.8, 3.4);
    atxGroup.add(comb1);

    const comb2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 1.4), combMat);
    comb2.position.set(3.8, 3.8, 4.6);
    atxGroup.add(comb2);

    this.cablesGroup.add(atxGroup);

    // 2. 12VHPWR 16-Pin Sleeved GPU Cable
    const gpuCableGroup = new THREE.Group();
    for (let w = -3; w <= 3; w++) {
      const zOffset = w * 0.1;
      const gpuCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.6, 0.7, 0.8 + zOffset),
        new THREE.Vector3(1.2, -1.6, 1.4 + zOffset),
        new THREE.Vector3(0.5, -4.5, 1.6 + zOffset)
      ]);
      const wire = new THREE.Mesh(new THREE.TubeGeometry(gpuCurve, 16, 0.06, 8, false), cableMat);
      gpuCableGroup.add(wire);
    }

    // GPU Cable Comb
    const gpuComb = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.8), combMat);
    gpuComb.position.set(1.2, -1.6, 1.4);
    gpuCableGroup.add(gpuComb);

    this.cablesGroup.add(gpuCableGroup);
  }

  // 8. HYPER-REALISTIC FANS (Square PBT Frame, Anti-Vibration Pads, Rear Stator Vanes,
  // Infinity Mirror Hub, Sickle Axial-Tech Blades, and Wire Clips)
  createFan3D(radius = 1.8, isCaseFan = false, isWhite = false, fanType = 'case') {
    const fanGroup = new THREE.Group();
    const isGpu = fanType === 'gpu';

    const frameDepth = 0.54;
    const frameSize = radius * 2.14;

    const frameColor = isWhite ? 0xffffff : 0x0f1420;
    const frameMat = new THREE.MeshStandardMaterial({
      color: frameColor,
      roughness: isWhite ? 0.3 : 0.45,
      metalness: isWhite ? 0.15 : 0.55
    });

    // ------------------------------------------------------------------------
    // A. SQUARE INDUSTRIAL HOUSING & STATOR VANES (For Case, Radiator & CPU Coolers)
    // ------------------------------------------------------------------------
    if (!isGpu) {
      // 1. Aerodynamic Circular Tunnel Funnel
      const tunnel = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 1.02, radius * 1.04, frameDepth, 36, 1, true),
        frameMat
      );
      tunnel.rotation.x = Math.PI / 2;
      fanGroup.add(tunnel);

      // 2. Square Frame Outer Flanges & 4 Corner Blocks
      const cornerSpan = frameSize / 2 - 0.28;
      const cornerBlockSize = radius * 0.48;
      const padMat = new THREE.MeshStandardMaterial({
        color: isWhite ? 0x94a3b8 : 0x05070a,
        roughness: 0.9,
        metalness: 0.05
      });
      const screwMat = new THREE.MeshStandardMaterial({
        color: 0xd4d4d8,
        metalness: 0.95,
        roughness: 0.15
      });

      const corners = [
        [-cornerSpan, cornerSpan],
        [cornerSpan, cornerSpan],
        [-cornerSpan, -cornerSpan],
        [cornerSpan, -cornerSpan]
      ];

      corners.forEach(([cx, cy]) => {
        // Corner Mounting Block
        const cornerMesh = new THREE.Mesh(
          new THREE.BoxGeometry(cornerBlockSize, cornerBlockSize, frameDepth),
          frameMat
        );
        cornerMesh.position.set(cx, cy, 0);
        fanGroup.add(cornerMesh);

        // Front & Rear Silicone Anti-Vibration Dampening Pads
        [-frameDepth / 2 - 0.03, frameDepth / 2 + 0.03].forEach(zPos => {
          const pad = new THREE.Mesh(
            new THREE.BoxGeometry(cornerBlockSize * 0.92, cornerBlockSize * 0.92, 0.06),
            padMat
          );
          pad.position.set(cx, cy, zPos);
          fanGroup.add(pad);
        });

        // Countersunk Hex Screw Hole & Steel Bolt
        const bolt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12),
          screwMat
        );
        bolt.rotation.x = Math.PI / 2;
        bolt.position.set(cx, cy, frameDepth / 2 + 0.05);
        fanGroup.add(bolt);
      });

      // 3. Side Brushed Aluminum Accent Plates (Lian Li UNI FAN style)
      const sideTrimMat = new THREE.MeshStandardMaterial({
        color: isWhite ? 0xf1f5f9 : 0x27272a,
        metalness: 0.92,
        roughness: 0.2
      });
      [-frameSize / 2, frameSize / 2].forEach(xSide => {
        const sidePlate = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, frameSize * 0.72, frameDepth - 0.08),
          sideTrimMat
        );
        sidePlate.position.set(xSide, 0, 0);
        fanGroup.add(sidePlate);

        // Lateral ARGB Accent Light Strip
        const sideLedMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
        this.rgbMaterials.push(sideLedMat);
        const sideLed = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, frameSize * 0.6, 0.08),
          sideLedMat
        );
        sideLed.position.set(xSide, 0, 0);
        fanGroup.add(sideLed);
      });

      // 4. Rear Aerodynamic Stator Vanes (Curved Struts) & Motor Base
      const statorMat = new THREE.MeshStandardMaterial({
        color: frameColor,
        roughness: 0.4,
        metalness: isWhite ? 0.2 : 0.6
      });
      for (let s = 0; s < 4; s++) {
        const angle = (s / 4) * Math.PI * 2 + Math.PI / 4;
        const strutCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, -frameDepth / 2 + 0.04),
          new THREE.Vector3(Math.cos(angle + 0.2) * radius * 0.55, Math.sin(angle + 0.2) * radius * 0.55, -frameDepth / 2 + 0.04),
          new THREE.Vector3(Math.cos(angle) * radius * 0.98, Math.sin(angle) * radius * 0.98, -frameDepth / 2 + 0.04)
        ]);
        const strut = new THREE.Mesh(new THREE.TubeGeometry(strutCurve, 12, 0.07, 8, false), statorMat);
        fanGroup.add(strut);
      }

      // Rear Motor Hub Housing & Spec Label
      const rearMotorCan = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.4, radius * 0.4, 0.22, 28),
        statorMat
      );
      rearMotorCan.rotation.x = Math.PI / 2;
      rearMotorCan.position.set(0, 0, -frameDepth / 2 + 0.1);
      fanGroup.add(rearMotorCan);

      const labelTex = this.createCanvasTexture('fan_rear_label', 128, 128, (ctx, w, h) => {
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#a1a1aa';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CYBER-LAB', w/2, 45);
        ctx.fillText('DC 12V 0.35A', w/2, 65);
        ctx.fillText('PWM FDB', w/2, 85);
      });
      const rearLabel = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.36, 24), new THREE.MeshBasicMaterial({ map: labelTex }));
      rearLabel.position.set(0, 0, -frameDepth / 2 - 0.02);
      rearLabel.rotation.y = Math.PI;
      fanGroup.add(rearLabel);
    }

    // ------------------------------------------------------------------------
    // B. OUTER ARGB HALO DIFFUSER RING
    // ------------------------------------------------------------------------
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    this.rgbMaterials.push(ringMat);
    const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.96, 0.09, 14, 48), ringMat);
    fanGroup.add(ringMesh);

    // ------------------------------------------------------------------------
    // C. ROTOR ASSEMBLY: SICKLE BLADES, AXIAL-TECH RING & INFINITY MIRROR HUB
    // ------------------------------------------------------------------------
    const rotorGroup = new THREE.Group();
    rotorGroup.isCaseFan = isCaseFan;

    // 1. Central Motor Housing & CNC Aluminum Beveled Ring
    const hubRadius = radius * 0.38;
    const hubMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(hubRadius, hubRadius, frameDepth * 0.72, 32),
      new THREE.MeshStandardMaterial({
        color: isWhite ? 0xffffff : 0x0f1420,
        roughness: 0.2,
        metalness: 0.85
      })
    );
    hubMesh.rotation.x = Math.PI / 2;
    rotorGroup.add(hubMesh);

    // Front CNC Diamond-Cut Bezel Ring
    const cncBezel = new THREE.Mesh(
      new THREE.TorusGeometry(hubRadius - 0.02, 0.05, 12, 36),
      new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15 })
    );
    cncBezel.position.z = frameDepth * 0.36;
    rotorGroup.add(cncBezel);

    // Front Infinity Mirror Multi-Layer Center Hub
    const hubTex = this.getFanHubTexture(isWhite);
    const badgePlane = new THREE.Mesh(
      new THREE.CircleGeometry(hubRadius - 0.04, 32),
      new THREE.MeshBasicMaterial({ map: hubTex })
    );
    badgePlane.position.z = frameDepth * 0.37;
    rotorGroup.add(badgePlane);

    // Internal Hub ARGB Emitter Disc (Glows through frosted blades)
    const hubGlowMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    this.rgbMaterials.push(hubGlowMat);
    const hubGlow = new THREE.Mesh(new THREE.CircleGeometry(hubRadius * 0.85, 24), hubGlowMat);
    hubGlow.position.z = 0.05;
    rotorGroup.add(hubGlow);

    // 2. Nine Sculpted Aerodynamic Sickle Blades
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.16,
      transmission: 0.84,
      transparent: true,
      opacity: 0.91
    });

    const numBlades = 9;
    const bladeSpan = radius * 0.58;

    for (let b = 0; b < numBlades; b++) {
      const angle = (b / numBlades) * Math.PI * 2;
      const bladeGroup = new THREE.Group();
      bladeGroup.rotation.z = angle;

      // Sculpted 3D Sickle Blade with Twisted Pitch (Angle of Attack)
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(bladeSpan, 0.065, radius * 0.36),
        bladeMat
      );
      blade.position.set(hubRadius + bladeSpan / 2 - 0.04, 0, 0.02);
      // Aerodynamic twist: steeper angle near the hub, flatter near the tip
      blade.rotation.x = 0.52;
      blade.rotation.y = 0.12;
      bladeGroup.add(blade);

      rotorGroup.add(bladeGroup);
    }

    // 3. Axial-Tech Stabilizing Outer Ring (Unites all blade tips)
    const axialRing = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 0.93, 0.045, 12, 48),
      bladeMat
    );
    axialRing.position.z = 0.03;
    rotorGroup.add(axialRing);

    fanGroup.add(rotorGroup);
    this.fansList.push(rotorGroup);

    return fanGroup;
  }

  // ==========================================================================
  // 9. CASE CHASSIS BUILDER: 6 UNIQUE ARCHITECTURES
  // ==========================================================================
  buildCase(caseId = this.currentCaseId, psuId = this.currentPsuId) {
    this.currentCaseId = caseId;
    this.currentPsuId = psuId;

    while (this.chassisGroup.children.length > 0) {
      this.chassisGroup.remove(this.chassisGroup.children[0]);
    }
    this.fansList = this.fansList.filter(f => !f.isCaseFan);

    const isNordicWood = caseId === 'case-nordic-wood'; // Fractal North Charcoal Walnut
    const isSnowWhite = caseId === 'case-panoramic-snow'; // Lian Li O11 Vision Pure White
    const isMechaSkeleton = caseId === 'case-mecha-cyber'; // Cougar Conquer Mecha
    const isHyteScreen = caseId === 'case-prestige-hyte'; // HYTE Y70 Touch Screen
    const isDigitalDisplay = caseId === 'case-cyber-cube'; // DeepCool CH560

    const width = 12;
    const height = 16;
    const depth = 18;

    // Materials
    const frameColor = isSnowWhite ? 0xffffff : (isNordicWood ? 0x18181b : (isMechaSkeleton ? 0x09090b : 0x0f1420));
    const metalMat = new THREE.MeshStandardMaterial({
      color: frameColor,
      roughness: isSnowWhite ? 0.2 : 0.35,
      metalness: isSnowWhite ? 0.1 : 0.85
    });

    const darkFrameMat = new THREE.MeshStandardMaterial({
      color: isSnowWhite ? 0xf1f5f9 : (isNordicWood ? 0x27272a : 0x090c13),
      roughness: 0.4,
      metalness: isSnowWhite ? 0.2 : 0.9
    });

    // 1. Back Chassis Wall with Expansion Slots & Thumbscrews
    const backMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.4), metalMat);
    backMesh.position.set(0, 0, -depth / 2);
    this.chassisGroup.add(backMesh);

    // 7x PCIe Expansion Slot Covers with Honeycomb Ventilation
    for (let p = 0; p < 7; p++) {
      const pcieCover = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.4, 2.2),
        new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.9 })
      );
      pcieCover.position.set(width / 2 - 1.2, 1.2 - p * 0.65, -depth / 2 + 0.3);
      this.chassisGroup.add(pcieCover);
    }

    // 2. Motherboard Tray with Stamped Grommets & CPU Cutout
    const trayMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, height, depth), metalMat);
    trayMesh.position.set(width / 2, 0, 0);
    this.chassisGroup.add(trayMesh);

    // 2x 2.5" SSD Mounting Sleds on Rear of Motherboard Tray
    for (let s = 0; s < 2; s++) {
      const ssdSled = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 1.8, 2.6),
        new THREE.MeshStandardMaterial({ color: isSnowWhite ? 0xf1f5f9 : 0x27272a, metalness: 0.85, roughness: 0.25 })
      );
      ssdSled.position.set(width / 2 + 0.16, -1.2 + s * 2.9, -depth / 4);
      this.chassisGroup.add(ssdSled);
    }

    // Rolled-Edge CPU Socket Access Window in Tray
    const cpuCutout = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 4.2, 4.2),
      darkFrameMat
    );
    cpuCutout.position.set(width / 2, 3.8, -2.6);
    this.chassisGroup.add(cpuCutout);

    // Rubber Cable Pass-Through Grommets
    const grommetMat = new THREE.MeshStandardMaterial({ color: isSnowWhite ? 0xe2e8f0 : 0x05070c, roughness: 0.9 });
    const grommet1 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 3.2, 0.9), grommetMat);
    grommet1.position.set(width / 2, 3.8, 3.6);
    this.chassisGroup.add(grommet1);

    const grommet2 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.9, 2.8), grommetMat);
    grommet2.position.set(width / 2, -height / 2 + 4.3, 1.6);
    this.chassisGroup.add(grommet2);

    // 3. Top Panel with Magnetic Dust Filter
    const topMesh = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), darkFrameMat);
    topMesh.position.set(0, height / 2, 0);
    this.chassisGroup.add(topMesh);

    // Magnetic Dust Filter Mesh on Top
    const filterTex = this.createCanvasTexture('top_dust_filter', 256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#27272a';
      for (let x = 0; x < w; x += 6) {
        for (let y = 0; y < h; y += 6) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    });
    const filterMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width - 1.5, depth - 2.5),
      new THREE.MeshStandardMaterial({ map: filterTex, roughness: 0.85 })
    );
    filterMesh.rotation.x = -Math.PI / 2;
    filterMesh.position.set(0, height / 2 + 0.22, 0);
    this.chassisGroup.add(filterMesh);

    // Fractal North Signature Brown Leather Pull Tab on Top Filter
    if (isNordicWood) {
      const leatherTab = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.08, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 })
      );
      leatherTab.position.set(0, height / 2 + 0.26, -depth / 2 + 1.2);
      this.chassisGroup.add(leatherTab);
    }

    // Front Panel I/O: Power Button with Brass / LED Bezel
    const pwrBtnMat = new THREE.MeshStandardMaterial({
      color: isNordicWood ? 0xd97706 : (isSnowWhite ? 0xffffff : 0x00f3ff),
      emissive: isNordicWood ? 0xb45309 : (isSnowWhite ? 0x38bdf8 : 0x00f3ff),
      emissiveIntensity: 0.6,
      metalness: isNordicWood ? 0.95 : 0.5
    });
    this.rgbMaterials.push(pwrBtnMat);
    this.pwrButtonMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.25, 24), pwrBtnMat);
    this.pwrButtonMesh.position.set(-width / 2 + 1.8, height / 2 + 0.25, depth / 2 - 1.5);
    this.chassisGroup.add(this.pwrButtonMesh);

    // Front I/O Ports with Brass Gold Rings (if Nordic Wood)
    const ioPortMat = new THREE.MeshStandardMaterial({
      color: isNordicWood ? 0xd97706 : 0x94a3b8,
      metalness: 0.92,
      roughness: 0.2
    });
    for (let u = 0; u < 2; u++) {
      const usbPort = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.1, 0.45), ioPortMat);
      usbPort.position.set(-width / 2 + 2.8 + u * 0.7, height / 2 + 0.21, depth / 2 - 1.5);
      this.chassisGroup.add(usbPort);
    }

    // 4. Bottom Chassis & Machined Aluminum Feet with Rubber Pads
    const botMesh = new THREE.Mesh(new THREE.BoxGeometry(width, 0.6, depth), darkFrameMat);
    botMesh.position.set(0, -height / 2, 0);
    this.chassisGroup.add(botMesh);

    const footMat = new THREE.MeshStandardMaterial({
      color: isSnowWhite ? 0xd1d5db : (isNordicWood ? 0xd97706 : 0x05070a),
      metalness: isNordicWood ? 0.9 : 0.3
    });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 });
    [[-width/2+1.4, -depth/2+1.8], [width/2-1.4, -depth/2+1.8], [-width/2+1.4, depth/2-1.8], [width/2-1.4, depth/2-1.8]].forEach(([x, z]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.7, 24), footMat);
      foot.position.set(x, -height/2 - 0.35, z);
      this.chassisGroup.add(foot);

      const rubberPad = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.15, 24), rubberMat);
      rubberPad.position.set(x, -height/2 - 0.72, z);
      this.chassisGroup.add(rubberPad);
    });

    // 5. PSU Shroud with Side Window & Live OLED Power Display (ASUS ROG Thor)
    const psuShroud = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, 4.4, depth - 0.4), metalMat);
    psuShroud.position.set(0, -height / 2 + 2.2, 0);
    this.chassisGroup.add(psuShroud);

    const isOledPsu = psuId.includes('oled') || psuId.includes('1200w');
    const psuTexture = this.createCanvasTexture(`psu_label_${psuId}`, 256, 128, (ctx, w, h) => {
      ctx.fillStyle = isSnowWhite ? '#f8fafc' : '#05070c';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = isSnowWhite ? '#e2e8f0' : '#1e293b';
      ctx.fillRect(6, 6, w - 12, h - 12);

      if (isOledPsu) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(16, 20, w - 32, 60);
        ctx.fillStyle = '#00f3ff';
        ctx.font = 'bold 22px "Orbitron", monospace';
        ctx.fillText('ROG THOR 1200W', 24, 46);
        ctx.fillStyle = '#00ff66';
        ctx.font = 'bold 28px monospace';
        ctx.fillText('485W LIVE', 24, 72);
      } else {
        ctx.fillStyle = isSnowWhite ? '#0f172a' : '#ffffff';
        ctx.font = 'bold 22px monospace';
        ctx.fillText(psuId.toUpperCase().replace('PSU-', '').replace('-', ' '), 20, 50);
        ctx.fillStyle = psuId.includes('gold') ? '#f59e0b' : '#38bdf8';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('80 PLUS CERTIFIED', 20, 80);
      }
    });

    const psuCutoutMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 2.6),
      new THREE.MeshBasicMaterial({ map: psuTexture })
    );
    psuCutoutMesh.rotation.y = Math.PI / 2;
    psuCutoutMesh.position.set(-width / 2 + 0.18, -height / 2 + 2.2, -1.8);
    this.chassisGroup.add(psuCutoutMesh);

    // CH560 Digital Telemetry LCD on Shroud
    if (isDigitalDisplay) {
      const ch560Tex = this.createCanvasTexture('ch560_screen', 256, 128, (ctx, w, h) => {
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#00ff66';
        ctx.font = 'bold 24px "Orbitron", monospace';
        ctx.fillText('CPU: 42°C | 65W', 14, 48);
        ctx.fillStyle = '#00f3ff';
        ctx.fillText('GPU: 38°C | 185W', 14, 88);
      });
      const lcd = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 1.8), new THREE.MeshBasicMaterial({ map: ch560Tex }));
      lcd.rotation.y = Math.PI / 2;
      lcd.position.set(-width / 2 + 0.16, -height / 2 + 2.2, 3.8);
      this.chassisGroup.add(lcd);
    }

    // 6. FRONT PANEL CUSTOM ARCHITECTURE
    if (isNordicWood) {
      // Fractal North Charcoal Walnut: Real Vertical Wood Slats with Rich Grain
      const frontWoodFrame = new THREE.Mesh(new THREE.BoxGeometry(width, height - 0.6, 0.4), darkFrameMat);
      frontWoodFrame.position.set(0, 0, depth / 2);
      this.chassisGroup.add(frontWoodFrame);

      const walnutTex = this.createCanvasTexture('walnut_wood_grain', 256, 512, (ctx, w, h) => {
        ctx.fillStyle = '#452a18';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#341f12';
        for (let i = 0; i < 40; i++) {
          const y = Math.random() * h;
          ctx.fillRect(0, y, w, 2 + Math.random() * 4);
        }
      });
      const walnutMat = new THREE.MeshStandardMaterial({
        map: walnutTex,
        roughness: 0.65,
        metalness: 0.05
      });

      for (let i = -3.5; i <= 3.5; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.85, height - 1.2, 0.4), walnutMat);
        slat.position.set(i * 1.35, 0, depth / 2 + 0.3);
        this.chassisGroup.add(slat);
      }

    } else if (isSnowWhite) {
      // Lian Li O11 Vision Pure White: Dual Seamless Panoramic Glass
      const frontGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.05,
        transmission: 0.96,
        transparent: true,
        opacity: 0.35
      });
      const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(width, height - 0.6, 0.3), frontGlassMat);
      frontGlass.position.set(0, 0, depth / 2);
      this.chassisGroup.add(frontGlass);

    } else if (isMechaSkeleton) {
      // Cougar Conquer Mecha: Open-Air Orange Exoskeleton Wings & Trusses
      const mechaMat = new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.8, roughness: 0.25 });
      const wing1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, height, 4.0), mechaMat);
      wing1.rotation.y = Math.PI / 6;
      wing1.position.set(-width / 2 - 1.0, 1.0, depth / 2 - 1.5);
      this.chassisGroup.add(wing1);

      const wing2 = new THREE.Mesh(new THREE.BoxGeometry(width - 2, 1.2, 3.0), mechaMat);
      wing2.rotation.x = Math.PI / 6;
      wing2.position.set(0, height / 2 + 0.8, depth / 2 - 1.0);
      this.chassisGroup.add(wing2);

      const frontFan = this.createFan3D(2.0, true, false);
      frontFan.position.set(0, 0, depth / 2 - 0.4);
      this.chassisGroup.add(frontFan);

    } else if (isHyteScreen) {
      // HYTE Y70 Touch: 45° Corner 2.5K Touchscreen Display
      const frontMesh = new THREE.Mesh(new THREE.BoxGeometry(width - 3.2, height - 0.6, 0.4), darkFrameMat);
      frontMesh.position.set(1.6, 0, depth / 2);
      this.chassisGroup.add(frontMesh);

      const hyteCanvas = document.createElement('canvas');
      hyteCanvas.width = 256;
      hyteCanvas.height = 512;
      const hCtx = hyteCanvas.getContext('2d');
      const hyteTex = new THREE.CanvasTexture(hyteCanvas);

      this.animatedScreens.push({
        canvas: hyteCanvas,
        ctx: hCtx,
        texture: hyteTex,
        type: 'hyte',
        draw: (now) => {
          hCtx.fillStyle = '#05070e';
          hCtx.fillRect(0, 0, 256, 512);

          // Top Header
          hCtx.fillStyle = '#00f3ff';
          hCtx.font = 'bold 26px "Orbitron", monospace';
          hCtx.fillText('HYTE 2.5K', 20, 50);

          hCtx.fillStyle = '#ff007f';
          hCtx.font = 'bold 18px monospace';
          hCtx.fillText('SYSTEM TELEMETRY', 20, 85);

          // Animated Audio Visualizer Bars
          for (let b = 0; b < 18; b++) {
            const barH = 15 + Math.sin(now * 0.005 + b * 0.4) * 35 + Math.sin(now * 0.01 + b) * 20;
            hCtx.fillStyle = b > 12 ? '#ff007f' : '#00f3ff';
            hCtx.fillRect(20 + b * 12, 220 - barH, 8, barH);
          }

          // Live Metrics
          hCtx.fillStyle = '#ffffff';
          hCtx.font = '22px monospace';
          hCtx.fillText('CPU: 4.8 GHz', 20, 290);
          hCtx.fillText('GPU: 2550 MHz', 20, 330);
          hCtx.fillText('VRAM: 6.8 / 16GB', 20, 370);

          hCtx.fillStyle = '#00ff66';
          hCtx.font = 'bold 26px "Orbitron", monospace';
          hCtx.fillText('FPS: 185 AVG', 20, 440);

          hyteTex.needsUpdate = true;
        }
      });

      const scrMesh = new THREE.Mesh(
        new THREE.BoxGeometry(4.8, height - 0.8, 0.3),
        new THREE.MeshBasicMaterial({ map: hyteTex })
      );
      scrMesh.rotation.y = -Math.PI / 4;
      scrMesh.position.set(-width / 2 + 1.8, 0, depth / 2 - 1.8);
      this.chassisGroup.add(scrMesh);

    } else {
      // High-Airflow Honeycomb Mesh Front with 3x ARGB Intake Fans
      const frontMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height - 0.6, 0.6), darkFrameMat);
      frontMesh.position.set(0, 0, depth / 2);
      this.chassisGroup.add(frontMesh);

      for (let i = 0; i < 3; i++) {
        const fan = this.createFan3D(1.8, true, isSnowWhite);
        fan.position.set(0, 4.5 - i * 4.2, depth / 2 - 0.6);
        this.chassisGroup.add(fan);
      }
    }

    // Rear ARGB 120mm Exhaust Fan
    const rearFan = this.createFan3D(1.8, true, isSnowWhite);
    rearFan.rotation.y = Math.PI;
    rearFan.position.set(1.5, 3.5, -depth / 2 + 0.8);
    this.chassisGroup.add(rearFan);

    // Tempered Glass Panel with Screen-Printed Ceramic Border
    this.buildGlassPanel(width, height, depth, isSnowWhite);
  }

  // Tempered Glass Side Panel with Ceramic Frit Border & Thumbscrews
  buildGlassPanel(width, height, depth, isSnowWhite = false) {
    if (this.glassPanelGroup) {
      this.chassisGroup.remove(this.glassPanelGroup);
    }

    this.glassPanelGroup = new THREE.Group();
    this.glassPanelGroup.position.set(-width / 2, 0, -depth / 2 + 0.2);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: isSnowWhite ? 0xffffff : 0x1e293b,
      roughness: 0.04,
      metalness: 0.05,
      transmission: 0.95,
      transparent: true,
      opacity: 0.32,
      reflectivity: 0.8
    });

    const glassMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, height - 0.6, depth - 0.4), glassMat);
    glassMesh.position.set(0, 0, (depth - 0.4) / 2);
    this.glassPanelGroup.add(glassMesh);

    // Black Ceramic Frit Silk Border
    const fritMat = new THREE.MeshStandardMaterial({
      color: isSnowWhite ? 0xffffff : 0x05070a,
      roughness: 0.3,
      metalness: 0.8
    });

    // Top & Bottom Rim
    const topRim = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.35, depth - 0.4), fritMat);
    topRim.position.set(0, height / 2 - 0.45, (depth - 0.4) / 2);
    this.glassPanelGroup.add(topRim);

    const botRim = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.35, depth - 0.4), fritMat);
    botRim.position.set(0, -height / 2 + 0.45, (depth - 0.4) / 2);
    this.glassPanelGroup.add(botRim);

    // 4 CNC Machined Thumbscrews with Rubber Washers
    const screwMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.2 });
    [[height/2 - 0.8, 1.2], [height/2 - 0.8, depth - 1.6], [-height/2 + 0.8, 1.2], [-height/2 + 0.8, depth - 1.6]].forEach(([y, z]) => {
      const scr = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 16), screwMat);
      scr.rotation.z = Math.PI / 2;
      scr.position.set(-0.15, y, z);
      this.glassPanelGroup.add(scr);
    });

    this.chassisGroup.add(this.glassPanelGroup);
    this.updateGlassPosition(false);
  }

  toggleGlassPanel() {
    this.isGlassOpen = !this.isGlassOpen;
    this.updateGlassPosition(true);
    return this.isGlassOpen;
  }

  updateGlassPosition(animate = true) {
    if (!this.glassPanelGroup) return;
    const targetAngle = this.isGlassOpen ? -Math.PI / 2.2 : 0;

    if (!animate) {
      this.glassPanelGroup.rotation.y = targetAngle;
      return;
    }

    const startAngle = this.glassPanelGroup.rotation.y;
    const startTime = performance.now();
    const duration = 500;

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      this.glassPanelGroup.rotation.y = startAngle + (targetAngle - startAngle) * ease;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ==========================================================================
  // INTERACTIVE STEP-BY-STEP ASSEMBLY DOCK ANIMATIONS
  // ==========================================================================
  animatePartDock(part, animate = true, callback = null) {
    let targetGroup = null;
    let offsetAxis = 'x';
    let offsetVal = 3.5;

    switch (part) {
      case 'motherboard':
        targetGroup = this.mbMeshGroup;
        offsetAxis = 'x';
        offsetVal = -3.5;
        break;
      case 'cpu':
        targetGroup = this.cpuChipGroup;
        offsetAxis = 'x';
        offsetVal = -2.5;
        break;
      case 'cooler':
        targetGroup = this.coolerGroup;
        offsetAxis = 'x';
        offsetVal = -4.0;
        break;
      case 'ram':
        targetGroup = this.ramGroup;
        offsetAxis = 'y';
        offsetVal = 3.0;
        break;
      case 'gpu':
        targetGroup = this.gpuGroup;
        offsetAxis = 'x';
        offsetVal = -4.5;
        break;
    }

    if (!targetGroup) {
      if (callback) callback();
      return;
    }

    if (!animate) {
      if (callback) callback();
      return;
    }

    const origPos = targetGroup.position[offsetAxis];
    targetGroup.position[offsetAxis] += offsetVal;

    const startTime = performance.now();
    const duration = 600;

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      targetGroup.position[offsetAxis] = origPos + offsetVal * (1 - ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        targetGroup.position[offsetAxis] = origPos;
        this.flashHighlight(targetGroup);
        if (callback) callback();
      }
    };
    requestAnimationFrame(step);
  }

  // Toggle Component Assembly/Disassembly State in 3D
  toggleComponent(partKey) {
    if (this.installed[partKey] === undefined) this.installed[partKey] = true;
    this.installed[partKey] = !this.installed[partKey];
    const isInst = this.installed[partKey];

    switch (partKey) {
      case 'gpu':
        this.gpuGroup.visible = isInst;
        if (isInst) this.animatePartDock('gpu', true);
        break;
      case 'cooler':
        this.coolerGroup.visible = isInst;
        if (isInst) this.animatePartDock('cooler', true);
        break;
      case 'ram':
        this.ramGroup.visible = isInst;
        if (isInst) this.animatePartDock('ram', true);
        break;
      case 'cpu':
        this.cpuChipGroup.visible = isInst;
        if (this.thermalPasteMesh) this.thermalPasteMesh.visible = isInst && this.thermalPasteApplied;
        if (isInst) this.animatePartDock('cpu', true);
        break;
      case 'motherboard':
        this.mbMeshGroup.visible = isInst;
        if (isInst) this.animatePartDock('motherboard', true);
        break;
      case 'ssd':
        this.ssdGroup.visible = isInst;
        break;
      case 'cables':
        this.cablesGroup.visible = isInst;
        break;
      case 'glass':
        if (this.glassPanelGroup) this.glassPanelGroup.visible = isInst;
        break;
    }
    return isInst;
  }

  applyThermalPaste(callback = null) {
    this.thermalPasteApplied = true;
    this.buildThermalPaste();

    if (this.thermalPasteMesh) {
      this.thermalPasteMesh.scale.set(0.01, 0.01, 0.01);
      const startTime = performance.now();
      const duration = 450;

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const s = 0.01 + ease * 0.99;
        this.thermalPasteMesh.scale.set(s, s, s);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          if (callback) callback();
        }
      };
      requestAnimationFrame(step);
    } else if (callback) {
      callback();
    }
  }

  // ==========================================================================
  // POWER ON / BOOT SEQUENCE WITH POST LED SEQUENCE
  // ==========================================================================
  togglePower(isPower = !this.isPoweredOn) {
    this.isPoweredOn = isPower;
    this.targetFanSpeed = this.isPoweredOn ? 0.14 : 0.0;

    // Physical button depression animation
    if (this.pwrButtonMesh) {
      this.pwrButtonMesh.position.y -= 0.1;
      setTimeout(() => {
        if (this.pwrButtonMesh) this.pwrButtonMesh.position.y += 0.1;
      }, 150);
    }

    // Blinking POST Diagnostic LEDs (CPU -> DRAM -> VGA -> BOOT OK)
    if (this.isPoweredOn) {
      if (this.postLeds && this.postLeds.length > 0) {
        this.postLeds.forEach((led, idx) => {
          led.visible = false;
          setTimeout(() => {
            led.visible = true;
            setTimeout(() => {
              if (idx < 3) led.visible = false;
            }, 450);
          }, idx * 350);
        });
      }
      this.applyRgbColor(this.currentRgbColor);
    } else {
      if (this.postLeds) {
        this.postLeds.forEach(led => led.visible = false);
      }
      this.applyRgbColor(new THREE.Color(0x000000));
    }

    return this.isPoweredOn;
  }

  // ==========================================================================
  // RGB THEMES & LIGHTING
  // ==========================================================================
  setRgbTheme(colorKey) {
    if (colorKey === 'rainbow') {
      this.isRainbow = true;
      return;
    }

    this.isRainbow = false;
    let hex = 0x00f3ff;
    if (colorKey === 'purple') hex = 0xff007f;
    if (colorKey === 'green') hex = 0x00ff66;
    if (colorKey === 'red') hex = 0xff2a4d;

    this.currentRgbColor.setHex(hex);
    this.applyRgbColor(this.currentRgbColor);
  }

  applyRgbColor(color) {
    const intensity = this.isPoweredOn ? 1.0 : 0.05;
    this.rgbLights.forEach(light => {
      light.color.copy(color);
      light.intensity = 2.6 * intensity;
    });

    this.rgbMaterials.forEach(mat => {
      mat.color.copy(color);
    });
  }

  // ==========================================================================
  // ROUTER FOR COMPONENT UPDATES
  // ==========================================================================
  updateComponent(category, itemId) {
    let targetGroup = null;

    switch (category) {
      case 'case':
        this.buildCase(itemId);
        this.buildCables();
        targetGroup = this.chassisGroup;
        break;
      case 'cooler':
        this.buildCooler(itemId);
        targetGroup = this.coolerGroup;
        break;
      case 'motherboard':
        this.buildMotherboard(itemId);
        this.buildCpuChip();
        this.buildThermalPaste();
        this.buildCables();
        targetGroup = this.mbMeshGroup;
        break;
      case 'ram':
        this.buildRam(itemId);
        targetGroup = this.ramGroup;
        break;
      case 'gpu':
        this.buildGpu(itemId);
        this.buildCables();
        targetGroup = this.gpuGroup;
        break;
      case 'storage':
        this.buildSsd(itemId);
        targetGroup = this.ssdGroup;
        break;
      case 'psu':
        this.buildCase(this.currentCaseId, itemId);
        targetGroup = this.chassisGroup;
        break;
    }

    if (targetGroup) {
      this.flashHighlight(targetGroup);
    }
  }

  flashHighlight(group) {
    if (!group) return;
    const origScale = group.scale.clone();
    group.scale.multiplyScalar(1.03);
    setTimeout(() => {
      group.scale.copy(origScale);
    }, 250);
  }

  // ==========================================================================
  // CAMERA VIEW PRESETS & SMOOTH TRANSITIONS
  // ==========================================================================
  setCameraView(viewName) {
    if (!this.controls) return;
    this.isAutoRotate = false;
    this.controls.autoRotate = false;

    let targetPos = new THREE.Vector3(24, 14, 28);
    let targetLook = new THREE.Vector3(0, 0, 0);

    switch (viewName) {
      case 'interior':
        targetPos.set(-16, 2, 0);
        targetLook.set(2, 2, 0);
        break;
      case 'front':
        targetPos.set(0, 2, 32);
        targetLook.set(0, 0, 0);
        break;
      case 'top':
        targetPos.set(0, 32, 2);
        targetLook.set(0, 0, 0);
        break;
      case 'workbench':
        targetPos.set(16, 24, 22);
        targetLook.set(0, -2, 0);
        break;
      case 'iso':
      default:
        targetPos.set(24, 14, 28);
        targetLook.set(0, 0, 0);
        break;
    }

    this.smoothAnimateCamera(targetPos, targetLook);
  }

  smoothAnimateCamera(toPos, toTarget, duration = 750) {
    const fromPos = this.camera.position.clone();
    const fromTarget = this.controls.target.clone();
    const startTime = performance.now();

    const animStep = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      this.camera.position.lerpVectors(fromPos, toPos, ease);
      this.controls.target.lerpVectors(fromTarget, toTarget, ease);
      this.controls.update();
      if (progress < 1) requestAnimationFrame(animStep);
    };
    requestAnimationFrame(animStep);
  }

  toggleAutoRotate(isRot = !this.isAutoRotate) {
    this.isAutoRotate = isRot;
    if (this.controls) this.controls.autoRotate = this.isAutoRotate;
    return this.isAutoRotate;
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // ==========================================================================
  // MAIN ANIMATION LOOP
  // ==========================================================================
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    const now = performance.now();

    // Smooth Fan Spin with Inertia & Counter-Rotating Middle GPU Fan
    this.fanSpeed += (this.targetFanSpeed - this.fanSpeed) * 0.05;
    if (this.fanSpeed > 0.001) {
      this.fansList.forEach(fan => {
        if (fan.isReverseFan) {
          fan.rotation.z -= this.fanSpeed * 1.05;
        } else {
          fan.rotation.z += this.fanSpeed;
        }
      });
    }

    // Dynamic Live LCD Screens Update
    if (this.isPoweredOn && this.animatedScreens.length > 0) {
      this.animatedScreens.forEach(scr => scr.draw(now));
    }

    // Chroma Rainbow Lighting Aura
    if (this.isRainbow && this.isPoweredOn) {
      this.rainbowHue = (this.rainbowHue + 0.003) % 1;
      this.currentRgbColor.setHSL(this.rainbowHue, 1.0, 0.5);
      this.applyRgbColor(this.currentRgbColor);
    }

    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.CyberPC3DViewer = CyberPC3DViewer;
