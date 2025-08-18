import React, { useState } from "react";
import "./ProductDetails.css";
import { useClientView } from "./ClientViewContext";

function ProductDetails() {
  const { selectedProduct, addToCart, setActiveView } = useClientView();
  const [quantity, setQuantity] = useState(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  // Get current user (same logic as MyPayments)
  const getCurrentUser = () => {
    // Option 1: Get from localStorage (if you store user info there)
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }

    // Option 2: Get from sessionStorage
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      return JSON.parse(sessionUser);
    }

    // Option 3: Generate a temporary user ID for guest users
    let guestId = localStorage.getItem("guestUserId");
    if (!guestId) {
      guestId = "guest_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("guestUserId", guestId);
    }

    return {
      id: guestId,
      name: "Guest User",
      isGuest: true,
    };
  };

  // Enhanced Add to Cart function with database integration (same as ViewProducts)
  const handleAddToCart = async (product) => {
    try {
      const user = getCurrentUser();
      const cartItem = {
        productId: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity, // Use the selected quantity instead of default 1
        userId: user.id, // Include user ID for the cart item
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

  // New function to handle direct checkout
  const handleDirectCheckout = async (product) => {
    try {
      setIsCheckingOut(true);
      const user = getCurrentUser();

      // Create a temporary cart item for this checkout
      const checkoutItem = {
        productId: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity,
        userId: user.id,
        isDirectCheckout: true, // Flag to identify this as a direct checkout item
      };

      // Clear any existing cart items for this user first (optional)
      // You might want to comment this out if you want to preserve existing cart items
      await fetch(`http://localhost:5174/api/cart?userId=${user.id}`, {
        method: "DELETE",
      });

      // Add the single item to cart for checkout
      const response = await fetch("http://localhost:5174/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutItem),
      });

      if (response.ok) {
        console.log("Item prepared for direct checkout");

        // Store checkout context (optional - for additional data passing)
        sessionStorage.setItem(
          "directCheckout",
          JSON.stringify({
            productId: product._id,
            quantity: quantity,
            timestamp: Date.now(),
          })
        );

        // Redirect to payments page
        setActiveView("my-payments");
      } else {
        const error = await response.json();
        console.error("Error preparing checkout:", error);
        alert("Failed to prepare checkout. Please try again.");
      }
    } catch (error) {
      console.error("Network error during checkout:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsCheckingOut(false);
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
          <button
            onClick={() => handleAddToCart(selectedProduct)}
            disabled={isCheckingOut}
          >
            Add to cart
          </button>
          <button
            onClick={() => handleDirectCheckout(selectedProduct)}
            disabled={isCheckingOut}
            style={{
              backgroundColor: isCheckingOut ? "#ccc" : undefined,
              cursor: isCheckingOut ? "not-allowed" : "pointer",
            }}
          >
            {isCheckingOut ? (
              <>
                <i
                  className="fas fa-spinner fa-spin"
                  style={{ marginRight: "5px" }}
                ></i>
                Processing...
              </>
            ) : (
              "Checkout"
            )}
          </button>
        </div>

        {/* Optional: Show checkout info */}
        <div style={{ marginTop: "15px", fontSize: "12px", color: "#666" }}>
          <p>
            <strong>Total for checkout:</strong> ₱
            {(selectedProduct.price * quantity).toFixed(2)}
            {quantity > 1 && ` (${quantity} items)`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
