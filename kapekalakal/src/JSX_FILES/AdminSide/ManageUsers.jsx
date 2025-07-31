import { FaEdit } from "react-icons/fa";
import { FaArchive } from "react-icons/fa";
import AdminNavBar from "./AdminNavBar";
import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
function ManageUser() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await fetch("http://localhost:5174/api/users"); // update port if needed
				const data = await res.json();
				setUsers(data);
			} catch (err) {
				console.error("Failed to fetch users", err);
			}
		};
		fetchUsers();
	}, []);

	return (
		<div className="manage -users-container bg-amber-50 px-5 rounded">
			<h2 className="p-2">MANAGE USERS</h2>
			<div className="d-flex gap-2 align-items-center pb-3 ">
				<IoIosAddCircle size={30} />
				ADD USERS
			</div>

			<table className=" user-table">
				<thead>
					<tr>
						<th className="px-4">Name</th>
						<th className="px-4">Email</th>
						<th className="px-4">Role</th>
						<th className="px-4">Address</th>
						<th className="px-4">Action</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user._id}>
							<td className="px-4">{user.name}</td>
							<td className="px-4">{user.email}</td>
							<td className="px-4">{user.role}</td>
							<td className="px-4">{user.address}</td>
							<td className="px-4 d-flex gap-2">
								<FaEdit size={30} />
								<FaArchive size={30} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default ManageUser;
