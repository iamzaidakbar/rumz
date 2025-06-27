import React from "react";
import styles from "../styles/GuestActivity.module.scss";
import { bookings } from "../data/bookings";
import { useAppContext } from "../contexts/AppContext";

const GuestActivity = () => {
  const { theme } = useAppContext();
  const today = new Date();
  const recentCheckins = bookings
    .filter((b) => {
      const checkInDate = new Date(b.checkIn);
      const diffDays = (today - checkInDate) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays < 2;
    })
    .slice(0, 5);

  const upcomingCheckouts = bookings
    .filter((b) => {
      const checkOutDate = new Date(b.checkOut);
      const diffDays = (checkOutDate - today) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays < 2;
    })
    .slice(0, 5);

  return (
    <div className={styles.guestActivity} data-theme={theme}>
      <div className={styles.activitySection}>
        <h3 className={styles.sectionTitle}>Recent Check-ins</h3>
        {recentCheckins.length > 0 ? (
          <ul className={styles.activityList}>
            {recentCheckins.map((b) => (
              <li key={b.id}>
                <span>{b.guestName}</span> in <span>{b.roomType}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyMessage}>No recent check-ins.</p>
        )}
      </div>
      <div className={styles.activitySection}>
        <h3 className={styles.sectionTitle}>Upcoming Check-outs</h3>
        {upcomingCheckouts.length > 0 ? (
          <ul className={styles.activityList}>
            {upcomingCheckouts.map((b) => (
              <li key={b.id}>
                <span>{b.guestName}</span> from <span>{b.roomType}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyMessage}>No upcoming check-outs.</p>
        )}
      </div>
    </div>
  );
};

export default GuestActivity;
