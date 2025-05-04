import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./account/LoginPage";
import CreateAccount from "./account/CreateAccount";
import HomePage from "./HomePage";
import CreateEventForm from "./events/CreateEvent";
import EventsPage from "./events/EventsView";
import EventDetailsPage from "./events/EventDetailsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/create-event" element={<CreateEventForm />} />
        <Route path="/all-events" element={<EventsPage />} />
        <Route path="*" element={<CreateAccount />} />
        <Route path="/event-details/:id" element={<EventDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
