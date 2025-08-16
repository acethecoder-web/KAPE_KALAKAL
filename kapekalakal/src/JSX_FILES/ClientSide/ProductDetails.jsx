import React from "react";
import "./ProductDetails.css";
import { useClientView } from "./ClientViewContext";

function ProductDetails() {
  const { selectedProduct } = useClientView();

  if (!selectedProduct) {
    return <p>No product selected.</p>;
  }

  return (
    <div className="coffee-product">
      {/* Image */}
      <div className="coffee-image">
        <img
          src={selectedProduct.image || "/images/placeholder.png"}
          alt={selectedProduct.name}
        />
      </div>

      {/* Details */}
      <div className="coffee-details">
        <h2>{selectedProduct.name}</h2>
        <p className="description">{selectedProduct.description}</p>
        <p className="price">₱{selectedProduct.price} PHP</p>
        <div className="pd-buttons d-flex gap-3">
          <button>Add to cart</button>
          <button>Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
