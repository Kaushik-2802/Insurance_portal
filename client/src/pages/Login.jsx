import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid business email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.msg ||
          "Something went wrong."
        );
      }

      console.log("Login Success Data:", data);

      // CLEAR OLD STORAGE
      localStorage.clear();

      // SAVE JWT TOKEN
      localStorage.setItem("token", data.token);

      // SAVE USER ID
      localStorage.setItem("userId", data.userId);

      console.log(
        "TOKEN AFTER SAVE:",
        localStorage.getItem("token")
      );

      navigate("/dashboard");

    } catch (err) {

      setError(err.message);

    } finally {

      setIsLoading(false);
    }
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

          <h2>CTS Insurance</h2>

          <p>Secure Portal Login</p>

        </div>

        <form
          className="login-form-modern"
          onSubmit={handleLogin}
        >

          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <div className="input-wrapper">

            <i className="fa-solid fa-user"></i>

            <input
              type="text"
              required
              placeholder=" "
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <label>Email</label>

          </div>

          <div className="input-wrapper">

            <i className="fa-solid fa-lock"></i>

            <input
              type="password"
              required
              placeholder=" "
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <label>Password</label>

          </div>
          <div className="form-options">
            {/* <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label> */}
            <Link to="/forgot" className="forgot-pass">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            className="login-btn-premium"
            disabled={isLoading}
          >

            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                Access Account
                <i className="fa-solid fa-arrow-right"></i>
              </>
            )}

          </button>


        </form>

        <p className="auth-footer">
          New to CTS?
          <Link to="/register">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}