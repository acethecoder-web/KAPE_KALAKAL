import "../CSS_FILES/App.css";
import LandingPage from "./LandingPage";
import About from "./About";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import AdminDashboard from "./AdminSide/AdminDashboard";
import ProtectedRoute from "./AdminSide/ProtectedRoute";
import ManageUser from "./AdminSide/ManageUsers";
import ManageProducts from "./AdminSide/ManageProducts";
import ManageOrders from "./AdminSide/ManageOrders";
import ClientDashboard from "../JSX_FILES/ClientSide/ClientDashboard";
import ViewProducts from "./ClientSide/ViewProducts";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  return (
    <>
      <PayPalScriptProvider
        options={{ "client-id": `${clientId}`, currency: "PHP" }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <ViewProducts />
              </ProtectedRoute>
            }
          />{" "}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />{" "}
          <Route
            path="/manageuser"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ManageUser />
              </ProtectedRoute>
            }
          />{" "}
          <Route
            path="/manageproducts"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ManageProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manageorders"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ManageOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </PayPalScriptProvider>
    </>
  );
}

export default App;
