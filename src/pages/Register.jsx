import React from "react";
import "./Register.css";

export default function Register() {
  return (
    <div className="register-body">
      <div className="register-container">
        <div className="register-card">
          <h1 className="register-title">Register</h1>
          <form className="register-form">

            {/* Name fields side by side */}
            <div className="name-row">
              <div className="form-group">
                <label htmlFor="firstname">First Name</label>
                <input type="text" id="firstname" placeholder="First name" required />
              </div>
              <div className="form-group">
                <label htmlFor="middlename">Middle Name</label>
                <input type="text" id="middlename" placeholder="Middle name" />
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Last Name</label>
                <input type="text" id="lastname" placeholder="Last name" required />
              </div>
            </div>

            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email id" required />

            <label htmlFor="phoneno">Mobile Number</label>
            <input type="tel" id="phoneno" placeholder="Enter your mobile number" required />

            {/* Address split into multiple fields */}
            <label>Address</label>
            <div className="address-row">
              <input type="text" id="street" placeholder="Street" required />
              <input type="text" id="city" placeholder="City" required />
            </div>
            <div className="address-row">
              <input type="text" id="country" placeholder="Country" required />
              <input type="text" id="pincode" placeholder="Pincode" required />
            </div>

            <label htmlFor="password">Set Password</label>
            <input type="password" id="password" placeholder="Enter your password" required />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" placeholder="Re-enter your password" required />

            <label htmlFor="photo">Upload Photo</label>
            <input type="file" id="photo" accept="image/*" />

            <button type="submit" className="register-btn">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
