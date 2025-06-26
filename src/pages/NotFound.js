import React from "react";
import styles from "../styles/NotFound.module.scss";

// NotFound page for unmatched routes
const NotFound = () => {
  return (
    <div className={styles.page}>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
