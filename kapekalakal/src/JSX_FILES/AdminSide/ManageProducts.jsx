import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit, FaArchive } from "react-icons/fa";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    image: "",
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file upload selection
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  };

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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  // Add product (CREATE)
  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      // Upload image if selected
      if (selectedFile) {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", "kapekalakal");
        data.append("cloud_name", "dm2eo9umm");
        data.append("folder", "products_images");

        const resUpload = await fetch(
          "https://api.cloudinary.com/v1_1/dm2eo9umm/image/upload",
          { method: "POST", body: data }
        );
        const uploadRes = await resUpload.json();
        imageUrl = uploadRes.url;
      }

      const res = await fetch("http://localhost:5174/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imageUrl }),
      });

      if (res.ok) {
        resetForm();
        fetchProducts();
        setShowModal(false);
      }
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  // Edit product (open modal with data)
  const handleEditProduct = (product) => {
    setEditingId(product._id);
    setForm({
      image: product.image || "",
      name: product.name || "",
      category: product.category || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  // Update product (UPDATE)
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = form.image;

      if (selectedFile) {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", "kapekalakal");
        data.append("cloud_name", "dm2eo9umm");
        data.append("folder", "products_images");

        const resUpload = await fetch(
          "https://api.cloudinary.com/v1_1/dm2eo9umm/image/upload",
          { method: "POST", body: data }
        );
        const uploadRes = await resUpload.json();
        imageUrl = uploadRes.url;
      }

      const res = await fetch(
        `http://localhost:5174/api/products/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, image: imageUrl }),
        }
      );

      if (res.ok) {
        resetForm();
        fetchProducts();
        setShowModal(false);
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

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      image: "",
      name: "",
      category: "",
      description: "",
      price: "",
      stock: "",
    });
    setSelectedFile(null);
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
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b">
              <td className="px-4 py-2">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">{product.category}</td>
              <td className="px-4 py-2 truncate-text">{product.description}</td>
              <td className="px-4 py-2">{product.price}</td>
              <td className="px-4 py-2">{product.stock}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  title="Edit"
                  className="text-amber-50"
                >
                  <FaEdit size={22} />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  title="Delete"
                  className="text-amber-50"
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
          <div className="bg-[#F5E9DA] rounded-2xl shadow-2xl w-[700px] max-w-3xl relative border border-[#D7B899]">
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
              className="grid grid-cols-2 gap-4 p-5"
            >
              {/* Left column */}
              <div className="flex flex-col gap-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  required
                  className="border border-[#D7B899 center  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
                />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="border show border-[#D7B899 center rounded-lg  bg-white"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="coffee">Coffee</option>
                  <option value="brewing gear">Brewing Gear</option>
                  <option value="accessories">Accessories</option>
                </select>

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

                <input
                  type="file"
                  onChange={handleUpload}
                  className="border border-[#D7B899 center  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] p-2 bg-white"
                />
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-4">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  required
                  rows={10}
                  className="border border-[#D7B899 center  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
                />
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex justify-center gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-[#8B5C2A] text-white px-5 py-2 rounded hover:bg-[#4B2E05]"
                >
                  {editingId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-[#E9D6C0] text-[#4B2E05] px-5 py-2 rounded hover:bg-[#D7B899]"
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
