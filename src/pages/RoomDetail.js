import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useRooms } from "../hooks/useRooms";
import { useAppContext } from "../contexts/AppContext";
import styles from "../styles/RoomDetail.module.scss";
import LoadingFallback from "../components/LoadingFallback";
import InfoMessage from "../components/InfoMessage";
import {
  IoWarningOutline,
  IoArrowBackOutline,
  IoPencilOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";
import CustomButton from "../components/CustomButton";
import StatusPill from "../components/StatusPill";

const RoomDetail = () => {
  const { roomId } = useParams();
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const { getRoom } = useRooms();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const roomData = await getRoom(roomId);
        setRoom(roomData);
      } catch (err) {
        setError("Could not find the requested room.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId, getRoom]);

  if (loading) return <LoadingFallback />;

  if (error) {
    return (
      <InfoMessage icon={IoWarningOutline} title="Error" message={error} />
    );
  }

  if (!room) return null;

  return (
    <div className={styles.pageWrapper} data-theme={theme}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className={styles.header}>
          <div>
            <div className={styles.breadcrumbs}>
              <Link to="/rooms">Rooms</Link> /{" "}
              <span>Room {room.roomNumber}</span>
            </div>
            <h1>Room Details</h1>
            <p>View and manage room details</p>
          </div>
          <div className={styles.headerActions}>
            <CustomButton
              variant="secondary"
              className={styles.backBtn}
              onClick={() => navigate(-1)}
            >
              <IoArrowBackOutline /> Back
            </CustomButton>
            <CustomButton
              variant="primary"
              className={styles.editBtn}
              onClick={() => navigate(`/rooms/${roomId}/edit`)}
            >
              <IoPencilOutline /> Edit
            </CustomButton>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <img src={room.photo} alt={`View of ${room.type}`} />
        </div>

        <div className={styles.content}>
          <div className={styles.titleSection}>
            <h1>Room {room.roomNumber}</h1>
            <p>{room.type}</p>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Room Type</span>
              <span className={styles.value}>{room.type}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Floor</span>
              <span className={styles.value}>{room.floor}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Beds</span>
              <span className={styles.value}>{room.beds}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Bathrooms</span>
              <span className={styles.value}>{room.bathrooms}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Status</span>
              <span className={styles.value}>
                <StatusPill status={room.status} type="room" />
              </span>
            </div>
            <div className={styles.detailItemFull}>
              <span className={styles.label}>Description</span>
              <span className={styles.value}>{room.description}</span>
            </div>
            <div className={styles.detailItemFull}>
              <span className={styles.label}>Amenities</span>
              <div className={styles.amenitiesContainer}>
                {room.amenities.map((amenity) => (
                  <span key={amenity} className={styles.amenityPill}>
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.pricingSection}>
            <h2>Pricing</h2>
            <div className={styles.detailItem}>
              <span className={styles.label}>Nightly Rate</span>
              <span className={styles.value}>${room.price}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoomDetail;
