import "../CSS_FILES/App.css";
import { Link } from "react-router-dom";
function NavBar() {
	return (
		<>
			<nav className="navbar">
				<div className="maincon">
					<Link to="/" className="nav-items">
						<img className="logo" src="/LOGO.svg" alt="Logo" />
					</Link>
					<p className="shopname">KAPE KALAKAL</p>
				</div>
				<div className="nav-buttons">
					<Link to="/about" className="nav-items">
						ABOUT
					</Link>
					<Link to="/products" className="nav-items">
						PRODUCTS
					</Link>
					{/* <a className="nav-items" href="">
						ORDER NOW
					</a>
					<a className="nav-items" href="">
						CART
					</a> */}
					<a className="nav-items nav-item6" href="">
						LOG IN
					</a>
				</div>
			</nav>
		</>
	);
}

export default NavBar;
