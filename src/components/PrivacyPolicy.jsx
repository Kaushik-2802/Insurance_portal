import React from "react";
import { useNavigate } from "react-router-dom";
import "./PrivacyPolicy.css"

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div className="legal-page">
      <h1>Privacy Policy</h1>
      <p>
        At LTI Insurance, we value your privacy. This page outlines how we collect,
        use, and protect your personal information in compliance with IRDAI regulations.
      </p>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}
