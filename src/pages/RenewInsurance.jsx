import React, { useState } from "react";
import "./RenewInsurance.css";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";

export default function RenewInsurance() {
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicleType, setVehicleType] = useState(null);

  const steps = ["Vehicle", "Information", "Verification", "Premium", "Finalize"];

  return (
    <div className="renewal-page-root">
      <InnerHeader />
      
      <div className="renewal-main-container">
        {/* Modern Dynamic Stepper */}
        <div className="stepper-wrapper">
          <div className="progress-line">
            <div className="progress-fill" style={{ width: `${(currentStep - 1) * 25}%` }}></div>
          </div>
          {steps.map((label, i) => (
            <div key={i} className={`step-node ${currentStep >= i + 1 ? "active" : ""}`}>
              <div className="node-circle">{currentStep > i + 1 ? "✓" : i + 1}</div>
              <span className="node-label">{label}</span>
            </div>
          ))}
        </div>

        <div className="content-card-glass animated-step">
          
          {/* STEP 1: MODERN SELECTION */}
          {currentStep === 1 && !vehicleType && (
            <div className="selection-view">
              <div className="view-header">
                <h2>Renew Your Protection</h2>
                <p>Select your vehicle category to fetch current policy status</p>
              </div>
              <div className="luxury-card-grid">
                <div className="luxury-card" onClick={() => setVehicleType("Car")}>
                  <div className="card-glare"></div>
                  <i className="fa-solid fa-car-rear"></i>
                  <h3>Private Car</h3>
                  <span>Comprehensive Shield</span>
                </div>
                <div className="luxury-card" onClick={() => setVehicleType("Two Wheeler")}>
                  <div className="card-glare"></div>
                  <i className="fa-solid fa-motorcycle"></i>
                  <h3>Two Wheeler</h3>
                  <span>Essential Protection</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: FORM VIEW */}
          {currentStep === 1 && vehicleType && (
            <div className="form-view">
              <div className="form-header-row">
                <h3><i className="fa-solid fa-user-shield"></i> Basic Information</h3>
                <button className="text-link" onClick={() => setVehicleType(null)}>Change Vehicle Type</button>
              </div>
              
              <div className="form-grid">
                <div className="modern-input">
                  <input type="text" placeholder=" " required />
                  <label>First Name</label>
                </div>
                <div className="modern-input">
                  <input type="tel" placeholder=" " required />
                  <label>Mobile Number</label>
                </div>
                <div className="modern-input full-width">
                  <input type="email" placeholder=" " required />
                  <label>Email Address</label>
                </div>
                <div className="modern-input">
                  <input type="text" placeholder=" " required />
                  <label>Vehicle Reg No.</label>
                </div>
                <div className="modern-input">
                  <input type="text" placeholder=" " required />
                  <label>Existing Policy No.</label>
                </div>
              </div>

              <div className="action-footer">
                <button className="btn-main glow" onClick={() => setCurrentStep(2)}>
                  Verify Policy Details <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: POLICY PREVIEW (The "Surprise" Document View) */}
          {currentStep === 2 && (
            <div className="preview-view">
              <div className="preview-document">
                <div className="doc-header">
                  <h4>SHIELD GENERAL INSURANCE</h4>
                  <span className="badge">Active Policy</span>
                </div>
                <div className="doc-body">
                   <div className="doc-row"><span>Owner</span><strong>Johnathan Doe</strong></div>
                   <div className="doc-row"><span>Model</span><strong>Toyota Camry Hybrid</strong></div>
                   <div className="doc-row"><span>Valid Till</span><strong>24 April 2026</strong></div>
                </div>
              </div>

              <div className="dispatch-form">
                <h4><i className="fa-solid fa-truck-fast"></i> Dispatch Details</h4>
                <textarea placeholder="Your physical policy delivery address..."></textarea>
                <div className="toggle-switch">
                  <input type="checkbox" id="sameAdd" />
                  <label htmlFor="sameAdd">Use registered policy address</label>
                </div>
              </div>

              <div className="action-footer split">
                <button className="btn-outline" onClick={() => setCurrentStep(1)}>Back</button>
                <button className="btn-main" onClick={() => setCurrentStep(3)}>Calculate Premium</button>
              </div>
            </div>
          )}

          {/* STEP 3: PREMIUM VIEW */}
          {currentStep === 3 && (
            <div className="premium-view">
              <div className="premium-breakdown">
                <h3>Renewal Quote</h3>
                <div className="price-item"><span>Net Premium</span><span>₹ 811.00</span></div>
                <div className="price-item"><span>GST (18%)</span><span>₹ 145.98</span></div>
                <div className="price-total">
                  <span>Grand Total</span>
                  <span className="total-amount">₹ 956.98</span>
                </div>
              </div>
              <div className="action-footer">
                <button className="btn-main payment" onClick={() => alert("Redirecting...")}>
                  Pay & Renew Instantly <i className="fa-solid fa-lock"></i>
                </button>
                <p className="secure-text"><i className="fa-solid fa-shield-check"></i> 256-bit Secure Encryption</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}