import React from "react";
import styles from "../styles/MetricCard.module.scss";
import { motion } from "framer-motion";

// MetricCard for dashboard metrics
const MetricCard = ({ label, value, change }) => {
  const isPositive = change >= 0;
  return (
    <div
      className={styles.metricCard}
      aria-label={`${label}: ${value}, ${isPositive ? "up" : "down"} ${Math.abs(
        change
      )}%`}
    >
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>
        {typeof value === "number" && label === "Revenue"
          ? `$${value.toLocaleString()}`
          : value}
      </div>
      {typeof change === "number" && (
        <motion.div
          className={isPositive ? styles.positive : styles.negative}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          aria-label={isPositive ? "Increase" : "Decrease"}
        >
          {isPositive ? "▲" : "▼"} {Math.abs(change)}%
        </motion.div>
      )}
    </div>
  );
};

export default MetricCard;
