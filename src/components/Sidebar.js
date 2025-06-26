import React from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import styles from "../styles/Sidebar.module.scss";
// Dashboard
import { IoHomeOutline, IoHome } from "react-icons/io5";
// Bookings
import {
  IoCalendarNumberOutline,
  IoCalendarNumberSharp,
} from "react-icons/io5";
// Guests
import { HiOutlineUsers } from "react-icons/hi2";
import { HiMiniUsers } from "react-icons/hi2";
// Rooms
import { PiBedDuotone, PiBedFill } from "react-icons/pi";
// Settings
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: (active) =>
      active ? (
        <IoHome color="#000" size={20} />
      ) : (
        <IoHomeOutline color="#000" size={20} />
      ),
    end: true,
  },
  {
    to: "/booking",
    label: "Bookings",
    icon: (active) =>
      active ? (
        <IoCalendarNumberSharp color="#000" size={20} />
      ) : (
        <IoCalendarNumberOutline color="#000" size={20} />
      ),
  },
  {
    to: "/guests",
    label: "Guests",
    icon: (active) =>
      active ? (
        <HiMiniUsers color="#000" size={20} />
      ) : (
        <HiOutlineUsers color="#000" size={20} />
      ),
  },
  {
    to: "/rooms",
    label: "Rooms",
    icon: (active) =>
      active ? (
        <PiBedFill color="#000" size={20} />
      ) : (
        <PiBedDuotone color="#000" size={20} />
      ),
  },
  {
    to: "/settings",
    label: "Settings",
    icon: (active) =>
      active ? (
        <IoMdSettings color="#000" size={20} />
      ) : (
        <IoSettingsOutline color="#000" size={20} />
      ),
  },
];

// Sidebar with app title, menu, and theme toggle
const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <aside className={styles.sidebar} data-theme={theme}>
      <div className={styles.title}>Rumz Residency</div>
      <nav className={styles.menu}>
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            {({ isActive }) => (
              <>
                {icon(isActive)}
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <button className={styles.themeToggle} onClick={toggleTheme}>
        {theme === "light" ? "🌞" : "🌙"}
      </button>
    </aside>
  );
};

export default Sidebar;
