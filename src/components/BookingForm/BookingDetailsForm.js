import React from "react";
import CustomDropdown from "../CustomDropdown";
import styles from "../../styles/AddBooking.module.scss";

const BookingDetailsForm = ({
  bookingDetails,
  handleInputChange,
  handleRoomSelect,
  rooms,
  roomsLoading,
  roomsError,
}) => (
  <div className={styles.card}>
    <h2>Booking Details</h2>
    <div className={styles.formGrid}>
      <div className={styles.formGroup}>
        <label>Room No(s)</label>
        {roomsLoading ? (
          <div>Loading rooms...</div>
        ) : roomsError ? (
          <div style={{ color: "#b91c1c" }}>{roomsError}</div>
        ) : (
          <CustomDropdown
            options={rooms.map((room) => ({
              label: room.roomNumber,
              value: room.id,
            }))}
            value={bookingDetails.room_ids}
            onChange={(ids) => handleRoomSelect(ids, rooms)}
            multiple
            placeholder="Select room(s)"
            disabled={roomsLoading}
          />
        )}
      </div>
      <div className={styles.formGroup}>
        <label>Room Type</label>
        <CustomDropdown
          options={["Deluxe Double Room", "Standard Single", "Suite"]}
          value={bookingDetails.room_type}
          onChange={(option) =>
            handleInputChange("booking_details", "room_type", option)
          }
          placeholder="Select Room Type"
        />
      </div>
      <div className={styles.formGroup}>
        <label>Check-in Date</label>
        <input
          type="date"
          value={bookingDetails.check_in_date}
          onChange={(e) =>
            handleInputChange(
              "booking_details",
              "check_in_date",
              e.target.value
            )
          }
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Check-out Date</label>
        <input
          type="date"
          value={bookingDetails.check_out_date}
          onChange={(e) =>
            handleInputChange(
              "booking_details",
              "check_out_date",
              e.target.value
            )
          }
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Number of Guests</label>
        <input
          type="number"
          placeholder="Enter number of guests"
          value={bookingDetails.number_of_guests}
          onChange={(e) =>
            handleInputChange(
              "booking_details",
              "number_of_guests",
              e.target.value
            )
          }
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Number of Rooms</label>
        <input
          type="number"
          placeholder="Enter number of rooms"
          value={
            bookingDetails.number_of_rooms ||
            bookingDetails.room_nos?.length ||
            ""
          }
          onChange={(e) =>
            handleInputChange(
              "booking_details",
              "number_of_rooms",
              e.target.value
            )
          }
          required
        />
      </div>
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>Special Requests</label>
        <textarea
          placeholder="Enter any special requests"
          value={bookingDetails.special_requests}
          onChange={(e) =>
            handleInputChange(
              "booking_details",
              "special_requests",
              e.target.value
            )
          }
        />
      </div>
    </div>
  </div>
);

export default BookingDetailsForm;
