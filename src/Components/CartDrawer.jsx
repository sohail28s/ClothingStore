// import React from 'react';
// import { useCart } from '../Context/CartContext';
// import { useNavigate } from 'react-router-dom';

// export default function CartDrawer() {
//     const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
// const navigate = useNavigate();
//     const freeShippingThreshold = 70;
//     const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
//     const progressPercentage = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

//     return (
//         <div className={`fixed inset-0 z-[200] ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>

//             {/* Dark Backdrop */}
//             <div
//                 className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
//                 onClick={closeCart}
//             />

//             {/* The Drawer Panel */}
//             <div className={`absolute top-0 right-0 h-full w-full sm:w-[450px] bg-[#f9f9f9] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>

//                 {/* HEADER */}
//                 <div className="flex items-center justify-between px-6 py-4 border-b border-nav-border bg-white shrink-0">
//                     <h2 className="font-central text-lg font-bold tracking-[0.1em] uppercase">Bag</h2>
//                     <div className="flex gap-4">
//                         {/* Tab icons based on screenshot */}
//                         <div className="flex border border-nav-border">
//                             <button className="p-2 bg-gray-200 border-r border-nav-border"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg></button>
//                             <button className="p-2 bg-white hover:bg-gray-50"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5L12 15.5l-5.5 2.5v-11a2 2 0 012-2h7a2 2 0 012 2v11z" /></svg></button>
//                         </div>
//                         <button onClick={closeCart} className="p-2 hover:opacity-60">
//                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
//                         </button>
//                     </div>
//                 </div>

//                 {/* FREE SHIPPING TRACKER */}
//                 <div className="bg-[#f4f7f2] p-4 border-b border-nav-border shrink-0 flex flex-col items-center gap-2">
//                     <p className="font-ballinger text-[11px] tracking-widest uppercase font-medium">
//                         {amountToFreeShipping > 0
//                             ? `Spend £${amountToFreeShipping.toFixed(2)} more for free delivery`
//                             : "You qualify for free delivery!"}
//                     </p>
//                     <div className="w-full max-w-[300px] h-[8px] border border-nav-dark bg-white rounded-none overflow-hidden relative">
//                         <div
//                             className="h-full bg-[#d0d6c1] transition-all duration-500"
//                             style={{ width: `${progressPercentage}%` }}
//                         />
//                     </div>
//                 </div>

//                 {/* CART ITEMS SCROLL AREA */}
//                 <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
//                     {cartItems.length === 0 ? (
//                         <div className="text-center py-10 font-central text-gray-500">Your bag is empty.</div>
//                     ) : (
//                         cartItems.map((item) => (
//                             <div key={item.variantId} className="flex gap-4 border-b border-nav-border pb-6 last:border-0">
//                                 {/* Product Image */}
//                                 <div className="w-[100px] aspect-[4/5] bg-gray-100 shrink-0 border border-nav-border">
//                                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
//                                 </div>

//                                 {/* Product Details */}
//                                 <div className="flex flex-col flex-1 justify-between py-1">
//                                     <div className="flex justify-between gap-4">
//                                         <div className="flex flex-col gap-1">
//                                             <a href={`/products/${item.slug}`} className="font-central text-[13px] font-bold uppercase tracking-wider leading-snug hover:text-gray-500">
//                                                 {item.name} - {item.colorName}
//                                             </a>
//                                             <p className="font-ballinger text-[11px] text-gray-600 uppercase tracking-widest mt-1">
//                                                 Size: {item.size} &nbsp;&nbsp; Style: Graphic
//                                             </p>
//                                         </div>
//                                         <span className="font-ballinger text-[13px] font-bold tracking-widest">
//                                             £{item.price.toFixed(2)}
//                                         </span>
//                                     </div>

//                                     {/* Quantity & Actions */}
//                                     <div className="flex justify-between items-end mt-4">
//                                         {/* Quantity Selector */}
//                                         <div className="flex items-center gap-4 text-sm font-central">
//                                             <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-1 hover:opacity-50">-</button>
//                                             <span className="w-4 text-center font-bold">{item.quantity}</span>
//                                             <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-1 hover:opacity-50">+</button>
//                                         </div>

//                                         {/* Action Icons */}
//                                         <div className="flex gap-3 text-nav-dark">
//                                             <button className="hover:opacity-50"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5L12 15.5l-5.5 2.5v-11a2 2 0 012-2h7a2 2 0 012 2v11z" /></svg></button>
//                                             <button onClick={() => removeFromCart(item.variantId)} className="hover:opacity-50"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>

//                 {/* FOOTER AREA */}
//                 <div className="border-t border-nav-border bg-white shrink-0">
//                     {/* Discount Code Accordion Placeholder */}
//                     <div className="px-6 py-4 border-b border-nav-border flex justify-between items-center cursor-pointer hover:bg-gray-50">
//                         <span className="font-central text-xs uppercase tracking-widest font-bold">Discount Code</span>
//                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
//                     </div>

//                     <div className="p-6 flex flex-col gap-4">
//                         <div className="flex justify-between items-center font-central text-lg font-bold uppercase tracking-wider">
//                             <span>Total</span>
//                             <span>£{cartTotal.toFixed(2)}</span>
//                         </div>

//                         <button
//                             disabled={cartItems.length === 0}
//                             onClick={() => {
//                                 closeCart(); // Close the drawer
//                                 navigate('/checkout'); // Send them to the checkout page
//                             }}
//                             className={`w-full h-[52px] flex items-center justify-center gap-2 font-central text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 border border-nav-dark
//       ${cartItems.length > 0 ? 'bg-[#b8a68b] text-white hover:opacity-90' : 'bg-gray-200 text-gray-500 cursor-not-allowed border-transparent'}`}
//                         >
//                             Checkout Securely
//                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
//                         </button>

//                         <div className="flex justify-center gap-1 mt-2 opacity-60 grayscale">
//                             <img src="https://cdn.shopify.com/s/assets/payment_icons/visa-319d545c6fd255c9aad5eeaad21fd6f7f7b4f5976090882d9213b2f8115668e1.svg" alt="Visa" className="h-6" />
//                             <img src="https://cdn.shopify.com/s/assets/payment_icons/master-173035bc8124581983d4efa50cf8626e8553c2b311353fbf67485f9c1a2b88d1.svg" alt="Mastercard" className="h-6" />
//                             <img src="https://cdn.shopify.com/s/assets/payment_icons/paypal-49e4c1e03244b6d2de0d270ac0d22b3f5cc73624f280012ced614b423c103984.svg" alt="PayPal" className="h-6" />
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// }

import React from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();
  
  // Updated threshold to match PKR values
  const freeShippingThreshold = 10000; 
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
  const progressPercentage = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  return (
    <div className={`fixed inset-0 z-[200] ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Dark Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={closeCart} 
      />
      
      {/* The Drawer Panel */}
      <div className={`absolute top-0 right-0 h-full w-full sm:w-[450px] bg-[#f9f9f9] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-nav-border bg-white shrink-0">
          <h2 className="font-central text-lg font-bold tracking-[0.1em] uppercase">Bag</h2>
          <div className="flex gap-4">
            <div className="flex border border-nav-border">
              <button className="p-2 bg-gray-200 border-r border-nav-border"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg></button>
              <button className="p-2 bg-white hover:bg-gray-50"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5L12 15.5l-5.5 2.5v-11a2 2 0 012-2h7a2 2 0 012 2v11z" /></svg></button>
            </div>
            <button onClick={closeCart} className="p-2 hover:opacity-60">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* FREE SHIPPING TRACKER */}
        <div className="bg-[#f4f7f2] p-4 border-b border-nav-border shrink-0 flex flex-col items-center gap-2">
          <p className="font-ballinger text-[11px] tracking-widest uppercase font-medium">
            {/* Updated Currency & Formatting */}
            {amountToFreeShipping > 0 ? `Spend PKR ${amountToFreeShipping.toLocaleString()} more for free delivery` : "You qualify for free delivery!"}
          </p>
          <div className="w-full max-w-[300px] h-[8px] border border-nav-dark bg-white rounded-none overflow-hidden relative">
            <div className="h-full bg-[#d0d6c1] transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>

        {/* CART ITEMS SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 font-central text-gray-500">Your bag is empty.</div>
          ) : (
            cartItems.map((item) => (
              <div key={item.variantId} className="flex gap-4 border-b border-nav-border pb-6 last:border-0">
                <div className="w-[100px] aspect-[4/5] bg-gray-100 shrink-0 border border-nav-border">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex flex-col flex-1 justify-between py-1">
                  <div className="flex justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <a href={`/products/${item.slug}`} className="font-central text-[13px] font-bold uppercase tracking-wider leading-snug hover:text-gray-500">
                        {item.name} - {item.colorName}
                      </a>
                      <p className="font-ballinger text-[11px] text-gray-600 uppercase tracking-widest mt-1">
                        Size: {item.size}
                      </p>
                    </div>
                    {/* Updated Currency & Formatting */}
                    <span className="font-ballinger text-[13px] font-bold tracking-widest">
                      PKR {item.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center gap-4 text-sm font-central">
                      <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-1 hover:opacity-50">-</button>
                      <span className="w-4 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-1 hover:opacity-50">+</button>
                    </div>
                    <div className="flex gap-3 text-nav-dark">
                      <button className="hover:opacity-50"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5L12 15.5l-5.5 2.5v-11a2 2 0 012-2h7a2 2 0 012 2v11z" /></svg></button>
                      <button onClick={() => removeFromCart(item.variantId)} className="hover:opacity-50"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER AREA */}
        <div className="border-t border-nav-border bg-white shrink-0">
          <div className="px-6 py-4 border-b border-nav-border flex justify-between items-center cursor-pointer hover:bg-gray-50">
            <span className="font-central text-xs uppercase tracking-widest font-bold">Discount Code</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </div>
          
          <div className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center font-central text-lg font-bold uppercase tracking-wider">
              <span>Total</span>
              {/* Updated Currency & Formatting */}
              <span>PKR {cartTotal.toLocaleString()}</span>
            </div>
            
            <button 
              disabled={cartItems.length === 0} 
              onClick={() => {
                closeCart();
                navigate('/checkout');
              }}
              className={`w-full h-[52px] flex items-center justify-center gap-2 font-central text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 border border-nav-dark ${cartItems.length > 0 ? 'bg-[#b8a68b] text-white hover:opacity-90' : 'bg-gray-200 text-gray-500 cursor-not-allowed border-transparent'}`}
            >
              Checkout Securely
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </button>
            
            <div className="flex justify-center gap-1 mt-2 opacity-60 grayscale">
              <img src="https://cdn.shopify.com/s/assets/payment_icons/visa-319d545c6fd255c9aad5eeaad21fd6f7f7b4f5976090882d9213b2f8115668e1.svg" alt="Visa" className="h-6" />
              <img src="https://cdn.shopify.com/s/assets/payment_icons/master-173035bc8124581983d4efa50cf8626e8553c2b311353fbf67485f9c1a2b88d1.svg" alt="Mastercard" className="h-6" />
              <img src="https://cdn.shopify.com/s/assets/payment_icons/paypal-49e4c1e03244b6d2de0d270ac0d22b3f5cc73624f280012ced614b423c103984.svg" alt="PayPal" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}