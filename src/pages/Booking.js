import React, { useState, useMemo } from "react";
import styles from "../styles/Booking.module.scss";
import DataTable from "../components/DataTable";
import { bookings } from "../data/bookings";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";

const TABS = ["All", "Confirmed", "Pending", "Cancelled"];

function isUpcoming(b) {
  return new Date(b.checkIn) > new Date();
}
function isPast(b) {
  return new Date(b.checkOut) < new Date();
}

const columns = [
  { header: "Booking ID", accessor: "bookingId" },
  { header: "Guest Name", accessor: "guestName" },
  { header: "Check-in", accessor: "checkIn" },
  { header: "Check-out", accessor: "checkOut" },
  { header: "Room Type", accessor: "roomType" },
  { header: "Status", accessor: "status" },
];

const Booking = () => {
  const { theme } = useAppContext();
  const [tab, setTab] = useState("All");
  const navigate = useNavigate();

  function getStatusPill(status) {
    const colorMap = {
      Confirmed: styles.confirmed,
      Pending: styles.pending,
      Cancelled: styles.cancelled,
    };
    return (
      <span className={`${styles.statusPill} ${colorMap[status]}`}>
        {status}
      </span>
    );
  }

  const filtered = useMemo(() => {
    if (tab === "All") return bookings;
    return bookings.filter((b) => b.status === tab);
  }, [tab]);

  return (
    <motion.div
      className={styles.page}
      data-theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.headerRow}>
        <h1 className={styles.header}>Bookings</h1>
        <button
          className={styles.newBookingBtn}
          onClick={() => navigate("/booking/new")}
        >
          + New Booking
        </button>
      </div>
      <p className={styles.subtitle}>
        Review and manage all guest reservations.
      </p>
      <DataTable
        columns={columns}
        data={filtered}
        search
        searchPlaceholder="Search by guest, ID, or room type"
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
        renderers={{
          status: (val) => getStatusPill(val),
        }}
        actions={(row) => (
          <button
            className={styles.viewBtn}
            onClick={() => navigate(`/booking/${row.bookingId}`)}
            aria-label={`View booking ${row.bookingId}`}
          >
            <IoEyeOutline size={20} />
          </button>
        )}
      />
    </motion.div>
  );
};

export default Booking;
