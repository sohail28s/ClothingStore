import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { ChevronRight, ShoppingBag, Heart, MapPin, CreditCard, User, LogOut, HelpCircle, X } from 'lucide-react';

export default function ProfileSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleItemClick = (sectionTab) => {
    onClose();
    navigate(`/dashboard?tab=${sectionTab}`);
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  if (!currentUser) return null;

  return (
    <>
      {/* Background Overlay */}
      <div 
        onClick={onClose} 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`} 
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#f9f9f9] z-[201] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-nav-dark ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-nav-border bg-white shrink-0">
          <h2 className="font-central text-lg font-bold tracking-[0.1em] uppercase">My Account</h2>
          <button onClick={onClose} className="p-2 hover:opacity-60 transition-opacity">
            <X className="w-6 h-6 text-nav-dark" strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-10">
          
          {/* User Profile Card */}
          <div className="bg-white p-6 border-b border-nav-border flex items-center gap-6">
          
            <div className="flex flex-col gap-1">
              <h2 className="font-central text-xl font-bold uppercase tracking-wider text-nav-dark truncate">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <p className="font-ballinger text-xs text-gray-500  tracking-widest truncate">
                {currentUser.email}
              </p>
            </div>
          </div>

          {/* Menu Options */}
          <div className="px-6 mt-8 flex flex-col gap-2">
            <h3 className="font-central text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Shopping</h3>
            
            <button onClick={() => handleItemClick('history')} className="flex items-center justify-between w-full py-4 border-b border-nav-border hover:opacity-60 transition-opacity group outline-none">
              <div className="flex items-center gap-4">
                <ShoppingBag className="w-5 h-5 text-nav-dark" strokeWidth={1.5} />
                <span className="font-central text-sm uppercase tracking-widest font-bold">Order History</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-nav-dark transition-colors" strokeWidth={1.5} />
            </button>

            <button onClick={() => handleItemClick('wishlist')} className="flex items-center justify-between w-full py-4 border-b border-nav-border hover:opacity-60 transition-opacity group outline-none">
              <div className="flex items-center gap-4">
                <Heart className="w-5 h-5 text-nav-dark" strokeWidth={1.5} />
                <span className="font-central text-sm uppercase tracking-widest font-bold">Wishlist</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-nav-dark transition-colors" strokeWidth={1.5} />
            </button>
          </div>

          <div className="px-6 mt-8 flex flex-col gap-2">
            <h3 className="font-central text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Settings</h3>
            
            <button onClick={() => handleItemClick('account')} className="flex items-center justify-between w-full py-4 border-b border-nav-border hover:opacity-60 transition-opacity group outline-none">
              <div className="flex items-center gap-4">
                <User className="w-5 h-5 text-nav-dark" strokeWidth={1.5} />
                <span className="font-central text-sm uppercase tracking-widest font-bold">Account Info</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-nav-dark transition-colors" strokeWidth={1.5} />
            </button>

            <button onClick={() => handleItemClick('addresses')} className="flex items-center justify-between w-full py-4 border-b border-nav-border hover:opacity-60 transition-opacity group outline-none">
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-nav-dark" strokeWidth={1.5} />
                <span className="font-central text-sm uppercase tracking-widest font-bold">Saved Addresses</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-nav-dark transition-colors" strokeWidth={1.5} />
            </button>

           
          </div>

          {/* Logout */}
          <div className="px-6 mt-10">
            <button 
              onClick={handleLogout} 
              className="flex items-center justify-between w-full py-4 hover:opacity-60 transition-opacity group outline-none"
            >
              <div className="flex items-center gap-4">
                <LogOut className="w-5 h-5 text-red-600" strokeWidth={1.5} />
                <span className="font-central text-sm uppercase tracking-widest font-bold text-red-600">Logout</span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}