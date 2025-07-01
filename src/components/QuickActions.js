import React from "react";
import styles from "../styles/QuickActions.module.scss";
import CustomButton from "./CustomButton";
import { useNavigate } from "react-router-dom";

// QuickActions for dashboard
const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.actions}>
      <CustomButton
        variant="primary"
        onClick={() => {
          navigate("/bookings/add");
        }}
      >
        Add Booking
      </CustomButton>
      <CustomButton
        variant="secondary"
        onClick={() => {
          navigate("/guests");
        }}
      >
        View Guest Details
      </CustomButton>
    </div>
  );
};

export default QuickActions;
