import React, { useState } from "react";
import "./ProductDetails.css";
import { useClientView } from "./ClientViewContext";

function ProductDetails() {
  const { selectedProduct, addToCart } = useClientView();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  // Enhanced Add to Cart function with database integration (same as ViewProducts)
  const handleAddToCart = async (product) => {
    try {
      const cartItem = {
        productId: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity, // Use the selected quantity instead of default 1
      };

      const response = await fetch("http://localhost:5174/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Item added to cart:", result);

        // Optional: Show success message or notification
        alert(
          `${product.name} (${quantity} ${
            quantity > 1 ? "items" : "item"
          }) added to cart!`
        );

        // Also call the context addToCart if you still need it for local state
        // Note: You might need to modify this to handle quantity properly
        addToCart({ ...product, quantity });
      } else {
        const error = await response.json();
        console.error("Error adding to cart:", error);
        alert("Failed to add item to cart. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection and try again.");
    }
  };

  if (!selectedProduct) {
    return <p>No product selected.</p>;
  }

  return (
    <div className="coffee-product">
      {/* Image */}
      <div className="coffee-image">
        <img
          src={selectedProduct.image || "/images/placeholder.png"}
          alt={selectedProduct.name}
        />
      </div>

      {/* Details */}
      <div className="coffee-details">
        <h2>{selectedProduct.name}</h2>
        <p className="description">{selectedProduct.description}</p>
        <p className="price">₱{selectedProduct.price} PHP</p>

        {/* Quantity Selector */}
        <div className="quantity-selector">
          <div className="pd-qbuttons">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              −
            </button>
          </div>
          <div className="quantity-display">{quantity}</div>
          <div className="pd-qbuttons">
            <button onClick={() => handleQuantityChange(1)}>+</button>
          </div>
        </div>

        <div className="pd-buttons d-flex gap-3">
          <button onClick={() => handleAddToCart(selectedProduct)}>
            Add to cart
          </button>
          <button>Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
