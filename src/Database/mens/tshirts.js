const tshirts = [
  {
    id:            "tshirt_001",
    subcategoryId: "sub_mens_tshirts",
    type:          "MENS T-SHIRTS", 
    name:          "Getaway Boxy Longsleeve T-Shirt",
    slug:          "getaway-boxy-longsleeve-t-shirt",
    price:         50,
    currency:      "GBP",
    description:   "Our Getaway Long-Sleeve T-Shirt is a unisex boxy-fit and features an acid wash finish and a screen-printed graphic inspired by moto culture",
    material:      "100% Heavyweight Cotton",
    fit:           "Regular",
    isNew:         true,
    isSale:        false,
    salePercent:   null,
    tags:          ["New", "Trending", "essentials"], 
    releaseDate:   "2026-04-10T08:00:00Z", 

    colors: [
      {
        name: "Acid Wash",
        hex:  "#F5F0E8",
        images: [
          { url: "/Images/men/tshirts/1/1.jpg",  alt: "Front view",  isPrimary: true  },
          { url: "/Images/men/tshirts/1/2.jpg",   alt: "Back view",   isPrimary: false },
          { url: "/Images/men/tshirts/1/3.jpg",   alt: "Back view",   isPrimary: false },
          
        ],
        sizes: [
          { size: "XS",  stock: 8  },
          { size: "S",   stock: 20 },
          { size: "M",   stock: 25 },
          { size: "L",   stock: 18 },
          { size: "XL",  stock: 10 },
          { size: "XXL", stock: 4  },
        ],
      },
    ],
  },

  // ── PRODUCT 2 ──────────────────────────────────────────────────
  {
    id:            "tshirt_002",
    subcategoryId: "sub_mens_tshirts",
    type:          "MENS T-SHIRTS", 
    name:          "We Got What You Need T-Shirt",
    slug:          "pigment-dyed-tee",
    price:         42,
    currency:      "GBP",
    description:   "This classic crewneck features screen-printed graphics inspired by vintage motocross culture and a vintage white wash for a more lived-in feel.",
    fit:           "Boxy",
    isNew:         false,
    isSale:        true,
    salePercent:   15,
    tags:          ["Organic", "sale"], 
    releaseDate:   "2025-11-20T14:30:00Z", 

    colors: [
      {
        name: "Vintage White",
        hex:  "#ffffff",
        images: [
          { url: "/Images/men/tshirts/2/1.webp",  alt: "Front view",  isPrimary: true  },
          { url: "/Images/men/tshirts/2/2.webp",  alt: "Front view",  isPrimary: false  },
          { url: "/Images/men/tshirts/2/3.webp",  alt: "Front view",  isPrimary: false  },
         
        ],
        sizes: [
          { size: "XS",  stock: 0  },
          { size: "S",   stock: 12 },
          { size: "M",   stock: 18 },
          { size: "L",   stock: 14 },
          { size: "XL",  stock: 6  },
          { size: "XXL", stock: 2  },
        ],
      },
    ],
  },




  //products 3




  {
    id:            "longsleeve_001",
    subcategoryId: "sub_mens_tshirts",
    type:          "MENS LONGSLEEVES", 
    name:          "Speedway Champion Boxy T-shirt",
    slug:          "waffle-knit-longsleeve",
    price:         55,
    currency:      "GBP",
    description:   "The Speedway Champion T-shirt in {color} is a men’s boxy-fit tee made from mid-weight organic cotton. It features screen-printed graphics inspired by vintage thrifted tees and vinyl record stores.",
    material:      "100% Organic Cotton",
    fit:           "Relaxed",
    isNew:         true,
    isSale:        false,
    salePercent:   null,
    tags:          ["New", "Organic", "Trending"], 
    releaseDate:   "2026-03-25T10:00:00Z", 

    colors: [
      {
        name: "Washed Black",
        hex:  "#383737",
        images: [
          { url: "/Images/men/tshirts/3/1.jpg", alt: "Front view", isPrimary: true },
          { url: "/Images/men/tshirts/3/2.webp", alt: "Front view", isPrimary: false },
          { url: "/Images/men/tshirts/3/3.webp", alt: "Front view", isPrimary: false },
         
        ],
        sizes: [
          { size: "S", stock: 10 },
          { size: "M", stock: 15 },
          { size: "L", stock: 10 },
        ],
      },
      {
        name: "Yellow",
        hex:  "#d8b150",
        images: [
         { url: "/Images/men/tshirts/3/4.webp", alt: "Front view", isPrimary: true },
          { url: "/Images/men/tshirts/3/5.jpg", alt: "Front view", isPrimary: false },
          { url: "/Images/men/tshirts/3/6.jpg", alt: "Front view", isPrimary: false },
        ],
        sizes: [
          { size: "S", stock: 10 },
          { size: "M", stock: 15 },
          { size: "L", stock: 10 },
        ],
      },
    ],
  },






//product4







  {
    id:            "henley_001",
    subcategoryId: "sub_mens_tshirts",
    type:          "MENS HENLEYS", 
    name:          "Lucky Shot T-Shirt - Bone",
    slug:          "lucky-short-tshirt-bone",
    price:         48,
    currency:      "GBP",
    description:   "The Lucky Shot T-shirt in bone features screen-printed graphics inspired by the wild west.",
    material:      "95% Cotton, 5% Elastane",
    fit:           "Slim",
    isNew:         false,
    isSale:        false,
    salePercent:   null,
    tags:          ["Active Wear", "essentials"], 
    releaseDate:   "2025-08-12T09:00:00Z", 

    colors: [
      {
        name: "Bone",
        hex:  "#fffff",
        images: [
          { url: "/Images/men/tshirts/4/1.webp", alt: "Front view", isPrimary: true },
          { url: "/Images/men/tshirts/4/2.webp", alt: "Front view", isPrimary: false },
          { url: "/Images/men/tshirts/4/3.webp", alt: "Front view", isPrimary: false },
          
        ],
        sizes: [
          { size: "M", stock: 5 },
          { size: "L", stock: 2 },
          { size: "XL", stock: 0 },
        ],
      },
    ],
  },






  // ── PRODUCT 5 (NEW) ─────────────────────────────────────────────
  {
    id:            "jumper_001",
    subcategoryId: "sub_mens_tshirts",
    type:          "MENS JUMPERS", 
    name:          "Slow Sundays T-Shirt - Off White",
    slug:          "slowsunday-tshirt",
    price:         110,
    currency:      "GBP",
    description:   "The Slow Sundays T-shirt in off-white is a relaxed fit men’s graphic t-shirt made from a mid-weight 100% soft cotton jersey.",
    material:      "80% Lambswool, 20% Nylon",
    fit:           "Regular",
    isNew:         true,
    isSale:        false,
    salePercent:   null,
    tags:          ["New", "Layering"], 
    releaseDate:   "2026-02-15T09:00:00Z", 

    colors: [
      {
        name: "Off White",
        hex:  "#ffffff",
        images: [
          { url: "/Images/men/tshirts/5/1.webp", alt: "Front view", isPrimary: true },
          { url: "/Images/men/tshirts/5/2.webp", alt: "Detail view", isPrimary: false },
          { url: "/Images/men/tshirts/5/3.webp", alt: "Detail view", isPrimary: false },
        ],
        sizes: [
          { size: "S", stock: 8 },
          { size: "M", stock: 12 },
          { size: "L", stock: 14 },
          { size: "XL", stock: 6 },
        ],
      },
    ],
  },

  
];

export default tshirts;