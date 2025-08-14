import { FaEdit } from "react-icons/fa";
import { FaArchive } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    image: "",
    name: "",
    email: "",
    role: "",
    address: "",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5174/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";
      if (selectedFile) {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", "kapekalakal");
        data.append("cloud_name", "dm2eo9umm");
        data.append("folder", "users_images");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dm2eo9umm/image/upload",
          { method: "POST", body: data }
        );
        const uploadRes = await res.json();
        imageUrl = uploadRes.url;
      }

      const res = await fetch("http://localhost:5174/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imageUrl }),
      });

      if (res.ok) {
        setForm({
          image: "",
          name: "",
          email: "",
          role: "",
          address: "",
          password: "",
        });
        setSelectedFile(null);
        setShowModal(false);
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to add user", err);
    }
  };

  const handleEditUser = (user) => {
    setEditingId(user._id);
    setForm({
      image: user.image || "",
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      address: user.address || "",
      password: user.password || "",
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = form.image;

      if (selectedFile) {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", "kapekalakal");
        data.append("cloud_name", "dm2eo9umm");
        data.append("folder", "users_images");

        const resUpload = await fetch(
          "https://api.cloudinary.com/v1_1/dm2eo9umm/image/upload",
          { method: "POST", body: data }
        );
        const uploadRes = await resUpload.json();
        imageUrl = uploadRes.url;
      }

      const res = await fetch(`http://localhost:5174/api/users/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imageUrl }),
      });

      if (res.ok) {
        setEditingId(null);
        setForm({
          image: "",
          name: "",
          email: "",
          role: "",
          address: "",
          password: "",
        });
        setSelectedFile(null);
        setShowModal(false);
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5174/api/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      image: "",
      name: "",
      email: "",
      role: "",
      address: "",
      password: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setShowModal(false);
    setForm({
      image: "",
      name: "",
      email: "",
      role: "",
      address: "",
      password: "",
    });
  };

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="manage-users-container bg-amber-50 p-3 rounded my-5">
      <h2 className="">MANAGE USERS</h2>
      <div className="d-flex gap-2 align-items-center">
        <button
          className="flex items-center gap-2 text-white px-4 py-2 mb-3 rounded hover:bg-amber-800 transition"
          onClick={openAddModal}
        >
          <IoIosAddCircle size={24} />
          Add User
        </button>
      </div>
      <table className="min-w-full bg-white border rounded overflow-hidden">
        <thead className="bg-amber-800 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Picture</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Address</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="px-4 py-2">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2">{user.address}</td>
              <td className="px-4 py-2 d-flex gap-2">
                <button
                  className="text-amber-50 hover:txt-amber-500"
                  onClick={() => handleEditUser(user)}
                  title="Edit"
                >
                  <FaEdit size={22} />
                </button>
                <button
                  className="text-amber-50 hover:txt-amber-500"
                  onClick={() => handleDeleteUser(user._id)}
                  title="Delete"
                >
                  <FaArchive size={22} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 bg-amber-800 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === num + 1
                ? "bg-amber-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {num + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 bg-amber-800 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#4B2E05]/70 flex items-center justify-center z-50">
          <div className="bg-[#F5E9DA] rounded-2xl shadow-2xl w-50 max-w-md relative border border-[#D7B899]">
            <button
              className="absolute top-4 right-4 text-[#8B5C2A] hover:text-[#4B2E05] text-2xl font-bold"
              onClick={closeModal}
              title="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-6 text-[#4B2E05] tracking-wide text-center">
              {editingId ? "Edit User" : "Add User"}
            </h3>
            <form
              onSubmit={editingId ? handleUpdateUser : handleAddUser}
              className="flex flex-col gap-4 m-3"
            >
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
                className="border border-[#D7B899] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="border border-[#D7B899] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
              <div className="d-flex gap-2 align-items-center">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="form-select w-auto"
                >
                  <option value="">Select role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="file"
                  className="form-control w-20"
                  onChange={handleUpload}
                />
              </div>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                required
                className="border border-[#D7B899] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                type="password"
                className="border border-[#D7B899] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
              <div className="flex gap-5 mt-2 justify-center mb-4">
                <button
                  type="submit"
                  className="bg-[#8B5C2A] text-[#F5E9DA] px-5 py-2 rounded hover:bg-[#4B2E05] transition font-semibold shadow"
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

export default ManageUsers;
