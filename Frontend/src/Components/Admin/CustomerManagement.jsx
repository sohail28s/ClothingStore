// import React, { useState, useEffect } from 'react';
// import { Search, Users, Mail, Phone, Ban, CheckCircle, ArrowLeft, ShoppingBag, Plus, Edit2, Save, MapPin } from 'lucide-react';

// export default function CustomerManagement() {
//   const [customers, setCustomers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // View States
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [customerOrders, setCustomerOrders] = useState([]);

//   // Form States (Add/Edit)
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
  
//   const [formData, setFormData] = useState({
//     firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', 
//     addressLine: '', city: '', country: '', postcode: ''
//   });

//   // Load and enrich customer data from API
//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem('admin_token');
//       if (!token) return;

//       const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/customers', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const result = await response.json();

//       if (!response.ok) throw new Error(result.message || 'Failed to fetch customers');

//       // Continue to pull orders from localStorage to calculate metrics until an Orders API is built
//       const allOrders = JSON.parse(localStorage.getItem('outrey_orders')) || [];
      
//       const enrichedUsers = result.data.map(user => {
//         // Note: MongoDB uses _id
//         const userOrders = allOrders.filter(o => o.customerId === user._id);
//         const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
        
//         return {
//           ...user,
//           orderCount: userOrders.length,
//           totalSpent: totalSpent
//         };
//       });

//       // Sort by highest spenders
//       enrichedUsers.sort((a, b) => b.totalSpent - a.totalSpent);
//       setCustomers(enrichedUsers);
//     } catch (error) {
//       console.error("Error loading customers:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ==========================================
//   // API: TOGGLE STATUS (BAN/RESTORE)
//   // ==========================================
//   const handleToggleStatus = async (userId, currentStatusBoolean) => {
//     const newStatusBoolean = !currentStatusBoolean; // Flip true to false, or false to true
    
//     try {
//       const token = localStorage.getItem('admin_token');
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/customer/${userId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ status: newStatusBoolean })
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || 'Failed to update status');

//       // Update UI state instantly
//       setCustomers(prev => prev.map(c => c._id === userId ? { ...c, status: newStatusBoolean } : c));
      
//       if (selectedCustomer && selectedCustomer._id === userId) {
//         setSelectedCustomer(prev => ({ ...prev, status: newStatusBoolean }));
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert("Failed to update status. Check console.");
//     }
//   };

//   const handleViewCustomer = (customer) => {
//     setSelectedCustomer(customer);
//     const allOrders = JSON.parse(localStorage.getItem('outrey_orders')) || [];
//     const userOrders = allOrders.filter(o => o.customerId === customer._id);
//     setCustomerOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
//   };

//   // ==========================================
//   // FORM HANDLERS (ADD / EDIT)
//   // ==========================================
//   const handleOpenAddForm = () => {
//     setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', addressLine: '', city: '', country: '', postcode: '' });
//     setIsEditing(false);
//     setIsFormOpen(true);
//   };

//   const handleOpenEditForm = () => {
//     // Map backend address schema to frontend form fields
//     const address = selectedCustomer.addresses?.[0] || {};
    
//     setFormData({
//       firstName: selectedCustomer.firstName || '',
//       lastName: selectedCustomer.lastName || '',
//       email: selectedCustomer.email || '',
//       phone: selectedCustomer.phone || '',
//       password: '', confirmPassword: '',
//       addressLine: address.address || '',
//       city: address.city || '',
//       country: address.country || '',
//       postcode: address.postalCode || ''
//     });
    
//     setIsEditing(true);
//     setIsFormOpen(true);
//   };

//   const handleFormChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ==========================================
//   // API: SAVE/UPDATE CUSTOMER
//   // ==========================================
//   const handleSaveCustomer = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);

//     try {
//       const token = localStorage.getItem('admin_token');

//       // Format Address Object to match backend schema
//       const addressObj = {
//         label: 'Home',
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         address: formData.addressLine,
//         city: formData.city,
//         country: formData.country,
//         postalCode: formData.postcode
//       };

//       if (isEditing) {
//         // Send PUT request to update customer
//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/customer/${selectedCustomer._id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             firstName: formData.firstName,
//             lastName: formData.lastName,
//             email: formData.email,
//             phone: formData.phone,
//             addresses: [addressObj]
//           })
//         });

//         const result = await response.json();
//         if (!response.ok) throw new Error(result.message || 'Failed to update customer');

//         // Update selected customer view
//         setSelectedCustomer({ ...selectedCustomer, ...result.data });

//       } else {
//         // Future Add Logic: Depending on your backend, you might hit an admin creation endpoint here
//         alert("Add User API not yet hooked up. Need endpoint from backend.");
//       }

//       // Reload the main list to ensure everything is perfectly synced
//       loadData();
//       setIsFormOpen(false);

//     } catch (error) {
//       console.error("Error saving customer:", error);
//       alert(error.message);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const filteredCustomers = customers.filter(c => 
//     `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     c.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // ==========================================
//   // FORM VIEW (ADD/EDIT)
//   // ==========================================
//   if (isFormOpen) {
//     return (
//       <div className="max-w-[800px] mx-auto animate-in fade-in duration-300 pb-20">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setIsFormOpen(false)} className="p-2 border border-nav-dark hover:bg-gray-100 transition-colors">
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//             <h2 className="font-central text-2xl font-bold uppercase tracking-widest">
//               {isEditing ? 'Edit Customer' : 'Add New Customer'}
//             </h2>
//           </div>
//         </div>

//         <form onSubmit={handleSaveCustomer} className="bg-white border border-nav-dark shadow-sm p-8 flex flex-col gap-8">
//           {/* PERSONAL INFO */}
//           <div>
//             <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Personal Info</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">First Name</label>
//                 <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Last Name</label>
//                 <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Email Address</label>
//                 <input type="email" name="email" value={formData.email} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Phone Number</label>
//                 <input type="text" name="phone" value={formData.phone} onChange={handleFormChange} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//             </div>
//           </div>

//           {/* PASSWORD (ONLY ON ADD) */}
//           {!isEditing && (
//             <div>
//               <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Security</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Password</label>
//                   <input type="password" name="password" value={formData.password} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                 </div>
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Confirm Password</label>
//                   <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ADDRESS */}
//           <div>
//             <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Shipping Address</h3>
//             <div className="flex flex-col gap-5">
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Street Address / House No.</label>
//                 <input type="text" name="addressLine" value={formData.addressLine} onChange={handleFormChange} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">City</label>
//                   <input type="text" name="city" value={formData.city} onChange={handleFormChange} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                 </div>
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Country</label>
//                   <input type="text" name="country" value={formData.country} onChange={handleFormChange} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                 </div>
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Postcode</label>
//                   <input type="text" name="postcode" value={formData.postcode} onChange={handleFormChange} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="pt-4 border-t border-gray-200 flex justify-end gap-4">
//             <button type="button" onClick={() => setIsFormOpen(false)} disabled={isSaving} className="px-6 py-3 font-central text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-nav-dark transition-colors disabled:opacity-50">
//               Cancel
//             </button>
//             <button type="submit" disabled={isSaving} className={`flex items-center gap-2 text-white px-8 py-3 font-central text-xs font-bold uppercase tracking-widest transition-colors ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-nav-dark hover:bg-black'}`}>
//               <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Customer'}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   // ==========================================
//   // DETAIL VIEW
//   // ==========================================
//   if (selectedCustomer) {
//     const defaultAddress = selectedCustomer.addresses?.[0];
//     const isBanned = !selectedCustomer.status; // status: true = Active, false = Banned

//     return (
//       <div className="max-w-[1000px] mx-auto animate-in fade-in duration-300 pb-20">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setSelectedCustomer(null)} className="p-2 border border-nav-dark hover:bg-gray-100 transition-colors">
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//             <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Customer Profile</h2>
//           </div>
//           <div className="flex items-center gap-3">
//             <button onClick={handleOpenEditForm} className="flex items-center gap-2 px-6 py-3 font-central text-xs font-bold uppercase tracking-widest border border-nav-dark text-nav-dark hover:bg-gray-50 transition-colors outline-none">
//               <Edit2 className="w-4 h-4" /> Edit Profile
//             </button>
//             <button 
//               onClick={() => handleToggleStatus(selectedCustomer._id, selectedCustomer.status)} 
//               className={`flex items-center gap-2 px-6 py-3 font-central text-xs font-bold uppercase tracking-widest border transition-colors outline-none ${isBanned ? 'bg-white border-nav-dark text-nav-dark hover:bg-gray-50' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'}`}
//             >
//               {isBanned ? <><CheckCircle className="w-4 h-4" /> Restore</> : <><Ban className="w-4 h-4" /> Ban</>}
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column */}
//           <div className="flex flex-col gap-8">
//             <div className="bg-white border border-nav-dark shadow-sm p-6 flex flex-col items-center text-center">
//               <div className="w-24 h-24 bg-[#f4f2ed] border border-nav-dark flex items-center justify-center font-central text-3xl font-bold uppercase tracking-widest mb-4">
//                 {selectedCustomer.firstName.charAt(0)}{selectedCustomer.lastName?.charAt(0) || ''}
//               </div>
//               <h3 className="font-central text-lg font-bold uppercase tracking-widest">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
//               <span className={`mt-2 px-3 py-1 text-[10px] font-central font-bold uppercase tracking-widest border ${isBanned ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
//                 {isBanned ? 'Banned' : 'Active'}
//               </span>
//             </div>

//             <div className="bg-white border border-nav-dark shadow-sm p-6 flex flex-col gap-5">
//               <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">Contact Info</h3>
//               <div className="flex items-center gap-3">
//                 <Mail className="w-4 h-4 text-gray-400 shrink-0" />
//                 <a href={`mailto:${selectedCustomer.email}`} className="font-ballinger text-sm text-blue-600 hover:underline truncate">{selectedCustomer.email}</a>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Phone className="w-4 h-4 text-gray-400 shrink-0" />
//                 <span className="font-ballinger text-sm text-gray-700">{selectedCustomer.phone || 'No phone'}</span>
//               </div>
//               <div className="flex items-start gap-3 pt-2">
//                 <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
//                 <span className="font-ballinger text-sm text-gray-700 leading-relaxed">
//                   {defaultAddress?.address ? (
//                     <>{defaultAddress.address}<br/>{defaultAddress.city}, {defaultAddress.postalCode}<br/>{defaultAddress.country}</>
//                   ) : 'No address saved.'}
//                 </span>
//               </div>
//             </div>

//             <div className="bg-white border border-nav-dark shadow-sm p-6 flex flex-col gap-5">
//               <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">Metrics</h3>
//               <div className="flex justify-between items-center">
//                 <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500">Lifetime Value</span>
//                 <span className="font-ballinger text-sm font-bold">PKR {selectedCustomer.totalSpent?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500">Total Orders</span>
//                 <span className="font-ballinger text-sm font-bold">{selectedCustomer.orderCount || 0}</span>
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Order History */}
//           <div className="lg:col-span-2">
//             <div className="bg-white border border-nav-dark shadow-sm">
//               <div className="p-6 border-b border-nav-dark bg-[#f4f2ed] flex items-center justify-between">
//                 <h3 className="font-central text-sm font-bold uppercase tracking-widest">Order History</h3>
//                 <span className="font-ballinger text-xs text-gray-500">{customerOrders.length} Orders</span>
//               </div>
//               <div className="flex flex-col">
//                 {customerOrders.length === 0 ? (
//                   <div className="p-10 text-center flex flex-col items-center">
//                     <ShoppingBag className="w-10 h-10 text-gray-300 mb-3" />
//                     <p className="font-central text-xs uppercase tracking-widest text-gray-500">No orders placed yet.</p>
//                   </div>
//                 ) : (
//                   customerOrders.map((order, idx) => (
//                     <div key={order.orderId} className={`p-6 flex justify-between items-center border-b border-gray-100 ${idx === customerOrders.length - 1 ? 'border-none' : ''}`}>
//                       <div className="flex flex-col gap-1">
//                         <span className="font-central text-sm font-bold uppercase tracking-widest">{order.orderId}</span>
//                         <span className="font-ballinger text-xs text-gray-500">
//                           {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-6">
//                         <span className={`px-2 py-1 text-[10px] font-central font-bold uppercase tracking-widest border ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' : order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
//                           {order.status || 'Processing'}
//                         </span>
//                         <span className="font-ballinger text-sm font-bold min-w-[80px] text-right">PKR {order.total.toLocaleString()}</span>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ==========================================
//   // LIST VIEW
//   // ==========================================
//   return (
//     <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//         <div className="flex items-center gap-4">
//           <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Customers</h2>
//           <span className="bg-nav-dark text-white font-ballinger text-xs px-3 py-1 rounded-full">{customers.length} Total</span>
//         </div>
//         <div className="flex items-center gap-4 w-full md:w-auto">
//           <div className="relative flex-1 md:w-[300px]">
//             <input 
//               type="text" 
//               placeholder="Search by name or email..." 
//               value={searchTerm} 
//               onChange={(e) => setSearchTerm(e.target.value)} 
//               className="w-full p-3 pl-10 border border-nav-dark outline-none focus:bg-white font-ballinger text-sm transition-colors" 
//             />
//             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           </div>
//           <button onClick={handleOpenAddForm} className="flex items-center justify-center gap-2 bg-nav-dark text-white px-6 py-3 font-central text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors shrink-0">
//             <Plus className="w-4 h-4" /> Add
//           </button>
//         </div>
//       </div>

//       <div className="bg-white border border-nav-dark shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left font-ballinger text-sm">
//             <thead className="bg-[#f4f2ed] border-b border-nav-dark font-central text-[10px] uppercase tracking-widest text-gray-500">
//               <tr>
//                 <th className="p-4 font-bold">Customer</th>
//                 <th className="p-4 font-bold">Contact</th>
//                 <th className="p-4 font-bold text-center">Orders</th>
//                 <th className="p-4 font-bold text-right">Total Spent</th>
//                 <th className="p-4 font-bold text-center">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading ? (
//                 <tr>
//                   <td colSpan="5" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">Loading customers...</td>
//                 </tr>
//               ) : filteredCustomers.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">No customers found.</td>
//                 </tr>
//               ) : (
//                 filteredCustomers.map((customer, idx) => {
//                   const isBanned = !customer.status;
//                   return (
//                     <tr key={customer._id} onClick={() => handleViewCustomer(customer)} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group ${idx === filteredCustomers.length - 1 ? 'border-none' : ''}`}>
//                       <td className="p-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-gray-200 shrink-0 flex items-center justify-center font-central text-xs font-bold uppercase tracking-widest">
//                             {customer.firstName.charAt(0)}{customer.lastName?.charAt(0) || ''}
//                           </div>
//                           <span className="font-bold group-hover:text-blue-600 transition-colors">{customer.firstName} {customer.lastName}</span>
//                         </div>
//                       </td>
//                       <td className="p-4 text-gray-600">{customer.email}</td>
//                       <td className="p-4 text-center font-bold">{customer.orderCount}</td>
//                       <td className="p-4 text-right font-bold">PKR {customer.totalSpent?.toLocaleString()}</td>
//                       <td className="p-4 text-center">
//                         <span className={`px-2 py-1 text-[9px] font-central font-bold uppercase tracking-widest border ${isBanned ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
//                           {isBanned ? 'Banned' : 'Active'}
//                         </span>
//                       </td>
//                     </tr>
//                   )
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useState, useEffect } from 'react';
// import { Search, Users, Mail, Phone, Ban, CheckCircle, ArrowLeft, ShoppingBag, Plus, Edit2, Save, MapPin } from 'lucide-react';

// export default function CustomerManagement() {
//   const [customers, setCustomers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // View States
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [customerOrders, setCustomerOrders] = useState([]);

//   // Form States (Add/Edit)
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
  
//   const [formData, setFormData] = useState({
//     firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', 
//     addressLine: '', city: '', country: '', postcode: ''
//   });

//   // Load and enrich customer data from API
//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem('admin_token');
//       if (!token) return;

//       const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/customers', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const result = await response.json();

//       if (!response.ok) throw new Error(result.message || 'Failed to fetch customers');

//       // Continue to pull orders from localStorage to calculate metrics until an Orders API is built
//       const allOrders = JSON.parse(localStorage.getItem('outrey_orders')) || [];
      
//       const enrichedUsers = result.data.map(user => {
//         const userOrders = allOrders.filter(o => o.customerId === user._id);
//         const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
        
//         return {
//           ...user,
//           orderCount: userOrders.length,
//           totalSpent: totalSpent
//         };
//       });

//       enrichedUsers.sort((a, b) => b.totalSpent - a.totalSpent);
//       setCustomers(enrichedUsers);
//     } catch (error) {
//       console.error("Error loading customers:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ==========================================
//   // API: TOGGLE STATUS (BAN/RESTORE)
//   // ==========================================
//   const handleToggleStatus = async (userId, currentStatusBoolean) => {
//     const newStatusBoolean = !currentStatusBoolean; 
    
//     try {
//       const token = localStorage.getItem('admin_token');
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/customer/${userId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ status: newStatusBoolean })
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || 'Failed to update status');

//       setCustomers(prev => prev.map(c => c._id === userId ? { ...c, status: newStatusBoolean } : c));
      
//       if (selectedCustomer && selectedCustomer._id === userId) {
//         setSelectedCustomer(prev => ({ ...prev, status: newStatusBoolean }));
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert("Failed to update status. Check console.");
//     }
//   };

//   const handleViewCustomer = (customer) => {
//     setSelectedCustomer(customer);
//     const allOrders = JSON.parse(localStorage.getItem('outrey_orders')) || [];
//     const userOrders = allOrders.filter(o => o.customerId === customer._id);
//     setCustomerOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
//   };

//   // ==========================================
//   // FORM HANDLERS (ADD / EDIT)
//   // ==========================================
//   const handleOpenAddForm = () => {
//     setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', addressLine: '', city: '', country: '', postcode: '' });
//     setIsEditing(false);
//     setIsFormOpen(true);
//   };

//   const handleOpenEditForm = () => {
//     const address = selectedCustomer.addresses?.[0] || {};
    
//     setFormData({
//       firstName: selectedCustomer.firstName || '',
//       lastName: selectedCustomer.lastName || '',
//       email: selectedCustomer.email || '',
//       phone: selectedCustomer.phone || '',
//       password: '', confirmPassword: '',
//       addressLine: address.address || '',
//       city: address.city || '',
//       country: address.country || '',
//       postcode: address.postalCode || ''
//     });
    
//     setIsEditing(true);
//     setIsFormOpen(true);
//   };

//   const handleFormChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ==========================================
//   // API: SAVE/UPDATE CUSTOMER
//   // ==========================================
//   const handleSaveCustomer = async (e) => {
//     e.preventDefault();
    
//     // Front-end password validation on creation
//     if (!isEditing && formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     setIsSaving(true);

//     try {
//       const token = localStorage.getItem('admin_token');

//       if (isEditing) {
//         // --- PUT: EDIT EXISTING CUSTOMER ---
//         const addressObj = {
//           label: 'Home',
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           address: formData.addressLine,
//           city: formData.city,
//           country: formData.country,
//           postalCode: formData.postcode
//         };

//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/customer/${selectedCustomer._id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             firstName: formData.firstName,
//             lastName: formData.lastName,
//             email: formData.email,
//             phone: formData.phone,
//             addresses: [addressObj]
//           })
//         });

//         const result = await response.json();
//         if (!response.ok) throw new Error(result.message || 'Failed to update customer');

//         setSelectedCustomer({ ...selectedCustomer, ...result.data });

//       } else {
//         // --- POST: ADD NEW CUSTOMER ---
//         const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/customer', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             firstName: formData.firstName,
//             lastName: formData.lastName,
//             email: formData.email,
//             password: formData.password, // Set by Admin
//             phone: formData.phone,
//             address: formData.addressLine, // Mapped accurately for backend
//             city: formData.city,
//             postalCode: formData.postcode, // Mapped accurately for backend
//             country: formData.country
//           })
//         });

//         const result = await response.json();
//         if (!response.ok || result.status === "Fail") {
//           throw new Error(result.message || 'Failed to create customer');
//         }
//       }

//       // Reload the main list to ensure everything is perfectly synced with the DB
//       loadData();
//       setIsFormOpen(false);

//     } catch (error) {
//       console.error("Error saving customer:", error);
//       alert(error.message);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const filteredCustomers = customers.filter(c => 
//     `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     c.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // ==========================================
//   // FORM VIEW (ADD/EDIT)
//   // ==========================================
//   if (isFormOpen) {
//     return (
//       <div className="max-w-[800px] mx-auto animate-in fade-in duration-300 pb-20">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setIsFormOpen(false)} className="p-2 border border-nav-dark hover:bg-gray-100 transition-colors">
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//             <h2 className="font-central text-2xl font-bold uppercase tracking-widest">
//               {isEditing ? 'Edit Customer' : 'Add New Customer'}
//             </h2>
//           </div>
//         </div>

//         <form onSubmit={handleSaveCustomer} className="bg-white border border-nav-dark shadow-sm p-8 flex flex-col gap-8">
//           {/* PERSONAL INFO */}
//           <div>
//             <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Personal Info</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">First Name</label>
//                 <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Last Name</label>
//                 <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Email Address</label>
//                 <input type="email" name="email" value={formData.email} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Phone Number</label>
//                 <input type="text" name="phone" value={formData.phone} onChange={handleFormChange} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//             </div>
//           </div>

//           {/* PASSWORD (ONLY ON ADD) */}
//           {!isEditing && (
//             <div>
//               <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Security</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Password</label>
//                   <input type="password" name="password" value={formData.password} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                 </div>
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Confirm Password</label>
//                   <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ADDRESS */}
//           <div>
//             <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Shipping Address</h3>
//             <div className="flex flex-col gap-5">
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Street Address / House No.</label>
//                 <input type="text" name="addressLine" value={formData.addressLine} onChange={handleFormChange} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">City</label>
//                   <input type="text" name="city" value={formData.city} onChange={handleFormChange} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                 </div>
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Country</label>
//                   <input type="text" name="country" value={formData.country} onChange={handleFormChange} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                 </div>
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Postcode</label>
//                   <input type="text" name="postcode" value={formData.postcode} onChange={handleFormChange} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="pt-4 border-t border-gray-200 flex justify-end gap-4">
//             <button type="button" onClick={() => setIsFormOpen(false)} disabled={isSaving} className="px-6 py-3 font-central text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-nav-dark transition-colors disabled:opacity-50">
//               Cancel
//             </button>
//             <button type="submit" disabled={isSaving} className={`flex items-center gap-2 text-white px-8 py-3 font-central text-xs font-bold uppercase tracking-widest transition-colors ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-nav-dark hover:bg-black'}`}>
//               <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Customer'}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   // ==========================================
//   // DETAIL VIEW
//   // ==========================================
//   if (selectedCustomer) {
//     const defaultAddress = selectedCustomer.addresses?.[0];
//     const isBanned = !selectedCustomer.status;

//     return (
//       <div className="max-w-[1000px] mx-auto animate-in fade-in duration-300 pb-20">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setSelectedCustomer(null)} className="p-2 border border-nav-dark hover:bg-gray-100 transition-colors">
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//             <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Customer Profile</h2>
//           </div>
//           <div className="flex items-center gap-3">
//             <button onClick={handleOpenEditForm} className="flex items-center gap-2 px-6 py-3 font-central text-xs font-bold uppercase tracking-widest border border-nav-dark text-nav-dark hover:bg-gray-50 transition-colors outline-none">
//               <Edit2 className="w-4 h-4" /> Edit Profile
//             </button>
//             <button 
//               onClick={() => handleToggleStatus(selectedCustomer._id, selectedCustomer.status)} 
//               className={`flex items-center gap-2 px-6 py-3 font-central text-xs font-bold uppercase tracking-widest border transition-colors outline-none ${isBanned ? 'bg-white border-nav-dark text-nav-dark hover:bg-gray-50' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'}`}
//             >
//               {isBanned ? <><CheckCircle className="w-4 h-4" /> Restore</> : <><Ban className="w-4 h-4" /> Ban</>}
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column */}
//           <div className="flex flex-col gap-8">
//             <div className="bg-white border border-nav-dark shadow-sm p-6 flex flex-col items-center text-center">
//               <div className="w-24 h-24 bg-[#f4f2ed] border border-nav-dark flex items-center justify-center font-central text-3xl font-bold uppercase tracking-widest mb-4">
//                 {selectedCustomer.firstName.charAt(0)}{selectedCustomer.lastName?.charAt(0) || ''}
//               </div>
//               <h3 className="font-central text-lg font-bold uppercase tracking-widest">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
//               <span className={`mt-2 px-3 py-1 text-[10px] font-central font-bold uppercase tracking-widest border ${isBanned ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
//                 {isBanned ? 'Banned' : 'Active'}
//               </span>
//             </div>

//             <div className="bg-white border border-nav-dark shadow-sm p-6 flex flex-col gap-5">
//               <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">Contact Info</h3>
//               <div className="flex items-center gap-3">
//                 <Mail className="w-4 h-4 text-gray-400 shrink-0" />
//                 <a href={`mailto:${selectedCustomer.email}`} className="font-ballinger text-sm text-blue-600 hover:underline truncate">{selectedCustomer.email}</a>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Phone className="w-4 h-4 text-gray-400 shrink-0" />
//                 <span className="font-ballinger text-sm text-gray-700">{selectedCustomer.phone || 'No phone'}</span>
//               </div>
//               <div className="flex items-start gap-3 pt-2">
//                 <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
//                 <span className="font-ballinger text-sm text-gray-700 leading-relaxed">
//                   {defaultAddress?.address ? (
//                     <>{defaultAddress.address}<br/>{defaultAddress.city}, {defaultAddress.postalCode}<br/>{defaultAddress.country}</>
//                   ) : 'No address saved.'}
//                 </span>
//               </div>
//             </div>

//             <div className="bg-white border border-nav-dark shadow-sm p-6 flex flex-col gap-5">
//               <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">Metrics</h3>
//               <div className="flex justify-between items-center">
//                 <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500">Lifetime Value</span>
//                 <span className="font-ballinger text-sm font-bold">PKR {selectedCustomer.totalSpent?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500">Total Orders</span>
//                 <span className="font-ballinger text-sm font-bold">{selectedCustomer.orderCount || 0}</span>
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Order History */}
//           <div className="lg:col-span-2">
//             <div className="bg-white border border-nav-dark shadow-sm">
//               <div className="p-6 border-b border-nav-dark bg-[#f4f2ed] flex items-center justify-between">
//                 <h3 className="font-central text-sm font-bold uppercase tracking-widest">Order History</h3>
//                 <span className="font-ballinger text-xs text-gray-500">{customerOrders.length} Orders</span>
//               </div>
//               <div className="flex flex-col">
//                 {customerOrders.length === 0 ? (
//                   <div className="p-10 text-center flex flex-col items-center">
//                     <ShoppingBag className="w-10 h-10 text-gray-300 mb-3" />
//                     <p className="font-central text-xs uppercase tracking-widest text-gray-500">No orders placed yet.</p>
//                   </div>
//                 ) : (
//                   customerOrders.map((order, idx) => (
//                     <div key={order.orderId} className={`p-6 flex justify-between items-center border-b border-gray-100 ${idx === customerOrders.length - 1 ? 'border-none' : ''}`}>
//                       <div className="flex flex-col gap-1">
//                         <span className="font-central text-sm font-bold uppercase tracking-widest">{order.orderId}</span>
//                         <span className="font-ballinger text-xs text-gray-500">
//                           {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-6">
//                         <span className={`px-2 py-1 text-[10px] font-central font-bold uppercase tracking-widest border ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' : order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
//                           {order.status || 'Processing'}
//                         </span>
//                         <span className="font-ballinger text-sm font-bold min-w-[80px] text-right">PKR {order.total.toLocaleString()}</span>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ==========================================
//   // LIST VIEW
//   // ==========================================
//   return (
//     <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//         <div className="flex items-center gap-4">
//           <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Customers</h2>
//           <span className="bg-nav-dark text-white font-ballinger text-xs px-3 py-1 rounded-full">{customers.length} Total</span>
//         </div>
//         <div className="flex items-center gap-4 w-full md:w-auto">
//           <div className="relative flex-1 md:w-[300px]">
//             <input 
//               type="text" 
//               placeholder="Search by name or email..." 
//               value={searchTerm} 
//               onChange={(e) => setSearchTerm(e.target.value)} 
//               className="w-full p-3 pl-10 border border-nav-dark outline-none focus:bg-white font-ballinger text-sm transition-colors" 
//             />
//             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           </div>
//           <button onClick={handleOpenAddForm} className="flex items-center justify-center gap-2 bg-nav-dark text-white px-6 py-3 font-central text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors shrink-0">
//             <Plus className="w-4 h-4" /> Add
//           </button>
//         </div>
//       </div>

//       <div className="bg-white border border-nav-dark shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left font-ballinger text-sm">
//             <thead className="bg-[#f4f2ed] border-b border-nav-dark font-central text-[10px] uppercase tracking-widest text-gray-500">
//               <tr>
//                 <th className="p-4 font-bold">Customer</th>
//                 <th className="p-4 font-bold">Contact</th>
//                 <th className="p-4 font-bold text-center">Orders</th>
//                 <th className="p-4 font-bold text-right">Total Spent</th>
//                 <th className="p-4 font-bold text-center">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading ? (
//                 <tr>
//                   <td colSpan="5" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">Loading customers...</td>
//                 </tr>
//               ) : filteredCustomers.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">No customers found.</td>
//                 </tr>
//               ) : (
//                 filteredCustomers.map((customer, idx) => {
//                   const isBanned = !customer.status;
//                   return (
//                     <tr key={customer._id} onClick={() => handleViewCustomer(customer)} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group ${idx === filteredCustomers.length - 1 ? 'border-none' : ''}`}>
//                       <td className="p-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-gray-200 shrink-0 flex items-center justify-center font-central text-xs font-bold uppercase tracking-widest">
//                             {customer.firstName.charAt(0)}{customer.lastName?.charAt(0) || ''}
//                           </div>
//                           <span className="font-bold group-hover:text-blue-600 transition-colors">{customer.firstName} {customer.lastName}</span>
//                         </div>
//                       </td>
//                       <td className="p-4 text-gray-600">{customer.email}</td>
//                       <td className="p-4 text-center font-bold">{customer.orderCount}</td>
//                       <td className="p-4 text-right font-bold">PKR {customer.totalSpent?.toLocaleString()}</td>
//                       <td className="p-4 text-center">
//                         <span className={`px-2 py-1 text-[9px] font-central font-bold uppercase tracking-widest border ${isBanned ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
//                           {isBanned ? 'Banned' : 'Active'}
//                         </span>
//                       </td>
//                     </tr>
//                   )
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useState, useEffect } from 'react';
// import { Search, Users, Mail, Phone, Ban, CheckCircle, ArrowLeft, ShoppingBag, Plus, Edit2, Save, MapPin } from 'lucide-react';

// export default function CustomerManagement() {
//   const [customers, setCustomers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // View States
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [customerOrders, setCustomerOrders] = useState([]);

//   // Form States (Add/Edit)
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
  
//   // Notice: addresses is now an array of objects to handle multiple saved addresses perfectly
//   const [formData, setFormData] = useState({
//     firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', 
//     addresses: [
//       { label: 'Home', firstName: '', lastName: '', address: '', city: '', postalCode: '', country: 'Pakistan' }
//     ]
//   });

//   // Load and enrich customer data from API
//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem('admin_token');
//       if (!token) return;

//       const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/customers', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const result = await response.json();

//       if (!response.ok) throw new Error(result.message || 'Failed to fetch customers');

//       const allOrders = JSON.parse(localStorage.getItem('outrey_orders')) || [];
      
//       const enrichedUsers = result.data.map(user => {
//         const userOrders = allOrders.filter(o => o.customerId === user._id);
//         const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
        
//         return {
//           ...user,
//           orderCount: userOrders.length,
//           totalSpent: totalSpent
//         };
//       });

//       enrichedUsers.sort((a, b) => b.totalSpent - a.totalSpent);
//       setCustomers(enrichedUsers);
//     } catch (error) {
//       console.error("Error loading customers:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ==========================================
//   // API: TOGGLE STATUS (BAN/RESTORE)
//   // ==========================================
//   const handleToggleStatus = async (userId, currentStatusBoolean) => {
//     const newStatusBoolean = !currentStatusBoolean; 
    
//     try {
//       const token = localStorage.getItem('admin_token');
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/customer/${userId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ status: newStatusBoolean })
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || 'Failed to update status');

//       setCustomers(prev => prev.map(c => c._id === userId ? { ...c, status: newStatusBoolean } : c));
      
//       if (selectedCustomer && selectedCustomer._id === userId) {
//         setSelectedCustomer(prev => ({ ...prev, status: newStatusBoolean }));
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert("Failed to update status. Check console.");
//     }
//   };

//   const handleViewCustomer = (customer) => {
//     setSelectedCustomer(customer);
//     const allOrders = JSON.parse(localStorage.getItem('outrey_orders')) || [];
//     const userOrders = allOrders.filter(o => o.customerId === customer._id);
//     setCustomerOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
//   };

//   // ==========================================
//   // FORM HANDLERS (ADD / EDIT)
//   // ==========================================
//   const handleOpenAddForm = () => {
//     setFormData({ 
//       firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', 
//       addresses: [{ label: 'Home', firstName: '', lastName: '', address: '', city: '', postalCode: '', country: 'Pakistan' }]
//     });
//     setIsEditing(false);
//     setIsFormOpen(true);
//   };

//   const handleOpenEditForm = () => {
//     // Map ALL user addresses, or provide one empty one if they have none
//     const userAddresses = selectedCustomer.addresses && selectedCustomer.addresses.length > 0
//       ? selectedCustomer.addresses.map(addr => ({
//           _id: addr._id, // Keep the ID so Mongoose knows which one to update
//           label: addr.label || 'Home',
//           firstName: addr.firstName || '',
//           lastName: addr.lastName || '',
//           address: addr.address || '',
//           city: addr.city || '',
//           postalCode: addr.postalCode || '',
//           country: addr.country || 'Pakistan'
//         }))
//       : [{ label: 'Home', firstName: '', lastName: '', address: '', city: '', postalCode: '', country: 'Pakistan' }];
    
//     setFormData({
//       firstName: selectedCustomer.firstName || '',
//       lastName: selectedCustomer.lastName || '',
//       email: selectedCustomer.email || '',
//       phone: selectedCustomer.phone || '',
//       password: '', confirmPassword: '',
//       addresses: userAddresses
//     });
    
//     setIsEditing(true);
//     setIsFormOpen(true);
//   };

//   const handleFormChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // New specific handler for updating array items safely
//   const handleAddressChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedAddresses = [...formData.addresses];
//     updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
//     setFormData({ ...formData, addresses: updatedAddresses });
//   };

//   // ==========================================
//   // API: SAVE/UPDATE CUSTOMER
//   // ==========================================
//   const handleSaveCustomer = async (e) => {
//     e.preventDefault();
    
//     if (!isEditing && formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     setIsSaving(true);

//     try {
//       const token = localStorage.getItem('admin_token');

//       if (isEditing) {
//         // --- PUT: EDIT EXISTING CUSTOMER ---
//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/customer/${selectedCustomer._id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             firstName: formData.firstName,
//             lastName: formData.lastName,
//             email: formData.email,
//             phone: formData.phone,
//             // Send the entire array of edited addresses directly matching the schema
//             addresses: formData.addresses 
//           })
//         });

//         const result = await response.json();
//         if (!response.ok) throw new Error(result.message || 'Failed to update customer');

//         setSelectedCustomer({ ...selectedCustomer, ...result.data });

//       } else {
//         // --- POST: ADD NEW CUSTOMER ---
//         // Your specific POST API expects flat address variables for creation
//         const firstAddress = formData.addresses[0];
        
//         const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/customer', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             firstName: formData.firstName,
//             lastName: formData.lastName,
//             email: formData.email,
//             password: formData.password,
//             phone: formData.phone,
//             address: firstAddress.address, 
//             city: firstAddress.city,
//             postalCode: firstAddress.postalCode, 
//             country: firstAddress.country
//           })
//         });

//         const result = await response.json();
//         if (!response.ok || result.status === "Fail") {
//           throw new Error(result.message || 'Failed to create customer');
//         }
//       }

//       loadData();
//       setIsFormOpen(false);

//     } catch (error) {
//       console.error("Error saving customer:", error);
//       alert(error.message);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const filteredCustomers = customers.filter(c => 
//     `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     c.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // ==========================================
//   // FORM VIEW (ADD/EDIT)
//   // ==========================================
//   if (isFormOpen) {
//     return (
//       <div className="max-w-[800px] mx-auto animate-in fade-in duration-300 pb-20">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setIsFormOpen(false)} className="p-2 border border-nav-dark hover:bg-gray-100 transition-colors">
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//             <h2 className="font-central text-2xl font-bold uppercase tracking-widest">
//               {isEditing ? 'Edit Customer' : 'Add New Customer'}
//             </h2>
//           </div>
//         </div>

//         <form onSubmit={handleSaveCustomer} className="bg-white border border-nav-dark shadow-sm p-8 flex flex-col gap-8">
//           {/* PERSONAL INFO */}
//           <div>
//             <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Personal Info</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">First Name</label>
//                 <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Last Name</label>
//                 <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Email Address</label>
//                 <input type="email" name="email" value={formData.email} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//               <div>
//                 <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Phone Number</label>
//                 <input type="text" name="phone" value={formData.phone} onChange={handleFormChange} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//               </div>
//             </div>
//           </div>

//           {/* PASSWORD (ONLY ON ADD) */}
//           {!isEditing && (
//             <div>
//               <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Security</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Password</label>
//                   <input type="password" name="password" value={formData.password} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                 </div>
//                 <div>
//                   <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Confirm Password</label>
//                   <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* MULTIPLE ADDRESSES ITERATION */}
//           <div>
//             <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">
//               Saved Addresses ({formData.addresses.length})
//             </h3>
            
//             <div className="flex flex-col gap-8">
//               {formData.addresses.map((addressObj, index) => (
//                 <div key={index} className="relative bg-gray-50 p-6 border border-gray-200">
//                   <span className="absolute top-0 right-0 bg-nav-dark text-white font-central text-[10px] font-bold uppercase px-3 py-1">
//                     Address {index + 1}
//                   </span>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5 mt-2">
//                     <div>
//                       <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Label</label>
//                       <input type="text" name="label" value={addressObj.label} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" placeholder="e.g. Home, Office" />
//                     </div>
//                     <div>
//                       <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">First Name</label>
//                       <input type="text" name="firstName" value={addressObj.firstName} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                     </div>
//                     <div>
//                       <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Last Name</label>
//                       <input type="text" name="lastName" value={addressObj.lastName} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-5">
//                     <div>
//                       <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Street Address / House No.</label>
//                       <input type="text" name="address" value={addressObj.address} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" placeholder="House 15, Street 2..." />
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                       <div>
//                         <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">City</label>
//                         <input type="text" name="city" value={addressObj.city} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" placeholder="Lahore" />
//                       </div>
//                       <div>
//                         <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Country</label>
//                         <input type="text" name="country" value={addressObj.country} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" placeholder="Pakistan" />
//                       </div>
//                       <div>
//                         <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Postal Code</label>
//                         <input type="text" name="postalCode" value={addressObj.postalCode} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" placeholder="54000" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="pt-4 border-t border-gray-200 flex justify-end gap-4">
//             <button type="button" onClick={() => setIsFormOpen(false)} disabled={isSaving} className="px-6 py-3 font-central text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-nav-dark transition-colors disabled:opacity-50">
//               Cancel
//             </button>
//             <button type="submit" disabled={isSaving} className={`flex items-center gap-2 text-white px-8 py-3 font-central text-xs font-bold uppercase tracking-widest transition-colors ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-nav-dark hover:bg-black'}`}>
//               <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Customer'}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   // ==========================================
//   // DETAIL VIEW
//   // ==========================================
//   if (selectedCustomer) {
//     const isBanned = !selectedCustomer.status;

//     return (
//       <div className="max-w-[1000px] mx-auto animate-in fade-in duration-300 pb-20">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setSelectedCustomer(null)} className="p-2 border border-nav-dark hover:bg-gray-100 transition-colors">
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//             <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Customer Profile</h2>
//           </div>
//           <div className="flex items-center gap-3">
//             <button onClick={handleOpenEditForm} className="flex items-center gap-2 px-6 py-3 font-central text-xs font-bold uppercase tracking-widest border border-nav-dark text-nav-dark hover:bg-gray-50 transition-colors outline-none">
//               <Edit2 className="w-4 h-4" /> Edit Profile
//             </button>
//             <button 
//               onClick={() => handleToggleStatus(selectedCustomer._id, selectedCustomer.status)} 
//               className={`flex items-center gap-2 px-6 py-3 font-central text-xs font-bold uppercase tracking-widest border transition-colors outline-none ${isBanned ? 'bg-white border-nav-dark text-nav-dark hover:bg-gray-50' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'}`}
//             >
//               {isBanned ? <><CheckCircle className="w-4 h-4" /> Restore</> : <><Ban className="w-4 h-4" /> Ban</>}
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column */}
//           <div className="flex flex-col gap-8">
//             <div className="bg-white border border-nav-dark shadow-sm p-6 flex flex-col items-center text-center">
//               <div className="w-24 h-24 bg-[#f4f2ed] border border-nav-dark flex items-center justify-center font-central text-3xl font-bold uppercase tracking-widest mb-4">
//                 {selectedCustomer.firstName.charAt(0)}{selectedCustomer.lastName?.charAt(0) || ''}
//               </div>
//               <h3 className="font-central text-lg font-bold uppercase tracking-widest">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
//               <span className={`mt-2 px-3 py-1 text-[10px] font-central font-bold uppercase tracking-widest border ${isBanned ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
//                 {isBanned ? 'Banned' : 'Active'}
//               </span>
//             </div>

//             <div className="bg-white border border-nav-dark shadow-sm p-6 flex flex-col gap-5">
//               <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">Contact Info</h3>
//               <div className="flex items-center gap-3">
//                 <Mail className="w-4 h-4 text-gray-400 shrink-0" />
//                 <a href={`mailto:${selectedCustomer.email}`} className="font-ballinger text-sm text-blue-600 hover:underline truncate">{selectedCustomer.email}</a>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Phone className="w-4 h-4 text-gray-400 shrink-0" />
//                 <span className="font-ballinger text-sm text-gray-700">{selectedCustomer.phone || 'No phone'}</span>
//               </div>
              
//               <div className="border-t border-gray-100 pt-3 mt-2">
//                 <h4 className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3">Saved Addresses ({selectedCustomer.addresses?.length || 0})</h4>
//                 {selectedCustomer.addresses?.length > 0 ? (
//                   <div className="flex flex-col gap-4">
//                     {selectedCustomer.addresses.map((addr, idx) => (
//                       <div key={idx} className="flex items-start gap-3">
//                         <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
//                         <span className="font-ballinger text-sm text-gray-700 leading-relaxed">
//                           <strong>{addr.label}</strong><br/>
//                           {addr.address}<br/>
//                           {addr.city}, {addr.postalCode}<br/>
//                           {addr.country}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <span className="font-ballinger text-sm text-gray-500">No addresses saved.</span>
//                 )}
//               </div>
//             </div>

//             <div className="bg-white border border-nav-dark shadow-sm p-6 flex flex-col gap-5">
//               <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">Metrics</h3>
//               <div className="flex justify-between items-center">
//                 <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500">Lifetime Value</span>
//                 <span className="font-ballinger text-sm font-bold">PKR {selectedCustomer.totalSpent?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500">Total Orders</span>
//                 <span className="font-ballinger text-sm font-bold">{selectedCustomer.orderCount || 0}</span>
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Order History */}
//           <div className="lg:col-span-2">
//             <div className="bg-white border border-nav-dark shadow-sm">
//               <div className="p-6 border-b border-nav-dark bg-[#f4f2ed] flex items-center justify-between">
//                 <h3 className="font-central text-sm font-bold uppercase tracking-widest">Order History</h3>
//                 <span className="font-ballinger text-xs text-gray-500">{customerOrders.length} Orders</span>
//               </div>
//               <div className="flex flex-col">
//                 {customerOrders.length === 0 ? (
//                   <div className="p-10 text-center flex flex-col items-center">
//                     <ShoppingBag className="w-10 h-10 text-gray-300 mb-3" />
//                     <p className="font-central text-xs uppercase tracking-widest text-gray-500">No orders placed yet.</p>
//                   </div>
//                 ) : (
//                   customerOrders.map((order, idx) => (
//                     <div key={order.orderId} className={`p-6 flex justify-between items-center border-b border-gray-100 ${idx === customerOrders.length - 1 ? 'border-none' : ''}`}>
//                       <div className="flex flex-col gap-1">
//                         <span className="font-central text-sm font-bold uppercase tracking-widest">{order.orderId}</span>
//                         <span className="font-ballinger text-xs text-gray-500">
//                           {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-6">
//                         <span className={`px-2 py-1 text-[10px] font-central font-bold uppercase tracking-widest border ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' : order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
//                           {order.status || 'Processing'}
//                         </span>
//                         <span className="font-ballinger text-sm font-bold min-w-[80px] text-right">PKR {order.total.toLocaleString()}</span>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ==========================================
//   // LIST VIEW
//   // ==========================================
//   return (
//     <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//         <div className="flex items-center gap-4">
//           <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Customers</h2>
//           <span className="bg-nav-dark text-white font-ballinger text-xs px-3 py-1 rounded-full">{customers.length} Total</span>
//         </div>
//         <div className="flex items-center gap-4 w-full md:w-auto">
//           <div className="relative flex-1 md:w-[300px]">
//             <input 
//               type="text" 
//               placeholder="Search by name or email..." 
//               value={searchTerm} 
//               onChange={(e) => setSearchTerm(e.target.value)} 
//               className="w-full p-3 pl-10 border border-nav-dark outline-none focus:bg-white font-ballinger text-sm transition-colors" 
//             />
//             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           </div>
//           <button onClick={handleOpenAddForm} className="flex items-center justify-center gap-2 bg-nav-dark text-white px-6 py-3 font-central text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors shrink-0">
//             <Plus className="w-4 h-4" /> Add
//           </button>
//         </div>
//       </div>

//       <div className="bg-white border border-nav-dark shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left font-ballinger text-sm">
//             <thead className="bg-[#f4f2ed] border-b border-nav-dark font-central text-[10px] uppercase tracking-widest text-gray-500">
//               <tr>
//                 <th className="p-4 font-bold">Customer</th>
//                 <th className="p-4 font-bold">Contact</th>
//                 <th className="p-4 font-bold text-center">Orders</th>
//                 <th className="p-4 font-bold text-right">Total Spent</th>
//                 <th className="p-4 font-bold text-center">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading ? (
//                 <tr>
//                   <td colSpan="5" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">Loading customers...</td>
//                 </tr>
//               ) : filteredCustomers.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">No customers found.</td>
//                 </tr>
//               ) : (
//                 filteredCustomers.map((customer, idx) => {
//                   const isBanned = !customer.status;
//                   return (
//                     <tr key={customer._id} onClick={() => handleViewCustomer(customer)} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group ${idx === filteredCustomers.length - 1 ? 'border-none' : ''}`}>
//                       <td className="p-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-gray-200 shrink-0 flex items-center justify-center font-central text-xs font-bold uppercase tracking-widest">
//                             {customer.firstName.charAt(0)}{customer.lastName?.charAt(0) || ''}
//                           </div>
//                           <span className="font-bold group-hover:text-blue-600 transition-colors">{customer.firstName} {customer.lastName}</span>
//                         </div>
//                       </td>
//                       <td className="p-4 text-gray-600">{customer.email}</td>
//                       <td className="p-4 text-center font-bold">{customer.orderCount}</td>
//                       <td className="p-4 text-right font-bold">PKR {customer.totalSpent?.toLocaleString()}</td>
//                       <td className="p-4 text-center">
//                         <span className={`px-2 py-1 text-[9px] font-central font-bold uppercase tracking-widest border ${isBanned ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
//                           {isBanned ? 'Banned' : 'Active'}
//                         </span>
//                       </td>
//                     </tr>
//                   )
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Search, Users, Mail, Phone, Ban, CheckCircle, ArrowLeft, ShoppingBag, Plus, Edit2, Save, MapPin } from 'lucide-react';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // View States
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);

  // Form States (Add/Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Notice: addresses is now an array of objects to handle multiple saved addresses perfectly
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', 
    addresses: [
      { label: 'Home', firstName: '', lastName: '', address: '', city: '', postalCode: '', country: 'Pakistan' }
    ]
  });

  // Load and enrich customer data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to fetch customers');

      const allOrders = JSON.parse(localStorage.getItem('outrey_orders')) || [];
      
      const enrichedUsers = result.data.map(user => {
        const userOrders = allOrders.filter(o => o.customerId === user._id);
        const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
        
        return {
          ...user,
          orderCount: userOrders.length,
          totalSpent: totalSpent
        };
      });

      enrichedUsers.sort((a, b) => b.totalSpent - a.totalSpent);
      setCustomers(enrichedUsers);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // API: TOGGLE STATUS (BAN/RESTORE)
  // ==========================================
  const handleToggleStatus = async (userId, currentStatusBoolean) => {
    const newStatusBoolean = !currentStatusBoolean; 
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/customer/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatusBoolean })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update status');

      setCustomers(prev => prev.map(c => c._id === userId ? { ...c, status: newStatusBoolean } : c));
      
      if (selectedCustomer && selectedCustomer._id === userId) {
        setSelectedCustomer(prev => ({ ...prev, status: newStatusBoolean }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Check console.");
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    const allOrders = JSON.parse(localStorage.getItem('outrey_orders')) || [];
    const userOrders = allOrders.filter(o => o.customerId === customer._id);
    setCustomerOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  // ==========================================
  // FORM HANDLERS (ADD / EDIT)
  // ==========================================
  const handleOpenAddForm = () => {
    setFormData({ 
      firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', 
      addresses: [{ label: 'Home', firstName: '', lastName: '', address: '', city: '', postalCode: '', country: 'Pakistan' }]
    });
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = () => {
    // Map ALL user addresses, or provide one empty one if they have none
    const userAddresses = selectedCustomer.addresses && selectedCustomer.addresses.length > 0
      ? selectedCustomer.addresses.map(addr => ({
          _id: addr._id, 
          label: addr.label || 'Home',
          firstName: addr.firstName || '',
          lastName: addr.lastName || '',
          address: addr.address || '',
          city: addr.city || '',
          postalCode: addr.postalCode || '',
          country: addr.country || 'Pakistan'
        }))
      : [{ label: 'Home', firstName: '', lastName: '', address: '', city: '', postalCode: '', country: 'Pakistan' }];
    
    setFormData({
      firstName: selectedCustomer.firstName || '',
      lastName: selectedCustomer.lastName || '',
      email: selectedCustomer.email || '',
      phone: selectedCustomer.phone || '',
      password: '', confirmPassword: '',
      addresses: userAddresses
    });
    
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // New specific handler for updating array items safely
  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  // ==========================================
  // API: SAVE/UPDATE CUSTOMER
  // ==========================================
  // const handleSaveCustomer = async (e) => {
  //   e.preventDefault();
    
  //   if (!isEditing && formData.password !== formData.confirmPassword) {
  //     alert("Passwords do not match!");
  //     return;
  //   }

  //   setIsSaving(true);

  //   try {
  //     const token = localStorage.getItem('admin_token');

  //     // Always grab the first address for the Postman-style fix
  //     const firstAddress = formData.addresses[0] || {};

  //     if (isEditing) {
  //       // --- PUT: EDIT EXISTING CUSTOMER (QUICK FIX) ---
  //       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/customer/${selectedCustomer._id}`, {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`
  //         },
  //         body: JSON.stringify({
  //           firstName: formData.firstName,
  //           lastName: formData.lastName,
  //           email: formData.email,
  //           phone: formData.phone,
            
  //           // QUICK FIX: Send flat variables, just like Postman did
  //           address: firstAddress.address,
  //           city: firstAddress.city,
  //           country: firstAddress.country,
  //           postalCode: firstAddress.postalCode
  //         })
  //       });

  //       const result = await response.json();
  //       if (!response.ok) throw new Error(result.message || 'Failed to update customer');

  //       setSelectedCustomer({ ...selectedCustomer, ...result.data });

  //     } else {
  //       // --- POST: ADD NEW CUSTOMER ---
  //       const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/customer', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`
  //         },
  //         body: JSON.stringify({
  //           firstName: formData.firstName,
  //           lastName: formData.lastName,
  //           email: formData.email,
  //           password: formData.password,
  //           phone: formData.phone,
            
  //           // Send flat variables
  //           address: firstAddress.address, 
  //           city: firstAddress.city,
  //           postalCode: firstAddress.postalCode, 
  //           country: firstAddress.country
  //         })
  //       });

  //       const result = await response.json();
  //       if (!response.ok || result.status === "Fail") {
  //         throw new Error(result.message || 'Failed to create customer');
  //       }
  //     }

  //     loadData();
  //     setIsFormOpen(false);

  //   } catch (error) {
  //     console.error("Error saving customer:", error);
  //     alert(error.message);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  // ==========================================
  // API: SAVE/UPDATE CUSTOMER
  // ==========================================
  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    
    // Password validation on creation
    if (!isEditing && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem('admin_token');

      if (isEditing) {
        // --- PUT: EDIT EXISTING CUSTOMER ---
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/customer/${selectedCustomer._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            
            // THE FIX: We send the entire array to the backend! 
            // This triggers Scenario A in your new backend code perfectly.
            addresses: formData.addresses 
          })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to update customer');

        // Update UI
        setSelectedCustomer({ ...selectedCustomer, ...result.data });

      } else {
        // --- POST: ADD NEW CUSTOMER ---
        const firstAddress = formData.addresses[0] || {};
        
        const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            
            // Note: Your backend POST route still expects flat variables, so we keep these here
            address: firstAddress.address, 
            city: firstAddress.city,
            postalCode: firstAddress.postalCode, 
            country: firstAddress.country
          })
        });

        const result = await response.json();
        if (!response.ok || result.status === "Fail") {
          throw new Error(result.message || 'Failed to create customer');
        }
      }

      // Reload data to sync with DB
      loadData();
      setIsFormOpen(false);

    } catch (error) {
      console.error("Error saving customer:", error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };
  const filteredCustomers = customers.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==========================================
  // FORM VIEW (ADD/EDIT)
  // ==========================================
  if (isFormOpen) {
    return (
      <div className="max-w-[800px] mx-auto animate-in fade-in duration-300 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsFormOpen(false)} className="p-2 border border-nav-dark hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-central text-2xl font-bold uppercase tracking-widest">
              {isEditing ? 'Edit Customer' : 'Add New Customer'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSaveCustomer} className="bg-white border border-nav-dark shadow-sm p-8 flex flex-col gap-8">
          {/* PERSONAL INFO */}
          <div>
            <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Personal Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
              </div>
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
              </div>
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleFormChange} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
              </div>
            </div>
          </div>

          {/* PASSWORD (ONLY ON ADD) */}
          {!isEditing && (
            <div>
              <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
                </div>
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleFormChange} required disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
                </div>
              </div>
            </div>
          )}

          {/* MULTIPLE ADDRESSES ITERATION */}
          <div>
            <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">
              Saved Addresses ({formData.addresses.length})
            </h3>
            
            <div className="flex flex-col gap-8">
              {formData.addresses.map((addressObj, index) => (
                <div key={index} className="relative bg-gray-50 p-6 border border-gray-200">
                  <span className="absolute top-0 right-0 bg-nav-dark text-white font-central text-[10px] font-bold uppercase px-3 py-1">
                    Address {index + 1}
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5 mt-2">
                    <div>
                      <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Label</label>
                      <input type="text" name="label" value={addressObj.label} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" placeholder="e.g. Home, Office" />
                    </div>
                    <div>
                      <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">First Name</label>
                      <input type="text" name="firstName" value={addressObj.firstName} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
                    </div>
                    <div>
                      <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Last Name</label>
                      <input type="text" name="lastName" value={addressObj.lastName} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Street Address / House No.</label>
                      <input type="text" name="address" value={addressObj.address} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" placeholder="House 15, Street 2..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">City</label>
                        <input type="text" name="city" value={addressObj.city} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" placeholder="Lahore" />
                      </div>
                      <div>
                        <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Country</label>
                        <input type="text" name="country" value={addressObj.country} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" placeholder="Pakistan" />
                      </div>
                      <div>
                        <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Postal Code</label>
                        <input type="text" name="postalCode" value={addressObj.postalCode} onChange={(e) => handleAddressChange(index, e)} disabled={isSaving} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm disabled:opacity-50" placeholder="54000" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-4 border-t border-gray-200 flex justify-end gap-4">
            <button type="button" onClick={() => setIsFormOpen(false)} disabled={isSaving} className="px-6 py-3 font-central text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-nav-dark transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className={`flex items-center gap-2 text-white px-8 py-3 font-central text-xs font-bold uppercase tracking-widest transition-colors ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-nav-dark hover:bg-black'}`}>
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // DETAIL VIEW
  // ==========================================
  if (selectedCustomer) {
    const isBanned = !selectedCustomer.status;

    return (
      <div className="max-w-[1000px] mx-auto animate-in fade-in duration-300 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedCustomer(null)} className="p-2 border border-nav-dark hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Customer Profile</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleOpenEditForm} className="flex items-center gap-2 px-6 py-3 font-central text-xs font-bold uppercase tracking-widest border border-nav-dark text-nav-dark hover:bg-gray-50 transition-colors outline-none">
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
            <button 
              onClick={() => handleToggleStatus(selectedCustomer._id, selectedCustomer.status)} 
              className={`flex items-center gap-2 px-6 py-3 font-central text-xs font-bold uppercase tracking-widest border transition-colors outline-none ${isBanned ? 'bg-white border-nav-dark text-nav-dark hover:bg-gray-50' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'}`}
            >
              {isBanned ? <><CheckCircle className="w-4 h-4" /> Restore</> : <><Ban className="w-4 h-4" /> Ban</>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-nav-dark shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#f4f2ed] border border-nav-dark flex items-center justify-center font-central text-3xl font-bold uppercase tracking-widest mb-4">
                {selectedCustomer.firstName.charAt(0)}{selectedCustomer.lastName?.charAt(0) || ''}
              </div>
              <h3 className="font-central text-lg font-bold uppercase tracking-widest">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
              <span className={`mt-2 px-3 py-1 text-[10px] font-central font-bold uppercase tracking-widest border ${isBanned ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                {isBanned ? 'Banned' : 'Active'}
              </span>
            </div>

            <div className="bg-white border border-nav-dark shadow-sm p-6 flex flex-col gap-5">
              <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">Contact Info</h3>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <a href={`mailto:${selectedCustomer.email}`} className="font-ballinger text-sm text-blue-600 hover:underline truncate">{selectedCustomer.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="font-ballinger text-sm text-gray-700">{selectedCustomer.phone || 'No phone'}</span>
              </div>
              
              <div className="border-t border-gray-100 pt-3 mt-2">
                <h4 className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3">Saved Addresses ({selectedCustomer.addresses?.length || 0})</h4>
                {selectedCustomer.addresses?.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {selectedCustomer.addresses.map((addr, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <span className="font-ballinger text-sm text-gray-700 leading-relaxed">
                          <strong>{addr.label}</strong><br/>
                          {addr.address}<br/>
                          {addr.city}, {addr.postalCode}<br/>
                          {addr.country}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="font-ballinger text-sm text-gray-500">No addresses saved.</span>
                )}
              </div>
            </div>

            <div className="bg-white border border-nav-dark shadow-sm p-6 flex flex-col gap-5">
              <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">Metrics</h3>
              <div className="flex justify-between items-center">
                <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500">Lifetime Value</span>
                <span className="font-ballinger text-sm font-bold">PKR {selectedCustomer.totalSpent?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500">Total Orders</span>
                <span className="font-ballinger text-sm font-bold">{selectedCustomer.orderCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-nav-dark shadow-sm">
              <div className="p-6 border-b border-nav-dark bg-[#f4f2ed] flex items-center justify-between">
                <h3 className="font-central text-sm font-bold uppercase tracking-widest">Order History</h3>
                <span className="font-ballinger text-xs text-gray-500">{customerOrders.length} Orders</span>
              </div>
              <div className="flex flex-col">
                {customerOrders.length === 0 ? (
                  <div className="p-10 text-center flex flex-col items-center">
                    <ShoppingBag className="w-10 h-10 text-gray-300 mb-3" />
                    <p className="font-central text-xs uppercase tracking-widest text-gray-500">No orders placed yet.</p>
                  </div>
                ) : (
                  customerOrders.map((order, idx) => (
                    <div key={order.orderId} className={`p-6 flex justify-between items-center border-b border-gray-100 ${idx === customerOrders.length - 1 ? 'border-none' : ''}`}>
                      <div className="flex flex-col gap-1">
                        <span className="font-central text-sm font-bold uppercase tracking-widest">{order.orderId}</span>
                        <span className="font-ballinger text-xs text-gray-500">
                          {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`px-2 py-1 text-[10px] font-central font-bold uppercase tracking-widest border ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' : order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                          {order.status || 'Processing'}
                        </span>
                        <span className="font-ballinger text-sm font-bold min-w-[80px] text-right">PKR {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // LIST VIEW
  // ==========================================
  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Customers</h2>
          <span className="bg-nav-dark text-white font-ballinger text-xs px-3 py-1 rounded-full">{customers.length} Total</span>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-[300px]">
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full p-3 pl-10 border border-nav-dark outline-none focus:bg-white font-ballinger text-sm transition-colors" 
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button onClick={handleOpenAddForm} className="flex items-center justify-center gap-2 bg-nav-dark text-white px-6 py-3 font-central text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="bg-white border border-nav-dark shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-ballinger text-sm">
            <thead className="bg-[#f4f2ed] border-b border-nav-dark font-central text-[10px] uppercase tracking-widest text-gray-500">
              <tr>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Contact</th>
                <th className="p-4 font-bold text-center">Orders</th>
                <th className="p-4 font-bold text-right">Total Spent</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">Loading customers...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">No customers found.</td>
                </tr>
              ) : (
                filteredCustomers.map((customer, idx) => {
                  const isBanned = !customer.status;
                  return (
                    <tr key={customer._id} onClick={() => handleViewCustomer(customer)} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group ${idx === filteredCustomers.length - 1 ? 'border-none' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 shrink-0 flex items-center justify-center font-central text-xs font-bold uppercase tracking-widest">
                            {customer.firstName.charAt(0)}{customer.lastName?.charAt(0) || ''}
                          </div>
                          <span className="font-bold group-hover:text-blue-600 transition-colors">{customer.firstName} {customer.lastName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{customer.email}</td>
                      <td className="p-4 text-center font-bold">{customer.orderCount}</td>
                      <td className="p-4 text-right font-bold">PKR {customer.totalSpent?.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 text-[9px] font-central font-bold uppercase tracking-widest border ${isBanned ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                          {isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}






