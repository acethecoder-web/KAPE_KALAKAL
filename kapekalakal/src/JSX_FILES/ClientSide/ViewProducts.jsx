import { useState, useEffect } from "react";
import "../AdminSide/ViewProducts.css";

function ViewProducts() {
  const [products, setproducts] = useState([]);

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
    <div className="d-flex justify-content-center flex-wrap gap-10">
      {products.map((product) => (
        <div className="productcard-container">
          <div className="image">
            <img
              src="/placeholder.png"
              alt="placeholder"
              className="product-img"
            />
          </div>
          <div className="product-details">
            <h1 className="product-name">{product.name}</h1>
            <p className="product-description">{product.description}</p>
            <div className="quantity-container">
              <button className="quantity-button">-</button>
              <p className="quantity-display">1</p>
              <button className="quantity-button">+</button>
            </div>
            <p className="product-price">{product.price}</p>
            <div className="buttons">
              <button className="cart-button">Add to cart</button>
              <button className="buy-button">Buy now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewProducts;
