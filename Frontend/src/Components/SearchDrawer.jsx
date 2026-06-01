import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Next.js users: import Link from 'next/link';

export default function SearchDrawer({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const inputRef = useRef(null);
  const drawerRef = useRef(null); // Ref to detect clicks outside

  {/* In SearchDrawer.jsx */}
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 1. If the click was on the toggle button itself, do nothing here. Let the Navbar handle it!
      if (event.target.closest('#search-toggle-btn')) {
        return;
      }

      // 2. Otherwise, if the click was outside the drawer, close it.
      if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  // 2. Focus input and fetch data ONLY when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // Fetch products only if we haven't loaded them yet
      if (products.length === 0) {
        fetchProducts();
      }
    } else {
      // Optional: Clear search term when closed
      setSearchTerm('');
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://app-backend-msic.onrender.com/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const jsonResponse = await response.json();
      
      if (jsonResponse.success && jsonResponse.data) {
        setProducts(jsonResponse.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    const productName = product.name || product.title || '';
    return productName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div 
      ref={drawerRef}
      className={`absolute top-full left-0 w-full bg-white shadow-2xl transition-all duration-300 overflow-hidden ${
        isOpen ? 'opacity-100 visible border-t border-nav-border' : 'opacity-0 invisible'
      }`}
      // Use a high max-height for the transition, but the inner content will dictate the actual height
      style={{ maxHeight: isOpen ? '800px' : '0' }}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col p-4 lg:p-8 gap-8 h-max">
        
        <div className="w-full flex flex-col h-full">
          {/* Search Input */}
          <form onSubmit={(e) => e.preventDefault()} className="relative mb-6 shrink-0">
            <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-4.197-4.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              placeholder="START TYPING..."
              className="w-full pl-10 pr-4 py-4 text-2xl font-central font-bold uppercase tracking-widest bg-transparent border-b-2 border-nav-border focus:border-black outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {/* Results Area */}
          <div className="w-full overflow-hidden pb-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-40 text-red-500 font-ballinger">
                Error loading products.
              </div>
            ) : !searchTerm ? (
              /* DEFAULT PLACEHOLDER (When search is empty) */
              <div className="flex justify-center items-center h-40 border-2 border-dashed border-nav-border rounded-lg bg-gray-50 text-gray-400 font-central uppercase tracking-widest text-sm">
                Start typing to search for products...
              </div>
            ) : filteredProducts.length === 0 ? (
              /* NO RESULTS */
              <div className="flex justify-center items-center h-40 text-gray-500 font-central uppercase tracking-widest">
                No products found for "{searchTerm}"
              </div>
            ) : (
              /* PRODUCT GRID (Exactly 4 items in 1 row) */
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                
                {/* slice(0, 4) ensures we only ever show a maximum of 4 products */}
                {filteredProducts.slice(0, 4).map((product) => {
                  
                  const productId = product._id;
                  const productName = product.name;
                  
                  let imagePath = null;
                  if (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0) {
                    imagePath = product.variants[0].images[0];
                  }

                  const backendUrl = 'https://app-backend-msic.onrender.com/';
                  const productImage = imagePath ? (imagePath.startsWith('http') ? imagePath : `${backendUrl}${imagePath}`) : null;

                  return (
                    <Link 
                      key={productId} 
                      to={`/products/${productId}`}
                      onClick={onClose}
                      className="group flex flex-col gap-3 cursor-pointer"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-sm">
                        {productImage ? (
                          <img 
                            src={productImage} 
                            alt={productName} 
                            loading="lazy"
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 font-ballinger text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                      
                      {/* Price & Title Div */}
                      <div className="flex flex-col items-center text-center">
                        <h3 className="font-central text-sm font-bold uppercase tracking-wide text-black line-clamp-1">
                          {productName}
                        </h3>
                        <div className="font-ballinger text-sm text-gray-600 mt-1">
                          Rs. {product.price}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}