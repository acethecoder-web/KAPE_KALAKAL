import "../CSS_FILES/App.css";
function NavBar() {
	return (
		<>
			<nav className="navbar">
				<div className="maincon">
					<a href="#">
						<img className="logo" src="/LOGO.svg" alt="Logo" />
					</a>
					<p className="shopname">KAPE KALAKAL</p>
				</div>
				<div className="nav-buttons">
					<a className="nav-items" href="">
						ABOUT
					</a>
					<a className="nav-items" href="">
						PRODUCTS
					</a>
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
