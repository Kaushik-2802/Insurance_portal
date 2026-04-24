import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Company Info */}
        <div className="footer-section about">
          <h2>Shield General</h2>
          <p>
            Your trusted partner for Two-Wheeler and Four-Wheeler insurance.
            Protecting your journey, every mile of the way.
          </p>
        </div>

        {/* Quick Links
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/two-wheeler">Two-Wheeler Insurance</Link></li>
            <li><Link to="/four-wheeler">Four-Wheeler Insurance</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/help">Help</Link></li>
          </ul>
        </div> */}

        {/* Contact Info */}
        <div className="footer-section contact">
          <h3>Contact</h3>
          <p>Email: support@shieldgeneral.com</p>
          <p>Phone: +91-9876543210</p>
          <p>Address: Coimbatore, Tamil Nadu, India</p>
        </div>

        {/* Social Media */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-x-twitter"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2026 Shield General. All rights reserved.</p>
      </div>
    </footer>
  );
}
