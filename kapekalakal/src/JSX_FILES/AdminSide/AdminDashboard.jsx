import { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import ManageUsers from "./ManageUsers.jsx";
import ManageOrders from "./ManageOrders.jsx";
import ManagePayments from "./ManagePayments.jsx";
import { AdminViewProvider, useAdminView } from "./AdminViewContext.jsx";
import ManageProducts from "./ManageProducts.jsx";
import coffeeAnimation from "../../assets/coffee_animation.json";
import Lottie from "lottie-react";
import ProfileAdmin from "./ProfileAdmin.jsx";

function AdminDashboardContent() {
  const { activeView, setActiveView } = useAdminView();
  const [loading, setLoading] = useState(true); // Start with loading true
  const [currentView, setCurrentView] = useState(null); // Start with null

  useEffect(() => {
    setActiveView("manage-users");
  }, [setActiveView]);

  // Handle loading animation when view changes or on initial load
  useEffect(() => {
    if (activeView && activeView !== currentView) {
      setLoading(true);
      const timeout = setTimeout(() => {
        setCurrentView(activeView);
        setLoading(false);
      }, 500); // animation duration

      return () => clearTimeout(timeout);
    }
  }, [activeView, currentView]);

  const renderContent = () => {
    if (loading) {
      return (
        <div
          className="flex justify-center items-center h-96 drop-shadow-neutral-950"
          style={{ width: 500, height: 500 }}
        >
          <Lottie animationData={coffeeAnimation} loop autoplay />
        </div>
      );
    }

    switch (currentView) {
      case "manage-users":
        return <ManageUsers />;
      case "manage-products":
        return <ManageProducts />;
      case "manage-orders":
        return <ManageOrders />;
      case "manage-payments":
        return <ManagePayments />;
      case "profile":
        return <ProfileAdmin />;
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
