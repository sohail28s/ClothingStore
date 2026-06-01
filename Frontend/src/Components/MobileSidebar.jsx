import React, { useState } from 'react';
import { navigationData } from '../Database/navData'; 

export default function MobileSidebar({ isOpen, onClose }) {
  
  const [openAccordion, setOpenAccordion] = useState(null);
  
  const [openSubAccordion, setOpenSubAccordion] = useState(null);

  const toggleAccordion = (label) => {
    setOpenAccordion(openAccordion === label ? null : label);
    
    setOpenSubAccordion(null); 
  };

  const toggleSubAccordion = (label) => {
    setOpenSubAccordion(openSubAccordion === label ? null : label);
  };

  return (
    <div className={`fixed inset-0 z-[100] ${isOpen ? '' : 'pointer-events-none'}`}>
      
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div 
        className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-nav-border shrink-0 text-nav-dark">
          <span className="font-central text-lg font-bold tracking-[0.2em] uppercase">Menu</span>
          <button onClick={onClose} className="p-2 -mr-2 hover:opacity-60 transition-opacity" aria-label="Close Menu">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Links Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-nav-dark">
          {navigationData.map((item, idx) => (
            <div key={idx} className="border-b border-nav-border pb-4">
              
              {item.megaMenu ? (
               
                <div>
                  <button 
                    onClick={() => toggleAccordion(item.label)}
                    className="w-full flex items-center justify-between font-central text-xl uppercase tracking-widest font-bold"
                  >
                    {item.label}
                    <svg 
                      className={`w-5 h-5 transition-transform duration-300 ${openAccordion === item.label ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  
                  {/* Category Content */}
                  <div className={`overflow-hidden transition-all duration-300 ${openAccordion === item.label ? 'max-h-[2000px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <ul className="flex flex-col gap-5 pl-4 border-l border-nav-border ml-2">
                      
                      {item.megaMenu.categories.map((cat, catIdx) => (
                        <li key={catIdx}>
                          
                          {cat.subLinks ? (
                           
                            <div>
                              <button 
                                onClick={() => toggleSubAccordion(cat.label)}
                                className="w-full flex items-center justify-between font-central text-sm uppercase tracking-widest font-bold text-gray-600 hover:text-nav-dark transition-colors"
                              >
                                {cat.label}
                                <svg className={`w-4 h-4 transition-transform duration-300 ${openSubAccordion === cat.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                              </button>
                              
                              {/* Sub-Links (The actual clickable products) */}
                              <div className={`overflow-hidden transition-all duration-300 ${openSubAccordion === cat.label ? 'max-h-[1000px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <ul className="flex flex-col gap-4 pl-4 border-l border-nav-border ml-2">
                                  {cat.subLinks.map((sub, subIdx) => (
                                    <li key={subIdx}>
                                      <a 
                                        href={sub.href} 
                                        className="font-central text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-nav-dark transition-colors block py-1"
                                      >
                                        {sub.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ) : (
                           
                            <a 
                              href={cat.href} 
                              className={`font-central text-sm uppercase tracking-widest font-bold transition-colors ${
                                cat.isRed ? 'text-brand-sale' : 'text-gray-600 hover:text-nav-dark'
                              }`}
                            >
                              {cat.label}
                            </a>
                          )}

                        </li>
                      ))}

                    </ul>
                  </div>
                </div>
              ) : (
               
                <a href={item.href} className="font-central text-xl uppercase tracking-widest font-bold text-nav-dark hover:opacity-60 transition-opacity">
                  {item.label}
                </a>
              )}

            </div>
          ))}
          
          {/* Bottom Utility Links */}
          <div className="mt-6 flex flex-col gap-6 font-central text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
            <a href="/pages/manifesto" className="hover:text-nav-dark transition-colors">Brand</a>
            <a href="/pages/rewards" className="hover:text-nav-dark transition-colors">Rewards</a>
            <a href="/account" className="hover:text-nav-dark transition-colors">Account</a>
          </div>
          
        </div>
      </div>
    </div>
  );
}