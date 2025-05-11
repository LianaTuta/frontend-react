import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import apiService from "../apiService";
import "../events/EventDetailsPage.css";
import EventImageCard from "../images/EventImageCard ";

const EventDetailsPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const eventFromState = state?.event;

  const [schedules, setSchedules] = useState([]);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [scheduleRes, detailsRes] = await Promise.all([
          apiService.get(`eventschedule/event-schedule/${id}`),
          apiService.get(`eventdetails/event-details/${id}`)
        ]);
        console.log(scheduleRes.body.Data);
        console.log(detailsRes.body.Data);
        if (scheduleRes.status === 200) {
          setSchedules(scheduleRes.body.Data);
        }

        if (detailsRes.status === 200) {
          setDetails(detailsRes.body.Data);
        }
      } catch (err) {
        setError("Failed to load extra event data.");
        console.error(err);
      }
    };

    fetchDetails();
  }, [id]);

  if (error) return <p>{error}</p>;

  const { name, description, imagePath } = eventFromState || {};

  return (
    <div className="event-page-wrapper">
    <div className="event-details-container">
      <div className="event-info">
        <h1>{name}</h1>
        <p className="event-description">{description}</p>
        <EventImageCard src={imagePath} alt={name} />
      </div>
      <div className="event-schedule">
        <h2>Schedules</h2>
        <ul>
          {schedules.map((s, idx) => (
            <li key={idx}>
              <strong>{new Date(s.startDate).toLocaleString()}</strong> –{" "}
              <strong>{new Date(s.endDate).toLocaleString()}</strong>
              <br />
              Location: {s.location}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  
  );
};

export default EventDetailsPage;
