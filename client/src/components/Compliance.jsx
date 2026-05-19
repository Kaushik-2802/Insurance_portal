import React from "react";
import { useNavigate } from "react-router-dom";
import "./Compliance.css"

export default function Compliance() {
  const navigate = useNavigate();
  return (
    <div className="legal-page">
      <h1>Compliance</h1>
      <p>
        LTI Insurance operates under strict compliance with IRDAI and other regulatory
        bodies to ensure transparency, fairness, and customer protection.
      </p>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}
