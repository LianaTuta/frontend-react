import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forms.css";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: "450px", textAlign: "center" }}>
        <h2>Order Successful!</h2>
        <p>Your order has been placed successfully.</p>
        <p>Thank you for your purchase!</p>

        <button
          className="login-btn"
          onClick={() => navigate("/my-orders")}
          style={{ marginTop: "1.5rem" }}
        >
          View My Orders
        </button>

        <button
          className="login-btn"
          onClick={() => navigate("/all-events")}
          style={{ marginTop: "1rem" }}
        >
          Continue Browsing Events
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
