const shirts = [
  {
    id:            "shirt_001",
    subcategoryId: "sub_mens_shirts",
    type:          "MENS SHIRTS",
    name:          "Wayfarer Flannel Overshirt",
    slug:          "wayfarer-flannel-overshirt",
    price:         85,
    currency:      "GBP",
    description:   "Heavyweight brushed cotton flannel. Built for layering, featuring twin chest pockets and durable corozo buttons.",
    material:      "100% Brushed Cotton",
    fit:           "Relaxed Overshirt",
    isNew:         true,
    isSale:        false,
    salePercent:   null,
    tags:          ["New", "Trending", "Layering"],
    releaseDate:   "2026-03-01T09:00:00Z",

    colors: [
      {
        name: "Rust Check",
        hex:  "#8A3B22",
        images: [
          { url: "https://images.unsplash.com/photo-1582855160867-27b508f7fbdf?q=80&w=1974", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1582855160867-27b508f7fbdf?q=80&w=1974",  alt: "Back view", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1604584288047-97d81ea199eb?q=80&w=2070", alt: "Fabric detail", isPrimary: false },
        ],
        sizes: [
          { size: "XS",  stock: 2  },
          { size: "S",   stock: 12 },
          { size: "M",   stock: 18 },
          { size: "L",   stock: 15 },
          { size: "XL",  stock: 6  },
          { size: "XXL", stock: 1  },
        ],
      },
      {
        name: "Forest Check",
        hex:  "#2F4F4F",
        images: [
         
          { url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=2070", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=2070",  alt: "Back view", isPrimary: false }, 
          { url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=2070",  alt: "Back view", isPrimary: false }, 
        ],
        sizes: [
          { size: "XS",  stock: 0  },
          { size: "S",   stock: 8  },
          { size: "M",   stock: 22 },
          { size: "L",   stock: 10 },
          { size: "XL",  stock: 4  },
          { size: "XXL", stock: 0  },
        ],
      },
    ],
  },

  // ── PRODUCT 2 ──────────────────────────────────────────────────
  {
    id:            "shirt_002",
    subcategoryId: "sub_mens_shirts",
    type:          "MENS SHIRTS",
    name:          "Classic Oxford Button-Down",
    slug:          "classic-oxford-button-down",
    price:         65,
    currency:      "GBP",
    description:   "A wardrobe staple. Mid-weight oxford cloth, garment-washed for a broken-in feel from day one.",
    material:      "100% Organic Oxford Cotton",
    fit:           "Regular",
    isNew:         false,
    isSale:        true,
    salePercent:   20,
    tags:          ["Organic", "essentials", "Sale"],
    releaseDate:   "2025-08-15T10:30:00Z",

    colors: [
      {
        name: "Vintage White",
        hex:  "#F5F5F0",
        images: [
          { url: "https://images.unsplash.com/photo-1600057041793-1e5b128b5b7e?q=80&w=1974", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1620005232742-8951db110e54?q=80&w=2070", alt: "Collar detail", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1620005232742-8951db110e54?q=80&w=2070", alt: "Collar detail", isPrimary: false },
        ],
        sizes: [
          { size: "XS",  stock: 10 },
          { size: "S",   stock: 25 },
          { size: "M",   stock: 30 },
          { size: "L",   stock: 20 },
          { size: "XL",  stock: 15 },
          { size: "XXL", stock: 8  },
        ],
      },
      {
        name: "Faded Navy",
        hex:  "#2A3441",
        images: [
          // Unsplash: Man in dark blue/navy shirt
          { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976",  alt: "Back view", isPrimary: false }, // Placeholder for back
          { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976",  alt: "Back view", isPrimary: false }, // Placeholder for back
        ],
        sizes: [
          { size: "XS",  stock: 5  },
          { size: "S",   stock: 12 },
          { size: "M",   stock: 14 },
          { size: "L",   stock: 8  },
          { size: "XL",  stock: 2  },
          { size: "XXL", stock: 0  },
        ],
      },
    ],
  },
  {
    id:            "shirt_003",
    subcategoryId: "sub_mens_shirts",
    type:          "MENS SHIRTS",
    name:          "Rugged Field Workshirt",
    slug:          "rugged-field-workshirt",
    price:         75,
    currency:      "GBP",
    description:   "Built for durability. Heavyweight cotton drill with reinforced elbows and large utility chest pockets.",
    material:      "100% Heavy Cotton Drill",
    fit:           "Regular Utility",
    isNew:         true,
    isSale:        false,
    salePercent:   null,
    tags:          ["New", "Trending", "essentials"],
    releaseDate:   "2026-04-05T09:00:00Z",

    colors: [
      {
        name: "Desert Khaki",
        hex:  "#C2B280",
        images: [
          { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=2070", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=1973", alt: "Detail view", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=1973", alt: "Detail view", isPrimary: false },
        ],
        sizes: [
          { size: "S",   stock: 10 },
          { size: "M",   stock: 25 },
          { size: "L",   stock: 20 },
          { size: "XL",  stock: 12 },
        ],
      },
      {
        name: "Charcoal",
        hex:  "#36454F",
        images: [
          { url: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1974", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1974", alt: "Front view", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1974", alt: "Front view", isPrimary: false },
        ],
        sizes: [
          { size: "M",   stock: 15 },
          { size: "L",   stock: 10 },
          { size: "XL",  stock: 5 },
        ],
      },
    ],
  },

  // ── PRODUCT 4 ──────────────────────────────────────────────────
  {
    id:            "shirt_004",
    subcategoryId: "sub_mens_shirts",
    type:          "MENS SHIRTS",
    name:          "Coastal Linen Shirt",
    slug:          "coastal-linen-shirt",
    price:         58,
    currency:      "GBP",
    description:   "Lightweight and breathable. Perfect for transition weather, featuring a relaxed band collar and natural horn buttons.",
    material:      "100% Organic Linen",
    fit:           "Relaxed",
    isNew:         false,
    isSale:        false,
    salePercent:   null,
    tags:          ["Organic", "essentials"],
    releaseDate:   "2026-03-20T10:00:00Z",

    colors: [
      {
        name: "Natural Sand",
        hex:  "#E6D5B8",
        images: [
          { url: "https://images.unsplash.com/photo-1594932224828-b4b059b6f68d?q=80&w=2080", alt: "Natural Linen Front", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1594932224828-b4b059b6f68d?q=80&w=2080", alt: "Natural Linen Front", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1594932224828-b4b059b6f68d?q=80&w=2080", alt: "Natural Linen Front", isPrimary: false },
        ],
        sizes: [
          { size: "XS",  stock: 4  },
          { size: "S",   stock: 12 },
          { size: "M",   stock: 18 },
          { size: "L",   stock: 8  },
        ],
      },
      {
        name: "Slate Blue",
        hex:  "#708090",
        images: [
          { url: "https://images.unsplash.com/photo-1607345366928-199e649ce86b?q=80&w=1974", alt: "Slate Blue Front", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1607345366928-199e649ce86b?q=80&w=1974", alt: "Slate Blue Front", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1607345366928-199e649ce86b?q=80&w=1974", alt: "Slate Blue Front", isPrimary: false },
        ],
        sizes: [
          { size: "S",   stock: 6  },
          { size: "M",   stock: 14 },
          { size: "L",   stock: 12 },
        ],
      },
    ],
  },

  // ── PRODUCT 5 ──────────────────────────────────────────────────
  {
    id:            "shirt_005",
    subcategoryId: "sub_mens_shirts",
    type:          "MENS SHIRTS",
    name:          "Technical Utility Overshirt",
    slug:          "technical-utility-overshirt",
    price:         95,
    currency:      "GBP",
    description:   "A hybrid layer designed for purposeful living. Water-repellent finish with hidden zip compartments and a ventilated back.",
    material:      "60% Nylon, 40% Cotton Ripstop",
    fit:           "Oversized",
    isNew:         false,
    isSale:        true,
    salePercent:   30,
    tags:          ["Active Wear", "Trending", "Sale"],
    releaseDate:   "2026-02-15T11:00:00Z",

    colors: [
      {
        name: "Phantom Black",
        hex:  "#1A1A1A",
        images: [
          { url: "https://images.unsplash.com/photo-1516257984411-c033c4a2066c?q=80&w=1974", alt: "Technical Black Front", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1516257984411-c033c4a2066c?q=80&w=1974", alt: "Technical Black Front", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1516257984411-c033c4a2066c?q=80&w=1974", alt: "Technical Black Front", isPrimary: false },
        ],
        sizes: [
          { size: "M",   stock: 20 },
          { size: "L",   stock: 15 },
          { size: "XL",  stock: 10 },
          { size: "XXL", stock: 5  },
        ],
      },
      {
        name: "Deep Moss",
        hex:  "#3E4C3F",
        images: [
          { url: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=1974", alt: "Deep Moss Front", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=1974", alt: "Deep Moss Front", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=1974", alt: "Deep Moss Front", isPrimary: false},
        ],
        sizes: [
          { size: "S",   stock: 8  },
          { size: "M",   stock: 12 },
          { size: "L",   stock: 4  },
        ],
      },
    ],
  },
];

export default shirts;