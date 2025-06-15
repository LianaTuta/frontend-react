import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import apiService from "../../Common/apiService";
import "./EventDetailsPage.css";
import EventInfo from "./EventInfo";
import EventSchedule from "./EventSchedule";
import { useCart } from "../../Order/CartContext";
import Banner from "../../sidebar/Banner";
import AuthHelper from "../../Common/authHelper";
import { Roles } from "../../constants/roleEnum";
import { useIsManagerValid } from "../../Common/useAuthValidation";

const EventDetailsPage = () => {

  const { state } = useLocation();
  const eventFromState = state?.event;
  const { addToCart } = useCart();
  const isLoggedIn = AuthHelper.isLoggedIn();
  const isManager = useIsManagerValid();

  const [schedules, setSchedules] = useState([]);
  const [ticketsBySchedule, setTicketsBySchedule] = useState({});

  const [event, setEvent] = useState(eventFromState || {});
  const [showBanner, setShowBanner] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");


  const [validationErrors, setValidationErrors] = useState({});
 

  const hasValidationErrors = Object.values(validationErrors).some(
    (fields) => fields && Object.values(fields).some((msg) => !!msg)
  );
  

  const refetchEvent = async () => {
    try {
      const response = await apiService.get(`event/${event.id}`);
      if (response.status === 200 && response.body?.Data) {
        setEvent(response.body.Data);
      }
    } catch (err) {
      console.error("Failed to fetch event", err);
    }
  };


  const fetchTickets = async () => {
    const ticketMap = {};
    for (const schedule of schedules) {
      try {
        const res = await apiService.get(`ticket/${schedule.id}`);
        if (res.status === 200) {
          ticketMap[schedule.id] = res.body.Data;
        }
      } catch (err) {
        console.error(`Error loading tickets for schedule ${schedule.id}`);
      }
    }
    setTicketsBySchedule(ticketMap);
  };


  const fetchSchedules = async () => {
    try {
      const res = await apiService.get(`eventschedule/event-schedule/${event.id}`);
      if (res.status === 200) {
        setSchedules(res.body.Data);
      }
    } catch (err) {
      setError("Failed to load schedules.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (event?.id) {
      fetchSchedules();
    }
  }, [event?.id]);

  useEffect(() => {
    if (schedules.length > 0) {
      fetchTickets();
    }
  }, [schedules]);

  const handleAddToCart = (ticket, schedule) => {
    if (!isLoggedIn) {
      setShowBanner(true);
      return;
    }

    addToCart({
      ...ticket,
      imagePath: event.imagePath,
      eventName: event.name,
      scheduleStart: schedule.startDate,
      scheduleEnd: schedule.endDate,
      location: schedule.location,
    });
  };



  const handleScheduleFieldChange = (id, field, value) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id ? { ...schedule, [field]: value } : schedule
      )
    );
  };

  const handleTicketFieldChange  = (ticketId, field, value) => {
    setTicketsBySchedule(prev => {
      const updated = { ...prev };
  
      for (const scheduleId in updated) {
        const tickets = updated[scheduleId];
        updated[scheduleId] = tickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, [field]: value } : ticket
        );
      }
  
      return updated;
    });
  };


  const handleSave = async () => {
    setSaving(true);
    try {
      const queryParams = new URLSearchParams({
        Name: event.name,
        Description: event.description,
        EventTypeId: event.eventTypeId
      }).toString();
  
      const formData = new FormData();
      formData.append("Photo", event.photo);
  
      const response = await apiService.request(
        `event/${event.id}?${queryParams}`,
        "PUT",
        formData
      );
  
      for (const scheduleId in schedules) {
        const updates = schedules[scheduleId];
        console.log(event, event.id,);
        const serializedUpdates = {
          eventId: event.id,
          startDate: updates.startDate?.toISOString?.() ?? updates.startDate,
          endDate: updates.endDate?.toISOString?.() ?? updates.endDate,
          location: updates.location ?? "",
          name: updates.Name ?? updates.name ?? ""
        };
        await apiService.request(
          `eventschedule/event-schedule/${updates.id}`,
          "PUT",
          serializedUpdates,
          { "Content-Type": "application/json" }
        );
      }
  
      for (const scheduleId in ticketsBySchedule) {
        const ticketList = ticketsBySchedule[scheduleId];
        for (const ticket of ticketList) {
          const payload = {
            name: ticket.name,
            description: ticket.description,
            ticketCategoryId: ticket.ticketCategoryId,
            eventScheduleId: ticket.eventScheduleId,
            price: ticket.price,
            numberOfAvailableTickets: ticket.numberOfAvailableTickets
          };
  
          await apiService.request(`ticket/${ticket.id}`, "PUT", payload, {
            "Content-Type": "application/json"
          });
        }
      }
  
      if (response.status === 200) {
        setMessage("Event updated successfully.");
        await refetchEvent();
      } else {
        setMessage("Failed to update event.");
      }
    } catch (err) {
      console.error("Error while saving:", err);
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleBuyNow = (ticket, schedule) => {
    console.log("Buying ticket:", ticket);
    if (!isLoggedIn) {
      setShowBanner(true);
      return;
    }

    addToCart({
      ...ticket,
      imagePath: event.imagePath,
      eventName: event.name,
      scheduleStart: schedule.startDate,
      scheduleEnd: schedule.endDate,
      location: schedule.location,
    });
    navigate("/cart");

  };

  const handleFieldChange = (field, value) => {
    setEvent((prev) => ({ ...prev, [field]: value }));
  };

  if (error) return <p>{error}</p>;

  return (
    <>
      {showBanner && (
        <Banner
          message="Please log in to add tickets to your cart."
          onClose={() => setShowBanner(false)}
        />
      )}
      <div className="event-page-wrapper">
        <div className="event-details-container">
          {isManager && (
            <div className="event-details-header-row">
             <button
              className="login-btn"
              onClick={handleSave}
              disabled={saving || hasValidationErrors}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            </div>
          )}
          {event && (
          <EventInfo
            event={event}
            isManager={isManager}
            onFieldChange={handleFieldChange}
          />
          )}
        <EventSchedule
        schedules={schedules}
        ticketsBySchedule={ticketsBySchedule}
        isManager={isManager}
        handleAddToCart={handleAddToCart}
        handleBuyNow={handleBuyNow}
        onScheduleFieldChange={handleScheduleFieldChange}
        onTicketFieldChange={handleTicketFieldChange }
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
        eventId={event.id}
      />
        </div>
      </div>
    </>
  );
};

export default EventDetailsPage;
