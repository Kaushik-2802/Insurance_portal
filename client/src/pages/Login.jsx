import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  
  // 1. State for Inputs and Errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    setError(""); // Reset error on new attempt

    // 2. Dummy Validation Logic
    if (!email.includes("@")) {
      setError("Please enter a valid business email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // 3. Simulate API Call / Loading State
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      // Logic for demo redirect
      if (email === "johndoe@gmail.com" && password === "password123") {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials.");
      }
    }, 1500);
  };

  return (
    <div className="login-page">
      <div className="bg-blob"></div>
      <div className="bg-blob-2"></div>

      <div className={`login-card-glass ${error ? "shake-error" : ""}`}>
        <div className="brand-header">
          <div className="shield-icon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h2>LTI Insurance</h2>
          <p>Secure Portal Login</p>
        </div>

        <form className="login-form-modern" onSubmit={handleLogin}>
          {/* 4. Dynamic Error Message Display */}
          {error && <div className="error-banner">{error}</div>}

          <div className="input-wrapper">
            <i className="fa-solid fa-user"></i>
            <input 
              type="text" 
              id="username" 
              required 
              placeholder=" " 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="username">Username or Email</label>
          </div>

          <div className="input-wrapper">
            <i className="fa-solid fa-lock"></i>
            <input 
              type="password" 
              id="password" 
              required 
              placeholder=" " 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot" className="forgot-pass">Forgot Password?</Link>
          </div>

          <button type="submit" className="login-btn-premium" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span> 
            ) : (
              <>Access Account <i className="fa-solid fa-arrow-right"></i></>
            )}
          </button>
        </form>

        <p className="auth-footer">
          New to LTI? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}