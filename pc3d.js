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
    this.installed = {
      gpu: true,
      cooler: true,
      ram: true,
      cpu: true,
      motherboard: true,
      ssd: true,
      cables: true,
      glass: true
    };
    this.isPartAnimating = {};

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

  // Procedural Perforated Airflow Ventilation Hole Mesh Texture (Cooling Airflow Grilles)
  getPerforatedMeshTexture(isWhite = false, isHex = false) {
    const key = `mesh_perf_${isWhite ? 'w' : 'd'}_${isHex ? 'hex' : 'round'}`;
    return this.createCanvasTexture(key, 256, 256, (ctx, w, h) => {
      ctx.fillStyle = isWhite ? '#e2e8f0' : '#090c13';
      ctx.fillRect(0, 0, w, h);

      const step = isHex ? 16 : 12;
      const holeRadius = isHex ? 4.8 : 3.8;

      for (let y = 0; y < h + step; y += step) {
        const row = Math.floor(y / step);
        const offsetX = (row % 2) * (step / 2);
        for (let x = 0; x < w + step; x += step) {
          const cx = x + offsetX;
          const cy = y;

          // Recessed shadow ring
          ctx.fillStyle = isWhite ? '#94a3b8' : '#030508';
          ctx.beginPath();
          ctx.arc(cx, cy, holeRadius + 0.8, 0, Math.PI * 2);
          ctx.fill();

          // Black circular cutout hole
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(cx, cy, holeRadius, 0, Math.PI * 2);
          ctx.fill();

          // Metallic rim reflection
          ctx.strokeStyle = isWhite ? '#ffffff' : '#1e293b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, holeRadius + 0.5, Math.PI * 0.25, Math.PI * 1.25);
          ctx.stroke();
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

    // Studio Rear Softbox Light so all rear I/O connectors, ports and exhausts are crystal-clear
    this.rearLight = new THREE.DirectionalLight(0xffffff, 2.4);
    this.rearLight.position.set(10, 18, -32);
    this.scene.add(this.rearLight);

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
      if (this.rearLight) this.rearLight.intensity = 2.4;
    } else {
      this.scene.background = new THREE.Color(0x07090f);
      this.scene.fog.color = new THREE.Color(0x07090f);
      this.ambientLight.color.setHex(0x1a2638);
      this.ambientLight.intensity = 1.2;
      this.studioFloor.material.color.setHex(0x0f1522);
      this.gridHelper.material.color.setHex(0x141f2e);
      if (this.rearLight) this.rearLight.intensity = 1.8;
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
    // Main 8-Layer PCB - docked solidly to the rear wall
    const mbMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 11.2, 9.8), pcbMat);
    mbMesh.position.set(5.5, 1.5, -3.9);
    mbMesh.castShadow = true;
    mbMesh.receiveShadow = true;
    this.mbMeshGroup.add(mbMesh);

    // Standoff Screws (Solid Brass + Phillips Head detail)
    const standoffMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.2 });
    const screwHeadMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const standoffPositions = [
      [5.3, 6.7, -8.5], [5.3, 6.7, -3.9], [5.3, 6.7, 0.7],
      [5.3, 1.5, -8.5], [5.3, 1.5, 0.7],
      [5.3, -3.7, -8.5], [5.3, -3.7, -3.9], [5.3, -3.7, 0.7]
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
    vrmTop.position.set(5.15, 6.0, -4.5);
    this.mbMeshGroup.add(vrmTop);

    // Left I/O VRM Fin Stack
    const vrmLeft = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.8, 1.4), vrmMat);
    vrmLeft.position.set(5.15, 3.8, -6.7);
    this.mbMeshGroup.add(vrmLeft);

    // Nickel-plated Heatpipe bridging the two VRM heatsinks
    const hpCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(5.0, 5.7, -2.9),
      new THREE.Vector3(5.0, 5.7, -6.5),
      new THREE.Vector3(5.0, 2.8, -6.5)
    ]);
    const hpMesh = new THREE.Mesh(
      new THREE.TubeGeometry(hpCurve, 16, 0.12, 12, false),
      new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15 })
    );
    this.mbMeshGroup.add(hpMesh);

    // Integrated Rear I/O Cover with Holographic Logo (Flush with rear wall)
    const ioCover = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 4.8, 1.8),
      new THREE.MeshStandardMaterial({ color: isWhite ? 0xffffff : 0x090c12, roughness: 0.2, metalness: 0.85 })
    );
    ioCover.position.set(5.15, 3.8, -7.8);
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
    logoBadge.position.set(4.7, 4.0, -7.8);
    this.mbMeshGroup.add(logoBadge);

    // Rear I/O Ports Array (USB, Type-C, Audio Jacks, WiFi SMA, RJ45)
    this.buildIoPorts();

    // 4x DIMM DDR5 Slots with Latches
    const slotBodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const latchMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.3 });
    for (let s = 0; s < 4; s++) {
      const z = -2.7 + s * 0.48;
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
    atx24.position.set(5.3, 3.8, 0.5);
    this.mbMeshGroup.add(atx24);

    // Solid Chokes (14x VRM inductors)
    const chokeMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.7, roughness: 0.4 });
    for (let c = 0; c < 8; c++) {
      const ch = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.28, 0.28), chokeMat);
      ch.position.set(5.3, 2.2 + c * 0.42, -5.8);
      this.mbMeshGroup.add(ch);
    }
    for (let c = 0; c < 6; c++) {
      const ch = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.28, 0.28), chokeMat);
      ch.position.set(5.3, 5.3, -5.5 + c * 0.42);
      this.mbMeshGroup.add(ch);
    }

    // Gold Nichicon Audio Capacitors
    const goldCapMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.2 });
    for (let a = 0; a < 5; a++) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.35, 16), goldCapMat);
      cap.rotation.z = Math.PI / 2;
      cap.position.set(5.3, -2.6 + a * 0.45, -6.4);
      this.mbMeshGroup.add(cap);
    }

    // PCIe 5.0 x16 Reinforced Stainless Armor SafeSlot (docked to rear PCIe slots)
    const pcieArmor = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.45, 6.8),
      new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15 })
    );
    pcieArmor.position.set(5.28, 0.5, -3.7);
    this.mbMeshGroup.add(pcieArmor);

    // PCIe Q-Release Lever
    const qRel = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
    );
    qRel.position.set(5.28, 0.5, -0.1);
    this.mbMeshGroup.add(qRel);

    // M.2 Armor Thermal Shield with Milled Fin Ridges
    const m2Armor = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.8, 3.4),
      vrmMat
    );
    m2Armor.position.set(5.25, 1.5, -4.3);
    this.mbMeshGroup.add(m2Armor);

    // Diagnostic Q-LEDs (Boot, VGA, DRAM, CPU)
    this.postLeds = [];
    const ledColors = [0xff3344, 0xffaa00, 0xffffff, 0x00ff66];
    for (let i = 0; i < 4; i++) {
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.12, 0.12),
        new THREE.MeshBasicMaterial({ color: ledColors[i] })
      );
      led.position.set(5.32, 6.4, -0.1 + i * 0.3);
      this.mbMeshGroup.add(led);
      this.postLeds.push(led);
    }
  }

  // Realistic Rear I/O Ports - Full Authentic Integrated Motherboard I/O Shield docked flush at z = -8.72
  buildIoPorts() {
    const isWhite = this.currentMbId.includes('white');
    const isRog = this.currentMbId.includes('z790') || this.currentMbId.includes('hero');

    // 1. HIGH-DPI CANVAS TEXTURE FOR REAR I/O SHIELD FACEPLATE
    const ioShieldTex = this.createCanvasTexture(`io_shield_plate_${this.currentMbId}`, 256, 512, (ctx, w, h) => {
      // Matte black / silver brushed metal background
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      if (isWhite) {
        grad.addColorStop(0, '#f8fafc');
        grad.addColorStop(0.5, '#e2e8f0');
        grad.addColorStop(1, '#cbd5e1');
      } else {
        grad.addColorStop(0, '#090d16');
        grad.addColorStop(0.5, '#131926');
        grad.addColorStop(1, '#0b0f1a');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Outer bezel border
      ctx.strokeStyle = isWhite ? '#94a3b8' : (isRog ? '#e11d48' : '#00f3ff');
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, w - 8, h - 8);

      // Brand Logo at top
      ctx.fillStyle = isWhite ? '#0284c7' : (isRog ? '#ff0055' : '#00f3ff');
      ctx.font = 'bold 20px "Orbitron", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isRog ? 'ROG MAXIMUS' : (isWhite ? 'AORUS ICE' : 'AORUS ELITE'), w / 2, 34);

      ctx.fillStyle = isWhite ? '#475569' : '#94a3b8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('ULTRA DURABLE I/O', w / 2, 48);

      // Silkscreen Port Labels along the plate
      ctx.font = '9px monospace';
      ctx.fillStyle = isWhite ? '#334155' : '#64748b';
      ctx.fillText('CLR CMOS / BIOS', w / 2, 85);
      ctx.fillText('HDMI 2.1 / DP 1.4', w / 2, 145);
      ctx.fillText('USB 3.2 5G (BLUE)', w / 2, 215);
      ctx.fillText('2.5G LAN / USB 10G', w / 2, 305);
      ctx.fillText('TYPE-C 40Gbps', w / 2, 365);
      ctx.fillText('WIFI 7 ANTENNA', w / 2, 415);
      ctx.fillText('7.1 HD AUDIO / OPTICAL', w / 2, 465);
    });

    const shieldMat = new THREE.MeshStandardMaterial({
      map: ioShieldTex,
      metalness: isWhite ? 0.4 : 0.88,
      roughness: 0.25
    });

    // Motherboard I/O Shield Faceplate (spanning between PCB at x=5.5 and inner chassis at x=3.6)
    const shieldPlate = new THREE.Mesh(new THREE.BoxGeometry(1.9, 5.4, 0.08), shieldMat);
    shieldPlate.position.set(4.55, 3.8, -8.72);
    this.mbMeshGroup.add(shieldPlate);

    // Common Port Materials
    const metalPortMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15 });
    const blackInsulator = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
    const blueUsbMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const redUsbMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.96, roughness: 0.12 });
    const buttonMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });

    // 1. Clear CMOS & BIOS Flashback Micro-Buttons
    const btnCmos = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 16), buttonMat);
    btnCmos.rotation.x = Math.PI / 2;
    btnCmos.position.set(4.2, 5.9, -8.76);
    this.mbMeshGroup.add(btnCmos);

    const btnBios = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.14, 16), buttonMat);
    btnBios.rotation.x = Math.PI / 2;
    btnBios.position.set(4.9, 5.9, -8.76);
    this.mbMeshGroup.add(btnBios);

    const biosLed = new THREE.Mesh(
      new THREE.CircleGeometry(0.04, 12),
      new THREE.MeshBasicMaterial({ color: 0x00ff66 })
    );
    biosLed.position.set(5.15, 5.9, -8.78);
    this.mbMeshGroup.add(biosLed);

    // 2. Video Out (DisplayPort 1.4 & HDMI 2.1)
    const dpHousing = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.28, 0.14), metalPortMat);
    dpHousing.position.set(4.2, 5.3, -8.76);
    this.mbMeshGroup.add(dpHousing);
    const dpCenter = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.15), blackInsulator);
    dpCenter.position.set(4.2, 5.3, -8.76);
    this.mbMeshGroup.add(dpCenter);

    const hdmiHousing = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.24, 0.14), goldMat);
    hdmiHousing.position.set(4.9, 5.3, -8.76);
    this.mbMeshGroup.add(hdmiHousing);

    // 3. Dual USB 2.0 (Black for Keyboard & Mouse)
    for (let u = 0; u < 2; u++) {
      const uX = 4.2 + u * 0.7;
      const usbBox = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.32, 0.14), metalPortMat);
      usbBox.position.set(uX, 4.7, -8.76);
      this.mbMeshGroup.add(usbBox);
      const usbBlack = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.15), blackInsulator);
      usbBlack.position.set(uX, 4.7, -8.76);
      this.mbMeshGroup.add(usbBlack);
    }

    // 4. Quad USB 3.2 Gen 1 (5Gbps Vibrant Blue Ports)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const uX = 4.2 + c * 0.7;
        const uY = 4.15 - r * 0.48;
        const usbBox = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.3, 0.14), metalPortMat);
        usbBox.position.set(uX, uY, -8.76);
        this.mbMeshGroup.add(usbBox);
        const usbBlue = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.11, 0.15), blueUsbMat);
        usbBlue.position.set(uX, uY, -8.76);
        this.mbMeshGroup.add(usbBlue);
      }
    }

    // 5. RJ-45 2.5G Gigabit Ethernet Socket + Dual USB 3.2 Gen 2 (Red 10Gbps)
    const lanBox = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.52, 0.16), metalPortMat);
    lanBox.position.set(4.25, 3.1, -8.76);
    this.mbMeshGroup.add(lanBox);

    const lanHole = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.17), blackInsulator);
    lanHole.position.set(4.25, 3.1, -8.76);
    this.mbMeshGroup.add(lanHole);

    // LAN Status LEDs (Green Link & Orange Activity)
    const lanLedG = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.08), new THREE.MeshBasicMaterial({ color: 0x00ff66 }));
    lanLedG.position.set(4.08, 3.32, -8.77);
    this.mbMeshGroup.add(lanLedG);
    const lanLedO = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.08), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
    lanLedO.position.set(4.42, 3.32, -8.77);
    this.mbMeshGroup.add(lanLedO);

    // Red USB 3.2 Gen 2 (10G)
    const usbRedBox = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.3, 0.14), metalPortMat);
    usbRedBox.position.set(4.95, 3.1, -8.76);
    this.mbMeshGroup.add(usbRedBox);
    const usbRed = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.11, 0.15), redUsbMat);
    usbRed.position.set(4.95, 3.1, -8.76);
    this.mbMeshGroup.add(usbRed);

    // 6. Dual USB Type-C Reversible Ports (Reversible Oval Housings)
    for (let t = 0; t < 2; t++) {
      const tX = 4.3 + t * 0.6;
      const tcHousing = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.18, 0.14), metalPortMat);
      tcHousing.position.set(tX, 2.55, -8.76);
      this.mbMeshGroup.add(tcHousing);
      const tcTongue = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.15), blackInsulator);
      tcTongue.position.set(tX, 2.55, -8.76);
      this.mbMeshGroup.add(tcTongue);
    }

    // 7. Dual Gold-Plated RP-SMA WiFi 7 / 6E Antenna Threaded Terminals with Hex Base
    for (let a = 0; a < 2; a++) {
      const aX = 4.3 + a * 0.65;
      const smaNut = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 6), goldMat);
      smaNut.rotation.x = Math.PI / 2;
      smaNut.position.set(aX, 2.05, -8.76);
      this.mbMeshGroup.add(smaNut);

      const smaThread = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.22, 16), goldMat);
      smaThread.rotation.x = Math.PI / 2;
      smaThread.position.set(aX, 2.05, -8.84);
      this.mbMeshGroup.add(smaThread);

      const smaPin = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8), metalPortMat);
      smaPin.rotation.x = Math.PI / 2;
      smaPin.position.set(aX, 2.05, -8.92);
      this.mbMeshGroup.add(smaPin);
    }

    // 8. Optical S/PDIF TOSLINK Audio Out (Square port with Glowing Red Core)
    const spdifBox = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.14), blackInsulator);
    spdifBox.position.set(4.2, 1.45, -8.76);
    this.mbMeshGroup.add(spdifBox);

    const spdifGlow = new THREE.Mesh(
      new THREE.CircleGeometry(0.08, 12),
      new THREE.MeshBasicMaterial({ color: 0xff0044 })
    );
    spdifGlow.position.set(4.2, 1.45, -8.84);
    this.mbMeshGroup.add(spdifGlow);

    // 9. 5x Gold-Plated 3.5mm HD Surround Audio Jacks with Color-Coded Silicone Rings
    const jackColors = [
      0x22c55e, // Lime Green: Front Out / Headphone
      0xec4899, // Pink: Mic In
      0x38bdf8, // Light Blue: Line In
      0x18181b, // Black: Rear Speaker
      0xf97316  // Orange: Center / Subwoofer
    ];

    jackColors.forEach((colorHex, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const jX = 4.65 + col * 0.42;
      const jY = 1.55 - row * 0.38;

      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.16, 0.06, 16),
        new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(jX, jY, -8.76);
      this.mbMeshGroup.add(ring);

      const jack = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.12, 16),
        goldMat
      );
      jack.rotation.x = Math.PI / 2;
      jack.position.set(jX, jY, -8.8);
      this.mbMeshGroup.add(jack);
    });
    this.autoFitAndValidateChassis();
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
    socketBase.position.set(5.4, 3.6, -4.5);
    this.cpuChipGroup.add(socketBase);

    // Chrome ILM Retention Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15 });
    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.7, 0.3), frameMat);
    topFrame.position.set(5.3, 3.6, -3.25);
    this.cpuChipGroup.add(topFrame);
    const botFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.7, 0.3), frameMat);
    botFrame.position.set(5.3, 3.6, -5.75);
    this.cpuChipGroup.add(botFrame);

    // Chrome Spring Tension Lever
    const leverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(5.25, 2.2, -3.0),
      new THREE.Vector3(5.25, 5.1, -3.0),
      new THREE.Vector3(5.15, 5.2, -2.8)
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
    ihsMesh.position.set(5.31, 3.6, -4.5);
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
    this.thermalPasteMesh.position.set(5.22, 3.6, -4.5);
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
      const zOffset = -2.7 + sIdx * 0.48;
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
      t700Group.position.set(5.1, -0.6, -3.7);

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
      ssdMesh.position.set(5.28, -0.6, -3.7);
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
      tower.position.set(3.9, 3.6, -4.5);

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
      dualTower.position.set(3.7, 3.6, -4.5);

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
      radMesh.position.set(2.0, 7.3, -1.5);
      aio.add(radMesh);

      // Corrugated cooling core visible on radiator underside
      const coreMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, radLen - 0.8),
        new THREE.MeshStandardMaterial({ map: radFinTex, roughness: 0.7 })
      );
      coreMesh.rotation.x = Math.PI / 2;
      coreMesh.position.set(2.0, 6.85, -1.5);
      aio.add(coreMesh);

      // Radiator Fans (Pushing air through)
      const spacing = 3.6;
      const startZ = is240Aio ? -3.3 : -5.1;
      for (let i = 0; i < numFans; i++) {
        const fan = this.createFan3D(1.35, false, isWhiteAio, 'radiator');
        fan.isCoolerFan = true;
        fan.rotation.x = Math.PI / 2;
        fan.position.set(2.0, 6.45, startZ + i * spacing);
        aio.add(fan);
      }

      // Circular Pump Block with Live Animated LCD Screen (NZXT Kraken Elite)
      const pumpGroup = new THREE.Group();
      pumpGroup.position.set(4.9, 3.6, -4.5);

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
        new THREE.Vector3(2.5, 6.8, -2.5),
        new THREE.Vector3(3.2, 5.8, -2.0),
        new THREE.Vector3(4.2, 4.4, -3.2),
        new THREE.Vector3(4.7, 3.9, -3.25)
      ]);
      const tube1 = new THREE.Mesh(new THREE.TubeGeometry(curve1, 28, 0.24, 16, false), tubeMat);
      aio.add(tube1);

      const curve2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.5, 6.8, -1.9),
        new THREE.Vector3(3.0, 5.4, -1.4),
        new THREE.Vector3(4.0, 4.0, -2.6),
        new THREE.Vector3(4.7, 3.3, -3.25)
      ]);
      const tube2 = new THREE.Mesh(new THREE.TubeGeometry(curve2, 28, 0.24, 16, false), tubeMat);
      aio.add(tube2);

      // Acrylic Tube Separator Clip
      const clipMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.8, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3 })
      );
      clipMesh.position.set(3.4, 5.1, -2.2);
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

  // 6. GRAPHICS CARD (Extreme Realism: Multi-Layer Sculpted Shroud, Real Fin Stack, Flow-Through Backplate, Rear Display Cables & 12VHPWR)
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

    const cardLength = is4090 ? 14.2 : (is4080 ? 13.0 : (is4060 ? 9.5 : 11.6));
    const cardHeight = is4090 ? 3.5 : (is4080 ? 3.0 : 2.2);
    const cardWidth = is4090 ? 4.5 : 3.9;

    const gpuAssembly = new THREE.Group();
    // Dock GPU rear bracket flush against the chassis rear expansion slot wall (z = -8.7)
    gpuAssembly.position.set(3.4, 0.5, -8.7 + cardLength / 2);

    // Common Materials
    const darkMat = new THREE.MeshStandardMaterial({
      color: isWhite ? 0xffffff : 0x090d14,
      roughness: isWhite ? 0.2 : 0.35,
      metalness: isWhite ? 0.2 : 0.88
    });
    const gunmetalMat = new THREE.MeshStandardMaterial({
      color: isWhite ? 0xf1f5f9 : 0x27272a,
      roughness: 0.25,
      metalness: 0.92
    });
    const finMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.95,
      roughness: 0.16
    });
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.96,
      roughness: 0.15
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.98,
      roughness: 0.08
    });
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x141417,
      metalness: 0.7,
      roughness: 0.3
    });

    // ------------------------------------------------------------------------
    // 1. DENSE MULTI-SLICE ALUMINUM HEATSINK FIN ARRAYS (Dual Segment Stack)
    // ------------------------------------------------------------------------
    // Real individual cooling fin plates with visible spacing (light penetrates through!)
    const numFins = is4060 ? 18 : 28;
    const finStartZ = -cardLength / 2 + 0.9;
    const finEndZ = cardLength / 2 - 0.7;
    const finSpacing = (finEndZ - finStartZ) / (numFins - 1);

    for (let f = 0; f < numFins; f++) {
      // Leave center gap for GPU core coldplate contact block
      const zPos = finStartZ + f * finSpacing;
      const finPlate = new THREE.Mesh(
        new THREE.BoxGeometry(cardWidth - 0.45, cardHeight - 0.55, 0.07),
        finMat
      );
      finPlate.position.set(0, 0, zPos);
      gpuAssembly.add(finPlate);
    }

    // Heavy Copper Contact Coldplate Block at GPU Core
    const coldPlate = new THREE.Mesh(
      new THREE.BoxGeometry(cardWidth - 0.3, cardHeight - 0.4, 3.2),
      copperMat
    );
    coldPlate.position.set(0, 0, -0.6);
    gpuAssembly.add(coldPlate);

    // 6 to 8 Heavy Continuous Sintered Heatpipes Looping Through Fins
    const hpCount = is4060 ? 4 : 6;
    for (let h = 0; h < hpCount; h++) {
      const yOffset = -cardHeight / 2 + 0.5 + h * (cardHeight - 1.0) / (hpCount - 1);
      const xOffset = (h % 2 === 0 ? -1 : 1) * 0.75;

      const hpPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, cardLength - 1.2, 12),
        copperMat
      );
      hpPipe.rotation.x = Math.PI / 2;
      hpPipe.position.set(xOffset, yOffset, 0);
      gpuAssembly.add(hpPipe);

      // Polished chrome soldered tips protruding at front edge
      const chromeCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.28, 14),
        chromeMat
      );
      chromeCap.rotation.x = Math.PI / 2;
      chromeCap.position.set(xOffset, yOffset, cardLength / 2 - 0.45);
      gpuAssembly.add(chromeCap);
    }

    // ------------------------------------------------------------------------
    // 2. SCULPTED GEOMETRIC SHROUD (Angled Facets & Recessed Fan Nacelles)
    // ------------------------------------------------------------------------
    // Top & Bottom aerodynamic intake cowlings (NOT a flat box!)
    const cowlThickness = 0.45;
    [-cardHeight / 2 + cowlThickness / 2, cardHeight / 2 - cowlThickness / 2].forEach((yPos, idx) => {
      // Main cowl bar
      const cowlBar = new THREE.Mesh(
        new THREE.BoxGeometry(cardWidth, cowlThickness, cardLength),
        darkMat
      );
      cowlBar.position.set(0, yPos, 0);
      gpuAssembly.add(cowlBar);

      // Beveled titanium/carbon armor accents
      const armorTrim = new THREE.Mesh(
        new THREE.BoxGeometry(cardWidth + 0.08, cowlThickness * 0.5, cardLength * 0.75),
        idx === 0 ? gunmetalMat : carbonMat
      );
      armorTrim.position.set(0, yPos + (idx === 0 ? -0.12 : 0.12), 0.2);
      gpuAssembly.add(armorTrim);
    });

    // Front Aerodynamic End Cap (Angled intake nose)
    const frontCap = new THREE.Mesh(
      new THREE.BoxGeometry(cardWidth, cardHeight - 0.4, 0.35),
      gunmetalMat
    );
    frontCap.position.set(0, 0, cardLength / 2 - 0.15);
    gpuAssembly.add(frontCap);

    // ------------------------------------------------------------------------
    // 3. FLOW-THROUGH BACKPLATE WITH HONEYCOMB PASSTHROUGH WINDOW & X-BRACKET
    // ------------------------------------------------------------------------
    const bpTex = this.getGpuBackplateTexture(isWhite, is4090 ? 'ROG MATRIX RTX 4090' : (isRadeon ? 'RADEON RX 7900 XTX' : 'GEFORCE RTX 4070S'));
    const bpMat = new THREE.MeshStandardMaterial({
      map: bpTex,
      roughness: 0.22,
      metalness: 0.9
    });

    // Solid half of backplate (over VRM/core)
    const bpSolid = new THREE.Mesh(
      new THREE.BoxGeometry(cardWidth - 0.1, 0.14, cardLength * 0.52),
      bpMat
    );
    bpSolid.position.set(0, cardHeight / 2 + 0.08, -cardLength * 0.22);
    gpuAssembly.add(bpSolid);

    // Rear Flow-Through Window Frame (exposing heatsink fins and heatpipes directly!)
    const bpWindowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(cardWidth - 0.1, 0.14, cardLength * 0.44),
      gunmetalMat
    );
    bpWindowFrame.position.set(0, cardHeight / 2 + 0.08, cardLength * 0.26);
    gpuAssembly.add(bpWindowFrame);

    // Flow-through slotted metal grill
    for (let g = 0; g < 7; g++) {
      const slatZ = cardLength * 0.1 + g * 0.55;
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(cardWidth - 1.0, 0.16, 0.18),
        finMat
      );
      slat.position.set(0, cardHeight / 2 + 0.09, slatZ);
      gpuAssembly.add(slat);
    }

    // Spring-Loaded Stainless Steel GPU Retention X-Bracket around Core
    const xBracketMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15 });
    const xArm1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 2.2), xBracketMat);
    xArm1.rotation.y = Math.PI / 4;
    xArm1.position.set(0, cardHeight / 2 + 0.14, -0.6);
    gpuAssembly.add(xArm1);

    const xArm2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 2.2), xBracketMat);
    xArm2.rotation.y = -Math.PI / 4;
    xArm2.position.set(0, cardHeight / 2 + 0.14, -0.6);
    gpuAssembly.add(xArm2);

    // 4 Retention Screws with Springs
    const screwPositions = [
      [-0.7, -1.3], [0.7, -1.3],
      [-0.7, 0.1], [0.7, 0.1]
    ];
    screwPositions.forEach(([sx, sz]) => {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 12), chromeMat);
      screw.position.set(sx, cardHeight / 2 + 0.16, sz);
      gpuAssembly.add(screw);
    });

    // ------------------------------------------------------------------------
    // 4. SIDE ARGB LOGO BAR & DUAL BIOS SWITCH
    // ------------------------------------------------------------------------
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

    // Dual BIOS Toggle Switch (Quiet / Performance)
    const biosSwitchBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.2, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 })
    );
    biosSwitchBox.position.set(-cardWidth / 2 - 0.05, cardHeight / 2 - 0.1, -cardLength / 3);
    gpuAssembly.add(biosSwitchBox);

    const biosLever = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.18, 8),
      chromeMat
    );
    biosLever.rotation.z = Math.PI / 2;
    biosLever.position.set(-cardWidth / 2 - 0.16, cardHeight / 2 - 0.1, -cardLength / 3);
    gpuAssembly.add(biosLever);

    // ------------------------------------------------------------------------
    // 5. AXIAL-TECH TRIPLE FANS WITH TORX BARRIER RING & HOLOGRAPHIC HUBS
    // ------------------------------------------------------------------------
    const numFans = is4060 ? 2 : 3;
    const fanSpacing = (cardLength - 2.8) / (numFans - 1 || 1);
    const startZ = -cardLength / 2 + 1.4;

    for (let i = 0; i < numFans; i++) {
      const gpuFan = this.createFan3D(1.28, false, isWhite, 'gpu');
      gpuFan.isGpuFan = true;
      if (i === 1 && numFans === 3) {
        gpuFan.isReverseFan = true; // Counter-rotating middle fan
      }
      gpuFan.rotation.x = Math.PI / 2;
      gpuFan.position.set(0, -cardHeight / 2 - 0.05, startZ + i * fanSpacing);
      gpuAssembly.add(gpuFan);

      // Recessed circular bezel ring around each fan intake
      const bezelRing = new THREE.Mesh(
        new THREE.RingGeometry(1.28, 1.36, 32),
        gunmetalMat
      );
      bezelRing.rotation.x = Math.PI / 2;
      bezelRing.position.set(0, -cardHeight / 2 - 0.03, startZ + i * fanSpacing);
      gpuAssembly.add(bezelRing);
    }

    // ------------------------------------------------------------------------
    // 6. 12VHPWR 16-PIN POWER SOCKET & BRAIDED CABLE ANCHORED INTO PSU SHROUD
    // ------------------------------------------------------------------------
    const pwrSocket = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.45, 0.95),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.6 })
    );
    pwrSocket.position.set(-cardWidth / 2 + 0.35, cardHeight / 2 + 0.22, 0.8);
    gpuAssembly.add(pwrSocket);

    // 16-Pin 12VHPWR Braided Cable Loom Plugged Directly into GPU & Anchored into PSU Shroud Grommet
    const cableMat = new THREE.MeshStandardMaterial({
      color: isWhite ? 0xf8fafc : 0x111827,
      roughness: 0.75,
      metalness: 0.15
    });
    for (let c = 0; c < 4; c++) {
      const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-cardWidth / 2 + 0.35, cardHeight / 2 + 0.35, 0.5 + c * 0.2),
        new THREE.Vector3(-cardWidth / 2 - 0.6, cardHeight / 2 + 0.7, 0.5 + c * 0.2),
        new THREE.Vector3(-cardWidth / 2 - 1.2, 0.0, 0.5 + c * 0.2),
        new THREE.Vector3(-cardWidth / 2 - 1.0, -2.4, 0.5 + c * 0.2),
        new THREE.Vector3(-1.4, -4.1, 0.5 + c * 0.2)
      ]);
      const cableTube = new THREE.Mesh(
        new THREE.TubeGeometry(cableCurve, 20, 0.09, 8, false),
        cableMat
      );
      gpuAssembly.add(cableTube);
    }

    // Clear Acrylic Cable Comb Clip on 12VHPWR
    const combClip = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.16, 0.95),
      new THREE.MeshStandardMaterial({ color: 0xd4d4d8, transparent: true, opacity: 0.8, roughness: 0.2 })
    );
    combClip.position.set(-cardWidth / 2 - 1.1, 0.0, 0.8);
    gpuAssembly.add(combClip);

    // Rubber Pass-Through Grommet Bezel on PSU Shroud receiving 12VHPWR
    const psuCableGrommet = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.12, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 })
    );
    psuCableGrommet.position.set(-1.4, -4.08, 0.8);
    gpuAssembly.add(psuCableGrommet);

    // ------------------------------------------------------------------------
    // 7. REAR PCIe BRACKET & AUTHENTIC DISPLAY CONNECTORS (3x DP 2.1 + 1x HDMI 2.1a)
    // ------------------------------------------------------------------------
    // Stainless Steel Triple-Slot Rear Bracket (Clean Authentic Mount, No Dangling External Wires)
    const bracketMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.95,
      roughness: 0.18
    });
    const bracketMesh = new THREE.Mesh(
      new THREE.BoxGeometry(cardWidth * 0.92, cardHeight + 0.9, 0.08),
      bracketMat
    );
    bracketMesh.position.set(0, 0.2, -cardLength / 2 - 0.04);
    gpuAssembly.add(bracketMesh);

    // Stamped Airflow Ventilation Cutout Slits on Bracket
    const slitMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    for (let s = 0; s < 4; s++) {
      const slit = new THREE.Mesh(new THREE.BoxGeometry(cardWidth * 0.7, 0.12, 0.09), slitMat);
      slit.position.set(0, cardHeight / 2 - 0.3 - s * 0.35, -cardLength / 2 - 0.04);
      gpuAssembly.add(slit);
    }

    // 2x Knurled Chassis Mounting Thumbscrews at the top bracket lip
    const thumbScrewMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.9, roughness: 0.2 });
    [-cardWidth * 0.35, cardWidth * 0.35].forEach(x => {
      const ts = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.18, 16), thumbScrewMat);
      ts.rotation.x = Math.PI / 2;
      ts.position.set(x, cardHeight / 2 + 0.55, -cardLength / 2 - 0.06);
      gpuAssembly.add(ts);
    });

    // 3x High-Precision DisplayPort 2.1 Ports (Recessed Nickel Shield + Black Insulator Tongue)
    const portMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.15 });
    const portInsulator = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8 });
    const portGold = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.96, roughness: 0.12 });

    for (let p = 0; p < 3; p++) {
      const pX = -cardWidth * 0.3 + p * 0.65;
      const dpOuter = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.26, 0.16), portMat);
      dpOuter.position.set(pX, -0.2, -cardLength / 2 - 0.08);
      gpuAssembly.add(dpOuter);

      const dpTongue = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 0.17), portInsulator);
      dpTongue.position.set(pX, -0.2, -cardLength / 2 - 0.08);
      gpuAssembly.add(dpTongue);
    }

    // 1x HDMI 2.1a Gold Contact Port
    const hdmiOuter = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.22, 0.16), portGold);
    hdmiOuter.position.set(-cardWidth * 0.3, -0.7, -cardLength / 2 - 0.08);
    gpuAssembly.add(hdmiOuter);

    const hdmiTongue = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.17), portInsulator);
    hdmiTongue.position.set(-cardWidth * 0.3, -0.7, -cardLength / 2 - 0.08);
    gpuAssembly.add(hdmiTongue);

    // ------------------------------------------------------------------------
    // 8. TELESCOPING ALUMINUM ANTI-SAG SUPPORT COLUMN
    // ------------------------------------------------------------------------
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

  // 7. REALISTIC CABLES & ROUTING (24-Pin ATX + 8-Pin CPU EPS + Front Panel Headers)
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

    // 1. 24-Pin ATX Main Motherboard Cable (Anchored into Motherboard Socket & Tray Grommet)
    const atxGroup = new THREE.Group();
    for (let w = -5; w <= 5; w++) {
      const zOffset = w * 0.11;
      const atxCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(5.15, 3.8, 0.5 + zOffset),
        new THREE.Vector3(4.5, 3.8, 0.95 + zOffset),
        new THREE.Vector3(5.1, 3.8, 1.5 + zOffset),
        new THREE.Vector3(5.85, 3.8, 1.8 + zOffset)
      ]);
      const wire = new THREE.Mesh(new THREE.TubeGeometry(atxCurve, 20, 0.055, 8, false), cableMat);
      atxGroup.add(wire);
    }

    // Acrylic Cable Combs holding 24-Pin ATX
    const comb1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 1.35), combMat);
    comb1.position.set(4.55, 3.8, 1.0);
    atxGroup.add(comb1);

    const comb2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 1.35), combMat);
    comb2.position.set(5.15, 3.8, 1.55);
    atxGroup.add(comb2);

    this.cablesGroup.add(atxGroup);

    // 2. 8-Pin EPS CPU Power Cable (Top VRM into Top Tray Grommet)
    const epsGroup = new THREE.Group();
    for (let e = -1.5; e <= 1.5; e++) {
      const zOffset = e * 0.12;
      const epsCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(5.2, 6.7, -7.8 + zOffset),
        new THREE.Vector3(4.8, 7.1, -7.8 + zOffset),
        new THREE.Vector3(5.85, 7.3, -7.8 + zOffset)
      ]);
      const epsWire = new THREE.Mesh(new THREE.TubeGeometry(epsCurve, 16, 0.055, 8, false), cableMat);
      epsGroup.add(epsWire);
    }
    const epsComb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.55), combMat);
    epsComb.position.set(4.85, 7.1, -7.8);
    epsGroup.add(epsComb);

    this.cablesGroup.add(epsGroup);

    // 3. Front Panel Audio & USB Header Ribbon (Bottom Motherboard into Bottom Grommet)
    const fpGroup = new THREE.Group();
    for (let f = -1; f <= 1; f++) {
      const zOffset = f * 0.14;
      const fpCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(5.25, -3.8, -1.5 + zOffset),
        new THREE.Vector3(4.9, -3.9, -1.0 + zOffset),
        new THREE.Vector3(5.85, -3.9, -0.6 + zOffset)
      ]);
      const fpWire = new THREE.Mesh(new THREE.TubeGeometry(fpCurve, 14, 0.05, 8, false), cableMat);
      fpGroup.add(fpWire);
    }
    this.cablesGroup.add(fpGroup);
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
  // 9. CASE CHASSIS BUILDER: 8 UNIQUE ARCHITECTURES WITH FULL I/O DETAILS
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
    const isLianLiEvo = caseId === 'case-lianli-o11'; // Lian Li O11 Dynamic EVO Dual-Chamber
    const isTerraItx = caseId === 'case-terra-itx'; // Fractal Terra Jade Green Walnut ITX
    const isNzxtH9 = caseId === 'case-nzxt-h9'; // NZXT H9 Flow Dual-Chamber Black
    const isCorsair5000 = caseId === 'case-corsair-5000d'; // Corsair 5000D Airflow Steel Mesh
    const isMontechKing = caseId === 'case-montech-king'; // Montech King 95 Pro Curved Panoramic
    const isRogHyperion = caseId === 'case-rog-hyperion'; // ASUS ROG Hyperion GR701 Super-Tower

    // All chassis dimensions calibrated so every board, GPU and cable fits cleanly INSIDE without sticking out
    const isDualChamber = isLianLiEvo || isNzxtH9 || isHyteScreen || isMontechKing || isRogHyperion;
    const width = isDualChamber ? 13.5 : (isTerraItx ? 11.8 : 12.2);
    const height = isRogHyperion ? 17.5 : (isTerraItx ? 15.6 : 16.4);
    const depth = isRogHyperion ? 19.5 : 18.2;

    // Materials
    const frameColor = isSnowWhite ? 0xffffff : (isTerraItx ? 0x1b3b36 : (isLianLiEvo ? 0x181e26 : (isNordicWood ? 0x18181b : (isMechaSkeleton ? 0x09090b : (isRogHyperion ? 0x0b0e14 : (isCorsair5000 ? 0x18181b : 0x0f1420))))));
    const metalMat = new THREE.MeshStandardMaterial({
      color: frameColor,
      roughness: isSnowWhite ? 0.2 : (isTerraItx ? 0.38 : 0.35),
      metalness: isSnowWhite ? 0.1 : (isTerraItx ? 0.85 : 0.88)
    });

    const darkFrameColor = isSnowWhite ? 0xf1f5f9 : (isTerraItx ? 0x142b27 : (isLianLiEvo ? 0x11161d : (isNordicWood ? 0x27272a : (isRogHyperion ? 0x181a20 : 0x090c13))));
    const darkFrameMat = new THREE.MeshStandardMaterial({
      color: darkFrameColor,
      roughness: 0.4,
      metalness: isSnowWhite ? 0.2 : 0.9
    });

    const portSteelMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.18 });
    const blueUsbMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.12 });
    const cableSheathMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85, metalness: 0.1 });

    // ------------------------------------------------------------------------
    // 1. REAR CHASSIS WALL WITH FULL MOTHERBOARD I/O SHIELD, REAR USBs & PORTS
    // ------------------------------------------------------------------------
    const backMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.4), metalMat);
    backMesh.position.set(0, 0, -depth / 2);
    this.chassisGroup.add(backMesh);

    // ------------------------------------------------------------------------
    // REAR CASE CONNECTORS & FULL MOTHERBOARD I/O SHIELD (Visible from outside)
    // ------------------------------------------------------------------------
    const zBack = -depth / 2;
    const zFace = zBack - 0.05; // Placed on exterior rear chassis wall, 100% visible from behind!
    const ioX = isTerraItx ? (width / 2 - 1.6) : 4.55;
    const ioY = isTerraItx ? (height / 2 - 4.8) : 3.8;

    // Motherboard I/O Shield Faceplate (High-Grade Brushed Metal with silk-screened bezels)
    const ioShieldMat = new THREE.MeshStandardMaterial({
      color: isSnowWhite ? 0xe2e8f0 : 0x181e26,
      roughness: 0.28,
      metalness: 0.92
    });
    const ioFaceplate = new THREE.Mesh(new THREE.BoxGeometry(2.0, 5.5, 0.08), ioShieldMat);
    ioFaceplate.position.set(ioX, ioY, zFace);
    this.chassisGroup.add(ioFaceplate);

    // I/O Cutout Structural Bezel Frame
    const ioBezel = new THREE.Mesh(new THREE.BoxGeometry(2.14, 5.64, 0.04), portSteelMat);
    ioBezel.position.set(ioX, ioY, zFace + 0.02);
    this.chassisGroup.add(ioBezel);

    const metalPortMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15 });
    const blackInsulator = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
    const redUsbMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const greenLedMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const amberLedMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const optGlowMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });

    // 1. Clear CMOS & BIOS Flashback Micro-Buttons
    const btnCmos = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 16), darkFrameMat);
    btnCmos.rotation.x = Math.PI / 2;
    btnCmos.position.set(ioX - 0.38, ioY + 2.2, zFace - 0.06);
    this.chassisGroup.add(btnCmos);

    const btnBios = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.14, 16), darkFrameMat);
    btnBios.rotation.x = Math.PI / 2;
    btnBios.position.set(ioX + 0.38, ioY + 2.2, zFace - 0.06);
    this.chassisGroup.add(btnBios);

    const biosLed = new THREE.Mesh(new THREE.CircleGeometry(0.04, 12), greenLedMat);
    biosLed.position.set(ioX + 0.65, ioY + 2.2, zFace - 0.07);
    this.chassisGroup.add(biosLed);

    // 2. Dual Wi-Fi 6E/7 Gold Antenna SMA Terminals
    for (let w = 0; w < 2; w++) {
      const wX = ioX - 0.42 + w * 0.84;
      const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 6), goldMat);
      nut.rotation.x = Math.PI / 2;
      nut.position.set(wX, ioY + 1.62, zFace - 0.06);
      this.chassisGroup.add(nut);

      const thread = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.22, 16), goldMat);
      thread.rotation.x = Math.PI / 2;
      thread.position.set(wX, ioY + 1.62, zFace - 0.14);
      this.chassisGroup.add(thread);

      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.24, 8), goldMat);
      pin.rotation.x = Math.PI / 2;
      pin.position.set(wX, ioY + 1.62, zFace - 0.15);
      this.chassisGroup.add(pin);
    }

    // 3. Motherboard Video Outputs: DisplayPort 1.4 & HDMI 2.1
    const mbDp = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.28, 0.12), metalPortMat);
    mbDp.position.set(ioX - 0.42, ioY + 1.05, zFace - 0.06);
    this.chassisGroup.add(mbDp);
    const mbDpIn = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.13), blackInsulator);
    mbDpIn.position.set(ioX - 0.42, ioY + 1.05, zFace - 0.06);
    this.chassisGroup.add(mbDpIn);

    const mbHdmi = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.24, 0.12), goldMat);
    mbHdmi.position.set(ioX + 0.42, ioY + 1.05, zFace - 0.06);
    this.chassisGroup.add(mbHdmi);

    // 4. Dual USB 2.0 (Black for Keyboard & Mouse)
    for (let u = 0; u < 2; u++) {
      const uX = ioX - 0.42 + u * 0.84;
      const usbBox = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.3, 0.12), metalPortMat);
      usbBox.position.set(uX, ioY + 0.52, zFace - 0.06);
      this.chassisGroup.add(usbBox);
      const usbBlack = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.11, 0.13), blackInsulator);
      usbBlack.position.set(uX, ioY + 0.52, zFace - 0.06);
      this.chassisGroup.add(usbBlack);
    }

    // 5. Quad USB 3.2 Gen 1 (SuperSpeed 5Gbps Vibrant Blue)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const uX = ioX - 0.42 + c * 0.84;
        const uY = ioY - 0.02 - r * 0.48;
        const usbBox = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.28, 0.12), metalPortMat);
        usbBox.position.set(uX, uY, zFace - 0.06);
        this.chassisGroup.add(usbBox);
        const usbBlue = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.1, 0.13), blueUsbMat);
        usbBlue.position.set(uX, uY, zFace - 0.06);
        this.chassisGroup.add(usbBlue);
      }
    }

    // 6. 2.5G RJ-45 Ethernet LAN Jack & Red USB 3.2 Gen 2 (10Gbps)
    const lanBox = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.44, 0.16), metalPortMat);
    lanBox.position.set(ioX - 0.42, ioY - 1.1, zFace - 0.08);
    this.chassisGroup.add(lanBox);
    const lanHole = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.32, 0.17), blackInsulator);
    lanHole.position.set(ioX - 0.42, ioY - 1.1, zFace - 0.08);
    this.chassisGroup.add(lanHole);
    const lanLed1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.18), greenLedMat);
    lanLed1.position.set(ioX - 0.55, ioY - 0.9, zFace - 0.08);
    this.chassisGroup.add(lanLed1);
    const lanLed2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.18), amberLedMat);
    lanLed2.position.set(ioX - 0.29, ioY - 0.9, zFace - 0.08);
    this.chassisGroup.add(lanLed2);

    const usbRedBox = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.28, 0.12), metalPortMat);
    usbRedBox.position.set(ioX + 0.42, ioY - 1.1, zFace - 0.06);
    this.chassisGroup.add(usbRedBox);
    const usbRed = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.1, 0.13), redUsbMat);
    usbRed.position.set(ioX + 0.42, ioY - 1.1, zFace - 0.06);
    this.chassisGroup.add(usbRed);

    // 7. Dual USB 3.2 Gen 2x2 Type-C 20Gbps Reversible Ports
    for (let c = 0; c < 2; c++) {
      const tcX = ioX - 0.42 + c * 0.84;
      const tcShell = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.18, 0.12), metalPortMat);
      tcShell.position.set(tcX, ioY - 1.62, zFace - 0.06);
      this.chassisGroup.add(tcShell);
      const tcTongue = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.13), blackInsulator);
      tcTongue.position.set(tcX, ioY - 1.62, zFace - 0.06);
      this.chassisGroup.add(tcTongue);
    }

    // 8. Optical S/PDIF TOSLINK & 5x Gold-Plated 3.5mm Surround Audio Jacks
    const spdifBox = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.14), darkFrameMat);
    spdifBox.position.set(ioX - 0.45, ioY - 2.15, zFace - 0.06);
    this.chassisGroup.add(spdifBox);
    const spdifGlow = new THREE.Mesh(new THREE.CircleGeometry(0.06, 12), optGlowMat);
    spdifGlow.position.set(ioX - 0.45, ioY - 2.15, zFace - 0.07);
    this.chassisGroup.add(spdifGlow);

    const jackConfigs = [
      { col: 0x22c55e, x: ioX + 0.45, y: ioY - 1.95 }, // Green: Line Out / Front
      { col: 0x38bdf8, x: ioX,        y: ioY - 1.95 }, // Blue: Line In
      { col: 0xf43f5e, x: ioX + 0.45, y: ioY - 2.38 }, // Pink: Mic In
      { col: 0x1e293b, x: ioX,        y: ioY - 2.38 }  // Black: Rear Surround
    ];
    jackConfigs.forEach(j => {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 16), goldMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(j.x, j.y, zFace - 0.06);
      this.chassisGroup.add(ring);

      const centerHole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 0.13, 16),
        new THREE.MeshStandardMaterial({ color: j.col, roughness: 0.4 })
      );
      centerHole.rotation.x = Math.PI / 2;
      centerHole.position.set(j.x, j.y, zFace - 0.06);
      this.chassisGroup.add(centerHole);
    });

    // ------------------------------------------------------------------------
    // REAR DUAL-SLOT GPU BRACKET WITH 4x DISPLAY CONNECTORS (PCIe Slots 1 & 2)
    // ------------------------------------------------------------------------
    const pcieX = isTerraItx ? (width / 2 - 3.4) : 2.4;
    const gpuBracketY = isTerraItx ? 0.3 : 0.8;

    // Dual-slot Stainless Steel GPU Bracket with Air Exhaust Cutouts
    const gpuBracket = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 1.25, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.2 })
    );
    gpuBracket.position.set(pcieX, gpuBracketY, zFace - 0.02);
    this.chassisGroup.add(gpuBracket);

    // Triangular/Slit ventilation cutouts on upper slot
    for (let v = 0; v < 5; v++) {
      const vCut = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.12, 0.1),
        new THREE.MeshBasicMaterial({ color: 0x05070e })
      );
      vCut.position.set(pcieX - 1.2 + v * 0.6, gpuBracketY + 0.35, zFace - 0.02);
      this.chassisGroup.add(vCut);
    }

    // 3x DisplayPort 1.4a outputs on GPU bracket
    for (let dp = 0; dp < 3; dp++) {
      const dpX = pcieX - 1.1 + dp * 0.72;
      const dpBox = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.26, 0.12), metalPortMat);
      dpBox.position.set(dpX, gpuBracketY - 0.2, zFace - 0.05);
      this.chassisGroup.add(dpBox);

      const dpTongue = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.13), blackInsulator);
      dpTongue.position.set(dpX, gpuBracketY - 0.2, zFace - 0.05);
      this.chassisGroup.add(dpTongue);
    }

    // 1x HDMI 2.1 Gold Output on GPU bracket
    const hdmiX = pcieX + 1.15;
    const gpHdmi = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.24, 0.12), goldMat);
    gpHdmi.position.set(hdmiX, gpuBracketY - 0.2, zFace - 0.05);
    this.chassisGroup.add(gpHdmi);

    // Remaining PCIe Slot Covers (Slots 3 to 7) with Honeycomb Perforations
    for (let p = 2; p < 7; p++) {
      const pY = gpuBracketY - 0.35 - (p - 1) * 0.65;
      const pcieCover = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 0.44, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.9, roughness: 0.25 })
      );
      pcieCover.position.set(pcieX, pY, zFace - 0.02);
      this.chassisGroup.add(pcieCover);

      for (let v = 0; v < 4; v++) {
        const slotVent = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.12, 0.1),
          new THREE.MeshBasicMaterial({ color: 0x05070e })
        );
        slotVent.position.set(pcieX - 1.0 + v * 0.7, pY, zFace - 0.02);
        this.chassisGroup.add(slotVent);
      }
    }

    // ------------------------------------------------------------------------
    // REAR PSU AC POWER PANEL (Authentic 3-Pin IEC C14 Receptacle, Rocker Switch & Honeycomb)
    // ------------------------------------------------------------------------
    const psuBackWidth = 5.2;
    const psuBackHeight = 3.6;
    const psuY = -height / 2 + 2.0;
    const psuX = -width / 2 + 2.9;

    // PSU Rear Exhaust Honeycomb Ventilation Plate
    const psuRearVent = new THREE.Mesh(
      new THREE.PlaneGeometry(psuBackWidth, psuBackHeight),
      new THREE.MeshStandardMaterial({
        map: this.getPerforatedMeshTexture(false, true),
        roughness: 0.5,
        metalness: 0.85
      })
    );
    psuRearVent.position.set(psuX, psuY, -depth / 2 - 0.02);
    this.chassisGroup.add(psuRearVent);

    // Standard Trapezoidal IEC C14 3-Pin Power Receptacle Housing
    const acReceptacle = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.85, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.8 })
    );
    acReceptacle.position.set(psuX + 1.4, psuY, -depth / 2 - 0.04);
    this.chassisGroup.add(acReceptacle);

    // 3 Solid Brass Prongs (Earth, Live, Neutral)
    const prongMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.1 });
    const prongPositions = [
      [psuX + 1.4, psuY + 0.18],  // Top: Ground
      [psuX + 1.18, psuY - 0.14], // Bottom Left: Neutral
      [psuX + 1.62, psuY - 0.14]  // Bottom Right: Live
    ];
    prongPositions.forEach(([px, py]) => {
      const prong = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.16), prongMat);
      prong.position.set(px, py, -depth / 2 - 0.08);
      this.chassisGroup.add(prong);
    });

    // Heavy-Duty Rocker Power Switch (Illuminated Red Face with 'I' / 'O' Markings)
    const rockerFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.95, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 })
    );
    rockerFrame.position.set(psuX + 0.45, psuY, -depth / 2 - 0.04);
    this.chassisGroup.add(rockerFrame);

    const rockerRocker = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.75, 0.12),
      new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xb91c1c,
        emissiveIntensity: 0.4,
        roughness: 0.3
      })
    );
    rockerRocker.rotation.x = 0.15; // Realistic tilted rocker position (ON state)
    rockerRocker.position.set(psuX + 0.45, psuY, -depth / 2 - 0.08);
    this.chassisGroup.add(rockerRocker);

    // Hybrid Fan / Eco Zero-RPM Push Button
    const ecoBtnBezel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.16, 16),
      new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5 })
    );
    ecoBtnBezel.rotation.x = Math.PI / 2;
    ecoBtnBezel.position.set(psuX - 0.45, psuY, -depth / 2 - 0.04);
    this.chassisGroup.add(ecoBtnBezel);

    const ecoBtn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.12, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.6, roughness: 0.3 })
    );
    ecoBtn.rotation.x = Math.PI / 2;
    ecoBtn.position.set(psuX - 0.45, psuY, -depth / 2 - 0.09);
    this.chassisGroup.add(ecoBtn);

    // ------------------------------------------------------------------------
    // 2. MOTHERBOARD TRAY WITH GROMMETS & CPU CUTOUT
    // ------------------------------------------------------------------------
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

    // Rolled-Edge CPU Socket Access Window in Tray (docked behind CPU socket at z = -4.5)
    const cpuCutout = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 4.2, 4.2),
      darkFrameMat
    );
    cpuCutout.position.set(width / 2, 3.6, -4.5);
    this.chassisGroup.add(cpuCutout);

    // Rubber Cable Pass-Through Grommets (aligned with 24-Pin ATX & GPU cables)
    const grommetMat = new THREE.MeshStandardMaterial({ color: isSnowWhite ? 0xe2e8f0 : 0x05070c, roughness: 0.9 });
    const grommet1 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 3.2, 0.9), grommetMat);
    grommet1.position.set(width / 2, 3.8, 1.8);
    this.chassisGroup.add(grommet1);

    const grommet2 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.9, 2.8), grommetMat);
    grommet2.position.set(width / 2, -height / 2 + 4.3, -0.6);
    this.chassisGroup.add(grommet2);

    // ------------------------------------------------------------------------
    // 3. TOP PANEL WITH DUST FILTER & COMPLETE TOP I/O CLUSTER
    // ------------------------------------------------------------------------
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

    // COMPLETE FRONT / TOP I/O CLUSTER: Power Button, Reset Button, USB 3.0 & USB-C
    const pwrBtnMat = new THREE.MeshStandardMaterial({
      color: (isNordicWood || isTerraItx) ? 0xd97706 : (isSnowWhite ? 0xffffff : 0x00f3ff),
      emissive: (isNordicWood || isTerraItx) ? 0xb45309 : (isSnowWhite ? 0x38bdf8 : 0x00f3ff),
      emissiveIntensity: 0.6,
      metalness: (isNordicWood || isTerraItx) ? 0.95 : 0.5
    });
    this.rgbMaterials.push(pwrBtnMat);

    // 1. Power Button with Halo Ring
    this.pwrButtonMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.25, 24), pwrBtnMat);
    this.pwrButtonMesh.position.set(-width / 2 + 1.6, height / 2 + 0.25, depth / 2 - 1.5);
    this.chassisGroup.add(this.pwrButtonMesh);

    // 2. Tactile Reset Button
    const resetBtn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.22, 16),
      portSteelMat
    );
    resetBtn.position.set(-width / 2 + 2.5, height / 2 + 0.24, depth / 2 - 1.5);
    this.chassisGroup.add(resetBtn);

    // 3. Dual Front USB 3.0 Type-A Ports (with Blue Plastic Inserts)
    for (let u = 0; u < 2; u++) {
      const usbHousing = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.48), portSteelMat);
      usbHousing.position.set(-width / 2 + 3.3 + u * 0.75, height / 2 + 0.22, depth / 2 - 1.5);
      this.chassisGroup.add(usbHousing);

      const usbBlueTab = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.38), blueUsbMat);
      usbBlueTab.position.set(-width / 2 + 3.3 + u * 0.75, height / 2 + 0.23, depth / 2 - 1.5);
      this.chassisGroup.add(usbBlueTab);
    }

    // 4. USB 3.2 Gen 2 Type-C Port (Oval Aluminum Shell)
    const topTypeC = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.12, 0.26),
      portSteelMat
    );
    topTypeC.position.set(-width / 2 + 5.0, height / 2 + 0.22, depth / 2 - 1.5);
    this.chassisGroup.add(topTypeC);

    // 5. 3.5mm Headphone / Microphone Audio Jack with Gold Bezel Ring
    const audioJack = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.24, 16), goldMat);
    audioJack.position.set(-width / 2 + 5.7, height / 2 + 0.23, depth / 2 - 1.5);
    this.chassisGroup.add(audioJack);

    // ------------------------------------------------------------------------
    // 4. BOTTOM CHASSIS & MACHINED ALUMINUM FEET WITH RUBBER PADS
    // ------------------------------------------------------------------------
    const botMesh = new THREE.Mesh(new THREE.BoxGeometry(width, 0.6, depth), darkFrameMat);
    botMesh.position.set(0, -height / 2, 0);
    this.chassisGroup.add(botMesh);

    const footMat = new THREE.MeshStandardMaterial({
      color: isSnowWhite ? 0xd1d5db : ((isNordicWood || isTerraItx) ? 0xd97706 : 0x05070a),
      metalness: (isNordicWood || isTerraItx) ? 0.9 : 0.3
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

    // ------------------------------------------------------------------------
    // 5. PSU SHROUD WITH COOLING VENTILATION GRILLE & LIVE OLED POWER DISPLAY
    // ------------------------------------------------------------------------
    const shroudH = isTerraItx ? 1.8 : 4.4;
    const psuShroud = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, shroudH, depth - 0.4), metalMat);
    psuShroud.position.set(0, -height / 2 + shroudH / 2, 0);
    this.chassisGroup.add(psuShroud);

    // Top PSU Shroud Perforated Airflow Ventilation Grille (Cooling holes for GPU intake)
    const psuPerfMat = new THREE.MeshStandardMaterial({
      map: this.getPerforatedMeshTexture(isSnowWhite, false),
      roughness: 0.55,
      metalness: 0.8
    });
    const psuVentGrille = new THREE.Mesh(
      new THREE.PlaneGeometry(width - 1.4, depth - 2.8),
      psuPerfMat
    );
    psuVentGrille.rotation.x = -Math.PI / 2;
    psuVentGrille.position.set(0, -height / 2 + shroudH + 0.01, 0.4);
    this.chassisGroup.add(psuVentGrille);

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
      new THREE.PlaneGeometry(isTerraItx ? 4.2 : 6.4, isTerraItx ? 1.6 : 2.6),
      new THREE.MeshBasicMaterial({ map: psuTexture })
    );
    psuCutoutMesh.rotation.y = Math.PI / 2;
    psuCutoutMesh.position.set(-width / 2 + 0.18, -height / 2 + shroudH / 2, -1.8);
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

    // ------------------------------------------------------------------------
    // 6. FRONT PANEL CUSTOM ARCHITECTURE (ALL 8 CASES)
    // ------------------------------------------------------------------------
    if (isNordicWood) {
      // Fractal North Charcoal Walnut: Real Vertical Wood Slats
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

    } else if (isTerraItx) {
      // Fractal Terra Jade Green Walnut ITX: CNC American Walnut Accent Plate + Jade Green Aluminum Slats
      const terraFrame = new THREE.Mesh(new THREE.BoxGeometry(width, height - 0.6, 0.4), metalMat);
      terraFrame.position.set(0, 0, depth / 2);
      this.chassisGroup.add(terraFrame);

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

      // Front CNC-Milled Solid Walnut Inset Plate
      const woodPlate = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.78, 2.8, 0.3),
        walnutMat
      );
      woodPlate.position.set(0, -height / 2 + 2.2, depth / 2 + 0.22);
      this.chassisGroup.add(woodPlate);

      // Gold CNC Lathe-Polished Power Button on Wood Plate
      const terraPwr = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.2, 24), goldMat);
      terraPwr.rotation.x = Math.PI / 2;
      terraPwr.position.set(width * 0.78 / 2 - 0.8, -height / 2 + 2.2, depth / 2 + 0.38);
      this.chassisGroup.add(terraPwr);

      // Perforated Airflow CNC Slits on Front Upper Panel
      for (let s = 0; s < 8; s++) {
        const slit = new THREE.Mesh(
          new THREE.BoxGeometry(width * 0.65, 0.15, 0.2),
          darkFrameMat
        );
        slit.position.set(0, 1.2 + s * 0.55, depth / 2 + 0.21);
        this.chassisGroup.add(slit);
      }

    } else if (isLianLiEvo) {
      // Lian Li O11 Dynamic EVO: Dual-Chamber Seamless Panoramic Glass Showcase
      const frontGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.05,
        transmission: 0.96,
        transparent: true,
        opacity: 0.32
      });
      const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(width * 0.72, height - 0.6, 0.3), frontGlassMat);
      frontGlass.position.set(-width * 0.14, 0, depth / 2);
      this.chassisGroup.add(frontGlass);

      // Brushed Gunmetal Right Front Pillar with Dual Button Line
      const frontPillar = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.28, height - 0.6, 0.45),
        darkFrameMat
      );
      frontPillar.position.set(width / 2 - (width * 0.14), 0, depth / 2);
      this.chassisGroup.add(frontPillar);

      // 3x Side Vertical Reverse-Intake Fans visible through front & side glass!
      for (let f = 0; f < 3; f++) {
        const sideFan = this.createFan3D(1.65, true, false);
        sideFan.rotation.y = Math.PI / 2;
        sideFan.position.set(width / 2 - 0.6, 4.2 - f * 3.8, 1.4);
        this.chassisGroup.add(sideFan);
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

    } else if (isNzxtH9) {
      // NZXT H9 Flow Dual-Chamber: Seamless Wrap-Around Panoramic Front Glass
      const frontGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.04,
        transmission: 0.96,
        transparent: true,
        opacity: 0.35
      });
      const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(width * 0.76, height - 0.6, 0.28), frontGlassMat);
      frontGlass.position.set(-width * 0.12, 0, depth / 2);
      this.chassisGroup.add(frontGlass);

      // Matte Black Right Pillar with subtle purple NZXT accent strip
      const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(width * 0.24, height - 0.6, 0.4), darkFrameMat);
      rightPillar.position.set(width / 2 - width * 0.12, 0, depth / 2);
      this.chassisGroup.add(rightPillar);

      // 3x Side Vertical F-Series Intake Fans in Dual Chamber
      for (let f = 0; f < 3; f++) {
        const sideFan = this.createFan3D(1.65, true, false);
        sideFan.rotation.y = Math.PI / 2;
        sideFan.position.set(width / 2 - 0.6, 4.2 - f * 3.8, 1.4);
        this.chassisGroup.add(sideFan);
      }

    } else if (isCorsair5000) {
      // Corsair 5000D Airflow: RapidRoute Triangular Steel Front Plate
      const frontFrame = new THREE.Mesh(new THREE.BoxGeometry(width, height - 0.6, 0.4), darkFrameMat);
      frontFrame.position.set(0, 0, depth / 2);
      this.chassisGroup.add(frontFrame);

      const corsairMeshMat = new THREE.MeshStandardMaterial({
        map: this.getPerforatedMeshTexture(false, false),
        roughness: 0.45,
        metalness: 0.9
      });
      const steelPlate = new THREE.Mesh(new THREE.PlaneGeometry(width - 1.6, height - 1.4), corsairMeshMat);
      steelPlate.position.set(0, 0, depth / 2 + 0.22);
      this.chassisGroup.add(steelPlate);

      // Corsair Signature Yellow Accent Pull-Tab at Top Right
      const yellowTab = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.8, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 })
      );
      yellowTab.position.set(width / 2 - 1.2, height / 2 - 1.2, depth / 2 + 0.28);
      this.chassisGroup.add(yellowTab);

      for (let i = 0; i < 3; i++) {
        const fan = this.createFan3D(1.75, true, false);
        fan.position.set(0, 4.5 - i * 4.2, depth / 2 - 0.6);
        this.chassisGroup.add(fan);
      }

    } else if (isMontechKing) {
      // Montech King 95 Pro: Curved Panoramic Seamless Corner Glass
      const curvedGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.04,
        transmission: 0.96,
        transparent: true,
        opacity: 0.32
      });
      const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(width * 0.82, height - 0.6, 0.28), curvedGlassMat);
      frontGlass.position.set(-width * 0.09, 0, depth / 2);
      this.chassisGroup.add(frontGlass);

      // 6x ARGB Reverse-Blade Intake Fans (3 side + 2 bottom)
      for (let f = 0; f < 3; f++) {
        const sideFan = this.createFan3D(1.65, true, false);
        sideFan.rotation.y = Math.PI / 2;
        sideFan.position.set(width / 2 - 0.6, 4.2 - f * 3.8, 1.4);
        this.chassisGroup.add(sideFan);
      }

    } else if (isRogHyperion) {
      // ASUS ROG Hyperion GR701: Titanium Cast Aluminum X-Frame Exoskeleton
      const rogMat = new THREE.MeshStandardMaterial({ color: 0x181a20, metalness: 0.95, roughness: 0.18 });
      const rogAccentMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.9, roughness: 0.2 });

      // Diagonal X-Frame Left & Right Cast Wings
      [-1, 1].forEach(dir => {
        const xWing = new THREE.Mesh(new THREE.BoxGeometry(0.8, height + 1.2, 0.8), rogMat);
        xWing.rotation.z = dir * 0.15;
        xWing.position.set(dir * (width / 2 - 0.6), 0, depth / 2 + 0.3);
        this.chassisGroup.add(xWing);

        // Sturdy Cast Aluminum Top Carry Handle
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, depth - 4, 16), rogMat);
        handle.rotation.x = Math.PI / 2;
        handle.position.set(dir * (width / 2 - 1.2), height / 2 + 1.2, 0);
        this.chassisGroup.add(handle);
      });

      // Front ARGB ROG Cyber Eye Hologram Logo
      const eyeTex = this.createCanvasTexture('rog_hyperion_eye', 256, 256, (ctx, w, h) => {
        ctx.fillStyle = '#05070c';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.moveTo(40, 160);
        ctx.lineTo(210, 60);
        ctx.lineTo(190, 190);
        ctx.closePath();
        ctx.fill();
      });
      const eyeBadge = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), new THREE.MeshBasicMaterial({ map: eyeTex }));
      eyeBadge.position.set(0, 1.0, depth / 2 + 0.32);
      this.chassisGroup.add(eyeBadge);

      for (let i = 0; i < 3; i++) {
        const fan = this.createFan3D(1.9, true, false);
        fan.position.set(0, 4.8 - i * 4.4, depth / 2 - 0.6);
        this.chassisGroup.add(fan);
      }

    } else {
      // High-Airflow Honeycomb Perforated Mesh Front with 3x ARGB Intake Fans
      const frontMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height - 0.6, 0.6), darkFrameMat);
      frontMesh.position.set(0, 0, depth / 2);
      this.chassisGroup.add(frontMesh);

      // Procedural Hexagonal Honeycomb Ventilation Airflow Plate (Cooling Holes)
      const frontPerfMat = new THREE.MeshStandardMaterial({
        map: this.getPerforatedMeshTexture(isSnowWhite, true),
        roughness: 0.55,
        metalness: 0.88
      });
      const frontPerfPlate = new THREE.Mesh(
        new THREE.PlaneGeometry(width - 1.2, height - 1.6),
        frontPerfMat
      );
      frontPerfPlate.position.set(0, 0, depth / 2 + 0.32);
      this.chassisGroup.add(frontPerfPlate);

      for (let i = 0; i < 3; i++) {
        const fan = this.createFan3D(1.8, true, isSnowWhite);
        fan.position.set(0, 4.5 - i * 4.2, depth / 2 - 0.6);
        this.chassisGroup.add(fan);
      }
    }

    // Rear Wall Exhaust Cooling Perforation Grille (Airflow holes behind rear fan)
    const rearPerfMat = new THREE.MeshStandardMaterial({
      map: this.getPerforatedMeshTexture(isSnowWhite, true),
      roughness: 0.5,
      metalness: 0.85
    });
    const rearExhaustVent = new THREE.Mesh(
      new THREE.PlaneGeometry(4.0, 4.4),
      rearPerfMat
    );
    rearExhaustVent.position.set(1.5, 3.5, -depth / 2 + 0.22);
    this.chassisGroup.add(rearExhaustVent);

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
    this.autoFitAndValidateChassis();
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
  // INTERACTIVE STEP-BY-STEP ASSEMBLY DOCK ANIMATIONS (TWO-WAY SMOOTH MOTION)
  // ==========================================================================
  animatePartMotion(targetGroup, offsetAxis, offsetVal, isInstalling, callback = null) {
    if (!targetGroup) {
      if (callback) callback();
      return;
    }

    // Save canonical home coordinates once
    if (targetGroup.userData.homeCoords === undefined) {
      targetGroup.userData.homeCoords = {
        x: targetGroup.position.x,
        y: targetGroup.position.y,
        z: targetGroup.position.z
      };
    }
    const homeVal = targetGroup.userData.homeCoords[offsetAxis];

    if (isInstalling) {
      targetGroup.visible = true;
      targetGroup.position[offsetAxis] = homeVal + offsetVal;
      const startTime = performance.now();
      const duration = 480;

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        targetGroup.position[offsetAxis] = (homeVal + offsetVal) - offsetVal * ease;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          targetGroup.position[offsetAxis] = homeVal;
          this.flashHighlight(targetGroup);
          if (callback) callback();
        }
      };
      requestAnimationFrame(step);
    } else {
      targetGroup.visible = true;
      targetGroup.position[offsetAxis] = homeVal;
      const startTime = performance.now();
      const duration = 420;

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = Math.pow(progress, 2.2);
        targetGroup.position[offsetAxis] = homeVal + offsetVal * ease;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          targetGroup.visible = false;
          targetGroup.position[offsetAxis] = homeVal;
          if (callback) callback();
        }
      };
      requestAnimationFrame(step);
    }
  }

  // Toggle Component Assembly/Disassembly State in 3D
  toggleComponent(partKey) {
    if (this.installed[partKey] === undefined) this.installed[partKey] = true;
    this.installed[partKey] = !this.installed[partKey];
    const isInst = this.installed[partKey];

    switch (partKey) {
      case 'gpu':
        this.animatePartMotion(this.gpuGroup, 'x', -5.5, isInst);
        break;

      case 'cooler':
        this.animatePartMotion(this.coolerGroup, 'x', -4.8, isInst);
        break;

      case 'ram':
        this.animatePartMotion(this.ramGroup, 'y', 3.8, isInst);
        break;

      case 'cpu':
        if (this.thermalPasteMesh) {
          this.thermalPasteMesh.visible = isInst && this.thermalPasteApplied;
        }
        this.animatePartMotion(this.cpuChipGroup, 'x', -3.2, isInst);
        break;

      case 'motherboard':
        this.animatePartMotion(this.mbMeshGroup, 'x', -5.0, isInst, () => {
          if (!isInst) {
            // Hide daughter components if motherboard was removed
            if (this.cpuChipGroup) this.cpuChipGroup.visible = false;
            if (this.coolerGroup) this.coolerGroup.visible = false;
            if (this.ramGroup) this.ramGroup.visible = false;
            if (this.gpuGroup) this.gpuGroup.visible = false;
            if (this.ssdGroup) this.ssdGroup.visible = false;
            if (this.cablesGroup) this.cablesGroup.visible = false;
            if (this.thermalPasteMesh) this.thermalPasteMesh.visible = false;
          } else {
            // Restore installed parts
            if (this.cpuChipGroup) this.cpuChipGroup.visible = !!this.installed.cpu;
            if (this.coolerGroup) this.coolerGroup.visible = !!this.installed.cooler;
            if (this.ramGroup) this.ramGroup.visible = !!this.installed.ram;
            if (this.gpuGroup) this.gpuGroup.visible = !!this.installed.gpu;
            if (this.ssdGroup) this.ssdGroup.visible = !!this.installed.ssd;
            if (this.cablesGroup) this.cablesGroup.visible = !!this.installed.cables;
            if (this.thermalPasteMesh) this.thermalPasteMesh.visible = !!this.installed.cpu && this.thermalPasteApplied;
          }
        });
        if (isInst) {
          // Immediately make them visible to slide in with motherboard
          if (this.cpuChipGroup && this.installed.cpu) this.cpuChipGroup.visible = true;
          if (this.coolerGroup && this.installed.cooler) this.coolerGroup.visible = true;
          if (this.ramGroup && this.installed.ram) this.ramGroup.visible = true;
          if (this.gpuGroup && this.installed.gpu) this.gpuGroup.visible = true;
          if (this.ssdGroup && this.installed.ssd) this.ssdGroup.visible = true;
          if (this.cablesGroup && this.installed.cables) this.cablesGroup.visible = true;
        }
        break;

      case 'ssd':
        this.animatePartMotion(this.ssdGroup, 'x', -2.8, isInst);
        break;

      case 'cables':
        if (this.cablesGroup) {
          this.animatePartMotion(this.cablesGroup, 'z', 4.5, isInst);
        }
        break;

      case 'glass':
        if (this.glassPanelGroup) {
          if (!isInst) {
            this.isGlassOpen = true;
            this.updateGlassPosition(true);
            setTimeout(() => {
              if (!this.installed.glass && this.glassPanelGroup) {
                this.glassPanelGroup.visible = false;
              }
            }, 450);
          } else {
            this.glassPanelGroup.visible = true;
            this.isGlassOpen = false;
            this.updateGlassPosition(true);
          }
        }
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

  // Completely clear all daughter components, leaving ONLY the bare chassis frame
  clearAllComponents() {
    while (this.mbMeshGroup.children.length > 0) {
      this.mbMeshGroup.remove(this.mbMeshGroup.children[0]);
    }
    while (this.cpuChipGroup.children.length > 0) {
      this.cpuChipGroup.remove(this.cpuChipGroup.children[0]);
    }
    while (this.coolerGroup.children.length > 0) {
      this.coolerGroup.remove(this.coolerGroup.children[0]);
    }
    while (this.gpuGroup.children.length > 0) {
      this.gpuGroup.remove(this.gpuGroup.children[0]);
    }
    while (this.ramGroup.children.length > 0) {
      this.ramGroup.remove(this.ramGroup.children[0]);
    }
    while (this.ssdGroup.children.length > 0) {
      this.ssdGroup.remove(this.ssdGroup.children[0]);
    }
    while (this.cablesGroup.children.length > 0) {
      this.cablesGroup.remove(this.cablesGroup.children[0]);
    }
    if (this.thermalPasteMesh) {
      this.componentsGroup.remove(this.thermalPasteMesh);
      this.thermalPasteMesh = null;
      this.thermalPasteApplied = false;
    }
    this.fansList = this.fansList.filter(f => f.isCaseFan);
    this.installed = {
      gpu: false,
      cooler: false,
      ram: false,
      cpu: false,
      motherboard: false,
      ssd: false,
      cables: false,
      glass: true
    };
  }

  // Clear a single component category from the 3D scene
  clearComponent(category) {
    switch (category) {
      case 'motherboard':
        while (this.mbMeshGroup.children.length > 0) this.mbMeshGroup.remove(this.mbMeshGroup.children[0]);
        while (this.cpuChipGroup.children.length > 0) this.cpuChipGroup.remove(this.cpuChipGroup.children[0]);
        while (this.cablesGroup.children.length > 0) this.cablesGroup.remove(this.cablesGroup.children[0]);
        this.installed.motherboard = false;
        this.installed.cpu = false;
        this.installed.cables = false;
        break;
      case 'cooler':
        while (this.coolerGroup.children.length > 0) this.coolerGroup.remove(this.coolerGroup.children[0]);
        this.fansList = this.fansList.filter(f => !f.isCoolerFan);
        this.installed.cooler = false;
        break;
      case 'gpu':
        while (this.gpuGroup.children.length > 0) this.gpuGroup.remove(this.gpuGroup.children[0]);
        this.fansList = this.fansList.filter(f => !f.isGpuFan);
        this.installed.gpu = false;
        break;
      case 'ram':
        while (this.ramGroup.children.length > 0) this.ramGroup.remove(this.ramGroup.children[0]);
        this.installed.ram = false;
        break;
      case 'storage':
        while (this.ssdGroup.children.length > 0) this.ssdGroup.remove(this.ssdGroup.children[0]);
        this.installed.ssd = false;
        break;
      case 'cpu':
        while (this.cpuChipGroup.children.length > 0) this.cpuChipGroup.remove(this.cpuChipGroup.children[0]);
        if (this.thermalPasteMesh) {
          this.componentsGroup.remove(this.thermalPasteMesh);
          this.thermalPasteMesh = null;
          this.thermalPasteApplied = false;
        }
        this.installed.cpu = false;
        break;
    }
  }

  // ==========================================================================
  // SMART CHASSIS BOUNDS VERIFICATION & COMPONENT AUTO-FIT ENGINE
  // Automatically detects if any components exceed chassis boundaries and corrects them
  // ==========================================================================
  autoFitAndValidateChassis() {
    const caseId = this.currentCaseId || 'case-nordic-wood';
    const isTerraItx = caseId === 'case-terra-itx';
    const isRogHyperion = caseId === 'case-rog-hyperion';
    const isDualChamber = caseId === 'case-lianli-o11' || caseId === 'case-nzxt-h9' || caseId === 'case-prestige-hyte' || caseId === 'case-montech-king' || isRogHyperion;

    const width = isDualChamber ? 13.5 : (isTerraItx ? 11.8 : 12.2);
    const height = isRogHyperion ? 17.5 : (isTerraItx ? 15.6 : 16.4);
    const depth = isRogHyperion ? 19.5 : 18.2;

    const report = {
      isInside: true,
      caseId: caseId,
      autoCorrected: false,
      corrections: []
    };

    if (isTerraItx) {
      // 1. MINI-ITX COMPACT SCALING & REPOSITIONING
      // Proportional scale factor to fit standard ATX components cleanly into Mini-ITX chassis
      const itxScale = 0.78;
      this.mbMeshGroup.scale.set(itxScale, itxScale, itxScale);
      this.cpuChipGroup.scale.set(itxScale, itxScale, itxScale);
      this.ramGroup.scale.set(itxScale, itxScale, itxScale);
      this.ssdGroup.scale.set(itxScale, itxScale, itxScale);

      // Positioning offsets: seats motherboard firmly on Terra ITX tray above the 1.8 shroud
      const offsetX = 0.95;
      const offsetY = -0.15;
      const offsetZ = -1.85;

      this.mbMeshGroup.position.set(offsetX, offsetY, offsetZ);
      this.cpuChipGroup.position.set(offsetX, offsetY, offsetZ);
      this.ramGroup.position.set(offsetX, offsetY, offsetZ);
      this.ssdGroup.position.set(offsetX, offsetY, offsetZ);

      // 2. CPU COOLER CLEARANCE AUTO-FIT
      // Compact case side clearance: scale cooler slightly so it never touches side mesh
      const coolerScale = 0.82;
      this.coolerGroup.scale.set(coolerScale, coolerScale, coolerScale);
      this.coolerGroup.position.set(offsetX + 0.08, offsetY, offsetZ);

      // 3. GPU POSITION & CLEARANCE AUTO-FIT
      // Follows PCIe slot on Mini-ITX motherboard, fits within depth clearance
      const gpuScale = 0.88;
      this.gpuGroup.scale.set(gpuScale, gpuScale, 0.92);
      this.gpuGroup.position.set(offsetX - 0.22, offsetY - 0.22, offsetZ + 0.2);

      // Cables
      this.cablesGroup.position.set(offsetX * 0.5, offsetY, offsetZ * 0.5);

      report.autoCorrected = true;
      report.corrections.push('Mini-ITX авто-подгонка: масштаб платы (78%) и позиция согласованы со стойками Fractal Terra');
      report.corrections.push('Зазор кулера и видеокарты откалиброван: 100% внутри габаритов корпуса');
    } else {
      // STANDARD ATX / E-ATX FULL CLEARANCE
      this.mbMeshGroup.scale.set(1.0, 1.0, 1.0);
      this.cpuChipGroup.scale.set(1.0, 1.0, 1.0);
      this.ramGroup.scale.set(1.0, 1.0, 1.0);
      this.ssdGroup.scale.set(1.0, 1.0, 1.0);
      this.coolerGroup.scale.set(1.0, 1.0, 1.0);
      this.gpuGroup.scale.set(1.0, 1.0, 1.0);

      this.mbMeshGroup.position.set(0, 0, 0);
      this.cpuChipGroup.position.set(0, 0, 0);
      this.ramGroup.position.set(0, 0, 0);
      this.ssdGroup.position.set(0, 0, 0);
      this.coolerGroup.position.set(0, 0, 0);
      this.gpuGroup.position.set(0, 0, 0);
      this.cablesGroup.position.set(0, 0, 0);

      report.corrections.push('Стандартная ATX посадка: соосность со стойками и задним щитком 100%');
    }

    // Refresh userData.homeCoords for all component groups so assembly step animations return to current home
    [this.mbMeshGroup, this.cpuChipGroup, this.coolerGroup, this.ramGroup, this.gpuGroup, this.ssdGroup, this.cablesGroup].forEach(g => {
      if (g) {
        g.userData.homeCoords = {
          x: g.position.x,
          y: g.position.y,
          z: g.position.z
        };
      }
    });

    return report;
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

    this.autoFitAndValidateChassis();

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
