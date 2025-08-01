import { FaEdit } from "react-icons/fa";
import { FaArchive } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    address: "",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch users (READ)
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
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5174/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create user (CREATE)
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5174/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: "", email: "", role: "", address: "", password: "" });
        setShowModal(false);
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to add user", err);
    }
  };

  // Edit user (UPDATE)
  const handleEditUser = (user) => {
    setEditingId(user._id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      password: user.password,
    });
    setShowModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5174/api/users/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setEditingId(null);
        setForm({ name: "", email: "", role: "", address: "", password: "" });
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  // Delete user (DELETE)
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
    setForm({ name: "", email: "", role: "", address: "", password: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setShowModal(false);
    setForm({ name: "", email: "", role: "", address: "", password: "" });
  };

  return (
    <div className="manage-users-container bg-amber-50 p-3 rounded my-5">
      <h2 className="">MANAGE USERS</h2>
      <div className="d-flex gap-2 align-items-center  ">
        <button
          className="flex items-center gap-2 bg-amber-950 text-white px-4 py-2 mb-3 rounded hover:bg-amber-800 transition"
          onClick={openAddModal}
        >
          <IoIosAddCircle size={24} />
          Add User
        </button>
      </div>
      <table className="min-w-full bg-white border rounded overflow-hidden ">
        <thead className="bg-amber-800 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Address</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2">{user.address}</td>
              <td className="px-4 py-2 d-flex gap-2">
                <button
                  className="text-amber-950 hover:txt-amber-500"
                  onClick={() => handleEditUser(user)}
                  title="Edit"
                >
                  <FaEdit size={22} />
                </button>
                <button
                  className="text-amber-950 hover:txt-amber-500"
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

      {showModal && (
        <div className="fixed inset-0 bg-[#4B2E05]/70 flex items-center justify-center z-50">
          <div className="bg-[#F5E9DA]  rounded-2xl shadow-2xl  w-50 max-w-md relative border border-[#D7B899]">
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
              className="flex flex-col gap-4 m-3 "
            >
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
                className="border border-[#D7B899 center  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="border border-[#D7B899 center rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />

              <select
                style={{ display: "inline-block" }}
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="border border-[#D7B899] w-50 h-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              >
                <option value="">Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                required
                className="border border-[#D7B899] center rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                type="password"
                className="border border-[#D7B899] center rounded- focus:outline-none focus:ring-2 focus:ring-[#8B5C2A] bg-white"
              />
              <div className="flex gap-5 mt-2 justify-center mb-4 ">
                <button
                  type="submit"
                  className="bg-[#8B5C2A] text-[#F5E9DA] px-5 py-2  rounded hover:bg-[#4B2E05] transition font-semibold shadow"
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
