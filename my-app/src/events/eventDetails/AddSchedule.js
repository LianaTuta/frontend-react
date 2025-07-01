import React, { useState } from "react";
import "../../styles/forms.css";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiService from "../../Common/apiService";
import useAuthValidation from "../../Common/useAuthValidation";
import { Roles } from "../../constants/roleEnum";

const AddSchedulePage = () => {
    useAuthValidation(Roles.MANAGER);
  const navigate = useNavigate();
  const { state } = useLocation();
  const eventId = state?.eventId;

  const [formData, setFormData] = useState({
    location: "",
    startDate: new Date(),
    endDate: new Date()
  });

  const [formError, setFormError] = useState({
    location: false,
    startDate: false,
    endDate: false
  });

  const [message, setMessage] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formError[field] && value) {
      setFormError((prev) => ({ ...prev, [field]: false }));
    }
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();

    const errors = {
      location: !formData.location.trim(),
      startDate:
        !formData.startDate || new Date(formData.startDate) < now ,
      startDateError : !formData.startDate || new Date(formData.endDate) <= new Date(formData.startDate),
      endDate:
        !formData.endDate ||
        new Date(formData.endDate) <= new Date(formData.startDate)
    };
    setFormError(errors);
    const hasError = Object.values(errors).some(Boolean);
    if (hasError || !eventId) {
      if (errors.location) {
        setMessage("Location is required.");
      } 
      else if (errors.startDate) {
        setMessage("Start date must be in the future.");
      } 
      else if (errors.endDate) {
        setMessage("End date must be after the start date.");
      } 
      else if (errors.startDateError) {
        setMessage("Start date must be before the end date ");
      } 
      else {
        setMessage("All fields are required.");
      }
      return;
    }
    console.log(eventId)
    try {
      const payload = {
        eventId : eventId,
        location: formData.location.trim(),
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        name : ""
      };

      const res = await apiService.request("eventschedule/event-schedule", "POST", payload, {
        "Content-Type": "application/json"
      });

      if (res.status === 200) {
        navigate(-1);
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to create schedule.");
      }
    } catch (err) {
      console.error("Schedule creation error:", err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Add New Schedule</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className={formError.location ? "required" : ""}>
              Location {formError.location && <span className="asterisk">*</span>}
            </label>
            <input
              type="text"
              maxLength={30}
              className={`input-field ${formError.location ? "error" : ""}`}
              placeholder="Schedule Location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
            <div className="char-count">{formData.location.length}/30</div>
          </div>

          <div className="form-group">
            <label className={formError.startDate ? "required" : ""}>
              Start Date {formError.startDate && <span className="asterisk">*</span>}
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => handleChange("startDate", date)}
              showTimeSelect
              dateFormat="Pp"
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className={formError.endDate ? "required" : ""}>
              End Date {formError.endDate && <span className="asterisk">*</span>}
            </label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => handleChange("endDate", date)}
              showTimeSelect
              dateFormat="Pp"
              className="input-field"
            />
          </div>

          <div className="form-button-row">
            <button type="submit" className="login-btn">
              Create Schedule
            </button>
          </div>

          {message && <p className="error-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddSchedulePage;
