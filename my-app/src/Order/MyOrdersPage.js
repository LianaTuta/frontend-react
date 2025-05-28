import React, { useEffect, useState } from "react";
import apiService from "../apiService";
import "./MyOrdersPage.css";
import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import useAuthValidation from "../Common/useAuthValidation";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  useAuthValidation();
  const navigate = useNavigate()
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiService.get("order");
        if (res.status === 200) {
          setOrders(res.body.Data);
        } else {
          setError("Failed to load orders");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred.");
      }
    };

    fetchOrders();
  }, []);



  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {error && <p className="error-text">{error}</p>}

      {orders.length === 0 && !error ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <strong>Order #{order.id}</strong>
                <div className={`order-status ${order.step < 4 ? "pending" : "paid"}`}>
                  {order.step < 4 ? "Pending Payment" : "Completed"}
                </div>
              </div>
              <div className="order-date">{formatDate(order.dateCreated)}</div>
            </div>

            <div className="ticket-list">
              {order.details.map((ticket) => (
                <div key={ticket.id} className="ticket-item">
                  <div className="ticket-info">
                    <strong>{ticket.ticketName}</strong>
                    <p>Event: {ticket.eventName}</p>
                    <p>
                      {formatDate(ticket.eventScheduleStartDate)} –{" "}
                      {formatDate(ticket.eventScheduleEndDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {order.step < 4 && (
                <p className="pending-message">
                    Your order is almost there! Just one step left — <strong>complete your payment</strong> to lock in your tickets and secure your spot.
                </p>
                )}
          
            <div className="order-footer">
              <span>Total: ${order.totalPrice}</span>
              <button className="details-btn" onClick={() => navigate("/order-details", { state: { orderId : order.id} })}>
                    View Details
             </button>
              {order.step < 4 && (
                <button
                  className="pay-btn"
                  onClick={() => {
                    
                    window.location.href = order.paymentUrl;
                  }}
                >
                  Complete Payment
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrdersPage;
