import React, { useState } from "react";
import styles from "../styles/AddRoom.module.scss";
import { useNavigate } from "react-router-dom";
import { roomsApi } from "../api/roomsApi";
import { motion } from "framer-motion";
import { useAppContext } from "../contexts/AppContext";
import CustomDropdown from "../components/CustomDropdown";

const AMENITIES = ["Wi-Fi", "TV", "AC", "Mini-bar", "Balcony", "Kitchenette"];
const FLOORS = ["Ground", "1st Floor", "2nd Floor"];
const TYPES = ["Standard Room", "Deluxe Suite", "Family Room", "Penthouse"];
const STATUS = ["Available", "Occupied", "Cleaning"];

const AddRoom = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    roomNumber: "",
    type: TYPES[0],
    floor: FLOORS[0],
    status: STATUS[0],
    amenities: [],
    photo: "",
    description: "",
    price: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    if (!form.roomNumber.trim()) {
      setError("Room number is required.");
      setSaving(false);
      return;
    }
    try {
      await roomsApi.addRoom(form);
      navigate("/rooms");
    } catch (err) {
      setError("Failed to add room.");
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
        <h1 className={styles.header}>Add Room</h1>
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
              rows={3}
            />
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
          <div className={styles.formActions}>
            <button
              className={styles.backBtn}
              onClick={() => navigate("/rooms")}
              type="button"
            >
              Back
            </button>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddRoom;
