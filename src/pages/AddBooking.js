import React, { useState, useCallback, useRef, useEffect } from "react";
import styles from "../styles/AddBooking.module.scss";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { bookingsApi } from "../api/bookingsApi";
import { cloudinaryApi } from "../api/cloudinaryApi";
import { IoArrowBackOutline, IoCloudUploadOutline } from "react-icons/io5";
import CustomDropdown from "../components/CustomDropdown";
import CustomButton from "../components/CustomButton";
import { CiSaveDown1 } from "react-icons/ci";
import { guestsApi } from "../api/guestsApi";
import { useRooms } from "../hooks/useRooms";

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
      id_images: [],
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

  const [idProofImages, setIdProofImages] = useState([]);
  const [idProofImagePreviews, setIdProofImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [guestBookings, setGuestBookings] = useState([]);
  const [guestBookingLoading, setGuestBookingLoading] = useState(false);
  const { rooms, loading: roomsLoading, error: roomsError } = useRooms();

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

  useEffect(() => {
    return () => {
      idProofImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [idProofImagePreviews]);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newImages = [...idProofImages, ...files];
      setIdProofImages(newImages);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setIdProofImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...newPreviews,
      ]);

      e.target.value = null;
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    URL.revokeObjectURL(idProofImagePreviews[indexToRemove]);

    const newImages = idProofImages.filter(
      (_, index) => index !== indexToRemove
    );
    setIdProofImages(newImages);

    const newPreviews = idProofImagePreviews.filter(
      (_, index) => index !== indexToRemove
    );
    setIdProofImagePreviews(newPreviews);
  };

  const handleRoomSelect = (selectedRoomIds) => {
    const selectedRooms = rooms.filter((room) =>
      selectedRoomIds.includes(room.id)
    );
    const roomNos = selectedRooms.map((room) => room.roomNumber);
    setFormData((prev) => ({
      ...prev,
      booking_details: {
        ...prev.booking_details,
        room_ids: selectedRoomIds,
        room_nos: roomNos,
      },
    }));
  };

  const handleCloseCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      handleCloseCamera();
    };
  }, [handleCloseCamera]);

  const handleTakePhotoClick = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported on this device");
      return;
    }

    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("Could not access camera. Please check permissions.");
      setIsCameraOpen(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      canvas.toBlob((blob) => {
        const file = new File([blob], `capture-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setIdProofImages((prevImages) => [...prevImages, file]);

        const previewUrl = URL.createObjectURL(file);
        setIdProofImagePreviews((prevPreviews) => [
          ...prevPreviews,
          previewUrl,
        ]);

        handleCloseCamera();
      }, "image/jpeg");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) return;
    setIsUploading(true);

    try {
      // Add guest if not exists, otherwise increment bookings
      const guests = await guestsApi.getGuests();
      const guestIndex = guests.findIndex(
        (g) =>
          g.contact === formData.guest_info.phone_number ||
          g.contact === formData.guest_info.email
      );
      if (guestIndex === -1) {
        await guestsApi.addGuest({
          name: formData.guest_info.full_name,
          email: formData.guest_info.email,
          phone: formData.guest_info.phone_number,
          bookings: 1,
          status: "Active",
        });
      } else {
        const guest = guests[guestIndex];
        await guestsApi.updateGuest(guest.id, {
          ...guest,
          bookings: (guest.bookings || 0) + 1,
        });
      }

      let uploadedImageUrls = [];
      if (idProofImages.length > 0) {
        uploadedImageUrls = await cloudinaryApi.uploadImages(idProofImages);
      }

      const finalFormData = {
        ...formData,
        id_proof: {
          ...formData.id_proof,
          id_images: uploadedImageUrls,
        },
      };

      await bookingsApi.addBooking(finalFormData);
      navigate("/bookings");
    } catch (error) {
      console.error("Failed to add booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch guest bookings when phone or email changes
  useEffect(() => {
    const fetchGuestBookings = async () => {
      const contact =
        formData.guest_info.phone_number || formData.guest_info.email;
      if (!contact) {
        setGuestBookings([]);
        return;
      }
      setGuestBookingLoading(true);
      try {
        const bookings = await bookingsApi.getBookingsForGuest(contact);
        setGuestBookings(bookings);
      } catch {
        setGuestBookings([]);
      } finally {
        setGuestBookingLoading(false);
      }
    };
    fetchGuestBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.guest_info.phone_number, formData.guest_info.email]);

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
        <div className={styles.headerActions}>
          <CustomButton
            variant="secondary"
            className={styles.backBtn}
            type="button"
            onClick={() => navigate(-1)}
          >
            <IoArrowBackOutline /> Back
          </CustomButton>
          <CustomButton
            type="submit"
            variant="primary"
            className={styles.saveBtn}
            disabled={isUploading}
            form="add-booking-form"
          >
            <CiSaveDown1 /> {isUploading ? "Saving..." : "Save Booking"}
          </CustomButton>
        </div>
      </div>
      <form
        id="add-booking-form"
        onSubmit={handleSubmit}
        className={styles.form}
      >
        {/* Guest Information Card */}
        <div className={styles.card}>
          <h2>Guest Information</h2>
          {/* Show previous bookings if any */}
          {guestBookingLoading ? (
            <p>Loading previous bookings...</p>
          ) : guestBookings.length > 0 ? (
            <div className={styles.guestBookingsInfo}>
              <strong>Previous Bookings:</strong>
              <ul>
                {guestBookings.map((b) => (
                  <li key={b.booking_reference_id}>
                    {b.booking_details.check_in_date} to{" "}
                    {b.booking_details.check_out_date}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
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
              <CustomDropdown
                options={["Aadhar Card", "Passport", "Driving License"]}
                value={formData.id_proof.id_type}
                onChange={(option) =>
                  handleInputChange("id_proof", "id_type", option)
                }
                placeholder="Select ID Type"
              />
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
              <CustomDropdown
                options={["India", "USA", "UK"]}
                value={formData.id_proof.id_issue_country}
                onChange={(option) =>
                  handleInputChange("id_proof", "id_issue_country", option)
                }
                placeholder="Select Issue Country"
              />
            </div>
          </div>
          <div
            style={{ marginTop: "2.5rem" }}
            className={`${styles.formGroup} ${styles.fullWidth}`}
          >
            <label>Upload ID Proof Image</label>
            <div className={styles.uploadArea}>
              <div className={styles.previewsContainer}>
                {idProofImagePreviews.map((preview, index) => (
                  <div key={index} className={styles.previewItem}>
                    <img
                      src={preview}
                      alt={`ID Preview ${index + 1}`}
                      className={styles.imagePreview}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className={styles.removeBtn}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div
                className={styles.uploadBox}
                onClick={() => document.getElementById("id-upload").click()}
              >
                <input
                  type="file"
                  id="id-upload"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <IoCloudUploadOutline className={styles.uploadIcon} />
                <p>Click to upload or drag and drop</p>
                <p className={styles.uploadHint}>SVG, PNG, JPG or GIF</p>
              </div>
            </div>
            <div className={styles.uploadButtons}>
              <button
                type="button"
                className={`${styles.uploadBtn} ${styles.primary}`}
                onClick={() => document.getElementById("id-upload").click()}
              >
                Upload Files
              </button>
              <button
                type="button"
                className={`${styles.uploadBtn} ${styles.secondary}`}
                onClick={handleTakePhotoClick}
              >
                Take Photo
              </button>
            </div>
          </div>
        </div>
        {isCameraOpen && (
          <div className={styles.cameraModal}>
            <div className={styles.cameraContainer}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={styles.cameraFeed}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div className={styles.cameraActions}>
                <button
                  type="button"
                  onClick={handleCapture}
                  className={styles.captureBtn}
                >
                  Capture
                </button>
                <button
                  type="button"
                  onClick={handleCloseCamera}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Booking Details Card */}
        <div className={styles.card}>
          <h2>Booking Details</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Room No(s)</label>
              {roomsLoading ? (
                <div>Loading rooms...</div>
              ) : roomsError ? (
                <div style={{ color: "#b91c1c" }}>{roomsError}</div>
              ) : (
                <CustomDropdown
                  options={rooms.map((room) => ({
                    label: room.roomNumber,
                    value: room.id,
                  }))}
                  value={formData.booking_details.room_ids}
                  onChange={handleRoomSelect}
                  multiple
                  placeholder="Select room(s)"
                  disabled={roomsLoading}
                />
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Room Type</label>
              <CustomDropdown
                options={["Deluxe Double Room", "Standard Single", "Suite"]}
                value={formData.booking_details.room_type}
                onChange={(option) =>
                  handleInputChange("booking_details", "room_type", option)
                }
                placeholder="Select Room Type"
              />
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
              <CustomDropdown
                options={["UPI", "Credit Card", "Debit Card", "Cash"]}
                value={formData.payment_info.payment_method}
                onChange={(option) =>
                  handleInputChange("payment_info", "payment_method", option)
                }
                placeholder="Select Payment Method"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Payment Status</label>
              <CustomDropdown
                options={["Paid", "Pending"]}
                value={formData.payment_info.payment_status}
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
              <CustomDropdown
                options={["Confirmed", "Pending", "Cancelled"]}
                value={formData.status.booking_status}
                onChange={(option) =>
                  handleInputChange("status", "booking_status", option)
                }
                placeholder="Select Booking Status"
              />
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AddBooking;
