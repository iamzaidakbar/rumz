import React from "react";
import { useToast } from "../contexts/ToastContext";
import CustomButton from "./CustomButton";
import styles from "../styles/ToastDemo.module.scss";

const ToastDemo = () => {
  const { success, error, warning, info } = useToast();

  const handleSuccessToast = () => {
    success(
      "Booking Confirmed!",
      "Your booking has been successfully created and confirmed.",
      { duration: 6000 }
    );
  };

  const handleErrorToast = () => {
    error(
      "Booking Failed",
      "Unable to create booking. Please try again or contact support.",
      { duration: 8000 }
    );
  };

  const handleWarningToast = () => {
    warning(
      "Payment Pending",
      "Your payment is still being processed. Please wait a moment.",
      { duration: 7000 }
    );
  };

  const handleInfoToast = () => {
    info(
      "System Update",
      "New features have been added to improve your experience.",
      { duration: 5000 }
    );
  };

  const handleLongToast = () => {
    success(
      "Complex Operation Completed",
      "This is a very long message to demonstrate how the toast handles longer content. It should wrap properly and maintain good readability while staying within the design constraints.",
      { duration: 10000 }
    );
  };

  const handleQuickToast = () => {
    info("Quick Update", "This toast will disappear quickly.", {
      duration: 2000,
    });
  };

  return (
    <div className={styles.demoContainer}>
      <div className={styles.header}>
        <h1>Toast Component Demo</h1>
        <p>
          Click the buttons below to see different toast notifications in
          action.
        </p>
      </div>

      <div className={styles.buttonGrid}>
        <div className={styles.buttonGroup}>
          <h3>Basic Variants</h3>
          <div className={styles.buttons}>
            <CustomButton
              variant="success"
              onClick={handleSuccessToast}
              className={styles.demoButton}
            >
              Success Toast
            </CustomButton>

            <CustomButton
              variant="error"
              onClick={handleErrorToast}
              className={styles.demoButton}
            >
              Error Toast
            </CustomButton>

            <CustomButton
              variant="warning"
              onClick={handleWarningToast}
              className={styles.demoButton}
            >
              Warning Toast
            </CustomButton>

            <CustomButton
              variant="info"
              onClick={handleInfoToast}
              className={styles.demoButton}
            >
              Info Toast
            </CustomButton>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <h3>Special Cases</h3>
          <div className={styles.buttons}>
            <CustomButton
              variant="secondary"
              onClick={handleLongToast}
              className={styles.demoButton}
            >
              Long Message Toast
            </CustomButton>

            <CustomButton
              variant="secondary"
              onClick={handleQuickToast}
              className={styles.demoButton}
            >
              Quick Toast (2s)
            </CustomButton>
          </div>
        </div>
      </div>

      <div className={styles.features}>
        <h2>Features</h2>
        <ul>
          <li>✨ Smooth Framer Motion animations</li>
          <li>🎨 Beautiful glass morphism design</li>
          <li>🌙 Dark mode support</li>
          <li>📱 Responsive design</li>
          <li>⏱️ Auto-dismiss with progress bar</li>
          <li>🎯 Multiple position options</li>
          <li>♿ Accessibility friendly</li>
          <li>🎪 Hover effects and micro-interactions</li>
        </ul>
      </div>

      <div className={styles.usage}>
        <h2>Usage</h2>
        <div className={styles.codeExample}>
          <pre>
            {`import { useToast } from '../contexts/ToastContext';

const { success, error, warning, info } = useToast();

// Basic usage
success('Title', 'Message');

// With options
error('Error Title', 'Error message', { 
  duration: 8000 
});`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ToastDemo;
