import React, { useState, useEffect } from "react";
import styles from "../styles/AddRoom.module.scss"; // Re-using styles
import { useNavigate, useParams } from "react-router-dom";
import { roomsApi } from "../api/roomsApi";
import { motion } from "framer-motion";
import { useAppContext } from "../contexts/AppContext";
import CustomDropdown from "../components/CustomDropdown";
import LoadingFallback from "../components/LoadingFallback";
import InfoMessage from "../components/InfoMessage";
import { IoArrowBackOutline, IoWarningOutline } from "react-icons/io5";
import CustomButton from "../components/CustomButton";

const AMENITIES = ["Wi-Fi", "TV", "AC", "Mini-bar", "Balcony", "Kitchenette"];
const FLOORS = ["Ground", "1st Floor", "2nd Floor"];
const TYPES = ["Standard Room", "Deluxe Suite", "Family Room", "Penthouse"];
const STATUS = ["Available", "Occupied", "Cleaning"];

const EditRoom = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await roomsApi.getRoom(roomId);
        setForm(roomData);
      } catch (err) {
        setError("Failed to fetch room details.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, value]
          : prev.amenities.filter((a) => a !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDropdownChange = (name) => (value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await roomsApi.updateRoom(roomId, form);
      navigate(`/rooms/${roomId}`);
    } catch (err) {
      setError("Failed to update room.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingFallback />;
  if (error)
    return (
      <InfoMessage icon={IoWarningOutline} title="Error" message={error} />
    );
  if (!form) return null;

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
              disabled={saving}
              form="edit-booking-form"
            >
              {saving ? "Saving..." : "Save Changes"}
            </CustomButton>
          </div>
        </div>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className={styles.inputGroup}>
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
          <div className={styles.inputGroup}>
            <label htmlFor="type">Room Type</label>
            <CustomDropdown
              options={TYPES}
              value={form.type}
              onChange={handleDropdownChange("type")}
              placeholder="Select a room type"
            />
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
              <label htmlFor="photo">Photo URL (optional)</label>
              <input
                type="url"
                id="photo"
                name="photo"
                value={form.photo}
                onChange={handleChange}
                placeholder="https://..."
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

export default EditRoom;
