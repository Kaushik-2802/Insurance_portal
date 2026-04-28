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
  const navigate=useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/policy-type")
  };
  return (
    <div className="page-wrapper">
      <InnerHeader />
      
      <main className="buy-insurance-main">
        {/* Background Decorative Elements */}
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>

        <section className="glass-container">
          <div className="header-content">
            <h1>Protect Your Journey</h1>
            <p>Get instant premium coverage in just a few steps.</p>
          </div>

          {/* Premium Vehicle Selector */}
          <div className="visual-selector">
            <div 
              className={`selection-card ${activeForm === "bike" ? "active" : ""}`}
              onClick={() => setActiveForm("bike")}
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
              onClick={() => setActiveForm("car")}
            >
              <div className="card-icon"><i className="fa-solid fa-car-side"></i></div>
              <div className="card-info">
                <span>Four-Wheeler</span>
                <small>Private Cars & SUVs</small>
              </div>
              {activeForm === "car" && <i className="fa-solid fa-circle-check checkmark"></i>}
            </div>
          </div>

          {/* Dynamic Form Section */}
          <div className="form-wrapper animated-fade">
            <div className="form-header">
              <h3><i className="fa-solid fa-file-invoice"></i> {activeForm === 'bike' ? 'Bike' : 'Car'} Details</h3>
              <div className="divider"></div>
            </div>

            <form onSubmit={handleSubmit} className="premium-form">
              <div className="form-grid">
                <div className="input-box">
                  <label>Manufacturer</label>
                  <input type="text" name="manufacturer" placeholder="e.g. BMW, Honda" required onChange={handleInputChange} />
                </div>
                <div className="input-box">
                  <label>Model Name</label>
                  <input type="text" name="model" placeholder="e.g. Civic, S1000RR" required onChange={handleInputChange} />
                </div>
                <div className="input-box">
                  <label>Registration Number</label>
                  <input type="text" name="registrationNumber" placeholder="XX 00 XX 0000" required onChange={handleInputChange} />
                </div>
                <div className="input-box">
                  <label>Driving License</label>
                  <input type="text" name="drivingLicense" placeholder="Enter DL Number" required onChange={handleInputChange} />
                </div>
                <div className="input-box">
                  <label>Engine Number</label>
                  <input type="text" name="engineNumber" placeholder="Engine ID" required onChange={handleInputChange} />
                </div>
                <div className="input-box">
                  <label>Chassis Number</label>
                  <input type="text" name="chasisNumber" placeholder="Chassis ID" required onChange={handleInputChange} />
                </div>
                <div className="input-box full-width">
                  <label>Date of Purchase</label>
                  <input type="date" name="purchaseDate" required onChange={handleInputChange} />
                </div>
              </div>

              <button type="submit" className="glow-btn">
                Generate Policy Quote <i className="fa-solid fa-bolt-lightning"></i>
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