import "./MyPayments.css";
import { FaClipboardCheck } from "react-icons/fa";
function MyPayments() {
  return (
    <div className="payments-new-container">
      <div className="pay-con-1">
        <h3 className="payment-method-header">PAYMENT METHOD</h3>
        <div className="pays">
          <div className="gcash">
            <img
              className="gcash-img img"
              src="./logos/GCASH.png"
              alt="GCASH LOGO"
            />{" "}
            <p className="gcash-header"> GCASH</p>
          </div>

          <div className="grabpay">
            <img
              className="grabpay-img img"
              src="./logos/GRABPAY.png"
              alt="GRABPAY LOGO"
            />{" "}
            <p className="grabpay-header"> GRAB PAY</p>
          </div>

          <div className="mastercard">
            <img
              className="mastercard-img img"
              src="./logos/MASTERCARD.png"
              alt="MASTERCARD LOGO"
            />{" "}
            <p className="mastercard-header"> MASTERCARD</p>
          </div>

          <div className="accs">
            <input
              type="text"
              name="acc-name"
              className="acc-name"
              placeholder="ENTER ACC NAME:"
            />
            <input
              type="text"
              name="acc-name"
              className="acc-name"
              placeholder="ENTER ACC NUMBER:"
            />
          </div>
          <h5 className="confirm">
            <FaClipboardCheck /> CONFIRM PAYMENT
          </h5>
        </div>
      </div>
      <div className="pay-con-2">
        <div className="receipt-head">
          <img className="receipt-logo" src="/LOGO.svg" alt="" />{" "}
          <h4>KAPE KALAKAL</h4>
        </div>
        <h5 className="dividerr">--------------------------------</h5>
        <h6>OFFICIAL RECEIPT</h6>
        <h5 className="dividerr">--------------------------------</h5>
        <div className="order-products">
          <table className="orders-table">
            <tr>
              <th className="theaders">PRODUCT NAME:</th>
              <th className="theaders"> QUANTITY:</th>
              <th className="theaders"> UNIT PRICE:</th>
              <th className="theaders">TOTAL PRICE:</th>
            </tr>
            <tr>
              <td className="tcontents">Black Coffee Beans</td>
              <td className="tcontents">24</td>
              <td className="tcontents">100</td>
              <td className="tcontents">2400</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyPayments;
