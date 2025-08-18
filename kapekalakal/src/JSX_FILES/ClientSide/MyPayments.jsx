import React, { useState, useEffect } from "react";
import { FaClipboardCheck } from "react-icons/fa";
import { useClientView } from "./ClientViewContext";
import { useCart } from "./cartcontext";
import { PayPalButtons } from "@paypal/react-paypal-js";

function MyPayments() {
  const { setActiveView } = useClientView();
  const { updateCartCount } = useCart();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [user, setUser] = useState(null);
  // Tax and shipping constants (same as cart)
  const taxRate = 0.08;
  const shippingFee = 5.99;

  const paymentOptions = [
    { id: "cod", name: "CASH ON DELIVERY", logo: "./logos/COD.png" },
    { id: "paypal", name: "PAYPAL", logo: "./logos/PAYPAL.png" },
  ];

  // Get PayPal client ID from environment variables with better error handling
  const getPayPalClientId = () => {
    try {
      const clientId = import.meta.env?.VITE_PAYPAL_CLIENT_ID;
      if (!clientId) {
        console.warn(
          "PayPal Client ID not found in environment variables. Using sandbox ID."
        );
        return "sb"; // PayPal sandbox default
      }
      return clientId;
    } catch (error) {
      console.error("Error accessing environment variables:", error);
      return "sb"; // Fallback to sandbox
    }
  };

  const clientId = getPayPalClientId();

  // Get current user (same logic as CartPage)
  useEffect(() => {
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

    setUser(getCurrentUser());
  }, []);

  // Fetch cart items from database for specific user
  const fetchCartItems = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5174/api/cart?userId=${user.id}`
      );

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

  // Load cart items when user is available
  useEffect(() => {
    if (user?.id) {
      fetchCartItems();
    }
  }, [user?.id]);

  useEffect(() => {
    // Clean up direct checkout session data when payments page loads
    const directCheckoutData = sessionStorage.getItem("directCheckout");
    if (directCheckoutData) {
      console.log("Direct checkout detected:", JSON.parse(directCheckoutData));
      // You can use this data for additional processing if needed
    }

    // Optional: Clean up the session storage after use
    return () => {
      sessionStorage.removeItem("directCheckout");
    };
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

  // Clear cart after successful order (user-specific)
  const clearCart = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `http://localhost:5174/api/cart?userId=${user.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        updateCartCount(); // Update cart count in context
      } else {
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
      selectedMethod !== "paypal" &&
      (!accountName.trim() || !accountNumber.trim())
    ) {
      alert("Please enter account name and number for this payment method");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!user?.id) {
      alert("User session expired. Please refresh and try again.");
      return;
    }

    // For PayPal, don't process here - let PayPal buttons handle it
    if (selectedMethod === "paypal") {
      alert("Please use the PayPal button below to complete your payment");
      return;
    }

    setProcessingPayment(true);

    try {
      // Simulate payment processing delay (1-3 seconds)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 2000 + 1000)
      );

      // Create order object with all necessary details
      const orderId = generateOrderId();
      const orderData = {
        orderId: orderId,
        userId: user.id, // Include user ID for the order
        items: cartItems.map((item) => ({
          productId: item.productId || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
          image: item.image,
          category: item.category,
        })),
        paymentMethod: selectedMethod,
        paymentDetails: {
          method: paymentOptions.find((p) => p.id === selectedMethod)?.name,
          accountName: selectedMethod !== "cod" ? accountName : null,
          accountNumber: selectedMethod !== "cod" ? accountNumber : null,
        },
        pricing: {
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          taxRate: taxRate,
          shippingFee: shippingFee,
          total: parseFloat(total.toFixed(2)),
        },
        status: "completed", // Since it's simulated, mark as completed
        paymentStatus: selectedMethod === "cod" ? "pending" : "paid",
        orderDate: new Date().toISOString(),
        customerInfo: {
          userId: user.id,
          userName: user.name || "Guest User",
          isGuest: user.isGuest || false,
        },
        deliveryInfo: {
          method: selectedMethod === "cod" ? "delivery" : "pickup",
          estimatedDate: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ).toISOString(), // 3 days from now
        },
      };

      // Save order to database
      console.log("Saving order:", orderData);
      const savedOrder = await saveOrderToDatabase(orderData);

      // Check if this was a direct checkout
      const directCheckoutData = sessionStorage.getItem("directCheckout");
      const isDirectCheckout = directCheckoutData && cartItems.length === 1;

      // Show success message with order ID
      alert(
        `🎉 Payment Successful!\n\n` +
          `Order ID: ${orderId}\n` +
          `Total: ₱${total.toFixed(2)}\n` +
          `Payment Method: ${orderData.paymentDetails.method}\n` +
          `Customer: ${user.name}\n` +
          `${
            isDirectCheckout ? "Items: 1 product (Direct Checkout)\n" : ""
          }\n` +
          `${
            selectedMethod === "cod"
              ? "📦 Your order will be delivered within 3-5 business days.\nPlease prepare exact change upon delivery."
              : "📦 Your order has been confirmed!\nYou will receive an email confirmation shortly."
          }`
      );

      // Clear the cart after successful payment
      await clearCart();

      // Redirect to success page or back to products
      setActiveView("view-products");
    } catch (error) {
      console.error("Payment error:", error);
      alert(`❌ Payment failed: ${error.message}\nPlease try again.`);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Show loading if no user yet
  if (!user) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", color: "#8b4513" }}>
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p style={{ color: "#3c2415", marginTop: "20px" }}>
          Loading user information...
        </p>
      </div>
    );
  }

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
        <p style={{ color: "#5d4037" }}>
          Your cart is empty. Add some products first!
        </p>
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

        {/* User Info Display */}
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#f5f3f0",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        >
          <p style={{ margin: 0, color: "#3c2415" }}>
            <i
              className={`fas ${user.isGuest ? "fa-user-clock" : "fa-user"}`}
              style={{ marginRight: "5px" }}
            ></i>
            <strong>Customer:</strong> {user.name}
          </p>
          <p
            style={{ margin: "5px 0 0 0", color: "#5d4037", fontSize: "11px" }}
          >
            {user.isGuest ? "Shopping as Guest" : "Registered User"}
          </p>
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

          {/* Account Inputs - Only show for non-COD and non-PayPal payments */}
          {selectedMethod &&
            selectedMethod !== "cod" &&
            selectedMethod !== "paypal" && (
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

          {/* PayPal Buttons - Show when PayPal is selected */}
          {selectedMethod === "paypal" && (
            <div style={{ marginTop: "20px" }}>
              {/* Add debugging info for development */}

              {clientId && clientId !== "sb" ? (
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: total.toFixed(2),
                            currency_code: "PHP", // Change to "USD" if needed
                          },
                          description: `Order by ${user.name}`,
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      const details = await actions.order.capture();
                      console.log("Payment successful:", details);

                      // Build order object
                      const paypalOrderId = generateOrderId();
                      const orderData = {
                        orderId: paypalOrderId,
                        userId: user.id,
                        items: cartItems.map((item) => ({
                          productId: item.productId || item._id,
                          name: item.name,
                          price: item.price,
                          quantity: item.quantity,
                          total: item.price * item.quantity,
                          image: item.image,
                          category: item.category,
                        })),
                        paymentMethod: "paypal",
                        paymentDetails: {
                          method: "PAYPAL",
                          transactionId: details.id,
                          payerEmail: details.payer?.email_address,
                          paymentStatus: details.status,
                          captureDetails: details,
                        },
                        pricing: {
                          subtotal: parseFloat(subtotal.toFixed(2)),
                          tax: parseFloat(tax.toFixed(2)),
                          taxRate: taxRate,
                          shippingFee: shippingFee,
                          total: parseFloat(total.toFixed(2)),
                        },
                        status: "completed",
                        paymentStatus: "paid",
                        orderDate: new Date().toISOString(),
                        customerInfo: {
                          userId: user.id,
                          userName: user.name || "Guest User",
                          isGuest: user.isGuest || false,
                        },
                        deliveryInfo: {
                          method: "pickup",
                          estimatedDate: new Date(
                            Date.now() + 3 * 24 * 60 * 60 * 1000
                          ).toISOString(),
                        },
                      };

                      await saveOrderToDatabase(orderData);
                      await clearCart();

                      // Check if this was a direct checkout for PayPal too
                      const directCheckoutData =
                        sessionStorage.getItem("directCheckout");
                      const isDirectCheckout =
                        directCheckoutData && cartItems.length === 1;

                      alert(
                        `🎉 PayPal Payment Successful!\n\n` +
                          `Order ID: ${paypalOrderId}\n` +
                          `Transaction ID: ${details.id}\n` +
                          `Total: ₱${total.toFixed(2)}\n` +
                          `Customer: ${user.name}\n` +
                          `${
                            isDirectCheckout
                              ? "Items: 1 product (Direct Checkout)\n"
                              : ""
                          }\n` +
                          `📦 Your order has been confirmed!\nYou will receive an email confirmation shortly.`
                      );

                      setActiveView("view-products");
                    } catch (error) {
                      console.error("Error processing PayPal payment:", error);
                      alert("❌ Error processing payment. Please try again.");
                    }
                  }}
                  onError={(err) => {
                    console.error("PayPal Checkout error", err);
                    alert(
                      "❌ PayPal payment could not be completed. Please try again or select a different payment method."
                    );
                  }}
                  onCancel={(data) => {
                    console.log("PayPal payment cancelled", data);
                    // Don't show alert for cancellation, user chose to cancel
                  }}
                />
              ) : (
                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffeaa7",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: 0, color: "#856404" }}>
                    <i
                      className="fas fa-exclamation-triangle"
                      style={{ marginRight: "8px" }}
                    ></i>
                    PayPal is not configured. Please set up your
                    VITE_PAYPAL_CLIENT_ID environment variable.
                  </p>
                  <p
                    style={{
                      margin: "8px 0 0 0",
                      fontSize: "12px",
                      color: "#6c5ce7",
                    }}
                  >
                    For testing, you can use PayPal Sandbox credentials.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Confirm Payment Button - Hide for PayPal since it has its own buttons */}
          {selectedMethod !== "paypal" && (
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
                  PROCESSING PAYMENT...
                </>
              ) : (
                <>
                  <FaClipboardCheck style={{ marginRight: "8px" }} />
                  CONFIRM PAYMENT (₱{total.toFixed(2)})
                </>
              )}
            </button>
          )}
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

        {/* Customer Info */}
        <p
          style={{
            textAlign: "center",
            color: "#3c2415",
            fontSize: "11px",
            margin: "5px 0",
            fontWeight: "bold",
          }}
        >
          Customer: {user.name}
          {user.isGuest && " (Guest)"}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "10px 0",
              borderTop: "1px solid #ddd",
              paddingTop: "8px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#3c2415",
              }}
            >
              TOTAL:
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#8b4513",
              }}
            >
              ₱{total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Status */}
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#f0f8ff",
            borderRadius: "6px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: "11px", color: "#3c2415" }}>
            <i
              className="fas fa-info-circle"
              style={{ marginRight: "5px" }}
            ></i>
            {selectedMethod === "cod"
              ? "Payment will be collected upon delivery"
              : selectedMethod === "paypal"
              ? "Complete payment using PayPal buttons above"
              : selectedMethod
              ? "Complete payment details above to proceed"
              : "Select a payment method to continue"}
          </p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p style={{ fontSize: "10px", color: "#888", margin: 0 }}>
            Thank you for choosing Kape Kalakal!
          </p>
        </div>
      </div>
    </div>
  );
}

export default MyPayments;
