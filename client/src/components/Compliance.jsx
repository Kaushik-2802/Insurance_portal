import React from "react";
import { useNavigate } from "react-router-dom";
import "./Compliance.css"

export default function Compliance() {
  const navigate = useNavigate();
  return (
    <div className="legal-page">
      <h1>Compliance</h1>
      <p>
        CTS Insurance operates under strict compliance with IRDAI and other regulatory
        bodies to ensure transparency, fairness, and customer protection.
      </p>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
}
