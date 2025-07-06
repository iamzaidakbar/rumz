import React from "react";
import styles from "../styles/StatusPill.module.scss";

const statusColorMap = {
  booking: {
    Confirmed: styles.confirmed,
    Pending: styles.pending,
    Cancelled: styles.cancelled,
  },
  payment: {
    Paid: styles.paid,
    Pending: styles.pendingPayment,
    Refunded: styles.refunded,
  },
  room: {
    Available: styles.available,
    Occupied: styles.occupied,
    Cleaning: styles.cleaning,
    Maintenance: styles.maintenance,
    Reserved: styles.reserved,
  },
};

export default function StatusPill({
  status,
  type = "booking",
  className = "",
}) {
  const colorClass = statusColorMap[type]?.[status] || styles.default;
  return (
    <span className={`${styles.statusPill} ${colorClass} ${className}`.trim()}>
      {status}
    </span>
  );
}
