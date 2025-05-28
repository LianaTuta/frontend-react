import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "./apiService"; 

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token"); 
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await apiService.getEvents(token);
        setEvents(response);
      } catch (error) {
        setError("Failed to load events.");
      }
    };

    fetchEvents();
  }, [navigate]);

  return (
    <div>
      <h2>Events</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
