import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import this
import "./InnerHeader.css";

export default function InnerHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate(); // Initialize the navigate function

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Add any logout logic here (like clearing localStorage/tokens)
    console.log("Logging out...");
    
    setIsOpen(false); // Close the menu
    navigate("/");    // Smoothly navigate to the home/root route
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
      <div className="logo">
        <h1>Shield General</h1>
        <p className="tagline">Secure your ride, secure your life</p>
      </div>

      <div className="userMenu" ref={menuRef}>
        <i className="fa-solid fa-user userIcon" onClick={toggleMenu}></i>

        {isOpen && (
          <div className="userDropdown">
            <div className="dropdownItem" onClick={() => navigate("/profile")}>Profile</div>
            <div className="dropdownItem" onClick={() => navigate("/my-insurance")}>My Insurance</div>
            <hr className="divider" />
            
            {/* Kept as a div, navigating via the handleLogout function */}
            <div className="dropdownItem logout" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  );
}