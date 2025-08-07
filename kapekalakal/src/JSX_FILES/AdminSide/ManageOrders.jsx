import { useEffect, useState } from "react";
import { FaEdit, FaArchive } from "react-icons/fa";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    customerName: "",
    product: "",
    quantity: "",
    totalPrice: "",
    status: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5174/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "totalPrice" ? Number(value) : value,
    }));
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5174/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        fetchOrders();
        closeModal();
      }
    } catch (err) {
      console.error("Failed to add order", err);
    }
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5174/api/orders/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        fetchOrders();
        closeModal();
      }
    } catch (err) {
      console.error("Failed to update order", err);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      const res = await fetch(`http://localhost:5174/api/orders/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error("Failed to delete order", err);
    }
  };

  const handleEditOrder = (order) => {
    setEditingId(order._id);
    setForm(order);
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      customerName: "",
      product: "",
      quantity: "",
      totalPrice: "",
      status: "Pending",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setShowModal(false);
    setForm({
      customerName: "",
      product: "",
      quantity: "",
      totalPrice: "",
      status: "Pending",
    });
  };

  return (
    <div className="manage-orders-container bg-amber-50 p-3 rounded my-5">
      <h2 className="mb-4">MANAGE ORDERS</h2>
      <button
        onClick={openAddModal}
        className="bg-amber-950 text-white px-4 py-2 mb-3 rounded hover:bg-amber-800 transition"
      >
        Add Order
      </button>
      <table className="min-w-full bg-white border rounded overflow-hidden">
        <thead className="bg-amber-800 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b">
              <td className="px-4 py-2">{order.customerName}</td>
              <td className="px-4 py-2">{order.product}</td>
              <td className="px-4 py-2">{order.quantity}</td>
              <td className="px-4 py-2">{order.totalPrice}</td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2 d-flex gap-2">
                <button
                  onClick={() => handleEditOrder(order)}
                  className="text-amber-50 hover:text-amber-500"
                  title="Edit"
                >
                  <FaEdit size={23} />
                </button>
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="text-amber-50 hover:text-amber-500"
                  title="Delete"
                >
                  <FaArchive size={23} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-[#4B2E05]/70 flex items-center justify-center z-50">
          <div className="bg-[#F5E9DA] rounded-2xl shadow-2xl w-50 max-w-md relative border border-[#D7B899]">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#8B5C2A] text-2xl font-bold hover:text-[#4B2E05]"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-center mt-6 mb-4 text-[#4B2E05]">
              {editingId ? "Edit Order" : "Add Order"}
            </h3>
            <form
              onSubmit={editingId ? handleUpdateOrder : handleAddOrder}
              className="flex flex-col gap-4 p-5"
            >
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Customer Name"
                required
                className="border border-[#D7B899 center  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
              <input
                name="product"
                value={form.product}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="border border-[#D7B899 center  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                required
                className="border border-[#D7B899 center  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
              <input
                type="number"
                name="totalPrice"
                value={form.totalPrice}
                onChange={handleChange}
                placeholder="Total Price"
                required
                className="border border-[#D7B899 center  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border border-[#D7B899 center  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-[#8B5C2A] text-white px-5 py-2 rounded hover:bg-[#4B2E05]"
                >
                  {editingId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  className="bg-[#E9D6C0] text-[#4B2E05] px-5 py-2 rounded hover:bg-[#D7B899] transition font-semibold shadow"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageOrders;
