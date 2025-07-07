import React, { useState } from "react";
import CustomDropdown from "../CustomDropdown";
import { IoCloudUploadOutline } from "react-icons/io5";
import styles from "../../styles/AddBooking.module.scss";

const IdProofForm = ({
  idProof,
  idProofImages,
  idProofImagePreviews,
  handleInputChange,
  handleImageUpload,
  handleRemoveImage,
  handleTakePhotoClick,
  handleCloseCamera,
  handleCapture,
  isCameraOpen,
  videoRef,
  canvasRef,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a synthetic event to reuse handleImageUpload
      const syntheticEvent = {
        target: { files: e.dataTransfer.files },
      };
      handleImageUpload(syntheticEvent);
    }
  };

  return (
    <div className={styles.card}>
      <h2>ID Proof</h2>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>ID Type</label>
          <CustomDropdown
            options={["Aadhar Card", "Passport", "Driving License"]}
            value={idProof.id_type}
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
            value={idProof.id_number}
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
            value={idProof.id_issue_country}
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
            className={`${styles.uploadBox} ${
              isDragActive ? styles.dragActive : ""
            }`}
            onClick={() => document.getElementById("id-upload").click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="id-upload"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <IoCloudUploadOutline className="uploadIcon" />
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
                onClick={handleCloseCamera}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCapture}
                className={styles.captureBtn}
              >
                Capture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdProofForm;
