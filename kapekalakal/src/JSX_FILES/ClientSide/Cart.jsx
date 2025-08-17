import React, { useState, useEffect } from "react";
import { useClientView } from "./ClientViewContext";

function CartPage() {
  const { setActiveView } = useClientView();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const taxRate = 0.08;
  const shippingFee = 5.99;

  // Calculate pagination values
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = cartItems.slice(startIndex, endIndex);

  // Reset to page 1 when items change and current page becomes invalid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [cartItems.length, currentPage, totalPages]);

  // Fetch cart items from database
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5174/api/cart");

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      const data = await response.json();
      setCartItems(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Update quantity in database
  const updateQuantity = async (itemId, change) => {
    try {
      const item = cartItems.find((item) => item._id === itemId);
      const newQuantity = Math.max(1, item.quantity + change);

      const response = await fetch(`http://localhost:5174/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        // Update local state
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        console.error("Failed to update quantity");
        alert("Failed to update quantity. Please try again.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Network error. Please try again.");
    }
  };

  // Remove item from database
  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5174/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update local state
        setCartItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemId)
        );
      } else {
        console.error("Failed to remove item");
        alert("Failed to remove item. Please try again.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Network error. Please try again.");
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        const response = await fetch("http://localhost:5174/api/cart", {
          method: "DELETE",
        });

        if (response.ok) {
          setCartItems([]);
          setCurrentPage(1);
        } else {
          console.error("Failed to clear cart");
          alert("Failed to clear cart. Please try again.");
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
        alert("Network error. Please try again.");
      }
    }
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingFee;

  // Coffee theme colors
  const colors = {
    dark: "#3c2415",
    medium: "#5d4037",
    light: "#8b4513",
    accent: "#a0522d",
    cream: "#f5f3f0",
    gold: "#d4af37",
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", color: colors.light }}>
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p style={{ color: colors.dark, marginTop: "20px" }}>
          Loading your cart...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", color: "red" }}>
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <p style={{ color: colors.dark, marginTop: "20px" }}>{error}</p>
        <button
          onClick={fetchCartItems}
          style={{
            padding: "10px 20px",
            background: colors.light,
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2px 2px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "30px",
            fontWeight: "700",
            color: colors.dark,
            marginTop: "20px",
          }}
        >
          <i
            className="fas fa-shopping-cart"
            style={{ marginRight: "10px" }}
          ></i>
          Shopping Cart ({cartItems.length} items)
        </h1>

        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            style={{
              background: "transparent",
              border: "2px solid red",
              color: "red",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <i className="fas fa-trash" style={{ marginRight: "5px" }}></i>
            Clear Cart
          </button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          justifyContent: "center",
        }}
      >
        {/* Cart Items */}
        <div
          style={{
            flex: "2",
            minWidth: "300px",
            background: "#fff",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          {cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <i
                className="fas fa-coffee"
                style={{ fontSize: "3rem", color: colors.light, opacity: 0.7 }}
              ></i>
              <h3 style={{ color: colors.dark }}>Your cart is empty</h3>
              <p style={{ color: colors.medium }}>
                Add some delicious coffee to get started!
              </p>
              <button
                onClick={() => setActiveView("view-products")}
                style={{
                  background: colors.light,
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginTop: "20px",
                  fontSize: "16px",
                }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/* Pagination Info */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: colors.medium,
                    fontSize: "14px",
                  }}
                >
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, cartItems.length)} of {cartItems.length}{" "}
                  items
                </p>
                <p
                  style={{
                    margin: 0,
                    color: colors.medium,
                    fontSize: "14px",
                  }}
                >
                  Page {currentPage} of {totalPages}
                </p>
              </div>

              {/* Cart Items List */}
              {currentItems.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr auto auto",
                    gap: "20px",
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                    padding: "15px 0",
                  }}
                >
                  <div>
                    <img
                      src={item.image || "placeholder.jpg"}
                      alt={item.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "10px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div>
                    <h4
                      style={{
                        margin: "0",
                        color: colors.dark,
                        fontSize: "18px",
                      }}
                    >
                      {item.name}
                    </h4>

                    {item.category && (
                      <span
                        style={{
                          background: colors.light,
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      >
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      disabled={item.quantity <= 1}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: item.quantity <= 1 ? "#ccc" : colors.light,
                        color: "#fff",
                        border: "none",
                        cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className="fas fa-minus"
                        style={{ fontSize: "12px" }}
                      ></i>
                    </button>
                    <span
                      style={{
                        fontSize: "16px",
                        minWidth: "40px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: colors.light,
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className="fas fa-plus"
                        style={{ fontSize: "12px" }}
                      ></i>
                    </button>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        margin: "0",
                        fontWeight: "700",
                        color: colors.dark,
                        fontSize: "16px",
                      }}
                    >
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "red",
                        cursor: "pointer",
                        marginTop: "8px",
                        padding: "4px",
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "30px",
                    padding: "20px 0",
                  }}
                >
                  <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    style={{
                      background: currentPage === 1 ? "#ccc" : colors.light,
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      fontSize: "14px",
                    }}
                  >
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        style={{
                          background:
                            currentPage === pageNumber
                              ? colors.dark
                              : "transparent",
                          color:
                            currentPage === pageNumber ? "white" : colors.dark,
                          border: `2px solid ${colors.dark}`,
                          padding: "8px 12px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight:
                            currentPage === pageNumber ? "bold" : "normal",
                        }}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    style={{
                      background:
                        currentPage === totalPages ? "#ccc" : colors.light,
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      cursor:
                        currentPage === totalPages ? "not-allowed" : "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary */}
        {cartItems.length > 0 && (
          <div
            style={{
              flex: "1",
              minWidth: "280px",
              background: colors.dark,
              borderRadius: "15px",
              padding: "20px",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              height: "fit-content",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "30px",
                color: "#fff",
              }}
            >
              <i
                className="fas fa-receipt"
                style={{ marginRight: "8px", color: colors.gold }}
              ></i>
              Order Summary
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span style={{ fontSize: "16px" }}>Subtotal:</span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: colors.gold,
                }}
              >
                ₱{subtotal.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span style={{ fontSize: "16px" }}>Tax (8%):</span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: colors.gold,
                }}
              >
                ₱{tax.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span style={{ fontSize: "16px" }}>Shipping:</span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: colors.gold,
                }}
              >
                ₱{shippingFee.toFixed(2)}
              </span>
            </div>
            <hr style={{ borderColor: "#fff", margin: "20px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.2rem",
                marginBottom: "20px",
              }}
            >
              <strong>Total:</strong>
              <strong style={{ color: colors.gold }}>
                ₱{total.toFixed(2)}
              </strong>
            </div>

            <button
              onClick={() => {
                if (cartItems.length === 0) {
                  alert("Your cart is empty!");
                  return;
                }
                setActiveView("my-payments");
              }}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "15px",
                background: cartItems.length === 0 ? "#ccc" : colors.gold,
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
                fontSize: "16px",
                color: cartItems.length === 0 ? "#666" : "#000",
              }}
              disabled={cartItems.length === 0}
            >
              <i
                className="fas fa-credit-card"
                style={{ marginRight: "8px" }}
              ></i>
              Proceed to Checkout ({cartItems.length} items)
            </button>
            <button
              onClick={() => setActiveView("view-products")}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "12px",
                background: "transparent",
                border: "2px solid #fff",
                borderRadius: "10px",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <i
                className="fas fa-arrow-left"
                style={{ marginRight: "8px" }}
              ></i>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
