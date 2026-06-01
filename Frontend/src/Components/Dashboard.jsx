// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate, Navigate } from 'react-router-dom';
// import { useAuth } from '../Context/AuthContext';
// import { ShoppingBag, Heart, User, CreditCard, MapPin, LogOut, X, Plus } from 'lucide-react';

// export default function Dashboard() {
//   const { currentUser, token, login, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeTab, setActiveTab] = useState('history');

//   const [userOrders, setUserOrders] = useState([]);

//   // --- ADDRESS STATE ---
//   const [savedAddresses, setSavedAddresses] = useState([]);
//   const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
//   const [isSavingAddress, setIsSavingAddress] = useState(false);
//   const [newAddress, setNewAddress] = useState({
//     label: 'Home', firstName: '', lastName: '', addressLine: '', city: '', postcode: '', country: 'Pakistan'
//   });

//   // --- ACCOUNT INFO STATE ---
//   const [isEditingAccount, setIsEditingAccount] = useState(false);
//   const [isSavingAccount, setIsSavingAccount] = useState(false); // New loading state for profile edits
//   const [accountForm, setAccountForm] = useState({
//     firstName: '', lastName: '', email: '', phone: '', emailNewsletter: false, pushNotification: false
//   });

//   // URL Listener for external tab switching
//   useEffect(() => {
//     const tabParam = new URLSearchParams(location.search).get('tab');
//     if (tabParam) {
//       setActiveTab(tabParam);
//     }
//   }, [location.search]);

//   // Load User Data
//   useEffect(() => {
//     if (currentUser) {
//       // 1. Load Orders
//       const allOrders = JSON.parse(localStorage.getItem('outrey_orders')) || [];
//       const myOrders = allOrders.filter(order => order.customerId === currentUser._id || currentUser.id);
//       setUserOrders(myOrders);

//       // 2. Load Addresses
//       setSavedAddresses(currentUser.addresses || []);

//       // 3. Populate Account Form
//       setAccountForm({
//         firstName: currentUser.firstName || '',
//         lastName: currentUser.lastName || '',
//         email: currentUser.email || '',
//         phone: currentUser.phone || '',
//         emailNewsletter: currentUser.emailNewsletter || false,
//         pushNotification: currentUser.pushNotification || false
//       });
//     }
//   }, [currentUser]);

//   // Protect Route
//   if (!currentUser) {
//     return <Navigate to="/account/login" replace />;
//   }

//   // ==========================================
//   // --- REAL ACCOUNT PROFILE LOGIC (API) ---
//   // ==========================================
//   const handleAccountInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setAccountForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//   };

//   const handleSaveAccount = async (e) => {
//     e.preventDefault();
//     setIsSavingAccount(true);

//     try {
//       // 1. PUT request to update user profile
//       const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/user/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         // Only sending the 4 exact variables you requested (ignoring checkboxes)
//         body: JSON.stringify({
//           firstName: accountForm.firstName,
//           lastName: accountForm.lastName,
//           email: accountForm.email,
//           phone: accountForm.phone
//         })
//       });

//       const result = await response.json();

//       if (!response.ok || result.status === "Fail") {
//         throw new Error(result.message || 'Failed to update profile');
//       }

//       // 2. Update Global State: 
//       // We merge the backend's response (or our form data) into the currentUser context
//       // This ensures the Sidebar and Navbar update instantly!
//       const updatedUser = { 
//         ...currentUser, 
//         firstName: accountForm.firstName,
//         lastName: accountForm.lastName,
//         email: accountForm.email,
//         phone: accountForm.phone
//       };

//       login(token, updatedUser);
//       setIsEditingAccount(false);

//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert(error.message);
//     } finally {
//       setIsSavingAccount(false);
//     }
//   };

//   // ==========================================
//   // --- REAL ADDRESS LOGIC (API) ---
//   // ==========================================
//   const handleAddressInputChange = (e) => {
//     setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
//   };

//   const handleSaveAddress = async (e) => {
//     e.preventDefault();
//     setIsSavingAddress(true);

//     try {
//       const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/user/address', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` 
//         },
//         body: JSON.stringify({
//           label: newAddress.label,
//           firstName: newAddress.firstName,
//           lastName: newAddress.lastName,
//           address: newAddress.addressLine, 
//           city: newAddress.city,
//           postalCode: newAddress.postcode, 
//           country: newAddress.country
//         })
//       });

//       const result = await response.json();

//       if (!response.ok || result.status === "Fail") {
//         throw new Error(result.message || 'Failed to save address');
//       }

//       setSavedAddresses(result.data);
//       login(token, { ...currentUser, addresses: result.data });

//       setNewAddress({ label: 'Home', firstName: '', lastName: '', addressLine: '', city: '', postcode: '', country: 'Pakistan' });
//       setIsAddressModalOpen(false);

//     } catch (error) {
//       console.error("Error saving address:", error);
//       alert(error.message); 
//     } finally {
//       setIsSavingAddress(false);
//     }
//   };

//   const handleDeleteAddress = (idToRemove) => {
//     console.log("Delete address clicked for ID:", idToRemove);
//     alert("We will wire up the DELETE API next!");
//   };

//   const menuItems = [
//     { id: 'history', label: 'Order History', icon: ShoppingBag },
//     { id: 'wishlist', label: 'Wishlist', icon: Heart },
//     { id: 'account', label: 'Account Info', icon: User },
//     { id: 'addresses', label: 'My Addresses', icon: MapPin },
//     { id: 'payments', label: 'Payment Methods', icon: CreditCard },
//   ];

//   return (
//     <>
//       <div className="min-h-screen bg-[#fafafa] font-ballinger text-nav-dark pt-24 pb-12 px-4 md:px-8">
//         <div className="max-w-[1400px] mx-auto">
//           <h1 className="font-central text-3xl font-bold uppercase tracking-widest mb-10">My Account</h1>
          
//           <div className="flex flex-col lg:flex-row gap-10">
//             {/* --- SIDEBAR --- */}
//             <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-2">
//               {menuItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeTab === item.id;
//                 return (
//                   <button
//                     key={item.id}
//                     onClick={() => navigate(`/dashboard?tab=${item.id}`)}
//                     className={`w-full flex items-center gap-4 p-4 border transition-colors outline-none font-central text-xs uppercase tracking-widest font-bold ${isActive ? 'border-nav-dark bg-nav-dark text-white' : 'border-gray-200 bg-white hover:border-nav-dark'}`}
//                   >
//                     <Icon className="w-5 h-5" strokeWidth={1.5} />
//                     {item.label}
//                   </button>
//                 );
//               })}
//               <button
//                 onClick={() => {
//                   logout();
//                   navigate('/');
//                 }}
//                 className="w-full flex items-center gap-4 p-4 border border-transparent text-red-600 hover:bg-red-50 transition-colors outline-none font-central text-xs uppercase tracking-widest font-bold mt-4"
//               >
//                 <LogOut className="w-5 h-5" strokeWidth={1.5} />
//                 Logout
//               </button>
//             </div>

//             {/* --- MAIN CONTENT --- */}
//             <div className="flex-1 bg-white border border-gray-200 p-6 md:p-10 min-h-[600px]">
              
//               {/* TAB: ORDER HISTORY */}
//               {activeTab === 'history' && (
//                 <div className="animate-in fade-in duration-300">
//                   <h2 className="font-central text-xl font-bold uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">Order History</h2>
//                   {userOrders.length === 0 ? (
//                     <div className="py-20 text-center flex flex-col items-center">
//                       <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
//                       <p className="font-central text-sm uppercase tracking-widest text-gray-500">You haven't placed any orders yet.</p>
//                       <button onClick={() => navigate('/')} className="mt-6 underline font-central text-xs uppercase tracking-widest font-bold hover:opacity-60 transition-opacity">Start Shopping</button>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col gap-10">
//                       {userOrders.slice().reverse().map((order) => (
//                         <div key={order.orderId} className="border border-gray-200 flex flex-col">
//                           <div className="bg-[#f4f2ed] p-4 flex flex-col md:flex-row justify-between border-b border-gray-200 gap-4">
//                             <div className="flex flex-col gap-1">
//                               <span className="font-central text-[10px] uppercase tracking-widest text-gray-500">Order Placed</span>
//                               <span className="font-ballinger text-sm font-bold uppercase">{new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
//                             </div>
//                             <div className="flex flex-col gap-1">
//                               <span className="font-central text-[10px] uppercase tracking-widest text-gray-500">Total</span>
//                               <span className="font-ballinger text-sm font-bold uppercase">PKR {order.total.toLocaleString()}</span>
//                             </div>
//                             <div className="flex flex-col gap-1 md:items-end">
//                               <span className="font-central text-[10px] uppercase tracking-widest text-gray-500">Order Number</span>
//                               <span className="font-ballinger text-sm font-bold uppercase">{order.orderId}</span>
//                             </div>
//                           </div>
//                           <div className="p-4 md:p-6 flex flex-col gap-6">
//                             {order.items.map((item, idx) => (
//                               <div key={idx} className="flex gap-4 md:gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
//                                 <div className="w-[80px] md:w-[120px] aspect-[4/5] bg-gray-100 border border-gray-200 shrink-0">
//                                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
//                                 </div>
//                                 <div className="flex-1 flex flex-col justify-start py-1">
//                                   <div className="flex justify-between items-start gap-4">
//                                     <span className="font-central text-[13px] md:text-sm uppercase tracking-wider font-bold leading-snug">{item.name}</span>
//                                     <span className="font-ballinger text-sm font-bold shrink-0">PKR {(item.price * item.quantity).toLocaleString()}</span>
//                                   </div>
//                                   <span className="font-ballinger text-xs text-gray-500 mt-2 uppercase tracking-widest">{item.colorName} / {item.size}</span>
//                                   <span className="font-ballinger text-xs text-gray-500 mt-1 uppercase tracking-widest">Qty: {item.quantity}</span>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* TAB: ACCOUNT INFO */}
//               {activeTab === 'account' && (
//                 <div className="animate-in fade-in duration-300">
//                   <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
//                     <h2 className="font-central text-xl font-bold uppercase tracking-widest">Account Info</h2>
//                     {!isEditingAccount && (
//                       <button onClick={() => setIsEditingAccount(true)} className="font-central text-xs font-bold uppercase tracking-widest text-nav-dark underline underline-offset-4 hover:opacity-60 transition-opacity">
//                         Edit Profile
//                       </button>
//                     )}
//                   </div>
                  
//                   {/* Profile Picture */}
//                   <div className="flex items-center gap-6 mb-10">
//                     <div className="w-24 h-24 bg-[#f4f2ed] border border-nav-dark shrink-0 flex items-center justify-center font-central text-3xl font-bold uppercase tracking-widest text-nav-dark">
//                       {accountForm.firstName ? `${accountForm.firstName.charAt(0)}${accountForm.lastName?.charAt(0) || ''}` : 'U'}
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="font-central text-sm uppercase tracking-widest text-gray-500 mb-1">Profile Photo</span>
//                       <span className="font-ballinger text-xs text-gray-400">Synced securely via your account settings.</span>
//                     </div>
//                   </div>

//                   {isEditingAccount ? (
//                     <form onSubmit={handleSaveAccount} className="flex flex-col gap-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                           <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">First Name</label>
//                           <input required type="text" name="firstName" value={accountForm.firstName} onChange={handleAccountInputChange} disabled={isSavingAccount} className="w-full p-4 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                         </div>
//                         <div>
//                           <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Last Name</label>
//                           <input required type="text" name="lastName" value={accountForm.lastName} onChange={handleAccountInputChange} disabled={isSavingAccount} className="w-full p-4 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                           <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Email Address</label>
//                           <input required type="email" name="email" value={accountForm.email} onChange={handleAccountInputChange} disabled={isSavingAccount} className="w-full p-4 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                         </div>
//                         <div>
//                           <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Phone Number</label>
//                           <input type="tel" name="phone" value={accountForm.phone} onChange={handleAccountInputChange} disabled={isSavingAccount} placeholder="Optional" className="w-full p-4 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                         </div>
//                       </div>
                      
//                       {/* Checkboxes (Static UI only) */}
//                       <div className="flex flex-col gap-4 mt-4 border-t border-gray-200 pt-6">
//                         <label className="flex items-start gap-4 cursor-pointer group">
//                           <input type="checkbox" name="emailNewsletter" checked={accountForm.emailNewsletter} onChange={handleAccountInputChange} disabled={isSavingAccount} className="mt-1 w-5 h-5 rounded-none border border-nav-dark accent-nav-dark bg-transparent shrink-0 disabled:opacity-50" />
//                           <span className="font-ballinger text-[12px] text-gray-600 leading-relaxed group-hover:text-nav-dark transition-colors">
//                             I’d like to receive news, offers and promotions from P&Co via <strong>EMAIL NEWSLETTER</strong>. I can unsubscribe from these notifications at any time in the app setting or via the unsubscribe link in the EMAIL NEWSLETTER.
//                           </span>
//                         </label>
//                         <label className="flex items-start gap-4 cursor-pointer group">
//                           <input type="checkbox" name="pushNotification" checked={accountForm.pushNotification} onChange={handleAccountInputChange} disabled={isSavingAccount} className="mt-1 w-5 h-5 rounded-none border border-nav-dark accent-nav-dark bg-transparent shrink-0 disabled:opacity-50" />
//                           <span className="font-ballinger text-[12px] text-gray-600 leading-relaxed group-hover:text-nav-dark transition-colors">
//                             I’d like to receive exclusive special offers and information from P&Co via <strong>PUSH NOTIFICATION</strong>. I can unsubscribe from these notifications at any time.
//                           </span>
//                         </label>
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="flex gap-4 mt-6">
//                         <button type="submit" disabled={isSavingAccount} className={`flex-1 text-white p-4 font-central text-sm font-bold uppercase tracking-widest transition-colors ${isSavingAccount ? 'bg-gray-400 cursor-not-allowed' : 'bg-nav-dark hover:bg-black'}`}>
//                           {isSavingAccount ? 'Saving...' : 'Save Changes'}
//                         </button>
//                         <button type="button" onClick={() => setIsEditingAccount(false)} disabled={isSavingAccount} className="flex-1 border border-nav-dark text-nav-dark p-4 font-central text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors disabled:opacity-50">
//                           Cancel
//                         </button>
//                       </div>
//                     </form>
//                   ) : (
//                     <div className="flex flex-col gap-8">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <div>
//                           <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">First Name</span>
//                           <span className="font-ballinger text-base text-nav-dark">{accountForm.firstName}</span>
//                         </div>
//                         <div>
//                           <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">Last Name</span>
//                           <span className="font-ballinger text-base text-nav-dark">{accountForm.lastName}</span>
//                         </div>
//                         <div>
//                           <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">Email Address</span>
//                           <span className="font-ballinger text-base text-nav-dark">{accountForm.email}</span>
//                         </div>
//                         <div>
//                           <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">Phone Number</span>
//                           <span className="font-ballinger text-base text-nav-dark">{accountForm.phone || 'Not provided'}</span>
//                         </div>
//                       </div>
                      
//                       <div className="flex flex-col gap-4 border-t border-gray-200 pt-8">
//                         <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-400 block">Communication Preferences</span>
//                         <div className="flex items-center gap-3">
//                           <div className={`w-3 h-3 border ${accountForm.emailNewsletter ? 'bg-green-500 border-green-500' : 'bg-transparent border-gray-300'}`}></div>
//                           <span className="font-ballinger text-sm text-gray-600">Subscribed to Email Newsletter</span>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <div className={`w-3 h-3 border ${accountForm.pushNotification ? 'bg-green-500 border-green-500' : 'bg-transparent border-gray-300'}`}></div>
//                           <span className="font-ballinger text-sm text-gray-600">Subscribed to Push Notifications</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* TAB: MY ADDRESSES */}
//               {activeTab === 'addresses' && (
//                 <div className="animate-in fade-in duration-300">
//                   <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
//                     <h2 className="font-central text-xl font-bold uppercase tracking-widest">My Addresses</h2>
//                     <button onClick={() => setIsAddressModalOpen(true)} className="flex items-center gap-2 font-central text-xs font-bold uppercase tracking-widest text-nav-dark hover:opacity-60 transition-opacity">
//                       <Plus className="w-4 h-4" /> Add New
//                     </button>
//                   </div>
                  
//                   {savedAddresses.length === 0 ? (
//                     <div className="py-20 text-center flex flex-col items-center">
//                       <MapPin className="w-12 h-12 text-gray-300 mb-4" />
//                       <p className="font-central text-sm uppercase tracking-widest text-gray-500">You haven't saved any addresses yet.</p>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {savedAddresses.map((addr) => (
//                         <div key={addr._id || addr.id} className="border border-gray-200 p-6 flex flex-col relative group">
//                           <span className="font-central text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">{addr.label}</span>
//                           <span className="font-central text-sm uppercase tracking-wider font-bold mb-1">{addr.firstName} {addr.lastName}</span>
//                           <span className="font-ballinger text-sm text-gray-600">{addr.address || addr.addressLine}</span>
//                           <span className="font-ballinger text-sm text-gray-600">{addr.city}, {addr.postalCode || addr.postcode}</span>
//                           <span className="font-ballinger text-sm text-gray-600">{addr.country}</span>
                          
//                           <button onClick={() => handleDeleteAddress(addr._id || addr.id)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50" aria-label="Delete Address">
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* STATIC TABS (Placeholders for future) */}
//               {['wishlist', 'payments'].includes(activeTab) && (
//                 <div className="animate-in fade-in duration-300">
//                   <h2 className="font-central text-xl font-bold uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">
//                     {menuItems.find(i => i.id === activeTab)?.label}
//                   </h2>
//                   <div className="py-20 text-center">
//                     <p className="font-central text-sm uppercase tracking-widest text-gray-500">
//                       This section will be connected to the backend API.
//                     </p>
//                   </div>
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ========================================== */}
//       {/* ADDRESS MODAL */}
//       {/* ========================================== */}
//       {isAddressModalOpen && (
//         <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
//           <div className="bg-white w-full max-w-[500px] shadow-2xl relative border border-nav-dark animate-in zoom-in-95 duration-200">
//             <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-[#f4f2ed]">
//               <h2 className="font-central text-lg font-bold uppercase tracking-widest">Add New Address</h2>
//               <button onClick={() => setIsAddressModalOpen(false)} className="hover:opacity-60 transition-opacity">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <form onSubmit={handleSaveAddress} className="p-6 flex flex-col gap-4 font-ballinger">
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Label (e.g. Home, Work)</label>
//                 <input required type="text" name="label" value={newAddress.label} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">First Name</label>
//                   <input required type="text" name="firstName" value={newAddress.firstName} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
//                 </div>
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Last Name</label>
//                   <input required type="text" name="lastName" value={newAddress.lastName} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
//                 </div>
//               </div>
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Address</label>
//                 <input required type="text" name="addressLine" value={newAddress.addressLine} onChange={handleAddressInputChange} placeholder="Street address, apartment, suite" className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">City</label>
//                   <input required type="text" name="city" value={newAddress.city} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
//                 </div>
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Postal Code</label>
//                   <input required type="text" name="postcode" value={newAddress.postcode} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
//                 </div>
//               </div>
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Country</label>
//                 <select name="country" value={newAddress.country} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark bg-white">
//                   <option value="Pakistan">Pakistan</option>
//                   <option value="United Kingdom">United Kingdom</option>
//                   <option value="United States">United States</option>
//                 </select>
//               </div>
              
//               <button type="submit" disabled={isSavingAddress} className={`w-full text-white p-4 font-central text-sm font-bold uppercase tracking-widest mt-4 transition-colors ${isSavingAddress ? 'bg-gray-400 cursor-not-allowed' : 'bg-nav-dark hover:bg-black'}`}>
//                 {isSavingAddress ? 'Saving...' : 'Save Address'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }








// my pangaof api










// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate, Navigate } from 'react-router-dom';
// import { useAuth } from '../Context/AuthContext';
// import { ShoppingBag, Heart, User, CreditCard, MapPin, LogOut, X, Plus } from 'lucide-react';

// export default function Dashboard() {
//   const { currentUser, token, login, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [activeTab, setActiveTab] = useState('history');
  
//   // --- ORDER STATE ---
//   const [userOrders, setUserOrders] = useState([]);
//   const [isLoadingOrders, setIsLoadingOrders] = useState(false);

//   // --- ADDRESS STATE ---
//   const [savedAddresses, setSavedAddresses] = useState([]);
//   const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
//   const [isSavingAddress, setIsSavingAddress] = useState(false);
//   const [newAddress, setNewAddress] = useState({
//     label: 'Home', firstName: '', lastName: '', addressLine: '', city: '', postcode: '', country: 'Pakistan'
//   });

//   // --- ACCOUNT INFO STATE ---
//   const [isEditingAccount, setIsEditingAccount] = useState(false);
//   const [isSavingAccount, setIsSavingAccount] = useState(false);
//   const [accountForm, setAccountForm] = useState({
//     firstName: '', lastName: '', email: '', phone: '', emailNewsletter: false, pushNotification: false
//   });

//   // URL Listener for external tab switching
//   useEffect(() => {
//     const tabParam = new URLSearchParams(location.search).get('tab');
//     if (tabParam) {
//       setActiveTab(tabParam);
//     }
//   }, [location.search]);

//   // Load User Data & Fetch Orders
//   useEffect(() => {
//     if (currentUser && token) {
      
//       // 1. FETCH REAL ORDERS FROM BACKEND API
//       const fetchMyOrders = async () => {
//         setIsLoadingOrders(true);
//         try {
//           const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/orders/my-orders', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`
//             }
//           });
//           const result = await response.json();
//           if (response.ok && result.status === "Success") {
//             setUserOrders(result.data); // Set the real data from DB
//           }
//         } catch (error) {
//           console.error("Error fetching orders:", error);
//         } finally {
//           setIsLoadingOrders(false);
//         }
//       };

//       fetchMyOrders();

//       // 2. Load Addresses
//       setSavedAddresses(currentUser.addresses || []);

//       // 3. Populate Account Form
//       setAccountForm({
//         firstName: currentUser.firstName || '',
//         lastName: currentUser.lastName || '',
//         email: currentUser.email || '',
//         phone: currentUser.phone || '',
//         emailNewsletter: currentUser.emailNewsletter || false,
//         pushNotification: currentUser.pushNotification || false
//       });
//     }
//   }, [currentUser, token]);

//   // Protect Route
//   if (!currentUser) {
//     return <Navigate to="/account/login" replace />;
//   }

//   // ==========================================
//   // --- ACCOUNT PROFILE LOGIC (API) ---
//   // ==========================================
//   const handleAccountInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setAccountForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//   };

//   const handleSaveAccount = async (e) => {
//     e.preventDefault();
//     setIsSavingAccount(true);
//     try {
//       const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/user/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           firstName: accountForm.firstName,
//           lastName: accountForm.lastName,
//           email: accountForm.email,
//           phone: accountForm.phone
//         })
//       });
//       const result = await response.json();
//       if (!response.ok || result.status === "Fail") throw new Error(result.message || 'Failed to update profile');
      
//       const updatedUser = { ...currentUser, firstName: accountForm.firstName, lastName: accountForm.lastName, email: accountForm.email, phone: accountForm.phone };
//       login(token, updatedUser);
//       setIsEditingAccount(false);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert(error.message);
//     } finally {
//       setIsSavingAccount(false);
//     }
//   };

//   // ==========================================
//   // --- ADDRESS LOGIC (API) ---
//   // ==========================================
//   const handleAddressInputChange = (e) => {
//     setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
//   };

//   const handleSaveAddress = async (e) => {
//     e.preventDefault();
//     setIsSavingAddress(true);
//     try {
//       const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/user/address', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           label: newAddress.label, firstName: newAddress.firstName, lastName: newAddress.lastName,
//           address: newAddress.addressLine, city: newAddress.city, postalCode: newAddress.postcode, country: newAddress.country
//         })
//       });
//       const result = await response.json();
//       if (!response.ok || result.status === "Fail") throw new Error(result.message || 'Failed to save address');
      
//       setSavedAddresses(result.data);
//       login(token, { ...currentUser, addresses: result.data });
//       setNewAddress({ label: 'Home', firstName: '', lastName: '', addressLine: '', city: '', postcode: '', country: 'Pakistan' });
//       setIsAddressModalOpen(false);
//     } catch (error) {
//       console.error("Error saving address:", error);
//       alert(error.message);
//     } finally {
//       setIsSavingAddress(false);
//     }
//   };

//   const handleDeleteAddress = (idToRemove) => {
//     // You can wire up the real DELETE api here later!
//     console.log("Delete address clicked for ID:", idToRemove);
//     alert("Delete API route needs to be added to backend!");
//   };

//   const menuItems = [
//     { id: 'history', label: 'Order History', icon: ShoppingBag },
//     { id: 'wishlist', label: 'Wishlist', icon: Heart },
//     { id: 'account', label: 'Account Info', icon: User },
//     { id: 'addresses', label: 'My Addresses', icon: MapPin },
//     { id: 'payments', label: 'Payment Methods', icon: CreditCard },
//   ];

//   return (
//     <>
//       <div className="min-h-screen bg-[#fafafa] font-ballinger text-nav-dark pt-24 pb-12 px-4 md:px-8">
//         <div className="max-w-[1400px] mx-auto">
//           <h1 className="font-central text-3xl font-bold uppercase tracking-widest mb-10">My Account</h1>

//           <div className="flex flex-col lg:flex-row gap-10">
//             {/* --- SIDEBAR --- */}
//             <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-2">
//               {menuItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeTab === item.id;
//                 return (
//                   <button
//                     key={item.id}
//                     onClick={() => navigate(`/dashboard?tab=${item.id}`)}
//                     className={`w-full flex items-center gap-4 p-4 border transition-colors outline-none font-central text-xs uppercase tracking-widest font-bold 
//                       ${isActive ? 'border-nav-dark bg-nav-dark text-white' : 'border-gray-200 bg-white hover:border-nav-dark'}`}
//                   >
//                     <Icon className="w-5 h-5" strokeWidth={1.5} />
//                     {item.label}
//                   </button>
//                 );
//               })}
//               <button
//                 onClick={() => { logout(); navigate('/'); }}
//                 className="w-full flex items-center gap-4 p-4 border border-transparent text-red-600 hover:bg-red-50 transition-colors outline-none font-central text-xs uppercase tracking-widest font-bold mt-4"
//               >
//                 <LogOut className="w-5 h-5" strokeWidth={1.5} />
//                 Logout
//               </button>
//             </div>

//             {/* --- MAIN CONTENT --- */}
//             <div className="flex-1 bg-white border border-gray-200 p-6 md:p-10 min-h-[600px]">

//               {/* TAB: ORDER HISTORY */}
//               {activeTab === 'history' && (
//                 <div className="animate-in fade-in duration-300">
//                   <h2 className="font-central text-xl font-bold uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">Order History</h2>

//                   {isLoadingOrders ? (
//                     <div className="py-20 text-center font-central text-sm uppercase tracking-widest text-gray-500">
//                       Loading your orders...
//                     </div>
//                   ) : userOrders.length === 0 ? (
//                     <div className="py-20 text-center flex flex-col items-center">
//                       <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
//                       <p className="font-central text-sm uppercase tracking-widest text-gray-500">You haven't placed any orders yet.</p>
//                       <button onClick={() => navigate('/')} className="mt-6 underline font-central text-xs uppercase tracking-widest font-bold hover:opacity-60 transition-opacity">Start Shopping</button>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col gap-10">
//                     {userOrders.map((order) => (
//                         <div key={order.orderId || order._id} className="border border-gray-200 flex flex-col">
                          
//                           {/* Order Header (FIX 1: Status tag moved here so it always shows!) */}
//                           <div className="bg-[#f4f2ed] p-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 gap-4">
//                             <div className="flex flex-col gap-1">
//                               <span className="font-central text-[10px] uppercase tracking-widest text-gray-500">Order Placed</span>
//                               <span className="font-ballinger text-sm font-bold uppercase">{new Date(order.date || order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
//                             </div>
//                             <div className="flex flex-col gap-1">
//                               <span className="font-central text-[10px] uppercase tracking-widest text-gray-500">Total</span>
//                               <span className="font-ballinger text-sm font-bold uppercase">PKR {(order.totalAmount || 0).toLocaleString()}</span>
//                             </div>
//                             <div className="flex flex-col gap-1 md:items-end">
//                               <span className="font-central text-[10px] uppercase tracking-widest text-gray-500">Order Number</span>
//                               <span className="font-ballinger text-sm font-bold uppercase">{order.orderId || order._id}</span>
//                             </div>
                            
//                             {/* The Status Tag now lives in the header */}
//                             <div className="shrink-0 md:ml-4 mt-2 md:mt-0">
//                               <span className={`font-central text-[10px] uppercase tracking-widest font-bold px-3 py-1 border ${
//                                 order.status === 'delivered' ? 'border-green-500 text-green-600 bg-green-50' : 
//                                 order.status === 'cancelled' ? 'border-red-500 text-red-600 bg-red-50' : 
//                                 'border-orange-500 text-orange-600 bg-orange-50'
//                               }`}>
//                                 {order.status}
//                               </span>
//                             </div>
//                           </div>

//                           {/* Order Items */}
//                           <div className="p-4 md:p-6 flex flex-col gap-6">
//                             {order.items && order.items.length > 0 ? (
//                               order.items.map((item, idx) => {
                                
//                                 // FIX 2: Added the localhost prefix to the image URL just like the Admin side
//                                 const imageUrl = item.image ? `https://app-backend-msic.onrender.com/${item.image.replace(/\\/g, '/')}` : "https://via.placeholder.com/150";

//                                 return (
//                                   <div key={idx} className="flex gap-4 md:gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
//                                     <div className="w-[80px] md:w-[120px] aspect-[4/5] bg-gray-100 border border-gray-200 shrink-0">
//                                       <img src={imageUrl} alt={item.name || item.productName} className="w-full h-full object-cover" />
//                                     </div>
//                                     <div className="flex-1 flex flex-col justify-start py-1">
//                                       <div className="flex justify-between items-start gap-4">
//                                         <span className="font-central text-[13px] md:text-sm uppercase tracking-wider font-bold leading-snug">{item.name || item.productName}</span>
//                                         <span className="font-ballinger text-sm font-bold shrink-0">PKR {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
//                                       </div>
//                                       <span className="font-ballinger text-xs text-gray-500 mt-2 uppercase tracking-widest">{item.colorName} / {item.size}</span>
//                                       <span className="font-ballinger text-xs text-gray-500 mt-1 uppercase tracking-widest">Qty: {item.quantity}</span>
//                                     </div>
//                                   </div>
//                                 );
//                               })
//                             ) : (
//                               <div className="flex justify-between items-center">
//                                 <span className="font-ballinger text-sm text-gray-600 font-bold">This order contains {order.itemsCount || 0} item(s).</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* TAB: ACCOUNT INFO */}
//               {activeTab === 'account' && (
//                 <div className="animate-in fade-in duration-300">
//                   <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
//                     <h2 className="font-central text-xl font-bold uppercase tracking-widest">Account Info</h2>
//                     {!isEditingAccount && (
//                       <button onClick={() => setIsEditingAccount(true)} className="font-central text-xs font-bold uppercase tracking-widest text-nav-dark underline underline-offset-4 hover:opacity-60 transition-opacity">
//                         Edit Profile
//                       </button>
//                     )}
//                   </div>

//                   <div className="flex items-center gap-6 mb-10">
//                     <div className="w-24 h-24 bg-[#f4f2ed] border border-nav-dark shrink-0 flex items-center justify-center font-central text-3xl font-bold uppercase tracking-widest text-nav-dark">
//                       {accountForm.firstName ? `${accountForm.firstName.charAt(0)}${accountForm.lastName?.charAt(0) || ''}` : 'U'}
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="font-central text-sm uppercase tracking-widest text-gray-500 mb-1">Profile Photo</span>
//                       <span className="font-ballinger text-xs text-gray-400">Synced securely via your account settings.</span>
//                     </div>
//                   </div>

//                   {isEditingAccount ? (
//                     <form onSubmit={handleSaveAccount} className="flex flex-col gap-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                           <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">First Name</label>
//                           <input required type="text" name="firstName" value={accountForm.firstName} onChange={handleAccountInputChange} disabled={isSavingAccount} className="w-full p-4 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                         </div>
//                         <div>
//                           <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Last Name</label>
//                           <input required type="text" name="lastName" value={accountForm.lastName} onChange={handleAccountInputChange} disabled={isSavingAccount} className="w-full p-4 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                           <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Email Address</label>
//                           <input required type="email" name="email" value={accountForm.email} onChange={handleAccountInputChange} disabled={isSavingAccount} className="w-full p-4 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                         </div>
//                         <div>
//                           <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Phone Number</label>
//                           <input type="tel" name="phone" value={accountForm.phone} onChange={handleAccountInputChange} disabled={isSavingAccount} placeholder="Optional" className="w-full p-4 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                         </div>
//                       </div>

//                       <div className="flex gap-4 mt-6">
//                         <button type="submit" disabled={isSavingAccount} className={`flex-1 text-white p-4 font-central text-sm font-bold uppercase tracking-widest transition-colors ${isSavingAccount ? 'bg-gray-400 cursor-not-allowed' : 'bg-nav-dark hover:bg-black'}`}>
//                           {isSavingAccount ? 'Saving...' : 'Save Changes'}
//                         </button>
//                         <button type="button" onClick={() => setIsEditingAccount(false)} disabled={isSavingAccount} className="flex-1 border border-nav-dark text-nav-dark p-4 font-central text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors disabled:opacity-50">
//                           Cancel
//                         </button>
//                       </div>
//                     </form>
//                   ) : (
//                     <div className="flex flex-col gap-8">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <div>
//                           <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">First Name</span>
//                           <span className="font-ballinger text-base text-nav-dark">{accountForm.firstName}</span>
//                         </div>
//                         <div>
//                           <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">Last Name</span>
//                           <span className="font-ballinger text-base text-nav-dark">{accountForm.lastName}</span>
//                         </div>
//                         <div>
//                           <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">Email Address</span>
//                           <span className="font-ballinger text-base text-nav-dark">{accountForm.email}</span>
//                         </div>
//                         <div>
//                           <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">Phone Number</span>
//                           <span className="font-ballinger text-base text-nav-dark">{accountForm.phone || 'Not provided'}</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* TAB: MY ADDRESSES */}
//               {activeTab === 'addresses' && (
//                 <div className="animate-in fade-in duration-300">
//                   <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
//                     <h2 className="font-central text-xl font-bold uppercase tracking-widest">My Addresses</h2>
//                     <button onClick={() => setIsAddressModalOpen(true)} className="flex items-center gap-2 font-central text-xs font-bold uppercase tracking-widest text-nav-dark hover:opacity-60 transition-opacity">
//                       <Plus className="w-4 h-4" /> Add New
//                     </button>
//                   </div>
//                   {savedAddresses.length === 0 ? (
//                     <div className="py-20 text-center flex flex-col items-center">
//                       <MapPin className="w-12 h-12 text-gray-300 mb-4" />
//                       <p className="font-central text-sm uppercase tracking-widest text-gray-500">You haven't saved any addresses yet.</p>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {savedAddresses.map((addr) => (
//                         <div key={addr._id || addr.id} className="border border-gray-200 p-6 flex flex-col relative group">
//                           <span className="font-central text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">{addr.label}</span>
//                           <span className="font-central text-sm uppercase tracking-wider font-bold mb-1">{addr.firstName} {addr.lastName}</span>
//                           <span className="font-ballinger text-sm text-gray-600">{addr.address || addr.addressLine}</span>
//                           <span className="font-ballinger text-sm text-gray-600">{addr.city}, {addr.postalCode || addr.postcode}</span>
//                           <span className="font-ballinger text-sm text-gray-600">{addr.country}</span>
//                           <button onClick={() => handleDeleteAddress(addr._id || addr.id)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50" aria-label="Delete Address">
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* STATIC TABS (Placeholders for future) */}
//               {['wishlist', 'payments'].includes(activeTab) && (
//                 <div className="animate-in fade-in duration-300">
//                   <h2 className="font-central text-xl font-bold uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">
//                     {menuItems.find(i => i.id === activeTab)?.label}
//                   </h2>
//                   <div className="py-20 text-center">
//                     <p className="font-central text-sm uppercase tracking-widest text-gray-500">
//                       This section will be connected to the backend API.
//                     </p>
//                   </div>
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ========================================== */}
//       {/* ADDRESS MODAL */}
//       {/* ========================================== */}
//       {isAddressModalOpen && (
//         <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
//           <div className="bg-white w-full max-w-[500px] shadow-2xl relative border border-nav-dark animate-in zoom-in-95 duration-200">
//             <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-[#f4f2ed]">
//               <h2 className="font-central text-lg font-bold uppercase tracking-widest">Add New Address</h2>
//               <button onClick={() => setIsAddressModalOpen(false)} className="hover:opacity-60 transition-opacity">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <form onSubmit={handleSaveAddress} className="p-6 flex flex-col gap-4 font-ballinger">
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Label (e.g. Home, Work)</label>
//                 <input required type="text" name="label" value={newAddress.label} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">First Name</label>
//                   <input required type="text" name="firstName" value={newAddress.firstName} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
//                 </div>
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Last Name</label>
//                   <input required type="text" name="lastName" value={newAddress.lastName} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
//                 </div>
//               </div>
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Address</label>
//                 <input required type="text" name="addressLine" value={newAddress.addressLine} onChange={handleAddressInputChange} placeholder="Street address, apartment, suite" className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">City</label>
//                   <input required type="text" name="city" value={newAddress.city} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
//                 </div>
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Postal Code</label>
//                   <input required type="text" name="postcode" value={newAddress.postcode} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
//                 </div>
//               </div>
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Country</label>
//                 <select name="country" value={newAddress.country} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark bg-white">
//                   <option value="Pakistan">Pakistan</option>
//                   <option value="United Kingdom">United Kingdom</option>
//                   <option value="United States">United States</option>
//                 </select>
//               </div>
//               <button type="submit" disabled={isSavingAddress} className={`w-full text-white p-4 font-central text-sm font-bold uppercase tracking-widest mt-4 transition-colors ${isSavingAddress ? 'bg-gray-400 cursor-not-allowed' : 'bg-nav-dark hover:bg-black'}`}>
//                 {isSavingAddress ? 'Saving...' : 'Save Address'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }












//my panga after wishlist  






import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { ShoppingBag, Heart, User, MapPin, LogOut, X, Plus } from 'lucide-react';
import ProductCard from '../Components/ProductCard'; // Make sure this path is correct for your project!

export default function Dashboard() {
  const { currentUser, token, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('history');
  
  // --- ORDER STATE ---
  const [userOrders, setUserOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // --- WISHLIST STATE ---
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

  // --- ADDRESS STATE ---
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home', firstName: '', lastName: '', addressLine: '', city: '', postcode: '', country: 'Pakistan'
  });

  // --- ACCOUNT INFO STATE ---
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', emailNewsletter: false, pushNotification: false
  });

  // URL Listener for external tab switching
  useEffect(() => {
    const tabParam = new URLSearchParams(location.search).get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Load User Data & Fetch Orders/Wishlist
  useEffect(() => {
    if (currentUser && token) {
      
      // 1. FETCH REAL ORDERS FROM BACKEND API
      const fetchMyOrders = async () => {
        setIsLoadingOrders(true);
        try {
          const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/orders/my-orders', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const result = await response.json();
          if (response.ok && result.status === "Success") {
            setUserOrders(result.data); 
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setIsLoadingOrders(false);
        }
      };

      // 2. FETCH REAL WISHLIST FROM BACKEND API
      const fetchMyWishlist = async () => {
        setIsLoadingWishlist(true);
        try {
          const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/user/wishlist', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const result = await response.json();
          if (response.ok && result.status === "Success") {
            // Map the raw backend products to the format ProductCard expects
            const mappedWishlist = result.data.map(p => ({
              id: p._id,
              slug: p._id, // Using ID as slug for now, or use p.slug if it exists
              name: p.name,
              price: p.price,
              isNew: p.tags?.includes('New'),
              colors: (p.variants || []).map(v => ({
                name: v.colorName,
                hex: v.hexCode,
                images: v.images && v.images.length > 0 
                  ? v.images.map(img => ({ url: img.startsWith('http') ? img : `https://app-backend-msic.onrender.com/${img.replace(/\\/g, '/')}` }))
                  : [{ url: 'https://via.placeholder.com/400x500?text=No+Image' }]
              }))
            }));
            setWishlistItems(mappedWishlist);
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        } finally {
          setIsLoadingWishlist(false);
        }
      };

      fetchMyOrders();
      fetchMyWishlist(); // Call the wishlist fetcher!

      // 3. Load Addresses
      setSavedAddresses(currentUser.addresses || []);

      // 4. Populate Account Form
      setAccountForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        emailNewsletter: currentUser.emailNewsletter || false,
        pushNotification: currentUser.pushNotification || false
      });
    }
  }, [currentUser, token]);

  // Protect Route
  if (!currentUser) {
    return <Navigate to="/account/login" replace />;
  }

  // ==========================================
  // --- ACCOUNT PROFILE LOGIC (API) ---
  // ==========================================
  const handleAccountInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAccountForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setIsSavingAccount(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: accountForm.firstName,
          lastName: accountForm.lastName,
          email: accountForm.email,
          phone: accountForm.phone
        })
      });
      const result = await response.json();
      if (!response.ok || result.status === "Fail") throw new Error(result.message || 'Failed to update profile');
      
      const updatedUser = { ...currentUser, firstName: accountForm.firstName, lastName: accountForm.lastName, email: accountForm.email, phone: accountForm.phone };
      login(token, updatedUser);
      setIsEditingAccount(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message);
    } finally {
      setIsSavingAccount(false);
    }
  };

  // ==========================================
  // --- ADDRESS LOGIC (API) ---
  // ==========================================
  const handleAddressInputChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/user/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          label: newAddress.label, firstName: newAddress.firstName, lastName: newAddress.lastName,
          address: newAddress.addressLine, city: newAddress.city, postalCode: newAddress.postcode, country: newAddress.country
        })
      });
      const result = await response.json();
      if (!response.ok || result.status === "Fail") throw new Error(result.message || 'Failed to save address');
      
      setSavedAddresses(result.data);
      login(token, { ...currentUser, addresses: result.data });
      setNewAddress({ label: 'Home', firstName: '', lastName: '', addressLine: '', city: '', postcode: '', country: 'Pakistan' });
      setIsAddressModalOpen(false);
    } catch (error) {
      console.error("Error saving address:", error);
      alert(error.message);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = (idToRemove) => {
    console.log("Delete address clicked for ID:", idToRemove);
    alert("Delete API route needs to be added to backend!");
  };

  // Removed Payments Tab
  const menuItems = [
    { id: 'history', label: 'Order History', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'account', label: 'Account Info', icon: User },
    { id: 'addresses', label: 'My Addresses', icon: MapPin }
  ];

  return (
    <>
      <div className="min-h-screen bg-[#fafafa] font-ballinger text-nav-dark pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="font-central text-3xl font-bold uppercase tracking-widest mb-10">My Account</h1>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* --- SIDEBAR --- */}
            <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/dashboard?tab=${item.id}`)}
                    className={`w-full flex items-center gap-4 p-4 border transition-colors outline-none font-central text-xs uppercase tracking-widest font-bold 
                      ${isActive ? 'border-nav-dark bg-nav-dark text-white' : 'border-gray-200 bg-white hover:border-nav-dark'}`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                    {item.label}
                  </button>
                );
              })}
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center gap-4 p-4 border border-transparent text-red-600 hover:bg-red-50 transition-colors outline-none font-central text-xs uppercase tracking-widest font-bold mt-4"
              >
                <LogOut className="w-5 h-5" strokeWidth={1.5} />
                Logout
              </button>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 bg-white border border-gray-200 p-6 md:p-10 min-h-[600px]">

              {/* TAB: ORDER HISTORY */}
              {activeTab === 'history' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="font-central text-xl font-bold uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">Order History</h2>

                  {isLoadingOrders ? (
                    <div className="py-20 text-center font-central text-sm uppercase tracking-widest text-gray-500">
                      Loading your orders...
                    </div>
                  ) : userOrders.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center">
                      <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="font-central text-sm uppercase tracking-widest text-gray-500">You haven't placed any orders yet.</p>
                      <button onClick={() => navigate('/')} className="mt-6 underline font-central text-xs uppercase tracking-widest font-bold hover:opacity-60 transition-opacity">Start Shopping</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-10">
                      {userOrders.map((order) => (
                        <div key={order.orderId || order._id} className="border border-gray-200 flex flex-col">
                          <div className="bg-[#f4f2ed] p-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 gap-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-central text-[10px] uppercase tracking-widest text-gray-500">Order Placed</span>
                              <span className="font-ballinger text-sm font-bold uppercase">{new Date(order.date || order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="font-central text-[10px] uppercase tracking-widest text-gray-500">Total</span>
                              <span className="font-ballinger text-sm font-bold uppercase">PKR {(order.totalAmount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col gap-1 md:items-end">
                              <span className="font-central text-[10px] uppercase tracking-widest text-gray-500">Order Number</span>
                              <span className="font-ballinger text-sm font-bold uppercase">{order.orderId || order._id}</span>
                            </div>
                            <div className="shrink-0 md:ml-4 mt-2 md:mt-0">
                              <span className={`font-central text-[10px] uppercase tracking-widest font-bold px-3 py-1 border ${
                                order.status === 'delivered' ? 'border-green-500 text-green-600 bg-green-50' : 
                                order.status === 'cancelled' ? 'border-red-500 text-red-600 bg-red-50' : 
                                'border-orange-500 text-orange-600 bg-orange-50'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="p-4 md:p-6 flex flex-col gap-6">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, idx) => {
                                const imageUrl = item.image ? `https://app-backend-msic.onrender.com/${item.image.replace(/\\/g, '/')}` : "https://via.placeholder.com/150";
                                return (
                                  <div key={idx} className="flex gap-4 md:gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="w-[80px] md:w-[120px] aspect-[4/5] bg-gray-100 border border-gray-200 shrink-0">
                                      <img src={imageUrl} alt={item.name || item.productName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-start py-1">
                                      <div className="flex justify-between items-start gap-4">
                                        <span className="font-central text-[13px] md:text-sm uppercase tracking-wider font-bold leading-snug">{item.name || item.productName}</span>
                                        <span className="font-ballinger text-sm font-bold shrink-0">PKR {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                                      </div>
                                      <span className="font-ballinger text-xs text-gray-500 mt-2 uppercase tracking-widest">{item.colorName} / {item.size}</span>
                                      <span className="font-ballinger text-xs text-gray-500 mt-1 uppercase tracking-widest">Qty: {item.quantity}</span>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="flex justify-between items-center">
                                <span className="font-ballinger text-sm text-gray-600 font-bold">This order contains {order.itemsCount || 0} item(s).</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: WISHLIST (NEW INTEGRATION) */}
              {activeTab === 'wishlist' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="font-central text-xl font-bold uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">Wishlist</h2>
                  
                  {isLoadingWishlist ? (
                    <div className="py-20 text-center font-central text-sm uppercase tracking-widest text-gray-500">
                      Loading your favorites...
                    </div>
                  ) : wishlistItems.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center">
                      <Heart className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="font-central text-sm uppercase tracking-widest text-gray-500">Your wishlist is empty.</p>
                      <button onClick={() => navigate('/')} className="mt-6 underline font-central text-xs uppercase tracking-widest font-bold hover:opacity-60 transition-opacity">Discover Products</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                      {wishlistItems.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: ACCOUNT INFO */}
              {activeTab === 'account' && (
                <div className="animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                    <h2 className="font-central text-xl font-bold uppercase tracking-widest">Account Info</h2>
                    {!isEditingAccount && (
                      <button onClick={() => setIsEditingAccount(true)} className="font-central text-xs font-bold uppercase tracking-widest text-nav-dark underline underline-offset-4 hover:opacity-60 transition-opacity">
                        Edit Profile
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-24 h-24 bg-[#f4f2ed] border border-nav-dark shrink-0 flex items-center justify-center font-central text-3xl font-bold uppercase tracking-widest text-nav-dark">
                      {accountForm.firstName ? `${accountForm.firstName.charAt(0)}${accountForm.lastName?.charAt(0) || ''}` : 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-central text-sm uppercase tracking-widest text-gray-500 mb-1">Profile Photo</span>
                      <span className="font-ballinger text-xs text-gray-400">Synced securely via your account settings.</span>
                    </div>
                  </div>

                  {isEditingAccount ? (
                    <form onSubmit={handleSaveAccount} className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">First Name</label>
                          <input required type="text" name="firstName" value={accountForm.firstName} onChange={handleAccountInputChange} disabled={isSavingAccount} className="w-full p-4 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
                        </div>
                        <div>
                          <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Last Name</label>
                          <input required type="text" name="lastName" value={accountForm.lastName} onChange={handleAccountInputChange} disabled={isSavingAccount} className="w-full p-4 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Email Address</label>
                          <input required type="email" name="email" value={accountForm.email} onChange={handleAccountInputChange} disabled={isSavingAccount} className="w-full p-4 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
                        </div>
                        <div>
                          <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Phone Number</label>
                          <input type="tel" name="phone" value={accountForm.phone} onChange={handleAccountInputChange} disabled={isSavingAccount} placeholder="Optional" className="w-full p-4 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
                        </div>
                      </div>

                      <div className="flex gap-4 mt-6">
                        <button type="submit" disabled={isSavingAccount} className={`flex-1 text-white p-4 font-central text-sm font-bold uppercase tracking-widest transition-colors ${isSavingAccount ? 'bg-gray-400 cursor-not-allowed' : 'bg-nav-dark hover:bg-black'}`}>
                          {isSavingAccount ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={() => setIsEditingAccount(false)} disabled={isSavingAccount} className="flex-1 border border-nav-dark text-nav-dark p-4 font-central text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors disabled:opacity-50">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">First Name</span>
                          <span className="font-ballinger text-base text-nav-dark">{accountForm.firstName}</span>
                        </div>
                        <div>
                          <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">Last Name</span>
                          <span className="font-ballinger text-base text-nav-dark">{accountForm.lastName}</span>
                        </div>
                        <div>
                          <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">Email Address</span>
                          <span className="font-ballinger text-base text-nav-dark">{accountForm.email}</span>
                        </div>
                        <div>
                          <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">Phone Number</span>
                          <span className="font-ballinger text-base text-nav-dark">{accountForm.phone || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: MY ADDRESSES */}
              {activeTab === 'addresses' && (
                <div className="animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                    <h2 className="font-central text-xl font-bold uppercase tracking-widest">My Addresses</h2>
                    <button onClick={() => setIsAddressModalOpen(true)} className="flex items-center gap-2 font-central text-xs font-bold uppercase tracking-widest text-nav-dark hover:opacity-60 transition-opacity">
                      <Plus className="w-4 h-4" /> Add New
                    </button>
                  </div>
                  {savedAddresses.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center">
                      <MapPin className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="font-central text-sm uppercase tracking-widest text-gray-500">You haven't saved any addresses yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedAddresses.map((addr) => (
                        <div key={addr._id || addr.id} className="border border-gray-200 p-6 flex flex-col relative group">
                          <span className="font-central text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">{addr.label}</span>
                          <span className="font-central text-sm uppercase tracking-wider font-bold mb-1">{addr.firstName} {addr.lastName}</span>
                          <span className="font-ballinger text-sm text-gray-600">{addr.address || addr.addressLine}</span>
                          <span className="font-ballinger text-sm text-gray-600">{addr.city}, {addr.postalCode || addr.postcode}</span>
                          <span className="font-ballinger text-sm text-gray-600">{addr.country}</span>
                          <button onClick={() => handleDeleteAddress(addr._id || addr.id)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50" aria-label="Delete Address">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* ADDRESS MODAL */}
      {/* ========================================== */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-[500px] shadow-2xl relative border border-nav-dark animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-[#f4f2ed]">
              <h2 className="font-central text-lg font-bold uppercase tracking-widest">Add New Address</h2>
              <button onClick={() => setIsAddressModalOpen(false)} className="hover:opacity-60 transition-opacity">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAddress} className="p-6 flex flex-col gap-4 font-ballinger">
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Label (e.g. Home, Work)</label>
                <input required type="text" name="label" value={newAddress.label} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">First Name</label>
                  <input required type="text" name="firstName" value={newAddress.firstName} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
                </div>
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Last Name</label>
                  <input required type="text" name="lastName" value={newAddress.lastName} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
                </div>
              </div>
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Address</label>
                <input required type="text" name="addressLine" value={newAddress.addressLine} onChange={handleAddressInputChange} placeholder="Street address, apartment, suite" className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">City</label>
                  <input required type="text" name="city" value={newAddress.city} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
                </div>
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Postal Code</label>
                  <input required type="text" name="postcode" value={newAddress.postcode} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
                </div>
              </div>
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Country</label>
                <select name="country" value={newAddress.country} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark bg-white">
                  <option value="Pakistan">Pakistan</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                </select>
              </div>
              <button type="submit" disabled={isSavingAddress} className={`w-full text-white p-4 font-central text-sm font-bold uppercase tracking-widest mt-4 transition-colors ${isSavingAddress ? 'bg-gray-400 cursor-not-allowed' : 'bg-nav-dark hover:bg-black'}`}>
                {isSavingAddress ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}