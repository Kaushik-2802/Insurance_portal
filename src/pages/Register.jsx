import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Number of registration steps
  const totalSteps = 4;

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const calculateProgress = () => {
    return (currentStep / totalSteps) * 100;
  };

  return (
    <div className="register-wizard-page">
      {/* Background decoration */}
      <div className="wizard-blobs"></div>

      <div className="register-glass-wizard">
        
        {/* Modern Progress Bar */}
        <div className="wizard-progress">
          <div className="progress-bar-fill" style={{ width: `${calculateProgress()}%` }}></div>
          <span className="step-count">Step {currentStep} of {totalSteps}</span>
        </div>

        <h1 className="register-title">Create Secure Account</h1>

        <form className="register-form-wizard" onSubmit={(e) => e.preventDefault()}>
          
          {/* STEP 1: Personal Profile */}
          {currentStep === 1 && (
            <div className="wizard-step animated fadeIn">
              <h3><i className="fa-solid fa-circle-user"></i> Personal Profile</h3>
              <div className="name-grid">
                <div className="input-field float-input">
                  <input type="text" id="firstname" placeholder=" " required />
                  <label htmlFor="firstname">First Name</label>
                </div>
                <div className="input-field float-input">
                  <input type="text" id="middlename" placeholder=" " />
                  <label htmlFor="middlename">Middle Name</label>
                </div>
                <div className="input-field float-input">
                  <input type="text" id="lastname" placeholder=" " required />
                  <label htmlFor="lastname">Last Name</label>
                </div>
              </div>
              
              <div className="float-input photo-upload-modern">
                <i className="fa-solid fa-cloud-arrow-up"></i>
                <label>Profile Picture</label>
                <input type="file" id="photo" accept="image/*" />
              </div>
            </div>
          )}

          {/* STEP 2: Communication Hub */}
          {currentStep === 2 && (
            <div className="wizard-step animated fadeIn">
              <h3><i className="fa-solid fa-envelope-open-text"></i> Verification Hub</h3>
              <div className="float-input">
                <input type="email" id="email" placeholder=" " required />
                <label htmlFor="email">Work/Personal Email</label>
              </div>
              <div className="float-input">
                <input type="tel" id="phoneno" placeholder=" " required />
                <label htmlFor="phoneno">Mobile Number (Primary)</label>
              </div>
            </div>
          )}

          {/* STEP 3: Verification Address */}
          {currentStep === 3 && (
            <div className="wizard-step animated fadeIn">
              <h3><i className="fa-solid fa-map-location-dot"></i> Permanent Address</h3>
              <div className="float-input">
                <input type="text" id="street" placeholder=" " required />
                <label htmlFor="street">Street & Door Number</label>
              </div>
              <div className="address-grid">
                <div className="float-input">
                  <input type="text" id="city" placeholder=" " required />
                  <label htmlFor="city">City</label>
                </div>
                <div className="float-input">
                  <input type="text" id="pincode" placeholder=" " required />
                  <label htmlFor="pincode">Pincode</label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Security Credentials */}
          {currentStep === 4 && (
            <div className="wizard-step animated fadeIn">
              <h3><i className="fa-solid fa-user-lock"></i> Set Credentials</h3>
              <div className="float-input">
                <input type="password" id="password" placeholder=" " required />
                <label htmlFor="password">Access Password</label>
              </div>
              <div className="float-input">
                <input type="password" id="confirmPassword" placeholder=" " required />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>
            </div>
          )}

          {/* Wizard Navigation */}
          <div className="wizard-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="btn-secondary">
                <i className="fa-solid fa-arrow-left"></i> Previous
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button type="button" onClick={nextStep} className="btn-premium ml-auto">
                Next <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <button type="submit" className="btn-premium ml-auto finish-btn">
                <i className="fa-solid fa-shield"></i> Complete Security Setup
              </button>
            )
          }
          </div>
        </form>
        
        <p className="auth-footer">
          Already verified? <Link to="/login">Secure Login</Link>
        </p>
      </div>
    </div>
  );
}