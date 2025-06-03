import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiService from "../Common/apiService";
import "./ValidateTicket.css";
import AuthHelper from "../Common/authHelper";
import { formatDate } from "../utils/formatDate";
import { Roles } from "../constants/roleEnum";
import { TicketStatus } from "./TIcketStatus";

const ValidateTicketPage = () => {
  const { code } = useParams();
  const [ticketInfo, setTicketInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const isManager = AuthHelper.hasRole(Roles.MANAGER);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const response = await apiService.request(`ticket/validate-ticket/${code}`, "GET");
      if (response.status === 200) {
        setTicketInfo(response.body.Data);
        setError(null);
      } 
      else if(response.status === 404){
        setError(response.body?.Data?.Message);
      }
      else {
        setError("Ticket validation failed.");
      }
    } catch (err) {
      setError("Error validating ticket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [code]);

  const handleValidate = async () => {
    setActionLoading(true);
    try {
      const response = await apiService.request(`ticket/validate-ticket`, "POST", {
        code,
        status: TicketStatus.UsedValid,  
      });
      if (response.status === 200) {
        setError(null);
        await fetchTicket();
      } 
      else if(response.status === 404){
        setError(response.body?.Data?.Message);
      }else {
        setError("Failed to validate ticket.");
      }
    } catch {
      setError("Error during ticket validation.");
    }
    setActionLoading(false);
  };

  const handleInvalidate = async () => {
    setActionLoading(true);
    try {
      const response = await apiService.request(`ticket/validate-ticket`, "POST", {
        code,
        status: TicketStatus.Invalid,  
      });
      if (response.status === 200) {
        setError(null);
        await fetchTicket();
      } else if(response.status === 404){
        setError(response.body?.Data?.Message);
      }
      else {
        setError("Failed to invalidate ticket.");
      }
    } catch {
      setError("Error during ticket invalidation.");
    }
    setActionLoading(false);
  };

  if (loading) {
    return <div className="validate-ticket-page"><p>Loading ticket information...</p></div>;
  }

  if (error) {
    return <div className="validate-ticket-page error"><p>{error}</p></div>;
  }

  if (!ticketInfo) {
    return <div className="validate-ticket-page"><p>No ticket information found.</p></div>;
  }

  const { ticketDetails, ticketStatus } = ticketInfo;

  const getStatusText = (status) => {
    switch (status) {
      case TicketStatus.Active:
        return "Valid";
      case TicketStatus.Cancelled:
        return "Cancelled";
      case TicketStatus.UsedValid:
        return "Used & Valid";
      case TicketStatus.Invalid:
        return "Invalid";
      default:
        return "Unknown status";
    }
  };


  const buttonsDisabled = [TicketStatus.UsedValid, TicketStatus.Invalid, TicketStatus.Cancelled].includes(ticketStatus);

  return (
    <div className="validate-ticket-page">
      <h2>Ticket</h2>
      <div className="ticket-info">
        <p><strong>Event:</strong> {ticketDetails.eventName}</p>
        <p><strong>Ticket:</strong> {ticketDetails.ticketName}</p>
        <p>
          <strong>Schedule:</strong> {formatDate(ticketDetails.eventScheduleStartDate)} - {formatDate(ticketDetails.eventScheduleEndDate)}
        </p>
        <p><strong>Price:</strong> ${ticketDetails.price}</p>
        <p><strong>Status:</strong> {getStatusText(ticketStatus)}</p>
      </div>

      {isManager && (
        <div className="manager-actions">
          <button 
            onClick={handleValidate} 
            disabled={actionLoading || buttonsDisabled} 
            className="validate-btn"
          >
            Validate
          </button>
          <button 
            onClick={handleInvalidate} 
            disabled={actionLoading || buttonsDisabled} 
            className="invalidate-btn"
          >
            Invalidate
          </button>
        </div>
      )}
    </div>
  );
};

export default ValidateTicketPage;
