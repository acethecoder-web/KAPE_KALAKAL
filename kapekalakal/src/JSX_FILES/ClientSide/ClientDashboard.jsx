import { useEffect, useState } from "react";
import ClientNavBar from "./ClientNavbar.jsx";
import ViewProducts from "./ViewProducts.jsx";
import MyOrders from "./MyOrders.jsx";
import MyPayments from "./MyPayments.jsx";
import { ClientViewProvider, useClientView } from "./ClientViewContext.jsx";
import coffeeAnimation from "../../assets/coffee_animation.json";
import Lottie from "lottie-react";
import CartPage from "./Cart.jsx";
import ProductDetails from "./ProductDetails.jsx";

function ClientDashboardContent() {
  const { activeView, setActiveView } = useClientView();
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("view-products");

  useEffect(() => {
    setActiveView("view-products");
  }, [setActiveView]);

  useEffect(() => {
    if (activeView !== currentView) {
      setLoading(true);
      const timeout = setTimeout(() => {
        setCurrentView(activeView);
        setLoading(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [activeView, currentView]);

  const renderContent = () => {
    if (loading) {
      return (
        <div
          className="flex justify-center items-center h-96"
          style={{ width: 500, height: 500 }}
        >
          <Lottie animationData={coffeeAnimation} loop autoplay />
        </div>
      );
    }

    switch (activeView) {
      case "view-products":
        return <ViewProducts />;
      case "my-orders":
        return <MyOrders />;
      case "my-payments":
        return <MyPayments />;
      case "cart":
        return <CartPage />;
      case "product-details":
        return <ProductDetails />;
      case "my-payments":
        return <MyPayments />;
      default:
        return <div>Select a section from the menu.</div>;
    }
  };

  return (
    <>
      <ClientNavBar />
      <div className="client-dashboard pl-5 flex justify-center">
        <div className="client-body">{renderContent()}</div>
      </div>
    </>
  );
}

function ClientDashboard() {
  return (
    <ClientViewProvider>
      <ClientDashboardContent />
    </ClientViewProvider>
  );
}

export default ClientDashboard;
