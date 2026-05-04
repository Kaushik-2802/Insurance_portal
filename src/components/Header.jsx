import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>LTI Insurance</h1>
        <p className="tagline">Secure your ride, secure your life</p>
      </div>
      <nav className="nav">
        <ul>
          {/* <li><Link to="/two-wheeler">Two-Wheeler Insurance</Link></li>
          <li><Link to="/four-wheeler">Four-Wheeler Insurance</Link></li> */}
          <li><a href="#about">About Us</a></li>
          <li><a href="#contact">Contact Us</a></li>
          <li><a href="#help">Help</a></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
      {/* <div className="cta">
        <Link to="/quote" className="quote-btn">Get a Quote</Link>
      </div> */}
    </header>
  );
}
