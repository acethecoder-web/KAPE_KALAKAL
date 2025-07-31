import { useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import ManageUsers from "./ManageUsers.jsx";
import ManageOrders from "./ManageOrders.jsx";
import ManagePayments from "./ManagePayments.jsx";
import ManageProducts from "./ManageProducts.jsx";
import { AdminViewProvider, useAdminView } from "./AdminViewContext.jsx";

function AdminDashboardContent() {
	const { activeView, setActiveView } = useAdminView();

	useEffect(() => {
		setActiveView("manage-users");
	}, [setActiveView]);

	const renderContent = () => {
		switch (activeView) {
			case "manage-users":
				return <ManageUsers />;
			case "manage-products":
				return <ManageProducts />;
			case "manage-orders":
				return <ManageOrders />;
			case "manage-payments":
				return <ManagePayments />;
			default:
				return <div>Select a section from the sidebar.</div>;
		}
	};

	return (
		<>
			<AdminNavBar />
			<div className="d-flex admin-dashboard pl-5 center justify-content-center ">
				<div className="admin-body">{renderContent()}</div>
			</div>
		</>
	);
}

function AdminDashboard() {
	return (
		<AdminViewProvider>
			<AdminDashboardContent />
		</AdminViewProvider>
	);
}

export default AdminDashboard;
