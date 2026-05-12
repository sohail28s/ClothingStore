const bottoms = [
  // ── PRODUCT 1: DENIM PANT ────────────────────────────────────────
  {
    id:            "bottom_001",
    subcategoryId: "sub_mens_denim",
    type:          "MENS DENIM",
    name:          "Nomad Selvedge Straight Jean",
    slug:          "nomad-selvedge-straight-jean",
    price:         110,
    currency:      "GBP",
    description:   "14oz Japanese selvedge denim. Raw and unwashed, built to fade beautifully over time with your lifestyle.",
    material:      "100% Selvedge Cotton Denim",
    fit:           "Straight Leg",
    isNew:         true,
    isSale:        false,
    salePercent:   null,
    tags:          ["New", "Trending", "Premium"],
    releaseDate:   "2026-03-15T10:00:00Z",

    colors: [
      {
        name: "Raw Indigo",
        hex:  "#1A2421",
        images: [
          { url: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2000", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2000", alt: "Back view", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2000", alt: "Selvedge ID Detail", isPrimary: false },
        ],
        sizes: [
          { size: "28", stock: 5 }, { size: "30", stock: 15 }, { size: "32", stock: 25 },
          { size: "34", stock: 20 }, { size: "36", stock: 10 }, { size: "38", stock: 2 },
        ],
      },
      {
        name: "Washed Black",
        hex:  "#2C2C2A",
        images: [
          { url: "https://images.unsplash.com/photo-1584328690367-270830765955?q=80&w=2000", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1584328690367-270830765955?q=80&w=2000", alt: "Back view", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1584328690367-270830765955?q=80&w=2000", alt: "Hardware Detail", isPrimary: false },
        ],
        sizes: [
          { size: "28", stock: 2 }, { size: "30", stock: 8 }, { size: "32", stock: 12 },
          { size: "34", stock: 10 }, { size: "36", stock: 4 }, { size: "38", stock: 0 },
        ],
      }
    ],
  },

  // ── PRODUCT 2: COTTON PANT ───────────────────────────────────────
  {
    id:            "bottom_002",
    subcategoryId: "sub_mens_bottoms",
    type:          "MENS BOTTOMS",
    name:          "Service Fatigue Pant",
    slug:          "service-fatigue-pant",
    price:         85,
    currency:      "GBP",
    description:   "Classic military-inspired utility pants. Cut from heavy cotton herringbone twill with large patch pockets.",
    material:      "100% Cotton Herringbone Twill",
    fit:           "Relaxed Straight",
    isNew:         false,
    isSale:        false,
    salePercent:   null,
    tags:          ["essentials", "Workwear"],
    releaseDate:   "2025-09-20T08:30:00Z",

    colors: [
      {
        name: "Olive Drab",
        hex:  "#4A5D23",
        images: [
          { url: "https://images.unsplash.com/photo-1624378440845-1250cb4a0551?q=80&w=2000", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1624378440845-1250cb4a0551?q=80&w=2000", alt: "Back view", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1624378440845-1250cb4a0551?q=80&w=2000", alt: "Pocket Detail", isPrimary: false },
        ],
        sizes: [
          { size: "28", stock: 8 }, { size: "30", stock: 18 }, { size: "32", stock: 30 },
          { size: "34", stock: 22 }, { size: "36", stock: 15 }, { size: "38", stock: 5 },
        ],
      },
      {
        name: "Tobacco Brown",
        hex:  "#8A5A44",
        images: [
          { url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=2000", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=2000", alt: "Back view", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=2000", alt: "Fabric Detail", isPrimary: false },
        ],
        sizes: [
          { size: "28", stock: 0 }, { size: "30", stock: 5 }, { size: "32", stock: 10 },
          { size: "34", stock: 12 }, { size: "36", stock: 4 }, { size: "38", stock: 0 },
        ],
      }
    ],
  },

  // ── PRODUCT 3: TROUSERS ──────────────────────────────────────────
  {
    id:            "bottom_003",
    subcategoryId: "sub_mens_bottoms",
    type:          "MENS TROUSERS",
    name:          "Wayfarer Pleated Trouser",
    slug:          "wayfarer-pleated-trouser",
    price:         95,
    currency:      "GBP",
    description:   "A wider, relaxed silhouette featuring a single front pleat. Cut from a mid-weight cotton-linen blend for versatile styling.",
    material:      "60% Cotton, 40% Linen",
    fit:           "Relaxed Tapered",
    isNew:         true,
    isSale:        false,
    salePercent:   null,
    tags:          ["New", "Trending", "Smart Casual"],
    releaseDate:   "2026-04-01T12:00:00Z",

    colors: [
      {
        name: "Charcoal Grey",
        hex:  "#36454F",
        images: [
          { url: "https://images.unsplash.com/photo-1594938328870-9623159c8c99?q=80&w=2000", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1594938328870-9623159c8c99?q=80&w=2000", alt: "Side view", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1594938328870-9623159c8c99?q=80&w=2000", alt: "Pleat Detail", isPrimary: false },
        ],
        sizes: [
          { size: "28", stock: 4 }, { size: "30", stock: 10 }, { size: "32", stock: 15 },
          { size: "34", stock: 15 }, { size: "36", stock: 8 }, { size: "38", stock: 2 },
        ],
      },
      {
        name: "Deep Navy",
        hex:  "#1B263B",
        images: [
          { url: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=2000", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=2000", alt: "Side view", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=2000", alt: "Hem Detail", isPrimary: false },
        ],
        sizes: [
          { size: "28", stock: 2 }, { size: "30", stock: 8 }, { size: "32", stock: 12 },
          { size: "34", stock: 10 }, { size: "36", stock: 5 }, { size: "38", stock: 1 },
        ],
      }
    ],
  },

  // ── PRODUCT 4: SHORTS ────────────────────────────────────────────
  {
    id:            "bottom_004",
    subcategoryId: "sub_mens_bottoms",
    type:          "MENS SHORTS",
    name:          "Deck Utility Short",
    slug:          "deck-utility-short",
    price:         55,
    currency:      "GBP",
    description:   "Garment-dyed for a sun-faded look. Features an elasticated waist with drawstring, built for everyday summer wear.",
    material:      "100% Organic Cotton Poplin",
    fit:           "Regular (7 inch inseam)",
    isNew:         false,
    isSale:        true,
    salePercent:   20,
    tags:          ["Sale", "Active Wear"],
    releaseDate:   "2025-05-10T09:00:00Z",

    colors: [
      {
        name: "Desert Sand",
        hex:  "#D2B48C",
        images: [
          { url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=2000", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=2000", alt: "Back view", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=2000", alt: "Drawstring Detail", isPrimary: false },
        ],
        sizes: [
          { size: "28", stock: 10 }, { size: "30", stock: 20 }, { size: "32", stock: 35 },
          { size: "34", stock: 30 }, { size: "36", stock: 15 }, { size: "38", stock: 8 },
        ],
      },
      {
        name: "Faded Black",
        hex:  "#2E2E2E",
        images: [
          { url: "https://images.unsplash.com/photo-1552925662-604735c02115?q=80&w=2000", alt: "Front view", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1552925662-604735c02115?q=80&w=2000", alt: "Back view", isPrimary: false },
          { url: "https://images.unsplash.com/photo-1552925662-604735c02115?q=80&w=2000", alt: "Pocket Detail", isPrimary: false },
        ],
        sizes: [
          { size: "28", stock: 5 }, { size: "30", stock: 12 }, { size: "32", stock: 18 },
          { size: "34", stock: 15 }, { size: "36", stock: 5 }, { size: "38", stock: 0 },
        ],
      }
    ],
  }
];

export default bottoms;