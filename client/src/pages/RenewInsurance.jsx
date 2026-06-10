import React, { useState, useEffect } from 'react';
import './RenewInsurance.css';
import InnerHeader from '../components/InnerHeader';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function RenewInsurance() {
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicleType, setVehicleType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    policyNo: '',
    email: '',
    address: ''
  });
  
  const [validationError, setValidationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();
  const steps = ["Vehicle", "Details", "Preview", "Premium"];
  const API_BASE_URL = "http://localhost:5000/api/insurance";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationError) setValidationError(''); // Clear error messages when user modifies criteria
  };

  const resetCategory = () => {
    setVehicleType(null);
    setCurrentStep(1);
    setValidationError('');
  };

  // =========================================================================
  // BACKEND LOOKUP VERIFICATION HOOK
  // =========================================================================
  const handleVerifyAndContinue = async () => {

  if (!formData.policyNo.trim()) {

    setValidationError(
      "Please input an existing policy tracking reference number."
    );

    return;
  }

  setIsVerifying(true);

  setValidationError("");

  try {

    const token =
      localStorage.getItem("token");

    if (!token) {

      alert(
        "Session expired. Please login again."
      );

      navigate("/login");

      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/verify-policy/${formData.policyNo.trim()}`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (
      response.ok &&
      data.success
    ) {

      setFormData((prev) => ({
        ...prev,

        name:
          data.policy.name ||
          prev.name ||
          "Verified Holder",

        regNo:
          data.policy.regNo ||
          prev.regNo,
      }));

      if (data.policy.vehicleType) {

        setVehicleType(
          data.policy.vehicleType
        );
      }

      setCurrentStep(2);

    } else {

      setValidationError(
        data.message ||
        "Invalid database identification record."
      );
    }

  } catch (err) {

    console.error(err);

    setValidationError(
      "Error contacting validation server."
    );

  } finally {

    setIsVerifying(false);
  }
};

  // =========================================================================
  // SUBMIT RENEWAL TRANSACTION PARAMETERS TO PAYMENT HANDLING FLOW
  // =========================================================================
  const handleProceedToPayment = () => {
    // Save contextual items to localStorage so your payment interface page processes references correctly
    localStorage.setItem("policyPrice", "₹1,170");
    localStorage.setItem("policyTitle", `${vehicleType || "Vehicle"} Renewal`);
    
    // Save vehicle parameters structure to map properties accurately inside payload targets
    localStorage.setItem("vehicleDetails", JSON.stringify({
    bikeModel:
      vehicleType === "Two Wheeler"
        ? "Renewed Motorcycle Profile"
        : "Renewed Private Car Profile",

    regNo: formData.regNo,

    vehicleType: vehicleType,

    insuredValue:
      vehicleType === "Two Wheeler"
        ? "₹2,85,000"
        : "₹7,50,000"
  }));
    localStorage.setItem("activeFlow", "motor");
    // Explicitly seed the renewal request tracking data so payment confirms update operations
    localStorage.setItem("renewalPolicyNo", formData.policyNo);
    localStorage.setItem("renewalAddress", formData.address);

    navigate("/payment");
  };

  return (
    <div className="renewal-ultra-root light-theme">
      <InnerHeader />
      
      <div className="main-viewport">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>

        <div className="renewal-grid-container">
          
          <div className="step-content-area">
            {/* Progress Tracker Minimal Display layout */}
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

              {/* STEP 2: DETAILS FORM WITH DATABASE VERIFICATION */}
              {currentStep === 1 && vehicleType && (
                <div className="step-transition">
                  <div className="form-top-nav">
                    <button className="back-link-btn" onClick={resetCategory}>
                       <i className="fa-solid fa-chevron-left"></i> Change Category
                    </button>
                    <span className="selection-tag">{vehicleType}</span>
                  </div>
                  
                  <h2 className="section-title">Ownership Verification</h2>
                  <p className="sub-text">Provide an existing validation reference sequence token (e.g., POL-XXXXXX).</p>
                  
                  <div className="input-stack">
                    <div className="floating-input">
                      <input 
                        type="text" 
                        name="policyNo" 
                        id="policyNo"
                        value={formData.policyNo} 
                        onChange={handleInputChange} 
                        placeholder=" " 
                        required 
                      />
                      <label htmlFor="policyNo">Existing Policy No. (Required Verification)</label>
                    </div>

                    <div className="input-row">
                        <div className="floating-input">
                            <input type="text" id="fname" name="name" value={formData.name} onChange={handleInputChange} placeholder=" " />
                            <label htmlFor="fname">Full Name (Optional Lookup)</label>
                        </div>
                        <div className="floating-input">
                            <input type="text" id="regNo" name="regNo" value={formData.regNo} onChange={handleInputChange} placeholder=" " />
                            <label htmlFor="regNo">Registration No. (Optional Lookup)</label>
                        </div>
                    </div>
                  </div>

                  {validationError && <p className="error-banner-msg" style={{color: '#e74c3c', marginTop: '10px', fontSize: '0.9rem'}}><i className="fa-solid fa-circle-exclamation"></i> {validationError}</p>}

                  <button 
                    className="cta-btn primary" 
                    onClick={handleVerifyAndContinue}
                    disabled={isVerifying}
                    style={{marginTop: '20px'}}
                  >
                    {isVerifying ? "Querying Vault Reference..." : "Verify & Continue to Dispatch"}
                  </button>
                </div>
              )}

              {/* STEP 3: LOGISTICS DISPLAY SECTION */}
              {currentStep === 2 && (
                <div className="step-transition">
                  <h2 className="section-title">Delivery Details</h2>
                  <p className="sub-text">Confirm your physical policy document dispatch delivery address target.</p>
                  <textarea 
                    className="modern-area" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    placeholder="Enter your full dispatch address destination parameters here..."
                  ></textarea>
                  <div className="button-group">
                    <button className="cta-btn secondary" onClick={() => setCurrentStep(1)}>Back</button>
                    <button className="cta-btn primary" onClick={() => setCurrentStep(3)}>View Final Quote</button>
                  </div>
                </div>
              )}

              {/* STEP 4: PREMIUM SUMMARY CALCULATION VIEW */}
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
                   <div className="button-group" style={{marginTop: '20px'}}>
                     <button className="cta-btn secondary" onClick={() => setCurrentStep(2)}>Back</button>
                     <button className="cta-btn pay-btn" onClick={handleProceedToPayment}>
                        Secure Payment & Renew <i className="fa-solid fa-lock"></i>
                     </button>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW CONTAINER */}
          <div className="visualizer-area">
             <div className="live-policy-card">
                <div className="card-inner">
                    <div className="card-head">
                        <div className="logo-stub">LTI INSURANCE</div>
                        <div className="status-pill">{currentStep === 3 ? "VERIFIED" : "PREVIEW"}</div>
                    </div>
                    <div className="card-main">
                        <div className="v-label">POLICY NUMBER</div>
                        <div className="v-value" style={{color: '#2ecc71', fontWeight: 'bold'}}>{formData.policyNo || "Unverified ID"}</div>

                        <div className="v-label">POLICY HOLDER</div>
                        <div className="v-value">{formData.name || "Awaiting Verification"}</div>
                        
                        <div className="v-label">VEHICLE REGISTRATION</div>
                        <div className="v-value">{formData.regNo || "XXXX-XX-0000"}</div>

                        <div className="v-label">PLAN CATEGORY</div>
                        <div className="v-value">{vehicleType || "Not Selected"}</div>
                    </div>
                    <div className="card-foot">
                        <div>
                            <div className="v-label">VALIDITY EXTENSION</div>
                            <div className="v-value small">EXTENDS +1 YEAR</div>
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