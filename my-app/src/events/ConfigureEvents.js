import React from "react";
import { useNavigate } from "react-router-dom";
import AuthHelper from "../Common/authHelper";
import { Roles } from "../constants/roleEnum";
import "../styles/forms.css";

const ConfigureEvents = () => {
  const navigate = useNavigate();

  if (!AuthHelper.hasRole(Roles.MANAGER)) {
    navigate("/all-events");
    return null;
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Event Management Hub</h2>
        <p className="account-link" style={{ marginBottom: "1.5rem" }}>
          Welcome! As a manager, you're in charge of curating amazing experiences for your community.
          From exciting new events to keeping existing ones up to date — everything starts here.
        </p>

        <div className="form-button-row">
          <button
            onClick={() => navigate("/add-event")}
            className="submit-btn"
          >
            ➕ Create a New Event
          </button>
        </div>

        <div className="form-button-row">
          <button
            onClick={() => navigate("/all-events")}
            className="submit-btn"
          >
            ✏️ Manage Existing Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigureEvents;
