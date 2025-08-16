import { useState, useEffect } from "react";
import "../AdminSide/ViewProducts.css";
import ProductsFilter from "./ProductsFilter";
import { useClientView } from "./ClientViewContext";

function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { setActiveView, setSelectedProduct, addToCart } = useClientView();

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

    if (category !== "ALL") {
      updatedProducts = updatedProducts.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      updatedProducts = updatedProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sort === "name") {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "price-low") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [category, sort, searchTerm, products]);

  return (
    <>
      <ProductsFilter
        setCategory={setCategory}
        setSort={setSort}
        setSearchTerm={setSearchTerm}
      />
      <h1 className="prod-head">{category} PRODUCTS</h1>
      <div className="d-flex main-prod-container flex-wrap gap-10">
        {filteredProducts.map((product, index) => (
          <div key={index} className="productcard-container">
            {/* 👇 Clicking image → go to product details */}
            <div
              className="image"
              onClick={() => {
                setSelectedProduct(product);
                setActiveView("product-details");
              }}
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
                {/* 👇 Add to cart only */}
                <button
                  className="cart-button"
                  onClick={() => addToCart(product)}
                >
                  Add to cart
                </button>
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
