import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import subcategories from '../Database/subcategories';
import ProductCard from '../Components/ProductCard';
import FilterSortBar from '../Components/FilterSortBar';

const getAvailableSizes = (products) => {
  const sizeSet = new Set();
  products.forEach(product => {
    product.colors?.forEach(color => {
      color.sizes?.forEach(sizeObj => {
        if (sizeObj.stock > 0) sizeSet.add(sizeObj.size);
      });
    });
  });

  const order = { '28':1, '30':2, '32':3, '34':4, '36':5, 'XXS': 6, 'XS': 7, 'S': 8, 'M': 9, 'L': 10, 'XL': 11, 'XXL': 12 };
  return Array.from(sizeSet).sort((a, b) => {
    if (order[a] && order[b]) return order[a] - order[b];
    return a.localeCompare(b, undefined, { numeric: true });
  });
};

export default function CollectionPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get('sort') || 'featured';
  const [selectedSizes, setSelectedSizes] = useState([]);
  
  // Real DB States
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch real products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const result = await response.json();

        if (result.success) {
          const mappedProducts = result.data.map(p => ({
            id: p._id,
            slug: p._id, 
            name: p.name,
            price: p.price,
            isSale: p.isOnSale,
            isNew: p.tags?.includes('New'),
            masterCategory: p.masterCategory,
            productType: p.productType,
            releaseDate: p.createdAt,
            colors: p.variants.map(v => ({
              id: v._id,
              name: v.colorName,
              hex: v.hexCode,
              images: v.images && v.images.length > 0 
                ? v.images.map(img => ({ url: `http://localhost:5000/${img.replace(/\\/g, '/')}` }))
                : [{ url: 'https://via.placeholder.com/400x500?text=No+Image' }],
              sizes: v.sizes.map(s => ({ size: s.size, stock: s.stock, id: s._id }))
            }))
          }));
          setAllProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. BULLETPROOF CATEGORY MATCHING
  const currentCategory = useMemo(() => {
    if (!slug) return null;
    
    // Clean up the slug (removes trailing spaces and makes it lowercase)
    const cleanSlug = slug.toLowerCase().trim();

    // Check Broad Categories first (handles both "men" and "mens" gracefully)
    if (cleanSlug === 'men' || cleanSlug === 'mens') {
      return { label: "Shop Men's", masterCategory: "Men", isBroad: true };
    }
    if (cleanSlug === 'women' || cleanSlug === 'womens') {
      return { label: "Shop Women's", masterCategory: "Women", isBroad: true };
    }

    // Check strict subcategories file
    const foundSubcategory = subcategories?.find(sub => sub.slug === cleanSlug);
    if (foundSubcategory) return foundSubcategory;

    // FALLBACK: If it's STILL not found, but looks like a valid route (e.g., "men-shirts"), guess it dynamically!
    if (cleanSlug.includes('men-') || cleanSlug.includes('women-')) {
      const parts = cleanSlug.split('-');
      const master = parts[0].includes('women') ? 'Women' : 'Men';
      // Capitalize the rest for the product type (e.g., "t-shirts" -> "T-Shirts")
      const type = parts.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
      
      return {
        label: `${master}'s ${type}`,
        masterCategory: master,
        productType: type,
        isBroad: false
      };
    }

    return null; // Only fails if it's absolute gibberish
  }, [slug]);

  useEffect(() => {
    setSelectedSizes([]);
  }, [currentCategory]);

  // 3. BULLETPROOF PRODUCT FILTERING (Case-insensitive)
  const categoryProducts = useMemo(() => {
    if (!currentCategory) return [];
    
    return allProducts.filter(product => {
      // Safety check: ensure backend fields exist
      if (!product.masterCategory || !product.productType) return false;

      // Broad Match (e.g. "Men" matches "Men")
      if (currentCategory.isBroad) {
        return product.masterCategory.toLowerCase() === currentCategory.masterCategory.toLowerCase();
      }
      
      // Strict Match (e.g. "Men" AND "Shirts")
      return product.masterCategory.toLowerCase() === currentCategory.masterCategory.toLowerCase() && 
             product.productType.toLowerCase() === currentCategory.productType.toLowerCase();
    });
  }, [allProducts, currentCategory]);

  const availableSizes = useMemo(() => getAvailableSizes(categoryProducts), [categoryProducts]);

  const displayedProducts = useMemo(() => {
    let filtered = [...categoryProducts];

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => {
        return product.colors.some(color => 
          color.sizes.some(sizeObj => selectedSizes.includes(sizeObj.size) && sizeObj.stock > 0)
        );
      });
    }

    if (currentSort === 'newest') {
      filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (currentSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [categoryProducts, currentSort, selectedSizes]);

  // View Renders
  if (isLoading) {
    return <div className="py-32 text-center text-xl font-central tracking-widest mt-20">LOADING COLLECTION...</div>;
  }

  if (!currentCategory) {
    return (
      <div className="py-32 text-center text-2xl font-central mt-20 flex flex-col items-center gap-4">
        <p>Category not found.</p>
        <p className="text-sm text-gray-500">Current URL slug: <span className="font-bold text-black">{slug}</span></p>
      </div>
    );
  }

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSearchParams(prev => { prev.set('sort', newSort); return prev; });
  };

  const handleToggleSize = (size) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 md:px-8 py-16 lg:py-24 mt-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="font-central text-3xl md:text-4xl font-bold uppercase tracking-wider text-nav-dark">
          {currentCategory.label}
        </h1>
      </div>

      <FilterSortBar 
        availableSizes={availableSizes} 
        selectedSizes={selectedSizes} 
        onToggleSize={handleToggleSize} 
        currentSort={currentSort} 
        onSortChange={handleSortChange} 
        productCount={displayedProducts.length} 
      />

      <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-10 md:gap-x-6 md:gap-y-16">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {displayedProducts.length === 0 && (
        <div className="text-center py-20 text-gray-500 font-central tracking-widest uppercase">
          No products match your selected filters.
        </div>
      )}
    </div>
  );
}