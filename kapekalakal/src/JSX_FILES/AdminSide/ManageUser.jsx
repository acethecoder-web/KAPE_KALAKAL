import { FaEdit } from "react-icons/fa";
import { FaArchive } from "react-icons/fa";
import { useState } from "react";
import AdminNavBar from "./AdminNavBar";

function ManageUser() {
	const [users, setUsers] = useState([
		{
			name: "Aces S. Hapiz",
			email: "aceshapiz6@gmail.com",
			role: "superadmin",
		},
	]);

	return (
		<>
			<div className="d-flex vh-100 bg-transparent justify-content-center align-items-center">
				<div className="w-50 bg-white rounded p-3">
					<button type="button" className="btn brown text-white">
						ADD USER
					</button>
					<table className="table">
						<thead>
							<tr>
								<th>ID</th>
								<th>USER NAME</th>
								<th>EMAIL</th>
								<th>ROLE</th>
								<th>ACTION</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => {
								return (
									<tr>
										<td>0</td>
										<td>{user.name}</td>
										<td>{user.email}</td>
										<td>{user.role}</td>
										<td>
											<button className="mx-2 text-brown">
												<FaEdit size={30} />
											</button>
											<button className="text-brown">
												<FaArchive size={30} />
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}

export default ManageUser;
