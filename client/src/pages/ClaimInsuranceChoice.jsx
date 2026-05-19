import React from "react";
import { useNavigate } from "react-router-dom";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";
import "./ChooseInsurance.css";

export default function ClaimInsuranceChoice() {
  const navigate = useNavigate();

  const handleVehicle = () => {
    navigate("/claim-insurance/vehicle");
  };

  const handleTravel = () => {
    navigate("/claim-insurance/travel");
  };

  return (
    <>
      <InnerHeader />
      <div className="choose-insurance-container">
        <h1>Choose Claim Type</h1>
        <div className="button-group">
          <button type="button" onClick={handleVehicle}>
            Vehicle Insurance
            <span className="arrow-icon">→</span>
          </button>
          <button type="button" onClick={handleTravel}>
            Travel Insurance
            <span className="arrow-icon">→</span>
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
