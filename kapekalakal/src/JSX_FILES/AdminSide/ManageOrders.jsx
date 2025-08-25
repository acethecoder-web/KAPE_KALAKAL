import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [userName, setUserName] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Extract user name from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || "");
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5174/api/orders/all");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      const response = await fetch(
        `http://localhost:5174/api/orders/admin/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      await fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdating(null);
    }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#fdf6e3",
        fontFamily: "'Poppins', sans-serif",
        color: "#2c1810",
        minHeight: "100%",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#2c1810",
          fontSize: "62px",
        }}
      >
        Manage Orders
      </h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>No orders found.</p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <thead style={{ backgroundColor: "#7b2e00", color: "#fff" }}>
              <tr>
                <th style={{ padding: "12px" }}>Order ID</th>
                <th style={{ padding: "12px" }}>Items</th>
                <th style={{ padding: "12px" }}>Total</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr
                  key={order._id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    backgroundColor: "#fff",
                  }}
                >
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    {order.orderId}
                  </td>

                  <td style={{ padding: "12px" }}>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {order.items?.map((item, index) => (
                        <li key={index} style={{ marginBottom: "5px" }}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    ₱{order.pricing?.total?.toFixed(2) || "0.00"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontWeight: "bold",
                      color:
                        order.status === "Approved"
                          ? "green"
                          : order.status === "Cancelled"
                          ? "red"
                          : "#7b2e00",
                    }}
                  >
                    {order.status}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <button
                      onClick={() => updateStatus(order.orderId, "Approved")}
                      disabled={updating === order.orderId}
                      style={{
                        marginRight: "5px",
                        backgroundColor: "#4d3625",
                        color: "#fff",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(order.orderId, "Cancelled")}
                      disabled={updating === order.orderId}
                      style={{
                        marginRight: "5px",
                        backgroundColor: "#a83232",
                        color: "#fff",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => updateStatus(order.orderId, "Shipped")}
                      disabled={updating === order.orderId}
                      style={{
                        backgroundColor: "#7b2e00",
                        color: "#fff",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Ship
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{
                margin: "0 5px",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #7b2e00",
                backgroundColor: currentPage === 1 ? "#ccc" : "#fff",
                color: "#7b2e00",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                style={{
                  margin: "0 5px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #7b2e00",
                  backgroundColor:
                    currentPage === index + 1 ? "#7b2e00" : "#fff",
                  color: currentPage === index + 1 ? "#fff" : "#7b2e00",
                  cursor: "pointer",
                }}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{
                margin: "0 5px",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #7b2e00",
                backgroundColor: currentPage === totalPages ? "#ccc" : "#fff",
                color: "#7b2e00",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminOrderPage;
