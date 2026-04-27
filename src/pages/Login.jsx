import React from "react";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-body">
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <form className="login-form">
          <label htmlFor="username">Username or Email</label>
          <input type="text" id="username" placeholder="Enter your username" />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" />

          <button type="submit" className="login-btn"><a href="/dashboard">Submit</a></button>
        </form>
        <p className="register-link">
          Don’t have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
    </div>
  );
}
