import "../CSS_FILES/LandingPage.css";
import { BrowserRouter, Router, Route } from "react-router-dom";
import About from "./About";
import NavBar from "./NavBar";
function LandingPage() {
	return (
		<>
			<NavBar />

			<div className="maincon1">
				<h1 className="tagline">
					<span>Fueling</span> Mornings, <br /> <br /> <span>Brewing</span>{" "}
					Connections
				</h1>
				<button className="register">REGISTER NOW</button>
			</div>
		</>
	);
}

export default LandingPage;
