import React, { useState, useEffect } from "react";
import styles from "../styles/Settings.module.scss";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomButton from "../components/CustomButton";
import { hotelsApi } from "../api/hotelsApi";

// Settings page for application preferences
const Settings = () => {
  const { theme, toggleTheme, appData, setAppData } = useAppContext();
  const [formData, setFormData] = useState(appData || {});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(appData || {});
  }, [appData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const hotelRegNo = formData.hotelRegNo;
      const updateData = { ...formData };
      await hotelsApi.updateHotel(hotelRegNo, updateData, token);
      setAppData(updateData);
      localStorage.setItem("hotel", JSON.stringify(updateData));
      toast.success("Hotel details updated!", { position: "top-center" });
      setEditMode(false);
    } catch (err) {
      toast.error(err.message || "Failed to update hotel", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hotel");
    toast.success("Logged out successfully!", { position: "top-center" });
    setTimeout(() => navigate("/signin", { replace: true }), 1000);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  return (
    <motion.div
      className={styles.page}
      data-theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={styles.header}>Settings</h1>
      <div className={styles.form}>
        {/* Theme Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Appearance</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontWeight: 500, fontSize: 16 }}>
              Theme: {theme === "dark" ? "Dark" : "Light"}
            </span>
            <CustomButton
              variant={theme === "dark" ? "primary" : "secondary"}
              onClick={toggleTheme}
              aria-label="Toggle light/dark mode"
            >
              Switch to {theme === "dark" ? "Light" : "Dark"} Mode
            </CustomButton>
          </div>
        </div>
        {/* Hotel Details Section */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className={styles.formSection}
        >
          <h2 className={styles.sectionTitle}>Hotel Details</h2>
          {/* Hotel Logo */}
          <div className={styles.inputGroup}>
            <label htmlFor="hotelLogo">Hotel Logo</label>

            <img
              src={formData?.hotelLogo}
              alt="Hotel Logo"
              width={250}
              height={"auto"}
            />
          </div>
          {/* Hotel Reg No */}
          <div className={styles.inputGroup}>
            <label htmlFor="hotelRegNo">Hotel Reg No</label>
            <input
              type="text"
              id="hotelRegNo"
              name="hotelRegNo"
              value={formData.hotelRegNo || ""}
              onChange={handleChange}
              disabled
              className={styles.disabledInput}
            />
          </div>
          {/* Hotel Name */}
          <div className={styles.inputGroup}>
            <label htmlFor="hotelname">Hotel Name</label>
            <input
              type="text"
              id="hotelname"
              name="hotelname"
              value={formData.hotelname || ""}
              onChange={handleChange}
              disabled={!editMode}
              className={!editMode ? styles.disabledInput : ""}
            />
          </div>
          {/* Hotel Location */}
          <div className={styles.inputGroup}>
            <label htmlFor="hotelLocation">Hotel Location</label>
            <input
              type="text"
              id="hotelLocation"
              name="hotelLocation"
              value={formData.hotelLocation || ""}
              onChange={handleChange}
              disabled={!editMode}
              className={!editMode ? styles.disabledInput : ""}
            />
          </div>
          {/* Hotel Manager */}
          <div className={styles.inputGroup}>
            <label htmlFor="hotelManager">Hotel Manager</label>
            <input
              type="text"
              id="hotelManager"
              name="hotelManager"
              value={formData.hotelManager || ""}
              onChange={handleChange}
              disabled={!editMode}
              className={!editMode ? styles.disabledInput : ""}
            />
          </div>
          {/* Hotel Manager Number */}
          <div className={styles.inputGroup}>
            <label htmlFor="hotelManagerNumber">Hotel Manager's No</label>
            <input
              type="text"
              id="hotelManagerNumber"
              name="hotelManagerNumber"
              value={formData.hotelManagerNumber || ""}
              onChange={handleChange}
              disabled={!editMode}
              className={!editMode ? styles.disabledInput : ""}
            />
          </div>
          <div className={styles.formActions}>
            {editMode && (
              <CustomButton
                variant={theme === "dark" ? "primary" : "secondary"}
                type="button"
                className={styles.saveButton}
                disabled={loading}
                onClick={() => {
                  setEditMode(false);
                }}
              >
                Cancel
              </CustomButton>
            )}
            <CustomButton
              variant={theme === "dark" ? "primary" : "secondary"}
              type="button"
              className={styles.saveButton}
              disabled={loading}
              onClick={editMode ? handleSave : handleEdit}
            >
              {editMode ? (loading ? "Saving..." : "Save Changes") : "Edit"}
            </CustomButton>
          </div>
        </form>

        {/* Owner Details Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Owner Details</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="fullname">Owner Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname || ""}
              onChange={handleChange}
              disabled
              className={styles.disabledInput}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Owner Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              disabled
              className={styles.disabledInput}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="number">Owner Phone Number</label>
            <input
              type="tel"
              id="number"
              name="number"
              value={formData.number || ""}
              onChange={handleChange}
              disabled
              className={styles.disabledInput}
            />
          </div>
        </div>
        {/* Logout Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Account</h2>
          <CustomButton
            variant={theme === "dark" ? "primary" : "secondary"}
            onClick={handleLogout}
            style={{ width: "100%", marginTop: 8 }}
          >
            Log Out
          </CustomButton>
        </div>
      </div>
      <ToastContainer />
    </motion.div>
  );
};

export default Settings;
