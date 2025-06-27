import React from "react";
import { bookings } from "../data/bookings";
import { useNavigate } from "react-router-dom";
import styles from "../styles/OngoingBookings.module.scss";
import DataTable from "./DataTable";
import { useAppContext } from "../contexts/AppContext";

function isOngoing(booking) {
  const today = new Date();
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  return today >= checkIn && today <= checkOut;
}

const getStatusPill = (status) => {
  const statusMap = {
    Confirmed: styles.confirmed,
    Pending: styles.pending,
    Cancelled: styles.cancelled,
  };
  return (
    <span className={`${styles.statusPill} ${statusMap[status]}`}>
      {status}
    </span>
  );
};

const columns = [
  { header: "Guest", accessor: "guestName" },
  { header: "Check-in", accessor: "checkIn" },
  { header: "Check-out", accessor: "checkOut" },
  { header: "Room", accessor: "roomType" },
  { header: "Status", accessor: "status" },
];

const OngoingBookings = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const ongoing = bookings.filter(isOngoing);

  return (
    <section
      className={styles.ongoingSection}
      data-theme={theme}
      aria-label="Ongoing Bookings"
    >
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Ongoing Bookings</h2>
      </div>
      {ongoing.length > 0 ? (
        <DataTable
          columns={columns}
          data={ongoing}
          renderers={{
            status: (val) => getStatusPill(val),
          }}
        />
      ) : (
        <div className={styles.empty}>No ongoing bookings right now.</div>
      )}
      <button
        className={styles.checkAllBtn}
        onClick={() => navigate("/booking")}
        aria-label="Check all bookings"
      >
        Check All Bookings
      </button>
    </section>
  );
};

export default OngoingBookings;
