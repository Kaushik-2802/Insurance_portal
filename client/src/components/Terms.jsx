import React from "react";
import { useNavigate } from "react-router-dom";
import "./Terms.css"

export default function Terms() {
  const navigate = useNavigate();
  return (
    <div className="legal-page">
      <h1>Terms & Conditions</h1>
      <p>
        These terms govern the use of our insurance services, including policy purchase,
        claims, and renewals. By using our platform, you agree to abide by these terms.
      </p>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}
