import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/OngoingBookings.module.scss";
import DataTable from "./DataTable";
import { useAppContext } from "../contexts/AppContext";
import StatusPill from "./StatusPill";
import CustomButton from "./CustomButton";
import { useBookingsContext } from "../contexts/BookingsContext";

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
  const { bookings, loading } = useBookingsContext();

  // Map and filter ongoing bookings in-memory
  const ongoing = useMemo(() => {
    const today = new Date();
    return bookings
      .map((b) => ({
        guestName: b.guest_info?.full_name || b.guestName || "-",
        checkIn: b.booking_details?.check_in_date || b.checkIn || "-",
        checkOut: b.booking_details?.check_out_date || b.checkOut || "-",
        roomType: b.booking_details?.room_type || b.roomType || "-",
        status: b.status?.booking_status || b.status || "-",
      }))
      .filter((booking) => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        return today >= checkIn && today <= checkOut;
      });
  }, [bookings]);

  return (
    <section
      className={styles.ongoingSection}
      data-theme={theme}
      aria-label="Ongoing Bookings"
    >
      <div>
        <h2>Ongoing Bookings</h2>
        <p>
          View your current bookings. Click on check all booking to see details
          or edit.
        </p>
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
      <CustomButton
        className={styles.checkAllBtn}
        onClick={() => navigate("/booking")}
        aria-label="Check all bookings"
      >
        Check All Bookings
      </CustomButton>
    </section>
  );
};

export default OngoingBookings;
