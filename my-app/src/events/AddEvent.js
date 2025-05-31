import React, { useEffect, useState } from "react";
import "../styles/forms.css";
import { useNavigate } from "react-router-dom";
import apiService from "../Common/apiService.js";
import useAuthValidation from "../Common/useAuthValidation.js";
import { Roles } from "../constants/roleEnum"; 

const AddEvent = () => {
   useAuthValidation(Roles.MANAGER);
  const [eventTypes, setEventTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eventTypeId: "",
    photo: null
  });
  const [formError, setFormError] = useState({
    name: false,
    description: false,
    eventTypeId: false,
    photo: false
  });
  
  const [message, setMessage] = useState("");
  const handleChange = (field) => (e) => {
    const value = field === "photo" ? e.target.files[0] : e.target.value;
  
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  
    if (formError[field] && value) {
      setFormError((prev) => ({
        ...prev,
        [field]: false
      }));
    }
    if (message) {
      setMessage("");
    }
  };


  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await apiService.request("EventType/event-type", "GET");
        if (response.status === 200 && response.body?.Data) {
          setEventTypes(response.body.Data);
        } else {
          setMessage("Failed to load event categories.");
        }
      } catch (error) {
        console.error("Failed to fetch event types:", error);
        setMessage("Could not retrieve event types.");
      }
    };

    fetchEventTypes();
  }, []);

  const handleSubmit = async () => {
    const errors = {
      name: !formData.name.trim(),
      description: !formData.description.trim(),
      eventTypeId: !formData.eventTypeId,
      photo: !formData.photo
    };
  
    setFormError(errors);
  
    const hasError = Object.values(errors).some(Boolean);
    if (hasError) {
      setMessage("All fields are required.");
      return;
    }

    const formDataRequest = new FormData();
    formDataRequest.append("Name", formData.name);
    formDataRequest.append("Description", formData.description);
    formDataRequest.append("EventTypeId", formData.eventTypeId);
    formDataRequest.append("Photo", formData.photo);
    
    try {
      const res = await apiService.request("event", "POST", formDataRequest);

      const data = await res.json();

      if (res.ok) {
        setMessage("Event created successfully!");
        navigate("/all-events");
      } else {
        setMessage(data.message || "Failed to create event.");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Add New Event</h2>
        <form className="create-account-form">
          <div className="form-field">
            <label className={formError.name ? "required" : ""}>
              Name {formError.name && <span className="asterisk">*</span>}
            </label>
            <input
              type="text"
              maxLength={20}
              className={`input-field ${formError.name ? "error" : ""}`}
              placeholder="Event Name"
              value={formData.name}
              onChange={handleChange("name")}
          
            />
          <div className="char-count">{formData.name.length}/20</div>
          </div>

          <div className="form-field">
          <label className={formError.description ? "required" : ""}>
            Description {formError.description && <span className="asterisk">*</span>}
          </label>
          <textarea
            maxLength={200}
            rows={4}
            value={formData.description}
            onChange={handleChange("description")}
            className={`input-field ${formError.description ? "error" : ""}`}
            placeholder="Event Description"
          />
          <div className="char-count">{formData.description.length}/200</div>
        </div>


          <div className="form-field">
            <label className={formError.eventTypeId ? "required" : ""}>
              Event Category {formError.eventTypeId && <span className="asterisk">*</span>}
            </label>
            <select
                value={formData.eventTypeId}
                onChange={handleChange("eventTypeId")}
                className={`input-field ${formError.eventTypeId ? "error" : ""}`}
            >
              <option value="">Select a category</option>
              {eventTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className={formError.photo ? "required" : ""}>
              Photo (poster) {formError.photo && <span className="asterisk">*</span>}
            </label>

            <label htmlFor="file-upload" className="submit-btn custom-file-btn">
              {formData.photo ? formData.photo.name : "Choose File"}
            </label>

            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleChange("photo")}
              className="hidden-file-input"
            />
        </div>
          <div className="form-button-row">
            <button type="button" className="submit-btn" onClick={handleSubmit}>
              Create Event
            </button>
          </div>

          {message && <p className="error-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
