import { Link } from "react-router-dom";
import { useState } from "react";

function Register() {
	//================================================

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
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
			const res = await fetch("http://localhost:5174/api/docs", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (data.success) {
				alert("Registration successful!");
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
							<svg
								width="16"
								height="11"
								viewBox="0 0 16 11"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
									fill="#000000ff"
								/>
							</svg>
							<input
								type="text"
								placeholder="Name"
								value={formData.name}
								onChange={handleChange}
								name="name"
								className="bg-transparent text-black-500 placeholder-black-500/100 outline-none text-sm w-full h-full"
								required
							/>
						</div>

						<div className="flex items-center w-full bg-transparent border border-black-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
							<svg
								width="16"
								height="11"
								viewBox="0 0 16 11"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
									fill="#000000ff"
								/>
							</svg>
							<input
								type="email"
								name="email"
								placeholder="Email id"
								value={formData.email}
								onChange={handleChange}
								className="bg-transparent text-black-500 placeholder-black-500/100 outline-none text-sm w-full h-full"
								required
							/>
						</div>

						<div className="flex items-center w-full bg-transparent border border-black-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
							<svg
								width="16"
								height="11"
								viewBox="0 0 16 11"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
									fill="#000000ff"
								/>
							</svg>
							<input
								type="text"
								name="role"
								placeholder="Role"
								value={formData.role}
								onChange={handleChange}
								className="bg-transparent text-black-500 placeholder-black-500/100 outline-none text-sm w-full h-full"
								required
							/>
						</div>

						<div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden ml-6 gap-2">
							<svg
								width="13"
								height="17"
								viewBox="0 0 13 17"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
									fill="#000000ff"
								/>
							</svg>
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
