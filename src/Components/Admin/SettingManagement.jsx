import React, { useState } from 'react';
import { Store, CreditCard, Truck, Shield, Save, Check } from 'lucide-react';

export default function SettingsManagement() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Static state so the inputs are actually interactive for your demo
  const [formData, setFormData] = useState({
    storeName: 'P&Co Clone',
    supportEmail: 'support@pandco.com',
    phone: '+92 300 1234567',
    address: '123 Fashion Street, Lahore',
    shippingRate: '300',
    freeShippingThreshold: '10000',
    taxRate: '18',
    codEnabled: true,
    cardEnabled: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call delay for realism
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Store, desc: 'Store details and contact info' },
    { id: 'checkout', label: 'Checkout', icon: Truck, desc: 'Shipping rates and taxes' },
    { id: 'payments', label: 'Payments', icon: CreditCard, desc: 'Manage payment gateways' },
    { id: 'security', label: 'Security', icon: Shield, desc: 'Admin account credentials' },
  ];

  return (
    <div className="max-w-[1000px] mx-auto animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-nav-dark pb-6">
        <div>
          <h2 className="font-central text-2xl font-bold uppercase tracking-widest text-nav-dark">Settings</h2>
          <p className="font-ballinger text-sm text-gray-500 mt-1">Manage your store preferences and configurations.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-nav-dark text-white px-6 py-3 font-central text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-70"
        >
          {isSaving ? (
            <span className="animate-pulse">Saving...</span>
          ) : showSuccess ? (
            <><Check className="w-4 h-4" /> Saved</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Vertical Tabs */}
        <div className="w-full md:w-[250px] flex flex-col gap-2 shrink-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-start p-4 border text-left transition-colors ${
                  isActive ? 'border-nav-dark bg-nav-dark text-white' : 'border-gray-200 bg-white hover:border-gray-400 text-nav-dark'
                }`}
              >
                <div className="flex items-center gap-2 font-central text-xs font-bold uppercase tracking-widest mb-1">
                  <Icon className="w-4 h-4" /> {tab.label}
                </div>
                <span className={`font-ballinger text-[10px] ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                  {tab.desc}
                </span>
              </button>
            )
          })}
        </div>

        {/* Right Side: Form Content */}
        <div className="flex-1 bg-white border border-nav-dark p-8 shadow-sm">
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="font-central text-lg font-bold uppercase tracking-widest border-b border-gray-100 pb-2">Store Profile</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">Store Name</label>
                  <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">Support Email</label>
                    <input type="email" name="supportEmail" value={formData.supportEmail} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" />
                  </div>
                  <div>
                    <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">Phone Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" />
                  </div>
                </div>
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">Physical Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm resize-none"></textarea>
                </div>
              </div>
            </div>
          )}

          {/* CHECKOUT TAB */}
          {activeTab === 'checkout' && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="font-central text-lg font-bold uppercase tracking-widest border-b border-gray-100 pb-2">Shipping & Taxes</h3>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">Standard Shipping Rate (PKR)</label>
                    <input type="number" name="shippingRate" value={formData.shippingRate} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" />
                  </div>
                  <div>
                    <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">Free Shipping Threshold (PKR)</label>
                    <input type="number" name="freeShippingThreshold" value={formData.freeShippingThreshold} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" />
                  </div>
                </div>
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">Standard Tax Rate (%)</label>
                  <input type="number" name="taxRate" value={formData.taxRate} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm max-w-[200px]" />
                </div>
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="font-central text-lg font-bold uppercase tracking-widest border-b border-gray-100 pb-2">Payment Gateways</h3>
              <div className="flex flex-col gap-4">
                <label className="flex items-center p-4 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" name="codEnabled" checked={formData.codEnabled} onChange={handleChange} className="w-5 h-5 accent-nav-dark mr-4" />
                  <div className="flex flex-col">
                    <span className="font-central text-sm font-bold uppercase tracking-widest">Cash on Delivery</span>
                    <span className="font-ballinger text-xs text-gray-500">Allow customers to pay upon receiving their order.</span>
                  </div>
                </label>
                <label className="flex items-center p-4 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" name="cardEnabled" checked={formData.cardEnabled} onChange={handleChange} className="w-5 h-5 accent-nav-dark mr-4" />
                  <div className="flex flex-col">
                    <span className="font-central text-sm font-bold uppercase tracking-widest">Credit/Debit Cards</span>
                    <span className="font-ballinger text-xs text-gray-500">Accept secure payments via Stripe API.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="font-central text-lg font-bold uppercase tracking-widest border-b border-gray-100 pb-2">Admin Security</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">Current Admin Email</label>
                  <input type="email" value="admin@pandco.com" disabled className="w-full p-3 border border-gray-200 outline-none bg-gray-100 text-gray-500 font-ballinger text-sm cursor-not-allowed" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" />
                  </div>
                  <div>
                    <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-2">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}