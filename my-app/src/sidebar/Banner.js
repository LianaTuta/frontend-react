import React from "react";
import { Link } from "react-router-dom";
import "./Banner.css";

const Banner = ({ message }) => {
  return (
    <div className="banner">
      <span>{message}</span>
      <Link to="/login" className="banner-link">
        Login
      </Link>
    </div>
  );
};

export default Banner;
