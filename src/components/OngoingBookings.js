import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/OngoingBookings.module.scss";
import DataTable from "./DataTable";
import { useAppContext } from "../contexts/AppContext";
import { bookingsApi } from "../api/bookingsApi";
import StatusPill from "./StatusPill";

function isOngoing(booking) {
  const today = new Date();
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  return today >= checkIn && today <= checkOut;
}

const columns = [
  { header: "Guest", accessor: "guestName" },
  { header: "Check-in", accessor: "checkIn" },
  { header: "Check-out", accessor: "checkOut" },
  { header: "Room", accessor: "roomType" },
  {
    header: "Status",
    accessor: (row) => <StatusPill status={row.status} type="booking" />,
  },
];

const OngoingBookings = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [ongoing, setOngoing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const bookings = await bookingsApi.getBookings();
      // Map real data to expected fields for the table
      const mapped = bookings.map((b) => ({
        guestName: b.guest_info?.full_name || b.guestName || "-",
        checkIn: b.booking_details?.check_in_date || b.checkIn || "-",
        checkOut: b.booking_details?.check_out_date || b.checkOut || "-",
        roomType: b.booking_details?.room_type || b.roomType || "-",
        status: b.status?.booking_status || b.status || "-",
      }));
      // Use the same isOngoing logic
      const today = new Date();
      const filtered = mapped.filter((booking) => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        return today >= checkIn && today <= checkOut;
      });
      setOngoing(filtered);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  return (
    <section
      className={styles.ongoingSection}
      data-theme={theme}
      aria-label="Ongoing Bookings"
    >
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Ongoing Bookings</h2>
      </div>
      {loading ? (
        <div className={styles.empty}>Loading...</div>
      ) : ongoing.length > 0 ? (
        <DataTable
          columns={columns}
          data={ongoing}
          renderers={{
            status: (val) => <StatusPill status={val} type="booking" />,
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
