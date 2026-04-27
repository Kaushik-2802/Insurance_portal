import React, { useState, useEffect, useRef } from "react";
import "./InnerHeader.css";

export default function InnerHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Toggle menu visibility
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu if clicking outside of the userMenu
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
        <i 
          className="fa-solid fa-user userIcon" 
          onClick={toggleMenu}
        ></i>

        {/* Only show the dropdown if isOpen is true */}
        {isOpen && (
          <div className="userDropdown">
            <div className="dropdownItem">Profile</div>
            <div className="dropdownItem">My Insurance</div>
            <hr className="divider" />
            <div className="dropdownItem logout">Logout</div>
          </div>
        )}
      </div>
    </header>
  );
}