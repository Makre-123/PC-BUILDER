/**
 * CYBER-LAB CUSTOM PC - 3D STUDIO CONFIGURATOR ENGINE
 * Hero 3D Computer Viewport, Bright Studio Lighting, Slide-out Hover Catalog Drawer,
 * Dedicated Full-Page Component Catalog, LocalStorage Build Save/Load System,
 * Real-time Compatibility, TDP Power Meter & FPS Gaming Forecast.
 */

// Application State
const state = {
  selected: {
    cpu: null,
    cooler: null,
    motherboard: null,
    ram: null,
    gpu: null,
    storage: null,
    psu: null,
    case: null
  },
  activeRgbTheme: 'cyan',
  activeResolution: '1080p',
  soundEnabled: true,
  audioCtx: null,

  // 3D Engine & Realistic Assembly
  viewer3D: null,
  assemblyStep: 0,
  isPoweredOn: true,
  studioTheme: 'white', // Bright Studio White default

  // Drawer & Catalog Navigation
  drawerCat: 'case',
  drawerSearch: '',
  isDrawerPinned: false,

  // Full Catalog Page Filters
  catalogCat: 'all',
  catalogSearch: '',
  catalogSort: 'default',

  // LocalStorage Saved Builds
  savedBuilds: [],

  // Language (UZ, RU, EN)
  currentLang: 'uz',

  // Currency (UZS, USD, RUB)
  currentCurrency: 'uzs',

  // Owner & Support Portal
  isOwner: false,
  ownerTicketFilter: 'all',
  supportTickets: []
};

// ==========================================================================
// 1. REALISTIC ASSEMBLY STEPS WORKFLOW
// ==========================================================================
const ASSEMBLY_STEPS = [
  {
    id: 'glass',
    badge: 'ШАГ 1 ИЗ 8',
    title: 'Подготовка шасси: Снять стекло',
    desc: 'Снимите закаленное стекло, чтобы получить прямой доступ к внутренностям корпуса.',
    actionText: 'Снять стекло',
    part: 'glass'
  },
  {
    id: 'motherboard',
    badge: 'ШАГ 2 ИЗ 8',
    title: 'Установка материнской платы',
    desc: 'Совместите плату с латунными стойками и прикрутите винтами по периметру.',
    actionText: 'Прикрутить плату',
    part: 'motherboard'
  },
  {
    id: 'cpu',
    badge: 'ШАГ 3 ИЗ 8',
    title: 'Установка процессора в сокет',
    desc: 'Поднимите прижимной рычаг, совместите ключ и опустите CPU в сокет.',
    actionText: 'Установить CPU в сокет',
    part: 'cpu'
  },
  {
    id: 'paste',
    badge: 'ШАГ 4 ИЗ 8',
    title: 'Нанесение термопасты',
    desc: 'Выдавите каплю высокоэффективной термопасты по центру крышки процессора.',
    actionText: 'Выдавить термопасту',
    part: 'thermalPaste'
  },
  {
    id: 'cooler',
    badge: 'ШАГ 5 ИЗ 8',
    title: 'Монтаж охлаждения (Кулер / СВО)',
    desc: 'Установите радиатор или помпу на процессор и затяните винты крест-накрест.',
    actionText: 'Закрепить кулер',
    part: 'cooler'
  },
  {
    id: 'ram',
    badge: 'ШАГ 6 ИЗ 8',
    title: 'Установка оперативной памяти',
    desc: 'Вставьте планки в слоты 2 и 4 до громкого двойного щелчка фиксаторов.',
    actionText: 'Защёлкнуть ОЗУ',
    part: 'ram'
  },
  {
    id: 'gpu',
    badge: 'ШАГ 7 ИЗ 8',
    title: 'Установка видеокарты в PCIe',
    desc: 'Опустите видеокарту в слот PCIe 4.0/5.0 x16 и подключите кабель питания.',
    actionText: 'Вставить видеокарту',
    part: 'gpu'
  },
  {
    id: 'boot',
    badge: 'ШАГ 8 ИЗ 8',
    title: 'Первый запуск (First Boot)',
    desc: 'Верните стекло на корпус и нажмите кнопку POWER ON для старта POST-проверки!',
    actionText: 'ВКЛЮЧИТЬ ПК (POWER ON)',
    part: 'boot'
  }
];

// ==========================================================================
// 2. REALISTIC SOUND SYNTHESIS ENGINE (Web Audio API)
// ==========================================================================
class CyberSound {
  static init() {
    if (!state.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        state.audioCtx = new AudioContext();
      }
    }
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
  }

  static playTone(freq = 880, type = 'sine', duration = 0.08, gainVal = 0.04) {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!state.audioCtx) return;
      const ctx = state.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  static playSelect() {
    this.playTone(1200, 'sine', 0.05, 0.03);
  }

  static playScrewSound() {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!state.audioCtx) return;
      this.playTone(420, 'sawtooth', 0.04, 0.04);
      setTimeout(() => this.playTone(650, 'triangle', 0.05, 0.03), 40);
    } catch (e) {}
  }

  static playRamClickSound() {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!state.audioCtx) return;
      this.playTone(180, 'square', 0.03, 0.08);
      setTimeout(() => this.playTone(850, 'sine', 0.05, 0.06), 25);
    } catch (e) {}
  }

  static playPasteSound() {
    this.playTone(320, 'triangle', 0.12, 0.03);
  }

  static playRelayClick() {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!state.audioCtx) return;
      this.playTone(300, 'square', 0.04, 0.08);
      setTimeout(() => this.playTone(180, 'triangle', 0.06, 0.05), 30);
    } catch (e) {}
  }

  static playPreset() {
    this.playTone(600, 'sine', 0.06, 0.04);
    setTimeout(() => this.playTone(900, 'sine', 0.06, 0.04), 50);
    setTimeout(() => this.playTone(1400, 'sine', 0.1, 0.05), 110);
  }

  static playWarning() {
    this.playTone(300, 'sawtooth', 0.15, 0.06);
  }

  static playBiosBeep() {
    if (!state.soundEnabled) return;
    this.playTone(1000, 'sine', 0.18, 0.08);
  }
}

// ==========================================================================
// 3. APPLICATION INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadSavedBuildsFromStorage();
  initPresets(PC_DATA.presets.optimal);
  
  try {
    const savedLang = localStorage.getItem('cyberpc_lang');
    if (savedLang && ['uz', 'ru', 'en'].includes(savedLang)) {
      state.currentLang = savedLang;
    }
    const savedCurr = localStorage.getItem('cyberpc_currency');
    if (savedCurr && ['uzs', 'usd', 'rub'].includes(savedCurr)) {
      state.currentCurrency = savedCurr;
    }
  } catch (e) {}

  // Render sub-views
  renderDrawerChips();
  renderDrawerItems();
  renderFullCatalog();
  renderSavedBuildsList();
  updateUI();
  setupEventListeners();
  initSupportAndOwnerSystem();

  // Initialize 3D Engine
  if (typeof CyberPC3DViewer !== 'undefined') {
    state.viewer3D = new CyberPC3DViewer('canvas3dContainer');
    state.viewer3D.setStudioTheme('white'); // Explicit White Studio illumination
    sync3DWithState();
  }

  setLanguage(state.currentLang);
  setCurrency(state.currentCurrency);
  updateAssemblyStepUI();
});

function initPresets(preset) {
  Object.keys(preset).forEach(key => {
    if (key !== 'name' && PC_DATA.components[key]) {
      const component = PC_DATA.components[key].find(c => c.id === preset[key]);
      if (component) {
        state.selected[key] = component;
      }
    }
  });
}

function sync3DWithState() {
  if (!state.viewer3D) return;
  const psuId = state.selected.psu ? state.selected.psu.id : undefined;
  if (state.selected.case) {
    state.viewer3D.buildCase(state.selected.case.id, psuId);
  }

  if (state.selected.motherboard) {
    state.viewer3D.buildMotherboard(state.selected.motherboard.id);
  } else if (state.viewer3D.clearComponent) {
    state.viewer3D.clearComponent('motherboard');
  }

  if (state.selected.cpu) {
    state.viewer3D.buildCpuChip(state.selected.cpu.id);
  } else if (state.viewer3D.clearComponent) {
    state.viewer3D.clearComponent('cpu');
  }

  if (state.selected.cooler) {
    state.viewer3D.buildCooler(state.selected.cooler.id);
  } else if (state.viewer3D.clearComponent) {
    state.viewer3D.clearComponent('cooler');
  }

  if (state.selected.gpu) {
    state.viewer3D.buildGpu(state.selected.gpu.id);
  } else if (state.viewer3D.clearComponent) {
    state.viewer3D.clearComponent('gpu');
  }

  if (state.selected.ram) {
    state.viewer3D.buildRam(state.selected.ram.id);
  } else if (state.viewer3D.clearComponent) {
    state.viewer3D.clearComponent('ram');
  }

  if (state.selected.storage) {
    state.viewer3D.buildSsd(state.selected.storage.id);
  } else if (state.viewer3D.clearComponent) {
    state.viewer3D.clearComponent('storage');
  }

  // Automatic chassis bounds verification and component auto-fit
  if (state.viewer3D.autoFitAndValidateChassis) {
    state.viewer3D.autoFitAndValidateChassis();
  }

  state.viewer3D.setRgbTheme(state.activeRgbTheme);

  // Update floating case name badge in 3D
  const caseBadge = document.getElementById('floatingCaseName');
  if (caseBadge && state.selected.case) {
    caseBadge.textContent = state.selected.case.name;
  }
}

// ==========================================================================
// 4. SLIDE-OUT HOVER DRAWER LOGIC
// ==========================================================================
const DRAWER_CAT_CONFIG = {
  case: { icon: '🏛️', short: { uz: 'Korpus', ru: 'Корпус', en: 'Case' } },
  cpu: { icon: '🔲', short: { uz: 'CPU', ru: 'Процессор', en: 'CPU' } },
  cooler: { icon: '❄️', short: { uz: 'Kuler', ru: 'Кулер', en: 'Cooler' } },
  motherboard: { icon: '🖲️', short: { uz: 'Plata', ru: 'Материнка', en: 'Motherboard' } },
  ram: { icon: '⚡', short: { uz: 'RAM', ru: 'ОЗУ', en: 'RAM' } },
  gpu: { icon: '🎮', short: { uz: 'GPU', ru: 'Видеокарта', en: 'GPU' } },
  storage: { icon: '💾', short: { uz: 'SSD', ru: 'SSD Диск', en: 'SSD' } },
  psu: { icon: '🔋', short: { uz: 'BP', ru: 'Блок питания', en: 'PSU' } }
};

function renderDrawerChips() {
  const container = document.getElementById('drawerCatChips');
  if (!container) return;
  container.innerHTML = '';
  const lang = state.currentLang || 'uz';

  Object.keys(DRAWER_CAT_CONFIG).forEach(catId => {
    const conf = DRAWER_CAT_CONFIG[catId];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `drawer-chip-btn ${state.drawerCat === catId ? 'active' : ''}`;
    const name = conf.short[lang] || conf.short.ru;
    btn.innerHTML = `<span class="chip-icon">${conf.icon}</span> <span>${name}</span>`;
    btn.dataset.catId = catId;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setDrawerCategory(catId);
    });

    container.appendChild(btn);
  });
}

function setDrawerCategory(catId) {
  state.drawerCat = catId;
  const lang = state.currentLang || 'uz';
  const conf = DRAWER_CAT_CONFIG[catId];
  const catObj = PC_DATA.categories.find(c => c.id === catId);
  const title = document.getElementById('drawerCatTitle');
  if (title) {
    const tPrefix = (window.I18N && window.I18N[lang] && window.I18N[lang].drawerTitlePrefix) || 'ВЫБОР: ';
    const displayName = conf ? (conf.short[lang] || conf.short.ru) : (catObj ? catObj.name : catId);
    title.textContent = `${tPrefix}${displayName.toUpperCase()}`;
  }

  // Update active rail icons
  document.querySelectorAll('.rail-cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === catId);
  });

  // Update chips
  document.querySelectorAll('.drawer-chip-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.catId === catId);
  });

  renderDrawerItems();
  CyberSound.playSelect();
}

function renderDrawerItems() {
  const container = document.getElementById('drawerItemsList');
  if (!container) return;
  container.innerHTML = '';

  const catId = state.drawerCat;
  let items = PC_DATA.components[catId] || [];

  // Filter if search query exists
  if (state.drawerSearch.trim()) {
    const q = state.drawerSearch.toLowerCase().trim();
    items = items.filter(item => {
      const name = (item.name || '').toLowerCase();
      const desc = (item.desc || '').toLowerCase();
      const badge = (item.badge || '').toLowerCase();
      const socket = (item.socket || '').toLowerCase();
      const chip = (item.chip || '').toLowerCase();
      return name.includes(q) || desc.includes(q) || badge.includes(q) || socket.includes(q) || chip.includes(q);
    });
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #64748b; font-family: var(--font-mono); font-size: 0.8rem;">
        Ничего не найдено по запросу "${state.drawerSearch}"
      </div>
    `;
    return;
  }

  items.forEach(item => {
    const isSelected = state.selected[catId] && state.selected[catId].id === item.id;
    const card = document.createElement('div');
    card.className = `drawer-item-card ${isSelected ? 'selected' : ''}`;

    let tagsHtml = '';
    if (item.socket) tagsHtml += `<span class="drawer-mini-tag">${item.socket}</span>`;
    if (item.vram) tagsHtml += `<span class="drawer-mini-tag">${item.vram}</span>`;
    if (item.ramType) tagsHtml += `<span class="drawer-mini-tag">${item.ramType}</span>`;
    if (item.tdp) tagsHtml += `<span class="drawer-mini-tag">${item.tdp}W</span>`;
    if (item.badge) tagsHtml += `<span class="drawer-mini-tag" style="color:var(--neon-pink);">${item.badge}</span>`;

    const lang = state.currentLang || 'uz';
    const removeLabel = lang === 'uz' ? 'Olib tashlash' : (lang === 'en' ? 'Remove' : 'Снять');

    card.innerHTML = `
      <div class="drawer-item-info">
        <span class="drawer-item-name">${item.name}</span>
        <div class="drawer-item-meta">${tagsHtml}</div>
      </div>
      <div class="drawer-item-price">
        ${formatRub(item.price)}
        ${isSelected && catId !== 'case' ? `<span class="drawer-remove-badge" title="${removeLabel}">✕ ${removeLabel}</span>` : ''}
      </div>
    `;

    card.addEventListener('click', () => {
      if (isSelected && catId !== 'case') {
        removeComponent(catId);
      } else {
        selectComponent(catId, item);
      }
      renderDrawerItems();
    });

    container.appendChild(card);
  });
}

// ==========================================================================
// 5. COMPONENT SELECTION & REAL-TIME 3D UPDATES
// ==========================================================================
function selectComponent(catId, item) {
  // If clicking an already selected item (except chassis), uninstall it
  if (state.selected[catId] && state.selected[catId].id === item.id && catId !== 'case') {
    removeComponent(catId);
    return;
  }

  state.selected[catId] = item;

  // Audio feedback
  if (catId === 'gpu' || catId === 'ram') {
    CyberSound.playRamClickSound();
  } else if (catId === 'cooler' || catId === 'motherboard' || catId === 'storage') {
    CyberSound.playScrewSound();
  } else if (catId === 'case' || catId === 'psu') {
    CyberSound.playRelayClick();
  } else {
    CyberSound.playSelect();
  }

  // Instant 3D Component Swap & Flash
  if (state.viewer3D) {
    state.viewer3D.updateComponent(catId, item.id);
  }

  // Update floating case name badge in 3D
  const caseBadge = document.getElementById('floatingCaseName');
  if (caseBadge && state.selected.case) {
    caseBadge.textContent = state.selected.case.name;
  }

  updateUI();
  const lang = state.currentLang || 'uz';
  const msg = lang === 'uz'
    ? `O‘rnatildi: ${item.name}`
    : (lang === 'en' ? `Installed: ${item.name}` : `Установлено в ПК: ${item.name}`);
  showToast(msg);
}

function removeComponent(catId) {
  if (catId === 'case') {
    const lang = state.currentLang || 'uz';
    const msg = lang === 'uz'
      ? 'Korpusni butunlay olib tashlab bo‘lmaydi. Boshqa modelni tanlang.'
      : (lang === 'en' ? 'Chassis cannot be removed. Select another model.' : 'Корпус нельзя снять. Выберите другую модель.');
    showToast(msg);
    return;
  }

  const oldItem = state.selected[catId];
  if (!oldItem) return;

  state.selected[catId] = null;
  CyberSound.playRelayClick();

  if (state.viewer3D && state.viewer3D.clearComponent) {
    state.viewer3D.clearComponent(catId);
  }

  updateUI();
  renderDrawerItems();
  renderFullCatalog();

  const lang = state.currentLang || 'uz';
  const name = oldItem ? oldItem.name : catId;
  const msg = lang === 'uz'
    ? `«${name}» olib tashlandi`
    : (lang === 'en' ? `«${name}» removed from build` : `Деталь снята: «${name}»`);
  showToast(msg);
}

// ==========================================================================
// 6. DEDICATED FULL-PAGE COMPONENT CATALOG VIEW
// ==========================================================================
function renderFullCatalog() {
  const container = document.getElementById('catalogGridContainer');
  if (!container) return;
  container.innerHTML = '';

  let allItems = [];

  if (state.catalogCat === 'all') {
    Object.keys(PC_DATA.components).forEach(catId => {
      PC_DATA.components[catId].forEach(item => {
        allItems.push({ ...item, _catId: catId });
      });
    });
  } else {
    const items = PC_DATA.components[state.catalogCat] || [];
    items.forEach(item => {
      allItems.push({ ...item, _catId: state.catalogCat });
    });
  }

  // Search filter
  if (state.catalogSearch.trim()) {
    const q = state.catalogSearch.toLowerCase().trim();
    allItems = allItems.filter(item => {
      const name = (item.name || '').toLowerCase();
      const desc = (item.desc || '').toLowerCase();
      const badge = (item.badge || '').toLowerCase();
      const socket = (item.socket || '').toLowerCase();
      const chip = (item.chip || '').toLowerCase();
      return name.includes(q) || desc.includes(q) || badge.includes(q) || socket.includes(q) || chip.includes(q);
    });
  }

  // Sorting
  if (state.catalogSort === 'price-asc') {
    allItems.sort((a, b) => a.price - b.price);
  } else if (state.catalogSort === 'price-desc') {
    allItems.sort((a, b) => b.price - a.price);
  } else if (state.catalogSort === 'power-desc') {
    allItems.sort((a, b) => (b.tdp || b.wattage || 0) - (a.tdp || a.wattage || 0));
  }

  // Counter
  const countLabel = document.getElementById('catalogResultsCount');
  if (countLabel) {
    countLabel.textContent = `Показано: ${allItems.length} комплектующих`;
  }

  if (allItems.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; color: #94a3b8; font-family: var(--font-display); font-size: 1.1rem;">
        По вашему запросу «${state.catalogSearch}» ничего не найдено.
      </div>
    `;
    return;
  }

  allItems.forEach(item => {
    const catId = item._catId;
    const catObj = PC_DATA.categories.find(c => c.id === catId);
    const isSelected = state.selected[catId] && state.selected[catId].id === item.id;

    const card = document.createElement('div');
    card.className = `catalog-product-card ${isSelected ? 'in-build' : ''}`;

    let specChips = '';
    if (item.socket) specChips += `<span class="spec-chip accent">Сокет: ${item.socket}</span>`;
    if (item.cores) specChips += `<span class="spec-chip">${item.cores}</span>`;
    if (item.freq) specChips += `<span class="spec-chip">${item.freq}</span>`;
    if (item.tdp) specChips += `<span class="spec-chip">TDP: ${item.tdp} Вт</span>`;
    if (item.maxTdp) specChips += `<span class="spec-chip">Отвод: ${item.maxTdp} Вт</span>`;
    if (item.vram) specChips += `<span class="spec-chip accent">${item.vram}</span>`;
    if (item.capacity) specChips += `<span class="spec-chip">${item.capacity}</span>`;
    if (item.speed) specChips += `<span class="spec-chip">${item.speed}</span>`;
    if (item.ramType) specChips += `<span class="spec-chip accent">${item.ramType}</span>`;
    if (item.wattage) specChips += `<span class="spec-chip accent">${item.wattage} Вт</span>`;
    if (item.cert) specChips += `<span class="spec-chip">${item.cert}</span>`;

    card.innerHTML = `
      <div>
        <div class="product-top-row">
          <span class="product-cat-badge">${catObj ? catObj.name : catId}</span>
          ${item.badge ? `<span class="product-tier-badge">${item.badge}</span>` : ''}
        </div>
        <h3 class="product-title" style="margin-top: 8px;">${item.name}</h3>
        <p class="product-desc" style="margin-top: 6px;">${item.desc || ''}</p>
        <div class="product-specs-grid" style="margin-top: 12px;">${specChips}</div>
      </div>

      <div class="product-bottom-row">
        <div class="product-price">${formatRub(item.price)}</div>
        <button class="btn-insert-build ${isSelected ? 'selected' : ''}" data-cat-id="${catId}" data-item-id="${item.id}" title="${isSelected && catId !== 'case' ? 'Нажмите, чтобы снять из ПК' : ''}">
          ${isSelected ? (catId === 'case' ? '✔ Выбран' : '🗑️ Снять из сборки') : '➕ Вставить в сборку'}
        </button>
      </div>
    `;

    const insertBtn = card.querySelector('.btn-insert-build');
    insertBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isSelected && catId !== 'case') {
        removeComponent(catId);
      } else {
        selectComponent(catId, item);
        switchPage('pageConfigurator');
      }
      renderFullCatalog();
      renderDrawerItems();
    });

    container.appendChild(card);
  });
}

// ==========================================================================
// 7. BUILD SAVE & LOAD SYSTEM (LOCALSTORAGE)
// ==========================================================================
const STORAGE_KEY = 'cyber_pc_saved_builds';

function loadSavedBuildsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state.savedBuilds = raw ? JSON.parse(raw) : [];
  } catch (e) {
    state.savedBuilds = [];
  }
  updateSavedBuildsCounter();
}

function saveBuildToStorage(buildName) {
  if (!buildName || !buildName.trim()) {
    showToast('Введите название для сборки!');
    return;
  }

  let total = 0;
  Object.values(state.selected).forEach(c => { if (c && c.price) total += c.price; });

  const buildRecord = {
    id: 'build_' + Date.now(),
    name: buildName.trim(),
    date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    totalPrice: total,
    totalWatts: calculateTotalPowerConsumption(),
    parts: {
      cpu: state.selected.cpu ? state.selected.cpu.id : null,
      cooler: state.selected.cooler ? state.selected.cooler.id : null,
      motherboard: state.selected.motherboard ? state.selected.motherboard.id : null,
      ram: state.selected.ram ? state.selected.ram.id : null,
      gpu: state.selected.gpu ? state.selected.gpu.id : null,
      storage: state.selected.storage ? state.selected.storage.id : null,
      psu: state.selected.psu ? state.selected.psu.id : null,
      case: state.selected.case ? state.selected.case.id : null
    }
  };

  state.savedBuilds.unshift(buildRecord);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedBuilds));
  } catch (e) {}

  updateSavedBuildsCounter();
  renderSavedBuildsList();
  CyberSound.playPreset();
  showToast(`Сборка «${buildRecord.name}» успешно сохранена!`);
}

function loadBuildRecord(buildId) {
  const build = state.savedBuilds.find(b => b.id === buildId);
  if (!build) return;

  Object.keys(build.parts).forEach(catId => {
    const itemId = build.parts[catId];
    if (itemId && PC_DATA.components[catId]) {
      const comp = PC_DATA.components[catId].find(c => c.id === itemId);
      state.selected[catId] = comp || null;
    } else {
      state.selected[catId] = null;
    }
  });

  sync3DWithState();
  updateUI();
  renderDrawerItems();
  renderFullCatalog();
  closeModal('saveLoadModal');
  CyberSound.playPreset();
  showToast(`Загружена сборка: «${build.name}»`);
}

function deleteBuildRecord(buildId) {
  state.savedBuilds = state.savedBuilds.filter(b => b.id !== buildId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedBuilds));
  } catch (e) {}
  updateSavedBuildsCounter();
  renderSavedBuildsList();
  showToast('Сборка удалена из слотов');
}

function updateSavedBuildsCounter() {
  const badge = document.getElementById('navSavedCount');
  const countLabel = document.getElementById('savedSlotsCountLabel');
  const len = state.savedBuilds.length;
  if (badge) badge.textContent = len;
  if (countLabel) countLabel.textContent = `${len} сборок`;
}

function renderSavedBuildsList() {
  const container = document.getElementById('savedBuildsList');
  if (!container) return;
  container.innerHTML = '';

  if (state.savedBuilds.length === 0) {
    container.innerHTML = `
      <div style="padding: 24px; text-align: center; color: #64748b; font-family: var(--font-mono); font-size: 0.85rem;">
        У вас пока нет сохраненных сборок.<br>Настройте конфигурацию и нажмите «Сохранить слот».
      </div>
    `;
    return;
  }

  state.savedBuilds.forEach(build => {
    const card = document.createElement('div');
    card.className = 'saved-build-card';

    card.innerHTML = `
      <div class="saved-build-meta">
        <span class="saved-build-name">${build.name}</span>
        <span class="saved-build-sub">${build.date} • ${formatRub(build.totalPrice)} • ~${build.totalWatts} Вт</span>
      </div>
      <div class="saved-build-actions">
        <button class="btn-load-slot" data-id="${build.id}">Загрузить</button>
        <button class="btn-delete-slot" data-id="${build.id}" title="Удалить слот">✕</button>
      </div>
    `;

    card.querySelector('.btn-load-slot').addEventListener('click', () => loadBuildRecord(build.id));
    card.querySelector('.btn-delete-slot').addEventListener('click', () => deleteBuildRecord(build.id));

    container.appendChild(card);
  });
}

// ==========================================================================
// 8. PAGE NAVIGATION & MODAL MANAGEMENT
// ==========================================================================
function switchPage(pageId) {
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.page-view').forEach(p => p.style.display = 'none');

  const target = document.getElementById(pageId);
  if (target) {
    target.style.display = 'block';
    target.classList.add('active');
  }

  document.querySelectorAll('.nav-page-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });

  if (pageId === 'pageConfigurator' && state.viewer3D) {
    setTimeout(() => state.viewer3D.onWindowResize(), 50);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  CyberSound.playSelect();
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    CyberSound.playSelect();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

// ==========================================================================
// 9. STEP-BY-STEP REALISTIC ASSEMBLY
// ==========================================================================
function updateAssemblyStepUI() {
  const lang = state.currentLang || 'uz';
  const t = (window.I18N && window.I18N[lang]) ? window.I18N[lang] : window.I18N.ru;
  const stepData = t && t.assemblySteps ? t.assemblySteps[state.assemblyStep] : null;
  const origStep = ASSEMBLY_STEPS[state.assemblyStep];
  if (!stepData && !origStep) return;

  const badgeElem = document.getElementById('assemblyStepBadge');
  const titleElem = document.getElementById('assemblyStepTitle');
  const descElem = document.getElementById('assemblyStepDesc');
  const actionText = document.getElementById('assemblyActionText');

  const stepNum = state.assemblyStep + 1;
  const badgeText = lang === 'uz' ? `${stepNum} / 8 - QADAM` : (lang === 'en' ? `STEP ${stepNum} OF 8` : `ШАГ ${stepNum} ИЗ 8`);

  if (badgeElem) badgeElem.textContent = badgeText;
  if (titleElem) titleElem.textContent = stepData ? stepData.title : origStep.title;
  if (descElem) descElem.textContent = stepData ? stepData.desc : origStep.desc;
  if (actionText) actionText.textContent = stepData ? (state.assemblyStep === 7 ? t.stepFinish : stepData.title) : origStep.actionText;
}

function executeAssemblyStep() {
  const step = ASSEMBLY_STEPS[state.assemblyStep];
  if (!step) return;

  switch (step.part) {
    case 'glass':
      if (state.viewer3D) {
        state.viewer3D.isGlassOpen = true;
        state.viewer3D.updateGlassPosition(true);
        const glassBtn = document.getElementById('toggleGlassBtn');
        if (glassBtn) glassBtn.classList.add('open-active');
      }
      CyberSound.playSelect();
      showToast('Боковое стекло снято! Доступ к стойкам открыт.');
      advanceAssemblyStep();
      break;

    case 'motherboard':
      CyberSound.playScrewSound();
      if (state.viewer3D) {
        state.viewer3D.animatePartDock('motherboard', true, () => {
          showToast('Материнская плата прикручена на латунные стойки!');
          advanceAssemblyStep();
        });
      } else advanceAssemblyStep();
      break;

    case 'cpu':
      CyberSound.playRamClickSound();
      if (state.viewer3D) {
        state.viewer3D.animatePartDock('cpu', true, () => {
          showToast('Процессор установлен в сокет, рычаг защёлкнут!');
          advanceAssemblyStep();
        });
      } else advanceAssemblyStep();
      break;

    case 'thermalPaste':
      CyberSound.playPasteSound();
      if (state.viewer3D) {
        state.viewer3D.applyThermalPaste(() => {
          showToast('Термопаста нанесена по центру крышки CPU!');
          advanceAssemblyStep();
        });
      } else advanceAssemblyStep();
      break;

    case 'cooler':
      CyberSound.playScrewSound();
      if (state.viewer3D) {
        state.viewer3D.animatePartDock('cooler', true, () => {
          showToast('Охлаждение смонтировано с равномерным прижимом!');
          advanceAssemblyStep();
        });
      } else advanceAssemblyStep();
      break;

    case 'ram':
      CyberSound.playRamClickSound();
      if (state.viewer3D) {
        state.viewer3D.animatePartDock('ram', true, () => {
          showToast('Планки ОЗУ защёлкнуты в слоты A2/B2 Dual-Channel!');
          advanceAssemblyStep();
        });
      } else advanceAssemblyStep();
      break;

    case 'gpu':
      CyberSound.playRamClickSound();
      if (state.viewer3D) {
        state.viewer3D.animatePartDock('gpu', true, () => {
          showToast('Видеокарта зафиксирована в PCIe x16, кабель питания подключен!');
          advanceAssemblyStep();
        });
      } else advanceAssemblyStep();
      break;

    case 'boot':
      if (state.viewer3D) {
        state.viewer3D.isGlassOpen = false;
        state.viewer3D.updateGlassPosition(false);
        const glassBtn = document.getElementById('toggleGlassBtn');
        if (glassBtn) glassBtn.classList.remove('open-active');
      }
      triggerPowerSequence();
      break;
  }
}

function advanceAssemblyStep() {
  state.assemblyStep = (state.assemblyStep + 1) % ASSEMBLY_STEPS.length;
  updateAssemblyStepUI();
}

function triggerPowerSequence() {
  CyberSound.playRelayClick();
  setTimeout(() => CyberSound.playBiosBeep(), 400);

  if (state.viewer3D) {
    state.viewer3D.togglePower(true);
  }

  const pBtn = document.getElementById('powerOnBtn');
  if (pBtn) pBtn.classList.add('powered-on');
  showToast('СИСТЕМА ЗАПУЩЕНА! POST CHECK OK [CODE 00]');
}

// ==========================================================================
// 10. REACTIVE METRICS & UI SYNCHRONIZATION
// ==========================================================================
function updateUI() {
  updatePriceDisplay();
  updateCompatibility();
  updatePowerMeter();
  updateBenchmarkUI();
  updateMiniSpecSummary();
}

function updatePriceDisplay() {
  let total = 0;
  Object.values(state.selected).forEach(comp => {
    if (comp && comp.price) total += comp.price;
  });

  const priceElem = document.getElementById('totalPriceDisplay');
  if (priceElem) {
    priceElem.textContent = formatRub(total);
  }
}

function calculateTotalPowerConsumption() {
  const cpuTdp = state.selected.cpu ? state.selected.cpu.tdp : 65;
  const gpuTdp = state.selected.gpu ? state.selected.gpu.tdp : 115;
  return cpuTdp + gpuTdp + 80;
}

function updateCompatibility() {
  const issues = [];
  const warnings = [];

  const cpu = state.selected.cpu;
  const mb = state.selected.motherboard;
  const ram = state.selected.ram;
  const cooler = state.selected.cooler;
  const psu = state.selected.psu;

  if (cpu && mb && cpu.socket !== mb.socket) {
    issues.push(`Несовместимый сокет: CPU (${cpu.socket}) ≠ Плата (${mb.socket})`);
  }

  if (ram && mb && ram.ramType !== mb.ramType) {
    issues.push(`Несовместимая память: Плата (${mb.ramType}) ≠ ОЗУ (${ram.ramType})`);
  }

  if (cpu && cooler && cooler.maxTdp < cpu.tdp) {
    warnings.push(`Кулер слабоват: ${cooler.maxTdp}W < CPU ${cpu.tdp}W`);
  }

  const watts = calculateTotalPowerConsumption();
  if (psu) {
    if (watts > psu.wattage) {
      issues.push(`Дефицит мощности: ${watts}W > БП ${psu.wattage}W`);
    } else if (watts > psu.wattage * 0.85) {
      warnings.push(`БП загружен на 85%+ (${watts} / ${psu.wattage} Вт)`);
    }
  }

  const badge = document.getElementById('compatBadge');
  const lang = state.currentLang || 'uz';
  const t = (window.I18N && window.I18N[lang]) ? window.I18N[lang] : window.I18N.ru;

  if (badge) {
    badge.className = 'bottom-compat-badge';
    if (issues.length > 0) {
      badge.classList.add('compat-badge-warn');
      badge.innerHTML = `<span class="compat-icon">⚠️</span> <span class="compat-text">${issues[0]}</span>`;
    } else if (warnings.length > 0) {
      badge.classList.add('compat-badge-warn');
      badge.innerHTML = `<span class="compat-icon">⚠️</span> <span class="compat-text">${warnings[0]}</span>`;
    } else {
      badge.classList.add('compat-badge-ok');
      badge.innerHTML = `<span class="compat-icon">✔</span> <span class="compat-text" id="txtCompat">${t.compatOk}</span>`;
    }
  }
}

function updatePowerMeter() {
  const usedWatts = calculateTotalPowerConsumption();
  const psuWattage = state.selected.psu ? state.selected.psu.wattage : 750;

  const usedElem = document.getElementById('powerUsedWatts');
  const totalElem = document.getElementById('powerTotalWatts');
  const barFill = document.getElementById('powerBarFill');
  const statusLabel = document.getElementById('powerStatusLabel');
  const percentLabel = document.getElementById('powerPercentLabel');

  if (usedElem) usedElem.textContent = `${usedWatts}`;
  if (totalElem) totalElem.textContent = `${psuWattage} Вт`;

  const percent = Math.min(Math.round((usedWatts / psuWattage) * 100), 100);
  if (barFill) {
    barFill.style.width = `${percent}%`;
    barFill.className = 'power-bar-fill';
    if (percent > 90) barFill.classList.add('danger');
    else if (percent > 75) barFill.classList.add('warning');
  }

  if (percentLabel) percentLabel.textContent = `${percent}% нагрузки`;
  if (statusLabel) {
    const margin = psuWattage - usedWatts;
    statusLabel.textContent = margin > 0 ? `Запас мощности: +${margin} Вт` : `Дефицит: ${margin} Вт!`;
    statusLabel.style.color = margin > 0 ? '#64748b' : 'var(--neon-red)';
  }
}

// ==========================================================================
// REALISTIC PC PERFORMANCE FORECASTS: GAMING FPS, 1% LOW, BOTTLENECK & WORKSTATION
// ==========================================================================
function updateBenchmarkUI() {
  // Hide all performance forecasts unless at least CPU+GPU are installed
  // Just a case or single component = no meaningful forecast
  const cpu = state.selected.cpu;
  const gpu = state.selected.gpu;
  const hasEnoughForForecast = cpu && gpu;
  
  const fpsContainer = document.getElementById('fpsGamesContainer');
  const bottleneckPanel = document.getElementById('bottleneckPanel');
  const displayRecPanel = document.getElementById('displayRecPanel');
  const workContainer = document.getElementById('workstationContainer');
  const thermalCard = document.getElementById('thermalForecastCard');
  
  if (!hasEnoughForForecast) {
    // Show placeholder message
    const msg = !cpu && !gpu
      ? 'Установите CPU и GPU для прогноза производительности'
      : (!cpu ? 'Добавьте процессор для полного прогноза' : 'Добавьте видеокарту для полного прогноза');
    if (fpsContainer) fpsContainer.innerHTML = `<div style="text-align:center;color:#475569;padding:24px 12px;font-size:0.82rem;">${msg}</div>`;
    if (bottleneckPanel) bottleneckPanel.style.display = 'none';
    if (displayRecPanel) displayRecPanel.style.display = 'none';
    if (workContainer) workContainer.innerHTML = `<div style="text-align:center;color:#475569;padding:24px 12px;font-size:0.82rem;">${msg}</div>`;
    if (thermalCard) thermalCard.style.display = 'none';
    return;
  }
  
  // Show panels
  if (bottleneckPanel) bottleneckPanel.style.display = '';
  if (displayRecPanel) displayRecPanel.style.display = '';
  if (thermalCard) thermalCard.style.display = '';

  updateFpsMeter();
  updateWorkstationMeter();
  updateThermalForecast();
}

function updateFpsMeter() {
  const container = document.getElementById('fpsGamesContainer');
  if (!container) return;
  container.innerHTML = '';

  const cpu = state.selected.cpu;
  const gpu = state.selected.gpu;
  
  // If no GPU and no CPU — nothing to show
  if (!cpu && !gpu) return;
  
  const cpuScore = cpu ? cpu.score : 65;
  const gpuMultiplier = gpu ? gpu.fpsMultiplier : 0.8;
  const vramStr = gpu ? (gpu.vram || '8 ГБ') : '4 ГБ';
  const vramGB = parseInt(vramStr, 10) || 8;
  const gpuScore = gpu ? gpu.score : 50;

  // Real-world resolution scaling based on actual benchmark data
  // 1080p = baseline, 1440p = ~68-75% of 1080p, 4K = ~40-55% of 1080p (VRAM dependent)
  let resMultiplier = 1.0;
  if (state.activeResolution === '1440p') {
    resMultiplier = 0.70;
  } else if (state.activeResolution === '4k') {
    if (vramGB < 8) {
      resMultiplier = 0.28; // Severe VRAM bottleneck at 4K
    } else if (vramGB < 12) {
      resMultiplier = 0.36; // 8GB tight at 4K Ultra
    } else if (vramGB >= 24) {
      resMultiplier = 0.52; // 24GB+ high bandwidth
    } else {
      resMultiplier = 0.44;
    }
  }
  
  // RAM impact: single-channel or low capacity hurts FPS
  const ram = state.selected.ram;
  let ramPenalty = 1.0;
  if (ram) {
    const ramCap = parseInt(ram.capacity, 10) || 16;
    if (ramCap <= 8) ramPenalty = 0.88; // Single stick 8GB — stutters, less bandwidth
    else if (ramCap <= 16) ramPenalty = 0.97;
  } else {
    ramPenalty = 0.85; // No RAM selected
  }

  let totalFpsSum = 0;

  PC_DATA.games.forEach(game => {
    // Realistic FPS formula:
    // - GPU determines the base rendering performance (weighted by game type)
    // - CPU determines the frame scheduling and simulation (weighted by game type)
    // - Games have different CPU/GPU dependency ratios
    const gpuFps = game.baseFps * gpuMultiplier * game.gpuWeight;
    const cpuFps = game.baseFps * (cpuScore / 72) * game.cpuWeight;
    const rawFps = gpuFps + cpuFps;
    
    // Apply resolution, RAM, and clamp to realistic floor
    const finalFps = Math.max(18, Math.round(rawFps * resMultiplier * ramPenalty));
    totalFpsSum += finalFps;

    // 1% Low FPS — reflects frame pacing, micro-stutters, driver overhead
    // Real-world 1% lows are typically 60-78% of average depending on game engine
    const lowFpsRatio = game.lowFpsRatio || 0.72;
    const cpuStabilityBonus = Math.min(1.08, Math.max(0.82, cpuScore / 82));
    // RAM penalty hits 1% lows harder (memory bandwidth bottleneck)
    const lowRamFactor = ramPenalty < 0.95 ? ramPenalty * 0.95 : 1.0;
    const finalLowFps = Math.max(12, Math.min(finalFps - 4, Math.round(finalFps * lowFpsRatio * cpuStabilityBonus * lowRamFactor)));

    const barWidthPercent = Math.min(100, Math.round((finalFps / 300) * 100));

    let fpsColor = 'var(--neon-green)';
    if (finalFps < 30) fpsColor = 'var(--neon-red, #ef4444)';
    else if (finalFps < 60) fpsColor = 'var(--neon-amber)';
    else if (finalFps >= 240) fpsColor = '#a855f7';
    else if (finalFps >= 144) fpsColor = 'var(--neon-cyan)';

    // FPS verdict label
    let fpsVerdict = '';
    if (finalFps < 30) fpsVerdict = 'Слайдшоу';
    else if (finalFps < 60) fpsVerdict = 'Играбельно';
    else if (finalFps < 100) fpsVerdict = 'Плавно';
    else if (finalFps < 144) fpsVerdict = 'Отлично';
    else if (finalFps < 240) fpsVerdict = 'Киберспорт';
    else fpsVerdict = 'Ультра';

    const item = document.createElement('div');
    item.className = 'fps-game-item';
    item.innerHTML = `
      <div class="fps-game-info">
        <div class="fps-game-title-wrap">
          <div class="fps-game-name">${game.name}</div>
          <div class="fps-game-preset">${game.preset || game.genre}</div>
        </div>
        <div class="fps-numbers-wrap">
          <div class="fps-number-badge" style="color: ${fpsColor};">
            ~${finalFps} <span style="font-size: 0.65rem; color: #94a3b8;">AVG</span>
            <span style="font-size: 0.55rem; margin-left: 4px; color: ${fpsColor}; opacity: 0.7;">${fpsVerdict}</span>
          </div>
          <div class="fps-low-badge">
            1% Low: <span style="color: #cbd5e1; font-weight: 700;">${finalLowFps} FPS</span>
          </div>
        </div>
      </div>
      <div class="fps-bar-container">
        <div class="fps-bar-indicator" style="width: ${barWidthPercent}%; background: ${fpsColor};"></div>
      </div>
    `;
    container.appendChild(item);
  });

  // System Balance & Bottleneck Analyzer
  updateBottleneckAnalyzer(cpuScore, gpuScore);

  // Recommended Display
  updateDisplayRecommendation(totalFpsSum / PC_DATA.games.length);
}

function updateBottleneckAnalyzer(cpuScore, gpuScore) {
  const pctEl = document.getElementById('bottleneckPct');
  const fillEl = document.getElementById('bottleneckFill');
  const descEl = document.getElementById('bottleneckDesc');
  if (!pctEl || !fillEl || !descEl) return;

  const lang = state.currentLang || 'uz';
  const res = state.activeResolution || '1080p';

  // In 1080p, CPU needs to keep up with GPU; in 4K GPU is 95% of load
  let scoreDiff = gpuScore - cpuScore;
  if (res === '1440p') scoreDiff *= 0.65;
  if (res === '4k') scoreDiff *= 0.35;

  let balance = 100 - Math.min(30, Math.round(Math.abs(scoreDiff) * 0.45));
  balance = Math.max(70, Math.min(99, balance));

  fillEl.style.width = `${balance}%`;

  if (scoreDiff > 25) {
    pctEl.textContent = `${balance}% (CPU Bottleneck)`;
    pctEl.style.color = 'var(--neon-amber)';
    fillEl.style.background = 'linear-gradient(90deg, #ffaa00, #ff5500)';
    if (lang === 'uz') {
      descEl.textContent = `Protsessor ushbu ruxsatda videokartaning to'liq kuchini cheklab qo'yishi mumkin. 2K/4K ruxsatga o'tish yoki kuchliroq CPU tavsiya etiladi.`;
    } else if (lang === 'en') {
      descEl.textContent = `CPU bottleneck detected at this resolution. Upgrading to 1440p/4K or choosing a faster CPU will unlock full GPU potential.`;
    } else {
      descEl.textContent = `Видеокарта ограничена процессором в этом разрешении. Рекомендуется играть в 1440p/4K или выбрать CPU мощнее для 100% отдачи.`;
    }
  } else if (scoreDiff < -22) {
    pctEl.textContent = `${balance}% (GPU Limited)`;
    pctEl.style.color = '#38bdf8';
    fillEl.style.background = 'linear-gradient(90deg, #00f3ff, #3b82f6)';
    if (lang === 'uz') {
      descEl.textContent = `Videokarta 100% yuklanadi. Protsessor kelajakda yanada kuchliroq GPU o'rnatish uchun yaxshi zaxiraga ega.`;
    } else if (lang === 'en') {
      descEl.textContent = `GPU operates at 100% capacity. The CPU has ample headroom for future high-end GPU upgrades.`;
    } else {
      descEl.textContent = `Видеокарта загружена на 100%. Процессор имеет солидный запас мощности для будущих апгрейдов видеокарты.`;
    }
  } else {
    pctEl.textContent = `${balance}% (Идеально)`;
    pctEl.style.color = 'var(--neon-green)';
    fillEl.style.background = 'linear-gradient(90deg, #00ff66, #00f3ff)';
    if (lang === 'uz') {
      descEl.textContent = `Ajoyib muvozanat! Protsessor va videokarta bir-biriga mukammal mos keladi, yo'qotishlarsiz ishlaydi.`;
    } else if (lang === 'en') {
      descEl.textContent = `Optimal system balance! CPU and GPU are matched harmoniously with no noticeable bottlenecks.`;
    } else {
      descEl.textContent = `Идеальный баланс! Процессор и видеокарта согласованы гармонично, работают на полную мощность.`;
    }
  }
}

function updateDisplayRecommendation(avgFps) {
  const recEl = document.getElementById('displayRecValue');
  if (!recEl) return;

  const res = state.activeResolution || '1080p';
  if (res === '4k' && avgFps >= 60) {
    recEl.textContent = '144 Гц 4K Ultra HD (3840x2160) Fast-IPS / OLED';
  } else if (res === '1440p' || (res === '1080p' && avgFps >= 130)) {
    recEl.textContent = '165-240 Гц 2K QHD (2560x1440) Fast-IPS';
  } else if (avgFps >= 180) {
    recEl.textContent = '240-360 Гц Киберспорт Full HD (1920x1080)';
  } else {
    recEl.textContent = '100-144 Гц Full HD (1920x1080) IPS';
  }
}

function updateWorkstationMeter() {
  const container = document.getElementById('workstationContainer');
  if (!container) return;
  container.innerHTML = '';

  const cpu = state.selected.cpu;
  const gpu = state.selected.gpu;
  if (!cpu && !gpu) return;
  
  const cpuScore = cpu ? cpu.score : 55;
  const gpuMultiplier = gpu ? gpu.fpsMultiplier : 0.7;
  const gpuScore = gpu ? gpu.score : 40;
  const cpuCores = cpu ? (parseInt(cpu.cores, 10) || 6) : 6;
  const ramCapacity = state.selected.ram ? (parseInt(state.selected.ram.capacity, 10) || 16) : 16;

  // Cinebench R23 Multi-Core: real-world scores based on actual CPU benchmarks
  // R5 5600 ≈ 10500, i5-12400F ≈ 12300, R7 7800X3D ≈ 15200, i9-14900KS ≈ 40000
  let cinebenchScore;
  if (cpuCores >= 24) {
    cinebenchScore = Math.round(cpuScore * 385 + 2400);
  } else if (cpuCores >= 16) {
    cinebenchScore = Math.round(cpuScore * 340 + 1200);
  } else if (cpuCores >= 8) {
    cinebenchScore = Math.round(cpuScore * 195 + 600);
  } else {
    cinebenchScore = Math.round(cpuScore * 160 + 300);
  }

  // 3DMark Time Spy GPU Score: real-world reference
  // RTX 4060 ≈ 11300, RTX 4070S ≈ 17500, RTX 4090 ≈ 36500, RTX 5090 ≈ 47000
  const timeSpyScore = Math.round(gpuMultiplier * 11300 + gpuScore * 28);

  // 4K 60fps video render time (10 min clip) in DaVinci Resolve / Premiere
  const renderFactor = (gpuMultiplier * 0.65 + (cpuScore / 72) * 0.35);
  const renderSecRaw = Math.max(55, Math.round(480 / renderFactor));
  const renderMins = Math.floor(renderSecRaw / 60);
  const renderSecs = renderSecRaw % 60;
  const renderTimeStr = `~${renderMins} мин ${renderSecs < 10 ? '0' : ''}${renderSecs} сек`;

  // Blender 4.0 Classroom Scene render (OptiX GPU)
  const blenderSecRaw = Math.max(22, Math.round(320 / (gpuMultiplier * 0.82 + (cpuScore / 72) * 0.22)));
  const blenderTimeStr = `~${blenderSecRaw} сек`;

  // Stable Diffusion XL / ComfyUI inference speed
  // RTX 4060 ≈ 4.5 it/s, RTX 4090 ≈ 15 it/s, RTX 5090 ≈ 22 it/s
  const vramGB = gpu ? (parseInt(gpu.vram, 10) || 8) : 8;
  const aiItSec = Math.max(1.2, (gpuMultiplier * 4.8 * (vramGB >= 16 ? 1.12 : 1.0))).toFixed(1);
  
  // RAM bandwidth impact label
  let ramNote = '';
  if (ramCapacity <= 8) ramNote = ' (8 ГБ ОЗУ — узкое место!)';
  else if (ramCapacity >= 64) ramNote = ' (64+ ГБ — полный запас)';

  const benchItems = [
    {
      icon: '🧠',
      title: 'Cinebench R23 Multi-Core',
      sub: `CPU ${cpuCores}-ядер рендеринг` + ramNote,
      score: `${cinebenchScore.toLocaleString()} pts`,
      color: '#38bdf8'
    },
    {
      icon: '🎮',
      title: '3DMark Time Spy Graphics',
      sub: 'DirectX 12 графическая мощь',
      score: `${timeSpyScore.toLocaleString()} pts`,
      color: 'var(--neon-cyan)'
    },
    {
      icon: '🎬',
      title: '4K Видеомонтаж (Premiere/DaVinci)',
      sub: 'Рендеринг 10 мин 4K 60fps',
      score: renderTimeStr,
      color: 'var(--neon-green)'
    },
    {
      icon: '🧊',
      title: '3D Рендеринг (Blender 4.0 Cycles)',
      sub: 'Сцена Classroom GPU OptiX',
      score: blenderTimeStr,
      color: '#f59e0b'
    },
    {
      icon: '⚡',
      title: 'Нейросети & AI (Stable Diffusion XL)',
      sub: `VRAM: ${vramGB} ГБ — генерация изображений`,
      score: `~${aiItSec} it/s`,
      color: '#a855f7'
    }
  ];

  benchItems.forEach(b => {
    const div = document.createElement('div');
    div.className = 'workstation-item';
    div.innerHTML = `
      <div class="workstation-left">
        <div class="workstation-icon">${b.icon}</div>
        <div class="workstation-meta">
          <div class="workstation-title">${b.title}</div>
          <div class="workstation-sub">${b.sub}</div>
        </div>
      </div>
      <div class="workstation-score-badge" style="color: ${b.color};">
        ${b.score}
      </div>
    `;
    container.appendChild(div);
  });
}

function updateThermalForecast() {
  const cpuTempEl = document.getElementById('cpuTempForecast');
  const gpuTempEl = document.getElementById('gpuTempForecast');
  const noiseEl = document.getElementById('noiseLevelForecast');

  const cpu = state.selected.cpu;
  const cooler = state.selected.cooler;
  const gpu = state.selected.gpu;
  
  if (!cpu && !gpu) return;

  // CPU Temperature: based on TDP vs cooler capacity ratio
  // Real-world: R5 5600 (65W) + AK400 ≈ 55°C, i9-14900KS (253W) + 360AIO ≈ 78°C
  const cpuTdp = cpu ? (cpu.tdp || 65) : 65;
  const coolerMaxTdp = cooler ? (cooler.maxTdp || 200) : 150;
  const isAioCooler = cooler && cooler.type && cooler.type.includes('aio');
  const coolerEfficiency = isAioCooler ? 0.85 : 1.0; // AIO is ~15% more efficient
  const delta = (cpuTdp / coolerMaxTdp) * coolerEfficiency;

  // Base ambient 28°C, plus thermal rise based on load ratio
  const estimatedCpuTemp = Math.round(28 + delta * 52);
  if (cpuTempEl) {
    if (estimatedCpuTemp < 55) {
      cpuTempEl.textContent = `~${estimatedCpuTemp}°C (Холодный — запас охлаждения)`;
      cpuTempEl.style.color = '#22c55e';
    } else if (estimatedCpuTemp < 70) {
      cpuTempEl.textContent = `~${estimatedCpuTemp}°C (Норма — комфортный режим)`;
      cpuTempEl.style.color = '#38bdf8';
    } else if (estimatedCpuTemp <= 82) {
      cpuTempEl.textContent = `~${estimatedCpuTemp}°C (Тепловой режим — нагружен)`;
      cpuTempEl.style.color = '#f59e0b';
    } else {
      cpuTempEl.textContent = `~${estimatedCpuTemp}°C (Перегрев! Усильте охлаждение!)`;
      cpuTempEl.style.color = '#ef4444';
    }
  }

  // GPU Temperature: based on TDP tier — bigger GPUs have better coolers
  if (gpuTempEl) {
    if (gpu) {
      const gpuTdp = gpu.tdp || 200;
      let gpuTemp;
      if (gpuTdp <= 150) {
        gpuTemp = 62; // Low-power cards run cool
      } else if (gpuTdp <= 250) {
        gpuTemp = 68; // Mid-range
      } else if (gpuTdp <= 360) {
        gpuTemp = 72; // High-end triple fan
      } else {
        gpuTemp = 78; // Monster cards like 5090 (575W)
      }
      const gpuLabel = gpuTemp <= 65 ? 'Тихий режим' : (gpuTemp <= 72 ? 'Стандарт' : 'Под нагрузкой');
      gpuTempEl.textContent = `~${gpuTemp}°C (${gpuLabel})`;
      gpuTempEl.style.color = gpuTemp <= 70 ? '#22c55e' : (gpuTemp <= 76 ? '#f59e0b' : '#ef4444');
    } else {
      gpuTempEl.textContent = '— (GPU не установлена)';
      gpuTempEl.style.color = '#64748b';
    }
  }

  if (noiseEl) {
    if (isAioCooler) {
      noiseEl.textContent = '~25-28 дБ (Тихая помпа + радиатор)';
    } else if (cooler && coolerMaxTdp >= 250) {
      noiseEl.textContent = '~28-32 дБ (Мощный башенный кулер)';
    } else {
      noiseEl.textContent = '~30-36 дБ (Стандартное охлаждение)';
    }
    noiseEl.style.color = '#38bdf8';
  }
}

function updateMiniSpecSummary() {
  const container = document.getElementById('miniSpecList');
  if (!container) return;
  container.innerHTML = '';

  // Update Top Quick Hardware Badges
  const ramBadge = document.getElementById('badgeRamSummary');
  const vramBadge = document.getElementById('badgeVramSummary');
  const ssdBadge = document.getElementById('badgeSsdSpeed');

  const ram = state.selected.ram;
  const gpu = state.selected.gpu;
  const ssd = state.selected.storage;

  if (ramBadge) {
    ramBadge.textContent = ram ? (ram.capacity || '32 ГБ DDR5') : 'ОЗУ не выбрана';
  }
  if (vramBadge) {
    vramBadge.textContent = gpu ? (gpu.vram || '16 ГБ VRAM') : 'GPU не выбрана';
  }
  if (ssdBadge) {
    const isGen5 = ssd && ssd.id && (ssd.id.includes('gen5') || ssd.id.includes('t700'));
    ssdBadge.textContent = isGen5 ? 'Gen5 12 400 МБ/с' : 'PCIe 4.0 7 450 МБ/с';
  }

  PC_DATA.categories.forEach(cat => {
    const item = state.selected[cat.id];
    const div = document.createElement('div');
    div.className = 'mini-spec-item';
    div.innerHTML = `
      <span class="mini-spec-cat">${cat.name.split(' ')[0]}</span>
      <span class="mini-spec-name" title="${item ? item.name : 'Не выбрано'}">${item ? item.name : '—'}</span>
    `;
    container.appendChild(div);
  });
}

// ==========================================================================
// 11. EVENT LISTENERS SETUP
// ==========================================================================
function setupEventListeners() {
  // Brand Logo click -> Home
  document.getElementById('brandNavHome')?.addEventListener('click', () => switchPage('pageConfigurator'));

  // Main Page Navigation Tabs
  document.getElementById('navTabBuilder')?.addEventListener('click', () => switchPage('pageConfigurator'));
  document.getElementById('navTabCatalog')?.addEventListener('click', () => switchPage('pageCatalog'));
  document.getElementById('navTabSaved')?.addEventListener('click', () => openModal('saveLoadModal'));
  document.getElementById('backToBuilderBtn')?.addEventListener('click', () => switchPage('pageConfigurator'));
  document.getElementById('btnOpenFullCatalog')?.addEventListener('click', () => switchPage('pageCatalog'));

  // Rail Category Buttons - Switches category WITHOUT auto-pinning!
  document.querySelectorAll('.rail-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      setDrawerCategory(cat);
      // On mobile screens only, open drawer temporarily so touch users can browse
      if (window.innerWidth <= 1024) {
        const rail = document.getElementById('catalogDockRail');
        if (rail) rail.classList.add('is-pinned');
      }
    });
  });

  // Pin / Unpin Drawer Toggle Buttons - ONLY pinned when user explicitly clicks!
  const togglePin = () => {
    state.isDrawerPinned = !state.isDrawerPinned;
    const rail = document.getElementById('catalogDockRail');
    const pinBtn = document.getElementById('pinDrawerBtn');
    const drawerPin = document.getElementById('drawerPinToggle');
    if (rail) rail.classList.toggle('is-pinned', state.isDrawerPinned);
    if (pinBtn) pinBtn.classList.toggle('pinned', state.isDrawerPinned);
    if (drawerPin) drawerPin.classList.toggle('pinned', state.isDrawerPinned);
    CyberSound.playSelect();
    const lang = state.currentLang || 'uz';
    const msg = state.isDrawerPinned
      ? (lang === 'uz' ? 'Katalog qadaldi (doimiy ochiq)' : (lang === 'en' ? 'Catalog pinned open' : 'Каталог закреплен открытым'))
      : (lang === 'uz' ? 'Katalog qadami yechildi (avto-yopiladi)' : (lang === 'en' ? 'Catalog unpinned (auto-closes)' : 'Каталог откреплен (скрывается при отведении)'));
    showToast(msg);
  };
  document.getElementById('pinDrawerBtn')?.addEventListener('click', togglePin);
  document.getElementById('drawerPinToggle')?.addEventListener('click', togglePin);

  // Close drawer on mobile
  document.getElementById('drawerCloseMobileBtn')?.addEventListener('click', () => {
    state.isDrawerPinned = false;
    const rail = document.getElementById('catalogDockRail');
    if (rail) rail.classList.remove('is-pinned');
    const pinBtn = document.getElementById('pinDrawerBtn');
    if (pinBtn) pinBtn.classList.remove('pinned');
    const drawerPin = document.getElementById('drawerPinToggle');
    if (drawerPin) drawerPin.classList.remove('pinned');
    CyberSound.playSelect();
  });

  // Drawer Search Input
  const drawerInput = document.getElementById('drawerSearchInput');
  const clearDrawerBtn = document.getElementById('clearDrawerSearch');
  drawerInput?.addEventListener('input', (e) => {
    state.drawerSearch = e.target.value;
    if (clearDrawerBtn) clearDrawerBtn.style.display = state.drawerSearch ? 'block' : 'none';
    renderDrawerItems();
  });
  clearDrawerBtn?.addEventListener('click', () => {
    if (drawerInput) drawerInput.value = '';
    state.drawerSearch = '';
    clearDrawerBtn.style.display = 'none';
    renderDrawerItems();
  });

  // Full Catalog Page Search Input
  const catalogInput = document.getElementById('catalogFullSearchInput');
  const clearCatalogBtn = document.getElementById('clearCatalogSearch');
  catalogInput?.addEventListener('input', (e) => {
    state.catalogSearch = e.target.value;
    if (clearCatalogBtn) clearCatalogBtn.style.display = state.catalogSearch ? 'block' : 'none';
    renderFullCatalog();
  });
  clearCatalogBtn?.addEventListener('click', () => {
    if (catalogInput) catalogInput.value = '';
    state.catalogSearch = '';
    clearCatalogBtn.style.display = 'none';
    renderFullCatalog();
  });

  // Full Catalog Category Tabs
  document.querySelectorAll('.cat-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.catalogCat = btn.dataset.category;
      renderFullCatalog();
      CyberSound.playSelect();
    });
  });

  // Full Catalog Sorting Selector
  document.getElementById('catalogSortSelect')?.addEventListener('change', (e) => {
    state.catalogSort = e.target.value;
    renderFullCatalog();
  });

  // Language Switcher Dropdown (UZ / RU / EN)
  const langTriggerBtn = document.getElementById('langTriggerBtn');
  const langContainer = document.getElementById('langDropdownContainer');
  const langMenu = document.getElementById('langDropdownMenu');

  if (langTriggerBtn && langContainer) {
    langTriggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langContainer.classList.toggle('open');
      langTriggerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) CyberSound.playSelect();
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!langContainer.contains(e.target)) {
        langContainer.classList.remove('open');
        langTriggerBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && langContainer.classList.contains('open')) {
        langContainer.classList.remove('open');
        langTriggerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('.lang-option-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = e.currentTarget.dataset.lang;
      setLanguage(lang);
      if (langContainer) langContainer.classList.remove('open');
      if (langTriggerBtn) langTriggerBtn.setAttribute('aria-expanded', 'false');
      CyberSound.playSelect();
      const langName = lang === 'uz' ? "O'zbek tili tanlandi" : (lang === 'en' ? 'English language selected' : 'Выбран русский язык');
      showToast(langName);
    });
  });

  // Currency Switcher (UZS / USD / RUB)
  document.querySelectorAll('.btn-curr').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const curr = e.currentTarget.dataset.curr;
      setCurrency(curr);
    });
  });

  // Studio White / Cyber Dark Light Theme Toggle
  document.getElementById('toggleStudioThemeBtn')?.addEventListener('click', (e) => {
    state.studioTheme = state.studioTheme === 'white' ? 'dark' : 'white';
    const isWhite = state.studioTheme === 'white';

    if (state.viewer3D) {
      state.viewer3D.setStudioTheme(state.studioTheme);
    }

    const icon = document.getElementById('studioThemeIcon');
    const label = document.getElementById('studioThemeLabel');
    const wrapper = document.getElementById('canvas3dContainer');

    if (icon) icon.textContent = isWhite ? '☀️' : '🌙';
    if (label) label.textContent = isWhite ? 'Белая Студия' : 'Кибер Тьма';
    if (wrapper) wrapper.style.background = isWhite ? '#f1f5f9' : '#07090f';

    CyberSound.playSelect();
    showToast(`Освещение: ${isWhite ? 'Светлая студия (Белый фон)' : 'Тёмный киберпанк'}`);
  });

  // 3D Controls
  document.getElementById('toggleGlassBtn')?.addEventListener('click', () => {
    if (state.viewer3D) {
      const isOpen = !state.viewer3D.isGlassOpen;
      state.viewer3D.isGlassOpen = isOpen;
      state.viewer3D.updateGlassPosition(isOpen);
      document.getElementById('toggleGlassBtn')?.classList.toggle('open-active', isOpen);
      CyberSound.playSelect();
      showToast(isOpen ? 'Боковое стекло снято' : 'Стекло установлено на корпус');
    }
  });

  document.getElementById('applyPasteBtn')?.addEventListener('click', () => {
    if (state.viewer3D) {
      CyberSound.playPasteSound();
      state.viewer3D.applyThermalPaste(() => {
        showToast('Термопаста нанесена ровным слоем');
      });
    }
  });

  document.getElementById('powerOnBtn')?.addEventListener('click', () => {
    if (state.viewer3D) {
      const isPower = !state.viewer3D.isPoweredOn;
      state.viewer3D.togglePower(isPower);
      document.getElementById('powerOnBtn')?.classList.toggle('powered-on', isPower);
      if (isPower) {
        CyberSound.playRelayClick();
        setTimeout(() => CyberSound.playBiosBeep(), 400);
        showToast('ПК ВКЛЮЧЕН: Кулеры и RGB подсветка активны');
      } else {
        CyberSound.playRelayClick();
        showToast('ПК ВЫКЛЮЧЕН');
      }
    }
  });

  document.getElementById('toggleRotateBtn')?.addEventListener('click', (e) => {
    if (state.viewer3D) {
      const isRot = !state.viewer3D.isAutoRotate;
      state.viewer3D.toggleAutoRotate(isRot);
      e.currentTarget.classList.toggle('active', isRot);
      showToast(isRot ? 'Круговое вращение: ВКЛ' : 'Вращение: ВЫКЛ');
    }
  });

  // Interactive Hardware Part Disassembly & Assembly Toggle Buttons
  document.querySelectorAll('.btn-part-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const part = btn.dataset.part;
      if (!state.viewer3D) return;

      const isInstalled = state.viewer3D.toggleComponent(part);
      btn.classList.toggle('installed', isInstalled);
      btn.classList.toggle('uninstalled', !isInstalled);

      // If motherboard was toggled, update daughter buttons to reflect current viewer state
      if (part === 'motherboard') {
        document.querySelectorAll('.btn-part-toggle').forEach(otherBtn => {
          const otherPart = otherBtn.dataset.part;
          if (['cpu', 'cooler', 'ram', 'gpu', 'ssd', 'cables'].includes(otherPart)) {
            const isChildVisible = isInstalled ? (state.viewer3D.installed[otherPart] !== false) : false;
            otherBtn.classList.toggle('installed', isChildVisible);
            otherBtn.classList.toggle('uninstalled', !isChildVisible);
          }
        });
      }

      const lang = state.currentLang || 'uz';
      const partName = btn.querySelector('.part-name')?.textContent || part;

      if (part === 'gpu' || part === 'ram') {
        CyberSound.playRamClickSound();
      } else if (part === 'cooler' || part === 'motherboard' || part === 'cpu') {
        CyberSound.playScrewSound();
      } else {
        CyberSound.playRelayClick();
      }

      const msg = isInstalled
        ? (lang === 'uz' ? `${partName} korpusga o‘rnatildi!` : (lang === 'en' ? `${partName} installed into PC!` : `${partName} установлена в корпус!`))
        : (lang === 'uz' ? `${partName} butunlay yechildi!` : (lang === 'en' ? `${partName} completely removed!` : `${partName} снята из корпуса!`));
      showToast(msg);
    });
  });

  document.getElementById('cameraSelect')?.addEventListener('change', (e) => {
    if (state.viewer3D) {
      state.viewer3D.setCameraView(e.target.value);
      CyberSound.playSelect();
    }
  });

  // Fullscreen 3D Stage
  const toggleFullscreen = (forceExit = false) => {
    const stage = document.getElementById('hero3dStage');
    if (!stage) return;
    const isFull = stage.classList.contains('fullscreen-active');

    if (!isFull && !forceExit) {
      stage.classList.add('fullscreen-active');
      if (stage.requestFullscreen) stage.requestFullscreen().catch(() => {});
      showToast('Полноэкранный 3D режим [ESC для выхода]');
    } else {
      stage.classList.remove('fullscreen-active');
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }

    if (state.viewer3D) {
      setTimeout(() => state.viewer3D.onWindowResize(), 80);
    }
  };

  document.getElementById('toggleFullscreenBtn')?.addEventListener('click', () => toggleFullscreen());
  document.getElementById('exitFullscreenBtn')?.addEventListener('click', () => toggleFullscreen(true));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const stage = document.getElementById('hero3dStage');
      if (stage && stage.classList.contains('fullscreen-active')) toggleFullscreen(true);
    }
  });

  // Assembly Step Action Button
  document.getElementById('assemblyStepActionBtn')?.addEventListener('click', executeAssemblyStep);

  // RGB Swatches: Changes ONLY inside the 3D PC (fans, RAM, cooler, GPU, chassis)
  document.querySelectorAll('.rgb-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.rgb-color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const color = btn.dataset.color;
      state.activeRgbTheme = color;
      // Do not alter whole website theme - RGB is isolated to 3D PC
      if (state.viewer3D) state.viewer3D.setRgbTheme(color);
      CyberSound.playSelect();
      showToast(`RGB подсветка ПК: ${getRussianColorName(color)}`);
    });
  });

  // Forecast Tabs (Gaming FPS vs Workstation & Benchmarks)
  const tabGamingBtn = document.getElementById('btnTabGaming');
  const tabWorkstationBtn = document.getElementById('btnTabWorkstation');
  const gamingView = document.getElementById('forecastGamingView');
  const workstationView = document.getElementById('forecastWorkstationView');

  tabGamingBtn?.addEventListener('click', () => {
    tabGamingBtn.classList.add('active');
    tabWorkstationBtn?.classList.remove('active');
    if (gamingView) gamingView.style.display = 'flex';
    if (workstationView) workstationView.style.display = 'none';
    CyberSound.playSelect();
  });

  tabWorkstationBtn?.addEventListener('click', () => {
    tabWorkstationBtn.classList.add('active');
    tabGamingBtn?.classList.remove('active');
    if (gamingView) gamingView.style.display = 'none';
    if (workstationView) workstationView.style.display = 'flex';
    CyberSound.playSelect();
    updateWorkstationMeter();
    updateThermalForecast();
  });

  // Resolution pills
  document.querySelectorAll('.res-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.res-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeResolution = btn.dataset.res;
      CyberSound.playSelect();
      updateFpsMeter();
    });
  });

  // Sound FX Toggle
  document.getElementById('soundToggleBtn')?.addEventListener('click', (e) => {
    state.soundEnabled = !state.soundEnabled;
    const btn = document.getElementById('soundToggleBtn');
    if (btn) btn.classList.toggle('active', state.soundEnabled);
    const soundText = document.getElementById('soundLabelText');
    const lang = state.currentLang || 'uz';
    if (soundText) {
      if (lang === 'uz') soundText.textContent = state.soundEnabled ? 'OVOZ: ON' : 'OVOZ: OFF';
      else if (lang === 'en') soundText.textContent = state.soundEnabled ? 'SOUND: ON' : 'SOUND: OFF';
      else soundText.textContent = state.soundEnabled ? 'ЗВУК: ВКЛ' : 'ЗВУК: ВЫКЛ';
    }
    if (state.soundEnabled) CyberSound.playSelect();
    const toastMsg = state.soundEnabled
      ? (lang === 'uz' ? 'Ovoz effektlari: YOQILDI' : (lang === 'en' ? 'Sound FX: ON' : 'Звуковые эффекты: ВКЛ'))
      : (lang === 'uz' ? 'Ovoz effektlari: O‘CHIRILDI' : (lang === 'en' ? 'Sound FX: OFF' : 'Звуковые эффекты: ВЫКЛ'));
    showToast(toastMsg);
  });

  // Presets
  document.getElementById('presetBudgetBtn')?.addEventListener('click', () => applyPreset(PC_DATA.presets.budget));
  document.getElementById('presetOptimalBtn')?.addEventListener('click', () => applyPreset(PC_DATA.presets.optimal));
  document.getElementById('presetPrestigeBtn')?.addEventListener('click', () => applyPreset(PC_DATA.presets.prestige));

  // Reset build from scratch ("С чистого листа / Собрать самому")
  // User explicitly requested: "измени кнопку с чистого листа чтобы она все уберала кроме корпуса тоесть компплектующе"
  document.getElementById('resetBuildBtn')?.addEventListener('click', () => {
    CyberSound.playWarning();
    const currentCase = state.selected.case || PC_DATA.components.case[0];

    // Remove all internal components except the chassis
    Object.keys(state.selected).forEach(k => {
      state.selected[k] = null;
    });
    state.selected.case = currentCase;

    // Direct 3D scene clear: removes motherboard, CPU, cooler, RAM, GPU, SSD, cables
    if (state.viewer3D) {
      if (state.viewer3D.clearAllComponents) {
        state.viewer3D.clearAllComponents();
        state.viewer3D.buildCase(currentCase.id);
      } else {
        sync3DWithState();
      }
    }

    updateUI();
    renderDrawerItems();
    renderFullCatalog();
    state.assemblyStep = 0;
    updateAssemblyStepUI();

    const lang = state.currentLang || 'uz';
    const msg = lang === 'uz'
      ? 'Barcha ichki qismlar olib tashlandi! Faqat korpus qoldi.'
      : (lang === 'en' ? 'All internal components removed! Only the chassis remains.' : 'Все комплектующие убраны! В сборке остался только корпус.');
    showToast(msg);
  });

  // Save / Load Modal Triggers
  document.getElementById('openSaveModalBtn')?.addEventListener('click', () => openModal('saveLoadModal'));
  document.getElementById('quickSaveBtn')?.addEventListener('click', () => openModal('saveLoadModal'));
  document.getElementById('bottomSaveBtn')?.addEventListener('click', () => openModal('saveLoadModal'));

  document.getElementById('saveBuildCommitBtn')?.addEventListener('click', () => {
    const input = document.getElementById('saveBuildNameInput');
    if (input) {
      saveBuildToStorage(input.value);
      input.value = '';
    }
  });

  // Export JSON file
  document.getElementById('exportJsonBuildBtn')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.selected, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `pc_build_${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Файл сборки экспортирован!');
  });

  // Import JSON file
  document.getElementById('importJsonFileInput')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        Object.keys(state.selected).forEach(k => {
          state.selected[k] = parsed[k] || null;
        });
        sync3DWithState();
        updateUI();
        renderDrawerItems();
        renderFullCatalog();
        closeModal('saveLoadModal');
        showToast('Сборка успешно загружена из файла JSON!');
      } catch (err) {
        showToast('Ошибка при чтении файла JSON!');
      }
    };
    reader.readAsText(file);
  });

  // Passport / Export Modal
  document.getElementById('exportModalBtn')?.addEventListener('click', () => {
    const codeBlock = document.getElementById('exportTextContent');
    if (codeBlock) codeBlock.textContent = generateBuildSummaryText();
    openModal('exportModal');
  });

  document.getElementById('copyModalTextBtn')?.addEventListener('click', () => {
    const text = generateBuildSummaryText();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => showToast('Паспорт сборки скопирован!'));
    }
  });

  document.getElementById('copySummaryBtn')?.addEventListener('click', () => {
    const text = generateBuildSummaryText();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => showToast('Список комплектующих скопирован!'));
    }
  });

  document.getElementById('printBuildBtn')?.addEventListener('click', () => window.print());

  // Modal Close buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.closeModal;
      closeModal(modalId);
    });
  });

  document.querySelectorAll('.cyber-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('open');
    });
  });
}

function applyPreset(preset) {
  CyberSound.playPreset();
  initPresets(preset);
  sync3DWithState();
  updateUI();
  renderDrawerItems();
  renderFullCatalog();
  showToast(`Загружен пресет: ${preset.name}`);
}

function generateBuildSummaryText() {
  let total = 0;
  Object.values(state.selected).forEach(comp => {
    if (comp && comp.price) total += comp.price;
  });

  const watts = calculateTotalPowerConsumption();
  const dateStr = new Date().toLocaleDateString('ru-RU');

  let text = `========================================================\n`;
  text += `CYBER-LAB CUSTOM PC — СПЕЦИФИКАЦИЯ СБОРКИ\n`;
  text += `Дата сборки: ${dateStr}\n`;
  text += `========================================================\n\n`;

  PC_DATA.categories.forEach(cat => {
    const item = state.selected[cat.id];
    if (item) {
      text += `[${cat.name.toUpperCase()}]:\n`;
      text += `  • ${item.name}\n`;
      text += `  • Стоимость: ${formatRub(item.price)}\n\n`;
    }
  });

  text += `--------------------------------------------------------\n`;
  text += `РЕАЛЬНЫЕ ХАРАКТЕРИСТИКИ И ПРОГНОЗ ПРОИЗВОДИТЕЛЬНОСТИ:\n`;
  
  const cpu = state.selected.cpu;
  const gpu = state.selected.gpu;
  const cooler = state.selected.cooler;
  const cpuScore = cpu ? cpu.score : 65;
  const gpuMultiplier = gpu ? gpu.fpsMultiplier : 1.0;

  // Cinebench & 3DMark
  const cbScore = Math.round(cpuScore * 390 + (cpu && cpu.cores && cpu.cores.includes('24') ? 2200 : 0));
  const tsScore = Math.round(gpuMultiplier * 12850);
  text += `  • Cinebench R23 (CPU Multi-Core): ~${cbScore.toLocaleString()} pts\n`;
  text += `  • 3DMark Time Spy (GPU DX12): ~${tsScore.toLocaleString()} pts\n`;

  // Render Time
  const rSec = Math.max(75, Math.round(520 / (gpuMultiplier * 0.75 + (cpuScore / 75) * 0.45)));
  text += `  • 4K 60fps Видеомонтаж (10 мин): ~${Math.floor(rSec / 60)} мин ${rSec % 60} сек\n`;

  // Gaming FPS Forecast
  text += `\n[ПРОГНОЗ FPS В ИГРАХ (AVG / 1% LOW)]:\n`;
  PC_DATA.games.forEach(g => {
    const raw1080 = Math.round((g.baseFps * (cpuScore / 75) * g.cpuWeight) + (g.baseFps * gpuMultiplier * g.gpuWeight));
    const low1080 = Math.round(raw1080 * (g.lowFpsRatio || 0.72));
    const raw1440 = Math.round(raw1080 * 0.72);
    text += `  • ${g.name} (${g.preset || g.genre}):\n`;
    text += `    - 1080p: ~${raw1080} FPS (1% Low: ~${low1080} FPS)\n`;
    text += `    - 2K QHD: ~${raw1440} FPS\n`;
  });

  // Thermals & Noise
  const cpuTdp = cpu ? (cpu.tdp || 65) : 65;
  const coolerTdp = cooler ? (cooler.maxTdp || 200) : 180;
  const estCpuTemp = Math.round(44 + (cpuTdp / coolerTdp) * 36);
  text += `\n[ТЕМПЕРАТУРА И АКУСТИКА ПОД НАГРУЗКОЙ]:\n`;
  text += `  • CPU Стресс-тест: ~${estCpuTemp}°C\n`;
  text += `  • GPU Полная нагрузка: ~62-66°C\n`;
  text += `  • Уровень акустического шума: ~28-32 дБ (Тихий шелест)\n`;

  text += `--------------------------------------------------------\n`;
  text += `ЭНЕРГОПОТРЕБЛЕНИЕ СИСТЕМЫ: ~${watts} Вт (TDP)\n`;
  text += `ИТОГОВАЯ СТОИМОСТЬ: ${formatRub(total)}\n`;
  text += `========================================================\n`;
  return text;
}

// ==========================================================================
// 12. USER SUPPORT & OWNER COMPLAINTS PORTAL SYSTEM
// ==========================================================================
const SUPPORT_STORAGE_KEY = 'cyberpc_support_tickets';
const OWNER_AUTH_KEY = 'cyberpc_owner_auth';

const DEFAULT_SUPPORT_TICKETS = [
  {
    id: 'ticket_demo_1',
    date: '2026-11-05 14:22',
    timestamp: 1730802120000,
    name: 'Алишер Каримов',
    contact: '+998 90 987-65-43 (@alisher_it)',
    category: 'compat',
    categoryName: 'Совместимость',
    message: 'Здравствуйте! Хватит ли кулера DeepCool AK620 Digital для охлаждения Core i7-13700KF при рендере в Blender? Или лучше взять Arctic Liquid Freezer III 360?',
    specs: 'CPU: Intel Core i7-13700KF\nCooler: DeepCool AK620 Digital\nMotherboard: ASUS TUF GAMING B760-PLUS\nRAM: 32GB DDR5-6000\nGPU: RTX 4070 Ti SUPER',
    status: 'new'
  },
  {
    id: 'ticket_demo_2',
    date: '2026-11-06 10:15',
    timestamp: 1730873700000,
    name: 'Даврон',
    contact: '@davron_pc',
    category: 'suggest',
    categoryName: 'Предложение деталей',
    message: 'Очень крутой 3D конфигуратор! Добавьте, пожалуйста, корпус Lian Li O11 Vision и новые материнки на Z890 для Intel Core Ultra 200S.',
    specs: null,
    status: 'in_progress'
  }
];

function initSupportAndOwnerSystem() {
  loadSupportTickets();
  checkOwnerAuthStatus();
  setupSupportAndOwnerListeners();
}

function loadSupportTickets() {
  try {
    const raw = localStorage.getItem(SUPPORT_STORAGE_KEY);
    if (raw) {
      state.supportTickets = JSON.parse(raw);
    } else {
      state.supportTickets = [...DEFAULT_SUPPORT_TICKETS];
      saveSupportTickets();
    }
  } catch (e) {
    state.supportTickets = [...DEFAULT_SUPPORT_TICKETS];
  }
}

function saveSupportTickets() {
  try {
    localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(state.supportTickets));
  } catch (e) {}
}

function checkOwnerAuthStatus() {
  try {
    state.isOwner = localStorage.getItem(OWNER_AUTH_KEY) === 'true';
  } catch (e) {
    state.isOwner = false;
  }
  const badgeBtn = document.getElementById('ownerPortalBtn');
  if (badgeBtn) {
    badgeBtn.style.display = state.isOwner ? 'inline-flex' : 'none';
  }
}

function renderOwnerTickets(filter = null) {
  if (filter) state.ownerTicketFilter = filter;
  const currentFilter = state.ownerTicketFilter || 'all';

  const container = document.getElementById('ownerTicketsContainer');
  if (!container) return;
  container.innerHTML = '';

  updateOwnerStats();

  let tickets = [...state.supportTickets];
  if (currentFilter === 'new') {
    tickets = tickets.filter(t => t.status === 'new');
  } else if (currentFilter === 'resolved') {
    tickets = tickets.filter(t => t.status === 'resolved');
  }

  // Sort descending (newest first)
  tickets.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  if (tickets.length === 0) {
    container.innerHTML = `
      <div style="padding: 40px 20px; text-align: center; color: #64748b; font-family: var(--font-display);">
        ${currentFilter === 'all' ? 'Обращений пока нет.' : (currentFilter === 'new' ? 'Нет новых нерешённых обращений 👍' : 'Нет решённых обращений.')}
      </div>
    `;
    return;
  }

  tickets.forEach(ticket => {
    const card = document.createElement('div');
    card.className = `ticket-card ${ticket.status === 'new' ? 'unread' : ''}`;

    let statusPill = '';
    if (ticket.status === 'new') {
      statusPill = '<span class="ticket-status-pill status-new">● Новый</span>';
    } else if (ticket.status === 'in_progress') {
      statusPill = '<span class="ticket-status-pill status-in-progress">⏳ В обработке</span>';
    } else {
      statusPill = '<span class="ticket-status-pill status-resolved">✔ Решено</span>';
    }

    const catLabels = {
      issue: '⚠️ Ошибка в конфигураторе',
      compat: '🔍 Вопрос по совместимости',
      order: '📦 Заказ / Стоимость',
      suggest: '💡 Предложение деталей',
      other: '💬 Другое обращение'
    };
    const catText = catLabels[ticket.category] || ticket.categoryName || 'Обращение';

    card.innerHTML = `
      <div class="ticket-top-row">
        <span class="ticket-author">👤 ${escapeHtml(ticket.name)}</span>
        <span class="ticket-date">🕒 ${escapeHtml(ticket.date || '')}</span>
      </div>
      <div class="ticket-contact">
        📞 Связь: <b>${escapeHtml(ticket.contact)}</b>
      </div>
      <div style="margin: 6px 0;">
        <span class="ticket-cat-tag">${catText}</span>
        ${statusPill}
      </div>
      <div class="ticket-message">
        ${escapeHtml(ticket.message)}
      </div>
      ${ticket.specs ? `
        <div style="margin-top: 8px;">
          <button type="button" class="btn-micro-action btn-toggle-specs" style="font-size:0.7rem; color:var(--neon-cyan);">📋 Показать/скрыть спецификацию ПК</button>
          <pre class="ticket-specs-block" style="display:none; margin-top:6px;">${escapeHtml(ticket.specs)}</pre>
        </div>
      ` : ''}
      <div class="ticket-actions-bar">
        ${ticket.status !== 'resolved' ? `
          <button type="button" class="btn-ticket-act btn-resolve" data-action="resolve" data-id="${ticket.id}">
            ✔ Отметить решённым
          </button>
        ` : `
          <button type="button" class="btn-ticket-act" data-action="new" data-id="${ticket.id}" style="color:#94a3b8; border-color:#475569;">
            ↩ Вернуть в новые
          </button>
        `}
        ${ticket.status !== 'in_progress' && ticket.status !== 'resolved' ? `
          <button type="button" class="btn-ticket-act" data-action="in_progress" data-id="${ticket.id}" style="color:#f59e0b; border-color:rgba(245,158,11,0.4);">
            ⏳ В обработку
          </button>
        ` : ''}
        <button type="button" class="btn-ticket-act btn-delete-ticket" data-action="delete" data-id="${ticket.id}">
          🗑️ Удалить
        </button>
      </div>
    `;

    // Toggle specs visibility
    const specsBtn = card.querySelector('.btn-toggle-specs');
    const specsPre = card.querySelector('.ticket-specs-block');
    if (specsBtn && specsPre) {
      specsBtn.addEventListener('click', () => {
        const isHidden = specsPre.style.display === 'none';
        specsPre.style.display = isHidden ? 'block' : 'none';
        specsBtn.textContent = isHidden ? '✕ Скрыть спецификацию ПК' : '📋 Показать/скрыть спецификацию ПК';
      });
    }

    // Action buttons
    card.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const ticketId = btn.dataset.id;
        if (action === 'resolve') {
          updateTicketStatus(ticketId, 'resolved');
        } else if (action === 'new') {
          updateTicketStatus(ticketId, 'new');
        } else if (action === 'in_progress') {
          updateTicketStatus(ticketId, 'in_progress');
        } else if (action === 'delete') {
          deleteTicket(ticketId);
        }
      });
    });

    container.appendChild(card);
  });
}

function updateOwnerStats() {
  const total = state.supportTickets.length;
  const newCount = state.supportTickets.filter(t => t.status === 'new').length;
  const resolvedCount = state.supportTickets.filter(t => t.status === 'resolved').length;

  const totalEl = document.getElementById('statTotalTickets');
  if (totalEl) totalEl.textContent = total;
  const newEl = document.getElementById('statNewTickets');
  if (newEl) newEl.textContent = newCount;
  const resEl = document.getElementById('statResolvedTickets');
  if (resEl) resEl.textContent = resolvedCount;
}

function updateTicketStatus(ticketId, newStatus) {
  const ticket = state.supportTickets.find(t => t.id === ticketId);
  if (!ticket) return;
  ticket.status = newStatus;
  saveSupportTickets();
  renderOwnerTickets();
  CyberSound.playSelect();
  showToast(newStatus === 'resolved' ? 'Обращение помечено как решённое!' : 'Статус обращения обновлен.');
}

function deleteTicket(ticketId) {
  state.supportTickets = state.supportTickets.filter(t => t.id !== ticketId);
  saveSupportTickets();
  renderOwnerTickets();
  CyberSound.playRelayClick();
  showToast('Обращение удалено из списка.');
}

function exportSupportTickets() {
  if (state.supportTickets.length === 0) {
    showToast('Список обращений пуст.');
    return;
  }
  let report = `========================================================\n`;
  report += `CYBER-LAB: ОТЧЕТ ПО ОБРАЩЕНИЯМ КЛИЕНТОВ (ВЛАДЕЛЕЦ)\n`;
  report += `Дата выгрузки: ${new Date().toLocaleString()}\n`;
  report += `Всего обращений: ${state.supportTickets.length}\n`;
  report += `========================================================\n\n`;

  state.supportTickets.forEach((t, idx) => {
    report += `[#${idx + 1}] ДАТА: ${t.date} | СТАТУС: ${t.status.toUpperCase()}\n`;
    report += `ИМЯ: ${t.name} | СВЯЗЬ: ${t.contact}\n`;
    report += `КАТЕГОРИЯ: ${t.category}\n`;
    report += `СООБЩЕНИЕ:\n${t.message}\n`;
    if (t.specs) {
      report += `ПРИКРЕПЛЕННАЯ СБОРКА:\n${t.specs}\n`;
    }
    report += `--------------------------------------------------------\n\n`;
  });

  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cyberlab_support_tickets_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Список обращений экспортирован в TXT файл!');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setupSupportAndOwnerListeners() {
  // Support Button in Header
  document.getElementById('navTabSupport')?.addEventListener('click', () => {
    openModal('supportModal');
  });

  // Support Button in Bottom Utility Bar (User requested: "Cделай поддержку где то снизу")
  document.getElementById('bottomSupportBtn')?.addEventListener('click', () => {
    openModal('supportModal');
  });

  // Owner Badge Button in Header
  document.getElementById('ownerPortalBtn')?.addEventListener('click', () => {
    renderOwnerTickets();
    openModal('ownerDashboardModal');
  });

  // Open Owner Login from Support Modal Footer
  document.getElementById('openOwnerLoginBtn')?.addEventListener('click', () => {
    closeModal('supportModal');
    openModal('ownerLoginModal');
  });

  // Submit Support Ticket Form
  document.getElementById('supportTicketForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('supportUserName');
    const contactInput = document.getElementById('supportUserContact');
    const catInput = document.getElementById('supportCategory');
    const msgInput = document.getElementById('supportMessage');
    const attachCheck = document.getElementById('supportAttachSpecs');

    const name = nameInput ? nameInput.value.trim() : '';
    const contact = contactInput ? contactInput.value.trim() : '';
    const category = catInput ? catInput.value : 'issue';
    const message = msgInput ? msgInput.value.trim() : '';
    const attachSpecs = attachCheck ? attachCheck.checked : false;

    if (!name || !contact || !message) {
      showToast('Пожалуйста, заполните все обязательные поля!');
      return;
    }

    const now = new Date();
    const dateFormatted = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    let specsSummary = null;
    if (attachSpecs) {
      specsSummary = generateBuildSummaryText();
    }

    const newTicket = {
      id: 'ticket_' + Date.now(),
      date: dateFormatted,
      timestamp: Date.now(),
      name,
      contact,
      category,
      message,
      specs: specsSummary,
      status: 'new'
    };

    state.supportTickets.unshift(newTicket);
    saveSupportTickets();

    // Reset inputs
    if (nameInput) nameInput.value = '';
    if (contactInput) contactInput.value = '';
    if (msgInput) msgInput.value = '';

    closeModal('supportModal');
    CyberSound.playSelect();

    const lang = state.currentLang || 'uz';
    const successMsg = lang === 'uz'
      ? 'Murojaatingiz qabul qilindi! Tez orada mutaxassisimiz siz bilan bog‘lanadi.'
      : (lang === 'en'
        ? 'Support ticket submitted! Our specialist will contact you shortly.'
        : 'Обращение в поддержку успешно отправлено! Мы свяжемся с вами в ближайшее время.');
    showToast(successMsg);

    // If owner dashboard is already active, refresh it
    if (state.isOwner) {
      renderOwnerTickets();
    }
  });

  // Owner Login Form
  document.getElementById('ownerLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const passInput = document.getElementById('ownerPasswordInput');
    const enteredPass = passInput ? passInput.value.trim() : '';

    // Accepted passwords: admin, 7777, owner2026, root
    const validCodes = ['admin', '7777', 'owner2026', 'root'];

    if (validCodes.includes(enteredPass)) {
      state.isOwner = true;
      try {
        localStorage.setItem(OWNER_AUTH_KEY, 'true');
      } catch (e) {}

      const badgeBtn = document.getElementById('ownerPortalBtn');
      if (badgeBtn) badgeBtn.style.display = 'inline-flex';

      if (passInput) passInput.value = '';
      closeModal('ownerLoginModal');

      renderOwnerTickets();
      openModal('ownerDashboardModal');
      CyberSound.playPreset();

      showToast('👑 Вы успешно вошли как Владелец магазина!');
    } else {
      CyberSound.playWarning();
      showToast('⚠️ Неверный пароль владельца! (По умолчанию: admin или 7777)');
    }
  });

  // Owner Logout
  document.getElementById('btnLogoutOwner')?.addEventListener('click', () => {
    state.isOwner = false;
    try {
      localStorage.removeItem(OWNER_AUTH_KEY);
    } catch (e) {}

    const badgeBtn = document.getElementById('ownerPortalBtn');
    if (badgeBtn) badgeBtn.style.display = 'none';

    closeModal('ownerDashboardModal');
    CyberSound.playRelayClick();
    showToast('Вы вышли из учетной записи владельца.');
  });

  // Owner Dashboard Filter Tabs
  document.querySelectorAll('.owner-tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.owner-tab-btn').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');
      const filter = tabBtn.dataset.filterStatus || 'all';
      renderOwnerTickets(filter);
      CyberSound.playSelect();
    });
  });

  // Owner Export Tickets
  document.getElementById('btnExportTickets')?.addEventListener('click', () => {
    exportSupportTickets();
  });
}

let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('cyberToast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  clearTimeout(toastTimeout);
  toastMsg.textContent = msg;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

function formatRub(val) {
  const curr = state.currentCurrency || 'uzs';
  const lang = state.currentLang || 'uz';
  const num = Math.round(val || 0);

  // US Dollar ($) - 1 USD ≈ 12,800 UZS
  if (curr === 'usd') {
    const usd = Math.round(num / 12800);
    return '$' + usd.toLocaleString('en-US');
  }

  // Russian Ruble (₽) - 1 RUB ≈ 135 UZS
  if (curr === 'rub') {
    const rub = Math.round(num / 135);
    return rub.toLocaleString('ru-RU') + ' ₽';
  }

  // Uzbekistani Som (so'm / сум / UZS)
  if (lang === 'uz') {
    return num.toLocaleString('uz-UZ') + " so'm";
  } else if (lang === 'en') {
    return num.toLocaleString('en-US') + ' UZS';
  } else {
    return num.toLocaleString('ru-RU') + ' сум';
  }
}

function setCurrency(curr) {
  if (!['uzs', 'usd', 'rub'].includes(curr)) curr = 'uzs';
  state.currentCurrency = curr;
  try {
    localStorage.setItem('cyberpc_currency', curr);
  } catch (e) {}

  document.querySelectorAll('.btn-curr').forEach(b => {
    b.classList.toggle('active', b.dataset.curr === curr);
  });

  updatePriceDisplay();
  renderDrawerItems();
  renderFullCatalog();
  renderSavedBuildsList();

  const lang = state.currentLang || 'uz';
  let currToast = '';
  if (curr === 'usd') {
    currToast = lang === 'uz' ? 'Valyuta: AQSH Dollari ($)' : (lang === 'en' ? 'Currency: US Dollar ($)' : 'Валюта: Доллары США ($)');
  } else if (curr === 'rub') {
    currToast = lang === 'uz' ? 'Valyuta: Rossiya Rubli (₽)' : (lang === 'en' ? 'Currency: Russian Ruble (₽)' : 'Валюта: Российский рубль (₽)');
  } else {
    currToast = lang === 'uz' ? "Valyuta: O'zbek so'mi (so'm)" : (lang === 'en' ? 'Currency: Uzbek Som (UZS)' : 'Валюта: Узбекский сум (сум)');
  }
  showToast(currToast);
}

function setLanguage(lang) {
  if (!window.I18N || !window.I18N[lang]) lang = 'uz';
  state.currentLang = lang;
  try {
    localStorage.setItem('cyberpc_lang', lang);
  } catch (e) {}

  document.querySelectorAll('.lang-option-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  const currentLangCode = document.getElementById('currentLangCode');
  if (currentLangCode) currentLangCode.textContent = lang.toUpperCase();

  const t = window.I18N[lang];

  // Header & Brand
  const brandSub = document.getElementById('txtBrandSub');
  if (brandSub) brandSub.textContent = t.brandSub;

  const navB = document.getElementById('txtNavBuilder');
  if (navB) navB.textContent = t.tabBuilder;
  const navC = document.getElementById('txtNavCatalog');
  if (navC) navC.textContent = t.tabCatalog;
  const navS = document.getElementById('txtNavSaved');
  if (navS) navS.textContent = t.tabSaved;
  const navSup = document.getElementById('txtNavSupport');
  if (navSup && t.navSupport) navSup.textContent = t.navSupport;
  const botSup = document.getElementById('txtBottomSupport');
  if (botSup && t.navSupport) botSup.textContent = t.navSupport;
  const navOwn = document.getElementById('txtOwnerBadge');
  if (navOwn && t.navOwner) navOwn.textContent = t.navOwner;
  const supTitle = document.getElementById('txtSupportModalTitle');
  if (supTitle && t.supportModalTitle) supTitle.textContent = t.supportModalTitle;

  const totalLbl = document.getElementById('txtTotalLabel');
  if (totalLbl) totalLbl.textContent = t.totalLabel;
  const qSave = document.getElementById('txtQuickSave');
  if (qSave) qSave.textContent = t.saveBtn;

  // Bottom Utility Bar Sound Label
  const soundText = document.getElementById('soundLabelText');
  if (soundText) {
    if (lang === 'uz') soundText.textContent = state.soundEnabled ? 'OVOZ: ON' : 'OVOZ: OFF';
    else if (lang === 'en') soundText.textContent = state.soundEnabled ? 'SOUND: ON' : 'SOUND: OFF';
    else soundText.textContent = state.soundEnabled ? 'ЗВУК: ВКЛ' : 'ЗВУК: ВЫКЛ';
  }

  // 3D Controls
  const glassTxt = document.getElementById('txtToggleGlass');
  if (glassTxt) {
    const isOpen = state.viewer3D ? state.viewer3D.isGlassOpen : false;
    glassTxt.textContent = isOpen ? t.glassClose : t.glassOpen;
  }
  const pasteTxt = document.getElementById('txtApplyPaste');
  if (pasteTxt) pasteTxt.textContent = t.pasteBtn;

  const pwrTxt = document.getElementById('txtPowerBtn');
  if (pwrTxt) {
    const isPwr = state.viewer3D ? state.viewer3D.isPoweredOn : true;
    pwrTxt.textContent = isPwr ? t.powerOn : t.powerOff;
  }

  const rotTxt = document.getElementById('txtRotate');
  if (rotTxt) rotTxt.textContent = t.rotateBtn;

  const fsTxt = document.getElementById('txtFullscreen');
  if (fsTxt) fsTxt.textContent = lang === 'uz' ? 'To‘liq ekran' : (lang === 'en' ? 'Fullscreen' : 'На весь экран');

  // Camera Options
  const camSelect = document.getElementById('cameraSelect');
  if (camSelect) {
    const curVal = camSelect.value;
    camSelect.innerHTML = `
      <option value="iso">📷 ${t.camIso}</option>
      <option value="interior">🔍 ${t.camInterior}</option>
      <option value="workbench">🛠️ ${t.camBench}</option>
      <option value="front">💨 ${t.camFront}</option>
      <option value="top">🔝 ${t.camTop}</option>
    `;
    camSelect.value = curVal;
  }

  // Drawer Title & Search Input
  const searchInp = document.getElementById('drawerSearchInput');
  if (searchInp) searchInp.placeholder = t.searchPlaceholder;

  const fullCatLink = document.getElementById('btnOpenFullCatalog');
  if (fullCatLink) {
    const span = fullCatLink.querySelector('span');
    if (span) span.textContent = t.openFullCatalog;
  }

  // Categories in PC_DATA
  if (PC_DATA && PC_DATA.categories) {
    PC_DATA.categories.forEach(cat => {
      if (t.categories && t.categories[cat.id]) {
        cat.name = t.categories[cat.id];
      }
    });
  }

  // Drawer Title
  const drawerTitle = document.getElementById('drawerCatTitle');
  if (drawerTitle) {
    const catObj = PC_DATA.categories.find(c => c.id === state.drawerCat);
    drawerTitle.textContent = `${t.drawerTitlePrefix}${(catObj ? catObj.name : state.drawerCat).toUpperCase()}`;
  }

  // Interactive Hardware Disassembly / Assembly Dock Labels
  const partsDockTitle = document.getElementById('txtPartsDockTitle');
  if (partsDockTitle && t.partsDockTitle) partsDockTitle.textContent = t.partsDockTitle;

  const partGpu = document.getElementById('txtPartGpu');
  if (partGpu && t.partGpu) partGpu.textContent = t.partGpu;

  const partCooler = document.getElementById('txtPartCooler');
  if (partCooler && t.partCooler) partCooler.textContent = t.partCooler;

  const partRam = document.getElementById('txtPartRam');
  if (partRam && t.partRam) partRam.textContent = t.partRam;

  const partCpu = document.getElementById('txtPartCpu');
  if (partCpu && t.partCpu) partCpu.textContent = t.partCpu;

  const partMb = document.getElementById('txtPartMb');
  if (partMb && t.partMb) partMb.textContent = t.partMb;

  const partSsd = document.getElementById('txtPartSsd');
  if (partSsd && t.partSsd) partSsd.textContent = t.partSsd;

  const partCables = document.getElementById('txtPartCables');
  if (partCables && t.partCables) partCables.textContent = t.partCables;

  const partGlass = document.getElementById('txtPartGlass');
  if (partGlass && t.partGlass) partGlass.textContent = t.partGlass;

  // Telemetry & Benchmark Tab Titles
  const tabGamTxt = document.getElementById('txtTabGaming');
  if (tabGamTxt && t.tabGamingFps) tabGamTxt.textContent = t.tabGamingFps;

  const tabWorkTxt = document.getElementById('txtTabWorkstation');
  if (tabWorkTxt && t.tabWorkstation) tabWorkTxt.textContent = t.tabWorkstation;

  const bneckTxt = document.getElementById('txtBottleneckTitle');
  if (bneckTxt && t.bottleneckTitle) bneckTxt.textContent = t.bottleneckTitle;

  const thermTxt = document.getElementById('txtThermalTitle');
  if (thermTxt && t.thermalTitle) thermTxt.textContent = `🌡️ ${t.thermalTitle}`;

  const recLbl = document.getElementById('txtRecLabel');
  if (recLbl && t.recommendedMonitor) recLbl.textContent = `${t.recommendedMonitor}:`;

  // Re-render UI
  renderDrawerChips();
  renderDrawerItems();
  renderFullCatalog();
  updatePriceDisplay();
  updateCompatibility();
  updateAssemblyStepUI();
  updateBenchmarkUI();
}

function getRussianColorName(color) {
  switch (color) {
    case 'cyan': return 'Неоновый Циан';
    case 'purple': return 'Неоновый Пурпур';
    case 'green': return 'Матричный Зеленый';
    case 'red': return 'Кибер Красный';
    case 'rainbow': return 'Радужная Аура';
    default: return color;
  }
}
