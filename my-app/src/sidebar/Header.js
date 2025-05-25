import React from "react";
import { useCart } from "../Order/CartContext";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div/>
      <div className="cart-section" onClick={() => navigate("/cart")}>
        <FaShoppingCart />
        {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
            )}
        </div>
    </header>
  );
};

export default Header;
