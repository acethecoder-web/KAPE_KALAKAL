import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
function ProtectedRoute({ children, allowedRoles }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAdmin = async () => {
			try {
				const res = await fetch("http://localhost:5174/api/me", {
					method: "GET",
					credentials: "include",
				});
				const data = await res.json();

				if (data.success && allowedRoles.includes(data.data.role)) {
					setUser(data.data);
				}
			} catch (error) {
				console.error("Auth check error:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAdmin();
	}, [allowedRoles]);

	if (loading) return <div> LOADING PLEASE WAIT.... </div>;
	if (!user) return <Navigate to="/login" />;

	return children;
}

export default ProtectedRoute;
