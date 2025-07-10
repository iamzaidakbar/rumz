import React, { useState, useEffect } from "react";
import styles from "../styles/AddRoom.module.scss"; // Re-using styles
import { useNavigate, useParams } from "react-router-dom";
import { useRoomsContext } from "../contexts/RoomsContext";
import { motion } from "framer-motion";
import { useAppContext } from "../contexts/AppContext";
import CustomDropdown from "../components/CustomDropdown";
import LoadingFallback from "../components/LoadingFallback";
import InfoMessage from "../components/InfoMessage";
import { IoArrowBackOutline, IoWarningOutline } from "react-icons/io5";
import CustomButton from "../components/CustomButton";
import { useToast } from "../contexts/ToastContext";
import LogoUpload from "../components/forms/LogoUpload";
import { cloudinaryApi } from "../api/cloudinaryApi";
import { useRoomForm } from "../hooks/useRoomForm";

const AMENITIES = ["Wi-Fi", "TV", "AC", "Mini-bar", "Balcony", "Kitchenette"];
const FLOORS = ["Ground", "1st Floor", "2nd Floor"];
const TYPES = ["Standard Room", "Deluxe Suite", "Family Room", "Penthouse"];
const STATUS = ["Available", "Occupied", "Cleaning"];

const EditRoom = () => {
  const { theme } = useAppContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { getRoom, updateRoom, fetchRooms } = useRoomsContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initialData, setInitialData] = useState(null);

  const roomForm = useRoomForm({
    initialData: initialData || {
      roomNumber: "",
      type: TYPES[0],
      floor: FLOORS[0],
      status: STATUS[0],
      amenities: [],
      photo: "",
      description: "",
      price: "",
      beds: 1,
      bathrooms: 1,
    },
    onSuccess: success,
    onError: showError,
    amenitiesList: AMENITIES,
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await getRoom(roomId);
        setInitialData(roomData);
        roomForm.setForm(roomData);
      } catch (err) {
        setError("Failed to fetch room details.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
    // eslint-disable-next-line
  }, [roomId, getRoom]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    roomForm.setSaving(true);
    roomForm.setError("");
    if (!roomForm.validate()) {
      roomForm.setError("Room number and status are required.");
      roomForm.setSaving(false);
      return;
    }
    try {
      await updateRoom(roomId, roomForm.form);
      success("Room updated successfully!", "success");
      await fetchRooms({ refresh: true }); // Refresh the room list after deletion
      navigate(`/rooms`);
    } catch (err) {
      roomForm.setError("Failed to update room.");
      showError("Failed to update room. Please try again.", "error");
    } finally {
      roomForm.setSaving(false);
    }
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    roomForm.setPhotoError("");
    roomForm.setPhotoUploading(true);
    try {
      const urls = await cloudinaryApi.uploadImages([file]);
      roomForm.setForm((prev) => ({ ...prev, photo: urls[0] }));
      success("Photo uploaded!", "success");
    } catch (err) {
      roomForm.setPhotoError("Failed to upload photo.");
      showError("Failed to upload photo.", "error");
    } finally {
      roomForm.setPhotoUploading(false);
    }
  };

  const handlePhotoDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    roomForm.setPhotoError("");
    roomForm.setPhotoUploading(true);
    try {
      const urls = await cloudinaryApi.uploadImages([file]);
      roomForm.setForm((prev) => ({ ...prev, photo: urls[0] }));
      success("Photo uploaded!", "success");
    } catch (err) {
      roomForm.setPhotoError("Failed to upload photo.");
      showError("Failed to upload photo.", "error");
    } finally {
      roomForm.setPhotoUploading(false);
    }
  };

  const handlePhotoClick = () => {
    roomForm.fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    roomForm.setForm((prev) => ({ ...prev, photo: "" }));
  };

  if (loading) return <LoadingFallback />;
  if (error)
    return (
      <InfoMessage icon={IoWarningOutline} title="Error" message={error} />
    );
  if (!initialData) return null;

  return (
    <div className={styles.bgWrap} data-theme={theme}>
      <motion.div
        className={styles.card}
        data-theme={theme}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.header}>
          <h1>Edit Room</h1>
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
              disabled={roomForm.saving}
              form="edit-room-form"
            >
              {roomForm.saving ? "Saving..." : "Save Changes"}
            </CustomButton>
          </div>
        </div>
        <form
          className={styles.form}
          id="edit-room-form"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className={styles.inputGroup}>
            <label htmlFor="roomNumber">Room Number</label>
            <input
              type="text"
              id="roomNumber"
              name="roomNumber"
              value={roomForm.form.roomNumber}
              onChange={roomForm.handleChange}
              placeholder="Enter room number"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="type">Room Type</label>
            <CustomDropdown
              options={TYPES}
              value={roomForm.form.type}
              onChange={roomForm.handleDropdownChange("type")}
              placeholder="Select a room type"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={roomForm.form.description}
              onChange={roomForm.handleChange}
              placeholder="Enter room description"
              rows={6}
            />
          </div>
          <div className={styles.inputGroupRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="beds">Number of Beds</label>
              <input
                type="number"
                id="beds"
                name="beds"
                value={roomForm.form.beds}
                onChange={roomForm.handleChange}
                min={1}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="bathrooms">Number of Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={roomForm.form.bathrooms}
                onChange={roomForm.handleChange}
                min={1}
              />
            </div>
          </div>
          <div className={styles.inputGroupRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="floor">Floor</label>
              <CustomDropdown
                options={FLOORS}
                value={roomForm.form.floor}
                onChange={roomForm.handleDropdownChange("floor")}
                placeholder="Select a floor"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="status">Status</label>
              <CustomDropdown
                options={STATUS}
                value={roomForm.form.status}
                onChange={roomForm.handleDropdownChange("status")}
                placeholder="Select a status"
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Amenities</label>
            <div className={styles.amenitiesWrap}>
              {AMENITIES.map((a) => (
                <label
                  key={a}
                  className={`${styles.amenityLabel} ${
                    roomForm.form.amenities.includes(a) ? styles.selected : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    name="amenities"
                    value={a}
                    checked={roomForm.form.amenities.includes(a)}
                    onChange={roomForm.handleChange}
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </div>
          <div className={styles.inputGroupRow}>
            <div className={styles.inputGroup}>
              {/* Photo Upload */}
              <LogoUpload
                logoUploading={roomForm.photoUploading}
                logoError={roomForm.photoError}
                onLogoDrop={handlePhotoDrop}
                onLogoSelect={handlePhotoSelect}
                onLogoClick={handlePhotoClick}
                onDragOver={(e) => e.preventDefault()}
                fileInputRef={roomForm.fileInputRef}
                onRemoveLogo={handleRemovePhoto}
                hotelLogo={roomForm.form.photo}
                label="Room Photo"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={roomForm.form.price}
                onChange={roomForm.handleChange}
                placeholder="Enter price"
                min={0}
              />
            </div>
          </div>
          {roomForm.error && (
            <div className={styles.errorMsg}>{roomForm.error}</div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default EditRoom;
