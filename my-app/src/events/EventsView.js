import React, { useState, useEffect } from "react";
import apiService from "../apiService.js";
import "../events/Events.css";
import { Link } from "react-router-dom";
import EventImageCard from "../images/EventImageCard ";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="events-container">
    <h1 className="page-title">Upcoming events</h1>
    <input
      type="text"
      className="event-search"
      placeholder="Search events for name"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  <div className="events-list">
  {filteredEvents.map((event) => (
    <Link
      to={`/event-details/${event.id}`}
      state={{ event }}
      key={event.id}
      className="event-card"
    >
      <div className="event-card-inner">
        <div className="event-content">
          <h2 className="event-title">{event.name}</h2>
          <p className="event-description">{event.description}</p>
        </div>
        <EventImageCard src={event.imagePath} alt={event.name} />
      </div>
    </Link>
  ))}
</div>
  </div>
  
   
  );
};

export default EventsPage;
