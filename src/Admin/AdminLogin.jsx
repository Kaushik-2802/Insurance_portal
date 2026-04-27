import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  
  const ADMIN_USER = "Admin";
  const ADMIN_PASS = "Admin1234";
  const navigate = useNavigate();

  const handleInput = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(false); // Reset error while typing
  };

const handleSubmit = (e) => {
  e.preventDefault();
  if (credentials.username === ADMIN_USER && credentials.password === ADMIN_PASS) {
    localStorage.setItem('isAdminAuthenticated', 'true');
    navigate("/admin-dashboard");
  } else {
    setError(true);
  }
};

  return (
    <div className="admin-portal-root">
      {/* Background Glows */}
      <div className="glow-circle top-right"></div>
      <div className="glow-circle bottom-left"></div>

      <div className={`admin-login-card ${error ? "shake" : ""}`}>
        <div className="terminal-header">
          <div className="dots">
            <span></span><span></span><span></span>
          </div>
          <span className="terminal-title">admin_auth_v2.exe</span>
        </div>

        <div className="card-body">
          <div className="auth-icon-box">
            <i className="fa-solid fa-user-gear"></i>
          </div>
          
          <h2>System Access</h2>
          <p>Personnel clearance level 4 required.</p>

          <form onSubmit={handleSubmit}>
            <div className="admin-input-group">
              <i className="fa-solid fa-terminal"></i>
              <input
                type="text"
                name="username"
                placeholder="Root Username"
                value={credentials.username}
                onChange={handleInput}
                required
              />
            </div>

            <div className="admin-input-group">
              <i className="fa-solid fa-key"></i>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Access Key"
                value={credentials.password}
                onChange={handleInput}
                required
              />
              <button 
                type="button" 
                className="toggle-eye" 
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
              </button>
            </div>

            {error && <div className="auth-error-msg">ACCESS DENIED: Invalid Credentials</div>}

            <button type="submit" className="access-btn">
              Authenticate <i className="fa-solid fa-shield-check"></i>
            </button>
          </form>
        </div>
        
        <div className="admin-footer-status">
          <span className="status-indicator"></span> System Secure: 256-bit AES
        </div>
      </div>
    </div>
  );
}