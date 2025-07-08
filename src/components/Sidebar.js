import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/Sidebar.module.scss";
import { useAppContext } from "../contexts/AppContext";
import {
  IoHomeOutline,
  IoBedOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoPersonOutline,
} from "react-icons/io5";

const Sidebar = () => {
  const { theme, appData } = useAppContext();

  return (
    <aside className={styles.sidebar} data-theme={theme}>
      <div className={styles.logoSection}>
        {appData?.hotelLogo ? (
          <img
            src={appData.hotelLogo}
            alt={appData.hotelname || "Hotel Logo"}
            className={styles.hotelLogo}
            width={48}
            height={48}
            style={{ borderRadius: 8, objectFit: "cover" }}
          />
        ) : (
          <div className={styles.logoPlaceholder} />
        )}
        <span className={styles.hotelName}>
          {appData?.hotelname || "Hotel"}
        </span>
      </div>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <IoHomeOutline />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/rooms"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <IoBedOutline />
          <span>Rooms</span>
        </NavLink>
        <NavLink
          to="/booking"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <IoCalendarOutline />
          <span>Bookings</span>
        </NavLink>
        <NavLink
          to="/guests"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <IoPeopleOutline />
          <span>Guests</span>
        </NavLink>
        {/* <NavLink
          to="/owner"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <IoPersonOutline />
          <span>Owner</span>
        </NavLink> */}
      </nav>
      <div className={styles.footer}>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${styles.settingsLink} ${isActive ? styles.active : ""}`
          }
        >
          <IoSettingsOutline />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
