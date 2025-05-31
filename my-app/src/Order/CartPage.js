import React from "react";
import { useCart } from "./CartContext";
import "./CartPage.css";
import EventImageCard from "../images/EventImageCard";
import { formatDate } from "../utils/formatDate";
import apiService from "../Common/apiService";
import { useNavigate } from "react-router-dom";
import useAuthValidation from "../Common/useAuthValidation";

export const CartPage = () => {
  const { cartItems, clearCart, removeItemByIndex } = useCart();
  const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
  useAuthValidation();
  const handleCheckout = async () => {
    try {
      const now = new Date().toISOString();
      const orderTickets = cartItems.map((item) => ({
        id: item.id,
        startDate: now,
      }));

      const response = await apiService.request(
        "order/place-order",
        "POST",
        { orderTickets: orderTickets }
      );

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
          <div className="cart-list">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-image-wrapper">
                  <EventImageCard src={item.imagePath} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <strong>{item.name}</strong>
                    <span className="cart-item-price">${item.price}</span>
                  </div>
                  <div className="cart-line">{item.description}</div>
                  <div className="cart-line">
                    {formatDate(item.scheduleStart)} – {formatDate(item.scheduleEnd)}
                  </div>
                  <div className="cart-line">Location: {item.location}</div>
                  <div className="cart-line">Event: {item.eventName}</div>
                </div>
                <button onClick={() => handleRemove(index)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total-amount">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout}>Checkout</button>
            </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
