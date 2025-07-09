import React, { useMemo } from "react";
import styles from "../styles/GuestActivity.module.scss";
import { useAppContext } from "../contexts/AppContext";
import { useBookingsContext } from "../contexts/BookingsContext";

const GuestActivity = () => {
  const { theme } = useAppContext();
  const { bookings, loading } = useBookingsContext();

  // Compute recent and upcoming guests in-memory
  const { recentGuests, upcomingGuests } = useMemo(() => {
    const today = new Date();
    const recent = bookings
      .filter((b) => {
        const checkIn = new Date(b.booking_details?.check_in_date);
        const diff = (today - checkIn) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff < 2;
      })
      .slice(0, 5);
    const upcoming = bookings
      .filter((b) => {
        const checkIn = new Date(b.booking_details?.check_in_date);
        const diff = (checkIn - today) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff < 2;
      })
      .slice(0, 5);
    return { recentGuests: recent, upcomingGuests: upcoming };
  }, [bookings]);

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
