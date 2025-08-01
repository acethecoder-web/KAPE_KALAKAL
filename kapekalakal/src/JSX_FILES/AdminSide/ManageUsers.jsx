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
				setForm({ name: "", email: "", role: "", address: "" });
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
				setForm({ name: "", email: "", role: "", address: "" });
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
		setForm({ name: "", email: "", role: "", address: "" });
		setShowModal(true);
	};

	const closeModal = () => {
		setEditingId(null);
		setShowModal(false);
		setForm({ name: "", email: "", role: "", address: "" });
	};

	return (
		<div className="manage -users-container bg-amber-50 px-5 rounded">
			<h2 className="p-2">MANAGE USERS</h2>
			<div className="d-flex gap-2 align-items-center pb-3 ">
				<button
					className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition"
					onClick={openAddModal}>
					<IoIosAddCircle size={24} />
					Add User
				</button>
			</div>

			<table className="min-w-full bg-white border rounded overflow-hidden">
				<thead className="bg-stone-200">
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
							<td className="px-4 py-2 flex gap-2">
								<button
									className="text-blue-600 hover:text-blue-800"
									onClick={() => handleEditUser(user)}
									title="Edit">
									<FaEdit size={22} />
								</button>
								<button
									className="text-red-600 hover:text-red-800"
									onClick={() => handleDeleteUser(user._id)}
									title="Delete">
									<FaArchive size={22} />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
						<button
							className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
							onClick={closeModal}>
							&times;
						</button>
						<h3 className="text-xl font-semibold mb-4">
							{editingId ? "Edit User" : "Add User"}
						</h3>
						<form
							onSubmit={editingId ? handleUpdateUser : handleAddUser}
							className="flex flex-col gap-3">
							<input
								name="name"
								value={form.name}
								onChange={handleChange}
								placeholder="Name"
								required
								className="border px-3 py-2 rounded"
							/>
							<input
								name="email"
								value={form.email}
								onChange={handleChange}
								placeholder="Email"
								required
								className="border px-3 py-2 rounded"
							/>
							<input
								name="role"
								value={form.role}
								onChange={handleChange}
								placeholder="Role"
								required
								className="border px-3 py-2 rounded"
							/>
							<input
								name="address"
								value={form.address}
								onChange={handleChange}
								placeholder="Address"
								required
								className="border px-3 py-2 rounded"
							/>
							<div className="flex gap-2 mt-2">
								<button
									type="submit"
									className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition">
									{editingId ? "Update" : "Add"}
								</button>
								<button
									type="button"
									className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
									onClick={closeModal}>
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
