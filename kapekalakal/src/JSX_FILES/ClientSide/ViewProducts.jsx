import { useState, useEffect } from "react";
import "../AdminSide/ViewProducts.css";
import ProductsFilter from "./ProductsFilter";
import { useClientView } from "./ClientViewContext";

function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("");
  const { setActiveView } = useClientView();

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5174/api/products");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let updatedProducts = [...products];

    // Filter by category
    if (category !== "ALL") {
      updatedProducts = updatedProducts.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort products
    if (sort === "name") {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "price-low") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [category, sort, products]);

  return (
    <>
      <ProductsFilter setCategory={setCategory} setSort={setSort} />
      <h1 className="prod-head">{category} PRODUCTS</h1>
      <div className="d-flex main-prod-container flex-wrap gap-10">
        {filteredProducts.map((product, index) => (
          <div key={index} className="productcard-container">
            <div
              onClick={() => setActiveView("product-details")}
              className="image"
            >
              <img
                src={product.image ? product.image : "placeholder.jpg"}
                alt={product.name || "No Image"}
                className="product-img w-100 h-100 object-cover rounded"
              />
            </div>
            <div className="product-details">
              <h1 className="product-name">
                {product.name
                  ? product.name.split(" ").slice(0, 3).join(" ") +
                    (product.name.split(" ").length > 3 ? "..." : "")
                  : ""}
              </h1>
              <h1 className="product-description">
                {product.description
                  ? product.description.split(" ").slice(0, 15).join(" ") +
                    (product.description.split(" ").length > 15 ? " ..." : "")
                  : ""}
              </h1>
              <p className="product-price">
                <i className="fa-solid fa-peso-sign"></i> {product.price}
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
