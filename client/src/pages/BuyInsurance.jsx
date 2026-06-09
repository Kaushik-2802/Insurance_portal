import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BuyInsurance.css";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";

const BuyInsurance = () => {
  const [activeForm, setActiveForm] = useState("bike");
  const [formData, setFormData] = useState({
    manufacturer: "", model: "", drivingLicense: "",
    purchaseDate: "", registrationNumber: "",
    engineNumber: "", chasisNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Track server loading state
  
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    
    if (!formData.manufacturer.trim()) tempErrors.manufacturer = "Manufacturer is required";
    if (!formData.model.trim()) tempErrors.model = "Model is required";

    const regRegex = /^[A-Z]{2}\s[0-9]{2}\s[A-Z]{2}\s[0-9]{4}$/i;
    if (!formData.registrationNumber) {
      tempErrors.registrationNumber = "Registration number is required";
    } else if (!regRegex.test(formData.registrationNumber)) {
      tempErrors.registrationNumber = "Format: XX 00 XX 0000";
    }

    if (formData.drivingLicense.length < 5) {
      tempErrors.drivingLicense = "Enter a valid Driving License number";
    }

    if (formData.engineNumber.length < 6) tempErrors.engineNumber = "Invalid Engine Number";
    if (formData.chasisNumber.length < 10) tempErrors.chasisNumber = "Invalid Chassis Number";

    const selectedDate = new Date(formData.purchaseDate);
    const today = new Date();
    if (!formData.purchaseDate) {
      tempErrors.purchaseDate = "Purchase date is required";
    } else if (selectedDate > today) {
      tempErrors.purchaseDate = "Purchase date cannot be in the future";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);

      // Bundle tracking states + user text inputs seamlessly
      const submissionPayload = {
        userId: "60d0fe4f5311236168a109ca", // Mock placeholder user object assignment
        activeForm: activeForm,             // "bike" or "car"
        ...formData,                        // Spreads manufacturer, model, registrationNumber, engineNumber, chasisNumber, drivingLicense, purchaseDate
        amount: activeForm === "bike" ? "₹1,850" : "₹4,500",
        paymentMethod: "Razorpay / Digital Wallet",
        transactionId: "TXN-" + Math.floor(Math.random() * 10000000)
      };

      try {
        const response = await fetch("http://localhost:5000/api/insurance/create-policy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionPayload),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          console.log("Success confirmation data object received:", data);

          // =========================================================================
          // 🚀 THE BRIDGE FIX: Align payload structure exactly with Payment.js hooks
          // =========================================================================
          const localPayloadStaging = {
            bikeModel: formData.model,
            regNo: formData.registrationNumber,
            vehicleType: activeForm === "bike" ? "Two Wheeler" : "Four Wheeler",
            insuredValue: activeForm === "bike" ? "₹2,85,000" : "₹7,50,000",

  // IMPORTANT
            insuranceType: "vehicle"
          };

          // Save tracking block explicitly so downstream payments pick it up seamlessly
          localStorage.setItem("vehicleDetails", JSON.stringify(localPayloadStaging));
          localStorage.setItem("activeFlow", "vehicle");
          // =========================================================================

          navigate("/policy-type", { state: { policy: data.policy } });
        } else {
          alert(data.message || "Something went wrong saving details down to DB.");
        }
      } catch (error) {
        console.error("Network interface communication failure:", error);
        alert("Failed connecting to the backend. Please verify your server port console.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="page-wrapper">
      <InnerHeader />
      <main className="buy-insurance-main">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>

        <section className="glass-container">
          <div className="header-content">
            <h1>Protect Your Journey</h1>
            <p>Get instant premium coverage in just a few steps.</p>
          </div>

          <div className="visual-selector">
            <div 
              className={`selection-card ${activeForm === "bike" ? "active" : ""}`}
              onClick={() => { setActiveForm("bike"); setErrors({}); }}
            >
              <div className="card-icon"><i className="fa-solid fa-motorcycle"></i></div>
              <div className="card-info">
                <span>Two-Wheeler</span>
                <small>Bikes & Scooters</small>
              </div>
              {activeForm === "bike" && <i className="fa-solid fa-circle-check checkmark"></i>}
            </div>

            <div 
              className={`selection-card ${activeForm === "car" ? "active" : ""}`}
              onClick={() => { setActiveForm("car"); setErrors({}); }}
            >
              <div className="card-icon"><i className="fa-solid fa-car-side"></i></div>
              <div className="card-info">
                <span>Four-Wheeler</span>
                <small>Private Cars & SUVs</small>
              </div>
              {activeForm === "car" && <i className="fa-solid fa-circle-check checkmark"></i>}
            </div>
          </div>

          <div className="form-wrapper animated-fade">
            <div className="form-header">
              <h3><i className="fa-solid fa-file-invoice"></i> {activeForm === 'bike' ? 'Bike' : 'Car'} Details</h3>
              <div className="divider"></div>
            </div>

            <form onSubmit={handleSubmit} className="premium-form">
              <div className="form-grid">
                <div className={`input-box ${errors.manufacturer ? "error" : ""}`}>
                  <label>Manufacturer</label>
                  <input type="text" name="manufacturer" placeholder="e.g. BMW, Honda" onChange={handleInputChange} />
                  {errors.manufacturer && <span className="error-text">{errors.manufacturer}</span>}
                </div>

                <div className={`input-box ${errors.model ? "error" : ""}`}>
                  <label>Model Name</label>
                  <input type="text" name="model" placeholder="e.g. Civic, S1000RR" onChange={handleInputChange} />
                  {errors.model && <span className="error-text">{errors.model}</span>}
                </div>

                <div className={`input-box ${errors.registrationNumber ? "error" : ""}`}>
                  <label>Registration Number</label>
                  <input type="text" name="registrationNumber" placeholder="XX 00 XX 0000" onChange={handleInputChange} />
                  {errors.registrationNumber && <span className="error-text">{errors.registrationNumber}</span>}
                </div>

                <div className={`input-box ${errors.drivingLicense ? "error" : ""}`}>
                  <label>Driving License</label>
                  <input type="text" name="drivingLicense" placeholder="Enter DL Number" onChange={handleInputChange} />
                  {errors.drivingLicense && <span className="error-text">{errors.drivingLicense}</span>}
                </div>

                <div className={`input-box ${errors.engineNumber ? "error" : ""}`}>
                  <label>Engine Number</label>
                  <input type="text" name="engineNumber" placeholder="Engine ID" onChange={handleInputChange} />
                  {errors.engineNumber && <span className="error-text">{errors.engineNumber}</span>}
                </div>

                <div className={`input-box ${errors.chasisNumber ? "error" : ""}`}>
                  <label>Chassis Number</label>
                  <input type="text" name="chasisNumber" placeholder="Chassis ID" onChange={handleInputChange} />
                  {errors.chasisNumber && <span className="error-text">{errors.chasisNumber}</span>}
                </div>

                <div className={`input-box full-width ${errors.purchaseDate ? "error" : ""}`}>
                  <label>Date of Purchase</label>
                  <input type="date" name="purchaseDate" onChange={handleInputChange} />
                  {errors.purchaseDate && <span className="error-text">{errors.purchaseDate}</span>}
                </div>
              </div>

              <button type="submit" className="glow-btn" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Generate Policy Quote"} <i className="fa-solid fa-bolt-lightning"></i>
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BuyInsurance;