import React from "react";
import styles from "../../styles/AddBooking.module.scss";

const ReferralForm = ({ referral, handleInputChange }) => (
  <div className={styles.card}>
    <h2>Referral Information</h2>
    <div className={styles.formGrid}>
      <div className={styles.formGroup}>
        <label>Referrer's Name</label>
        <input
          type="text"
          placeholder="Enter referrer's name"
          value={referral.referred_by_name}
          onChange={(e) =>
            handleInputChange("referral", "referred_by_name", e.target.value)
          }
        />
      </div>
      <div className={styles.formGroup}>
        <label>Referrer's Contact</label>
        <input
          type="text"
          placeholder="Enter referrer's contact"
          value={referral.referred_by_contact}
          onChange={(e) =>
            handleInputChange("referral", "referred_by_contact", e.target.value)
          }
        />
      </div>
    </div>
  </div>
);

export default ReferralForm;
