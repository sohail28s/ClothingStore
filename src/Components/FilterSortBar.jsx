import React, { useState } from 'react';

export default function FilterSortBar({ availableSizes, selectedSizes, onToggleSize, currentSort, onSortChange, productCount }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="w-full mb-10">
      <div className="flex justify-between items-center border-y border-nav-border py-4 font-central text-xs font-bold uppercase tracking-widest">
        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 hover:opacity-60 transition-opacity">
          Filters {selectedSizes.length > 0 && `(${selectedSizes.length})`}
          <svg className={`w-4 h-4 transform transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>

        </button>

        <div className="flex items-center gap-4">
          <span className="text-gray-400 hidden sm:inline">{productCount} Products</span>
          <select value={currentSort} onChange={onSortChange} className="bg-transparent outline-none cursor-pointer hover:opacity-60 transition-opacity text-right">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {isFilterOpen && (
        <div className="py-6 border-b border-nav-border transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="font-central text-[11px] uppercase tracking-widest text-gray-500">Size</span>
              {selectedSizes.length > 0 && (
                <button onClick={() => selectedSizes.forEach(size => onToggleSize(size))} className="font-central text-[10px] uppercase tracking-widest underline underline-offset-4 text-gray-400 hover:text-nav-dark">
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button key={size} onClick={() => onToggleSize(size)} className={`min-w-[50px] h-[40px] px-3 border flex items-center justify-center font-central text-xs font-bold uppercase tracking-widest transition-colors ${isSelected ? 'border-nav-dark bg-nav-dark text-white' : 'border-gray-300 text-nav-dark hover:border-nav-dark'}`}>
                    {size}
                  </button>
                );
              })}
              {availableSizes.length === 0 && (
                <span className="text-sm text-gray-400 font-ballinger">No sizes available.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}