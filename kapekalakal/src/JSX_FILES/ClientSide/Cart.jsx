import React, { useState } from "react";
import { useClientView } from "./ClientViewContext";

function CartPage() {
  const { setActiveView } = useClientView();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Premium Arabica Coffee",
      description: "Rich, smooth blend with chocolate notes",
      price: 12.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop",
      size: "Medium",
      roast: "Dark",
    },
    {
      id: 2,
      name: "Espresso Blend",
      description: "Intense flavor with caramel undertones",
      price: 18.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop",
      size: "Large",
      roast: "Medium",
    },
  ]);

  const taxRate = 0.08;
  const shippingFee = 5.99;

  const updateQuantity = (itemId, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
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

  return (
    <div style={{ padding: "2px 2px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <h1
        style={{
          textAlign: "center",
          fontSize: "30px",
          fontWeight: "700",
          color: colors.dark,
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        <i className="fas fa-shopping-cart" style={{ marginRight: "10px" }}></i>
        Shopping Cart
      </h1>

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
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
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
                    src={item.image}
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
                  <h4 style={{ margin: "0", color: colors.dark }}>
                    {item.name}
                  </h4>
                  <p style={{ margin: "5px 0", color: colors.medium }}>
                    {item.description}
                  </p>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: colors.light,
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="" style={{ fontSize: "40px" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: colors.light,
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      margin: "0",
                      fontWeight: "700",
                      color: colors.dark,
                    }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "red",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
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
            Cart Total
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontSize: "25px" }}>Subtotal:</span>
            <span
              style={{
                fontSize: "25px",
                fontWeight: "700",
                color: colors.gold,
              }}
            >
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontSize: "25px" }}>Tax:</span>
            <span
              style={{
                fontSize: "25px",
                fontWeight: "700",
                color: colors.gold,
              }}
            >
              ${tax.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontSize: "25px" }}>Shipping:</span>
            <span
              style={{
                fontSize: "25px",
                fontWeight: "700",
                color: colors.gold,
              }}
            >
              ${shippingFee.toFixed(2)}
            </span>
          </div>
          <hr style={{ borderColor: "#fff" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1.1rem",
            }}
          >
            <strong>Total:</strong>
            <strong style={{ color: colors.gold }}>${total.toFixed(2)}</strong>
          </div>

          <button
            onClick={() => setActiveView("my-payments")}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "12px",
              background: colors.gold,
              border: "none",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            <i
              className="fas fa-credit-card"
              style={{ marginRight: "8px" }}
            ></i>
            Proceed to Checkout
          </button>
          <button
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "10px",
              background: "transparent",
              border: "2px solid #fff",
              borderRadius: "10px",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: "8px" }}></i>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
