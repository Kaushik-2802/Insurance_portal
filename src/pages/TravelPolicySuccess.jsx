import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InnerHeader from '../components/InnerHeader';
import Footer from '../components/Footer';
import './TravelPolicySuccess.css';

export default function TravelPolicySuccess() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('travelInsuranceData');
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) return null;

  const { travelType, tripData, members, selectedAddons } = data;

  return (
    <div className="travel-success-wrapper">
      <InnerHeader />

      {/* SUCCESS MESSAGE */}
      <div className="travel-success-banner">
        <div className="check-icon">✓</div>
        <h1>PAYMENT SUCCESSFUL!</h1>
        <p>Your travel insurance policy is now active</p>
      </div>

      {/* POLICY CARD */}
      <div className="travel-policy-card">

        {/* HEADER */}
        <div className="policy-header">
          <div className="brand">✈ SecureTrip Insurance</div>
          <div className="policy-ref">
            <span>POLICY REFERENCE</span>
            <strong>TRV{Date.now().toString().slice(-8)}</strong>
          </div>
        </div>

        {/* DETAILS */}
        <div className="policy-details-grid">

          {/* POLICY HOLDER */}
          <div className="info-box">
            <h3>Policy Holder</h3>

            {members.map((m, i) => (
              <div className="info-row" key={i}>
                <span>Name</span>
                <strong>{m.name}</strong>
              </div>
            ))}

            <div className="info-row">
              <span>No. of Travelers</span>
              <strong>{members.length}</strong>
            </div>

            <div className="info-row">
              <span>Travel Type</span>
              <strong>{travelType.toUpperCase()}</strong>
            </div>

            <div className="info-row">
              <span>Policy Status</span>
              <strong className="active">ACTIVE</strong>
            </div>
          </div>

          {/* TRIP DETAILS */}
          <div className="info-box">
            <h3>Trip Details</h3>

            <div className="info-row">
              <span>Destination</span>
              <strong>{tripData.country}</strong>
            </div>

            <div className="info-row">
              <span>Valid From</span>
              <strong>{new Date(tripData.startDate).toLocaleDateString('en-IN')}</strong>
            </div>

            <div className="info-row">
              <span>Valid Till</span>
              <strong>{new Date(tripData.endDate).toLocaleDateString('en-IN')}</strong>
            </div>

            <div className="info-row">
              <span>Plan Type</span>
              <strong>Comprehensive Travel Cover</strong>
            </div>
          </div>
        </div>

        {/* PAYMENT DETAILS */}
        <div className="payment-box">
          <h3>Payment Details</h3>

          <div className="info-row">
            <span>Paid Amount</span>
            <strong>₹1,607</strong>
          </div>

          <div className="info-row">
            <span>Payment Method</span>
            <strong>UPI</strong>
          </div>

          <div className="info-row">
            <span>Add-ons</span>
            <strong>{selectedAddons.length} Selected</strong>
          </div>

          <div className="info-row">
            <span>Issued On</span>
            <strong>{new Date().toLocaleDateString('en-IN')}</strong>
          </div>

          <div className="info-row">
            <span>Transaction ID</span>
            <strong>TXN{Date.now()}</strong>
          </div>
        </div>

        {/* VERIFIED */}
        <div className="verified">
          ✅ Digitally Signed & Verified Certificate
        </div>
      </div>

      {/* ACTIONS */}
      <div className="policy-actions">
        <button className="outline">Download PDF</button>
        <button className="outline">Email Policy</button>
      </div>

      <button className="home-btn" onClick={() => navigate('/')}>
        Go to Home →
      </button>

      <Footer />
    </div>
  );
}