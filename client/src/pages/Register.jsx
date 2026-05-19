import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstname: "", middlename: "", lastname: "",
    email: "", phoneno: "",
    street: "", city: "", pincode: "",
    password: "", confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const totalSteps = 4;

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    // Clear error as user types
    if (errors[id]) setErrors({ ...errors, [id]: null });
  };

  // Validation Logic per Step
  const validateStep = () => {
    let newErrors = {};

    if (currentStep === 1) {
      if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
      if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
    }

    if (currentStep === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;
      if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email address";
      if (!phoneRegex.test(formData.phoneno)) newErrors.phoneno = "Enter a valid 10-digit mobile number";
    }

    if (currentStep === 3) {
      if (!formData.street.trim()) newErrors.street = "Street address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    if (currentStep === 4) {
      if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
      if (!/[A-Z]/.test(formData.password)) newErrors.password = "Include at least one uppercase letter";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      alert("Account Created Successfully!");
      navigate("/login");
    }
  };

  const calculateProgress = () => (currentStep / totalSteps) * 100;

  return (
    <div className="register-wizard-page">
      <div className="wizard-blobs"></div>

      <div className={`register-glass-wizard ${Object.keys(errors).length > 0 ? "shake-effect" : ""}`}>
        <div className="wizard-progress">
          <div className="progress-bar-fill" style={{ width: `${calculateProgress()}%` }}></div>
          <span className="step-count">Step {currentStep} of {totalSteps}</span>
        </div>

        <h1 className="register-title">Create Secure Account</h1>

        <form className="register-form-wizard" onSubmit={handleSubmit}>
          
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="wizard-step animated fadeIn">
              <h3><i className="fa-solid fa-circle-user"></i> Personal Profile</h3>
              <div className="name-grid">
                <div className={`input-field float-input ${errors.firstname ? "error-input" : ""}`}>
                  <input type="text" id="firstname" placeholder=" " value={formData.firstname} onChange={handleChange} />
                  <label>First Name</label>
                  {errors.firstname && <span className="error-text">{errors.firstname}</span>}
                </div>
                <div className="input-field float-input">
                  <input type="text" id="middlename" placeholder=" " value={formData.middlename} onChange={handleChange} />
                  <label>Middle Name</label>
                </div>
                <div className={`input-field float-input ${errors.lastname ? "error-input" : ""}`}>
                  <input type="text" id="lastname" placeholder=" " value={formData.lastname} onChange={handleChange} />
                  <label>Last Name</label>
                  {errors.lastname && <span className="error-text">{errors.lastname}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="wizard-step animated fadeIn">
              <h3><i className="fa-solid fa-envelope-open-text"></i> Verification Hub</h3>
              <div className={`float-input ${errors.email ? "error-input" : ""}`}>
                <input type="email" id="email" placeholder=" " value={formData.email} onChange={handleChange} />
                <label>Work/Personal Email</label>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              <div className={`float-input ${errors.phoneno ? "error-input" : ""}`}>
                <input type="tel" id="phoneno" placeholder=" " value={formData.phoneno} onChange={handleChange} />
                <label>Mobile Number (10-digit)</label>
                {errors.phoneno && <span className="error-text">{errors.phoneno}</span>}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="wizard-step animated fadeIn">
              <h3><i className="fa-solid fa-map-location-dot"></i> Permanent Address</h3>
              <div className={`float-input ${errors.street ? "error-input" : ""}`}>
                <input type="text" id="street" placeholder=" " value={formData.street} onChange={handleChange} />
                <label>Street & Door Number</label>
                {errors.street && <span className="error-text">{errors.street}</span>}
              </div>
              <div className="address-grid">
                <div className={`float-input ${errors.city ? "error-input" : ""}`}>
                  <input type="text" id="city" placeholder=" " value={formData.city} onChange={handleChange} />
                  <label>City</label>
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
                <div className={`float-input ${errors.pincode ? "error-input" : ""}`}>
                  <input type="text" id="pincode" placeholder=" " value={formData.pincode} onChange={handleChange} />
                  <label>Pincode</label>
                  {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="wizard-step animated fadeIn">
              <h3><i className="fa-solid fa-user-lock"></i> Set Credentials</h3>
              <div className={`float-input ${errors.password ? "error-input" : ""}`}>
                <input type="password" id="password" placeholder=" " value={formData.password} onChange={handleChange} />
                <label>Access Password</label>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
              <div className={`float-input ${errors.confirmPassword ? "error-input" : ""}`}>
                <input type="password" id="confirmPassword" placeholder=" " value={formData.confirmPassword} onChange={handleChange} />
                <label>Confirm Password</label>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>
          )}

          <div className="wizard-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="btn-secondary">
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
            )}
          </div>
        </form>
      </div>
    </div>
  );
}