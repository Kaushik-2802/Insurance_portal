import React, { useState } from "react";
import "./RenewInsurance.css";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";

export default function RenewInsurance() {
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicleType, setVehicleType] = useState(null);

  // Function to move between steps
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <>
    <InnerHeader />
    <div className="renewal-wrapper">
      {/* 1. Progress Stepper Bar */}
      <div className="stepper-bar">
        {["Basic Info", "Policy Details", "Premium Details", "Dispatch", "Welcome"].map((label, i) => (
          <div 
            key={i} 
            className={`step-item ${currentStep === i + 1 ? "active" : ""} ${currentStep > i + 1 ? "completed" : ""}`}
          >
            <span className="step-num">{i + 1}.</span> {label}
          </div>
        ))}
      </div>

      <div className="content-area">
        {/* STEP 1: VEHICLE SELECTION */}
        {currentStep === 1 && !vehicleType && (
          <div className="selection-screen">
            <h2>Insurance Renewals</h2>
            <div className="card-container">
              <div className="v-card" onClick={() => setVehicleType("Car")}>
                <div className="v-label">Pvt. Car</div>
                <div className="v-icon">🚗</div>
              </div>
              <div className="v-card" onClick={() => setVehicleType("Two Wheeler")}>
                <div className="v-label">Two Wheeler</div>
                <div className="v-icon">🛵</div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: BASIC INFO FORM */}
        {currentStep === 1 && vehicleType && (
          <div className="form-container">
            <h3 className="section-title">Capturing Basic Information About You</h3>
            <div className="blue-form-box">
              <p className="greeting">1. Hi! Lets begin by capturing some basic information about you</p>
              <div className="input-row">
                <div className="field">
                   <label>First Name*</label>
                   <input type="text" placeholder="Enter Name" />
                </div>
                <div className="field">
                   <label>Mobile*</label>
                   <input type="tel" placeholder="Enter Mobile" />
                </div>
                <div className="field">
                   <label>Email Address*</label>
                   <input type="email" placeholder="Enter Email" />
                </div>
              </div>
              <div className="input-row">
                <div className="field">
                   <label>Vehicle Reg No.*</label>
                   <input type="text" placeholder="AA-00-AA-0000" />
                </div>
                <div className="field">
                   <label>Existing Policy No.*</label>
                   <input type="text" placeholder="Enter Policy Number" />
                </div>
              </div>
            </div>
            <div className="btn-group">
                <button className="back-btn" onClick={() => setVehicleType(null)}>Back</button>
                <button className="proceed-btn" onClick={nextStep}>Proceed for Renewal &gt;&gt;</button>
            </div>
          </div>
        )}

        {/* STEP 2: UPDATED POLICY DETAILS */}
        {currentStep === 2 && (
          <div className="details-container">
            <h3 className="section-title">Your Policy Details</h3>
            <div className="info-grid">
              <div className="info-item"><span>Name:</span> <strong>John Doe</strong></div>
              <div className="info-item"><span>Vehicle Model:</span> <strong>Toyota Camry</strong></div>
              <div className="info-item"><span>Policy Expiry:</span> <strong>24/04/2026</strong></div>
              <div className="info-item"><span>Fuel Type:</span> <strong>Petrol</strong></div>
            </div>

            <div className="address-section">
              <h4 className="section-title">Dispatch Address</h4>
              <textarea placeholder="Enter Address..."></textarea>
              <label className="checkbox-group">
                <input type="checkbox" /> Same as Policy Address
              </label>
            </div>

            <div className="btn-group">
              <button className="back-btn" onClick={prevStep}>Back</button>
              <button className="proceed-btn" onClick={nextStep}>Proceed to Premium</button>
            </div>
          </div>
        )}

        {/* STEP 3: PREMIUM DETAILS */}
        {currentStep === 3 && (
          <div className="premium-container">
            <h3 className="section-title">Premium Details</h3>
            <table className="premium-table">
              <tbody>
                <tr><td>Net Premium</td><td>Rs. 811</td></tr>
                <tr><td>Service Tax (14%)</td><td>Rs. 114</td></tr>
                <tr><td>Education Cess</td><td>Rs. 4</td></tr>
                <tr className="total-row">
                    <td>Total Premium</td>
                    <td><strong>Rs. 929</strong></td>
                </tr>
              </tbody>
            </table>
            <div className="btn-group">
                <button className="back-btn" onClick={prevStep}>Back</button>
                <button className="payment-btn" onClick={() => alert("Redirecting to Secure Payment Gateway...")}>
                    Proceed to Payment
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
}