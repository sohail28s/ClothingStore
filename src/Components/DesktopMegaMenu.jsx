import React, { useState } from 'react';

export default function DesktopMegaMenu({ data }) {
  const [activeHoverItem, setActiveHoverItem] = useState(null);

  if (!data || !data.megaMenu) return null;
  const { categories, defaultImage } = data.megaMenu;

  return (
    <div className="fixed top-[64px] lg:top-[80px] left-0 bottom-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-40">
      <div className="h-full bg-white border-t border-nav-border shadow-2xl flex pointer-events-auto text-nav-dark w-fit">
        
        {/* LEFT COLUMN: Main Categories */}
        <div className="w-[260px] border-r border-nav-border overflow-y-auto py-8 scrollbar-hide bg-[#fafafa]">
          <ul className="flex flex-col">
            {categories.map((cat, idx) => {
              const isActive = activeHoverItem === cat;
              return (
                <li key={idx} onMouseEnter={() => setActiveHoverItem(cat)} className="px-8 py-3 relative">
                  <a 
                    href={cat.href || '#'} 
                    className={`font-central text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-between transition-colors ${
                      cat.isRed ? 'text-brand-sale' : isActive ? 'text-[#a58c69]' : 'text-nav-dark hover:text-gray-500'
                    }`}
                  >
                    {cat.label}
                    {cat.subLinks && isActive && (
                      <span className="text-[10px]">&rarr;</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT COLUMN: Dynamic Content */}
        <div className="w-[340px] bg-white overflow-y-auto scrollbar-hide relative">
          {activeHoverItem && activeHoverItem.subLinks ? (
            <div className="py-8 px-10">
              <ul className="flex flex-col gap-6">
                {activeHoverItem.subLinks.map((sub, subIdx) => (
                  <li key={subIdx}>
                    <a href={sub.href} className="font-central text-[11px] font-bold uppercase tracking-[0.2em] text-nav-dark hover:text-[#a58c69] transition-colors">
                      {sub.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="w-full h-full p-6">
              <img src={defaultImage} alt="Showcase" className="w-full h-full object-cover object-center rounded-sm" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}