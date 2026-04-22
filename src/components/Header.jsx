import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>Insurance Portal</h1>
        <p className="tagline">Secure your ride, secure your life</p>
      </div>
      <nav className="nav">
        <ul>
          {/* <li><Link to="/two-wheeler">Two-Wheeler Insurance</Link></li>
          <li><Link to="/four-wheeler">Four-Wheeler Insurance</Link></li> */}
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/help">Help</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
      <div className="cta">
        <Link to="/quote" className="quote-btn">Get a Quote</Link>
      </div>
    </header>
  );
}
