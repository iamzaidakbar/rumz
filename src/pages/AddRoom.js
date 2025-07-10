import React from "react";
import styles from "../styles/AddRoom.module.scss";
import { useNavigate } from "react-router-dom";
import { useRoomsContext } from "../contexts/RoomsContext";
import { motion } from "framer-motion";
import { useAppContext } from "../contexts/AppContext";
import CustomDropdown from "../components/CustomDropdown";
import CustomButton from "../components/CustomButton";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiSaveDown1 } from "react-icons/ci";
import { useToast } from "../contexts/ToastContext";
import LogoUpload from "../components/forms/LogoUpload";
import { useRoomForm } from "../hooks/useRoomForm";

const AddRoom = () => {
  const { theme } = useAppContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const { addRoom } = useRoomsContext();
  const AMENITIES = ["Wi-Fi", "TV", "AC", "Parking", "Balcony", "Room Service"];
  const FLOORS = ["1st Floor", "2nd Floor"];
  const TYPES = ["Standard Room", "Deluxe Suite", "Family Room", "Penthouse"];
  const STATUS = ["Available", "Booked", "Reserved"];

  const {
    form,
    saving,
    setSaving,
    error,
    setError,
    photoUploading,
    photoError,
    fileInputRef,
    handleChange,
    handleDropdownChange,
    handlePhotoSelect,
    handlePhotoDrop,
    handlePhotoClick,
    handleRemovePhoto,
    validate,
  } = useRoomForm({
    initialData: {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    if (!validate()) {
      setError("Room number and status are required.");
      setSaving(false);
      return;
    }
    try {
      await addRoom(form);
      success("Room added successfully!", "Redirecting...", { duration: 3000 });
      navigate("/rooms");
    } catch (err) {
      setError("Failed to add room.");
      showError("Failed to add room. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

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
          <h1>Add Room</h1>
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
              disabled={saving}
              form="add-room-form"
            >
              <CiSaveDown1 /> {saving ? "Add..." : "Add Room"}
            </CustomButton>
          </div>
        </div>

        <form
          className={styles.form}
          id="add-room-form"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              width: "100%",
            }}
          >
            <div style={{ width: "100%" }} className={styles.inputGroup}>
              <label htmlFor="roomNumber">Room Number</label>
              <input
                type="text"
                id="roomNumber"
                name="roomNumber"
                value={form.roomNumber}
                onChange={handleChange}
                placeholder="Enter room number"
                required
              />
            </div>
            <div style={{ width: "100%" }} className={styles.inputGroup}>
              <label htmlFor="type">Room Type</label>
              <CustomDropdown
                options={TYPES}
                value={form.type}
                onChange={handleDropdownChange("type")}
                placeholder="Select a room type"
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
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
                value={form.beds}
                onChange={handleChange}
                min={1}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="bathrooms">Number of Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={form.bathrooms}
                onChange={handleChange}
                min={1}
              />
            </div>
          </div>
          <div className={styles.inputGroupRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="floor">Floor</label>
              <CustomDropdown
                options={FLOORS}
                value={form.floor}
                onChange={handleDropdownChange("floor")}
                placeholder="Select a floor"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="status">Status</label>
              <CustomDropdown
                options={STATUS}
                value={form.status}
                onChange={handleDropdownChange("status")}
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
                    form.amenities.includes(a) ? styles.selected : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    name="amenities"
                    value={a}
                    checked={form.amenities.includes(a)}
                    onChange={handleChange}
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
                logoUploading={photoUploading}
                logoError={photoError}
                onLogoDrop={handlePhotoDrop}
                onLogoSelect={handlePhotoSelect}
                onLogoClick={handlePhotoClick}
                onDragOver={(e) => e.preventDefault()}
                fileInputRef={fileInputRef}
                onRemoveLogo={handleRemovePhoto}
                hotelLogo={form.photo}
                label="Room Photo"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                min={0}
              />
            </div>
          </div>
          {error && <div className={styles.errorMsg}>{error}</div>}
        </form>
      </motion.div>
    </div>
  );
};

export default AddRoom;
