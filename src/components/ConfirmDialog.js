import React from "react";
import styles from "../styles/ConfirmDialog.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../contexts/AppContext";
import { IoWarningOutline } from "react-icons/io5";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, children }) => {
  const { theme } = useAppContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.dialog}
            data-theme={theme}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className={styles.iconWrapper}>
              <IoWarningOutline size={24} className={styles.icon} />
            </div>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.message}>{children}</p>
            <div className={styles.actions}>
              <button
                onClick={onClose}
                className={`${styles.btn} ${styles.cancelBtn}`}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`${styles.btn} ${styles.confirmBtn}`}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
