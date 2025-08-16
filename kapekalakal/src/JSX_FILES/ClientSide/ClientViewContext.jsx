// ClientViewContext.jsx
import { createContext, useContext, useState } from "react";

const ClientViewContext = createContext();

export function ClientViewProvider({ children }) {
  const [activeView, setActiveView] = useState("view-products");
  const [selectedProduct, setSelectedProduct] = useState(null); // 👈 for product details
  const [cart, setCart] = useState([]); // 👈 for cart items

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  return (
    <ClientViewContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
      }}
    >
      {children}
    </ClientViewContext.Provider>
  );
}

export function useClientView() {
  return useContext(ClientViewContext);
}
