import React, { useState, useRef } from "react";
import styles from "../styles/Layout.module.scss";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";

const Topbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const profileOptions = ["Profile", "Sign In", "Sign Out"];

  // Optional: Add a small delay to prevent flicker
  const closeTimeout = useRef();

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setShowDropdown(false), 100);
  };

  return (
    <div className={styles.topbar}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src="/favicon.ico"
          alt="Logo"
          style={{ height: 32, marginRight: 12 }}
        />
        <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>
          Hotel Dashboard
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          position: "relative",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <FaCircleUser size={32} style={{ cursor: "pointer" }} />
        {showDropdown && (
          <div className={styles.profileDropdown}>
            {profileOptions.map((option) => (
              <div key={option} className={styles.profileDropdownItem}>
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
