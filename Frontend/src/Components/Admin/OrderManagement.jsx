// import React, { useState, useEffect } from 'react';
// import { Search, MapPin, Package, ArrowLeft, Truck, CheckCircle, Clock } from 'lucide-react';

// export default function OrderManagement() {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Load orders from LocalStorage
//   useEffect(() => {
//     const allOrders = JSON.parse(localStorage.getItem('outrey_orders')) || [];
//     // Sort so newest orders are at the top
//     const sortedOrders = allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
//     setOrders(sortedOrders);
//   }, []);

//   // Filter orders based on search (ID or Customer Name)
//   const filteredOrders = orders.filter(order => 
//     order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Handle Status Update
//   const handleStatusChange = (orderId, newStatus) => {
//     // 1. Update in Local Storage
//     const allOrders = JSON.parse(localStorage.getItem('outrey_orders')) || [];
//     const orderIndex = allOrders.findIndex(o => o.orderId === orderId);
    
//     if (orderIndex > -1) {
//       allOrders[orderIndex].status = newStatus;
//       localStorage.setItem('outrey_orders', JSON.stringify(allOrders));
//     }

//     // 2. Update Local State
//     const updatedOrders = orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o);
//     setOrders(updatedOrders);
    
//     // 3. Update Selected Order view
//     if (selectedOrder && selectedOrder.orderId === orderId) {
//       setSelectedOrder({ ...selectedOrder, status: newStatus });
//     }
//   };

//   // --- DETAIL VIEW RENDERING ---
//   if (selectedOrder) {
//     return (
//       <div className="max-w-[1000px] mx-auto animate-in fade-in duration-300 pb-20">
        
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setSelectedOrder(null)} className="p-2 border border-nav-dark hover:bg-gray-100 transition-colors">
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//             <h2 className="font-central text-2xl font-bold uppercase tracking-widest">
//               Order {selectedOrder.orderId}
//             </h2>
//           </div>
//           <div className="flex items-center gap-4">
//             <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500">Update Status:</span>
//             <select 
//               value={selectedOrder.status || 'Processing'} 
//               onChange={(e) => handleStatusChange(selectedOrder.orderId, e.target.value)}
//               className="p-3 border border-nav-dark outline-none font-central text-xs font-bold uppercase tracking-widest bg-white cursor-pointer"
//             >
//               <option value="Processing">Processing</option>
//               <option value="Shipped">Shipped</option>
//               <option value="Delivered">Delivered</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* Left Col: Items */}
//           <div className="lg:col-span-2 flex flex-col gap-8">
//             <div className="bg-white border border-nav-dark shadow-sm">
//               <div className="p-4 border-b border-nav-dark bg-[#f4f2ed]">
//                 <h3 className="font-central text-sm font-bold uppercase tracking-widest">Items Ordered</h3>
//               </div>
//               <div className="p-6 flex flex-col gap-6">
//                 {selectedOrder.items.map((item, idx) => (
//                   <div key={idx} className="flex gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
//                     <div className="w-24 aspect-[4/5] bg-gray-100 border border-gray-200 shrink-0">
//                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
//                     </div>
//                     <div className="flex-1 flex flex-col justify-start">
//                       <div className="flex justify-between items-start">
//                         <span className="font-central text-sm uppercase tracking-wider font-bold">{item.name}</span>
//                         <span className="font-ballinger text-sm font-bold">PKR {(item.price * item.quantity).toLocaleString()}</span>
//                       </div>
//                       <span className="font-ballinger text-xs text-gray-500 mt-2 uppercase tracking-widest">{item.colorName} / {item.size}</span>
//                       <span className="font-ballinger text-xs text-gray-500 mt-1 uppercase tracking-widest">Qty: {item.quantity}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
//                 <span className="font-central text-sm uppercase tracking-widest font-bold">Total Paid</span>
//                 <span className="font-central text-xl font-bold">PKR {selectedOrder.total.toLocaleString()}</span>
//               </div>
//             </div>
//           </div>

//           {/* Right Col: Customer & Shipping */}
//           <div className="flex flex-col gap-8">
            
//             <div className="bg-white border border-nav-dark shadow-sm p-6">
//               <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Customer Details</h3>
//               <div className="flex flex-col gap-4">
//                 <div>
//                   <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-1">Name</span>
//                   <span className="font-ballinger text-sm font-bold">{selectedOrder.customer.name}</span>
//                 </div>
//                 <div>
//                   <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-1">Email</span>
//                   <a href={`mailto:${selectedOrder.customer.email}`} className="font-ballinger text-sm text-blue-600 hover:underline">{selectedOrder.customer.email}</a>
//                 </div>
//                 <div>
//                   <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-1">Payment Method</span>
//                   <span className="font-ballinger text-sm uppercase tracking-widest">{selectedOrder.paymentMethod}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white border border-nav-dark shadow-sm p-6">
//               <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Shipping Address</h3>
//               <div className="flex items-start gap-3">
//                 <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
//                 <p className="font-ballinger text-sm leading-relaxed">
//                   {selectedOrder.customer.shippingAddress}
//                 </p>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- LIST VIEW RENDERING ---
//   return (
//     <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
      
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//         <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Orders</h2>
        
//         <div className="relative w-full md:w-[300px]">
//           <input 
//             type="text" 
//             placeholder="Search Order ID or Name..." 
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full p-3 pl-10 border border-nav-dark outline-none focus:bg-white font-ballinger text-sm transition-colors"
//           />
//           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//         </div>
//       </div>

//       <div className="bg-white border border-nav-dark shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left font-ballinger text-sm">
//             <thead className="bg-[#f4f2ed] border-b border-nav-dark font-central text-[10px] uppercase tracking-widest text-gray-500">
//               <tr>
//                 <th className="p-4 font-bold">Order ID</th>
//                 <th className="p-4 font-bold">Date</th>
//                 <th className="p-4 font-bold">Customer</th>
//                 <th className="p-4 font-bold">Status</th>
//                 <th className="p-4 font-bold text-right">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">
//                     No orders found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredOrders.map((order, idx) => {
//                   const status = order.status || 'Processing'; // Default status if none exists
//                   return (
//                     <tr 
//                       key={order.orderId} 
//                       onClick={() => setSelectedOrder(order)}
//                       className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group"
//                     >
//                       <td className="p-4 font-bold font-central tracking-wider group-hover:text-blue-600 transition-colors">
//                         {order.orderId}
//                       </td>
//                       <td className="p-4 text-gray-500">
//                         {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
//                       </td>
//                       <td className="p-4">{order.customer.name}</td>
//                       <td className="p-4">
//                         <div className="flex items-center gap-2">
//                           {status === 'Processing' && <Clock className="w-3 h-3 text-yellow-600" />}
//                           {status === 'Shipped' && <Truck className="w-3 h-3 text-blue-600" />}
//                           {status === 'Delivered' && <CheckCircle className="w-3 h-3 text-green-600" />}
                          
//                           <span className={`px-2 py-1 text-[10px] font-central font-bold uppercase tracking-widest border
//                             ${status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' : 
//                               status === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
//                               status === 'Processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
//                               'bg-gray-100 text-gray-700 border-gray-200'}
//                           `}>
//                             {status}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="p-4 font-bold text-right">PKR {order.total.toLocaleString()}</td>
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
// import { Search, MapPin, Package, ArrowLeft, Truck, CheckCircle, Clock } from 'lucide-react';

// export default function OrderManagement() {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   // --- API: Load Orders ---
//   const loadOrders = async () => {
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem('admin_token');
//       const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/orders', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const result = await response.json();

//       if (result.status === 'Success') {
//         // Map the backend data exactly to how the frontend prototype expects it
//         const mappedOrders = result.data.map(order => ({
//           _id: order.orderId, // Keep the real MongoDB ID for API calls
//           orderId: order.orderId.substring(order.orderId.length - 6).toUpperCase(), // Short visual ID
//           date: order.date,
//           status: order.status,
//           total: order.totalAmount,
//           paymentMethod: order.paymentMethod,
//           itemsCount: order.itemsCount,
//           customer: {
//             name: order.customerName,
//             email: order.customerEmail,
//             shippingAddress: "View full details to see address" // Placeholder for list view
//           },
//           // Note: The /api/orders list endpoint might not return full item details.
//           // In a production app, you'd fetch /api/orders/:id when clicking an order.
//           // We will map empty items here so the Detail View doesn't crash if they are missing.
//           items: order.items || [] 
//         }));
        
//         setOrders(mappedOrders);
//       }
//     } catch (error) {
//       console.error("Failed to load orders:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   // --- Filter orders based on search (ID or Customer Name) ---
//   const filteredOrders = orders.filter(order => 
//     order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // --- API: Handle Status Update ---
//   const handleStatusChange = async (dbOrderId, newStatus) => {
//     try {
//       const token = localStorage.getItem('admin_token');
//       const response = await fetch(`https://app-backend-msic.onrender.com/api/orders/${dbOrderId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ status: newStatus.toLowerCase() }) // Ensure lowercase for backend
//       });

//       const result = await response.json();

//       if (result.status === 'Success') {
//         // Update local state instantly so UI feels snappy
//         const updatedOrders = orders.map(o => o._id === dbOrderId ? { ...o, status: newStatus } : o);
//         setOrders(updatedOrders);
        
//         if (selectedOrder && selectedOrder._id === dbOrderId) {
//           setSelectedOrder({ ...selectedOrder, status: newStatus });
//         }
//       } else {
//         alert("Failed to update status.");
//       }
//     } catch (error) {
//       console.error("Status update error:", error);
//       alert("Error updating order status.");
//     }
//   };

//   // --- DETAIL VIEW RENDERING ---
//   if (selectedOrder) {
//     // Standardize status capitalization for the dropdown UI
//     const currentStatusUI = selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1);

//     return (
//       <div className="max-w-[1000px] mx-auto animate-in fade-in duration-300 pb-20">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setSelectedOrder(null)} className="p-2 border border-nav-dark hover:bg-gray-100 transition-colors">
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//             <h2 className="font-central text-2xl font-bold uppercase tracking-widest">
//               Order #{selectedOrder.orderId}
//             </h2>
//           </div>
//           <div className="flex items-center gap-4">
//             <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500">Update Status:</span>
//             <select 
//               value={currentStatusUI} 
//               onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)} 
//               className="p-3 border border-nav-dark outline-none font-central text-xs font-bold uppercase tracking-widest bg-white cursor-pointer"
//             >
//               <option value="Processing">Processing</option>
//               <option value="Shipped">Shipped</option>
//               <option value="Delivered">Delivered</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Col: Items */}
//           <div className="lg:col-span-2 flex flex-col gap-8">
//             <div className="bg-white border border-nav-dark shadow-sm">
//               <div className="p-4 border-b border-nav-dark bg-[#f4f2ed]">
//                 <h3 className="font-central text-sm font-bold uppercase tracking-widest">Items Ordered</h3>
//               </div>
//               <div className="p-6 flex flex-col gap-6">
//                 {selectedOrder.items && selectedOrder.items.length > 0 ? (
//                   selectedOrder.items.map((item, idx) => (
//                     <div key={idx} className="flex gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
//                       <div className="w-24 aspect-[4/5] bg-gray-100 border border-gray-200 shrink-0">
//                         {/* Fallback if item image is missing from the list endpoint */}
//                         {item.image ? (
//                           <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
//                         ) : (
//                           <Package className="w-8 h-8 m-auto text-gray-300" />
//                         )}
//                       </div>
//                       <div className="flex-1 flex flex-col justify-start">
//                         <div className="flex justify-between items-start">
//                           <span className="font-central text-sm uppercase tracking-wider font-bold">{item.name || "Product Item"}</span>
//                           <span className="font-ballinger text-sm font-bold">PKR {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
//                         </div>
//                         <span className="font-ballinger text-xs text-gray-500 mt-2 uppercase tracking-widest">{item.colorName || 'Default'} / {item.size || 'N/A'}</span>
//                         <span className="font-ballinger text-xs text-gray-500 mt-1 uppercase tracking-widest">Qty: {item.quantity || 1}</span>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-gray-500 font-ballinger text-sm text-center">
//                     Detailed item data is not available from the overview endpoint. <br/> (You may need a GET /api/orders/:id endpoint for full details).
//                   </div>
//                 )}
//               </div>
//               <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
//                 <span className="font-central text-sm uppercase tracking-widest font-bold">Total Paid</span>
//                 <span className="font-central text-xl font-bold">PKR {selectedOrder.total.toLocaleString()}</span>
//               </div>
//             </div>
//           </div>

//           {/* Right Col: Customer & Shipping */}
//           <div className="flex flex-col gap-8">
//             <div className="bg-white border border-nav-dark shadow-sm p-6">
//               <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Customer Details</h3>
//               <div className="flex flex-col gap-4">
//                 <div>
//                   <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-1">Name</span>
//                   <span className="font-ballinger text-sm font-bold">{selectedOrder.customer.name}</span>
//                 </div>
//                 <div>
//                   <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-1">Email</span>
//                   <a href={`mailto:${selectedOrder.customer.email}`} className="font-ballinger text-sm text-blue-600 hover:underline">{selectedOrder.customer.email}</a>
//                 </div>
//                 <div>
//                   <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-1">Payment Method</span>
//                   <span className="font-ballinger text-sm uppercase tracking-widest">{selectedOrder.paymentMethod.replace('_', ' ')}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white border border-nav-dark shadow-sm p-6">
//               <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Shipping Address</h3>
//               <div className="flex items-start gap-3">
//                 <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
//                 <p className="font-ballinger text-sm leading-relaxed">
//                   {selectedOrder.customer.shippingAddress || "Address details not provided in overview endpoint."}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- LIST VIEW RENDERING ---
//   return (
//     <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//         <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Orders</h2>
//         <div className="relative w-full md:w-[300px]">
//           <input 
//             type="text" 
//             placeholder="Search Order ID or Name..." 
//             value={searchTerm} 
//             onChange={(e) => setSearchTerm(e.target.value)} 
//             className="w-full p-3 pl-10 border border-nav-dark outline-none focus:bg-white font-ballinger text-sm transition-colors" 
//           />
//           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//         </div>
//       </div>

//       <div className="bg-white border border-nav-dark shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left font-ballinger text-sm">
//             <thead className="bg-[#f4f2ed] border-b border-nav-dark font-central text-[10px] uppercase tracking-widest text-gray-500">
//               <tr>
//                 <th className="p-4 font-bold">Order ID</th>
//                 <th className="p-4 font-bold">Date</th>
//                 <th className="p-4 font-bold">Customer</th>
//                 <th className="p-4 font-bold">Status</th>
//                 <th className="p-4 font-bold text-right">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading ? (
//                 <tr>
//                   <td colSpan="5" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">
//                     Loading Orders...
//                   </td>
//                 </tr>
//               ) : filteredOrders.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">
//                     No orders found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredOrders.map((order) => {
//                   // Ensure status handles standard casing
//                   const statusRaw = order.status || 'processing';
//                   const statusUI = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);
                  
//                   return (
//                     <tr 
//                       key={order._id} 
//                       onClick={() => setSelectedOrder(order)} 
//                       className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group"
//                     >
//                       <td className="p-4 font-bold font-central tracking-wider group-hover:text-blue-600 transition-colors">
//                         #{order.orderId}
//                       </td>
//                       <td className="p-4 text-gray-500">
//                         {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
//                       </td>
//                       <td className="p-4">{order.customer.name}</td>
//                       <td className="p-4">
//                         <div className="flex items-center gap-2">
//                           {statusUI === 'Processing' && <Clock className="w-3 h-3 text-yellow-600" />}
//                           {statusUI === 'Shipped' && <Truck className="w-3 h-3 text-blue-600" />}
//                           {statusUI === 'Delivered' && <CheckCircle className="w-3 h-3 text-green-600" />}
//                           <span className={`px-2 py-1 text-[10px] font-central font-bold uppercase tracking-widest border 
//                             ${statusUI === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' : 
//                               statusUI === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
//                               statusUI === 'Processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
//                               'bg-gray-100 text-gray-700 border-gray-200'} `}
//                           >
//                             {statusUI}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="p-4 font-bold text-right">PKR {order.total.toLocaleString()}</td>
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
import { Search, MapPin, Package, ArrowLeft, Truck, CheckCircle, Clock } from 'lucide-react';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // --- API: Load All Orders (Overview) ---
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.status === 'Success') {
        const mappedOrders = result.data.map(order => ({
          _id: order.orderId,
          orderId: order.orderId.substring(order.orderId.length - 6).toUpperCase(), // Short visual ID
          date: order.date,
          status: order.status,
          total: order.totalAmount,
          paymentMethod: order.paymentMethod,
          itemsCount: order.itemsCount,
          customer: {
            name: order.customerName,
            email: order.customerEmail
          }
        }));
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // --- API: Fetch Single Order Details (Triggered on click) ---
  const fetchOrderDetails = async (dbOrderId) => {
    setIsLoadingDetails(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`https://app-backend-msic.onrender.com/api/orders/${dbOrderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.status === 'Success') {
        const d = result.data;
        
        // Format the shipping address object into a readable string
        let addressString = "Address not provided";
        if (d.shippingAddress) {
          addressString = `${d.shippingAddress.address}, ${d.shippingAddress.city}, ${d.shippingAddress.postalCode}, ${d.shippingAddress.country}`;
        }

        setSelectedOrder({
          _id: d.orderId,
          orderId: d.orderId.substring(d.orderId.length - 6).toUpperCase(),
          date: d.date,
          status: d.status,
          total: d.totalAmount,
          paymentMethod: d.paymentMethod,
          itemsCount: d.items.length,
          customer: {
            name: d.customer.name,
            email: d.customer.email,
            shippingAddress: addressString
          },
          items: d.items.map(item => ({
            productId: item.productId,
            name: item.productName,
            colorName: item.colorName,
            hexCode: item.hexCode,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            image: item.image ? `https://app-backend-msic.onrender.com/${item.image.replace(/\\/g, '/')}` : null
          }))
        });
      }
    } catch (error) {
      console.error("Failed to load order details:", error);
      alert("Could not fetch full order details.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- API: Handle Status Update ---
  const handleStatusChange = async (dbOrderId, newStatus) => {
    // The backend expects lowercase statuses (processing, shipped, delivered, cancelled)
    const backendStatus = newStatus.toLowerCase();
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`https://app-backend-msic.onrender.com/api/orders/${dbOrderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: backendStatus })
      });

      const result = await response.json();

      if (result.status === 'Success') {
        // Update local list state
        const updatedOrders = orders.map(o => o._id === dbOrderId ? { ...o, status: backendStatus } : o);
        setOrders(updatedOrders);
        
        // Update detail view state if open
        if (selectedOrder && selectedOrder._id === dbOrderId) {
          setSelectedOrder({ ...selectedOrder, status: backendStatus });
        }
      } else {
        alert(result.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Error updating order status.");
    }
  };

  // --- DETAIL VIEW RENDERING ---
  if (selectedOrder || isLoadingDetails) {
    if (isLoadingDetails) {
      return <div className="py-32 text-center text-xl font-central tracking-widest mt-20">LOADING ORDER DETAILS...</div>;
    }

    const currentStatusUI = selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1);

    return (
      <div className="max-w-[1000px] mx-auto animate-in fade-in duration-300 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedOrder(null)} className="p-2 border border-nav-dark hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-central text-2xl font-bold uppercase tracking-widest">
              Order #{selectedOrder.orderId}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500">Update Status:</span>
            <select 
              value={currentStatusUI} 
              onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)} 
              className="p-3 border border-nav-dark outline-none font-central text-xs font-bold uppercase tracking-widest bg-white cursor-pointer"
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-white border border-nav-dark shadow-sm">
              <div className="p-4 border-b border-nav-dark bg-[#f4f2ed] flex justify-between items-center">
                <h3 className="font-central text-sm font-bold uppercase tracking-widest">Items Ordered ({selectedOrder.itemsCount})</h3>
              </div>
              <div className="p-6 flex flex-col gap-6">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      
                      <div className="w-24 aspect-[4/5] bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-start">
                        <div className="flex justify-between items-start">
                          <span className="font-central text-sm uppercase tracking-wider font-bold text-nav-dark">{item.name}</span>
                          <span className="font-ballinger text-sm font-bold text-nav-dark">PKR {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 gap-y-1 gap-x-4">
                          <span className="font-ballinger text-xs text-gray-500 uppercase tracking-widest flex items-center gap-1">
                            <strong className="text-gray-700">Color:</strong> 
                            <span className="w-3 h-3 rounded-full border border-gray-300 inline-block" style={{backgroundColor: item.hexCode}}></span>
                            {item.colorName}
                          </span>
                          <span className="font-ballinger text-xs text-gray-500 uppercase tracking-widest">
                            <strong className="text-gray-700">Size:</strong> {item.size}
                          </span>
                          <span className="font-ballinger text-xs text-gray-500 uppercase tracking-widest">
                            <strong className="text-gray-700">Qty:</strong> {item.quantity}
                          </span>
                          <span className="font-ballinger text-xs text-gray-500 uppercase tracking-widest">
                            <strong className="text-gray-700">Price:</strong> PKR {item.price.toLocaleString()}
                          </span>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-1">
                          <span className="font-mono text-[10px] text-gray-400">Prod ID: {item.productId}</span>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 font-ballinger text-sm text-center py-6">
                    No items found for this order.
                  </div>
                )}
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <span className="font-central text-sm uppercase tracking-widest font-bold">Total Paid</span>
                <span className="font-central text-xl font-bold text-nav-dark">PKR {selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="bg-white border border-nav-dark shadow-sm p-6">
              <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Customer Details</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-1">Name</span>
                  <span className="font-ballinger text-sm font-bold text-nav-dark">{selectedOrder.customer.name}</span>
                </div>
                <div>
                  <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-1">Email</span>
                  <a href={`mailto:${selectedOrder.customer.email}`} className="font-ballinger text-sm text-blue-600 hover:underline">{selectedOrder.customer.email}</a>
                </div>
                <div>
                  <span className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-1">Payment Method</span>
                  <span className="font-ballinger text-sm uppercase tracking-widest text-nav-dark">
                    {selectedOrder.paymentMethod.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-nav-dark shadow-sm p-6">
              <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Shipping Address</h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <p className="font-ballinger text-sm leading-relaxed text-nav-dark">
                  {selectedOrder.customer.shippingAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW RENDERING ---
  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Orders</h2>
        <div className="relative w-full md:w-[300px]">
          <input 
            type="text" 
            placeholder="Search Order ID or Name..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full p-3 pl-10 border border-nav-dark outline-none focus:bg-white font-ballinger text-sm transition-colors" 
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white border border-nav-dark shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-ballinger text-sm">
            <thead className="bg-[#f4f2ed] border-b border-nav-dark font-central text-[10px] uppercase tracking-widest text-gray-500">
              <tr>
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Items</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">
                    Loading Orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusRaw = order.status || 'processing';
                  const statusUI = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);
                  
                  return (
                    <tr 
                      key={order._id} 
                      onClick={() => fetchOrderDetails(order._id)} 
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 font-bold font-central tracking-wider group-hover:text-blue-600 transition-colors">
                        #{order.orderId}
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4">{order.customer.name}</td>
                      <td className="p-4 text-gray-500">{order.itemsCount}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {statusUI === 'Processing' && <Clock className="w-3 h-3 text-yellow-600" />}
                          {statusUI === 'Shipped' && <Truck className="w-3 h-3 text-blue-600" />}
                          {statusUI === 'Delivered' && <CheckCircle className="w-3 h-3 text-green-600" />}
                          {statusUI === 'Cancelled' && <div className="w-3 h-3 rounded-full bg-red-500"></div>}
                          <span className={`px-2 py-1 text-[10px] font-central font-bold uppercase tracking-widest border 
                            ${statusUI === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' : 
                              statusUI === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                              statusUI === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' : 
                              statusUI === 'Processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                              'bg-gray-100 text-gray-700 border-gray-200'} `}
                          >
                            {statusUI}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-right text-nav-dark">PKR {order.total.toLocaleString()}</td>
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