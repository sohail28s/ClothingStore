export const navigationData = [
  {
    id: 'nav_men',
    label: "Men's",
    href: '/collections/men', 
    megaMenu: {
      defaultImage: "/Images/Hero/new1.webp",
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

        // We use URL query parameters like ?sort=newest for these generic lists
        { label: "New Arrivals", href: "/collections/men?sort=newest" }, 
        { label: "Trending", href: "/collections/men?sort=featured" },
        { label: "Sale", href: "/collections/men?sort=price-asc", isRed: true },
      ]
    }
  },







  {
    id: 'nav_women',
    label: "Women's",
    href: '/collections/women', // Matches the 'women' slug
    megaMenu: {
      defaultImage: "/Images/Hero/new2.jpg",
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
        { label: "Trending", href: "/collections/women?sort=featured" },
        { label: "Sale", href: "/collections/women?sort=price-asc", isRed: true },
      ]
    }
  },
  
];