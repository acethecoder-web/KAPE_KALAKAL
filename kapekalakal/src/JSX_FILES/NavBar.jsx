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
					<Link to="/login" className="nav-items nav-item6" href="">
						LOG IN
					</Link>
				</div>
				<i
					onClick={
						("click",
						function () {
							document.querySelector(".burger-con").classList.toggle("show");
						})
					}
					className="fa-solid burger fa-bars fa-2xl"></i>
			</nav>

			<div className="burger-con">
				<Link to="/about" className="nav-items2">
					ABOUT
				</Link>
				<Link to="/products" className="nav-items2">
					PRODUCTS
				</Link>
				<Link to="/order" className="nav-items2">
					ORDER NOW
				</Link>
				<Link to="/cart" className="nav-items2">
					CART
				</Link>
				<Link to="/login" Link className="nav-items nav-item6-2">
					LOG IN
				</Link>
			</div>
		</>
	);
}

function ShowBurger() {
	document.querySelector(".burger").classList.add("show");
}

export default NavBar;
