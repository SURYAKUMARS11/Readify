import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const isLoggingOut = useRef(false);

  // Helper to get key based on current userId in storage
  const getCartKey = () => {
    const userId = localStorage.getItem('userId');
    return userId ? `cart_${userId}` : 'cart_guest';
  };

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(getCartKey());
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 1. EFFECT: Watch for changes in cartItems and SAVE them
  useEffect(() => {
    if (!isLoggingOut.current) {
      localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
    }
  }, [cartItems]);

  
  // This is the missing piece that loads the cart when a new user logs in
  useEffect(() => {
    const syncCartOnLogin = () => {
      const savedCart = localStorage.getItem(getCartKey());
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    };

    // Listen for storage changes (works across tabs)
    window.addEventListener('storage', syncCartOnLogin);
    return () => window.removeEventListener('storage', syncCartOnLogin);
  }, []);

  const addToCart = (book, qty) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item._id === book._id);
      if (existingItem) {
        return prev.map((item) =>
          item._id === book._id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...book, qty }];
    });
  };

  const clearCart = () => {
    const key = getCartKey();
    localStorage.removeItem(key); // Actually delete from storage (Order Placed)
    setCartItems([]);
  };

  const logoutResetCart = () => {
    isLoggingOut.current = true;
    setCartItems([]); // Clear screen
    setTimeout(() => {
      isLoggingOut.current = false;
    }, 500);
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart, logoutResetCart, totalAmount, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);