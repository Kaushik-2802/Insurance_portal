import React, { useState } from "react";
import "./RenewInsurance.css";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function RenewInsurance() {
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicleType, setVehicleType] = useState(null);
  const [formData, setFormData] = useState({
    name: "Guest User",
    regNo: "XXXX-XX-0000",
    policyNo: "SH-00000000",
    email: "",
    address: ""
  });
  
  const navigate = useNavigate();
  const steps = ["Vehicle", "Details", "Preview", "Premium"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetCategory = () => {
    setVehicleType(null);
    setCurrentStep(1);
  };

  return (
    <div className="renewal-ultra-root light-theme">
      <InnerHeader />
      
      <div className="main-viewport">
        {/* Soft Background Accents */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>

        <div className="renewal-grid-container">
          
          <div className="step-content-area">
            {/* Progress Tracker */}
            <div className="stepper-minimal">
              {steps.map((s, i) => (
                <div key={i} className={`mini-step ${currentStep > i ? "done" : ""} ${currentStep === i + 1 ? "active" : ""}`}>
                  <div className="step-dot"></div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="glass-form-card">
              {/* STEP 1: CATEGORY SELECTION */}
              {currentStep === 1 && !vehicleType && (
                <div className="step-transition">
                  <h1 className="hero-text">Renew Your <br/><span>Protection.</span></h1>
                  <p className="sub-text">Select your vehicle type to pull your latest policy data.</p>
                  <div className="category-flex">
                    <div className="cat-box" onClick={() => setVehicleType("Private Car")}>
                      <div className="cat-icon"><i className="fa-solid fa-car-side"></i></div>
                      <div className="cat-info"><h3>Private Car</h3><p>Elite Coverage</p></div>
                    </div>
                    <div className="cat-box" onClick={() => setVehicleType("Two Wheeler")}>
                      <div className="cat-icon"><i className="fa-solid fa-motorcycle"></i></div>
                      <div className="cat-info"><h3>Two Wheeler</h3><p>Standard Shield</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DETAILS FORM */}
              {currentStep === 1 && vehicleType && (
                <div className="step-transition">
                  <div className="form-top-nav">
                    <button className="back-link-btn" onClick={resetCategory}>
                       <i className="fa-solid fa-chevron-left"></i> Change Category
                    </button>
                    <span className="selection-tag">{vehicleType}</span>
                  </div>
                  
                  <h2 className="section-title">Ownership Verification</h2>
                  <div className="input-stack">
                    <div className="floating-input">
                      <input type="text" name="name" onChange={handleInputChange} placeholder=" " />
                      <label>Full Name</label>
                    </div>
                    <div className="input-row">
                        <div className="floating-input">
                            <input type="text" name="regNo" onChange={handleInputChange} placeholder=" " />
                            <label>Registration No.</label>
                        </div>
                        <div className="floating-input">
                            <input type="text" name="policyNo" onChange={handleInputChange} placeholder=" " />
                            <label>Existing Policy No.</label>
                        </div>
                    </div>
                  </div>
                  <button className="cta-btn primary" onClick={() => setCurrentStep(2)}>Continue to Dispatch</button>
                </div>
              )}

              {/* STEP 3: LOGISTICS */}
              {currentStep === 2 && (
                <div className="step-transition">
                  <h2 className="section-title">Delivery Details</h2>
                  <p className="sub-text">Confirm your physical policy dispatch address.</p>
                  <textarea className="modern-area" name="address" onChange={handleInputChange} placeholder="Enter your full address here..."></textarea>
                  <div className="button-group">
                    <button className="cta-btn secondary" onClick={() => setCurrentStep(1)}>Back</button>
                    <button className="cta-btn primary" onClick={() => setCurrentStep(3)}>View Final Quote</button>
                  </div>
                </div>
              )}

              {/* STEP 4: PREMIUM */}
              {currentStep === 3 && (
                <div className="step-transition">
                   <h2 className="section-title">Ready to Renew</h2>
                   <div className="premium-box-glass">
                      <div className="p-row"><span>Base Premium</span><span>₹ 1,240</span></div>
                      <div className="p-row"><span>No Claim Bonus (NCB)</span><span className="discount">- ₹ 248</span></div>
                      <div className="p-row"><span>GST (18%)</span><span>₹ 178</span></div>
                      <div className="p-divider"></div>
                      <div className="p-total"><span>Total Payable</span><span>₹ 1,170</span></div>
                   </div>
                   <button className="cta-btn pay-btn" onClick={() => navigate("/payment")}>
                      Secure Payment <i className="fa-solid fa-lock"></i>
                   </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: DYNAMIC LIVE PREVIEW */}
          <div className="visualizer-area">
             <div className="live-policy-card">
                <div className="card-inner">
                    <div className="card-head">
                        <div className="logo-stub">SHIELD</div>
                        <div className="status-pill">PREVIEW</div>
                    </div>
                    <div className="card-main">
                        <div className="v-label">POLICY HOLDER</div>
                        <div className="v-value">{formData.name || "Enter Name"}</div>
                        
                        <div className="v-label">VEHICLE REGISTRATION</div>
                        <div className="v-value">{formData.regNo || "XXXX-XX-0000"}</div>

                        <div className="v-label">PLAN TYPE</div>
                        <div className="v-value">{vehicleType || "Not Selected"}</div>
                    </div>
                    <div className="card-foot">
                        <div>
                            <div className="v-label">VALIDITY</div>
                            <div className="v-value small">APR 2026 - APR 2027</div>
                        </div>
                        <div className="qr-stub"><i className="fa-solid fa-qrcode"></i></div>
                    </div>
                </div>
                <div className="floating-badge"><i className="fa-solid fa-check-double"></i></div>
             </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}