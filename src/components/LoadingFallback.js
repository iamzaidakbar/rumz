import React from "react";
import styles from "../styles/LoadingFallback.module.scss";

// LoadingFallback for Suspense fallback UI
const LoadingFallback = () => (
  <div className={styles.loading}>
    <div className={styles.spinner}></div>
    <span>Loading...</span>
  </div>
);

export default LoadingFallback;
