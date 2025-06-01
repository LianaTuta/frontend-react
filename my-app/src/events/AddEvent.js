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
    photo: null,
  });
  const [formError, setFormError] = useState({
    name: false,
    description: false,
    eventTypeId: false,
    photo: false,
  });
  const [message, setMessage] = useState("");

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

  const handleChange = (field) => (e) => {
    const value = field === "photo" ? e.target.files[0] : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (formError[field] && value) {
      setFormError((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
    if (message) {
      setMessage("");
    }
  };

  const handleSubmit = async () => {
    const errors = {
      name: !formData.name.trim(),
      description: !formData.description.trim(),
      eventTypeId: !formData.eventTypeId,
      photo: !formData.photo,
    };

    setFormError(errors);

    if (Object.values(errors).some(Boolean)) {
      setMessage("All fields are required.");
      return;
    }

    const queryParams = new URLSearchParams({
      Name: formData.name,
      Description: formData.description,
      EventTypeId: formData.eventTypeId
    }).toString();
    const formDataRequest = new FormData();
    formDataRequest.append("Photo", formData.photo); 
    console.log("Photo file:", formData.photo);
    try {
      const res = await apiService.request(`event?${queryParams}`, "POST", formDataRequest)
      console.log(res.ok);
      if (res.status === 200) {
        setMessage("Event created successfully!");
        navigate("/all-events");
      } 
    } catch (err) {
      console.error("Error:", err);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Add New Event</h2>
        <form>
          <div className="form-group">
            <label>Name {formError.name && <span className="asterisk">*</span>}</label>
            <input
              type="text"
              maxLength={20}
              placeholder="Event Name"
              value={formData.name}
              onChange={handleChange("name")}
              className={formError.name ? "input-field error" : "input-field"}
            />
            <div className="char-count">{formData.name.length}/20</div>
          </div>

          <div className="form-group">
            <label>Description {formError.description && <span className="asterisk">*</span>}</label>
            <textarea
              maxLength={200}
              rows={4}
              placeholder="Event Description"
              value={formData.description}
              onChange={handleChange("description")}
              className={formError.description ? "input-field error" : "input-field"}
            />
            <div className="char-count">{formData.description.length}/200</div>
          </div>

          <div className="form-group">
            <label>Event Category {formError.eventTypeId && <span className="asterisk">*</span>}</label>
            <select
              value={formData.eventTypeId}
              onChange={handleChange("eventTypeId")}
              className={formError.eventTypeId ? "input-field error" : "input-field"}
            >
              <option value="">Select a category</option>
              {eventTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Photo (poster) {formError.photo && <span className="asterisk">*</span>}</label>
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

          <button type="button" className="login-btn" onClick={handleSubmit}>
            Create Event
          </button>

          {message && <div className="error-message">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
