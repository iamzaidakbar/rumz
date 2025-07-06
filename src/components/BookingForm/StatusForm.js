import React from "react";
import CustomDropdown from "../CustomDropdown";
import styles from "../../styles/AddBooking.module.scss";

const StatusForm = ({ status, handleInputChange }) => (
  <div className={styles.card}>
    <h2>Booking Status</h2>
    <div className={styles.formGrid}>
      <div className={styles.formGroup}>
        <label>Booking Status</label>
        <CustomDropdown
          options={["Confirmed", "Pending", "Cancelled"]}
          value={status.booking_status}
          onChange={(option) =>
            handleInputChange("status", "booking_status", option)
          }
          placeholder="Select Booking Status"
        />
      </div>
    </div>
  </div>
);

export default StatusForm;
