import React from "react";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="page-wrapper">
      <InnerHeader />
      
      <main className="dashboard-container">
        {/* Left Section: Information */}
        <section className="left-info">
          <div className="section-header">
            <span className="subtitle">Shield General Protection</span>
            <h1>Why Insurance?</h1>
            <p className="description">
              Secure your future with comprehensive coverage designed for modern life.
            </p>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <div className="card-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div className="card-content">
                <h3>Financial Security</h3>
                <p>Protect your assets and family from unexpected expenses and accidents.</p>
              </div>
            </div>

            <div className="info-card">
              <div className="card-icon">
                <i className="fa-solid fa-heart-pulse"></i>
              </div>
              <div className="card-content">
                <h3>Peace of Mind</h3>
                <p>Drive with confidence knowing Shield General has your back 24/7.</p>
              </div>
            </div>

            <div className="info-card">
              <div className="card-icon">
                <i className="fa-solid fa-file-contract"></i>
              </div>
              <div className="card-content">
                <h3>Legal Compliance</h3>
                <p>Stay updated with mandatory coverages required by law effortlessly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section: Action Buttons */}
        <section className="right-actions">
          <div className="action-card">
            <h2>Quick Actions</h2>
            <div className="btn-group">
              <a href="/buy-insurance" className="action-btn primary">
                <i className="fa-solid fa-cart-plus"></i> Buy Insurance
              </a>
              <a href="/renew" className="action-btn">
                <i className="fa-solid fa-arrows-rotate"></i> Renew Insurance
              </a>
              <a href="/claim-form" className="action-btn">
                <i className="fa-solid fa-hand-holding-dollar"></i> Claim Insurance
              </a>
              <a href="/calculate" className="action-btn outline">
                <i className="fa-solid fa-calculator"></i> Calculate Premium
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}