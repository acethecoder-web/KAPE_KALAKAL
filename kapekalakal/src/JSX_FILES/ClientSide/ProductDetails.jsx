import React, { useState } from "react";
import "./ProductDetails.css";
import { useClientView } from "./ClientViewContext";

function ProductDetails() {
  const { selectedProduct } = useClientView();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

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

        {/* Quantity Selector */}
        <div className="quantity-selector">
          <div className="pd-qbuttons">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              −
            </button>
          </div>
          <div className="quantity-display">{quantity}</div>
          <div className="pd-qbuttons">
            <button onClick={() => handleQuantityChange(1)}>+</button>
          </div>
        </div>

        <div className="pd-buttons d-flex gap-3">
          <button>Add to cart</button>
          <button>Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
