import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  // Function to fetch and update cart count
  const updateCartCount = async () => {
    try {
      const response = await fetch("http://localhost:5174/api/cart");
      if (response.ok) {
        const data = await response.json();
        // Calculate total quantity of all items
        const totalCount = data.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(totalCount);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  // Initialize cart count on mount
  useEffect(() => {
    updateCartCount();
  }, []);

  const value = {
    cartItemCount,
    updateCartCount,
    setCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
