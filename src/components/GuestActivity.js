import React, { useEffect, useState } from "react";
import styles from "../styles/GuestActivity.module.scss";
import { useAppContext } from "../contexts/AppContext";
import { bookingsApi } from "../api/bookingsApi";

const GuestActivity = () => {
  const { theme } = useAppContext();
  const [recentGuests, setRecentGuests] = useState([]);
  const [upcomingGuests, setUpcomingGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const bookings = await bookingsApi.getBookings();
      const today = new Date();
      // Recent Guests: checked in within last 2 days (including today)
      const recent = bookings
        .filter((b) => {
          const checkIn = new Date(b.booking_details?.check_in_date);
          const diff = (today - checkIn) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff < 2;
        })
        .slice(0, 5);
      // Upcoming Guests: check-in in next 2 days
      const upcoming = bookings
        .filter((b) => {
          const checkIn = new Date(b.booking_details?.check_in_date);
          const diff = (checkIn - today) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff < 2;
        })
        .slice(0, 5);
      setRecentGuests(recent);
      setUpcomingGuests(upcoming);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  return (
    <div className={styles.guestActivity} data-theme={theme}>
      <div className={styles.activitySection}>
        <h3 className={styles.sectionTitle}>Recent Guests</h3>
        {loading ? (
          <p className={styles.emptyMessage}>Loading...</p>
        ) : recentGuests.length > 0 ? (
          <ul className={styles.activityList}>
            {recentGuests.map((b, i) => (
              <li key={b.booking_reference_id || i}>
                <span>{b.guest_info?.full_name || "-"}</span> in{" "}
                <span>{b.booking_details?.room_type || "-"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyMessage}>No recent guests.</p>
        )}
      </div>
      <div className={styles.activitySection}>
        <h3 className={styles.sectionTitle}>Upcoming Guests</h3>
        {loading ? (
          <p className={styles.emptyMessage}>Loading...</p>
        ) : upcomingGuests.length > 0 ? (
          <ul className={styles.activityList}>
            {upcomingGuests.map((b, i) => (
              <li key={b.booking_reference_id || i}>
                <span>{b.guest_info?.full_name || "-"}</span> in{" "}
                <span>{b.booking_details?.room_type || "-"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyMessage}>No upcoming guests.</p>
        )}
      </div>
    </div>
  );
};

export default GuestActivity;
