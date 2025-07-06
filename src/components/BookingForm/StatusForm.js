import React from "react";
import styles from "../../styles/AddBooking.module.scss";

const StatusForm = ({ status, handleInputChange }) => {
  const statusOptions = [
    {
      value: "Confirmed",
      label: "Confirmed",
      color: "#166534",
      bgColor: "#dcfce7",
    },
    {
      value: "Pending",
      label: "Pending",
      color: "#854d0e",
      bgColor: "#fefce8",
    },
    {
      value: "Cancelled",
      label: "Cancelled",
      color: "#991b1b",
      bgColor: "#fee2e2",
    },
  ];

  const getStatusStyle = (statusValue) => {
    const option = statusOptions.find((opt) => opt.value === statusValue);
    return option
      ? {
          backgroundColor: option.bgColor,
          color: option.color,
          padding: "0.3rem 0.8rem",
          borderRadius: "999px",
          fontWeight: "600",
          fontSize: "0.85rem",
          textAlign: "center",
          whiteSpace: "nowrap",
          width: "120px",
          display: "inline-block",
        }
      : {};
  };

  return (
    <div className={styles.card}>
      <h2>Booking Status</h2>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Booking Status</label>
          <div className={styles.statusDropdownContainer}>
            <select
              value={status.booking_status || ""}
              onChange={(e) =>
                handleInputChange("status", "booking_status", e.target.value)
              }
              className={styles.statusSelect}
              style={{ width: "120px" }}
            >
              <option value="">Select Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {status.booking_status && (
              <div
                className={styles.statusDisplay}
                style={getStatusStyle(status.booking_status)}
              >
                {status.booking_status}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusForm;
