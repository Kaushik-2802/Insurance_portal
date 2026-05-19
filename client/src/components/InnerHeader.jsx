import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./InnerHeader.css";

export default function InnerHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Logic: clear tokens here
    setIsOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/dashboard")} style={{cursor: 'pointer'}}>
        <h1>LTI Insurance</h1>
        <p className="tagline">PREMIUM PROTECTION</p>
      </div>

      <div className="userMenu" ref={menuRef} onClick={toggleMenu}>
        <div className="user-info-text" style={{ textAlign: 'right', color: 'white', marginRight: '10px' }}>
          <small style={{ opacity: 0.7, fontSize: '0.7rem', display: 'block' }}>Welcome back,</small>
          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Member</span>
        </div>
        
        <div className="userIcon-wrapper">
          <i className="fa-solid fa-user userIcon"></i>
        </div>

        {isOpen && (
          <div className="userDropdown">
            <div className="dropdown-header">
              <span>Account Settings</span>
            </div>
            
            <div className="dropdownItem" onClick={() => navigate("/profile")}>
              <i className="fa-solid fa-circle-user"></i> Profile Details
            </div>
            
            <div className="dropdownItem" onClick={() => navigate("/my-insurance")}>
              <i className="fa-solid fa-shield-halved"></i> My Policies
            </div>

            <div className="dropdownItem" onClick={() => navigate("/support")}>
              <i className="fa-solid fa-headset"></i> Help Support
            </div>
            
            <hr style={{ border: 0, borderTop: '1px solid #eee', margin: 0 }} />
            
            <div className="dropdownItem logout" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
            </div>
          </div>
        )}
      </div>
    </header>
  );
}