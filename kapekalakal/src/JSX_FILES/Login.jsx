import "../CSS_FILES/Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
/* useNavigate was usef to redirect the apge you want to redirect if the credentials are correct */

function Login() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	//================================================
	const navigate = useNavigate();
	//================================================
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
			const res = await fetch("http://localhost:5174/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
				credentials: "include",
			});

			const data = await res.json();

			if (data.success) {
				alert("Login successful!");

				const userRole = data.user.role;

				if (userRole === "admin" || userRole === "superadmin") {
					navigate("/admin");
				} else if (userRole === "user") {
					navigate("/products");
				} else {
					navigate("/");
				}
			} else {
				alert(data.message);
			}
		} catch (error) {
			console.error("Login error:", error);
			alert("Something went wrong during login.");
		}
	};

	return (
		<>
			<NavBar />
			<div className="flex h-[673px] w-full bg-stone-500/90 text-[rgba(65, 44, 23)]">
				<div className="w-full hidden md:inline-block">
					<img className="h-full" src="/bg3.jpg" alt="leftSideImage" />
				</div>

				<div className="w-full flex flex-col items-center justify-center ">
					<form
						onSubmit={handleSubmit}
						className="md:w-96 w-80 flex gap-4 flex-col items-center justify-center">
						<h2 className="text-4xl text-black-600 font-medium">Sign in</h2>
						<p className="text-sm text-black-700/90 mt-3">
							Welcome back! Please sign in to continue
						</p>

						<div className="flex items-center gap-4 w-full my-5">
							<div className="w-full h-px bg-gray-300/90"></div>
							<p className="w-full text-nowrap text-sm text-black-500/90">
								Sign in with email
							</p>
							<div className="w-full h-px text-black bg-gray-300/100"></div>
						</div>

						<div className="flex items-center w-full border border-black-300/60 h-12 rounded-full overflow-hidden py-6 gap-2">
							<MdEmail className="mx-2" />
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Email id"
								className="bg-transparent text-black-500 placeholder-black-500/100 outline-none text-sm w-full h-full"
								required
							/>
						</div>
						<div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden ml-6 gap-2">
							<RiLockPasswordFill className="mx-2" />
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Password"
								className="bg-transparent text-black-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
								required
							/>
						</div>

						<div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
							<div className="flex items-center gap-2">
								<input className="h-5" type="checkbox" id="checkbox" />
								<label className="text-sm" htmlFor="checkbox"></label>
							</div>
							<a className="text-l underline text-white" href="#">
								Forgot password?
							</a>
						</div>

						<button
							type="submit"
							className="mt-8 w-full h-11 rounded-full text-white bg-stone-950">
							Login
						</button>
						<p className="text-black-500/90 text-sm mt-4">
							Don’t have an account?{" "}
							<Link
								to="/register"
								className="text-white hover:underline"
								href="#">
								Sign up
							</Link>
						</p>
					</form>
				</div>
			</div>
		</>
	);
}

export default Login;
