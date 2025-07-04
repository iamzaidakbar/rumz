import React from "react";
import styles from "../styles/CustomButton.module.scss";

const CustomButton = ({
  type = "button",
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
