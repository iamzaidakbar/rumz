import React, { useState, useCallback, useRef, useEffect } from "react";
import styles from "../styles/AddBooking.module.scss";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { bookingsApi } from "../api/bookingsApi";
import { cloudinaryApi } from "../api/cloudinaryApi";
import { IoCloudUploadOutline, IoArrowBackOutline } from "react-icons/io5";
import CustomDropdown from "../components/CustomDropdown";
import LoadingFallback from "../components/LoadingFallback";
import CustomButton from "../components/CustomButton";

const EditBooking = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [idProofImages, setIdProofImages] = useState([]);
  const [idProofImagePreviews, setIdProofImagePreviews] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [roomIdsInputValue, setRoomIdsInputValue] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const bookingData = await bookingsApi.getBooking(bookingId);
        setFormData(bookingData);
        setRoomIdsInputValue(bookingData.booking_details.room_ids.join(", "));
        setExistingImageUrls(bookingData.id_proof.id_images || []);
      } catch (error) {
        console.error("Failed to fetch booking:", error);
        // Handle specific error cases
        if (error.message.includes("not found")) {
          alert("Booking not found. Please check the booking ID.");
          navigate("/bookings");
        } else {
          alert(`Failed to load booking: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, navigate]);

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
      setIdProofImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setIdProofImagePreviews((prev) => [...prev, ...newPreviews]);
      e.target.value = null;
    }
  };

  const handleRemoveNewImage = (indexToRemove) => {
    URL.revokeObjectURL(idProofImagePreviews[indexToRemove]);
    setIdProofImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setIdProofImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemoveExistingImage = (urlToRemove) => {
    setExistingImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const handleRoomIdsChange = (e) => {
    const textValue = e.target.value;
    setRoomIdsInputValue(textValue);
    const ids = textValue
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id);
    handleInputChange("booking_details", "room_ids", ids);
  };

  const handleCloseCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  }, []);

  const handleTakePhotoClick = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera: ", err);
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
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const file = new File([blob], `capture-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setIdProofImages((prev) => [...prev, file]);
        const url = URL.createObjectURL(file);
        setIdProofImagePreviews((prev) => [...prev, url]);
        handleCloseCamera();
      }, "image/jpeg");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) return;
    setIsUploading(true);

    try {
      let newImageUrls = [];
      if (idProofImages.length > 0) {
        newImageUrls = await cloudinaryApi.uploadImages(idProofImages);
      }

      const finalImageUrls = [...existingImageUrls, ...newImageUrls];

      const finalFormData = {
        ...formData,
        id_proof: {
          ...formData.id_proof,
          id_images: finalImageUrls,
        },
      };

      const updatedBooking = await bookingsApi.updateBooking(
        bookingId,
        finalFormData
      );
      console.log("Booking updated successfully:", updatedBooking);

      // Navigate to booking detail page with success message
      navigate(`/bookings/${bookingId}`, {
        state: {
          message: "Booking updated successfully!",
          type: "success",
        },
      });
    } catch (error) {
      console.error("Failed to update booking:", error);
      // You could add a toast notification here for better UX
      alert(`Failed to update booking: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || !formData) return <LoadingFallback />;

  return (
    <motion.div
      className={styles.page}
      data-theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <h1>Edit Booking</h1>
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
            form="edit-booking-form"
          >
            {isUploading ? "Saving..." : "Save Changes"}
          </CustomButton>
        </div>
      </div>

      <form
        id="edit-booking-form"
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <div className={styles.card}>
          <h2>Guest Information</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
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
                value={formData.guest_info.address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>City</label>
              <input
                type="text"
                value={formData.guest_info.address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>State</label>
              <input
                type="text"
                value={formData.guest_info.address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Pincode</label>
              <input
                type="text"
                value={formData.guest_info.address.pin_code}
                onChange={(e) =>
                  handleAddressChange("pin_code", e.target.value)
                }
                required
              />
            </div>
          </div>
        </div>
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
              />
            </div>
            <div className={styles.formGroup}>
              <label>ID Number</label>
              <input
                type="text"
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
              />
            </div>
          </div>
          <div
            style={{ marginTop: "2.5rem" }}
            className={`${styles.formGroup} ${styles.fullWidth}`}
          >
            <label>ID Proof Images</label>
            <div className={styles.uploadArea}>
              <div className={styles.previewsContainer}>
                {existingImageUrls.map((url, index) => (
                  <div key={`existing-${index}`} className={styles.previewItem}>
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      src={url}
                      alt="Existing ID"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(url)}
                      className={styles.removeBtn}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {idProofImagePreviews.map((preview, index) => (
                  <div key={`new-${index}`} className={styles.previewItem}>
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      src={preview}
                      alt="New ID"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
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
              <video ref={videoRef} autoPlay playsInline />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div className={styles.cameraActions}>
                <button type="button" onClick={handleCapture}>
                  Capture
                </button>
                <button type="button" onClick={handleCloseCamera}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.card}>
          <h2>Booking Details</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Room No.s</label>
              <input
                type="text"
                placeholder="Enter room No's (comma separated)"
                value={roomIdsInputValue}
                onChange={handleRoomIdsChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Room Type</label>
              <CustomDropdown
                options={["Deluxe Double Room", "Standard Single", "Suite"]}
                value={formData.booking_details.room_type}
                onChange={(option) =>
                  handleInputChange("booking_details", "room_type", option)
                }
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
        <div className={styles.card}>
          <h2>Payment Details</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Amount</label>
              <input
                type="number"
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
              />
            </div>
            <div className={styles.formGroup}>
              <label>Payment Status</label>
              <CustomDropdown
                options={["Paid", "Pending", "Refunded"]}
                value={formData.payment_info.payment_status}
                onChange={(option) =>
                  handleInputChange("payment_info", "payment_status", option)
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Transaction ID</label>
              <input
                type="text"
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
              />
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default EditBooking;
