import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./OrderFilter.css"

const OrderFilter = ({
  filter,
  setFilter,
  eventNameFilter,
  setEventNameFilter,
  ticketNameFilter,
  setTicketNameFilter,
  dateRange,
  setDateRange,
}) => {
  const [startDate, endDate] = dateRange;

  return (
    <div className="order-filter">
      <label>
        Status:
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>

      <label>
        Event Name:
        <input
          type="text"
          value={eventNameFilter}
          onChange={e => setEventNameFilter(e.target.value)}
          placeholder="Filter by event"
        />
      </label>

      <label>
        Ticket Name:
        <input
          type="text"
          value={ticketNameFilter}
          onChange={e => setTicketNameFilter(e.target.value)}
          placeholder="Filter by ticket"
        />
      </label>

      <label>
        Date Range:
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={update => setDateRange(update)}
          isClearable={true}
          placeholderText="Select date range"
        />
      </label>
    </div>
  );
};

export default OrderFilter;
