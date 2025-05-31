import React, { useState, useEffect } from "react";
import EventImageCard from "../../images/EventImageCard";
import "./EventInfo.css";
import EditableTextField from "../../Common/EditableTextFileld";

const EventInfo = ({ event, isManager, onFieldChange }) => {
  const [editing, setEditing] = useState({ name: false, description: false });
  const [tempValues, setTempValues] = useState({ name: "", description: "" });


  useEffect(() => {
    if (!editing.name && !editing.description && event) {
      setTempValues({
        name: event.name || "",
        description: event.description || "",
      });
    }
  }, [event]);

  const startEditing = (field) => {
    setTempValues((prev) => ({ ...prev, [field]: event[field] || "" }));
    setEditing((prev) => ({ ...prev, [field]: true }));
  };

  const confirmEdit = (field) => {
    onFieldChange(field, tempValues[field]);
    setEditing((prev) => ({ ...prev, [field]: false }));
  };

  const discardEdit = (field) => {
    setTempValues((prev) => ({ ...prev, [field]: event[field] }));
    setEditing((prev) => ({ ...prev, [field]: false }));
  };


  
  return (
    <div className="event-info">
      <div className="editable-row">
      <EditableTextField
        fieldKey="name"
        value={event.name}
        isManager={isManager}
        maxLength={20}
        onConfirm={onFieldChange}
        onDiscard={() => console.log("Description edit discarded")}
        displayClassName="text-event-name"  
        />

      </div>
      <div className="editable-row">
            <EditableTextField
            fieldKey="description"
            value={event.description}
            isManager={isManager}
            onConfirm={onFieldChange}
            onDiscard={() => console.log("Description edit discarded")}
            as="textarea"
            maxLength={200}
            displayClassName="text-description-name"
        />
      </div>
      <EventImageCard src={event?.imagePath} alt={event?.name} />
    </div>
  );
};

export default EventInfo;
