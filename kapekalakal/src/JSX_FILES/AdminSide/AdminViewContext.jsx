import { createContext, useContext, useState } from "react";

const AdminViewContext = createContext();

export function AdminViewProvider({ children }) {
	const [activeView, setActiveView] = useState("user");
	return (
		<AdminViewContext.Provider value={{ activeView, setActiveView }}>
			{children}
		</AdminViewContext.Provider>
	);
}

export function useAdminView() {
	return useContext(AdminViewContext);
}
