import "../CSS_FILES/App.css";
import LandingPage from "./LandingPage";
import About from "./About";
import Shop from "./Shop";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import AdminDashboard from "./AdminSide/AdminDashboard";
import ProtectedRoute from "./AdminSide/ProtectedRoute";
import ManageUser from "./AdminSide/ManageUsers";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/about" element={<About />} />
				<Route
					path="/products"
					element={
						<ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
							<Shop />
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
			</Routes>
		</>
	);
}

export default App;
