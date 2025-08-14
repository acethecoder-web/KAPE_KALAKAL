import { useState, useEffect } from "react";
import "../AdminSide/ViewProducts.css";
import ProductsFilter from "./ProductsFilter";
import { useClientView } from "./ClientViewContext";
function ViewProducts() {
  const [products, setproducts] = useState([]);
  const { setActiveView } = useClientView();

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5174/api/products");
      const data = await res.json();
      setproducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [setproducts]);

  return (
    <>
      <ProductsFilter />
      <div className="d-flex main-prod-container flex-wrap gap-10">
        {products.map((product) => (
          <div className="productcard-container">
            <div
              onClick={() => setActiveView("product-details")}
              className="image"
            >
              <img
                src={product.image ? product.image : "placeholder.jpg"}
                alt={product.name || "No Image"}
                className="product-img w-100 h-100 object-cover rounded"
              />{" "}
            </div>
            <div className="product-details">
              <h1 className="product-name">{product.name}</h1>
              <h1 className="product-description">
                {product.description
                  ? product.description.split(" ").slice(0, 15).join(" ") +
                    (product.description.split(" ").length > 15 ? " ..." : "")
                  : ""}
              </h1>
              <p className="product-price">
                <i class="fa-solid fa-peso-sign"></i> {product.price}
              </p>
              <div className="buttons">
                <button className="cart-button">Add to cart</button>
                <button className="buy-button">Buy now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ViewProducts;
