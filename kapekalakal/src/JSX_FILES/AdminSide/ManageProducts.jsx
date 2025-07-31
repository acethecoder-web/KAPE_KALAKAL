import { FaEdit } from "react-icons/fa";
import { FaArchive } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";

function ManageProducts() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await fetch("http://localhost:5174/api/products");
				const data = await res.json();
				setProducts(data);
			} catch (err) {
				console.error("Failed to fetch products", err);
			}
		};
		fetchProducts();
	}, []);

	return (
		<div className="manage-products-container bg-amber-50 px-5 rounded">
			<h2 className="p-2">MANAGE PRODUCTS</h2>
			<div className="d-flex gap-2 align-items-center pb-3 ">
				<IoIosAddCircle size={30} />
				ADD PRODUCT
			</div>

			<table className="product-table">
				<thead>
					<tr>
						<th className="px-4">Name</th>
						<th className="px-4">Category</th>
						<th className="px-4">Price</th>
						<th className="px-4">Stock</th>
						<th className="px-4">Action</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => (
						<tr key={product._id}>
							<td className="px-4">{product.name}</td>
							<td className="px-4">{product.category}</td>
							<td className="px-4">{product.price}</td>
							<td className="px-4">{product.stock}</td>
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

export default ManageProducts;
