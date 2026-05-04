import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Brand & Purpose */}
          <div className="footer-section footer-logo-box">
            <h2>LTI Insurance</h2>
            <p className="footer-desc">
              Redefining automotive security through smart insurance tech. 
              Licensed and regulated by IRDAI.
            </p>
            <div className="social-icons" style={{ marginTop: '25px' }}>
              <a href="#" className="social-link"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="#" className="social-link"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="#" className="social-link"><i className="fa-brands fa-instagram"></i></a>
            </div>
          </div>

          {/* Navigational Assets */}
          <div className="footer-section">
            <h3>Ecosystem</h3>
            <ul>
              <li><Link to="/buy">Policy Purchase</Link></li>
              <li><Link to="/claims">FastTrack Claims</Link></li>
              <li><Link to="/renew">Renewal Hub</Link></li>
              <li><Link to="/partners">Garage Network</Link></li>
            </ul>
          </div>

          {/* Contact Integration */}
          <div className="footer-section">
            <h3>HQ Support</h3>
            <div className="contact-item">
              <i className="fa-solid fa-phone-volume"></i>
              <span> 1800 555 0199</span>
            </div>
            <div className="contact-item" style={{ margin: '15px 0' }}>
              <i className="fa-solid fa-envelope-open-text"></i>
              <span> help@ltiinsurance.com</span>
            </div>
            <div className="contact-item">
              <i className="fa-solid fa-map-pin"></i>
              <span> Coimbatore, IN</span>
            </div>
          </div>

          {/* The "Surprise" Newsletter Component */}
          <div className="footer-section">
            <div className="newsletter-box">
              <h3>Secure Updates</h3>
              <p style={{ fontSize: '0.85rem', color: '#8892b0' }}>
                Join 50k+ drivers getting monthly safety insights.
              </p>
              <div className="newsletter-input-group">
                <input type="email" placeholder="Work email..." />
                <button className="newsletter-btn">Join</button>
              </div>
            </div>
          </div>

        </div>

        {/* Global Legal Bar */}
        <div className="footer-bottom">
          <p style={{ fontSize: '0.8rem', color: '#8892b0' }}>
            &copy; {new Date().getFullYear()} LTI Insurance Co. Ltd.
          </p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/compliance">Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}