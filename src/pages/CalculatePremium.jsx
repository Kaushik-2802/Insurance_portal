import React, { useState, useEffect } from "react";
import "./CalculatePremium.css";

export default function CalculatePremium() {
  const vehicleData = {
    Car: {
      Toyota: ["Camry", "Corolla", "Fortuner"],
      Honda: ["City", "Amaze", "Elevate"],
      Tata: ["Nexon", "Harrier", "Safari"]
    },
    Bike: {
      Yamaha: ["R15", "MT-15", "FZ"],
      RoyalEnfield: ["Classic 350", "Hunter", "Bullet"]
    }
  };

  const [type, setType] = useState("Car");
  const [company, setCompany] = useState("Toyota");
  const [model, setModel] = useState("Camry");
  const [duration, setDuration] = useState(1);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const companies = Object.keys(vehicleData[type]);
    setCompany(companies[0]);
    setModel(vehicleData[type][companies[0]][0]);
  }, [type]);

  useEffect(() => {
    setModel(vehicleData[type][company][0]);
  }, [company, type]);

  const handleCalculate = () => {
    const base = type === "Car" ? 5500 : 1800;
    setQuote((base * duration * 1.18).toLocaleString());
  };

  return (
    <div className="premium-wrapper">
      <div className="premium-card">
        {/* LEFT SIDE: FORM */}
        <div className="form-side">
          <h2 className="title-navy">Quick Premium Estimator</h2>
          <p className="subtitle">Select your vehicle details to see respective models.</p>
          
          <div className="grid-inputs">
            <div className="input-group">
              <label>Vehicle Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {Object.keys(vehicleData).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label>Company</label>
              <select value={company} onChange={(e) => setCompany(e.target.value)}>
                {Object.keys(vehicleData[type]).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label>Model</label>
              <select value={model} onChange={(e) => setModel(e.target.value)}>
                {vehicleData[type][company].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label>Duration (Years)</label>
              <input type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>

          <button className="btn-calculate" onClick={handleCalculate}>
            Calculate Quote
          </button>
        </div>

        {/* RIGHT SIDE: RESULT BOX */}
        <div className={`result-side ${quote ? "active" : ""}`}>
          {!quote ? (
            <div className="placeholder-text">Waiting for your selection...</div>
          ) : (
            <div className="quote-display">
              <span className="label-white">Summary for {model}</span>
              <h1 className="amount-yellow">₹{quote}</h1>
              <div className="breakdown-list">
                <p>📍 {company} India Coverage</p>
                <p>⏱️ {duration} Year(s) Tenure</p>
                <p>💎 Comprehensive Protection</p>
              </div>
              <button className="btn-buy-now">Proceed to Buy</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}