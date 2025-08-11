import "../../CSS_FILES/App.css";
import "./ClientNavbar.css";
import { Link } from "react-router-dom";
import { useClientView } from "./ClientViewContext";
function ClientNavbar() {
  const { setActiveView } = useClientView();
  return (
    <>
      <nav className="navbar">
        <div className="maincon">
          <Link to="/" className="nav-items">
            <img className="mb-4 logo" src="/LOGO.svg" alt="Logo" />
          </Link>
          <p className="shopname mb-4">KAPE KALAKAL</p>
        </div>
        <div className="nav-buttons ">
          <Link to="/about" className="nav-items mb-4">
            ABOUT
          </Link>
          <div
            onClick={() => setActiveView("view-products")}
            className="nav-items mb-4"
          >
            PRODUCTS
          </div>
          <div
            onClick={() => setActiveView("cart")}
            className="nav-items mb-2 "
            href=""
          >
            <i class="fa-solid fa-cart-shopping"></i>
          </div>
          <div to="/" className="nav-items nav-item6" href="">
            <i className="fa-solid s-icon fa-user-tie mb-2"></i> PROFILE
          </div>
        </div>
        <i
          onClick={
            ("click",
            function () {
              document.querySelector(".burger-con").classList.toggle("show");
            })
          }
          className="fa-solid burger fa-bars fa-2xl"
        ></i>
      </nav>

      <div className="burger-con">
        <div className="burger-items">
          <Link to="/about" className="nav-items2">
            ABOUT
          </Link>
          <Link to="/products" className="nav-items2">
            PRODUCTS
          </Link>
          <Link to="/order" className="nav-items2">
            MY ORDERS
          </Link>
          <Link to="/cart" className="nav-items2">
            CART
          </Link>
          <Link to="/login" Link className="nav-items nav-item6-2">
            LOGIN
          </Link>
        </div>
      </div>
    </>
  );
}

function ShowBurger() {
  document.querySelector(".burger").classList.add("show");
}

export default ClientNavbar;
