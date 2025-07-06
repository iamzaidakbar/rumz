import React from "react";
import CustomDropdown from "../CustomDropdown";
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

  // Custom renderer for dropdown selected value and options
  const renderStatusOption = (option) => (
    <span style={getStatusStyle(option.value)}>{option.label}</span>
  );

  return (
    <div className={styles.card}>
      <h2>Booking Status</h2>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Booking Status</label>
          <div className={styles.statusDropdownContainer}>
            <CustomDropdown
              options={statusOptions}
              value={status.booking_status || ""}
              onChange={(option) =>
                handleInputChange("status", "booking_status", option)
              }
              placeholder="Select Booking Status"
              renderValue={renderStatusOption}
              renderOption={renderStatusOption}
              style={{ width: "120px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusForm;
