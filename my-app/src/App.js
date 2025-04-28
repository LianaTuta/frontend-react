import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./account/LoginPage";
import CreateAccount from "./account/CreateAccount";
import HomePage from "./HomePage";
import CreateEventForm from "./events/CreateEvent";
import EventsPage from "./events/EventsView";
import Header from "./Header";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/create-event" element={<CreateEventForm />} />
        <Route path="/all-events" element={<EventsPage />} />
        <Route path="*" element={<CreateAccount />} />
      </Routes>
    </Router>
  );
};

export default App;
