import React from "react";
import { useCart } from "./CartContext";
import "./CartPage.css";
import EventImageCard from "../images/EventImageCard";
import { formatDate } from "../utils/formatDate";
import apiService from "../apiService";
import { useNavigate } from "react-router-dom";

export const  CartPage = () => {
  const { cartItems, clearCart , removeItemByIndex} = useCart();
  const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

  const handleCheckout = async () => {
    try {
        const now = new Date().toISOString();
       const  orderTickets = cartItems.map((item) => ({
            id: item.id,
            startDate: now
          }));
      
        const response =   await apiService.request(
            "order/place-order",
            "POST",
            { orderTickets: orderTickets }
          );

        console.log(response);
        if (response.status === 200) {
            const returnUrl = response.body?.Data?.returnUrl;
            if (returnUrl) {
            window.location.href = returnUrl;
            } 
          alert("Order placed successfully!");
          clearCart();
          navigate("/confirmation");
        } else {
          alert("Failed to place order. Please try again.");
        }
      } catch (error) {
        console.error("Checkout error:", error);
        alert("An error occurred during checkout.");
      }
  };

  const handleRemove = (index) => {
    removeItemByIndex(index);
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
               <div className="cart-image-wrapper">
                <EventImageCard src={item.imagePath} alt={item.name} />
                </div>
                <div className="cart-item-details">
                <div className="cart-item-header">
                    <strong>{item.name}</strong>
                    <span className="cart-item-price">${item.price}</span>
                </div>
                <small>{item.description}</small>
                <br />
                <small>
                    {formatDate(item.scheduleStart)} – {formatDate(item.scheduleEnd)}
                </small>
                <br />
                <small>Location: {item.location}</small>
                <br />
                <small>Event: {item.eventName}</small>
                </div>
              <button onClick={() => handleRemove(index)}>Remove</button>
            </li>
            
            ))}
          </ul>
          <div className="cart-summary">
            <strong>Total:</strong> ${total.toFixed(2)}
            <button onClick={handleCheckout}>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
