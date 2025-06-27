import React from "react";
import styles from "../styles/NotFound.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";

// NotFound page for unmatched routes
const NotFound = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();

  return (
    <motion.div
      className={styles.page}
      data-theme={theme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.message}>
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className={styles.actions}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            Go Back
          </button>
          <Link to="/" className={styles.homeLink}>
            Take me Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;
