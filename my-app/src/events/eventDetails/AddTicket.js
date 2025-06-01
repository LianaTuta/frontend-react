import React, { useState } from "react";
import "../../styles/forms.css";
import { useNavigate, useLocation } from "react-router-dom";
import apiService from "../../Common/apiService";

const AddTicketForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const scheduleId = state?.scheduleId; 

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    availableCount: ""
  });
  
  const [formError, setFormError] = useState({
    name: false,
    price: false,
    description: false,
    availableCount: false
  });

  const [message, setMessage] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formError[field]) {
      setFormError((prev) => ({ ...prev, [field]: false }));
    }
    if (message) setMessage("");
  };

  const validatePrice = (value) => {
    return !isNaN(value) && Number(value) > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
        name: !formData.name.trim(),
        price: !validatePrice(formData.price),
        description: !formData.description.trim(),
        availableCount: !formData.availableCount || Number(formData.availableCount) <= 0
      };

    setFormError(errors);

    if (Object.values(errors).some(Boolean)) {
      setMessage("Please fill all fields correctly.");
      return;
    }

    if (!scheduleId) {
      setMessage("Schedule ID is missing.");
      return;
    }

    try {
      const payload = {
        eventScheduleId: scheduleId,
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        mumberOfAvailableTickets : parseInt(formData.availableCount, 10)
      };

      const res = await apiService.request(
        "ticket",  
        "POST",
        payload,
        { "Content-Type": "application/json" }
      );

      if (res.status === 200) {
        navigate(-1);
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to add ticket.");
      }
    } catch (err) {
      console.error("Add ticket error:", err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Add New Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className={formError.name ? "required" : ""}>
              Ticket Name {formError.name && <span className="asterisk">*</span>}
            </label>
            <input
              type="text"
              maxLength={30}
              className={`input-field ${formError.name ? "error" : ""}`}
              placeholder="Ticket Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className={formError.price ? "required" : ""}>
              Price {formError.price && <span className="asterisk">*</span>}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`input-field ${formError.price ? "error" : ""}`}
              placeholder="Price (e.g. 20.00)"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className={formError.availableCount ? "required" : ""}>
                Number of Available Tickets {formError.availableCount && <span className="asterisk">*</span>}
            </label>
            <input
                type="number"
                min="1"
                className={`input-field ${formError.availableCount ? "error" : ""}`}
                placeholder="Enter number of tickets"
                value={formData.availableCount}
                onChange={(e) => handleChange("availableCount", e.target.value)}
            />
            </div>

          <div className="form-group">
            <label className={formError.description ? "required" : ""}>
              Description {formError.description && <span className="asterisk">*</span>}
            </label>
            <textarea
              maxLength={200}
              rows={4}
              className={`input-field ${formError.description ? "error" : ""}`}
              placeholder="Ticket Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="form-button-row">
            <button type="submit" className="login-btn">
              Add Ticket
            </button>
          </div>

          {message && <p className="error-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddTicketForm;
