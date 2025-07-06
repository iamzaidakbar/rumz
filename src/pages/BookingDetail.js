import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { bookingsApi } from "../api/bookingsApi";
import styles from "../styles/BookingDetail.module.scss";
import { useAppContext } from "../contexts/AppContext";
import LoadingFallback from "../components/LoadingFallback";
import InfoMessage from "../components/InfoMessage";
import {
  IoWarningOutline,
  IoArrowBackOutline,
  IoPencilOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";
import CustomButton from "../components/CustomButton";

const BookingDetail = () => {
  const { theme } = useAppContext();
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const data = await bookingsApi.getBooking(bookingId);
        setBooking(data);
      } catch (err) {
        setError("Failed to fetch booking details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  console.log("Booking Detail:", booking);

  const formatTimestamp = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, "0");

    return `${year}-${month}-${day} ${strHours}:${minutes} ${ampm}`;
  };

  if (loading) return <LoadingFallback />;
  if (error)
    return (
      <InfoMessage icon={IoWarningOutline} title="Error" message={error} />
    );
  if (!booking)
    return <InfoMessage title="Not Found" message="Booking not found." />;

  const DetailRow = ({ label, value }) => (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label ? label : "NA"}</span>
      <span className={styles.detailValue}>{value ? value : "NA"}</span>
    </div>
  );

  return (
    <motion.div
      className={styles.page}
      data-theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <div>
          <div className={styles.breadcrumbs}>
            <Link to="/bookings">Bookings</Link> / <span>Booking Details</span>
          </div>
          <h1>Booking Details</h1>
          <p>View and manage booking details</p>
        </div>
        <div className={styles.headerActions}>
          <CustomButton
            variant="secondary"
            className={styles.backBtn}
            onClick={() => navigate("/bookings")}
          >
            <IoArrowBackOutline /> Back
          </CustomButton>
          <CustomButton
            variant="primary"
            className={styles.editBtn}
            onClick={() => navigate(`/bookings/${bookingId}/edit`)}
          >
            <IoPencilOutline /> Edit
          </CustomButton>
        </div>
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.section}>
          <h2>Guest Information</h2>
          <DetailRow label="Full Name" value={booking.guest_info.full_name} />
          <DetailRow
            label="Contact Number"
            value={booking.guest_info.phone_number}
          />
          <DetailRow label="Email" value={booking.guest_info.email} />
          <DetailRow
            label="Address"
            value={`${booking.guest_info.address.street}, ${booking.guest_info.address.city}, ${booking.guest_info.address.state} - ${booking.guest_info.address.pin_code}, ${booking.guest_info.address.country}`}
          />
        </div>

        <div className={styles.section}>
          <h2>ID Proof</h2>
          <DetailRow label="ID Type" value={booking.id_proof.id_type} />
          <DetailRow label="ID Number" value={booking.id_proof.id_number} />
          <DetailRow
            label="Issue Country"
            value={booking.id_proof.id_issue_country}
          />
          <div className={styles.idImages}>
            {booking.id_proof.id_images &&
            booking.id_proof.id_images.length > 0 ? (
              booking.id_proof.id_images.map((img, index) => (
                <img key={index} src={img} alt={`ID Proof ${index + 1}`} />
              ))
            ) : (
              <p>No ID images uploaded.</p>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Booking Details</h2>
          <DetailRow
            label="Room No(s)"
            value={booking.booking_details.room_ids?.join(", ") || "N/A"}
          />
          <DetailRow
            label="Room Type"
            value={booking.booking_details.room_type}
          />
          <DetailRow
            label="Check-in Date"
            value={booking.booking_details.check_in_date}
          />
          <DetailRow
            label="Check-out Date"
            value={booking.booking_details.check_out_date}
          />
          <DetailRow
            label="Number of Guests"
            value={booking.booking_details.number_of_guests}
          />
          <DetailRow
            label="Number of Rooms"
            value={booking.booking_details.number_of_rooms}
          />
          <DetailRow
            label="Special Requests"
            value={booking.booking_details.special_requests || "None"}
          />
        </div>

        <div className={styles.section}>
          <h2>Referral Information</h2>
          <DetailRow
            label="Referred By"
            value={booking.referral.referred_by_name || "None"}
          />
          <DetailRow
            label="Referrer Contact"
            value={booking.referral.referred_by_contact || "N/A"}
          />
        </div>

        <div className={styles.section}>
          <h2>Payment Information</h2>
          <DetailRow
            label="Payment Method"
            value={booking.payment_info.payment_method}
          />
          <DetailRow
            label="Amount Paid"
            value={`$${booking.payment_info.amount}`}
          />
          <DetailRow
            label="Payment Status"
            value={booking.payment_info.payment_status}
          />
          <DetailRow
            label="Transaction ID"
            value={booking.payment_info.transaction_id || "N/A"}
          />
        </div>

        <div className={styles.section}>
          <h2>Status</h2>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Booking Status</span>
            <span
              className={styles.statusPill}
              style={{
                backgroundColor:
                  booking.status.booking_status === "Confirmed"
                    ? "#dcfce7"
                    : booking.status.booking_status === "Pending"
                    ? "#fefce8"
                    : booking.status.booking_status === "Cancelled"
                    ? "#fee2e2"
                    : "#f3f4f6",
                color:
                  booking.status.booking_status === "Confirmed"
                    ? "#166534"
                    : booking.status.booking_status === "Pending"
                    ? "#854d0e"
                    : booking.status.booking_status === "Cancelled"
                    ? "#991b1b"
                    : "#6b7280",
                padding: "0.3rem 0.8rem",
                borderRadius: "999px",
                fontWeight: "600",
                fontSize: "0.85rem",
                textAlign: "center",
                whiteSpace: "nowrap",
                width: "120px",
                display: "inline-block",
              }}
            >
              {booking.status.booking_status}
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Timestamps</h2>
          <DetailRow
            label="Created At"
            value={formatTimestamp(booking?.timestamps?.created_at)}
          />
          <DetailRow
            label="Updated At"
            value={formatTimestamp(booking?.timestamps?.updated_at)}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BookingDetail;
