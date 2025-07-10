import React, { useRef, useState, useEffect } from "react";
import styles from "../styles/AddBooking.module.scss";
import { useAppContext } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { cloudinaryApi } from "../api/cloudinaryApi";
import { IoArrowBackOutline } from "react-icons/io5";
import CustomButton from "../components/CustomButton";
import { useRoomsContext } from "../contexts/RoomsContext";
import { useBookingsContext } from "../contexts/BookingsContext";
import { useBookingForm } from "../hooks/useBookingForm";
import BookingForm from "../components/BookingForm/BookingForm";
import LoadingFallback from "../components/LoadingFallback";

const EditBooking = () => {
  const { theme } = useAppContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const { rooms, loading: roomsLoading, error: roomsError } = useRoomsContext();
  const { updateBooking, getBooking } = useBookingsContext();
  const [idProofImages, setIdProofImages] = useState([]);
  const [idProofImagePreviews, setIdProofImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formReady, setFormReady] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [initialData, setInitialData] = useState(null);
  const {
    formData,
    setFormData,
    handleInputChange,
    handleAddressChange,
    handleRoomSelect,
    validate,
  } = useBookingForm(initialData);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const bookingData = await getBooking(bookingId);
        setInitialData(bookingData);
        setFormData(bookingData);
        setIdProofImagePreviews(bookingData.id_proof.id_images || []);
        setFormReady(true);
      } catch (error) {
        showError(
          "Failed to Load Booking",
          "Unable to fetch booking details. Please try again or contact support.",
          { duration: 8000 }
        );
        navigate("/bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, navigate, showError, getBooking]);

  // Clean up previews on unmount
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

  const handleRemoveImage = (indexToRemove) => {
    URL.revokeObjectURL(idProofImagePreviews[indexToRemove]);
    setIdProofImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setIdProofImagePreviews((prev) =>
      prev.filter((_, idx) => idx !== indexToRemove)
    );
  };

  const handleCloseCamera = React.useCallback(() => {
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
      let newImageUrls = [];
      if (idProofImages.length > 0) {
        newImageUrls = await cloudinaryApi.uploadImages(idProofImages);
      }
      const finalImageUrls = [...idProofImagePreviews, ...newImageUrls];
      const now = new Date().toISOString();
      const finalFormData = {
        ...formData,
        id_proof: {
          ...formData.id_proof,
          id_images: finalImageUrls,
        },
        timestamps: {
          ...(formData.timestamps || {}),
          updated_at: now,
        },
      };
      await updateBooking(bookingId, finalFormData);
      success(
        "Booking Updated Successfully!",
        `Booking for ${formData.guest_info.full_name} has been updated and saved.`,
        { duration: 6000 }
      );
      navigate(`/bookings`);
    } catch (error) {
      console.error("Error updating booking:", error);
      showError(
        "Failed to Update Booking",
        "There was an error updating the booking. Please check your information and try again.",
        { duration: 8000 }
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || !formReady || !formData) return <LoadingFallback />;

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
            disabled={isUploading || !validate()}
            form="edit-booking-form"
          >
            {isUploading ? "Saving..." : "Save Changes"}
          </CustomButton>
        </div>
      </div>
      <BookingForm
        className={styles.form}
        formId="edit-booking-form"
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
      />
    </motion.div>
  );
};

export default EditBooking;
