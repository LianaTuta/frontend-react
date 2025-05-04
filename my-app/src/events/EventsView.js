import React, { useState, useEffect } from "react";
import apiService from "../apiService.js";
import "../events/Events.css";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiService.get("event/", {
          "Content-Type": "application/json",
        });

        if (response.status === 200) {
          setEvents(response.body.Data);
        } else {
          setError("Failed to fetch events");
        }
      } catch (err) {
        setError("Fetch error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleImageError = (eventId) => {
    setImageErrors((prev) => ({ ...prev, [eventId]: true }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="events-container">
      <h1 className="page-title">Events</h1>
      <div className="events-list">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <h2 className="event-title">{event.name}</h2>
            <p className="event-description">{event.description}</p>

            <div className="event-image-wrapper">
              {event.imagePath && !imageErrors[event.id] ? (
                <img
                  src={event.imagePath}
                  alt={event.name}
                  className="event-image"
                  onError={() => handleImageError(event.id)}
                />
              ) : (
                <div className="no-image-placeholder">No image available</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
