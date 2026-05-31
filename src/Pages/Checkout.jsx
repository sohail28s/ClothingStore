import React, { useState, useEffect } from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const SHIPPING_COST = 300;
  const finalTotal = cartTotal + SHIPPING_COST;

  useEffect(() => {
    if (cartItems.length === 0 && !isModalOpen) {
      navigate('/collections/men-t-shirts');
    }
  }, [cartItems, isModalOpen, navigate]);

  // Initialize form.
  const [formData, setFormData] = useState({
    email: '',
    country: 'Pakistan',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postcode: '',
    emailOffers: false,
    paymentMethod: 'credit_card', // credit_card or cash_on_delivery
    cardNumber: '',
    expiry: '',
    cvc: '',
    nameOnCard: ''
  });

  // Smart Auto-fill: Checks AuthContext first, then falls back to 'outrey_user' in LocalStorage
  useEffect(() => {
    const localUserStr = localStorage.getItem('outrey_user');
    const localUser = localUserStr ? JSON.parse(localUserStr) : null;
    const activeUser = currentUser || localUser;

    if (activeUser) {
      const defaultAddress = activeUser.addresses && activeUser.addresses.length > 0 
        ? activeUser.addresses[0] 
        : {};

      setFormData(prev => ({
        ...prev,
        email: activeUser.email || prev.email,
        firstName: activeUser.firstName || defaultAddress.firstName || prev.firstName,
        lastName: activeUser.lastName || defaultAddress.lastName || prev.lastName,
        address: defaultAddress.address || prev.address,
        city: defaultAddress.city || prev.city,
        postcode: defaultAddress.postalCode || prev.postcode,
        country: defaultAddress.country || 'Pakistan'
      }));
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleCCChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'expiry') {
      let raw = value.replace(/\D/g, '').slice(0, 4);
      if (raw.length >= 3) {
        formattedValue = `${raw.slice(0, 2)}/${raw.slice(2)}`;
      } else {
        formattedValue = raw;
      }
    }
    
    setFormData({ ...formData, [name]: formattedValue });
  };

  // ==========================================
  // REAL API CHECKOUT LOGIC
  // ==========================================
  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Format the items array to match the backend expectation
      const apiItems = cartItems.map(item => {
        const dbVariantId = item.variantId.split('-')[1]; 
        return {
          productId: item.productId,
          variantId: dbVariantId,
          size: item.size,
          quantity: item.quantity
        };
      });

      // 2. Build the exact JSON payload expected by the API
      const payload = {
        items: apiItems,
        shippingAddress: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postcode,
          country: formData.country
        },
        emailOffers: formData.emailOffers,
        paymentMethod: formData.paymentMethod
      };

      // 3. Attach Card Details only if paying via Credit Card
      if (formData.paymentMethod === 'credit_card') {
        payload.cardDetails = {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiry,
          cvc: formData.cvc,
          nameOnCard: formData.nameOnCard
        };
      }

      // 4. FETCH THE EXACT outrey TOKEN
      const userToken = localStorage.getItem('outrey_token');
      
      console.log("DEBUG - Token being sent to backend:", userToken);

      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Inject the Bearer token
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
      } else {
        alert("Authentication Error: Missing 'outrey_token'. Please log in again.");
        setIsSubmitting(false);
        return; 
      }

      // 5. Send POST request to Database
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to process order');
      }

      // 6. Success! Clear cart and show confirmation
      clearCart();
      setConfirmedOrderId(result.data?._id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsModalOpen(true);

    } catch (error) {
      console.error("Checkout Error:", error);
      alert(`Checkout Failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row font-ballinger text-nav-dark">
        
        {/* LEFT COLUMN: FORM */}
        <div className="w-full lg:w-[55%] xl:w-[60%] bg-white pt-10 pb-20 px-4 md:px-12 lg:pl-20 xl:pl-32 lg:pr-16 flex flex-col items-center lg:items-end mt-[80px]">
          <div className="w-full max-w-[600px]">
            <div className="mb-8 flex justify-center lg:justify-start">
              <span className="font-central text-3xl font-bold uppercase tracking-widest">P&Co</span>
            </div>

            <form onSubmit={handleCheckout} className="flex flex-col gap-8">
              
              {/* CONTACT SECTION */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-central text-lg font-bold uppercase tracking-wider">Contact</h2>
                  {(currentUser || localStorage.getItem('outrey_user')) && (
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Logged in</span>
                  )}
                </div>
                <input 
                  required 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="Email address" 
                  className="w-full p-3 border border-gray-300 rounded-[4px] focus:ring-2 focus:ring-nav-dark outline-none transition-all placeholder-gray-400" 
                />
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="emailOffers"
                    checked={formData.emailOffers}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-nav-dark" 
                  />
                  <span className="text-sm text-gray-600">Email me with news and offers</span>
                </label>
              </div>

              {/* DELIVERY SECTION */}
              <div>
                <h2 className="font-central text-lg font-bold uppercase tracking-wider mb-4">Delivery</h2>
                <div className="flex flex-col gap-3">
                  <select 
                    name="country" 
                    value={formData.country} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-[4px] bg-white cursor-pointer outline-none text-nav-dark"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                  </select>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" className="w-full p-3 border border-gray-300 rounded-[4px] outline-none focus:ring-2 focus:ring-nav-dark placeholder-gray-400" />
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" className="w-full p-3 border border-gray-300 rounded-[4px] outline-none focus:ring-2 focus:ring-nav-dark placeholder-gray-400" />
                  </div>
                  
                  <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Complete Address" className="w-full p-3 border border-gray-300 rounded-[4px] outline-none focus:ring-2 focus:ring-nav-dark placeholder-gray-400" />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full p-3 border border-gray-300 rounded-[4px] outline-none focus:ring-2 focus:ring-nav-dark placeholder-gray-400" />
                    <input required type="text" name="postcode" value={formData.postcode} onChange={handleInputChange} placeholder="Postal Code" className="w-full p-3 border border-gray-300 rounded-[4px] outline-none focus:ring-2 focus:ring-nav-dark placeholder-gray-400" />
                  </div>
                </div>
              </div>

              {/* PAYMENT SECTION */}
              <div>
                <h2 className="font-central text-lg font-bold uppercase tracking-wider mb-1">Payment</h2>
                <p className="text-xs text-gray-500 mb-4">All transactions are secure and encrypted.</p>
                
                <div className="border border-gray-300 rounded-[4px] overflow-hidden bg-white">
                  
                  {/* Credit Card Toggle */}
                  <label className="flex items-center p-4 border-b border-gray-300 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <input type="radio" name="paymentMethod" value="credit_card" checked={formData.paymentMethod === 'credit_card'} onChange={handleInputChange} className="w-4 h-4 accent-nav-dark mr-3" />
                    <span className="text-sm font-medium flex-1">Credit card</span>
                  </label>
                  
                  {/* Credit Card Form Elements */}
                  {formData.paymentMethod === 'credit_card' && (
                    <div className="p-4 bg-gray-50 flex flex-col gap-3 border-b border-gray-300 animate-in slide-in-from-top-2 duration-200">
                      <input required type="text" name="cardNumber" value={formData.cardNumber} onChange={handleCCChange} placeholder="Card number (16 digits)" className="w-full p-3 border border-gray-300 rounded-[4px] outline-none bg-white focus:ring-2 focus:ring-nav-dark placeholder-gray-400 font-mono text-sm" />
                      <div className="grid grid-cols-2 gap-3">
                        <input required type="text" name="expiry" value={formData.expiry} onChange={handleCCChange} placeholder="MM / YY" className="w-full p-3 border border-gray-300 rounded-[4px] outline-none bg-white focus:ring-2 focus:ring-nav-dark placeholder-gray-400 font-mono text-sm text-center" />
                        <input required type="password" name="cvc" value={formData.cvc} onChange={handleCCChange} placeholder="CVC (3 digits)" className="w-full p-3 border border-gray-300 rounded-[4px] outline-none bg-white focus:ring-2 focus:ring-nav-dark placeholder-gray-400 font-mono text-sm text-center" />
                      </div>
                      <input required type="text" name="nameOnCard" value={formData.nameOnCard} onChange={handleInputChange} placeholder="Name on card" className="w-full p-3 border border-gray-300 rounded-[4px] outline-none bg-white focus:ring-2 focus:ring-nav-dark placeholder-gray-400" />
                    </div>
                  )}

                  {/* Cash On Delivery Toggle */}
                  <label className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="paymentMethod" value="cash_on_delivery" checked={formData.paymentMethod === 'cash_on_delivery'} onChange={handleInputChange} className="w-4 h-4 accent-nav-dark mr-3" />
                    <span className="text-sm font-medium flex-1">Cash on Delivery (COD)</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full text-white p-4 rounded-[4px] font-central text-lg uppercase tracking-widest font-bold transition-colors shadow-md ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-nav-dark hover:bg-black'}`}
              >
                {isSubmitting ? 'Processing...' : 'Complete Order'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="w-full lg:w-[45%] xl:w-[40%] bg-[#fafafa] lg:border-l border-gray-200 pt-10 pb-20 px-4 md:px-12 lg:pr-20 xl:pr-32 lg:pl-16 lg:mt-[80px]">
          <div className="w-full max-w-[500px]">
            
            {/* Cart Items */}
            <div className="flex flex-col gap-4 mb-6">
              {cartItems.map(item => (
                <div key={item.variantId} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-[4px] border border-gray-300 bg-white shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10 font-bold shadow-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-sm font-bold text-nav-dark leading-tight">{item.name}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{item.colorName} / {item.size}</span>
                  </div>
                  <span className="text-sm font-medium text-nav-dark">PKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Totals Calculation */}
            <div className="border-t border-gray-300 py-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal • {cartItems.length} items</span>
                <span className="font-medium text-nav-dark">PKR {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-nav-dark">PKR {SHIPPING_COST.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4 flex justify-between items-end">
              <span className="text-base text-nav-dark font-central uppercase tracking-widest font-bold">Total</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-bold">PKR</span>
                <span className="text-3xl font-central font-bold text-nav-dark">{finalTotal.toLocaleString()}</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 transition-opacity" onClick={closeModal}>
          <div className="bg-white p-10 md:p-14 w-full max-w-md relative shadow-2xl flex flex-col items-center text-center border-t-4 border-nav-dark transform scale-100 transition-transform" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-nav-dark transition-colors p-2" aria-label="Close">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="w-16 h-16 rounded-full border-2 border-green-600 flex items-center justify-center text-green-600 mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            
            <h2 className="font-central text-2xl font-bold uppercase tracking-[0.15em] mb-3 text-nav-dark">
              Order Confirmed
            </h2>
            <p className="font-ballinger text-sm text-gray-600 mb-8 max-w-xs leading-relaxed">
              Thank you for shopping with us. Your order has been placed successfully and is being processed.
            </p>
            
            <div className="bg-[#f5f5f5] w-full py-4 px-6 mb-8 border border-gray-200">
              <p className="font-central text-[11px] uppercase tracking-widest text-gray-500 mb-1">Order Number</p>
              <p className="font-central text-lg font-bold tracking-widest text-nav-dark">{confirmedOrderId}</p>
            </div>
            
            <button onClick={closeModal} className="w-full bg-nav-dark text-white py-4 font-central text-sm uppercase tracking-widest font-bold hover:bg-black transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
}