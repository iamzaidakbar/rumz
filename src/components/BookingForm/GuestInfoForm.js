import React from "react";
import styles from "../../styles/AddBooking.module.scss";

const GuestInfoForm = ({
  guestInfo,
  address,
  handleInputChange,
  handleAddressChange,
}) => (
  <div className={styles.formGrid}>
    <div className={styles.formGroup}>
      <label>Full Name *</label>
      <input
        type="text"
        placeholder="Enter guest's full name"
        value={guestInfo.full_name}
        onChange={(e) =>
          handleInputChange("guest_info", "full_name", e.target.value)
        }
        required
      />
    </div>
    <div className={styles.formGroup}>
      <label>Phone Number *</label>
      <input
        type="tel"
        placeholder="Enter guest's phone number"
        value={guestInfo.phone_number}
        onChange={(e) =>
          handleInputChange("guest_info", "phone_number", e.target.value)
        }
        required
      />
    </div>
    <div className={styles.formGroup}>
      <label>Email</label>
      <input
        type="email"
        placeholder="Enter guest's email"
        value={guestInfo.email}
        onChange={(e) =>
          handleInputChange("guest_info", "email", e.target.value)
        }
        required
      />
    </div>
    <div className={styles.formGroup}>
      <label>Street</label>
      <input
        type="text"
        placeholder="Enter Street"
        value={address.street}
        onChange={(e) => handleAddressChange("street", e.target.value)}
        required
      />
    </div>
    <div className={styles.formGroup}>
      <label>City</label>
      <input
        type="text"
        placeholder="Enter city"
        value={address.city}
        onChange={(e) => handleAddressChange("city", e.target.value)}
        required
      />
    </div>
    <div className={styles.formGroup}>
      <label>State</label>
      <input
        type="text"
        placeholder="Enter state"
        value={address.state}
        onChange={(e) => handleAddressChange("state", e.target.value)}
        required
      />
    </div>
    <div className={styles.formGroup}>
      <label>Pincode</label>
      <input
        type="text"
        placeholder="Enter pincode"
        value={address.pin_code}
        onChange={(e) => handleAddressChange("pin_code", e.target.value)}
        required
      />
    </div>
    <div className={styles.formGroup}>
      <label>Country</label>
      <input
        type="text"
        placeholder="Enter country"
        value={address.country}
        onChange={(e) => handleAddressChange("country", e.target.value)}
        required
      />
    </div>
  </div>
);

export default GuestInfoForm;
