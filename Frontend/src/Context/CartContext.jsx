import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize state from LocalStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('outrey_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to LocalStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem('outrey_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product, color, size, quantity = 1) => {
    // Generate a unique ID for this exact variation
    const variantId = `${product.id}-${color.id}-${size}`;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.variantId === variantId);

      if (existingItem) {
        return prevItems.map(item =>
          item.variantId === variantId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, {
          variantId,
          productId: product.id,
          masterCategory: product.masterCategory,
          productType: product.productType,
          name: product.name,
          colorName: color.name,
          size: size,
          price: product.price,
          image: color.images[0]?.url || '', // Automatically grab the first mapped image URL
          quantity
        }];
      }
    });
    openCart();
  };

  const updateQuantity = (variantId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item =>
      item.variantId === variantId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (variantId) => {
    setCartItems(prev => prev.filter(item => item.variantId !== variantId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      isCartOpen, toggleCart, openCart, closeCart,
      cartItems, addToCart, updateQuantity, removeFromCart, clearCart,
      cartTotal, cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};