import "./AdminNav.css";
import { Link } from "react-router-dom";
import { FiSidebar } from "react-icons/fi";
import { useAdminView } from "./AdminViewContext.jsx";
function AdminNavBar() {
	const { setActiveView } = useAdminView();

	const toggleSidebar = () => {
		const burgerCon1 = document.querySelector(".burger-con1");
		const sideNav = document.querySelector(".sidenav-con");

		burgerCon1.classList.remove("show");
		sideNav.classList.toggle("showside");
	};

	const toggleBurger1 = () => {
		const burgerCon1 = document.querySelector(".burger-con1");
		const sideNav = document.querySelector(".sidenav-con");

		burgerCon1.classList.toggle("show");
		sideNav.classList.toggle("showside");
	};

	return (
		<>
			<nav className="navbar">
				<div className="maincon">
					<FiSidebar
						onClick={("click", toggleSidebar)}
						className="sidebar-icon"
					/>
					<Link to="/" className="nav-items">
						<img className="logo" src="/LOGO.svg" alt="Logo" />
					</Link>
					<p className="shopname">KAPE KALAKAL</p>
				</div>
				<div className="nav-buttons">
					<i
						className="fa-solid fa-bars mt-3 mr-4"
						onClick={
							("click",
							function () {
								document.querySelector(".burger-con1").classList.toggle("show");
							})
						}></i>
				</div>
				<i
					onClick={("click", toggleBurger1)}
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

			<div className="burger-con1">
				<Link to="/products" className="nav-items2-1">
					<i class="fa-solid s-icon fa-hand-holding-heart"></i>
					PRODUCTS
				</Link>
				<Link to="/cart" className="nav-items2-1">
					<i class="fa-solid s-icon fa-user-tie"></i> PROFILE
				</Link>
			</div>

			<div className="sidenav-con">
				<div
					to=""
					className="nav-items2-1"
					onClick={() => setActiveView("manage-users")}>
					<i class="fa-solid s-icon fa-xl  fa-users"></i>
					MANAGE USERS
				</div>
				<div
					to=""
					className="nav-items2-1"
					onClick={() => setActiveView("manage-products")}>
					<i class="fa-solid s-icon fa-xl fa-hand-holding-heart"></i>
					MANAGE PRODUCTS
				</div>
				<div
					to=""
					className="nav-items2-1"
					onClick={() => setActiveView("manage-orders")}>
					<i class="fa-solid s-icon fa-xl fa-list-check"></i>
					MANAGE ORDERS
				</div>
				<div
					to=""
					className="nav-items2-1"
					onClick={() => setActiveView("manage-payments")}>
					<i class="fa-solid s-icon fa-xl fa-money-bill-1-wave"></i>
					MANAGE PAYMENTS
				</div>
				<div to="/products" className="nav-items2-1">
					<i class="fa-solid s-icon fa-hand-holding-heart"></i>
					PRODUCTS
				</div>
				<div to="/cart" className="nav-items2-1">
					<i class="fa-solid s-icon fa-user-tie"></i> PROFILE
				</div>
			</div>
		</>
	);
}

export default AdminNavBar;
