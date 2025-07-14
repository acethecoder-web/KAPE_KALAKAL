import "../CSS_FILES/App.css";
import LandingPage from "./LandingPage";
import NavBar from "./NavBar";
import About from "./About";
import Shop from "./Shop";
import { Routes, Route } from "react-router-dom";
function App() {
	return (
		<>
			<NavBar />
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/about" element={<About />} />
				<Route path="/products" element={<Shop />} />
			</Routes>
			{/* <About /> */}
		</>
	);
}

export default App;
