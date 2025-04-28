import React, { useState, useEffect } from "react";
import apiService from "../apiService.js";
import "../events/Events.css";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiService.get("event/", {
          "Content-Type": "application/json",
        });
        if (response.status === 200) {
          console.log(response.body.Data);
          setEvents(response.body.Data);
          setLoading(false);
        } else {
          setError("Failed to fetch events");
          setLoading(false);
        }
      } catch (ex) {
        console.error("Error during fetch:", ex);
        setError("Error during fetch");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="loading-text">Loading events...</p>;
  }

  if (error) {
    return <p className="error-text">Error: {error}</p>;
  }

  const importImage = (imageName) => {
    try {
      return require(`../images/${imageName}`);
    } catch (e) {
      console.error("Image not found", e);
    }
  };

  return (
    <div className="events-container">
      <h1 className="page-title">Events</h1>
      <div className="events-list">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            {event.imagePath && (
              <img
                src={importImage(event.imagePath)}
                alt={event.name}
                className="event-image"
              />
            )}
            <h2 className="event-title">{event.name}</h2>
            <p className="event-description">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
