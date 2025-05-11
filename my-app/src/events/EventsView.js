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
    <h1 className="page-title">Upcomming events</h1>
    <input
      type="text"
      className="event-search"
      placeholder="Search events for name"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <div className="events-list">
      {filteredEvents.map((event) => (
        <div className="event-card" key={event.id}>
          <Link to={`/event-details/${event.id}`}
                state={{ event }}
              className="event-card">
          <h2 className="event-title">{event.name}</h2>
          <p className="event-description">{event.description}</p>
          <EventImageCard src={event.imagePath} alt={event.name} />
          </Link>
        </div>
      ))}
    </div>
  </div>
   
  );
};

export default EventsPage;
