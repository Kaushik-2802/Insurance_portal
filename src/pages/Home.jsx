import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-wrapper">
      <Header />
      
      {/* Hero Carousel Section */}
      <section className="hero-section">
        <div id="insuranceCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="overlay-gradient"></div>
              <img src="img1.png" className="d-block w-100 hero-img" alt="Car Insurance" />
              <div className="carousel-caption custom-caption">
                <span className="badge-premium">Premium Coverage</span>
                <h1>Drive with Confidence</h1>
                <p>Comprehensive protection for every journey you take.</p>
              </div>
            </div>

            <div className="carousel-item">
              <div className="overlay-gradient"></div>
              <img src="img2.png" className="d-block w-100 hero-img" alt="Car Insurance" />
              <div className="carousel-caption custom-caption">
                <span className="badge-premium">Premium Coverage</span>
                <h1>Drive with  over Confidence</h1>
                <p>Comprehensive protection for every journey you take.</p>
              </div>
            </div>

            <div className="carousel-item">
              <div className="overlay-gradient"></div>
              <img src="img3.png" className="d-block w-100 hero-img" alt="Car Insurance" />
              <div className="carousel-caption custom-caption">
                <span className="badge-premium">Premium Coverage</span>
                <h1>Drive with Confidence</h1>
                <p>Comprehensive protection for every journey you take.</p>
              </div>
            </div>

            <div className="carousel-item">
              <div className="overlay-gradient"></div>
              <img src="img4.png" className="d-block w-100 hero-img" alt="Car Insurance" />
              <div className="carousel-caption custom-caption">
                <span className="badge-premium">Premium Coverage</span>
                <h1>Drive with Confidence</h1>
                <p>Comprehensive protection for every journey you take.</p>
              </div>
            </div>

            <div className="carousel-item">
              <div className="overlay-gradient"></div>
              <img src="img5.png" className="d-block w-100 hero-img" alt="Car Insurance" />
              <div className="carousel-caption custom-caption">
                <span className="badge-premium">Premium Coverage</span>
                <h1>Drive with Confidence</h1>
                <p>Comprehensive protection for every journey you take.</p>
              </div>
            </div>
            {/* ... Repeat for other items with 'hero-img' and 'custom-caption' classes ... */}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#insuranceCarousel" data-bs-slide="prev">
            <span className="control-icon"><i className="fa-solid fa-chevron-left"></i></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#insuranceCarousel" data-bs-slide="next">
            <span className="control-icon"><i className="fa-solid fa-chevron-right"></i></span>
          </button>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item"><strong>50k+</strong><span>Users Secured</span></div>
        <div className="stat-item"><strong>98%</strong><span>Claims Settled</span></div>
        <div className="stat-item"><strong>24/7</strong><span>Roadside Assist</span></div>
      </div>

      {/* About Section - Split Layout */}
      <section className="about-grid">
        <div className="about-content">
          <span className="section-subtitle">Since 1998</span>
          <h2>Protecting What <br/> Matters To You</h2>
          <p>At Shield General, we don't just sell policies; we build safety nets. From commercial fleets to your first bike, we ensure accidents don't become financial burdens.</p>
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

      {/* Contact Section - Modern Floating Form */}
      <section className="contact-wrap">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Let's Talk Security</h2>
            <p>Have questions about your premium or coverage? Our experts are a message away.</p>
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
            <button type="submit" className="submit-btn-premium">Send Message</button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}