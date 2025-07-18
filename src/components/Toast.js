import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoInformationCircle,
  IoWarning,
  IoClose,
} from "react-icons/io5";
import { useAppContext } from "../contexts/AppContext";
import styles from "../styles/Toast.module.scss";

const Toast = ({
  id,
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  position = "top-right",
}) => {
  const { theme } = useAppContext();
  const [visible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 250);
    }, duration);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) return 0;
        return prev - 100 / (duration / 100);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [duration, id, onClose, setIsVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 200);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <IoCheckmarkCircle className={styles.icon} />;
      case "error":
        return <IoCloseCircle className={styles.icon} />;
      case "warning":
        return <IoWarning className={styles.icon} />;
      default:
        return <IoInformationCircle className={styles.icon} />;
    }
  };

  const getToastStyles = () => {
    const baseStyles = styles.toast;
    const typeStyles = {
      success: styles.success,
      error: styles.error,
      warning: styles.warning,
      info: styles.info,
    };
    return `${baseStyles} ${typeStyles[type] || typeStyles.info}`;
  };

  const getProgressStyles = () => {
    const baseStyles = styles.progressBar;
    const typeStyles = {
      success: styles.progressSuccess,
      error: styles.progressError,
      warning: styles.progressWarning,
      info: styles.progressInfo,
    };
    return `${baseStyles} ${typeStyles[type] || typeStyles.info}`;
  };

  // Enhanced animation variants for beautiful entrance/exit
  const slideInVariants = {
    initial: {
      opacity: 0,
      scale: 0.92,
      y: position.includes("top") ? -30 : 30,
      filter: "blur(8px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
      opacity: 0,
      scale: 0.92,
      y: position.includes("top") ? -30 : 30,
      filter: "blur(8px)",
      transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={getToastStyles()}
          data-theme={theme}
          variants={slideInVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          layout
        >
          <div className={styles.content}>
            <div className={styles.iconContainer}>{getIcon()}</div>
            <div className={styles.textContainer}>
              {title && <h4 className={styles.title}>{title}</h4>}
              {message && <p className={styles.message}>{message}</p>}
            </div>
            <button
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close toast"
              tabIndex={0}
            >
              <IoClose />
            </button>
          </div>
          <div className={styles.progressContainer}>
            <div
              className={getProgressStyles()}
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ToastContainer = ({ toasts, position = "top-right", onClose }) => {
  const getContainerStyles = () => {
    const baseStyles = styles.container;
    const positionStyles = {
      "top-right": styles.topRight,
      "top-left": styles.topLeft,
      "bottom-right": styles.bottomRight,
      "bottom-left": styles.bottomLeft,
      "top-center": styles.topCenter,
      "bottom-center": styles.bottomCenter,
    };
    return `${baseStyles} ${
      positionStyles[position] || positionStyles["top-right"]
    }`;
  };

  return (
    <div className={getContainerStyles()}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            position={position}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export { Toast, ToastContainer };
