import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forms.css";

const PaymentCancelledPage = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: "450px", textAlign: "center" }}>
        <h2>Payment Cancelled</h2>
        <p>Your payment was cancelled or not completed.</p>
        <p>If you need assistance, please contact support.</p>

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
          Browse Events
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelledPage;
