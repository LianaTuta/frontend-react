import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./account/LoginPage";
import CreateAccount from "./account/CreateAccount";
import HomePage from "./HomePage";
import CreateEventForm from "./events/AddEvent";
import EventsPage from "./events/EventsView";
import EventDetailsPage from "./events/eventDetails/EventDetailsPage";
import SidebarLayout from "./sidebar/Sidebar";
import { CartProvider } from "./Order/CartContext";
import { CartPage } from "./Order/CartPage"
import MyOrdersPage from "./Order/MyOrdersPage";
import OrderDetailsPage from "./Order/OrderDetailsPage";
import AddEvent from "./events/AddEvent";
import ConfigureEvents from "./events/ConfigureEvents";
import AddSchedulePage from "./events/eventDetails/AddSchedule";
import AddTicketForm from "./events/eventDetails/AddTicket";
import OrderSuccessPage from "./Order/OrderSuccessPage";
import PaymentCancelledPage from "./Order/PaymentCancelledPage";
import ValidateTicketPage from "./Order/ValidateTicket";

const App = () => {
  return (
    <CartProvider>

    <Router>
      <Routes>
         <Route path="/" element={<SidebarLayout />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/create-event" element={<CreateEventForm />} />
        <Route path="/all-events" element={<EventsPage />} />
        <Route path="*" element={<EventsPage />} />
        <Route path="/event-details" element={<EventDetailsPage />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/configure-event" element={<ConfigureEvents />} />
        <Route path="/add-schedule" element={<AddSchedulePage />} />
        <Route path="/add-ticket" element={<AddTicketForm />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/cancel-payment" element={<PaymentCancelledPage />} />
        <Route path="/order-details" element={<OrderDetailsPage />} />
        <Route path="/validate-ticket/:code" element={<ValidateTicketPage />} />
         </Route>
      </Routes>
    </Router>
    </CartProvider>
  );
};

export default App;
