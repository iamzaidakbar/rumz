import React from "react";
import GuestInfoForm from "./GuestInfoForm";
import IdProofForm from "./IdProofForm";
import BookingDetailsForm from "./BookingDetailsForm";
import PaymentForm from "./PaymentForm";
import ReferralForm from "./ReferralForm";
import StatusForm from "./StatusForm";
import styles from "../../styles/AddBooking.module.scss";

const BookingForm = ({
  formData,
  handleInputChange,
  handleAddressChange,
  handleRoomSelect,
  idProofImages,
  idProofImagePreviews,
  handleImageUpload,
  handleRemoveImage,
  handleTakePhotoClick,
  handleCloseCamera,
  handleCapture,
  isCameraOpen,
  videoRef,
  canvasRef,
  rooms,
  roomsLoading,
  roomsError,
  isUploading,
  onSubmit,
  children,
  className,
  formId = "add-booking-form",
}) => (
  <form id={formId} onSubmit={onSubmit} className={className || styles.form}>
    <GuestInfoForm
      guestInfo={formData.guest_info}
      address={formData.guest_info.address}
      handleInputChange={handleInputChange}
      handleAddressChange={handleAddressChange}
    />
    <IdProofForm
      idProof={formData.id_proof}
      idProofImages={idProofImages}
      idProofImagePreviews={idProofImagePreviews}
      handleInputChange={handleInputChange}
      handleImageUpload={handleImageUpload}
      handleRemoveImage={handleRemoveImage}
      handleTakePhotoClick={handleTakePhotoClick}
      handleCloseCamera={handleCloseCamera}
      handleCapture={handleCapture}
      isCameraOpen={isCameraOpen}
      videoRef={videoRef}
      canvasRef={canvasRef}
    />
    <BookingDetailsForm
      bookingDetails={formData.booking_details}
      handleInputChange={handleInputChange}
      handleRoomSelect={handleRoomSelect}
      rooms={rooms}
      roomsLoading={roomsLoading}
      roomsError={roomsError}
    />
    <PaymentForm
      paymentInfo={formData.payment_info}
      handleInputChange={handleInputChange}
    />
    <ReferralForm
      referral={formData.referral}
      handleInputChange={handleInputChange}
    />
    <StatusForm
      status={formData.status}
      handleInputChange={handleInputChange}
    />
    {children}
  </form>
);

export default BookingForm;
