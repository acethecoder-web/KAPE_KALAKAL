import React, { useState } from "react";
import { useClientView } from "./ClientViewContext";
import "./Cart.css";
function CartPage() {
  const { setActiveView } = useClientView();
  return (
    <>
      <h1 className="cart-header">SHOPPING CART</h1>
      <div className="cart-main-container">
        <div className="con1 ">
          <div className="p-image">PRODUCT IMAGE</div>
          <div className="p-name">PRODUCT NAME</div>
          <div className="p-quantity">QUANTITY ( - 1 +) </div>
          <div className="p-total-price">TOTAL PRICE</div>
        </div>
        <div className="con2">
          <h6 className="cart-total-header">CART TOTAL</h6>
          <h6 className="m-2">------------------------</h6>
          <div className="computation">
            <p>Cart Subtotal :</p> <p>Product Tax :</p> <p>Shipping fee :</p>{" "}
            <h6 className="m-2">------------------------</h6>
            <h6>TOTAL :</h6>
          </div>
          <button
            onClick={() => setActiveView("my-payments")}
            className="checkout"
            type="button"
          >
            CHECK OUT
          </button>
        </div>
      </div>
    </>
  );
}

export default CartPage;
