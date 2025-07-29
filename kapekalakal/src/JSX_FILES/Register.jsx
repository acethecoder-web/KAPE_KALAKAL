import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { FaUser } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";

function Register() {
	//================================================
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		address: "",
		role: "",
		password: "",
	});
	//================================================
	const navigate2 = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};
	//================================================

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch("http://localhost:5174/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (data.success) {
				alert("Registration successful!");
				navigate2("/login");
			} else {
				alert(data.message || "Registration failed.");
			}
		} catch (err) {
			console.error("Error:", err);
			alert("Server error.");
		}
	};
	//================================================

	return (
		<>
			<NavBar />
			<div className="flex h-[673px] w-full bg-stone-500/90 text-[rgba(65, 44, 23)]">
				<div className="w-full hidden md:inline-block">
					<img className="h-full" src="/bg4.jpg" alt="leftSideImage" />
				</div>
				<div className="w-full flex flex-col items-center justify-center ">
					<form
						className="md:w-96 w-80 flex gap-2 flex-col items-center justify-center"
						onSubmit={handleSubmit}>
						<h2 className="text-4xl text-black-600 font-medium">Register</h2>
						<p className="text-sm text-black-700/90 mt-3">
							Welcome to Kape kalakal! Please fill out the form to continue
						</p>
						<div className="flex items-center gap-4 w-full my-5">
							<div className="w-full h-px bg-gray-300/90"></div>
							<p className="w-full text-nowrap text-sm text-black-500/90">
								Register with email
							</p>
							<div className="w-full h-px text-black bg-gray-300/100"></div>
						</div>

						<div className="flex items-center w-full bg-transparent border border-black-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
							<FaUser className="mx-2" />
							<input
								type="email"
								name="email"
								placeholder="Email"
								value={formData.email}
								onChange={handleChange}
								className="bg-transparent text-black-500 placeholder-black-500/100 outline-none text-sm w-full h-full"
								required
							/>
						</div>

						<div className="flex items-center w-full bg-transparent border border-black-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
							<FaAddressBook className="mx-2" />
							<input
								type="text"
								placeholder="Address"
								value={formData.address}
								onChange={handleChange}
								name="address"
								className="bg-transparent text-black-500 placeholder-black-500/100 outline-none text-sm w-full h-full"
								required
							/>
						</div>

						<div className="flex user  items-center w-full bg-transparent border border-black-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
							<FaRankingStar className="mx-2" />
							<input
								type="text"
								placeholder="role"
								value=""
								onChange={handleChange}
								name="role"
								className="bg-transparent text-black-500 placeholder-black-500/100 outline-none text-sm w-full h-full"
							/>
						</div>

						<div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden ml-6 gap-2">
							<RiLockPasswordFill className="mx-2" />

							<input
								type="password"
								name="password"
								placeholder="Password"
								value={formData.password}
								onChange={handleChange}
								className="bg-transparent text-black-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
								required
							/>
						</div>

						<div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
							<div className="flex items-center gap-2">
								<input className="h-5" type="checkbox" id="checkbox" />
								<label className="text-sm" htmlFor="checkbox"></label>
							</div>
							<a className="text-l underline text-white" href="#"></a>
						</div>

						<button
							type="submit"
							className="mt-8 w-full h-11 rounded-full text-white bg-stone-950">
							Register
						</button>
						<p className="text-black-500/90 text-sm mt-4">
							Already have an account?{" "}
							<Link to="/login" className="text-white hover:underline" href="#">
								Log in
							</Link>
						</p>
					</form>
				</div>
			</div>
		</>
	);
}

export default Register;
