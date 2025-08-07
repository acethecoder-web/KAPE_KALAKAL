import "../AdminSide/ViewProducts.css";

function ViewProducts() {
  return (
    <div>
      <div className="productcard-container">
        <div className="image">
          <img
            src="/placeholder.png"
            alt="placeholder"
            className="product-img"
          />
        </div>
        <div className="product-details">
          <h1 className="product-name">PRODUCT NAME</h1>
          <p className="product-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam
            atque ex neque voluptate deserunt ad repellat praesentium? Aperiam
            nostrum sequi libero dolorem tenetur quo odio, sed illo blanditiis
            culpa vitae.
          </p>
          <div className="quantity-container">
            <button className="quantity-button">-</button>
            <p className="quantity-display">1</p>
            <button className="quantity-button">+</button>
          </div>
          <p className="product-price">120.00</p>
          <div className="buttons">
            <button className="cart-button">Add to cart</button>
            <button className="buy-button">Buy now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProducts;
