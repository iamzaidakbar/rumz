import React, { useState, useMemo } from "react";
import styles from "../styles/Booking.module.scss";
import DataTable from "../components/DataTable";
import { bookings } from "../data/bookings";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";

const TABS = ["All", "Upcoming", "Past"];

function getStatusPill(status) {
  const colorMap = {
    Confirmed: styles.confirmed,
    Pending: styles.pending,
    Cancelled: styles.cancelled,
  };
  return (
    <span className={`${styles.statusPill} ${colorMap[status]}`}>{status}</span>
  );
}

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
  const [tab, setTab] = useState("All");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (tab === "Upcoming") return bookings.filter(isUpcoming);
    if (tab === "Past") return bookings.filter(isPast);
    return bookings;
  }, [tab]);

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.header}>Bookings</h1>
        <button
          className={styles.newBookingBtn}
          onClick={() => navigate("/booking/new")}
        >
          New Booking
        </button>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        search
        searchPlaceholder="Search bookings"
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
        renderers={{
          status: (val) => getStatusPill(val),
        }}
        actions={(row) => (
          <IoEyeOutline
            size={20}
            className={styles.iconBtn}
            onClick={() => navigate(`/booking/${row.bookingId}`)}
            aria-label={`View booking ${row.bookingId}`}
          />
        )}
      />
    </div>
  );
};

export default Booking;
