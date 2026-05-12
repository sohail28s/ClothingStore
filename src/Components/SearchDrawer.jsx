// src/components/SearchDrawer.jsx
import React, { useState, useEffect, useRef } from 'react';

export default function SearchDrawer({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null); // Create a reference to the input

  // Focus the input field when the drawer opens
  useEffect(() => {
    if (isOpen) {
      // Use a small timeout to ensure the drawer animation is underway before focusing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    // The drawer wrapper. With 'relative' header, 'top-full' sits right below navbar
    <div 
      className={`absolute top-full left-0 w-full bg-white shadow-2xl transition-all duration-300 overflow-hidden
        ${isOpen ? 'opacity-100 visible border-t border-nav-border' : 'opacity-0 invisible h-0'}`
      }
      style={{ maxHeight: isOpen ? '500px' : '0' }}
    >
      {/* Use max-w-7xl to align with navbar content */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row p-4 lg:p-8 gap-8 min-h-[400px]">
        
        {/* LEFT COLUMN: Suggestions & Trending */}
        <div className="w-full md:w-1/4 flex flex-col gap-6 shrink-0 md:border-r border-nav-border md:pr-4">
          <div>
            <h4 className="font-central text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              Suggestions
            </h4>
            <div className="text-sm font-central text-gray-400 italic">
              Previously Searched
            </div>
          </div>

          <div>
            <h4 className="font-central text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              Trending
            </h4>
            <ul className="flex flex-col gap-3 font-central text-sm uppercase tracking-wider">
              <li><a href="/collections/belts" className="hover:opacity-60 transition-opacity">Belts</a></li>
              <li><a href="/collections/caps" className="hover:opacity-60 transition-opacity">Caps</a></li>
              <li><a href="/collections/mens-gilets" className="hover:opacity-60 transition-opacity">Men's Vests</a></li>
              <li><a href="/collections/mens-outerwear" className="hover:opacity-60 transition-opacity">Jackets</a></li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Search Input & Placeholder for future results */}
        <div className="w-full md:w-3/4 flex flex-col">
          
          {/* Large Search Input, now with inputRef */}
          <form onSubmit={(e) => e.preventDefault()} className="relative mb-8shrink-0">
            <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-4.197-4.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input 
              ref={inputRef} // Attach the ref here
              type="search" 
              placeholder="START TYPING..." 
              className="w-full pl-10 pr-4 py-4 text-2xl font-central font-bold uppercase tracking-widest bg-transparent border-b-2 border-nav-border focus:border-black outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {/* PLACEHOLDER for Future Mock DB Results */}
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-nav-border rounded-lg bg-gray-50">
            <p className="font-central text-gray-500 uppercase tracking-wider text-sm">
              {searchTerm ? `Searching for "${searchTerm}"...` : "Product Results Grid Will Go Here"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}