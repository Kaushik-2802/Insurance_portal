import React from "react";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";
import "./Dashboard.css"; 

export default function Dashboard() {
  return (
    <>
      <InnerHeader />
      
      <main className="dashboard-container">
        {/* Left Section: Information */}
        <section className="left-info">
          <h1>Why Insurance?</h1>
          <div className="info-card">
            <h3>Financial Security</h3>
            <p>Protect your assets and family from unexpected expenses and accidents.</p>
          </div>
          <div className="info-card">
            <h3>Peace of Mind</h3>
            <p>Drive with confidence knowing Shield General has your back 24/7.</p>
          </div>
          <div className="info-card">
            <h3>Legal Compliance</h3>
            <p>Stay updated with mandatory coverages required by law effortlessly.</p>
          </div>
        </section>

        {/* Right Section: Action Buttons */}
        <section className="right-actions">
          <a href="/buy-insurance" className="action-btn">Buy Insurance</a>
          <a href="/renew" className="action-btn">Renew Insurance</a>
          <a href="/claim-form" className="action-btn">Claim Insurance</a>
          <a href="/calculate" className="action-btn">Calculate Premium</a>
        </section>
      </main>

      <Footer />
    </>
  );
}