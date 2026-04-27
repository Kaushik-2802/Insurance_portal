import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Login</h1>
          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="username">Username or Email</label>
            <input type="text" id="username" placeholder="Enter your username" />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />

            <button type="submit" className="login-btn">Submit</button>
          </form>
          <p className="register-link">
            Don’t have an account? <a href="/register">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
