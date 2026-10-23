/**
 * CYBER-LAB CUSTOM PC - EXPANDED HARDWARE DATABASE
 * Rich catalog with processors, graphics cards, motherboards, coolers, RAM, SSD, PSU,
 * and 6 visually distinct & unique computer cases.
 */

const PC_DATA = {
  categories: [
    { id: 'case', name: 'Корпус', icon: 'box', required: true },
    { id: 'motherboard', name: 'Материнская плата', icon: 'circuit-board', required: true },
    { id: 'cpu', name: 'Процессор', icon: 'cpu', required: true },
    { id: 'cooler', name: 'Охлаждение', icon: 'fan', required: true },
    { id: 'ram', name: 'Оперативная память', icon: 'memory', required: true },
    { id: 'gpu', name: 'Видеокарта', icon: 'gpu', required: true },
    { id: 'storage', name: 'Накопитель SSD', icon: 'hard-drive', required: true },
    { id: 'psu', name: 'Блок питания', icon: 'zap', required: true }
  ],

  components: {
    // 1. CASES (6 Unique Designs)
    case: [
      {
        id: 'case-nordic-wood',
        name: 'Fractal North Charcoal Walnut Edition',
        type: 'wood-nordic',
        fans: '2x 140mm Silent PWM кулеры',
        glass: 'Тонированное стекло + Натуральный орех',
        price: 16900,
        tier: 'high',
        badge: 'Скандинавский дизайн',
        color: 'walnut-black',
        desc: 'Передняя панель из натурального массива ореха с латунной кнопкой питания и ультратихой продуваемостью.'
      },
      {
        id: 'case-panoramic-snow',
        name: 'Lian Li O11 Vision Pure Snow White',
        type: 'panoramic-snow',
        fans: 'Белоснежный аквариум без стоек',
        glass: '3 панорамных стекла без угловых стоек',
        price: 19800,
        tier: 'high',
        badge: 'Чистый белый',
        color: 'pure-white',
        desc: 'Культовый панорамный аквариум без угловой стойки: бесшовный обзор компонентов со всех сторон.'
      },
      {
        id: 'case-prestige-hyte',
        name: 'HYTE Y70 Touch Infinite Cyber Black',
        type: 'chassis-screen',
        fans: 'Панорама + 14.5" 2.5K Touchscreen',
        glass: 'Тройное закаленное стекло',
        price: 46900,
        tier: 'prestige',
        badge: '2.5K Сенсорный экран',
        color: 'black-cyber',
        desc: 'Шедевр инженерии со встроенным сенсорным экраном 2.5K 60Hz на скошенной угловой грани.'
      },
      {
        id: 'case-mecha-cyber',
        name: 'Cougar Conquer II Mecha Skeleton',
        type: 'mecha-skeleton',
        fans: 'Открытый алюминиевый экзоскелет',
        glass: 'Закаленное стекло Wing-Design',
        price: 32500,
        tier: 'prestige',
        badge: 'Mecha Экзоскелет',
        color: 'orange-gunmetal',
        desc: 'Агрессивный открытый стенд из миллиметрового анодированного алюминия в стиле боевого меха-робота.'
      },
      {
        id: 'case-cyber-cube',
        name: 'DeepCool CH560 Cyber Digital',
        type: 'digital-screen',
        fans: '3x 140mm ARGB + 1x 120mm ARGB',
        glass: 'Гибридное стекло + LCD статус',
        price: 8900,
        tier: 'mid',
        badge: 'Встроенный дисплей',
        color: 'black-mesh',
        desc: 'Цифровой экран на боковом кожухе с мониторингом температур CPU/GPU в реальном времени.'
      },
      {
        id: 'case-budget-rgb',
        name: 'CyberLab Phantom V1 Airflow',
        type: 'mid-tower',
        fans: '4x 120mm ARGB кулеры',
        glass: 'Закаленное стекло',
        price: 4900,
        tier: 'budget',
        badge: 'Отличный продув',
        color: 'black-mesh',
        desc: 'Сетчатая передняя панель с сотовой перфорацией и 4 предустановленных неоновых кулера.'
      }
    ],

    // 2. MOTHERBOARDS
    motherboard: [
      {
        id: 'mb-b550-am4',
        name: 'MSI B550M PRO-VDH WiFi',
        brand: 'MSI',
        socket: 'AM4',
        ramType: 'DDR4',
        chipset: 'AMD B550',
        formFactor: 'mATX',
        price: 9100,
        tier: 'budget',
        badge: 'Бюджет WiFi',
        desc: 'Надежная черная плата с радиаторами на VRM и встроенным Wi-Fi модулем.'
      },
      {
        id: 'mb-b760-white',
        name: 'ASRock B760M Pro RS WiFi White DDR5',
        brand: 'ASRock',
        socket: 'LGA1700',
        ramType: 'DDR5',
        chipset: 'Intel B760',
        formFactor: 'mATX',
        price: 13900,
        tier: 'budget',
        badge: 'Белый текстолит',
        desc: 'Стильный белоснежный текстолит с серебристыми радиаторами и поддержкой PCIe 5.0.'
      },
      {
        id: 'mb-b650-am5',
        name: 'GIGABYTE B650 AORUS ELITE AX',
        brand: 'GIGABYTE',
        socket: 'AM5',
        ramType: 'DDR5',
        chipset: 'AMD B650',
        formFactor: 'ATX',
        price: 21500,
        tier: 'mid',
        badge: 'Гейминг Хит',
        desc: 'Мощный 14+2+1 фазный VRM с титановыми радиаторами и оранжевыми кибер-линиями.'
      },
      {
        id: 'mb-z790-white',
        name: 'GIGABYTE Z790 AORUS PRO X ICE White',
        brand: 'GIGABYTE',
        socket: 'LGA1700',
        ramType: 'DDR5',
        chipset: 'Intel Z790',
        formFactor: 'ATX',
        price: 38900,
        tier: 'high',
        badge: 'ICE Snow Edition',
        desc: 'Полностью белая премиальная материнская плата с Wi-Fi 7 и антенной белого цвета.'
      },
      {
        id: 'mb-z790-lga',
        name: 'ASUS ROG STRIX Z790-F Gaming WiFi II',
        brand: 'ASUS ROG',
        socket: 'LGA1700',
        ramType: 'DDR5',
        chipset: 'Intel Z790',
        formFactor: 'ATX',
        price: 43200,
        tier: 'high',
        badge: 'ROG Киберпанк',
        desc: 'Флагманская плата с неоновым голографическим глазом ROG, 16+1+2 питанием и разгоном.'
      },
      {
        id: 'mb-x670e-am5',
        name: 'ASUS ROG Crosshair X670E Hero',
        brand: 'ASUS ROG',
        socket: 'AM5',
        ramType: 'DDR5',
        chipset: 'AMD X670E',
        formFactor: 'ATX',
        price: 68900,
        tier: 'prestige',
        badge: 'Ultra Prestige',
        desc: 'Матричный Polymo-дисплей на защитном кожухе, два порта USB4 40Gbps.'
      }
    ],

    // 3. PROCESSORS (CPU)
    cpu: [
      {
        id: 'cpu-r5-5600',
        name: 'AMD Ryzen 5 5600',
        brand: 'AMD',
        price: 9400,
        socket: 'AM4',
        cores: '6 ядер / 12 потоков',
        freq: '3.5 - 4.4 ГГц',
        tdp: 65,
        tier: 'budget',
        score: 65,
        badge: 'Топ Бюджет',
        desc: 'Народный 6-ядерный хит для бюджетных киберспортивных сборок.'
      },
      {
        id: 'cpu-i5-12400f',
        name: 'Intel Core i5-12400F',
        brand: 'Intel',
        price: 11200,
        socket: 'LGA1700',
        cores: '6 ядер / 12 потоков',
        freq: '2.5 - 4.4 ГГц',
        tdp: 65,
        tier: 'budget',
        score: 68,
        badge: 'Хит продаж',
        desc: 'Сбалансированный процессор Alder Lake с отличным соотношением цена/FPS.'
      },
      {
        id: 'cpu-r5-7500f',
        name: 'AMD Ryzen 5 7500F',
        brand: 'AMD',
        price: 14500,
        socket: 'AM5',
        cores: '6 ядер / 12 потоков',
        freq: '3.7 - 5.0 ГГц',
        tdp: 65,
        tier: 'mid',
        score: 78,
        badge: 'Выбор геймеров',
        desc: 'Идеальный входной билет на современную платформу AM5 с DDR5.'
      },
      {
        id: 'cpu-i5-14600kf',
        name: 'Intel Core i5-14600KF',
        brand: 'Intel',
        price: 27900,
        socket: 'LGA1700',
        cores: '14 ядер (6P + 8E) / 20 потоков',
        freq: '3.5 - 5.3 ГГц',
        tdp: 125,
        tier: 'high',
        score: 89,
        badge: 'Мощный',
        desc: 'Высочайшая производительность в играх и рабочих задачах.'
      },
      {
        id: 'cpu-r7-7800x3d',
        name: 'AMD Ryzen 7 7800X3D',
        brand: 'AMD',
        price: 39900,
        socket: 'AM5',
        cores: '8 ядер / 16 потоков + 3D V-Cache',
        freq: '4.2 - 5.0 ГГц',
        tdp: 120,
        tier: 'pro',
        score: 98,
        badge: 'Царь Гейминга',
        desc: 'Абсолютный лидер в играх благодаря гигантскому 3D V-Cache (96 МБ).'
      },
      {
        id: 'cpu-r7-9700x',
        name: 'AMD Ryzen 7 9700X Zen 5',
        brand: 'AMD',
        price: 36900,
        socket: 'AM5',
        cores: '8 ядер / 16 потоков Zen 5 (4nm)',
        freq: '3.8 - 5.5 ГГц',
        tdp: 65,
        tier: 'pro',
        score: 96,
        badge: 'Новинка Zen 5',
        desc: 'Процессор новейшей микроархитектуры Zen 5 с рекордным IPC и холодным нравом.'
      },
      {
        id: 'cpu-i7-14700k',
        name: 'Intel Core i7-14700K',
        brand: 'Intel',
        price: 41500,
        socket: 'LGA1700',
        cores: '20 ядер (8P + 12E) / 28 потоков',
        freq: '3.4 - 5.6 ГГц',
        tdp: 125,
        tier: 'high',
        score: 95,
        badge: '20 Ядер',
        desc: 'Универсальный монстр для гейминга, стримов и видеомонтажа в 4K.'
      },
      {
        id: 'cpu-i9-14900ks',
        name: 'Intel Core i9-14900KS Ultra',
        brand: 'Intel',
        price: 64500,
        socket: 'LGA1700',
        cores: '24 ядра (8P + 16E) / 32 потока',
        freq: '3.2 - 6.2 ГГц Extreme',
        tdp: 253,
        tier: 'prestige',
        score: 100,
        badge: 'Флагман 6.2 ГГц',
        desc: 'Бескомпромиссная мощь для 4K гейминга и экстремального рендеринга.'
      }
    ],

    // 4. COOLING SYSTEMS
    cooler: [
      {
        id: 'cooler-ak400',
        name: 'DeepCool AG400 ARGB',
        type: 'air',
        price: 2400,
        maxTdp: 150,
        fans: '1x 120mm PWM ARGB',
        noise: '28 dB',
        tier: 'budget',
        badge: 'Тихий',
        desc: 'Башенный кулер с 4 теплотрубками и настраиваемой неоновой подсветкой.'
      },
      {
        id: 'cooler-assassin',
        name: 'Thermalright Peerless Assassin 120 SE ARGB',
        type: 'air-dual',
        price: 4300,
        maxTdp: 245,
        fans: '2x 120mm Dual Tower',
        noise: '26 dB',
        tier: 'mid',
        badge: 'Топ Эффект',
        desc: 'Легендарная двухсекционная башня с двумя вентиляторами и 6 теплотрубками.'
      },
      {
        id: 'cooler-aio-240',
        name: 'DeepCool LT520 Liquid 240mm',
        type: 'aio',
        price: 8600,
        maxTdp: 280,
        fans: '2x 120mm FK120 + Зеркальная помпа',
        noise: '31 dB',
        tier: 'high',
        badge: 'Водяное СВО',
        desc: 'СВО с геометрической infinity-mirror помпой в киберпанк стиле.'
      },
      {
        id: 'cooler-aio-white',
        name: 'Lian Li Galahad II Trinity 360 White ARGB',
        type: 'aio-rgb',
        price: 18900,
        maxTdp: 320,
        fans: '3x 120mm ARGB Snow White',
        noise: '27 dB',
        tier: 'high',
        badge: 'Белая СВО 360',
        desc: 'Белоснежная система жидкостного охлаждения со сменными крышками помпы.'
      },
      {
        id: 'cooler-aio-360',
        name: 'NZXT Kraken Elite 360 RGB LCD',
        type: 'aio-rgb',
        price: 28900,
        maxTdp: 350,
        fans: '3x 120mm RGB + 2.36" LCD дисплей',
        noise: '24 dB',
        tier: 'prestige',
        badge: 'LCD Дисплей',
        desc: 'Премиум система СВО с экраном для вывода GIF-анимаций и температур.'
      }
    ],

    // 5. RAM
    ram: [
      {
        id: 'ram-16-ddr4',
        name: 'Kingston FURY Beast RGB 16GB (2x8) DDR4-3200',
        ramType: 'DDR4',
        capacity: '16 ГБ (2x8)',
        speed: '3200 МГц CL16',
        rgb: true,
        price: 4200,
        tier: 'budget',
        badge: 'DDR4 Стандарт',
        desc: 'Классический комплект с плавной настраиваемой RGB подсветкой.'
      },
      {
        id: 'ram-32-ddr5-basic',
        name: 'Kingston FURY Beast Black 32GB (2x16) DDR5-5600',
        ramType: 'DDR5',
        capacity: '32 ГБ (2x16)',
        speed: '5600 МГц CL36',
        rgb: false,
        price: 9900,
        tier: 'budget',
        badge: 'DDR5 Строгий',
        desc: 'Строгий низкопрофильный дизайн без подсветки для максимальной надежности.'
      },
      {
        id: 'ram-32-ddr5-rgb',
        name: 'TeamGroup T-Force Delta RGB 32GB (2x16) DDR5-6000',
        ramType: 'DDR5',
        capacity: '32 ГБ (2x16)',
        speed: '6000 МГц CL30 AMD EXPO',
        rgb: true,
        price: 13400,
        tier: 'mid',
        badge: 'CL30 Тайминги',
        desc: 'Широкие неоновые диффузоры 120° с поддержкой Intel XMP и AMD EXPO.'
      },
      {
        id: 'ram-32-ddr5-white',
        name: 'Corsair Vengeance RGB White 32GB (2x16) DDR5-6000',
        ramType: 'DDR5',
        capacity: '32 ГБ (2x16)',
        speed: '6000 МГц CL36 White',
        rgb: true,
        price: 14800,
        tier: 'mid',
        badge: 'Белый дизайн',
        desc: 'Белоснежные радиаторы с 10 индивидуально настраиваемыми светодиодами CAPELLIX.'
      },
      {
        id: 'ram-64-ddr5-prestige',
        name: 'G.Skill Trident Z5 Neo RGB 64GB (2x32) DDR5-6400',
        ramType: 'DDR5',
        capacity: '64 ГБ (2x32)',
        speed: '6400 МГц CL32',
        rgb: true,
        price: 27800,
        tier: 'prestige',
        badge: 'Флагман 64GB',
        desc: 'Матовые алюминиевые радиаторы с агрессивными линиями гиперкара.'
      }
    ],

    // 6. GRAPHICS CARDS (GPU)
    gpu: [
      {
        id: 'gpu-rtx-4060',
        name: 'NVIDIA GeForce RTX 4060 8GB GDDR6',
        chip: 'RTX 4060',
        vram: '8 ГБ GDDR6',
        tdp: 115,
        price: 33500,
        tier: 'budget',
        score: 65,
        fpsMultiplier: 1.0,
        badge: 'DLSS 3 Хит',
        desc: 'Энергоэффективный ускоритель для киберспорта и 1080p гейминга с генерацией кадров.'
      },
      {
        id: 'gpu-rx-7700xt',
        name: 'AMD Radeon RX 7700 XT 12GB',
        chip: 'RX 7700 XT',
        vram: '12 ГБ GDDR6',
        tdp: 245,
        price: 45900,
        tier: 'mid',
        score: 79,
        fpsMultiplier: 1.35,
        badge: '12GB Памяти',
        desc: 'Отличный баланс растровой мощи и увеличенного объема видеопамяти.'
      },
      {
        id: 'gpu-rtx-4070s',
        name: 'NVIDIA GeForce RTX 4070 SUPER 12GB',
        chip: 'RTX 4070 SUPER',
        vram: '12 ГБ GDDR6X',
        tdp: 220,
        price: 66900,
        tier: 'high',
        score: 92,
        fpsMultiplier: 1.68,
        badge: 'Идеал для 2K',
        desc: 'Золотой стандарт для ультра-настроек в 1440p с полным рейтрейсингом.'
      },
      {
        id: 'gpu-rtx-4070ti-white',
        name: 'GIGABYTE GeForce RTX 4070 Ti SUPER AERO White 16GB',
        chip: 'RTX 4070 Ti SUPER',
        vram: '16 ГБ GDDR6X',
        tdp: 285,
        price: 94500,
        tier: 'high',
        score: 102,
        fpsMultiplier: 1.95,
        badge: 'Белый AERO 16GB',
        desc: 'Белоснежная карта с 16 ГБ памяти для максимальных текстур в 2K и 4K.'
      },
      {
        id: 'gpu-rtx-4080s',
        name: 'NVIDIA GeForce RTX 4080 SUPER 16GB OC',
        chip: 'RTX 4080 SUPER',
        vram: '16 ГБ GDDR6X',
        tdp: 320,
        price: 114000,
        tier: 'pro',
        score: 110,
        fpsMultiplier: 2.15,
        badge: 'Топ 4K Мощь',
        desc: 'Мощнейшая карта для бескомпромиссного 4K гейминга и VR-погружения.'
      },
      {
        id: 'gpu-rx-7900xtx',
        name: 'AMD Radeon RX 7900 XTX 24GB Nitro+ OC',
        chip: 'RX 7900 XTX',
        vram: '24 ГБ GDDR6',
        tdp: 355,
        price: 109000,
        tier: 'pro',
        score: 115,
        fpsMultiplier: 2.22,
        badge: '24GB Флагман',
        desc: 'Флагман от AMD с огромным буфером 24 ГБ и светодиодной ARGB полосой на всю длину.'
      },
      {
        id: 'gpu-rtx-4090',
        name: 'ASUS ROG Matrix GeForce RTX 4090 24GB Liquid',
        chip: 'RTX 4090',
        vram: '24 ГБ GDDR6X',
        tdp: 450,
        price: 239000,
        tier: 'prestige',
        score: 145,
        fpsMultiplier: 2.85,
        badge: 'Абсолютный Титан',
        desc: 'Самая быстрая видеокарта в мире с жидким металлом и подсветкой infinity mirror.'
      }
    ],

    // 7. STORAGE SSD NVMe
    storage: [
      {
        id: 'ssd-1tb-nv2',
        name: 'Kingston NV2 1TB M.2 PCIe 4.0 NVMe',
        capacity: '1 ТБ',
        speed: '3500 / 2100 МБ/с',
        price: 5900,
        tier: 'budget',
        badge: 'Бюджет SSD',
        desc: 'Быстрый NVMe накопитель для системы и любимых игр.'
      },
      {
        id: 'ssd-1tb-990pro',
        name: 'Samsung 990 PRO 1TB PCIe 4.0 NVMe',
        capacity: '1 ТБ',
        speed: '7450 / 6900 МБ/с',
        price: 11900,
        tier: 'mid',
        badge: 'Скоростной Хит',
        desc: 'Максимальные скорости для интерфейса PCIe 4.0 с DRAM буфером.'
      },
      {
        id: 'ssd-2tb-990pro',
        name: 'Samsung 990 PRO 2TB с радиатором RGB',
        capacity: '2 ТБ',
        speed: '7450 / 6900 МБ/с',
        price: 21500,
        tier: 'high',
        badge: '2 ТБ Премиум',
        desc: 'Массивный объем и фирменный футуристический радиатор с охлаждением.'
      },
      {
        id: 'ssd-4tb-gen5',
        name: 'Crucial T700 4TB PCIe 5.0 Extreme NVMe',
        capacity: '4 ТБ',
        speed: '12400 / 11800 МБ/с',
        price: 52000,
        tier: 'prestige',
        badge: 'PCIe 5.0 12 ГБ/с',
        desc: 'Космические скорости новейшего поколения для мгновенной загрузки миров.'
      }
    ],

    // 8. POWER SUPPLY (PSU)
    psu: [
      {
        id: 'psu-650w-bronze',
        name: 'DeepCool PK650D 650W 80+ Bronze',
        wattage: 650,
        cert: '80 PLUS Bronze',
        modular: false,
        price: 4900,
        tier: 'budget',
        badge: '650W Надежный',
        desc: 'Качественные японские конденсаторы и тихий вентилятор 120мм.'
      },
      {
        id: 'psu-750w-gold',
        name: 'Montech TITAN GOLD 750W ATX 3.0',
        wattage: 750,
        cert: '80 PLUS Gold',
        modular: true,
        price: 9800,
        tier: 'mid',
        badge: 'ATX 3.0 PCIe 5',
        desc: 'Полностью модульный блок с новым кабелем 12VHPWR для карт RTX 40.'
      },
      {
        id: 'psu-850w-gold',
        name: 'be quiet! Pure Power 12 M 850W Gold',
        wattage: 850,
        cert: '80 PLUS Gold',
        modular: true,
        price: 14800,
        tier: 'high',
        badge: 'Бесшумный Топ',
        desc: 'Немецкое качество, тихий вентилятор Silent Wings и 10 лет гарантии.'
      },
      {
        id: 'psu-1000w-white',
        name: 'Corsair RM1000x Shift White 1000W Gold',
        wattage: 1000,
        cert: '80 PLUS Gold',
        modular: true,
        price: 21900,
        tier: 'high',
        badge: '1000W White',
        desc: 'Белый блок питания с боковым расположением разъемов кабелей для удобства сборки.'
      },
      {
        id: 'psu-1200w-oled',
        name: 'ASUS ROG Thor 1200W Platinum II OLED',
        wattage: 1200,
        cert: '80 PLUS Platinum',
        modular: true,
        price: 36900,
        tier: 'prestige',
        badge: 'OLED Экран 1200W',
        desc: 'Встроенный OLED-дисплей реального потребления ватт и ARGB подсветка Aura.'
      }
    ]
  },

  // Games Benchmark Data
  games: [
    { id: 'cs2', name: 'Counter-Strike 2', genre: 'Киберспорт / Source 2', baseFps: 180, cpuWeight: 0.45, gpuWeight: 0.55 },
    { id: 'cyberpunk', name: 'Cyberpunk 2077', genre: 'Ultra + Ray Tracing', baseFps: 42, cpuWeight: 0.25, gpuWeight: 0.75 },
    { id: 'gta5', name: 'GTA V / GTA 6 Ready', genre: 'Открытый мир / Very High', baseFps: 110, cpuWeight: 0.35, gpuWeight: 0.65 }
  ],

  // Presets
  presets: {
    budget: {
      name: 'Cyber-Эконом (Бюджет)',
      case: 'case-budget-rgb',
      motherboard: 'mb-b550-am4',
      cpu: 'cpu-r5-5600',
      cooler: 'cooler-ak400',
      ram: 'ram-16-ddr4',
      gpu: 'gpu-rtx-4060',
      storage: 'ssd-1tb-nv2',
      psu: 'psu-650w-bronze'
    },
    optimal: {
      name: 'Cyber-Оптимал (Баланс)',
      case: 'case-cyber-cube',
      motherboard: 'mb-b650-am5',
      cpu: 'cpu-r5-7500f',
      cooler: 'cooler-assassin',
      ram: 'ram-32-ddr5-rgb',
      gpu: 'gpu-rtx-4070s',
      storage: 'ssd-1tb-990pro',
      psu: 'psu-750w-gold'
    },
    nordic: {
      name: 'Nordic Wood Walnut (Скандинавия)',
      case: 'case-nordic-wood',
      motherboard: 'mb-b650-am5',
      cpu: 'cpu-r7-7800x3d',
      cooler: 'cooler-assassin',
      ram: 'ram-32-ddr5-basic',
      gpu: 'gpu-rtx-4080s',
      storage: 'ssd-2tb-990pro',
      psu: 'psu-850w-gold'
    },
    snow: {
      name: 'Pure Snow White (Белоснежная)',
      case: 'case-panoramic-snow',
      motherboard: 'mb-b760-white',
      cpu: 'cpu-i7-14700k',
      cooler: 'cooler-aio-white',
      ram: 'ram-32-ddr5-white',
      gpu: 'gpu-rtx-4070ti-white',
      storage: 'ssd-2tb-990pro',
      psu: 'psu-1000w-white'
    },
    prestige: {
      name: 'Prestige / Богатый (Флагман)',
      case: 'case-prestige-hyte',
      motherboard: 'mb-z790-lga',
      cpu: 'cpu-i9-14900ks',
      cooler: 'cooler-aio-360',
      ram: 'ram-64-ddr5-prestige',
      gpu: 'gpu-rtx-4090',
      storage: 'ssd-4tb-gen5',
      psu: 'psu-1200w-oled'
    }
  }
};
