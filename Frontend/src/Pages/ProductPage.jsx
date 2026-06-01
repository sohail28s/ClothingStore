import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContext'; // 👈 ADD THIS

export default function ProductPage() {
  const { addToCart } = useCart();
  const { slug } = useParams(); // This is the MongoDB _id
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

// 1. Added 'login'
  const { currentUser, token, login } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.wishlist && product) {
      const pId = String(product.id || product._id);
      const inWishlist = currentUser.wishlist.some(item => 
        String(item._id || item) === pId
      );
      setIsWishlisted(inWishlist);
    }
  }, [currentUser, product]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in to save items to your wishlist.");
      return;
    }

    const pId = String(product.id || product._id);
    setIsWishlisted(!isWishlisted); // Instantly fill the heart

    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/user/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: pId })
      });
      const result = await response.json();

      if (response.ok && result.status === "Success") {
        // 2. CRITICAL FIX: Update the global React state
        login(token, { ...currentUser, wishlist: result.data });
      } else {
        setIsWishlisted(!isWishlisted); // Revert if API says fail
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      setIsWishlisted(!isWishlisted);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${slug}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          const p = result.data;
          
          // Map backend data to match the frontend UI perfectly
          const mappedProduct = {
            id: p._id,
            slug: p._id,
            name: p.name,
            description: p.description || '',
            price: p.price,
            isSale: p.isOnSale,
            salePercent: 20, 
            isNew: p.tags?.includes('New'),
            tags: p.tags || [],
            masterCategory: p.masterCategory,
            productType: p.productType,
            colors: (p.variants || []).map(v => ({
              id: v._id,
              name: v.colorName,
              hex: v.hexCode,
              // Check if image is local path or full URL
              images: v.images && v.images.length > 0 
                ? v.images.map(img => ({ 
                    url: img.startsWith('http') ? img : `${import.meta.env.VITE_API_BASE_URL}/${img.replace(/\\/g, '/')}` 
                  })) 
                : [{ url: 'https://via.placeholder.com/400x500?text=No+Image' }],
              sizes: (v.sizes || []).map(s => ({ 
                size: s.size, 
                stock: s.stock, 
                id: s._id 
              }))
            }))
          };
          
          setProduct(mappedProduct);
          setSelectedColorIdx(0);
          setSelectedSize(null);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const handleColorChange = (idx) => {
    setSelectedColorIdx(idx);
    setSelectedSize(null);
  };

  if (isLoading) {
    return <div className="py-32 text-center text-xl font-central tracking-widest mt-20">LOADING PRODUCT...</div>;
  }

  // Safety check to ensure product and colors array exist
  if (!product || !product.colors || product.colors.length === 0) {
    return (
      <div className="py-32 text-center text-2xl font-central uppercase tracking-widest text-nav-dark mt-20">
        Product not found.
      </div>
    );
  }

  const activeColor = product.colors[selectedColorIdx];
  
  // Extra safety for activeColor
  if (!activeColor) return null;

  const displayTitle = `${product.name} - ${activeColor.name}`;
  
  // Safe string replacement for description
  const displayDescription = product.description.includes('{color}') 
    ? product.description.replace('{color}', activeColor.name.toLowerCase())
    : product.description;

  const finalPrice = product.isSale ? product.price * (1 - product.salePercent / 100) : product.price;

  return (
    <div className="w-full bg-white flex flex-col lg:flex-row relative mt-[64px] lg:mt-[80px] border-t border-nav-border animate-in fade-in duration-500">
      
      {/* LEFT SIDE: Image Grid */}
      <div className="w-full lg:w-[60%] flex flex-col border-r border-nav-border">
        <div className="grid grid-cols-2 gap-[1px] bg-nav-border">
          {(activeColor.images || []).map((img, idx) => (
            <div key={idx} className={`relative bg-[#f5f5f5] ${idx === 2 ? 'col-span-2' : 'col-span-1 aspect-[4/5]'}`}>
              <img 
                src={img.url} 
                alt={`${displayTitle} - View ${idx + 1}`} 
                className={`w-full object-cover object-center ${idx === 2 ? 'h-auto' : 'h-full'}`} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Product Details Sticky */}
      <div className="w-full lg:w-[40%] bg-white lg:sticky lg:top-[81px] h-fit flex flex-col">
        <div className="p-6 md:p-10 lg:p-14 flex flex-col gap-8">
          
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap gap-2">
              {product.isNew && (
                <span className="bg-transparent border border-nav-dark px-2 py-1 text-[9px] uppercase font-central font-bold tracking-widest text-nav-dark">
                  New
                </span>
              )}
            </div>
            
            {/* <button className="flex items-center justify-center w-8 h-8 rounded-full border border-nav-dark hover:bg-gray-100 transition-colors">
              <svg className="w-4 h-4 text-nav-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5L12 15.5l-5.5 2.5v-11a2 2 0 012-2h7a2 2 0 012 2v11z" />
              </svg>
            </button> */}


            {/* Wishlist Button */}
            <button 
              onClick={handleWishlistToggle}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-nav-dark hover:bg-gray-100 transition-colors"
            >
              <svg className={`w-4 h-4 text-nav-dark transition-all ${isWishlisted ? 'fill-nav-dark' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5L12 15.5l-5.5 2.5v-11a2 2 0 012-2h7a2 2 0 012 2v11z" />
              </svg>
            </button>
          </div>

          {/* Title & Price */}
          <div className="flex flex-col gap-4">
            <h1 className="font-central text-xl md:text-2xl font-bold uppercase tracking-wider leading-snug text-nav-dark">
              {displayTitle}
            </h1>
            <div className="font-ballinger text-lg tracking-widest text-nav-dark font-medium flex gap-3">
              {product.isSale ? (
                <>
                  <span className="line-through opacity-50">PKR {product.price.toLocaleString()}</span>
                  <span className="text-red-600">PKR {finalPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </>
              ) : (
                <span>PKR {product.price.toLocaleString()}</span>
              )}
            </div>
          </div>

          {/* Description & Reviews */}
          <div className="flex flex-col gap-4 border-b border-nav-border pb-8">
            <p className="font-ballinger text-sm leading-relaxed text-gray-600">
              {displayDescription}
            </p>
            <div className="flex items-center gap-1 text-[#a58c69]">
              {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
              ))}
              <span className="text-xs text-gray-500 ml-2 font-ballinger tracking-wider uppercase">(3 Reviews)</span>
            </div>
          </div>

          {/* Colors */}
          <div className="flex flex-col gap-4">
            <div className="font-central text-[11px] uppercase tracking-widest font-bold">
              <span className="text-gray-400">Colour: </span>
              <span className="text-nav-dark">{activeColor.name}</span>
            </div>
            {product.colors.length > 1 && (
              <div className="flex gap-3 items-center">
                {product.colors.map((color, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleColorChange(idx)} 
                    className={`w-6 h-6 rounded-full border transition-all p-[2px] ${selectedColorIdx === idx ? 'border-nav-dark' : 'border-gray-300 hover:border-gray-500'}`}
                  >
                    <div className="w-full h-full rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center font-central text-[11px] uppercase tracking-widest font-bold">
              <span className="text-gray-400">Select Size</span>
              <button className="underline underline-offset-4 hover:opacity-60 transition-opacity">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(activeColor.sizes || []).map((sizeObj, idx) => {
                const isOutOfStock = sizeObj.stock === 0;
                const isSelected = selectedSize === sizeObj.size;
                return (
                  <button 
                    key={idx} 
                    disabled={isOutOfStock} 
                    onClick={() => setSelectedSize(sizeObj.size)} 
                    className={`min-w-[54px] h-[36px] px-3 border flex items-center justify-center font-central text-xs font-bold uppercase tracking-widest transition-colors ${isOutOfStock ? 'opacity-30 cursor-not-allowed border-gray-300 text-gray-400 bg-gray-50' : isSelected ? 'border-nav-dark bg-nav-dark text-white' : 'border-gray-300 text-nav-dark hover:border-nav-dark'}`}
                  >
                    {sizeObj.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checkout Controls */}
       {/* Checkout Controls */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="bg-[#edecea] text-nav-dark text-center py-3 font-central text-[10px] uppercase font-bold tracking-widest w-full">
                Free Shipping On Orders Over PKR 10,000
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity Counter */}
                <div className="flex items-center justify-between border border-nav-dark h-[52px] px-6 sm:w-[140px] shrink-0">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    className="text-gray-500 hover:text-nav-dark font-central text-xl pb-1 outline-none"
                  >
                    -
                  </button>
                  <span className="font-central text-sm font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)} 
                    className="text-gray-500 hover:text-nav-dark font-central text-xl pb-1 outline-none"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button 
                  disabled={!selectedSize} 
                  // 👇 Notice we added 'quantity' as the 4th parameter here!
                  onClick={() => addToCart(product, activeColor, selectedSize, quantity)} 
                  className={`flex-1 h-[52px] flex items-center justify-center font-central text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 ${selectedSize ? 'bg-nav-dark text-white hover:bg-black' : 'bg-gray-200 text-gray-500 cursor-not-allowed border-transparent'}`}
                >
                  {selectedSize 
                    ? `Add to Bag - PKR ${(finalPrice * quantity).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` 
                    : 'Select Size'}
                </button>
              </div>

              <p className="text-center font-ballinger text-[10px] text-gray-400 uppercase tracking-widest mt-2">
                Secure payments via Credit Card & Cash on Delivery
              </p>
            </div>
          
        </div>
      </div>
    </div>
  );
}