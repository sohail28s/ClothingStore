export const navigationData = [
  {
    id: 'nav_men',
    label: "Men's",
    href: '/collections/men', 
    megaMenu: {
      defaultImage: "https://pand.co/cdn/shop/files/Spring-4-desktop_0020_DSCF7604.jpg?v=1774449882&width=600",
      categories: [
        { label: "All Men's", href: "/collections/men" },
        {
          label: "Product Type",
          subLinks: [
            // These slugs perfectly match subcategories.js
            { label: "Shirts", href: "/collections/men-shirts" },
            { label: "T-Shirts", href: "/collections/men-t-shirts" },
            { label: "Pants", href: "/collections/men-pants" },
          ]
        },
        {
          label: "Collections",
          subLinks: [
            { label: "Activewear", href: "/collections/activewear" },
            { label: "State Champs", href: "/collections/state-champs" },
            { label: "Graphic T-Shirts", href: "/collections/graphic-tees" },
          ]
        },
        // We use URL query parameters like ?sort=newest for these generic lists
        { label: "New Arrivals", href: "/collections/men?sort=newest" }, 
        { label: "Trending", href: "/collections/trending" },
        { label: "Guides", href: "/pages/guides" },
        { label: "Back In Stock", href: "/collections/back-in-stock" },
        { label: "Best Sellers", href: "/collections/best-sellers" },
        { label: "Sale", href: "/collections/sale", isRed: true },
      ]
    }
  },
  {
    id: 'nav_women',
    label: "Women's",
    href: '/collections/women', // Matches the 'women' slug
    megaMenu: {
      defaultImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600",
      categories: [
        { label: "All Women's", href: "/collections/women" },
        {
          label: "Product Type",
          subLinks: [
            // Matches the Women's specific schema
            { label: "Shirts", href: "/collections/women-shirts" },
            { label: "Pants", href: "/collections/women-pants" },
            { label: "Skirts", href: "/collections/women-skirts" },
          ]
        },
        { label: "New Arrivals", href: "/collections/women?sort=newest" },
        { label: "Trending", href: "/collections/womens-trending" },
        { label: "Sale", href: "/collections/womens-sale", isRed: true },
      ]
    }
  },
  
];