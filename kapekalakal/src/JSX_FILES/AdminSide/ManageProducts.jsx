import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit, FaArchive } from "react-icons/fa";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all products (READ)
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5174/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  // Create product (CREATE)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5174/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        fetchProducts();
        closeModal();
      }
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  // Update product (UPDATE)
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5174/api/products/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (res.ok) {
        fetchProducts();
        closeModal();
      }
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  // Delete product (DELETE)
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5174/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const handleEditProduct = (product) => {
    setEditingId(product._id);
    setForm(product);
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({ name: "", category: "", price: "", stock: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setShowModal(false);
    setForm({ name: "", category: "", price: "", stock: "" });
  };

  return (
    <div className="manage-products-container bg-amber-50 p-3 rounded my-5">
      <h2 className="mb-4">MANAGE PRODUCTS</h2>
      <button
        onClick={openAddModal}
        className="flex items-center gap-2 bg-amber-950 text-white px-4 py-2 mb-3 rounded hover:bg-amber-800 transition"
      >
        <IoIosAddCircle size={24} />
        Add Product
      </button>
      <table className="min-w-full bg-white border rounded overflow-hidden">
        <thead className="bg-amber-800 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Stock</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b">
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">{product.category}</td>
              <td className="px-4 py-2">{product.price}</td>
              <td className="px-4 py-2">{product.stock}</td>
              <td className="px-4 py-2 d-flex gap-2">
                <button
                  className="text-amber-950 hover:txt-amber-500"
                  onClick={() => handleEditProduct(product)}
                  title="Edit"
                >
                  <FaEdit size={22} />
                </button>
                <button
                  className="text-amber-950 hover:txt-amber-500"
                  onClick={() => handleDeleteProduct(product._id)}
                  title="Delete"
                >
                  <FaArchive size={22} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
              {editingId ? "Edit Product" : "Add Product"}
            </h3>
            <form
              onSubmit={editingId ? handleUpdateProduct : handleAddProduct}
              className="flex flex-col gap-4 p-5"
            >
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="border border-[#D7B899 center  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                required
                className="border border-[#D7B899 center  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                required
                className="border border-[#D7B899 center  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                required
                className="border border-[#D7B899 center  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
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

export default ManageProducts;
