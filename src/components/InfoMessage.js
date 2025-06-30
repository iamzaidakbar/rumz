import React from "react";
import styles from "../styles/InfoMessage.module.scss";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";

const InfoMessage = ({ icon: Icon, title, message }) => {
  const { theme } = useAppContext();

  return (
    <motion.div
      className={styles.container}
      data-theme={theme}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      {Icon && (
        <div className={styles.iconWrapper}>
          <Icon size={28} />
        </div>
      )}
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
    </motion.div>
  );
};

export default InfoMessage;
