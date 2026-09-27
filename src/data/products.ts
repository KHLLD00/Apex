import { Product } from "@/types";

const image = (id: string) => `https://images.unsplash.com/${id}?q=85&w=1000&auto=format&fit=crop`;

export const products: Product[] = [
  {
    id: "p001", slug: "iphone-18-pro-max-256gb", name: "iPhone 18 Pro Max", brand: "Apple", category: "smartphones",
    price: 2850000, images: [image("photo-1592286927505-1def25115558")], rating: 0, reviewCount: 0, stock: 8, featured: true, bestSeller: true,
    description: "Apple's latest Pro Max iPhone, built around the A20 Pro chip with a new variable-aperture camera system and all-day battery performance.",
    specs: [{label:"Display",value:"6.9-inch Super Retina XDR OLED, ProMotion"},{label:"Chip",value:"Apple A20 Pro"},{label:"Camera",value:"48MP Fusion camera system with variable aperture"},{label:"Battery",value:"Up to 39 hours video playback"}],
    variants: [{type:"Storage",options:["256GB","512GB","1TB"]},{type:"Color",options:["Black","Silver","Glacier","Burgundy"]}], createdAt:"2026-09-18"
  },
  {
    id: "p002", slug: "iphone-18-pro-256gb", name: "iPhone 18 Pro", brand: "Apple", category: "smartphones",
    price: 2650000, images: [image("photo-1511707171634-5f897ff02aa9")], rating: 0, reviewCount: 0, stock: 10, featured: true,
    description: "The new iPhone 18 Pro combines A20 Pro performance with Apple's most advanced Pro camera system and a refined titanium-class premium design.",
    specs: [{label:"Display",value:"6.3-inch Super Retina XDR OLED, ProMotion"},{label:"Chip",value:"Apple A20 Pro"},{label:"Camera",value:"48MP Fusion camera system with variable aperture"},{label:"Charging",value:"USB-C fast charging and MagSafe"}],
    variants: [{type:"Storage",options:["256GB","512GB","1TB"]},{type:"Color",options:["Black","Silver","Glacier","Burgundy"]}], createdAt:"2026-09-18"
  },
  {
    id: "p003", slug: "iphone-air-256gb", name: "iPhone Air", brand: "Apple", category: "smartphones",
    price: 2250000, images: [image("photo-1598327105666-5b89351aff97")], rating: 0, reviewCount: 0, stock: 12, featured: true,
    description: "A thin, lightweight iPhone designed for people who want Pro-class performance in a slimmer everyday form factor.",
    specs: [{label:"Display",value:"6.5-inch OLED with ProMotion"},{label:"Chip",value:"Apple A19 Pro"},{label:"Connectivity",value:"5G and Wi-Fi 7"},{label:"Charging",value:"USB-C and MagSafe"}],
    variants: [{type:"Storage",options:["256GB","512GB"]},{type:"Color",options:["Sky Blue","Cloud White","Space Black","Light Gold"]}], createdAt:"2026-09-18"
  },
  {
    id: "p004", slug: "iphone-17-256gb", name: "iPhone 17", brand: "Apple", category: "smartphones",
    price: 1750000, images: [image("photo-1601972599720-36938d4ecd31")], rating: 0, reviewCount: 0, stock: 18, featured: true, bestSeller: true,
    description: "A current-generation iPhone with the A19 chip, 120Hz ProMotion display, 48MP dual camera system and USB-C.",
    specs: [{label:"Display",value:"6.3-inch OLED, up to 120Hz"},{label:"Chip",value:"Apple A19"},{label:"Camera",value:"48MP Fusion Main + 48MP Ultra Wide"},{label:"Battery",value:"Up to 30 hours video playback"}],
    variants: [{type:"Storage",options:["256GB","512GB"]},{type:"Color",options:["Black","White","Mist Blue","Sage","Lavender"]}], createdAt:"2025-09-19"
  },
  {
    id: "p005", slug: "iphone-17e-256gb", name: "iPhone 17e", brand: "Apple", category: "smartphones",
    price: 1420000, images: [image("photo-1580910051074-3eb694886505")], rating: 0, reviewCount: 0, stock: 20, featured: true,
    description: "A more accessible current iPhone with Apple silicon, a modern OLED display and the everyday features most buyers need.",
    specs: [{label:"Display",value:"6.1-inch OLED"},{label:"Chip",value:"Apple A19"},{label:"Storage",value:"256GB or 512GB"},{label:"Connector",value:"USB-C"}],
    variants: [{type:"Storage",options:["256GB","512GB"]},{type:"Color",options:["Soft Pink","White","Black"]}], createdAt:"2026-03-11"
  },
  {
    id: "p006", slug: "samsung-galaxy-s26-ultra-256gb", name: "Galaxy S26 Ultra", brand: "Samsung", category: "smartphones",
    price: 2050000, images: [image("photo-1616348436168-de43ad0db179")], rating: 0, reviewCount: 0, stock: 9, featured: true, bestSeller: true,
    description: "Samsung's current flagship Galaxy S phone with a 200MP camera system, Privacy Display, S Pen and Snapdragon 8 Elite Gen 5 for Galaxy.",
    specs: [{label:"Display",value:"6.9-inch Dynamic AMOLED 2X"},{label:"Processor",value:"Snapdragon 8 Elite Gen 5 for Galaxy"},{label:"Camera",value:"200MP main camera system"},{label:"Battery",value:"5000mAh"}],
    variants: [{type:"Storage",options:["256GB","512GB","1TB"]},{type:"Color",options:["Black","White","Silver","Blue"]}], createdAt:"2026-03-11"
  },
  {
    id: "p007", slug: "samsung-galaxy-s26-plus-256gb", name: "Galaxy S26+", brand: "Samsung", category: "smartphones",
    price: 1720000, images: [image("photo-1565849904461-04a58ad377e0")], rating: 0, reviewCount: 0, stock: 11, featured: true,
    description: "A large-screen Galaxy flagship balancing premium performance, cameras, battery life and Galaxy AI features.",
    specs: [{label:"Display",value:"6.7-inch Dynamic AMOLED 2X"},{label:"Battery",value:"4900mAh"},{label:"Camera",value:"50MP wide camera system"},{label:"Connectivity",value:"5G, Wi-Fi 7"}],
    variants: [{type:"Storage",options:["256GB","512GB"]},{type:"Color",options:["Black","White","Silver","Blue"]}], createdAt:"2026-03-11"
  },
  {
    id: "p008", slug: "samsung-galaxy-z-flip8-256gb", name: "Galaxy Z Flip8", brand: "Samsung", category: "smartphones",
    price: 1780000, images: [image("photo-1556656793-08538906a9f8")], rating: 0, reviewCount: 0, stock: 7, featured: true,
    description: "Samsung's current compact foldable phone, combining a pocket-friendly form factor with a large flexible display and FlexWindow.",
    specs: [{label:"Cover Display",value:"4.1-inch FlexWindow"},{label:"Main Display",value:"Foldable AMOLED"},{label:"Camera",value:"50MP main camera"},{label:"Network",value:"5G"}],
    variants: [{type:"Storage",options:["256GB","512GB"]},{type:"Color",options:["Blue","Black","Silver","Pink"]}], createdAt:"2026-07-31"
  },
  {
    id: "p009", slug: "google-pixel-11-pro-xl-256gb", name: "Pixel 11 Pro XL", brand: "Google", category: "smartphones",
    price: 1950000, images: [image("photo-1592899677977-9c10ca588bbd")], rating: 0, reviewCount: 0, stock: 6, featured: true,
    description: "Google's current Pro XL Pixel with Tensor G6, advanced computational photography and long-term software support.",
    specs: [{label:"Chip",value:"Google Tensor G6"},{label:"Camera",value:"Pro triple rear camera system"},{label:"Battery",value:"30+ hour battery life"},{label:"Durability",value:"IP68"}],
    variants: [{type:"Storage",options:["256GB","512GB","1TB"]},{type:"Color",options:["Obsidian","Porcelain","Hazel"]}], createdAt:"2026-08-20"
  },
  {
    id: "p010", slug: "xiaomi-17-ultra-512gb", name: "Xiaomi 17 Ultra", brand: "Xiaomi", category: "smartphones",
    price: 1650000, images: [image("photo-1592286927505-1def25115558")], rating: 0, reviewCount: 0, stock: 8, featured: true, bestSeller: true,
    description: "A Leica-equipped Xiaomi flagship with a 1-inch main sensor, 200MP telephoto, Snapdragon 8 Elite Gen 5 and 6000mAh battery.",
    specs: [{label:"Display",value:"6.9-inch 1-120Hz OLED"},{label:"Processor",value:"Snapdragon 8 Elite Gen 5"},{label:"Camera",value:"50MP main + 200MP telephoto + 50MP ultrawide"},{label:"Battery",value:"6000mAh, 90W wired"}],
    variants: [{type:"Storage",options:["512GB","1TB"]},{type:"Color",options:["Black","White","Green"]}], createdAt:"2026-03-01"
  },
  {
    id: "p011", slug: "redmi-note-17-pro-plus-5g", name: "Redmi Note 17 Pro+ 5G", brand: "Redmi", category: "smartphones",
    price: 610000, images: [image("photo-1598327105666-5b89351aff97")], rating: 0, reviewCount: 0, stock: 24, bestSeller: true,
    description: "A high-value Redmi phone with a large AMOLED display, 200MP camera and a high-capacity battery with fast charging.",
    specs: [{label:"Display",value:"AMOLED, 120Hz"},{label:"Camera",value:"200MP main camera"},{label:"Battery",value:"6500mAh"},{label:"Charging",value:"100W HyperCharge"}],
    variants: [{type:"Storage",options:["256GB","512GB"]},{type:"Color",options:["Black","Blue","Silver"]}], createdAt:"2026-01-15"
  },
  {
    id: "p012", slug: "macbook-air-13-m5-512gb", name: "MacBook Air 13-inch M5", brand: "Apple", category: "computing",
    price: 2350000, images: [image("photo-1496181133206-80ce9b88a853")], rating: 0, reviewCount: 0, stock: 7, featured: true, bestSeller: true,
    description: "Apple's current thin-and-light laptop with the M5 chip, Liquid Retina display and up to 18 hours of battery life.",
    specs: [{label:"Display",value:"13.6-inch Liquid Retina"},{label:"Chip",value:"Apple M5"},{label:"Memory",value:"16GB unified memory"},{label:"Storage",value:"512GB SSD"}],
    variants: [{type:"Storage",options:["512GB","1TB","2TB"]},{type:"Color",options:["Sky Blue","Silver","Starlight","Midnight"]}], createdAt:"2026-03-11"
  },
  {
    id: "p013", slug: "macbook-pro-14-m5-512gb", name: "MacBook Pro 14-inch M5", brand: "Apple", category: "computing",
    price: 3150000, images: [image("photo-1517336714731-489689fd1ca8")], rating: 0, reviewCount: 0, stock: 5, featured: true,
    description: "A professional MacBook built for demanding creative and development workflows, powered by the M5 family of chips.",
    specs: [{label:"Display",value:"14.2-inch Liquid Retina XDR"},{label:"Chip",value:"Apple M5"},{label:"Memory",value:"16GB unified memory"},{label:"Storage",value:"512GB SSD"}],
    variants: [{type:"Storage",options:["512GB","1TB","2TB"]},{type:"Color",options:["Space Black","Silver"]}], createdAt:"2026-03-11"
  },
  {
    id: "p014", slug: "ipad-pro-11-inch", name: "iPad Pro 11-inch", brand: "Apple", category: "computing",
    price: 1850000, images: [image("photo-1544244015-0df4b3ffc6b0")], rating: 0, reviewCount: 0, stock: 10, featured: true,
    description: "A powerful current iPad Pro for creative work, study and entertainment, with an ultra-thin design and USB-C/Thunderbolt connectivity.",
    specs: [{label:"Display",value:"11-inch Ultra Retina XDR"},{label:"Storage",value:"256GB to 2TB"},{label:"Port",value:"Thunderbolt / USB 4"},{label:"Battery",value:"Up to 10 hours"}],
    variants: [{type:"Storage",options:["256GB","512GB","1TB","2TB"]},{type:"Color",options:["Silver","Space Black"]}], createdAt:"2026-03-01"
  },
  {
    id: "p015", slug: "airpods-pro-3", name: "AirPods Pro 3", brand: "Apple", category: "audio",
    price: 485000, images: [image("photo-1606220945770-b5b6c2c55bf1")], rating: 0, reviewCount: 0, stock: 30, featured: true, bestSeller: true,
    description: "Apple's current premium earbuds with active noise cancellation, heart-rate sensing during workouts and USB-C MagSafe charging.",
    specs: [{label:"ANC",value:"Active Noise Cancellation"},{label:"Battery",value:"Up to 8 hours with ANC"},{label:"Water Resistance",value:"IP57"},{label:"Charging",value:"USB-C MagSafe case"}],
    variants: [{type:"Color",options:["White"]}], createdAt:"2025-09-19"
  },
  {
    id: "p016", slug: "airpods-5", name: "AirPods 5", brand: "Apple", category: "audio",
    price: 320000, images: [image("photo-1590658268037-6bf12165a8df")], rating: 0, reviewCount: 0, stock: 35, bestSeller: true,
    description: "The current-generation everyday AirPods with a redesigned fit, Apple ecosystem integration and an optional Active Noise Cancellation model.",
    specs: [{label:"Connectivity",value:"Bluetooth wireless"},{label:"Charging",value:"USB-C case"},{label:"Features",value:"Spatial Audio and Siri interactions"}],
    variants: [{type:"Color",options:["White"]}], createdAt:"2026-09-19"
  },
  {
    id: "p017", slug: "samsung-galaxy-buds4-pro", name: "Galaxy Buds4 Pro", brand: "Samsung", category: "audio",
    price: 365000, images: [image("photo-1590658006821-08d9f0f6f5f1")], rating: 0, reviewCount: 0, stock: 25, featured: true,
    description: "Samsung's current premium Galaxy earbuds, designed to pair with the latest Galaxy phones and deliver high-fidelity wireless audio.",
    specs: [{label:"Audio",value:"Hi-Fi wireless audio"},{label:"Connectivity",value:"Bluetooth"},{label:"Ecosystem",value:"Galaxy device integration"}],
    variants: [{type:"Color",options:["Black","Silver"]}], createdAt:"2026-03-11"
  },
  {
    id: "p018", slug: "samsung-galaxy-watch9", name: "Galaxy Watch9", brand: "Samsung", category: "smart-devices",
    price: 520000, images: [image("photo-1544117519-31a4b719223d")], rating: 0, reviewCount: 0, stock: 14, featured: true,
    description: "Samsung's current smartwatch with health, fitness and Galaxy ecosystem features in a modern wearable design.",
    specs: [{label:"Display",value:"AMOLED touchscreen"},{label:"Tracking",value:"Health and fitness tracking"},{label:"Connectivity",value:"Bluetooth / optional LTE"}],
    variants: [{type:"Size",options:["40mm","44mm"]},{type:"Color",options:["Silver","Graphite"]}], createdAt:"2026-07-01"
  },
  {
    id: "p019", slug: "samsung-galaxy-tab-s11-ultra", name: "Galaxy Tab S11 Ultra", brand: "Samsung", category: "computing",
    price: 1450000, images: [image("photo-1544244015-0df4b3ffc6b0")], rating: 0, reviewCount: 0, stock: 6, featured: true,
    description: "A large premium Android tablet with Galaxy AI and S Pen support for productivity, study and creative work.",
    specs: [{label:"Display",value:"14.6-inch AMOLED"},{label:"Input",value:"S Pen support"},{label:"Connectivity",value:"Wi-Fi / 5G variants"}],
    variants: [{type:"Storage",options:["256GB","512GB","1TB"]},{type:"Color",options:["Gray","Silver"]}], createdAt:"2025-09-01"
  },
  {
    id: "p020", slug: "apple-watch-series-11", name: "Apple Watch Series 11", brand: "Apple", category: "smart-devices",
    price: 620000, images: [image("photo-1579586337278-3befd40fd17a")], rating: 0, reviewCount: 0, stock: 12, bestSeller: true,
    description: "A current Apple Watch for fitness, notifications, safety features and everyday health tracking.",
    specs: [{label:"Display",value:"Always-On Retina display"},{label:"Features",value:"Health and fitness tracking"},{label:"Connectivity",value:"GPS / optional cellular"}],
    variants: [{type:"Size",options:["42mm","46mm"]},{type:"Color",options:["Jet Black","Silver","Rose Gold"]}], createdAt:"2025-09-19"
  },
  {
    id: "p021", slug: "anker-737-power-bank", name: "Anker 737 Power Bank", brand: "Anker", category: "electronics",
    price: 145000, images: [image("photo-1609091839311-d5365f9ff1c5")], rating: 0, reviewCount: 0, stock: 20, bestSeller: true,
    description: "A high-output portable power bank with a built-in display for monitoring charging performance and battery level.",
    specs: [{label:"Capacity",value:"24,000mAh"},{label:"Output",value:"Up to 140W"},{label:"Ports",value:"USB-C and USB-A"}],
    createdAt:"2024-06-01"
  },
  {
    id: "p022", slug: "sony-wh-1000xm6", name: "Sony WH-1000XM6", brand: "Sony", category: "audio",
    price: 650000, images: [image("photo-1505740420928-5e560c06d30e")], rating: 0, reviewCount: 0, stock: 13, featured: true,
    description: "Sony's premium over-ear wireless headphones with advanced noise cancellation and a long-listening comfort focus.",
    specs: [{label:"Type",value:"Over-ear wireless headphones"},{label:"Noise Control",value:"Active Noise Cancellation"},{label:"Connectivity",value:"Bluetooth"}],
    variants: [{type:"Color",options:["Black","Platinum Silver"]}], createdAt:"2025-05-15"
  }
];