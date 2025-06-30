import React from "react";
import styles from "../styles/CustomButton.module.scss";

const CustomButton = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
