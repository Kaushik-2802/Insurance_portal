import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-wrapper">
      <Header />

      {/* Hero Carousel Section */}
      <section id="hero" className="hero-section">
        <div
          id="insuranceCarousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="overlay-gradient"></div>
              <img src="1.png" className="d-block w-100 hero-img" alt="Car Insurance" />
              <div className="carousel-caption custom-caption">
                <span className="badge-premium">Premium Coverage</span>
                <h1>The Digital Evolution of Insurance</h1>
                <p>
                  LTI Insurance modernizes traditional coverage by bringing a simple,
                  fair, and digital experience directly to your smartphone.
                </p>
              </div>
            </div>

            <div className="carousel-item">
              <div className="overlay-gradient"></div>
              <img src="2.png" className="d-block w-100 hero-img" alt="Scooter Insurance" />
              <div className="carousel-caption custom-caption">
                <span className="badge-premium">Premium Coverage</span>
                <h1>Smarter Protection for Every Ride</h1>
                <p>
                  Secure your journey instantly with digital insurance plans designed
                  to keep you and your electric scooter protected across the city.
                </p>
              </div>
            </div>

            <div className="carousel-item">
              <div className="overlay-gradient"></div>
              <img src="3.png" className="d-block w-100 hero-img" alt="Family Insurance" />
              <div className="carousel-caption custom-caption">
                <span className="badge-premium">Premium Coverage</span>
                <h1>Comprehensive Peace of Mind for Your Family</h1>
                <p>
                  Drive with confidence knowing our intelligent auto insurance protects
                  what matters most on every journey.
                </p>
              </div>
            </div>

            <div className="carousel-item">
              <div className="overlay-gradient"></div>
              <img src="4.png" className="d-block w-100 hero-img" alt="Claims Insurance" />
              <div className="carousel-caption custom-caption">
                <span className="badge-premium">Premium Coverage</span>
                <h1>Instant Claims at Your Fingertips</h1>
                <p>
                  Experience the future of claims with AI-driven verification that turns
                  a simple photo into an instant approval.
                </p>
              </div>
            </div>

            <div className="carousel-item">
              <div className="overlay-gradient"></div>
              <img src="5.png" className="d-block w-100 hero-img" alt="Mobility Insurance" />
              <div className="carousel-caption custom-caption">
                <span className="badge-premium">Premium Coverage</span>
                <h1>A Shield for All Your Mobility Needs</h1>
                <p>
                  Whether you are on two wheels or four, our integrated digital protection
                  ensures every vehicle in your life is covered by a single, secure shield.
                </p>
              </div>
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#insuranceCarousel"
            data-bs-slide="prev"
          >
            <span className="control-icon">
              <i className="fa-solid fa-chevron-left"></i>
            </span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#insuranceCarousel"
            data-bs-slide="next"
          >
            <span className="control-icon">
              <i className="fa-solid fa-chevron-right"></i>
            </span>
          </button>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <strong>50k+</strong>
          <span>Users Secured</span>
        </div>
        <div className="stat-item">
          <strong>98%</strong>
          <span>Claims Settled</span>
        </div>
        <div className="stat-item">
          <strong>24/7</strong>
          <span>Roadside Assist</span>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="about-grid">
        <div className="about-content">
          <span className="section-subtitle">Since 1998</span>
          <h2>Protecting What <br /> Matters To You</h2>
          <p>
            At Shield General, we don't just sell policies; we build safety nets.
            From commercial fleets to your first bike, we ensure accidents don't
            become financial burdens.
          </p>
          <ul className="benefits-list">
            <li><i className="fa-solid fa-check"></i> Paperless Claims</li>
            <li><i className="fa-solid fa-check"></i> 4500+ Network Garages</li>
          </ul>
        </div>
        <div className="about-image-box">
          <div className="glass-card">
            <h4>"Fastest claim process I've ever experienced."</h4>
            <p>- Rahul S., Coimbatore</p>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section id="help" className="help-section">
        <h2>Need Help?</h2>
        <p>
          Our support team is available 24/7 to assist you with claims, policy
          details, and roadside emergencies.
        </p>
        <ul>
          <li><i className="fa-solid fa-phone"></i> Call us anytime</li>
          <li><i className="fa-solid fa-envelope"></i> support@shieldinsurance.com</li>
        </ul>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-wrap">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Let's Talk Security</h2>
            <p>
              Have questions about your premium or coverage? Our experts are a
              message away.
            </p>
            <div className="contact-method">
              <i className="fa-solid fa-headset"></i>
              <div>
                <span>Call Center</span>
                <p>1800-SHIELD-01</p>
              </div>
            </div>
          </div>

          <form className="contact-form-premium">
            <div className="input-group-row">
              <input type="text" placeholder="Full Name" />
              <input type="email" placeholder="Email Address" />
            </div>
            <textarea placeholder="How can we help you?" rows="4"></textarea>
            <button type="submit" className="submit-btn-premium">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
