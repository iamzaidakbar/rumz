import React, { useState } from "react";
import styles from "../styles/Owner.module.scss";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";
import owner from "../Images/Owner.png";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=Z+A&background=3b82f6&color=fff&size=256";

const Owner = () => {
  const { appData, theme } = useAppContext();
  const [activeTab, setActiveTab] = useState("Gallery");

  return (
    <motion.div
      className={styles.page}
      data-theme={theme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.profileContainer}>
        <div className={styles.banner}>
          <img src={appData.bannerPhoto} alt="Hotel Banner" />
        </div>

        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            <img
              src={owner || DEFAULT_AVATAR}
              alt={appData.ownerName}
              onError={(e) => (e.target.src = DEFAULT_AVATAR)}
            />
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.ownerName}>{appData.ownerName}</h1>
            <p className={styles.username}>{appData.username}</p>
          </div>
        </div>

        <div className={styles.statsBar}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{appData.stats.rooms}</span>
            <span className={styles.statLabel}>Rooms</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{appData.stats.staff}</span>
            <span className={styles.statLabel}>Staff</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{appData.stats.rating}</span>
            <span className={styles.statLabel}>Rating</span>
          </div>
        </div>

        <div className={styles.bio}>
          <p>{appData.bio}</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={activeTab === "Gallery" ? styles.activeTab : ""}
            onClick={() => setActiveTab("Gallery")}
          >
            Hotel Gallery
          </button>
          <button
            className={activeTab === "Details" ? styles.activeTab : ""}
            onClick={() => setActiveTab("Details")}
          >
            Contact Details
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "Gallery" && (
            <div className={styles.gallery}>
              {appData.gallery.map((url, index) => (
                <motion.div
                  className={styles.galleryItem}
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <img src={url} alt={`Hotel gallery item ${index + 1}`} />
                </motion.div>
              ))}
            </div>
          )}
          {activeTab === "Details" && (
            <div className={styles.detailsContent}>
              <p>
                <strong>Email:</strong> {appData.email}
              </p>
              <p>
                <strong>Phone:</strong> {appData.phone}
              </p>
              <p>
                <strong>Member Since:</strong> {appData.memberSince}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Owner;
