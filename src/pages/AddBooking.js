import React, { useRef, useState } from "react";
import styles from "../styles/AddBooking.module.scss";
import { useAppContext } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { bookingsApi } from "../api/bookingsApi";
import { cloudinaryApi } from "../api/cloudinaryApi";
import { IoArrowBackOutline } from "react-icons/io5";
import CustomButton from "../components/CustomButton";
import { CiSaveDown1 } from "react-icons/ci";
import { useRooms } from "../hooks/useRooms";
import { useBookingForm } from "../hooks/useBookingForm";
import BookingForm from "../components/BookingForm/BookingForm";

const initialBookingData = {
  guest_info: {
    full_name: "",
    phone_number: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      pin_code: "",
      country: "India",
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
  timestamps: {
    created_at: "",
    updated_at: "",
  },
};

const AddBooking = () => {
  const { theme } = useAppContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const {
    rooms,
    loading: roomsLoading,
    error: roomsError,
    fetchRooms,
  } = useRooms();
  const [idProofImages, setIdProofImages] = useState([]); // File objects
  const [idProofImagePreviews, setIdProofImagePreviews] = useState([]); // Preview URLs
  const [idProofImageUrls, setIdProofImageUrls] = useState([]); // Uploaded Cloudinary URLs
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const {
    formData,
    handleInputChange,
    handleAddressChange,
    handleRoomSelect,
    validate,
  } = useBookingForm(initialBookingData);

  // Fetch rooms on component mount
  React.useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Clean up previews on unmount
  React.useEffect(() => {
    return () => {
      idProofImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [idProofImagePreviews]);

  // Helper to upload a single image file to Cloudinary
  const uploadSingleImage = async (file) => {
    try {
      const [url] = await cloudinaryApi.uploadImages([file]);
      return url;
    } catch (err) {
      showError(
        "Image Upload Failed",
        "Could not upload one or more images. Please try again.",
        { duration: 6000 }
      );
      return null;
    }
  };

  // Handle image selection/upload
  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      // Add previews
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setIdProofImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...newPreviews,
      ]);
      setIdProofImages((prev) => [...prev, ...files]);
      // Immediately upload each image
      const uploadPromises = files.map(uploadSingleImage);
      const urls = await Promise.all(uploadPromises);
      setIdProofImageUrls((prev) => [...prev, ...urls.filter(Boolean)]);
      e.target.value = null;
    }
  };

  // Remove image (preview, file, and uploaded URL)
  const handleRemoveImage = (indexToRemove) => {
    URL.revokeObjectURL(idProofImagePreviews[indexToRemove]);
    setIdProofImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setIdProofImagePreviews((prev) =>
      prev.filter((_, idx) => idx !== indexToRemove)
    );
    setIdProofImageUrls((prev) =>
      prev.filter((_, idx) => idx !== indexToRemove)
    );
  };

  const handleCloseCamera = React.useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  }, []);

  React.useEffect(() => {
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
      alert("Could not access camera. Please check permissions.");
      setIsCameraOpen(false);
    }
  };

  // Camera capture: upload immediately after capture
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `capture-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setIdProofImages((prevImages) => [...prevImages, file]);
        const previewUrl = URL.createObjectURL(file);
        setIdProofImagePreviews((prevPreviews) => [
          ...prevPreviews,
          previewUrl,
        ]);
        // Immediately upload
        const url = await uploadSingleImage(file);
        if (url) setIdProofImageUrls((prev) => [...prev, url]);
        handleCloseCamera();
      }, "image/jpeg");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) return;
    setIsUploading(true);
    try {
      const now = new Date().toISOString();
      const finalFormData = {
        ...formData,
        id_proof: {
          ...formData.id_proof,
          id_images: idProofImageUrls, // Use uploaded URLs
        },
        timestamps: {
          created_at: now,
          updated_at: now,
        },
      };
      await bookingsApi.addBooking(finalFormData);
      success(
        "Booking Created Successfully!",
        `Booking for ${formData.guest_info.full_name} has been created and saved.`,
        { duration: 6000 }
      );
      await bookingsApi.getBookings({ refresh: true }); // refresh bookings cache
      navigate("/bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      showError(
        "Failed to Create Booking",
        "There was an error creating the booking. Please check your information and try again.",
        { duration: 8000 }
      );
    } finally {
      setIsUploading(false);
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
            disabled={isUploading || !validate()}
            form="add-booking-form"
          >
            <CiSaveDown1 /> {isUploading ? "Saving..." : "Save Booking"}
          </CustomButton>
        </div>
      </div>
      <BookingForm
        className={styles.form}
        formData={formData}
        handleInputChange={handleInputChange}
        handleAddressChange={handleAddressChange}
        handleRoomSelect={(ids) => handleRoomSelect(ids, rooms)}
        idProofImages={idProofImages}
        idProofImagePreviews={idProofImagePreviews}
        handleImageUpload={handleImageUpload}
        handleRemoveImage={handleRemoveImage}
        handleTakePhotoClick={handleTakePhotoClick}
        handleCloseCamera={handleCloseCamera}
        handleCapture={handleCapture}
        isCameraOpen={isCameraOpen}
        videoRef={videoRef}
        canvasRef={canvasRef}
        rooms={rooms}
        roomsLoading={roomsLoading}
        roomsError={roomsError}
        isUploading={isUploading}
        onSubmit={handleSubmit}
      ></BookingForm>
    </motion.div>
  );
};

export default AddBooking;
