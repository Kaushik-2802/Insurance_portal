import React from "react";
import "./InnerHeader.css";

export default function InnerHeader() {
  return (
    <>
      <header className="header">
        <div className="logo">
          <h1>Shield General</h1>
          <p className="tagline">Secure your ride, secure your life</p>
        </div>

        <div className="nav userMenu">
          <i className="fa-solid fa-user userIcon"></i>
          <select className="userDropdown">
            <option value="profile">Profile</option>
            <option value="insurance">My Insurance</option>
            <option value="logout">Logout</option>
          </select>
        </div>
      </header>
    </>
  );
}
