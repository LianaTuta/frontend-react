import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // To access the location state
import "../events/EventDetailsPage.css";

const EventDetailsPage = () => {
  const location = useLocation();
  const { eventName, eventDescription, eventImages } = location.state || {}; // Get state passed from parent

  // Mock data for event schedule and address
  const eventSchedule = [
    { date: "2025-05-01", time: "10:00 AM - 12:00 PM" },
    { date: "2025-05-02", time: "1:00 PM - 3:00 PM" },
    { date: "2025-05-03", time: "5:00 PM - 7:00 PM" },
  ];

  const eventAddress = "Borcell Beach, 123 Anywhere St., Any City";

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false); // Simulate data loading
  }, []);

  if (loading) {
    return <p className="loading-text">Loading event details...</p>;
  }

  return (
    <div className="event-details-container">
      {/* Background Image */}
      <div className="background-image">
        <div className="blurred-card">
          <h1 className="event-title">{eventName}</h1>
          <p className="event-description">{eventDescription}</p>

          <h3 className="section-title">Event Schedule</h3>
          <ul className="schedule-list">
            {eventSchedule.map((item, index) => (
              <li key={index} className="schedule-item">
                <span>{item.date}</span> - <span>{item.time}</span>
              </li>
            ))}
          </ul>

          <h3 className="section-title">Event Location</h3>
          <p className="event-address">{eventAddress}</p>

          <button className="order-btn">Order Now</button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
