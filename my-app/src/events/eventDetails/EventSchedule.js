import React, { useState } from "react";
import "./EventSchedule.css"
import EditableDateField from "../../Common/EditableDateField";
import EditableTextField from "../../Common/EditableTextFileld";
import { FaDollarSign } from "react-icons/fa";

const EventSchedule = ({
  schedules,
  isManager,
  ticketsBySchedule,
  handleAddToCart,
  handleBuyNow,
  onScheduleFieldChange,
  validationErrors,
  setValidationErrors,
  onTicketFieldChange
}) => {
  const [editingFields, setEditingFields] = useState({});
  const [tempFields, setTempFields] = useState({});

  const toggleEdit = (id, field, originalValue) => {
    setEditingFields(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: true },
    }));
    setTempFields(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: originalValue },
    }));
  };

  const confirmChange = (id, field, value) => {
    console.log("confirm change ", id, field, value);
    const now = new Date();
  
    const schedule = schedules.find(s => s.id === id);
    const start = field === "startDate" ? value : schedule?.startDate;
    const end = field === "endDate" ? value : schedule?.endDate;
  

    const errors = {};
  
    if (field === "startDate" && new Date(start) < now) {
      errors.startDate = "Start date cannot be in the past.";
    }
  
    if (field === "endDate" && new Date(end) <= new Date(start)) {
      errors.endDate = "End date must be after the start date.";
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
  
    onScheduleFieldChange(id, field, value);
  
    setEditingFields((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: false },
    }));
  };

  const discardChange = (id, field) => {
    setEditingFields(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: false }
    }));
  };

  const handleTempChange = (id, field, value) => {
    setTempFields(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  };

  return (
    <div className="event-schedule">
      <h1>Schedules</h1>
      <div className="schedule-container">
        {schedules.map(s => (
          <div key={s.id} className="schedule-block">

            <div className="location-inline-wrapper">
            <span className="location-label">Location:</span>
            <EditableTextField
                fieldKey="location"
                value={s.location}
                isManager={isManager}
                maxLength={30}
                onConfirm={(key,val) => confirmChange(s.id, key , val)}
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
              />
              <div className="arrow-separator">→</div>
              <EditableDateField
                label="End"
                value={s.endDate}
                isManager={isManager}
                onConfirm={(date) => confirmChange(s.id, "endDate", date)}
                onDiscard={() => discardChange(s.id, "endDate")}
              />
            </div>
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
                                        onConfirm={(key, val) => onTicketFieldChange(ticket.id, key, val)}
                                        onDiscard={() => {}}
                                        className="ticket-title edit-below"
                                    />

                                <div className="ticket-price-wrapper">
                                <FaDollarSign className="currency-icon" />
                                <EditableTextField
                                    fieldKey="price"
                                    value={ticket.price.toString()}
                                    isManager={isManager}
                                    onConfirm={(key, val) => onTicketFieldChange(ticket.id, key, val)
                                    }
                                    onDiscard={() => {}}
                                    className="ticket-price-edit"
                                    displayClassName="ticket-price-text"
                                    editButtonBelow={true} 
                                />
                                </div>

                                </div>

                        <div className="ticket-description">
                            <EditableTextField
                            fieldKey="description"
                            value={ticket.description}
                            maxLength={200}
                            isManager={isManager}
                            onConfirm={(key, val) => onTicketFieldChange(ticket.id, key, val)}
                            onDiscard={() => {}}
                            as="textarea"
                            className="ticket-description-edit"
                            />
                        </div>

                        <div className="ticket-actions">
                            <button className="submit-btn" onClick={() => handleAddToCart(ticket, s)}>
                            Add to Cart
                            </button>
                            <button className="submit-btn" onClick={() => handleBuyNow(ticket)}>
                            Buy Now
                            </button>
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
