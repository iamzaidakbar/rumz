import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import styles from "../styles/MetricCard.module.scss";
import {
  FaRupeeSign,
  FaBed,
  FaDoorOpen,
  FaClipboardList,
  FaUserFriends,
  FaBan,
  FaCalendarCheck,
} from "react-icons/fa";

const iconMap = {
  "Total Revenue": <FaRupeeSign className={styles.icon} />,
  "Total Rooms": <FaBed className={styles.icon} />,
  "Available Rooms": <FaDoorOpen className={styles.icon} />,
  "Total Bookings": <FaClipboardList className={styles.icon} />,
  "Total Guests": <FaUserFriends className={styles.icon} />,
  "Cancelled Bookings": <FaBan className={styles.icon} />,
  "Upcoming Check-ins": <FaCalendarCheck className={styles.icon} />,
};

function useCountUp(value, duration = 1000) {
  const [display, setDisplay] = useState(typeof value === "number" ? 0 : value);
  const ref = useRef();

  useEffect(() => {
    if (typeof value !== "number") {
      setDisplay(value);
      return;
    }
    let start = 0;
    let startTime = null;
    function animate(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const current = Math.floor(progress * value);
      setDisplay(current);
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    }
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);
  return display;
}

const MetricCard = ({ label, value }) => {
  const { theme } = useAppContext();
  const icon = iconMap[label] || <FaClipboardList className={styles.icon} />;
  const animatedValue = useCountUp(
    typeof value === "string" && value.startsWith("₹")
      ? parseInt(value.replace(/[^\d]/g, ""), 10)
      : typeof value === "number"
      ? value
      : value,
    900
  );
  const displayValue =
    typeof value === "string" && value.startsWith("₹")
      ? `₹${animatedValue.toLocaleString()}`
      : typeof value === "number"
      ? animatedValue.toLocaleString()
      : value;
  return (
    <div
      className={styles.metricCard}
      data-theme={theme}
      aria-label={`${label}: ${value}`}
    >
      <div className={styles.iconLabelRow}>
        <span className={styles.iconWrap}>{icon}</span>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.value}>{displayValue}</div>
    </div>
  );
};

export default MetricCard;
