import React, { useState, useCallback } from "react";
import styles from "../styles/AddBooking.module.scss";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { bookingsApi } from "../api/bookingsApi";
import { IoCloudUploadOutline } from "react-icons/io5";

const AddBooking = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    guest_info: {
      full_name: "",
      phone_number: "",
      email: "",
      address: {
        street: "",
        city: "",
        state: "",
        pin_code: "",
        country: "",
      },
    },
    id_proof: {
      id_type: "Aadhar Card",
      id_number: "",
      id_issue_country: "India",
      id_image_front_url: "",
    },
    booking_details: {
      room_ids: [],
      room_type: "Deluxe Double Room",
      check_in_date: "",
      check_out_date: "",
      number_of_guests: "",
      number_of_rooms: "",
      special_requests: "",
    },
    referral: {
      referred_by_name: "",
      referred_by_contact: "",
    },
    payment_info: {
      amount: "",
      payment_method: "UPI",
      payment_status: "Pending",
      transaction_id: "",
    },
    status: {
      booking_status: "Pending",
    },
  });

  const [idProofImage, setIdProofImage] = useState(null);

  const handleInputChange = useCallback((section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }, []);

  const handleAddressChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      guest_info: {
        ...prev.guest_info,
        address: {
          ...prev.guest_info.address,
          [field]: value,
        },
      },
    }));
  }, []);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdProofImage(file);
      handleInputChange("id_proof", "id_image_front_url", file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you would upload the image first and get a URL
      // then set that URL in formData before submitting.
      await bookingsApi.addBooking(formData);
      navigate("/bookings");
    } catch (error) {
      console.error("Failed to add booking:", error);
    }
  };

  return (
    <motion.div
      className={styles.page}
      data-theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <h1>Add Booking</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Guest Information Card */}
        <div className={styles.card}>
          <h2>Guest Information</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter guest's full name"
                value={formData.guest_info.full_name}
                onChange={(e) =>
                  handleInputChange("guest_info", "full_name", e.target.value)
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter guest's phone number"
                value={formData.guest_info.phone_number}
                onChange={(e) =>
                  handleInputChange(
                    "guest_info",
                    "phone_number",
                    e.target.value
                  )
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter guest's email"
                value={formData.guest_info.email}
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
                value={formData.guest_info.address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>City</label>
              <input
                type="text"
                placeholder="Enter city"
                value={formData.guest_info.address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>State</label>
              <input
                type="text"
                placeholder="Enter state"
                value={formData.guest_info.address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Pincode</label>
              <input
                type="text"
                placeholder="Enter pincode"
                value={formData.guest_info.address.pin_code}
                onChange={(e) =>
                  handleAddressChange("pin_code", e.target.value)
                }
                required
              />
            </div>
          </div>
        </div>

        {/* ID Proof Card */}
        <div className={styles.card}>
          <h2>ID Proof</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>ID Type</label>
              <select
                value={formData.id_proof.id_type}
                onChange={(e) =>
                  handleInputChange("id_proof", "id_type", e.target.value)
                }
              >
                <option>Aadhar Card</option>
                <option>Passport</option>
                <option>Driving License</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>ID Number</label>
              <input
                type="text"
                placeholder="Enter ID number"
                value={formData.id_proof.id_number}
                onChange={(e) =>
                  handleInputChange("id_proof", "id_number", e.target.value)
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Issue Country</label>
              <select
                value={formData.id_proof.id_issue_country}
                onChange={(e) =>
                  handleInputChange(
                    "id_proof",
                    "id_issue_country",
                    e.target.value
                  )
                }
              >
                <option>India</option>
                <option>USA</option>
                <option>UK</option>
              </select>
            </div>
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Upload ID Proof Image</label>
            <div
              className={styles.uploadBox}
              onClick={() => document.getElementById("id-upload").click()}
            >
              <input
                type="file"
                id="id-upload"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <IoCloudUploadOutline className={styles.uploadIcon} />
              {idProofImage ? (
                <p>{idProofImage.name}</p>
              ) : (
                <>
                  <p>Click to upload or drag and drop</p>
                  <p className={styles.uploadHint}>SVG, PNG, JPG or GIF</p>
                </>
              )}
              <button type="button" className={styles.uploadBtn}>
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className={styles.card}>
          <h2>Booking Details</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Room No.s</label>
              <input
                type="text"
                placeholder="Enter room ID's (comma separated)"
                value={formData.booking_details.room_ids.join(", ")}
                onChange={(e) =>
                  handleInputChange(
                    "booking_details",
                    "room_ids",
                    e.target.value
                      .split(",")
                      .map((id) => id.trim())
                      .filter((id) => id)
                  )
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Room Type</label>
              <select
                value={formData.booking_details.room_type}
                onChange={(e) =>
                  handleInputChange(
                    "booking_details",
                    "room_type",
                    e.target.value
                  )
                }
              >
                <option>Deluxe Double Room</option>
                <option>Standard Single</option>
                <option>Suite</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Check-in Date</label>
              <input
                type="date"
                value={formData.booking_details.check_in_date}
                onChange={(e) =>
                  handleInputChange(
                    "booking_details",
                    "check_in_date",
                    e.target.value
                  )
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Check-out Date</label>
              <input
                type="date"
                value={formData.booking_details.check_out_date}
                onChange={(e) =>
                  handleInputChange(
                    "booking_details",
                    "check_out_date",
                    e.target.value
                  )
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Number of Guests</label>
              <input
                type="number"
                placeholder="Enter number of guests"
                value={formData.booking_details.number_of_guests}
                onChange={(e) =>
                  handleInputChange(
                    "booking_details",
                    "number_of_guests",
                    e.target.value
                  )
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Number of Rooms</label>
              <input
                type="number"
                placeholder="Enter number of rooms"
                value={formData.booking_details.number_of_rooms}
                onChange={(e) =>
                  handleInputChange(
                    "booking_details",
                    "number_of_rooms",
                    e.target.value
                  )
                }
                required
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Special Requests</label>
              <textarea
                placeholder="Enter any special requests"
                value={formData.booking_details.special_requests}
                onChange={(e) =>
                  handleInputChange(
                    "booking_details",
                    "special_requests",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Referral Information Card */}
        <div className={styles.card}>
          <h2>Referral Information</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Referrer's Name</label>
              <input
                type="text"
                placeholder="Enter referrer's name"
                value={formData.referral.referred_by_name}
                onChange={(e) =>
                  handleInputChange(
                    "referral",
                    "referred_by_name",
                    e.target.value
                  )
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Referrer's Contact</label>
              <input
                type="text"
                placeholder="Enter referrer's contact"
                value={formData.referral.referred_by_contact}
                onChange={(e) =>
                  handleInputChange(
                    "referral",
                    "referred_by_contact",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Payment Details Card */}
        <div className={styles.card}>
          <h2>Payment Details</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={formData.payment_info.amount}
                onChange={(e) =>
                  handleInputChange("payment_info", "amount", e.target.value)
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Payment Method</label>
              <select
                value={formData.payment_info.payment_method}
                onChange={(e) =>
                  handleInputChange(
                    "payment_info",
                    "payment_method",
                    e.target.value
                  )
                }
              >
                <option>UPI</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Cash</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Payment Status</label>
              <select
                value={formData.payment_info.payment_status}
                onChange={(e) =>
                  handleInputChange(
                    "payment_info",
                    "payment_status",
                    e.target.value
                  )
                }
              >
                <option>Paid</option>
                <option>Pending</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Transaction ID</label>
              <input
                type="text"
                placeholder="Enter transaction ID"
                value={formData.payment_info.transaction_id}
                onChange={(e) =>
                  handleInputChange(
                    "payment_info",
                    "transaction_id",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Booking Status Card */}
        <div className={styles.card}>
          <h2>Booking Status</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Booking Status</label>
              <select
                value={formData.status.booking_status}
                onChange={(e) =>
                  handleInputChange("status", "booking_status", e.target.value)
                }
              >
                <option>Confirmed</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button type="submit" className={styles.saveBtn}>
            Save Booking
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddBooking;
