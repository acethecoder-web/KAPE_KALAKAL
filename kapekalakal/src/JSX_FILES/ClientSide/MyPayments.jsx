import { useState } from "react";
import { FaClipboardCheck } from "react-icons/fa";

function MyPayments() {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentOptions = [
    { id: "gcash", name: "GCASH", logo: "./logos/GCASH.png" },
    { id: "grabpay", name: "GRAB PAY", logo: "./logos/GRABPAY.png" },
    { id: "mastercard", name: "MASTERCARD", logo: "./logos/MASTERCARD.png" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        backgroundColor: "#d7ccc8",
        borderRadius: "12px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Payment Method Section */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        }}
      >
        <h3
          style={{
            color: "#3c2415",
            marginBottom: "20px",
            borderBottom: "2px solid #5d4037",
            paddingBottom: "10px",
          }}
        >
          PAYMENT METHOD
        </h3>

        {/* Payment Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {paymentOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelectedMethod(option.id)}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor:
                  selectedMethod === option.id ? "#e0d4c4" : "#f5f5f5",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow:
                  selectedMethod === option.id
                    ? "0 4px 8px rgba(0,0,0,0.2)"
                    : "0 2px 4px rgba(0,0,0,0.1)",
                transform:
                  selectedMethod === option.id ? "scale(1.02)" : "scale(1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#ede0d4")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  selectedMethod === option.id ? "#e0d4c4" : "#f5f5f5")
              }
            >
              <img
                src={option.logo}
                alt={option.name}
                style={{ width: "50px", marginRight: "15px" }}
              />
              <p style={{ fontWeight: "bold", color: "#3c2415" }}>
                {option.name}
              </p>
            </div>
          ))}

          {/* Account Inputs */}
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <input
              type="text"
              placeholder="ENTER ACC NAME:"
              style={{
                width: "95%",
                padding: "10px",
                border: "1px solid #5d4037",
                borderRadius: "6px",
                outline: "none",
                transition: "0.3s",
              }}
              onFocus={(e) => (e.target.style.border = "2px solid #3c2415")}
              onBlur={(e) => (e.target.style.border = "1px solid #5d4037")}
            />
            <input
              type="text"
              placeholder="ENTER ACC NUMBER:"
              style={{
                width: "95%",
                padding: "10px",
                border: "1px solid #5d4037",
                borderRadius: "6px",
                outline: "none",
                transition: "0.3s",
              }}
              onFocus={(e) => (e.target.style.border = "2px solid #3c2415")}
              onBlur={(e) => (e.target.style.border = "1px solid #5d4037")}
            />
          </div>

          {/* Confirm Payment */}
          <button
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#3c2415",
              color: "#fff",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              border: "none",
              transition: "all 0.2s ease",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.95)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#5d4037")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#3c2415")
            }
          >
            <FaClipboardCheck style={{ marginRight: "8px" }} /> CONFIRM PAYMENT
          </button>
        </div>
      </div>

      {/* Receipt Section */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/LOGO.svg" alt="Logo" style={{ width: "50px" }} />
          <h4 style={{ color: "#3c2415", fontWeight: "bold" }}>KAPE KALAKAL</h4>
        </div>

        <h5 style={{ textAlign: "center", margin: "10px 0", color: "#5d4037" }}>
          -------------------------------
        </h5>
        <h6 style={{ textAlign: "center", color: "#3c2415" }}>
          OFFICIAL RECEIPT
        </h6>
        <h5 style={{ textAlign: "center", margin: "10px 0", color: "#5d4037" }}>
          -------------------------------
        </h5>

        {/* Orders Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "10px", color: "#3c2415" }}>
                  PRODUCT NAME:
                </th>
                <th style={{ padding: "10px", color: "#3c2415" }}>QUANTITY:</th>
                <th style={{ padding: "10px", color: "#3c2415" }}>
                  UNIT PRICE:
                </th>
                <th style={{ padding: "10px", color: "#3c2415" }}>
                  TOTAL PRICE:
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Black Coffee Beans
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  24
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  100
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  2400
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyPayments;
