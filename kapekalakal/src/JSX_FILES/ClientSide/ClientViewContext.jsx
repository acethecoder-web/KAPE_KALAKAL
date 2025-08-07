import { createContext, useContext, useState } from "react";

const ClientViewContext = createContext();

export function ClientViewProvider({ children }) {
  const [activeView, setActiveView] = useState("view-products"); // Default view for client
  return (
    <ClientViewContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </ClientViewContext.Provider>
  );
}

export function useClientView() {
  return useContext(ClientViewContext);
}
