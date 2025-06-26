import React from "react";
import styles from "../styles/QuickActions.module.scss";

// QuickActions for dashboard
const QuickActions = () => (
  <div className={styles.actions}>
    <button className={styles.add}>Add Booking</button>
    <button className={styles.view}>View Guest Details</button>
  </div>
);

export default QuickActions;
