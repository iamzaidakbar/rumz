import React from "react";
import styles from "../styles/ConfirmDialog.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../contexts/AppContext";
import {
  IoWarningOutline,
  IoTrashOutline,
  IoCloseOutline,
} from "react-icons/io5";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "warning",
  loadingText = "Processing...",
}) => {
  const { theme } = useAppContext();

  const getIcon = () => {
    switch (variant) {
      case "delete":
        return <IoTrashOutline size={24} className={styles.icon} />;
      case "cancel":
        return <IoCloseOutline size={24} className={styles.icon} />;
      default:
        return <IoWarningOutline size={24} className={styles.icon} />;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "delete":
        return styles.delete;
      case "cancel":
        return styles.cancel;
      default:
        return styles.warning;
    }
  };

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
            className={`${styles.dialog} ${getVariantStyles()}`}
            data-theme={theme}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className={styles.iconWrapper}>{getIcon()}</div>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.message}>{children}</div>
            <div className={styles.actions}>
              <button
                onClick={onClose}
                className={`${styles.btn} ${styles.cancelBtn}`}
                disabled={isLoading}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`${styles.btn} ${styles.confirmBtn}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <span>{loadingText}</span>
                  </div>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
