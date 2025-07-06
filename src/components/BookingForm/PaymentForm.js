import React from "react";
import CustomDropdown from "../CustomDropdown";
import styles from "../../styles/AddBooking.module.scss";

const PaymentForm = ({ paymentInfo, handleInputChange }) => (
  <div className={styles.card}>
    <h2>Payment Details</h2>
    <div className={styles.formGrid}>
      <div className={styles.formGroup}>
        <label>Amount</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={paymentInfo.amount}
          onChange={(e) =>
            handleInputChange("payment_info", "amount", e.target.value)
          }
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Payment Method</label>
        <CustomDropdown
          options={["UPI", "Credit Card", "Debit Card", "Cash"]}
          value={paymentInfo.payment_method}
          onChange={(option) =>
            handleInputChange("payment_info", "payment_method", option)
          }
          placeholder="Select Payment Method"
        />
      </div>
      <div className={styles.formGroup}>
        <label>Payment Status</label>
        <CustomDropdown
          options={["Paid", "Pending", "Refunded"]}
          value={paymentInfo.payment_status}
          onChange={(option) =>
            handleInputChange("payment_info", "payment_status", option)
          }
          placeholder="Select Payment Status"
        />
      </div>
      <div className={styles.formGroup}>
        <label>Transaction ID</label>
        <input
          type="text"
          placeholder="Enter transaction ID"
          value={paymentInfo.transaction_id}
          onChange={(e) =>
            handleInputChange("payment_info", "transaction_id", e.target.value)
          }
        />
      </div>
    </div>
  </div>
);

export default PaymentForm;
