import React, { useState } from "react";
import "./EventSchedule.css";
import EditableDateField from "../../Common/EditableDateField";
import EditableTextField from "../../Common/EditableTextFileld";
import { FaDollarSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiService from "../../Common/apiService";

const EventSchedule = ({
  schedules,
  isManager,
  ticketsBySchedule,
  handleAddToCart,
  handleBuyNow,
  onScheduleFieldChange,
  validationErrors,
  setValidationErrors,
  onTicketFieldChange,
  eventId,
}) => {
  const navigate = useNavigate();
  const [editingFields, setEditingFields] = useState({});
  const [tempFields, setTempFields] = useState({});

  const toggleEdit = (id, field, originalValue) => {
    setEditingFields((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: true },
    }));
    setTempFields((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: originalValue },
    }));
  };

  const validateTicket = async (ticketId) => {
    try {
      const res = await apiService.get(`order/is-valid-ticket/${ticketId}`);
      if (res.status === 200) {
        return res.body?.Data?.soldTickets ?? 0;
      }
    } catch (err) {
      console.error("Validation failed", err);
    }
    return 0;
  };

  const confirmChange = async (id, field, value) => {
    const now = new Date();

    const schedule = schedules.find((s) => s.id === id);
    const start = field === "startDate" ? value : schedule?.startDate;
    const end = field === "endDate" ? value : schedule?.endDate;

    const errors = {};

    if (field === "startDate" && new Date(start) < now ) {
      errors.startDate = "Start date cannot be in the past.";
    }

    if (field === "startDate" && new Date(start) > new Date(end)) {
      errors.startDate = "Start date must be before the end date.";
    }

    if (field === "endDate" && new Date(end) <= new Date(start)) {
      errors.endDate = "End date must be after the start date.";
    }

    if (field === "price") {
        const normalized = value.trim().replace(",", ".");
        const decimalRegex = /^\d*\.?\d+$/;
      
        if (!decimalRegex.test(normalized)) {
          errors.price = "Price must be a valid positive number.";
        } else {
          const priceVal = parseFloat(normalized);
          if (priceVal < 0) {
            errors.price = "Price must be a number >= 0.";
          }
        }
      }

      if (field === "numberOfAvailableTickets") {
        const trimmedValue = value.trim();
        const intRegex = /^\d+$/;
      
        if (!intRegex.test(trimmedValue)) {
          errors.numberOfAvailableTickets = "Available tickets must be a non-negative integer.";
        } else {
          const intVal = parseInt(trimmedValue, 10);
          const remaining = await validateTicket(id);
      
          if (intVal <  remaining) {
            errors.numberOfAvailableTickets = `Value must be at least ${remaining} (currently sold tickets).`;
          } else if (intVal < 0) {
            errors.numberOfAvailableTickets = "Available tickets must be 0 or more.";
          }
        }
      }


    if (Object.keys(errors).length > 0) {
      setValidationErrors((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), ...errors },
      }));
      return;
    }

    setValidationErrors((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: null },
    }));

    if (field === "price") value = parseFloat(value);
    if (field === "numberOfAvailableTickets") value = parseInt(value, 10) || 0;

    if (field === "location" || field === "startDate" || field === "endDate") {
      onScheduleFieldChange(id, field, value);
    } else {
      onTicketFieldChange(id, field, value);
    }

    setEditingFields((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: false },
    }));

  };

  const discardChange = (id, field) => {
    setEditingFields((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: false },
    }));
  };

  return (
    <div className="event-schedule">
      <h1>Schedules</h1>
      <div className="schedule-container">
        {isManager && (
          <button
            className="login-btn"
            onClick={() => navigate("/add-schedule", { state: { eventId: eventId } })}
          >
            + Add Schedule
          </button>
        )}

        {schedules.map((s) => (
          <div key={s.id} className="schedule-block">
            <div className="location-inline-wrapper">
              <span className="location-label">Location:</span>
              <EditableTextField
                fieldKey="location"
                value={s.location}
                isManager={isManager}
                maxLength={30}
                onConfirm={(key, val) => confirmChange(s.id, key, val)}
                onDiscard={() => discardChange(s.id, "location")}
                displayClassName="location-value"
              />
            </div>

            <div className="schedule-dates-row">
              <EditableDateField
                label="Start"
                value={s.startDate}
                isManager={isManager}
                onConfirm={(date) => confirmChange(s.id, "startDate", date)}
                onDiscard={() => discardChange(s.id, "startDate")}
                error={validationErrors?.[s.id]?.startDate}
              />
              <div className="arrow-separator">→</div>
              <EditableDateField
                label="End"
                value={s.endDate}
                isManager={isManager}
                onConfirm={(date) => confirmChange(s.id, "endDate", date)}
                onDiscard={() => discardChange(s.id, "endDate")}
                error={validationErrors?.[s.id]?.endDate}
              />
            </div>
            {isManager && (
                        <button
                            className="login-btn"
                            style={{ marginBottom: "1rem" }}
                            onClick={() => navigate("/add-ticket", { state: { scheduleId: s.id } })}
                        >
                            + Add Ticket
                        </button>
                        )}
            {ticketsBySchedule[s.id] ? (
              ticketsBySchedule[s.id].length > 0 ? (
                <div className="ticket-list">
                    
                  {ticketsBySchedule[s.id].map((ticket) => (
                    <div key={ticket.id} className="ticket-item">
                     
                      <div className="ticket-header-row">
                        <EditableTextField
                          fieldKey="name"
                          value={ticket.name}
                          maxLength={30}
                          isManager={isManager}
                          onConfirm={(key, val) => confirmChange(ticket.id, key, val)}
                          onDiscard={() => discardChange(ticket.id, "name")}
                          className="ticket-title edit-below"
                        />

                        <div className="ticket-price-wrapper">
                          <div className="arrow-separator">→</div>
                          <FaDollarSign className="currency-icon" />
                          <EditableTextField
                            fieldKey="price"
                            value={ticket.price.toString()}
                            isManager={isManager}
                            onConfirm={(key, val) => confirmChange(ticket.id, key, val)}
                            onDiscard={() => discardChange(ticket.id, "price")}
                            displayClassName="ticket-price-text edit-below"
                            editButtonBelow={true}
                            error={validationErrors?.[ticket.id]?.price}
                          />
                        </div>
                      </div>

                      <div className="ticket-description">
                        <EditableTextField
                          fieldKey="description"
                          value={ticket.description}
                          maxLength={200}
                          isManager={isManager}
                          onConfirm={(key, val) => confirmChange(ticket.id, key, val)}
                          onDiscard={() => discardChange(ticket.id, "description")}
                          as="textarea"
                        />
                      </div>

                      {isManager && (
                          <div className="ticket-price-wrapper">
                            <span className="arrow-separator">Number of available tickets:</span>
                          <EditableTextField
                            fieldKey="numberOfAvailableTickets"
                            value={ticket.numberOfAvailableTickets?.toString() || "0"}
                            maxLength={10}
                            isManager={isManager}
                            onConfirm={(key, val) => confirmChange(ticket.id, key, val)}
                            onDiscard={() => discardChange(ticket.id, "numberOfAvailableTickets")}
                            displayClassName="ticket-available-count-text"
                            error={validationErrors?.[ticket.id]?.numberOfAvailableTickets}
                          />
                        </div>
                      )}

                      <div className="ticket-actions">
                      {!isManager && (
                          <>
                            <button className="submit-btn" onClick={() => handleAddToCart(ticket, s)}>
                              Add to Cart
                            </button>
                            <button className="submit-btn" onClick={() => handleBuyNow(ticket, s)}>
                              Buy Now
                            </button>
                          </>
                        )}

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No tickets available.</p>
              )
            ) : (
              <p>Loading tickets...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSchedule;
