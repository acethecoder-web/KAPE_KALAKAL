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

  // Enhanced user detection to get actual logged-in user
  const getCurrentUser = () => {
    try {
      // First, try to get logged-in user from localStorage
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        console.log("Found logged-in user:", userData);
        return {
          id: userData.id || userData._id || userData.userId,
          name: userData.name || userData.username || userData.fullName,
          email: userData.email,
          isGuest: false,
          ...userData,
        };
      }

      // Try alternative storage keys that might be used
      const alternativeKeys = ["user", "currentUser", "authUser", "userData"];
      for (const key of alternativeKeys) {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          try {
            const userData = JSON.parse(storedData);
            if (
              userData &&
              (userData.name || userData.username) &&
              userData.name !== "Guest User"
            ) {
              console.log(`Found user data in ${key}:`, userData);
              return {
                id: userData.id || userData._id || userData.userId,
                name: userData.name || userData.username || userData.fullName,
                email: userData.email,
                isGuest: false,
                ...userData,
              };
            }
          } catch (parseError) {
            console.warn(`Error parsing ${key} from localStorage:`, parseError);
          }
        }
      }

      // Check sessionStorage as backup
      const sessionUser =
        sessionStorage.getItem("loggedInUser") ||
        sessionStorage.getItem("user");
      if (sessionUser) {
        try {
          const userData = JSON.parse(sessionUser);
          if (
            userData &&
            (userData.name || userData.username) &&
            userData.name !== "Guest User"
          ) {
            console.log("Found user in sessionStorage:", userData);
            return {
              id: userData.id || userData._id || userData.userId,
              name: userData.name || userData.username || userData.fullName,
              email: userData.email,
              isGuest: false,
              ...userData,
            };
          }
        } catch (parseError) {
          console.warn("Error parsing session user data:", parseError);
        }
      }

      // If no logged-in user found, create/get guest user
      console.log("No logged-in user found, creating guest user");
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
    } catch (error) {
      console.error("Error retrieving user data:", error);
      // Fallback to guest user
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
    }
  };

  // Enhanced Add to Cart function with database integration
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

        // Show success message with user info
        alert(
          `${product.name} (${quantity} ${
            quantity > 1 ? "items" : "item"
          }) added to ${user.isGuest ? "guest" : user.name + "'s"} cart!`
        );

        // Also call the context addToCart if you still need it for local state
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

  // Enhanced function to handle direct checkout
  const handleDirectCheckout = async (product) => {
    try {
      setIsCheckingOut(true);
      const user = getCurrentUser();

      console.log("Direct checkout initiated by user:", user);

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
            userName: user.name,
            isGuest: user.isGuest,
          })
        );

        // Show confirmation message
        const confirmMessage = user.isGuest
          ? `Proceeding to checkout as guest user...`
          : `Proceeding to checkout for ${user.name}...`;

        console.log(confirmMessage);

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

  // Get current user for display
  const currentUser = getCurrentUser();

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

        {/* Enhanced checkout info */}
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
