import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import "./CartPage.css";
import EventImageCard from "../images/EventImageCard";
import { formatDate } from "../utils/formatDate";
import apiService from "../Common/apiService";
import { useNavigate } from "react-router-dom";
import useAuthValidation from "../Common/useAuthValidation";

export const CartPage = () => {
  const { cartItems, clearCart, removeItemByIndex } = useCart();
  const [validityMap, setValidityMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useAuthValidation();

  const total = cartItems.reduce((sum, item, index) => {
    return sum + Number(item.price);
  }, 0);

  const allValid = cartItems.every(item => validityMap[item.id]);


  useEffect(() => {
    const validateTickets = async () => {
      setLoading(true);
      const newMap = {};
      console.log(cartItems);
      for (const item of cartItems) {
        try {
          const res = await apiService.get(`order/is-valid-ticket/${item.id}`);
          newMap[item.id] = res.body.Data.isValid === true;
        } catch {
          newMap[item.id] = false;
        }
      }

      setValidityMap(newMap);
      setLoading(false);
    };

    if (cartItems.length > 0) {
      validateTickets();
    } else {
      setValidityMap({});
      setLoading(false);
    }
  }, [cartItems]);

  const handleCheckout = async () => {
    try {
      const now = new Date().toISOString();
      const orderTickets = cartItems
        .filter(item => validityMap[item.id]) 
        .map(item => ({
          id: item.id,
          startDate: now,
        }));

      const response = await apiService.request(
        "order/place-order",
        "POST",
        { orderTickets }
      );

      if (response.status === 200) {
        const returnUrl = response.body?.Data?.returnUrl;
        if (returnUrl) {
          window.location.href = returnUrl;
        }
        clearCart();
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const handleRemove = (index) => {
    removeItemByIndex(index);
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {loading ? (
        <p>Validating tickets...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item, index) => {
              const isValid = validityMap[item.id];
              return (
                <div key={index} className={`cart-item ${!isValid ? "cart-item-disabled" : ""}`}>
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
                    {!isValid && (
                      <div className="cart-warning">This ticket is no longer available.</div>
                    )}
                  </div>
                  
                  <button onClick={() => handleRemove(index)}>Remove</button>
                </div>
              );
            })}
          </div>
          <div className="cart-summary">
            <div className="cart-total-amount">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} disabled={!allValid}>
              Checkout
            </button>
           
          </div>
          <div className="cart-summary">
            {!allValid && (
              <p className="cart-global-warning">Some tickets are unavailable. Please remove them to continue.</p>
            )}
           
          </div>
          
        </>
      )}
    </div>
  );
};

export default CartPage;
