import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../Common/apiService";
import "./CartPage.css";
import { formatDate } from "../utils/formatDate";
import EventImageCard from "../images/EventImageCard";

const OrderDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderId = state?.orderId;

  const [order, setOrder] = useState(null);
  const [eventDetailsMap, setEventDetailsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("No order selected.");
      setLoading(false);
      return;
    }
    const fetchOrderAndEvents = async () => {
      try {
        const orderResponse = await apiService.request(`order/${orderId}`, "GET");
        if (!orderResponse?.body?.Data) {
          setError("Failed to load order.");
          setLoading(false);
          return;
        }
        const fetchedOrder = orderResponse.body.Data;
        setOrder(fetchedOrder);

        const eventIds = [...new Set(fetchedOrder.details.map((t) => t.eventId))];

        const eventsMap = {};
        for (const id of eventIds) {
          const res = await apiService.request(`event/${id}`, "GET");
          if (res?.body?.Data) {
            eventsMap[id] = res.body.Data;
          }
        }
        setEventDetailsMap(eventsMap);
      } catch {
        setError("An error occurred while fetching the order or event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndEvents();
  }, [orderId]);

  const handleDownloadTicket = async (orderId) => {
    try {
      const response = await apiService.request(`ticket/download-ticket/${orderId}`, "GET");
      console.log(response, response.body?.Data);
      if (response.status === 200 && response.body?.Data?.downLoadUrl) {
        window.location.href = response.body.Data.downLoadUrl;
      } else {
        setError("Download link not available.");
      }
    } catch (error) {
      console.error("Download failed:", error);
      setError("Error while generating the download link.");
    }
  };

  if (loading) return <div className="cart-page">Loading order...</div>;

  if (error)
    return (
      <div className="cart-page">
        <p>{error}</p>
        <button onClick={() => navigate("/my-orders")} className="submit-btn">
          Back to My Orders
        </button>
      </div>
    );

  if (!order) return null;

  const allEventsLoaded = order.details.every((ticket) =>
    Boolean(eventDetailsMap[ticket.eventId])
  );

  if (!allEventsLoaded) {
    return <div className="cart-page">Loading event details...</div>;
  }

  return (
    <div className="cart-page">
      <h2 className="order-header">Order #{order.id}</h2>
      <div className="cart-list">
        {order.details.map((ticket, index) => {
          const event = eventDetailsMap[ticket.eventId];
          return (
            <div key={index} className="cart-item">
              <div className="cart-image-wrapper">
                <EventImageCard src={event?.imagePath} alt={event?.name || ticket.eventName} />
              </div>
              <div className="cart-item-details">
                <div className="cart-item-header">
                  <strong>{ticket.ticketName}</strong>
                  <span className="cart-item-price">${ticket.price}</span>
                </div>
                <div className="cart-line">
                  {formatDate(event?.startDate || ticket.eventScheduleStartDate)} –{" "}
                  {formatDate(event?.endDate || ticket.eventScheduleEndDate)}
                </div>
                <div className="cart-line">Event: {event?.name || ticket.eventName}</div>
                <button 
                  className="download-ticket-btn" 
                  onClick={() => handleDownloadTicket(ticket.id, ticket.ticketName)}
                >
                  Download Ticket
                </button>
              </div>
           
            </div>
          );
        })}
      </div>
      <div className="cart-summary">
        <div className="cart-total-amount">
          <strong>Total:</strong> <span>${order.totalPrice}</span>
        </div>
       
      </div>
    </div>
  );
};

export default OrderDetailsPage;
