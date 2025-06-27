import React from "react";
import styles from "../styles/RoomCard.module.scss";
import { motion } from "framer-motion";
import { FiWifi, FiTv, FiWind } from "react-icons/fi";
import { MdLocalBar, MdBathroom } from "react-icons/md";

const amenityIcons = {
  "Wi-Fi": <FiWifi />,
  TV: <FiTv />,
  AC: <FiWind />,
  "Mini-bar": <MdLocalBar />,
  Balcony: <MdBathroom />, // Using a placeholder, add more specific icons as needed
};

const getStatusClass = (status) => {
  switch (status) {
    case "Available":
      return styles.available;
    case "Occupied":
      return styles.occupied;
    case "Cleaning":
      return styles.cleaning;
    default:
      return "";
  }
};

const RoomCard = ({ room, index }) => {
  return (
    <motion.div
      className={styles.card}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className={`${styles.statusPill} ${getStatusClass(room.status)}`}>
        {room.status}
      </div>
      <div className={styles.roomInfo}>
        <span className={styles.roomNumber}>Room {room.roomNumber}</span>
        <h3 className={styles.roomType}>{room.type}</h3>
        <p className={styles.floor}>{room.floor}</p>
      </div>
      <div className={styles.amenities}>
        {room.amenities.map((amenity) => (
          <div key={amenity} className={styles.amenityIcon} title={amenity}>
            {amenityIcons[amenity] || <span>{amenity.slice(0, 2)}</span>}
          </div>
        ))}
      </div>
      <button className={styles.viewButton}>View Details</button>
    </motion.div>
  );
};

export default RoomCard;
