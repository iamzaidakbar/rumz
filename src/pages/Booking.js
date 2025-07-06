import React, { useState, useMemo, useEffect } from "react";
import styles from "../styles/Booking.module.scss";
import DataTable from "../components/DataTable";
import {
  IoEyeOutline,
  IoTrashOutline,
  IoWarningOutline,
  IoCalendarOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { bookingsApi } from "../api/bookingsApi";
import CustomButton from "../components/CustomButton";
import LoadingFallback from "../components/LoadingFallback";
import InfoMessage from "../components/InfoMessage";
import ConfirmDialog from "../components/ConfirmDialog";
import { MdOutlineEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import CustomDropdown from "../components/CustomDropdown";

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
    accessor: (row) => row.booking_details.room_nos?.join(", "),
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
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelPaymentStatus, setCancelPaymentStatus] = useState("Refunded"); // default to Refunded
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

  const openCancelDialog = (booking) => {
    setBookingToCancel(booking);
    setCancelPaymentStatus(booking.payment_info.payment_status || "Refunded");
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;

    setIsCancelling(true);
    try {
      // Prepare update data
      const updateData = {
        status: {
          ...bookingToCancel.status,
          booking_status: "Cancelled",
        },
        payment_info: {
          ...bookingToCancel.payment_info,
          payment_status: cancelPaymentStatus,
        },
      };

      // Use the updateBooking API to update both status and payment status
      const updatedBooking = await bookingsApi.updateBooking(
        bookingToCancel.booking_reference_id,
        updateData
      );

      // Update local state with the response from API
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_reference_id === bookingToCancel.booking_reference_id
            ? updatedBooking
            : b
        )
      );

      setShowCancelDialog(false);
      setBookingToCancel(null);
    } catch (err) {
      setError("Failed to cancel booking.");
      console.error("Error cancelling booking:", err);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCloseCancelDialog = () => {
    setShowCancelDialog(false);
    setBookingToCancel(null);
  };

  // Check if booking is ongoing or upcoming (not past)
  const isBookingActive = (booking) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    const checkOutDate = new Date(booking.booking_details.check_out_date);
    checkOutDate.setHours(0, 0, 0, 0);

    return checkOutDate >= today;
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
      Refunded: styles.refunded,
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
        <CustomButton
          variant="primary"
          className={styles.newBookingBtn}
          onClick={() => navigate("/bookings/add")}
        >
          <IoMdAdd /> New Booking
        </CustomButton>
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
              title="View Details"
            >
              <IoEyeOutline size={20} />
            </button>
            <button
              className={styles.iconBtn}
              onClick={() =>
                navigate(`/bookings/${row.booking_reference_id}/edit`)
              }
              title="Edit Booking"
            >
              <MdOutlineEdit size={20} />
            </button>
            <button
              className={`${styles.iconBtn} ${styles.deleteBtn}`}
              onClick={() => openDialog(row)}
              title="Delete Booking"
            >
              <IoTrashOutline size={20} />
            </button>
            {isBookingActive(row) &&
              row.status.booking_status !== "Cancelled" && (
                <button
                  className={`${styles.iconBtn} ${styles.cancelBtn}`}
                  onClick={() => openCancelDialog(row)}
                  title="Cancel Booking"
                >
                  <IoCloseOutline size={20} />
                </button>
              )}
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

      {/* Cancel Booking Confirmation Dialog */}
      {showCancelDialog && bookingToCancel && (
        <ConfirmDialog
          isOpen={showCancelDialog}
          onClose={handleCloseCancelDialog}
          title="Cancel Booking"
          message={`Are you sure you want to cancel the booking for ${bookingToCancel.guest_info.full_name}?`}
          confirmText="Cancel Booking"
          cancelText="Keep Booking"
          onConfirm={handleConfirmCancel}
          onCancel={handleCloseCancelDialog}
          isLoading={isCancelling}
          variant="warning"
        >
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#fef3c7",
              borderRadius: "8px",
              border: "1px solid #f59e0b",
            }}
          >
            <p
              style={{
                margin: "0 0 1rem 0",
                fontWeight: "600",
                color: "#92400e",
              }}
            >
              Payment Status
            </p>
            <p style={{ margin: "0 0 1rem 0", color: "#92400e" }}>
              Please select the payment status you want to set for this
              cancelled booking:
            </p>
            <CustomDropdown
              options={["Paid", "Pending", "Refunded"]}
              value={cancelPaymentStatus}
              onChange={setCancelPaymentStatus}
              disabled={isCancelling}
            />
          </div>
        </ConfirmDialog>
      )}
    </motion.div>
  );
};

export default Booking;
