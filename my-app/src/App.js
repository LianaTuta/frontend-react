import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./account/LoginPage";
import CreateAccount from "./account/CreateAccount";
import HomePage from "./HomePage";
import CreateEventForm from "./events/CreateEvent";
import EventsPage from "./events/EventsView";
import EventDetailsPage from "./events/EventDetailsPage";
import SidebarLayout from "./sidebar/Sidebar";
import { CartProvider } from "./Order/CartContext";
import { CartPage } from "./Order/CartPage"

const App = () => {
  return (
    <CartProvider>

    <Router>
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/create-event" element={<CreateEventForm />} />
        <Route path="/all-events" element={<EventsPage />} />
        <Route path="*" element={<EventsPage />} />
        <Route path="/event-details/:id" element={<EventDetailsPage />} />
        </Route>
      </Routes>
    </Router>
    </CartProvider>
  );
};

export default App;
