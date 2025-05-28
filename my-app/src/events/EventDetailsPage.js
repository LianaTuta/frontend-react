import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import apiService from "../apiService";
import "../events/EventDetailsPage.css";
import EventImageCard from "../images/EventImageCard";
import { useCart } from "../Order/CartContext";
import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import Banner from "../sidebar/Banner";

const EventDetailsPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const eventFromState = state?.event;
  const { addToCart } = useCart()

  const [schedules, setSchedules] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [ticketsBySchedule, setTicketsBySchedule] = useState({});
  const isLoggedIn = !!localStorage.getItem("bearer");
  const navigate = useNavigate();
  const handleAddToCart = (ticket, schedule) => {
    if (!isLoggedIn) {
      setShowBanner(true);
      return;
    }
    addToCart({
      ...ticket,
      imagePath,
      eventName: name,
      scheduleStart: schedule.startDate,
      scheduleEnd: schedule.endDate,
      location: schedule.location
    });
  };


  
  const handleBuyNow = (ticket) => {
    console.log("Buying now:", ticket);
  };
  
  useEffect(() => {

    const fetchDetails = async () => {
      try {
        const [scheduleRes, detailsRes] = await Promise.all([
          apiService.get(`eventschedule/event-schedule/${id}`),
          apiService.get(`eventdetails/event-details/${id}`)
        ]);

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

  useEffect(() => {
    const fetchTickets = async () => {
      const results = {};
      for (const schedule of schedules) {
        try {
          const res = await apiService.get(`ticket/${schedule.id}`);
          if (res.status === 200) {
            results[schedule.id] = res.body.Data;
          }
        } catch (err) {
          console.error(`Failed to fetch tickets for schedule ${schedule.id}`);
        }
      }
      setTicketsBySchedule(results);
    };

    if (schedules.length > 0) {
      fetchTickets();
    }
  }, [schedules]);
  

  if (error) return <p>{error}</p>;

  const { name, description, imagePath } = eventFromState || {};

  return (<>
    {showBanner && (
      <Banner
        message="Please log in to add tickets to your cart."
        onClose={() => setShowBanner(false)}
      />
    )}
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
            {schedules.map((s) => (
              <li key={s.id} className="schedule-block">
               <strong>{formatDate(s.startDate)}</strong> –{" "}
               <strong>{formatDate(s.endDate)}</strong>
                <br />
                Location: {s.location}

                {ticketsBySchedule[s.id] && ticketsBySchedule[s.id].length > 0 && (
                <ul className="ticket-list">
                {ticketsBySchedule[s.id].map((ticket) => (
                  <li key={ticket.id} className="ticket-item">
                    <div className="ticket-info">
                      <strong>{ticket.name}</strong> – ${ticket.price}
                      <br />
                      <small>{ticket.description}</small>
                    </div>
                    <div className="ticket-actions">
                    <button onClick={() => handleAddToCart(ticket, s)}>Add to Cart</button>
                      <button onClick={() => handleBuyNow(ticket)}>Buy Now</button>
                    </div>
                  </li>
                ))}
                </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default EventDetailsPage;
