import React, { useState, useEffect } from "react";
import { FaClipboardCheck } from "react-icons/fa";
import { useClientView } from "./ClientViewContext";

function MyPayments() {
  const { setActiveView } = useClientView();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  // Tax and shipping constants (same as cart)
  const taxRate = 0.08;
  const shippingFee = 5.99;

  const paymentOptions = [
    { id: "cod", name: "CASH ON DELIVERY", logo: "./logos/COD.png" },
    { id: "paypal", name: "PAYPAL", logo: "./logos/PAYPAL.png" },
  ];

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
    } catch (error) {
      console.error("Error fetching cart items:", error);
      alert("Failed to load cart items. Redirecting to cart...");
      setActiveView("cart");
    } finally {
      setLoading(false);
    }
  };

  // Load cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingFee;

  // Generate order ID
  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;
  };

  // Save order to database
  const saveOrderToDatabase = async (orderData) => {
    try {
      const response = await fetch("http://localhost:5174/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const savedOrder = await response.json();
      return savedOrder;
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    }
  };

  // Clear cart after successful order
  const clearCart = async () => {
    try {
      const response = await fetch("http://localhost:5174/api/cart", {
        method: "DELETE",
      });

      if (!response.ok) {
        console.warn("Failed to clear cart, but order was successful");
      }
    } catch (error) {
      console.warn("Error clearing cart:", error);
    }
  };

  // Handle payment confirmation
  const handleConfirmPayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }

    if (
      selectedMethod !== "cod" &&
      (!accountName.trim() || !accountNumber.trim())
    ) {
      alert("Please enter account name and number for this payment method");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setProcessingPayment(true);

    try {
      // Create order object with all necessary details
      const orderId = generateOrderId();
      const orderData = {
        orderId: orderId,
        items: cartItems.map((item) => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        paymentMethod: selectedMethod,
        paymentDetails: {
          method: paymentOptions.find((p) => p.id === selectedMethod)?.name,
          accountName: selectedMethod !== "cod" ? accountName : null,
          accountNumber: selectedMethod !== "cod" ? accountNumber : null,
        },
        pricing: {
          subtotal: subtotal,
          tax: tax,
          taxRate: taxRate,
          shippingFee: shippingFee,
          total: total,
        },
        status: selectedMethod === "cod" ? "pending" : "awaiting_payment",
        orderDate: new Date().toISOString(),
        customerInfo: {
          // You might want to add customer info here if available
          // email, name, address, etc.
        },
      };

      // Save order to database
      const savedOrder = await saveOrderToDatabase(orderData);

      // Show success message with order ID
      alert(
        `Payment confirmed!\n` +
          `Order ID: ${orderId}\n` +
          `Total: ₱${total.toFixed(2)}\n` +
          `Payment Method: ${orderData.paymentDetails.method}\n\n` +
          `${
            selectedMethod === "cod"
              ? "Please prepare exact change upon delivery."
              : "Please complete your payment to process the order."
          }`
      );

      // Clear the cart after successful payment
      await clearCart();

      // Redirect to success page or back to products
      setActiveView("view-products");
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message}\nPlease try again.`);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", color: "#8b4513" }}>
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p style={{ color: "#3c2415", marginTop: "20px" }}>
          Loading payment information...
        </p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", color: "#8b4513" }}>
          <i className="fas fa-shopping-cart"></i>
        </div>
        <h3 style={{ color: "#3c2415" }}>No items to checkout</h3>
        <p style={{ color: "#5d4037" }}>Your cart is empty.</p>
        <button
          onClick={() => setActiveView("view-products")}
          style={{
            background: "#8b4513",
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
    );
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        backgroundColor: "#d7ccc8",
        borderRadius: "12px",
        fontFamily: "'Poppins', sans-serif",
        flexWrap: "wrap",
      }}
    >
      {/* Payment Method Section */}
      <div
        style={{
          flex: 1,
          minWidth: "300px",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => setActiveView("cart")}
            style={{
              background: "transparent",
              border: "none",
              color: "#3c2415",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h3
            style={{
              color: "#3c2415",
              margin: 0,
              borderBottom: "2px solid #5d4037",
              paddingBottom: "10px",
              flex: 1,
            }}
          >
            PAYMENT METHOD
          </h3>
        </div>

        {/* Payment Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {paymentOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelectedMethod(option.id)}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor:
                  selectedMethod === option.id ? "#e0d4c4" : "#f5f5f5",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow:
                  selectedMethod === option.id
                    ? "0 4px 8px rgba(0,0,0,0.2)"
                    : "0 2px 4px rgba(0,0,0,0.1)",
                transform:
                  selectedMethod === option.id ? "scale(1.02)" : "scale(1)",
                transition: "all 0.3s ease",
                border:
                  selectedMethod === option.id
                    ? "2px solid #3c2415"
                    : "2px solid transparent",
              }}
            >
              <img
                src={option.logo}
                alt={option.name}
                style={{ width: "50px", marginRight: "15px" }}
              />
              <p style={{ fontWeight: "bold", color: "#3c2415", margin: 0 }}>
                {option.name}
              </p>
            </div>
          ))}

          {/* Account Inputs - Only show for non-COD payments */}
          {selectedMethod && selectedMethod !== "cod" && (
            <div
              style={{
                marginTop: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <input
                type="text"
                placeholder="ENTER ACC NAME:"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                style={{
                  width: "95%",
                  padding: "10px",
                  border: "1px solid #5d4037",
                  borderRadius: "6px",
                  outline: "none",
                  transition: "0.3s",
                }}
                onFocus={(e) => (e.target.style.border = "2px solid #3c2415")}
                onBlur={(e) => (e.target.style.border = "1px solid #5d4037")}
              />
              <input
                type="text"
                placeholder="ENTER ACC NUMBER:"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                style={{
                  width: "95%",
                  padding: "10px",
                  border: "1px solid #5d4037",
                  borderRadius: "6px",
                  outline: "none",
                  transition: "0.3s",
                }}
                onFocus={(e) => (e.target.style.border = "2px solid #3c2415")}
                onBlur={(e) => (e.target.style.border = "1px solid #5d4037")}
              />
            </div>
          )}

          {/* Confirm Payment */}
          <button
            onClick={handleConfirmPayment}
            disabled={!selectedMethod || processingPayment}
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                selectedMethod && !processingPayment ? "#3c2415" : "#ccc",
              color: "#fff",
              padding: "12px",
              borderRadius: "8px",
              cursor:
                selectedMethod && !processingPayment
                  ? "pointer"
                  : "not-allowed",
              fontWeight: "bold",
              border: "none",
              transition: "all 0.2s ease",
            }}
          >
            {processingPayment ? (
              <>
                <i
                  className="fas fa-spinner fa-spin"
                  style={{ marginRight: "8px" }}
                ></i>
                PROCESSING...
              </>
            ) : (
              <>
                <FaClipboardCheck style={{ marginRight: "8px" }} />
                CONFIRM PAYMENT (₱{total.toFixed(2)})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Receipt Section */}
      <div
        style={{
          flex: 1,
          minWidth: "300px",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/LOGO.svg" alt="Logo" style={{ width: "50px" }} />
          <h4 style={{ color: "#3c2415", fontWeight: "bold", margin: 0 }}>
            KAPE KALAKAL
          </h4>
        </div>

        <h5 style={{ textAlign: "center", margin: "10px 0", color: "#5d4037" }}>
          -------------------------------
        </h5>
        <h6 style={{ textAlign: "center", color: "#3c2415", margin: "5px 0" }}>
          OFFICIAL RECEIPT
        </h6>
        <p
          style={{
            textAlign: "center",
            color: "#5d4037",
            fontSize: "12px",
            margin: "5px 0",
          }}
        >
          {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
        </p>
        <h5 style={{ textAlign: "center", margin: "10px 0", color: "#5d4037" }}>
          -------------------------------
        </h5>

        {/* Orders Table */}
        <div
          style={{ overflowX: "auto", maxHeight: "300px", overflowY: "auto" }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              marginTop: "10px",
              fontSize: "12px",
            }}
          >
            <thead
              style={{ position: "sticky", top: 0, backgroundColor: "#f5f5f5" }}
            >
              <tr>
                <th
                  style={{
                    padding: "8px 4px",
                    color: "#3c2415",
                    fontSize: "11px",
                  }}
                >
                  PRODUCT
                </th>
                <th
                  style={{
                    padding: "8px 4px",
                    color: "#3c2415",
                    fontSize: "11px",
                  }}
                >
                  QTY
                </th>
                <th
                  style={{
                    padding: "8px 4px",
                    color: "#3c2415",
                    fontSize: "11px",
                  }}
                >
                  PRICE
                </th>
                <th
                  style={{
                    padding: "8px 4px",
                    color: "#3c2415",
                    fontSize: "11px",
                  }}
                >
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={item._id || index}>
                  <td
                    style={{
                      padding: "8px 4px",
                      borderBottom: "1px solid #ddd",
                      fontSize: "11px",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.name}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
                      borderBottom: "1px solid #ddd",
                      textAlign: "center",
                      fontSize: "11px",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
                      borderBottom: "1px solid #ddd",
                      fontSize: "11px",
                    }}
                  >
                    ₱{item.price.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
                      borderBottom: "1px solid #ddd",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div
          style={{
            marginTop: "20px",
            borderTop: "2px solid #5d4037",
            paddingTop: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "5px 0",
            }}
          >
            <span style={{ fontSize: "12px", color: "#3c2415" }}>
              Subtotal:
            </span>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>
              ₱{subtotal.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "5px 0",
            }}
          >
            <span style={{ fontSize: "12px", color: "#3c2415" }}>
              Tax (8%):
            </span>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>
              ₱{tax.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "5px 0",
            }}
          >
            <span style={{ fontSize: "12px", color: "#3c2415" }}>
              Shipping:
            </span>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>
              ₱{shippingFee.toFixed(2)}
            </span>
          </div>
          <hr style={{ margin: "10px 0", borderColor: "#5d4037" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "10px 0",
            }}
          >
            <strong style={{ fontSize: "14px", color: "#3c2415" }}>
              TOTAL:
            </strong>
            <strong style={{ fontSize: "14px", color: "#d4af37" }}>
              ₱{total.toFixed(2)}
            </strong>
          </div>

          {selectedMethod && (
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
              }}
            >
              <p style={{ margin: 0, fontSize: "12px", color: "#3c2415" }}>
                <strong>Payment Method:</strong>{" "}
                {paymentOptions.find((p) => p.id === selectedMethod)?.name}
              </p>
              {selectedMethod !== "cod" && accountName && (
                <p
                  style={{
                    margin: "5px 0 0 0",
                    fontSize: "12px",
                    color: "#3c2415",
                  }}
                >
                  <strong>Account:</strong> {accountName}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPayments;
