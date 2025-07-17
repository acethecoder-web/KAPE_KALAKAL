import "../CSS_FILES/App.css";
import LandingPage from "./LandingPage";
import NavBar from "./NavBar";
import About from "./About";
import Shop from "./Shop";
import Footer from "./Footer";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./register";

function App() {
	return (
		<>
			<NavBar />
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/about" element={<About />} />
				<Route path="/products" element={<Shop />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</>
	);
}

export default App;
