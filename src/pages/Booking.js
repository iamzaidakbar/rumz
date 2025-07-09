import React, { useState, useMemo } from "react";
import styles from "../styles/Booking.module.scss";
import DataTable from "../components/DataTable";
import {
  IoEyeOutline,
  IoTrashOutline,
  IoWarningOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { useAppContext } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
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
import StatusPill from "../components/StatusPill";
import { useBookingsContext } from "../contexts/BookingsContext";

const TABS = ["All", "Confirmed", "Pending", "Cancelled"];

const columns = [
  { header: "Booking ID", accessor: "booking_reference_id" },
  { header: "Guest Name", accessor: "guest_info.full_name" },
  { header: "Check-in", accessor: "booking_details.check_in_date" },
  { header: "Check-out", accessor: "booking_details.check_out_date" },
  {
    header: "Room(s)",
    accessor: "booking_details.room_nos",
    cell: (value) => value?.join(", "),
  },
  { header: "Guests", accessor: "booking_details.number_of_guests" },
  {
    header: "Payment Status",
    accessor: "payment_info.payment_status",
    cell: (value) => <StatusPill status={value} type="payment" />,
  },
  {
    header: "Booking Status",
    accessor: "status.booking_status",
    cell: (value) => <StatusPill status={value} type="booking" />,
  },
];

const Booking = () => {
  const { theme } = useAppContext();
  const { success, error: showError, warning } = useToast();
  const [tab, setTab] = useState("All");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cancelPaymentStatus, setCancelPaymentStatus] = useState("Refunded");
  const navigate = useNavigate();
  const { bookings, loading, fetchBookings } = useBookingsContext();
  const [error, setError] = useState(null);

  const handleDelete = async (booking) => {
    if (!booking) return;
    setIsDeleting(true);
    try {
      await bookingsApi.deleteBooking(booking.booking_reference_id);
      await fetchBookings({ refresh: true });
      success(
        "Booking Deleted Successfully!",
        `Booking for ${booking.guest_info.full_name} has been permanently deleted.`,
        { duration: 6000 }
      );
    } catch (err) {
      setError("Failed to delete booking.");
      console.error("Error deleting booking:", err);
      showError(
        "Failed to Delete Booking",
        "There was an error deleting the booking. Please try again or contact support.",
        { duration: 8000 }
      );
    } finally {
      setIsDeleting(false);
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
      await bookingsApi.updateBooking(
        bookingToCancel.booking_reference_id,
        updateData
      );
      await fetchBookings({ refresh: true });
      warning(
        "Booking Cancelled",
        `Booking for ${bookingToCancel.guest_info.full_name} has been cancelled. Payment status updated to ${cancelPaymentStatus}.`,
        { duration: 7000 }
      );
      setShowCancelDialog(false);
      setBookingToCancel(null);
    } catch (err) {
      setError("Failed to cancel booking.");
      console.error("Error cancelling booking:", err);
      showError(
        "Failed to Cancel Booking",
        "There was an error cancelling the booking. Please try again or contact support.",
        { duration: 8000 }
      );
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
    today.setHours(0, 0, 0, 0);
    const checkOutDate = new Date(booking.booking_details.check_out_date);
    checkOutDate.setHours(0, 0, 0, 0);
    return checkOutDate >= today;
  };

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
                  className={styles.iconBtn}
                  onClick={() => openCancelDialog(row)}
                  title="Cancel Booking"
                  disabled={isCancelling}
                >
                  <IoCloseOutline size={20} />
                </button>
              )}
          </div>
        )}
        noDataInfo={{
          icon: IoWarningOutline,
          title: "No Bookings Found",
          message: "No bookings found. Add a new booking to get started.",
        }}
      />
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={handleCloseCancelDialog}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking"
        confirmText={isCancelling ? "Cancelling..." : "Confirm Cancel"}
        confirmDisabled={isCancelling}
      >
        <div>
          <p>
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </p>
          <div style={{ marginTop: 16 }}>
            <label>Update Payment Status:</label>
            <CustomDropdown
              options={["Paid", "Pending", "Refunded"]}
              value={cancelPaymentStatus}
              onChange={setCancelPaymentStatus}
            />
          </div>
        </div>
      </ConfirmDialog>
    </motion.div>
  );
};

export default Booking;
