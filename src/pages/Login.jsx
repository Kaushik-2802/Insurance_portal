import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    // In a real app, you'd validate credentials here
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      {/* Dynamic background elements */}
      <div className="bg-blob"></div>
      <div className="bg-blob-2"></div>

      <div className="login-card-glass">
        <div className="brand-header">
          <div className="shield-icon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h2>Shield General</h2>
          <p>Secure Portal Login</p>
        </div>

        <form className="login-form-modern" onSubmit={handleLogin}>
          <div className="input-wrapper">
            <i className="fa-solid fa-user"></i>
            <input type="text" id="username" required placeholder=" " />
            <label htmlFor="username">Username or Email</label>
          </div>

          <div className="input-wrapper">
            <i className="fa-solid fa-lock"></i>
            <input type="password" id="password" required placeholder=" " />
            <label htmlFor="password">Password</label>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#forgot" className="forgot-pass">Forgot Password?</a>
          </div>

          <button type="submit" className="login-btn-premium">
            Access Account <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <p className="auth-footer">
          New to Shield? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}