import { useCart } from '../Context/CartContext';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { navigationData } from '../Database/navData';
import DesktopMegaMenu from './DesktopMegaMenu';
import MobileSidebar from './MobileSidebar';
import SearchDrawer from './SearchDrawer';
import CartDrawer from './CartDrawer';
import ProfileSidebar from './ProfileSidebar';

export default function Navbar() {
  const { cartCount, toggleCart } = useCart();
  const { currentUser } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 left-0 w-full h-16 lg:h-20 flex items-center justify-between px-4 lg:px-8 bg-white text-nav-dark border-b border-gray-200 z-50">
        
        {/* Left Side Hamburger & Mega Menu */}
        <div className="flex items-center flex-1">
          {/* Removed text-white so it inherits the dark text */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 hover:opacity-70 transition-opacity">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
              <line x1="0" y1="6.5" x2="25" y2="6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="12.5" x2="25" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="18.5" x2="25" y2="18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <nav className="hidden lg:flex items-center gap-8 h-full font-central text-sm uppercase tracking-wider font-medium">
            {navigationData.map((item, idx) => (
              <div key={idx} className="group h-full flex items-center cursor-pointer">
                {/* Changed hover:border-white to hover:border-nav-dark */}
                <a href={item.href} className="hover:opacity-60 transition-opacity pb-1 border-b-2 border-transparent hover:border-nav-dark z-50">
                  {item.label}
                </a>
                <DesktopMegaMenu data={item} />
              </div>
            ))}
          </nav>
        </div>

        {/* Center Logo */}
        <a href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex-shrink-0">
          {/* Changed text-white to text-nav-dark */}
          <span className="font-central text-2xl tracking-[0.2em] font-bold uppercase text-nav-dark">P&Co</span>
        </a>

        {/* Right Side Icons */}
        {/* Changed text-white to text-nav-dark */}
        <div className="flex items-center justify-end flex-1 gap-4 lg:gap-6 font-central text-sm uppercase tracking-wider font-medium mt-1 text-nav-dark">
        
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} id="search-toggle-btn" className="hidden lg:flex items-center gap-2 hover:opacity-60 transition-opacity pb-1 border-b-2 border-transparent hover:border-nav-dark">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              {isSearchOpen ? 
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : 
                <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-4.197-4.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              }
            </svg>
          </button>

          {/* DYNAMIC ACCOUNT ICON */}
          {currentUser ? (
            <button onClick={() => setIsProfileSidebarOpen(true)} className="hidden sm:block hover:opacity-60 transition-opacity py-2 outline-none" aria-label="Account">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 15H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4ZM12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              </svg>
            </button>
          ) : (
            <a href="/account/login" className="hidden sm:block hover:opacity-60 transition-opacity" aria-label="Login">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 15H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4ZM12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              </svg>
            </a>
          )}

          {/* CART ICON */}
          <button onClick={toggleCart} className="flex items-center gap-2 hover:opacity-60 transition-opacity group relative outline-none" aria-label="Bag">
            <div className="relative">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 11.01V11m8 .01V11M8 8V7a4 4 0 1 1 8 0v1M8 8H6.84a2 2 0 0 0-1.992 1.834l-.667 8A2 2 0 0 0 6.174 20h11.653a2 2 0 0 0 1.993-2.166l-.667-8A2 2 0 0 0 17.16 8H16M8 8h8" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#B5997A] text-white text-[10px] font-ballinger w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </button>
        </div>

        <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </header>

      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />
      <ProfileSidebar isOpen={isProfileSidebarOpen} onClose={() => setIsProfileSidebarOpen(false)} />
    </>
  );
}



