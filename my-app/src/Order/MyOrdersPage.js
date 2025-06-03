import React, { useEffect, useState } from "react";
import apiService from "../Common/apiService";
import "./MyOrdersPage.css";
import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import useAuthValidation from "../Common/useAuthValidation";
import { OrderStep } from "../constants/OrderStepEnum.ts";
import { getOrderStepMessage } from "./OrderCommon.ts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import OrderFilter from "./OrderFilter.js";

const PAYMENT_TIMEOUT_MINUTES = 30;

const isPaymentExpired = (dateCreated) => {
  const orderDate = new Date(dateCreated);
  const nowUtc = Date.now();
  const diffMinutes = (nowUtc - orderDate.getTime()) / 60000;
  return diffMinutes > PAYMENT_TIMEOUT_MINUTES;
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [eventNameFilter, setEventNameFilter] = useState("");
  const [ticketNameFilter, setTicketNameFilter] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDateFilter, endDateFilter] = dateRange;
  const [countdowns, setCountdowns] = useState({});


  useAuthValidation();
  const navigate = useNavigate();

  function formatSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }



  const getInitialCountdown = (dateCreated) => {
    const orderDate = new Date(dateCreated);
    const now = new Date();
    const diffMs = orderDate.getTime() + PAYMENT_TIMEOUT_MINUTES * 60000 - now.getTime();
    return Math.max(Math.floor(diffMs / 1000), 0);
  };

  const fetchOrders = async () => {
    try {
      const res = await apiService.get("order");
      if (res.status === 200) {
        setOrders(res.body.Data);
        const expiredOrders = res.body.Data.filter(
          (order) => order.step === OrderStep.Payment && isPaymentExpired(order.dateCreated)
        );

        for (const order of expiredOrders) {
          await cancelOrder(order.id, false);
        }

        if (expiredOrders.length > 0) {
          fetchOrders();
        }
      } else {
        setError("Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length === 0) return; 
  
    const intervalId = setInterval(() => {
      const now = new Date();
  
      const newCountdowns = {};
  
      orders.forEach(order => {
        if (order.step === OrderStep.Payment) {
          const orderDate = new Date(order.dateCreated);
          const expirationTime = new Date(orderDate.getTime() + PAYMENT_TIMEOUT_MINUTES * 60000);
          const secondsLeft = Math.max(0, Math.floor((expirationTime - now) / 1000));
          newCountdowns[order.id] = secondsLeft;
        } else {
          newCountdowns[order.id] = 0;
        }
      });
  
      setCountdowns(newCountdowns);
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, [orders]);

  const cancelOrder = async (orderId, reload = true) => {
    try {
      const res = await apiService.request(`order/cancel-order/${orderId}`, "POST");
      if (res.status === 200) {
        if (reload) fetchOrders();
      } else {
        alert("Failed to cancel order.");
      }
    } catch (err) {
      console.error(err);
      alert("Error canceling order.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter !== "all") {
      if (filter === "pending" && !(order.step < OrderStep.Completed && !isPaymentExpired(order.dateCreated))) {
        return false;
      }
      if (filter === "expired" && !(order.step < OrderStep.Completed && isPaymentExpired(order.dateCreated))) {
        return false;
      }
      if (filter === "completed" && order.step !== OrderStep.Completed) {
        return false;
      }
      if (filter === "cancelled" && order.step !== OrderStep.Cancelled) {
        return false;
      }
    }
    if (
      eventNameFilter.trim() &&
      !order.details.some((ticket) =>
        ticket.eventName.toLowerCase().includes(eventNameFilter.toLowerCase())
      )
    ) {
      return false;
    }
    if (
      ticketNameFilter.trim() &&
      !order.details.some((ticket) =>
        ticket.ticketName.toLowerCase().includes(ticketNameFilter.toLowerCase())
      )
    ) {
      return false;
    }
    if (startDateFilter && new Date(order.dateCreated) < startDateFilter) {
      return false;
    }
    if (endDateFilter && new Date(order.dateCreated) > endDateFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      <OrderFilter
        filter={filter}
        setFilter={setFilter}
        eventNameFilter={eventNameFilter}
        setEventNameFilter={setEventNameFilter}
        ticketNameFilter={ticketNameFilter}
        setTicketNameFilter={setTicketNameFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {error && <p className="error-text">{error}</p>}

      {filteredOrders.length === 0 && !error ? (
        <p>No orders found.</p>
      ) : (
        filteredOrders.map((order) => {
          const isExpired = order.step === OrderStep.Payment && isPaymentExpired(order.dateCreated);

          return (
            <div key={order.id} className="order-card">
             <div className="order-header">
              <div>
                <strong>Order #{order.id}</strong>
                <div
                  className={`order-status ${
                    order.step < OrderStep.Completed ? "pending" : "paid"
                  } ${isExpired ? "expired" : ""} ${order.step === OrderStep.Cancelled ? "cancelled" : ""}`}
                >
                  {getOrderStepMessage(order.step)}
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

              {order.step === OrderStep.Payment && !isExpired && (
                <p className="pending-message">
                  Your order is almost there! Just one step left —{" "}
                  <strong>complete your payment</strong> to lock in your tickets and
                  secure your spot.
                  <span className="time-left-text">
                  Time left to complete the order: {formatSeconds(countdowns[order.id] || 0)} 
                  </span>
                </p>
                
              )}

              {isExpired && (
                <p className="expired-message">
                  This order has expired because payment was not completed in time.
                </p>
              )}

              <div className="order-footer">
                <span className="order-total">Total: ${order.totalPrice}</span>
                <div className="order-actions">
                  <button
                    className="details-btn"
                    onClick={() =>
                      navigate("/order-details", { state: { orderId: order.id } })
                    }
                  >
                    View Details
                  </button>
                  {order.step === OrderStep.Payment && !isExpired && (
                    <button
                      className="pay-btn"
                      onClick={() => {
                        window.location.href = order.paymentUrl;
                      }}
                    >
                      Complete Payment
                    </button>
                  )}
                  {order.step !== OrderStep.Cancelled && (
                  <button
                    className="cancel-btn"
                    onClick={() => cancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrdersPage;
