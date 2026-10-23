/**
 * CYBER-LAB CUSTOM PC - 3D STUDIO VIEWER
 * Bright Studio White illumination, 6 unique computer cases (Walnut Wood, Mecha Skeleton,
 * Snow White Panoramic, HYTE Y70 Touch, CH560 Digital, Phantom Mesh), instant part updates.
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

    // Component Groups
    this.pcGroup = new THREE.Group();
    this.chassisGroup = new THREE.Group();
    this.glassPanelGroup = new THREE.Group();
    this.componentsGroup = new THREE.Group();

    // Sub-assemblies for specific hardware parts
    this.mbMeshGroup = new THREE.Group();
    this.cpuChipGroup = new THREE.Group();
    this.thermalPasteMesh = null;
    this.coolerGroup = new THREE.Group();
    this.gpuGroup = new THREE.Group();
    this.ramGroup = new THREE.Group();
    this.ssdGroup = new THREE.Group();
    this.psuGroup = new THREE.Group();

    // Fans List for Rotation & Spin-up Inertia
    this.fansList = [];
    this.fanSpeed = 0.0;
    this.targetFanSpeed = 0.12;

    // Studio Theme (Default: Bright White Studio as requested)
    this.studioTheme = 'white'; // 'white' or 'dark'

    // Lights
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

    // Installed parts tracker
    this.installed = {
      motherboard: true,
      cpu: true,
      thermalPaste: true,
      cooler: true,
      ram: true,
      ssd: true,
      gpu: true,
      psu: true
    };

    // Current models
    this.currentCaseId = 'case-nordic-wood';
    this.currentCoolerId = 'cooler-assassin';
    this.currentGpuId = 'gpu-rtx-4070s';
    this.currentMbId = 'mb-b650-am5';
    this.currentRamId = 'ram-32-ddr5-rgb';
    this.currentSsdId = 'ssd-1tb-990pro';
    this.currentPsuId = 'psu-750w-gold';

    this.init();
  }

  // Procedural Canvas Texture Generator
  createCanvasTexture(width, height, drawFn) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    drawFn(ctx, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }

  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 550;

    // 1. Scene with Bright Clean White Studio Background
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf1f5f9); // Clean Studio Light Gray/White
    this.scene.fog = new THREE.FogExp2(0xf1f5f9, 0.008);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(36, width / height, 0.5, 200);
    this.camera.position.set(24, 14, 28);

    // 3. WebGL Renderer with High Exposure & Crisp Antialiasing
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.45; // Bright, crystal clear visibility
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
      this.controls.minDistance = 7;
      this.controls.maxDistance = 65;
      this.controls.target.set(0, 0, 0);
      this.controls.autoRotate = this.isAutoRotate;
      this.controls.autoRotateSpeed = 1.0;
    }

    // 5. Studio Lighting
    this.setupLighting();

    // 6. Workbench / Studio Pedestal Floor
    this.setupWorkbench();

    // 7. Hierarchy
    this.scene.add(this.pcGroup);
    this.pcGroup.add(this.chassisGroup);
    this.pcGroup.add(this.componentsGroup);

    this.componentsGroup.add(this.mbMeshGroup);
    this.componentsGroup.add(this.cpuChipGroup);
    this.componentsGroup.add(this.ramGroup);
    this.componentsGroup.add(this.ssdGroup);
    this.componentsGroup.add(this.coolerGroup);
    this.componentsGroup.add(this.gpuGroup);
    this.componentsGroup.add(this.psuGroup);

    // 8. Initial Build
    this.buildCase(this.currentCaseId);
    this.buildMotherboard(this.currentMbId);
    this.buildCpuChip();
    this.buildThermalPaste();
    this.buildRam(this.currentRamId);
    this.buildSsd(this.currentSsdId);
    this.buildCooler(this.currentCoolerId);
    this.buildGpu(this.currentGpuId);

    // 9. Resize Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    document.addEventListener('fullscreenchange', () => this.onWindowResize());

    // 10. Start Animation Loop
    this.animate();
  }

  // ==========================================================================
  // BRIGHT STUDIO LIGHTING & STUDIO THEME
  // ==========================================================================
  setupLighting() {
    // Pure White Studio Ambient Fill
    this.ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    this.scene.add(this.ambientLight);

    // Primary Studio Key Light
    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    this.keyLight.position.set(18, 35, 24);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.bias = -0.0005;
    this.scene.add(this.keyLight);

    // Secondary Rim Light
    this.fillLight = new THREE.DirectionalLight(0xe2e8f0, 1.2);
    this.fillLight.position.set(-22, 18, -16);
    this.scene.add(this.fillLight);

    // Bottom Bounce Light for Under-case Clarity
    const bounceLight = new THREE.DirectionalLight(0xffffff, 0.8);
    bounceLight.position.set(0, -10, 0);
    this.scene.add(bounceLight);

    // Internal Point Lights for Glowing RGB
    const p1 = new THREE.PointLight(0x00f3ff, 3.0, 22);
    p1.position.set(0, 4, 2);
    this.scene.add(p1);
    this.rgbLights.push(p1);

    const p2 = new THREE.PointLight(0x00f3ff, 2.4, 18);
    p2.position.set(4, -2, 3);
    this.scene.add(p2);
    this.rgbLights.push(p2);

    const p3 = new THREE.PointLight(0x00f3ff, 2.0, 16);
    p3.position.set(-4, 6, 1);
    this.scene.add(p3);
    this.rgbLights.push(p3);
  }

  setupWorkbench() {
    // Clean Reflective Studio Cyclorama Floor
    const floorGeo = new THREE.CylinderGeometry(24, 25, 0.4, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.05
    });
    this.studioFloor = new THREE.Mesh(floorGeo, floorMat);
    this.studioFloor.position.y = -8.5;
    this.studioFloor.receiveShadow = true;
    this.scene.add(this.studioFloor);

    // Subtle Precision Ring on Floor
    const ringGeo = new THREE.RingGeometry(24.1, 24.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, side: THREE.DoubleSide });
    this.rgbMaterials.push(ringMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -8.28;
    this.scene.add(ring);

    // Soft Studio Shadow Grid below
    this.gridHelper = new THREE.GridHelper(80, 50, 0x00f3ff, 0xdbeafe);
    this.gridHelper.position.y = -8.55;
    this.scene.add(this.gridHelper);
  }

  setStudioTheme(themeName) {
    this.studioTheme = themeName;
    if (themeName === 'white') {
      this.scene.background = new THREE.Color(0xf1f5f9);
      this.scene.fog.color = new THREE.Color(0xf1f5f9);
      this.ambientLight.color.setHex(0xffffff);
      this.ambientLight.intensity = 2.2;
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
  // COMPONENT SWAP ROUTER WITH INSTANT 3D REBUILD
  // ==========================================================================
  updateComponent(category, itemId) {
    let targetGroup = null;

    switch (category) {
      case 'case':
        this.buildCase(itemId);
        targetGroup = this.chassisGroup;
        break;
      case 'cooler':
        this.buildCooler(itemId);
        targetGroup = this.coolerGroup;
        break;
      case 'motherboard':
        this.buildMotherboard(itemId);
        targetGroup = this.mbMeshGroup;
        break;
      case 'ram':
        this.buildRam(itemId);
        targetGroup = this.ramGroup;
        break;
      case 'gpu':
        this.buildGpu(itemId);
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
    group.scale.multiplyScalar(1.04);
    setTimeout(() => {
      group.scale.copy(origScale);
    }, 250);
  }

  // ==========================================================================
  // 1. CHASSIS BUILDER: 6 UNIQUE COMPUTER CASES
  // ==========================================================================
  buildCase(caseId, psuId = this.currentPsuId) {
    this.currentCaseId = caseId;
    this.currentPsuId = psuId;

    while (this.chassisGroup.children.length > 0) {
      this.chassisGroup.remove(this.chassisGroup.children[0]);
    }
    this.fansList = this.fansList.filter(f => !f.isCaseFan);

    const isNordicWood = caseId === 'case-nordic-wood'; // Fractal North Walnut
    const isSnowWhite = caseId === 'case-panoramic-snow'; // Lian Li O11 Vision Pure White
    const isMechaSkeleton = caseId === 'case-mecha-cyber'; // Cougar Conquer Mecha
    const isHyteScreen = caseId === 'case-prestige-hyte'; // HYTE Y70 Touch Screen
    const isDigitalDisplay = caseId === 'case-cyber-cube'; // DeepCool CH560

    // Frame & Metal Color
    const frameColor = isSnowWhite ? 0xffffff : (isNordicWood ? 0x18181b : (isMechaSkeleton ? 0x09090b : 0x111520));
    const metalMat = new THREE.MeshStandardMaterial({
      color: frameColor,
      roughness: isSnowWhite ? 0.2 : 0.35,
      metalness: isSnowWhite ? 0.1 : 0.85
    });

    const darkFrameMat = new THREE.MeshStandardMaterial({
      color: isSnowWhite ? 0xf1f5f9 : (isNordicWood ? 0x27272a : 0x090c13),
      roughness: 0.45,
      metalness: isSnowWhite ? 0.2 : 0.9
    });

    const width = 12;
    const height = 16;
    const depth = 18;

    // 1. Back Wall
    const backMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.4), metalMat);
    backMesh.position.set(0, 0, -depth / 2);
    this.chassisGroup.add(backMesh);

    // 2. Motherboard Tray Wall
    const trayMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, height, depth), metalMat);
    trayMesh.position.set(width / 2, 0, 0);
    this.chassisGroup.add(trayMesh);

    // 3. Top Panel
    const topMesh = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), darkFrameMat);
    topMesh.position.set(0, height / 2, 0);
    this.chassisGroup.add(topMesh);

    // Power Button (Brass gold if Nordic Wood, Cyan otherwise)
    const pwrBtnMat = new THREE.MeshStandardMaterial({
      color: isNordicWood ? 0xd97706 : (isSnowWhite ? 0xffffff : 0x00f3ff),
      emissive: isNordicWood ? 0xb45309 : (isSnowWhite ? 0x38bdf8 : 0x00f3ff),
      emissiveIntensity: 0.5,
      metalness: isNordicWood ? 0.95 : 0.5
    });
    this.rgbMaterials.push(pwrBtnMat);
    this.pwrButtonMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.25, 24), pwrBtnMat);
    this.pwrButtonMesh.position.set(-width / 2 + 1.8, height / 2 + 0.25, depth / 2 - 1.5);
    this.chassisGroup.add(this.pwrButtonMesh);

    // 4. Bottom Chassis & Feet
    const botMesh = new THREE.Mesh(new THREE.BoxGeometry(width, 0.6, depth), darkFrameMat);
    botMesh.position.set(0, -height / 2, 0);
    this.chassisGroup.add(botMesh);

    const footMat = new THREE.MeshStandardMaterial({
      color: isSnowWhite ? 0xd1d5db : (isNordicWood ? 0xd97706 : 0x05070a),
      metalness: isNordicWood ? 0.9 : 0.2
    });
    [[-width/2+1.2, -depth/2+1.5], [width/2-1.2, -depth/2+1.5], [-width/2+1.2, depth/2-1.5], [width/2-1.2, depth/2-1.5]].forEach(([x, z]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.8, 16), footMat);
      foot.position.set(x, -height/2 - 0.4, z);
      this.chassisGroup.add(foot);
    });

    // 5. Bottom PSU Shroud
    const psuShroud = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, 4.2, depth - 0.4), metalMat);
    psuShroud.position.set(0, -height / 2 + 2.1, 0);
    this.chassisGroup.add(psuShroud);

    // PSU Cutout Window with Detailed Texture
    const psuTexture = this.createCanvasTexture(256, 128, (ctx, w, h) => {
      ctx.fillStyle = isSnowWhite ? '#f8fafc' : '#05070c';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = isSnowWhite ? '#e2e8f0' : '#1e293b';
      ctx.fillRect(6, 6, w - 12, h - 12);

      const isOled = psuId.includes('oled');
      if (isOled) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(16, 20, w - 32, 60);
        ctx.fillStyle = '#00f3ff';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('ROG THOR 1200W', 24, 46);
        ctx.fillStyle = '#00ff66';
        ctx.font = 'bold 30px monospace';
        ctx.fillText('485W LIVE', 24, 74);
      } else {
        ctx.fillStyle = isSnowWhite ? '#0f172a' : '#ffffff';
        ctx.font = 'bold 22px monospace';
        ctx.fillText(psuId.toUpperCase().replace('PSU-', '').replace('-', ' '), 20, 50);
        ctx.fillStyle = psuId.includes('gold') ? '#f59e0b' : '#38bdf8';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('80 PLUS CERTIFIED', 20, 80);
      }
    });

    const psuCutoutMat = new THREE.MeshBasicMaterial({ map: psuTexture });
    const psuCutoutMesh = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 2.4), psuCutoutMat);
    psuCutoutMesh.rotation.y = Math.PI / 2;
    psuCutoutMesh.position.set(-width / 2 + 0.18, -height / 2 + 2.1, -1.8);
    this.chassisGroup.add(psuCutoutMesh);

    // Digital Screen if CH560
    if (isDigitalDisplay) {
      const ch560Tex = this.createCanvasTexture(256, 128, (ctx, w, h) => {
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#00ff66';
        ctx.font = 'bold 22px monospace';
        ctx.fillText('CPU: 42°C | 65W', 14, 45);
        ctx.fillStyle = '#00f3ff';
        ctx.fillText('GPU: 38°C | 185W', 14, 85);
      });
      const lcd = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 1.8), new THREE.MeshBasicMaterial({ map: ch560Tex }));
      lcd.rotation.y = Math.PI / 2;
      lcd.position.set(-width / 2 + 0.15, -height / 2 + 2.1, 3.8);
      this.chassisGroup.add(lcd);
    }

    // 6. FRONT PANEL CUSTOMIZATION:
    if (isNordicWood) {
      // Fractal North Walnut: Real Vertical Wood Slats
      const frontWoodFrame = new THREE.Mesh(new THREE.BoxGeometry(width, height - 0.6, 0.4), darkFrameMat);
      frontWoodFrame.position.set(0, 0, depth / 2);
      this.chassisGroup.add(frontWoodFrame);

      // 8 Solid Walnut Vertical Wood Slats
      const walnutMat = new THREE.MeshStandardMaterial({
        color: 0x543621, // Rich walnut wood
        roughness: 0.7,
        metalness: 0.05
      });
      for (let i = -3.5; i <= 3.5; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.8, height - 1.2, 0.4), walnutMat);
        slat.position.set(i * 1.35, 0, depth / 2 + 0.3);
        this.chassisGroup.add(slat);
      }

    } else if (isSnowWhite) {
      // Lian Li O11 Vision Pure White: Dual Seamless Glass
      const frontGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, roughness: 0.05, transmission: 0.95, transparent: true, opacity: 0.35
      });
      const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(width, height - 0.6, 0.3), frontGlassMat);
      frontGlass.position.set(0, 0, depth / 2);
      this.chassisGroup.add(frontGlass);

    } else if (isMechaSkeleton) {
      // Cougar Conquer Mecha: Angled Orange Exoskeleton Panels
      const mechaMat = new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.8, roughness: 0.25 });
      const wing1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, height, 4.0), mechaMat);
      wing1.rotation.y = Math.PI / 6;
      wing1.position.set(-width / 2 - 1.0, 1.0, depth / 2 - 1.5);
      this.chassisGroup.add(wing1);

      const wing2 = new THREE.Mesh(new THREE.BoxGeometry(width - 2, 1.2, 3.0), mechaMat);
      wing2.rotation.x = Math.PI / 6;
      wing2.position.set(0, height / 2 + 0.8, depth / 2 - 1.0);
      this.chassisGroup.add(wing2);

      // Open air front fan
      const frontFan = this.createFan3D(2.0, true, false);
      frontFan.position.set(0, 0, depth / 2 - 0.4);
      this.chassisGroup.add(frontFan);

    } else if (isHyteScreen) {
      // HYTE Y70 Touch: 45° Corner Touchscreen
      const frontMesh = new THREE.Mesh(new THREE.BoxGeometry(width - 3.2, height - 0.6, 0.4), darkFrameMat);
      frontMesh.position.set(1.6, 0, depth / 2);
      this.chassisGroup.add(frontMesh);

      const screenTex = this.createCanvasTexture(256, 512, (ctx, w, h) => {
        ctx.fillStyle = '#05070e';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#00f3ff';
        ctx.font = 'bold 26px Orbitron, monospace';
        ctx.fillText('HYTE 2.5K', 20, 50);
        ctx.fillStyle = '#ff007f';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('SYSTEM STATUS', 20, 85);
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const y = 200 + Math.sin(x * 0.05) * 35;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = '22px monospace';
        ctx.fillText('CPU 4.8 GHz', 20, 280);
        ctx.fillText('GPU 2550 MHz', 20, 320);
        ctx.fillText('FPS: 185 AVG', 20, 360);
      });

      const scrMesh = new THREE.Mesh(new THREE.BoxGeometry(4.6, height - 0.8, 0.3), new THREE.MeshBasicMaterial({ map: screenTex }));
      scrMesh.rotation.y = -Math.PI / 4;
      scrMesh.position.set(-width / 2 + 1.8, 0, depth / 2 - 1.8);
      this.chassisGroup.add(scrMesh);

    } else {
      // Standard Mesh Airflow Front with 3 Fans
      const frontMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height - 0.6, 0.6), darkFrameMat);
      frontMesh.position.set(0, 0, depth / 2);
      this.chassisGroup.add(frontMesh);

      for (let i = 0; i < 3; i++) {
        const fan = this.createFan3D(1.8, true, isSnowWhite);
        fan.position.set(0, 4.5 - i * 4.2, depth / 2 - 0.6);
        this.chassisGroup.add(fan);
      }
    }

    // Rear 1x ARGB Exhaust Fan
    const rearFan = this.createFan3D(1.8, true, isSnowWhite);
    rearFan.rotation.y = Math.PI;
    rearFan.position.set(1.5, 3.5, -depth / 2 + 0.8);
    this.chassisGroup.add(rearFan);

    // Tempered Glass Panel
    this.buildGlassPanel(width, height, depth, isSnowWhite);
  }

  buildGlassPanel(width, height, depth, isSnowWhite = false) {
    if (this.glassPanelGroup) {
      this.chassisGroup.remove(this.glassPanelGroup);
    }

    this.glassPanelGroup = new THREE.Group();
    this.glassPanelGroup.position.set(-width / 2, 0, -depth / 2 + 0.2);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: isSnowWhite ? 0xffffff : 0x22324d,
      roughness: 0.05,
      metalness: 0.05,
      transmission: 0.94,
      transparent: true,
      opacity: 0.35,
      reflectivity: 0.7
    });

    const glassMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, height - 0.6, depth - 0.4), glassMat);
    glassMesh.position.set(0, 0, (depth - 0.4) / 2);
    this.glassPanelGroup.add(glassMesh);

    // Rim
    const rimMat = new THREE.MeshStandardMaterial({ color: isSnowWhite ? 0xffffff : 0x05070a, metalness: 0.9 });
    const topRim = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, depth - 0.4), rimMat);
    topRim.position.set(0, height / 2 - 0.45, (depth - 0.4) / 2);
    this.glassPanelGroup.add(topRim);

    const botRim = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, depth - 0.4), rimMat);
    botRim.position.set(0, -height / 2 + 0.45, (depth - 0.4) / 2);
    this.glassPanelGroup.add(botRim);

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
  // 2. MOTHERBOARD BUILDER
  // ==========================================================================
  buildMotherboard(mbId = this.currentMbId) {
    this.currentMbId = mbId;
    while (this.mbMeshGroup.children.length > 0) {
      this.mbMeshGroup.remove(this.mbMeshGroup.children[0]);
    }

    const isWhite = mbId.includes('white');
    const isRog = mbId.includes('z790') || mbId.includes('x670e');
    const isAorus = mbId === 'mb-b650-am5';

    const pcbColor = isWhite ? 0xf8fafc : (isRog ? 0x090d14 : 0x111622);
    const mbMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 10.5, 9.5),
      new THREE.MeshStandardMaterial({ color: pcbColor, roughness: 0.3, metalness: 0.6 })
    );
    mbMesh.position.set(5.5, 1.5, -2);
    this.mbMeshGroup.add(mbMesh);

    // Standoffs
    const standoffMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.2 });
    [[5.3, 6.2, -6.2], [5.3, 6.2, 2.2], [5.3, -3.2, -6.2], [5.3, -3.2, 2.2]].forEach(([x, y, z]) => {
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 12), standoffMat);
      st.rotation.z = Math.PI / 2;
      st.position.set(x, y, z);
      this.mbMeshGroup.add(st);
    });

    // VRM Heatsinks
    const vrmColor = isWhite ? 0xe2e8f0 : (isAorus ? 0x1e293b : (isRog ? 0x18181b : 0x334155));
    const vrmMat = new THREE.MeshStandardMaterial({ color: vrmColor, roughness: 0.2, metalness: 0.9 });

    const vrmTop = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 3.8), vrmMat);
    vrmTop.position.set(5.2, 5.5, -2.5);
    this.mbMeshGroup.add(vrmTop);

    const vrmLeft = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.2, 1.2), vrmMat);
    vrmLeft.position.set(5.2, 3.5, -4.6);
    this.mbMeshGroup.add(vrmLeft);

    // I/O Shield Holographic Badge
    if (isRog || isAorus || isWhite) {
      const logoTex = this.createCanvasTexture(256, 128, (ctx, w, h) => {
        ctx.fillStyle = isWhite ? '#ffffff' : '#09090b';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = isRog ? '#ff007f' : (isWhite ? '#0284c7' : '#f97316');
        ctx.font = 'bold 28px Orbitron, monospace';
        ctx.fillText(isRog ? 'ROG STRIX' : (isWhite ? 'AORUS ICE' : 'AORUS ELITE'), 20, 70);
      });
      const badge = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.0), new THREE.MeshBasicMaterial({ map: logoTex }));
      badge.rotation.y = -Math.PI / 2;
      badge.position.set(5.15, 3.5, -4.6);
      this.mbMeshGroup.add(badge);
    }

    // PCIe Armor Slot
    const pcieSlot = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.45, 6.2), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 }));
    pcieSlot.position.set(5.3, 0.5, -1.8);
    this.mbMeshGroup.add(pcieSlot);

    // Diagnostic LEDs
    this.postLeds = [];
    const ledColors = [0xff3344, 0xffaa00, 0xffffff, 0x00ff66];
    for (let i = 0; i < 4; i++) {
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.15), new THREE.MeshBasicMaterial({ color: ledColors[i] }));
      led.position.set(5.3, 5.8, 1.2 + i * 0.35);
      this.mbMeshGroup.add(led);
      this.postLeds.push(led);
    }
  }

  buildCpuChip() {
    while (this.cpuChipGroup.children.length > 0) {
      this.cpuChipGroup.remove(this.cpuChipGroup.children[0]);
    }

    const socketMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.5, 2.5), new THREE.MeshStandardMaterial({ color: 0x242e42, roughness: 0.5, metalness: 0.6 }));
    socketMesh.position.set(5.4, 3.5, -2.6);
    this.cpuChipGroup.add(socketMesh);

    const ihsMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.0, 2.0), new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.15, metalness: 0.95 }));
    ihsMesh.position.set(5.3, 3.5, -2.6);
    this.cpuChipGroup.add(ihsMesh);
  }

  buildThermalPaste() {
    if (this.thermalPasteMesh) {
      this.componentsGroup.remove(this.thermalPasteMesh);
    }

    const pasteMat = new THREE.MeshStandardMaterial({ color: 0x6b7280, roughness: 0.85, metalness: 0.1 });
    this.thermalPasteMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 0.12, 16), pasteMat);
    this.thermalPasteMesh.rotation.z = Math.PI / 2;
    this.thermalPasteMesh.position.set(5.18, 3.5, -2.6);
    this.thermalPasteMesh.visible = this.thermalPasteApplied;
    this.componentsGroup.add(this.thermalPasteMesh);
  }

  // ==========================================================================
  // 3. RAM BUILDER
  // ==========================================================================
  buildRam(ramId = this.currentRamId) {
    this.currentRamId = ramId;
    while (this.ramGroup.children.length > 0) {
      this.ramGroup.remove(this.ramGroup.children[0]);
    }

    const isBasicNoRgb = ramId === 'ram-32-ddr5-basic';
    const isWhite = ramId.includes('white');
    const isPrestigeTrident = ramId.includes('prestige');
    const isDeltaWings = ramId.includes('t-force') || ramId.includes('delta');

    const numSticks = isPrestigeTrident ? 4 : 2;
    const bodyColor = isWhite ? 0xffffff : (isPrestigeTrident ? 0x0f172a : 0x111827);
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, metalness: isWhite ? 0.2 : 0.85, roughness: 0.2 });

    for (let i = 0; i < numSticks; i++) {
      const zOffset = -0.6 + i * 0.45;
      const stick = new THREE.Group();
      stick.position.set(5.2, 3.8, zOffset);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.5, 0.14), bodyMat);
      stick.add(body);

      if (!isBasicNoRgb) {
        const barHeight = isDeltaWings ? 0.65 : (isPrestigeTrident ? 0.5 : 0.4);
        const rgbMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
        this.rgbMaterials.push(rgbMat);
        const lightbar = new THREE.Mesh(new THREE.BoxGeometry(0.24, barHeight, 0.14), rgbMat);
        lightbar.position.set(0, 1.25, 0);
        stick.add(lightbar);
      }

      this.ramGroup.add(stick);
    }
  }

  // ==========================================================================
  // 4. STORAGE SSD
  // ==========================================================================
  buildSsd(ssdId = this.currentSsdId) {
    this.currentSsdId = ssdId;
    while (this.ssdGroup.children.length > 0) {
      this.ssdGroup.remove(this.ssdGroup.children[0]);
    }

    const isGen5Tower = ssdId.includes('gen5');
    const isSamsungRgb = ssdId.includes('2tb');

    if (isGen5Tower) {
      const t700 = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.4, 3.2),
        new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.9, roughness: 0.2 })
      );
      t700.position.set(5.1, -0.6, -1.8);
      this.ssdGroup.add(t700);
    } else {
      const m2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.6, 3.2),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 })
      );
      m2.position.set(5.3, -0.6, -1.8);
      this.ssdGroup.add(m2);

      if (isSamsungRgb) {
        const neon = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.1, 3.2), new THREE.MeshBasicMaterial({ color: 0x00f3ff }));
        this.rgbMaterials.push(neon.material);
        neon.position.set(5.3, -0.3, -1.8);
        this.ssdGroup.add(neon);
      }
    }
  }

  // ==========================================================================
  // 5. COOLER BUILDER
  // ==========================================================================
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
    const is360LcdAio = coolerId === 'cooler-aio-360';

    if (isSingleTower) {
      const tower = new THREE.Group();
      tower.position.set(4.0, 3.5, -2.6);

      const finMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 3.0), new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.9 }));
      tower.add(finMesh);

      const copperMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2, metalness: 0.95 });
      for (let i = -1; i <= 1; i += 0.66) {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 12), copperMat);
        pipe.position.set(0, 1.7, i * 1.1);
        tower.add(pipe);
      }

      const fan = this.createFan3D(1.4, false);
      fan.isCoolerFan = true;
      fan.rotation.y = -Math.PI / 2;
      fan.position.set(-1.0, 0, 0);
      tower.add(fan);

      this.coolerGroup.add(tower);

    } else if (isDualTower) {
      const dualTower = new THREE.Group();
      dualTower.position.set(3.8, 3.5, -2.6);

      const finMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, roughness: 0.3, metalness: 0.9 });
      const tower1 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.2, 3.0), finMat);
      tower1.position.set(-0.9, 0, 0);
      dualTower.add(tower1);

      const tower2 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.2, 3.0), finMat);
      tower2.position.set(0.9, 0, 0);
      dualTower.add(tower2);

      const fan1 = this.createFan3D(1.4, false);
      fan1.isCoolerFan = true;
      fan1.rotation.y = -Math.PI / 2;
      fan1.position.set(-1.7, 0, 0);
      dualTower.add(fan1);

      const fan2 = this.createFan3D(1.4, false);
      fan2.isCoolerFan = true;
      fan2.rotation.y = -Math.PI / 2;
      fan2.position.set(0.0, 0, 0);
      dualTower.add(fan2);

      this.coolerGroup.add(dualTower);

    } else {
      // Liquid AIO Coolers
      const aio = new THREE.Group();
      const numRadFans = is240Aio ? 2 : 3;
      const radLength = is240Aio ? 8.0 : 11.0;
      const radColor = isWhiteAio ? 0xffffff : 0x18181b;

      const radMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.8, radLength),
        new THREE.MeshStandardMaterial({ color: radColor, roughness: 0.3, metalness: isWhiteAio ? 0.2 : 0.85 })
      );
      radMesh.position.set(2.0, 7.2, 0);
      aio.add(radMesh);

      const spacing = 3.4;
      const startZ = is240Aio ? -1.7 : -3.4;
      for (let i = 0; i < numRadFans; i++) {
        const radFan = this.createFan3D(1.3, false, isWhiteAio);
        radFan.isCoolerFan = true;
        radFan.rotation.x = Math.PI / 2;
        radFan.position.set(2.0, 6.5, startZ + i * spacing);
        aio.add(radFan);
      }

      // Pump Block
      if (is360LcdAio) {
        // NZXT Kraken Elite 360 LCD Pump with Round Screen Texture
        const pumpMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(1.3, 1.3, 0.9, 32),
          new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.9 })
        );
        pumpMesh.rotation.z = Math.PI / 2;
        pumpMesh.position.set(5.0, 3.5, -2.6);
        aio.add(pumpMesh);

        const lcdTex = this.createCanvasTexture(256, 256, (ctx, w, h) => {
          ctx.fillStyle = '#05070e';
          ctx.fillRect(0, 0, w, h);
          ctx.strokeStyle = '#00f3ff';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.arc(w/2, h/2, 95, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 36px Orbitron, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('38°C', w/2, h/2 + 10);
          ctx.fillStyle = '#ff007f';
          ctx.font = 'bold 18px monospace';
          ctx.fillText('CPU TEMP', w/2, h/2 + 45);
        });

        const lcdMirror = new THREE.Mesh(new THREE.CircleGeometry(1.15, 32), new THREE.MeshBasicMaterial({ map: lcdTex }));
        lcdMirror.rotation.y = -Math.PI / 2;
        lcdMirror.position.set(4.53, 3.5, -2.6);
        aio.add(lcdMirror);
      } else {
        const pumpBox = new THREE.Mesh(
          new THREE.BoxGeometry(0.9, 2.2, 2.2),
          new THREE.MeshStandardMaterial({ color: isWhiteAio ? 0xffffff : 0x18181b, roughness: 0.25, metalness: 0.9 })
        );
        pumpBox.position.set(5.0, 3.5, -2.6);
        aio.add(pumpBox);

        const infMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
        this.rgbMaterials.push(infMat);
        const mirror = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), infMat);
        mirror.rotation.y = -Math.PI / 2;
        mirror.position.set(4.53, 3.5, -2.6);
        aio.add(mirror);
      }

      // Braided Coolant Tubes
      const tubeColor = isWhiteAio ? 0xe2e8f0 : 0x1e293b;
      const c1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.5, 6.7, -1.0),
        new THREE.Vector3(3.4, 5.8, -0.6),
        new THREE.Vector3(4.2, 4.4, -1.6),
        new THREE.Vector3(4.9, 3.8, -2.2)
      ]);
      const t1 = new THREE.Mesh(new THREE.TubeGeometry(c1, 24, 0.22, 12, false), new THREE.MeshStandardMaterial({ color: tubeColor, roughness: 0.7 }));
      aio.add(t1);

      const c2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.5, 6.7, -0.4),
        new THREE.Vector3(3.2, 5.5, 0.1),
        new THREE.Vector3(4.0, 4.2, -1.2),
        new THREE.Vector3(4.9, 3.4, -2.2)
      ]);
      const t2 = new THREE.Mesh(new THREE.TubeGeometry(c2, 24, 0.22, 12, false), new THREE.MeshStandardMaterial({ color: tubeColor, roughness: 0.7 }));
      aio.add(t2);

      this.coolerGroup.add(aio);
    }
  }

  // ==========================================================================
  // 6. GPU BUILDER
  // ==========================================================================
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

    const cardLength = is4090 ? 13.5 : (is4080 ? 12.2 : (is4060 ? 8.6 : 10.8));
    const cardHeight = is4090 ? 3.0 : (is4080 ? 2.6 : 1.8);
    const cardWidth = is4090 ? 4.2 : 3.6;

    const gpuAssembly = new THREE.Group();
    gpuAssembly.position.set(3.4, 0.5, -2 + cardLength / 2 - 4.5);

    const shroudColor = isWhite ? 0xffffff : (is4090 ? 0x0f172a : (isRadeon ? 0x1f2430 : (is4060 ? 0x111622 : 0x151b26)));
    const bodyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(cardWidth, cardHeight, cardLength),
      new THREE.MeshStandardMaterial({ color: shroudColor, roughness: 0.35, metalness: isWhite ? 0.2 : 0.85 })
    );
    gpuAssembly.add(bodyMesh);

    const bpColor = isWhite ? 0xe2e8f0 : (is4090 ? 0x09090b : 0x27272a);
    const bpMesh = new THREE.Mesh(
      new THREE.BoxGeometry(cardWidth - 0.1, 0.15, cardLength - 0.1),
      new THREE.MeshStandardMaterial({ color: bpColor, roughness: 0.2, metalness: 0.95 })
    );
    bpMesh.position.set(0, cardHeight / 2 + 0.08, 0);
    gpuAssembly.add(bpMesh);

    // Side Logo with Dynamic Canvas Texture
    const logoTex = this.createCanvasTexture(256, 64, (ctx, w, h) => {
      ctx.fillStyle = isWhite ? '#f8fafc' : '#05070c';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = isRadeon ? '#ef4444' : (isWhite ? '#0284c7' : '#00f3ff');
      ctx.font = 'bold 22px Orbitron, monospace';
      if (is4090) {
        ctx.fillText('ROG MATRIX RTX 4090', 10, 40);
      } else if (isRadeon) {
        ctx.fillText('RADEON RX 7900/7700', 10, 40);
      } else if (isWhite) {
        ctx.fillText('RTX 4070Ti AERO ICE', 10, 40);
      } else if (is4080) {
        ctx.fillText('GEFORCE RTX 4080S', 10, 40);
      } else if (is4060) {
        ctx.fillText('GEFORCE RTX 4060', 10, 40);
      } else {
        ctx.fillText('GEFORCE RTX 4070S', 10, 40);
      }
    });

    const logoBar = new THREE.Mesh(
      new THREE.PlaneGeometry(cardLength * 0.7, 0.65),
      new THREE.MeshBasicMaterial({ map: logoTex, side: THREE.DoubleSide })
    );
    logoBar.rotation.y = -Math.PI / 2;
    logoBar.position.set(-cardWidth / 2 - 0.02, 0, 0);
    gpuAssembly.add(logoBar);

    // Fans
    const numFans = is4060 ? 2 : 3;
    const fanSpacing = (cardLength - 2.5) / (numFans - 1 || 1);
    const startZ = -cardLength / 2 + 1.25;

    for (let i = 0; i < numFans; i++) {
      const gpuFan = this.createFan3D(1.2, false, isWhite);
      gpuFan.isGpuFan = true;
      gpuFan.rotation.x = Math.PI / 2;
      gpuFan.position.set(0, -cardHeight / 2 - 0.05, startZ + i * fanSpacing);
      gpuAssembly.add(gpuFan);
    }

    // 12VHPWR Cable
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-cardWidth / 2 + 0.5, 0.2, 0.8),
      new THREE.Vector3(-cardWidth / 2 + 0.2, -1.8, 1.2),
      new THREE.Vector3(-0.5, -4.5, 1.4)
    ]);
    const cableMesh = new THREE.Mesh(
      new THREE.TubeGeometry(cableCurve, 16, 0.22, 10, false),
      new THREE.MeshStandardMaterial({ color: isWhite ? 0xffffff : 0x0a0d14, roughness: 0.8 })
    );
    gpuAssembly.add(cableMesh);

    this.gpuGroup.add(gpuAssembly);
  }

  createFan3D(radius = 1.8, isCaseFan = false, isWhite = false) {
    const fanGroup = new THREE.Group();

    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    this.rgbMaterials.push(ringMat);
    const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.12, 12, 32), ringMat);
    fanGroup.add(ringMesh);

    const rotorGroup = new THREE.Group();
    rotorGroup.isCaseFan = isCaseFan;

    const hubMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.32, radius * 0.32, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: isWhite ? 0xffffff : 0x0a0e17, roughness: 0.3, metalness: 0.7 })
    );
    hubMesh.rotation.x = Math.PI / 2;
    rotorGroup.add(hubMesh);

    const bladeGeo = new THREE.BoxGeometry(radius * 0.65, 0.08, radius * 0.35);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      transmission: 0.75,
      transparent: true,
      opacity: 0.85
    });

    for (let b = 0; b < 7; b++) {
      const angle = (b / 7) * Math.PI * 2;
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(Math.cos(angle) * radius * 0.55, Math.sin(angle) * radius * 0.55, 0);
      blade.rotation.z = angle;
      blade.rotation.x = 0.5;
      rotorGroup.add(blade);
    }

    fanGroup.add(rotorGroup);
    this.fansList.push(rotorGroup);

    return fanGroup;
  }

  // ==========================================================================
  // PHYSICAL POWER ON & SEQUENCE
  // ==========================================================================
  togglePower() {
    this.isPoweredOn = !this.isPoweredOn;
    this.targetFanSpeed = this.isPoweredOn ? 0.12 : 0.0;

    if (this.pwrButtonMesh) {
      this.pwrButtonMesh.position.y -= 0.1;
      setTimeout(() => {
        if (this.pwrButtonMesh) this.pwrButtonMesh.position.y += 0.1;
      }, 150);
    }

    if (this.isPoweredOn) {
      if (this.postLeds && this.postLeds.length > 0) {
        this.postLeds.forEach((led, idx) => {
          led.visible = false;
          setTimeout(() => {
            led.visible = true;
            setTimeout(() => {
              if (idx < 3) led.visible = false;
            }, 500);
          }, idx * 400);
        });
      }
    } else {
      if (this.postLeds) {
        this.postLeds.forEach(led => led.visible = false);
      }
    }

    return this.isPoweredOn;
  }

  // ==========================================================================
  // RGB THEME & CAMERA CONTROLS
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
      light.intensity = 2.4 * intensity;
    });

    this.rgbMaterials.forEach(mat => {
      mat.color.copy(color);
    });
  }

  setCameraView(viewName) {
    if (!this.controls) return;
    this.isAutoRotate = false;
    this.controls.autoRotate = false;

    let targetPos = new THREE.Vector3(24, 14, 28);
    let targetLook = new THREE.Vector3(0, 0, 0);

    switch (viewName) {
      case 'interior':
        targetPos.set(-18, 2, 0);
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

  smoothAnimateCamera(toPos, toTarget, duration = 800) {
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

  toggleAutoRotate() {
    this.isAutoRotate = !this.isAutoRotate;
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
  // RENDER LOOP
  // ==========================================================================
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    this.fanSpeed += (this.targetFanSpeed - this.fanSpeed) * 0.05;

    if (this.fanSpeed > 0.001) {
      this.fansList.forEach(fan => {
        fan.rotation.z += this.fanSpeed;
      });
    }

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
