import React, { useState, useMemo, useEffect } from "react";
import styles from "../styles/Booking.module.scss";
import DataTable from "../components/DataTable";
import {
  IoEyeOutline,
  IoTrashOutline,
  IoWarningOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { bookingsApi } from "../api/bookingsApi";
import LoadingFallback from "../components/LoadingFallback";
import InfoMessage from "../components/InfoMessage";
import { MdOutlineEdit } from "react-icons/md";

const TABS = ["All", "Confirmed", "Pending", "Cancelled"];

const columns = [
  { header: "Booking ID", accessor: "booking_reference_id" },
  { header: "Guest Name", accessor: (row) => row.guest_info.full_name },
  { header: "Check-in", accessor: (row) => row.booking_details.check_in_date },
  {
    header: "Check-out",
    accessor: (row) => row.booking_details.check_out_date,
  },
  {
    header: "Room(s)",
    accessor: (row) => row.booking_details.room_ids?.join(", "),
  },
  {
    header: "Guests",
    accessor: (row) => row.booking_details.number_of_guests,
  },
  {
    header: "Payment Status",
    accessor: (row) => row.payment_info.payment_status,
  },
  { header: "Booking Status", accessor: (row) => row.status.booking_status },
];

const Booking = () => {
  const { theme } = useAppContext();
  const [tab, setTab] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingsApi.getBookings();
        setBookings(data);
      } catch (err) {
        setError("Failed to fetch bookings.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDelete = async (booking) => {
    if (!booking) return;
    try {
      await bookingsApi.deleteBooking(booking.booking_reference_id);
      setBookings((prev) =>
        prev.filter(
          (b) => b.booking_reference_id !== booking.booking_reference_id
        )
      );
    } catch (err) {
      setError("Failed to delete booking.");
    }
  };

  function getBookingStatusPill(status) {
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

  function getPaymentStatusPill(status) {
    const colorMap = {
      Paid: styles.paid,
      Pending: styles.pendingPayment,
    };
    return (
      <span className={`${styles.statusPill} ${colorMap[status]}`}>
        {status}
      </span>
    );
  }

  const filteredData = useMemo(() => {
    if (tab === "All") return bookings;
    return bookings.filter((b) => b.status.booking_status === tab);
  }, [tab, bookings]);

  if (loading) return <LoadingFallback />;
  if (error)
    return (
      <InfoMessage icon={IoWarningOutline} title="Error" message={error} />
    );

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
          onClick={() => navigate("/bookings/add")}
        >
          + New Booking
        </button>
      </div>
      <p className={styles.subtitle}>
        Review and manage all guest reservations.
      </p>
      <DataTable
        columns={columns}
        data={filteredData}
        search
        searchPlaceholder="Search by guest, ID, or room type"
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
        renderers={{
          "Booking Status": (val) => getBookingStatusPill(val),
          "Payment Status": (val) => getPaymentStatusPill(val),
        }}
        actions={(row, openDialog) => (
          <div className={styles.actionBtns}>
            <button
              className={styles.iconBtn}
              onClick={() => navigate(`/bookings/${row.booking_reference_id}`)}
            >
              <IoEyeOutline size={20} />
            </button>
            <button
              className={styles.iconBtn}
              onClick={() =>
                navigate(`/bookings/${row.booking_reference_id}/edit`)
              }
            >
              <MdOutlineEdit size={20} />
            </button>
            <button
              className={`${styles.iconBtn} ${styles.deleteBtn}`}
              onClick={() => openDialog(row)}
            >
              <IoTrashOutline size={20} />
            </button>
          </div>
        )}
        noDataInfo={{
          icon: IoCalendarOutline,
          title: "No Bookings Found",
          message:
            "No bookings found matching your criteria. Try adjusting your filters or search term.",
        }}
        deleteDialogInfo={{
          title: "Delete Booking",
          message: "Are you sure you want to permanently delete this booking?",
        }}
        onConfirmDelete={handleDelete}
      />
    </motion.div>
  );
};

export default Booking;
