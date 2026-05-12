// // src/components/ProductCard.jsx
// import React, { useState } from 'react';

// export default function ProductCard({ product }) {
//   // State for Color Selection and Image Cycling
//   const [selectedColorIdx, setSelectedColorIdx] = useState(0);
//   const [currentImageIdx, setCurrentImageIdx] = useState(0);

//   // Derived Variables
//   const activeColor = product.colors[selectedColorIdx];
//   const activeImages = activeColor.images;
//   const currentImage = activeImages[currentImageIdx];

//   // Dynamic Title (Appends the color name cleanly)
//   const displayTitle = `${product.name} - ${activeColor.name}`;

//   // Handlers
//   const handleColorChange = (idx) => {
//     setSelectedColorIdx(idx);
//     setCurrentImageIdx(0); // Reset to first image when changing colors
//   };

//   const nextImage = (e) => {
//     e.preventDefault(); // Prevents clicking the product link
//     setCurrentImageIdx((prev) => (prev === activeImages.length - 1 ? 0 : prev + 1));
//   };

//   const prevImage = (e) => {
//     e.preventDefault();
//     setCurrentImageIdx((prev) => (prev === 0 ? activeImages.length - 1 : prev - 1));
//   };

//   return (
//     <div className="flex flex-col group relative text-nav-dark w-full bg-white">
      
//       {/* --- 1. IMAGE AREA --- */}
//       <div className="relative aspect-[4/5] bg-[#f5f5f5] overflow-hidden border border-transparent hover:border-gray-200 transition-colors">
        
//         {/* Link wrapper for the image */}
//         <a href={`/products/${product.slug}`} className="absolute inset-0 z-0">
//           <img 
//             src={currentImage.url} 
//             alt={currentImage.alt || displayTitle} 
//             className="w-full h-full object-cover object-center transition-opacity duration-300"
//             loading="lazy"
//           />
//         </a>

//         {/* Top Badges (e.g., NEW) - Styled exactly like the screenshot */}
//         <div className="absolute top-3 left-3 z-10">
//           {product.isNew && (
//             <span className=" border border-nav-dark px-2 py-1 text-[9px] uppercase font-central font-bold tracking-widest text-nav-dark bg-white/80 backdrop-blur-sm">
//               New
//             </span>
//           )}
//         </div>

//         {/* Bookmark Button - Styled exactly like the screenshot */}
//         <button 
//           className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-transparent border border-nav-dark hover:bg-white/50 transition-colors backdrop-blur-sm"
//           aria-label="Add to Bookmark"
//         >
//           <svg className="w-4 h-4 text-nav-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5L12 15.5l-5.5 2.5v-11a2 2 0 012-2h7a2 2 0 012 2v11z" />
//           </svg>
//         </button>

//         {/* Left / Right Image Navigation Arrows (Hover to reveal) */}
//         {activeImages.length > 1 && (
//           <>
//             <button 
//               onClick={prevImage}
//               className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-nav-dark/50 hover:text-nav-dark"
//             >
//               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
//             </button>
//             <button 
//               onClick={nextImage}
//               className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-nav-dark/50 hover:text-nav-dark"
//             >
//               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
//             </button>
            
//             {/* Segmented Progress Bar (Bottom edge of image) */}
//             <div className="absolute bottom-0 left-0 w-full flex h-[3px] bg-gray-200">
//               {activeImages.map((_, idx) => (
//                 <div 
//                   key={idx} 
//                   className={`flex-1 transition-colors duration-300 border-r border-white last:border-r-0 ${
//                     idx === currentImageIdx ? 'bg-nav-dark' : 'bg-transparent'
//                   }`} 
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* --- 2. DETAILS AREA --- */}
//       <div className="flex flex-col px-1 mt-4 gap-3">
        
//         {/* Title */}
//         <a href={`/products/${product.slug}`} className="font-central text-[11px] sm:text-xs font-bold uppercase tracking-[0.08em] leading-snug hover:text-gray-500 transition-colors line-clamp-2">
//           {displayTitle}
//         </a>

//         {/* Color Swatches (Only show if more than 1 color) */}
//         {product.colors.length > 1 && (
//           <div className="flex gap-2 items-center">
//             {product.colors.map((color, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => handleColorChange(idx)}
//                 className={`w-[18px] h-[18px] rounded-full border transition-all p-[2px] ${
//                   selectedColorIdx === idx ? 'border-nav-dark' : 'border-gray-300'
//                 }`}
//                 aria-label={`Select ${color.name}`}
//               >
//                 <div 
//                   className="w-full h-full rounded-full border border-black/10" 
//                   style={{ backgroundColor: color.hex }} 
//                 />
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Price & Add Button */}
//         <div className="flex justify-between items-center mt-1">
//           <span className="font-ballinger text-[13px] tracking-widest text-nav-dark font-medium">
//             £{product.price}
//           </span>
          
//           <button className="font-central text-[11px] uppercase font-bold tracking-[0.1em] hover:text-gray-500 transition-colors flex items-center gap-1">
//             <span>+</span> <span className="underline underline-offset-4 decoration-[1.5px]">ADD</span>
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }




import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  // 1. 🚨 CRITICAL SAFETY CHECK: 
  // If product is undefined or variants haven't loaded, return null to prevent the crash
  if (!product || !product.colors || product.colors.length === 0) {
    return null; 
  }

  // Now it is safe to define these variables
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Derived Variables
  const activeColor = product.colors[selectedColorIdx];
  
  // 2. 🚨 SECOND SAFETY CHECK:
  // Ensure the active color and its images exist
  const activeImages = activeColor?.images || [];
  const currentImage = activeImages[currentImageIdx] || { url: 'https://via.placeholder.com/400x500?text=No+Image' };

  const displayTitle = `${product.name} - ${activeColor?.name || ''}`;
  // Handlers
  const handleColorChange = (idx) => {
    setSelectedColorIdx(idx);
    setCurrentImageIdx(0); // Reset to first image when changing colors
  };

  const nextImage = (e) => {
    e.preventDefault(); // Prevents clicking the product link
    setCurrentImageIdx((prev) => (prev === activeImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.preventDefault();
    setCurrentImageIdx((prev) => (prev === 0 ? activeImages.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col group relative text-nav-dark w-full bg-white">
      {/* --- 1. IMAGE AREA --- */}
      <div className="relative aspect-[4/5] bg-[#f5f5f5] overflow-hidden border border-transparent hover:border-gray-200 transition-colors">
        
        {/* 🚨 Changed <a> to <Link> to stop page refreshing */}
        <Link to={`/products/${product.slug}`} className="absolute inset-0 z-0">
          <img
            src={currentImage.url}
            alt={currentImage.alt || displayTitle}
            className="w-full h-full object-cover object-center transition-opacity duration-300"
            loading="lazy"
          />
        </Link>

        {/* Top Badges (e.g., NEW) - Styled exactly like the screenshot */}
        <div className="absolute top-3 left-3 z-10">
          {product.isNew && (
            <span className=" border border-nav-dark px-2 py-1 text-[9px] uppercase font-central font-bold tracking-widest text-nav-dark bg-white/80 backdrop-blur-sm">
              New
            </span>
          )}
        </div>

        {/* Bookmark Button - Styled exactly like the screenshot */}
        <button 
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-transparent border border-nav-dark hover:bg-white/50 transition-colors backdrop-blur-sm"
          aria-label="Add to Bookmark"
        >
          <svg className="w-4 h-4 text-nav-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5L12 15.5l-5.5 2.5v-11a2 2 0 012-2h7a2 2 0 012 2v11z" />
          </svg>
        </button>

        {/* Left / Right Image Navigation Arrows (Hover to reveal) */}
        {activeImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-nav-dark/50 hover:text-nav-dark"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-nav-dark/50 hover:text-nav-dark"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>

            {/* Segmented Progress Bar (Bottom edge of image) */}
            <div className="absolute bottom-0 left-0 w-full flex h-[3px] bg-gray-200">
              {activeImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`flex-1 transition-colors duration-300 border-r border-white last:border-r-0 ${
                    idx === currentImageIdx ? 'bg-nav-dark' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- 2. DETAILS AREA --- */}
      <div className="flex flex-col px-1 mt-4 gap-3">
        
        {/* Title */}
        {/* 🚨 Changed <a> to <Link> here as well */}
        <Link 
          to={`/products/${product.slug}`} 
          className="font-central text-[11px] sm:text-xs font-bold uppercase tracking-[0.08em] leading-snug hover:text-gray-500 transition-colors line-clamp-2"
        >
          {displayTitle}
        </Link>

        {/* Color Swatches (Only show if more than 1 color) */}
        {product.colors.length > 1 && (
          <div className="flex gap-2 items-center">
            {product.colors.map((color, idx) => (
              <button 
                key={idx}
                onClick={() => handleColorChange(idx)}
                className={`w-[18px] h-[18px] rounded-full border transition-all p-[2px] ${
                  selectedColorIdx === idx ? 'border-nav-dark' : 'border-gray-300'
                }`}
                aria-label={`Select ${color.name}`}
              >
                <div 
                  className="w-full h-full rounded-full border border-black/10"
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Price & Add Button */}
        <div className="flex justify-between items-center mt-1">
          {/* 🚨 Updated Currency to PKR and formatted with commas */}
          <span className="font-ballinger text-[13px] tracking-widest text-nav-dark font-medium">
            PKR {product.price.toLocaleString()}
          </span>
          
          <button className="font-central text-[11px] uppercase font-bold tracking-[0.1em] hover:text-gray-500 transition-colors flex items-center gap-1">
            <span>+</span>
            <span className="underline underline-offset-4 decoration-[1.5px]">ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
}