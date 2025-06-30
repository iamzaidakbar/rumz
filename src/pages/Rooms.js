import React, { useState, useMemo, useEffect } from "react";
import styles from "../styles/Rooms.module.scss";
import DataTable from "../components/DataTable";
import {
  IoEyeOutline,
  IoTrashOutline,
  IoWarningOutline,
  IoBedOutline,
} from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { roomsApi } from "../api/roomsApi";
import LoadingFallback from "../components/LoadingFallback";
import ConfirmDialog from "../components/ConfirmDialog";
import InfoMessage from "../components/InfoMessage";

const TABS = ["All", "Ground", "1st Floor", "2nd Floor"];

const getStatusPill = (status) => {
  const statusMap = {
    Available: styles.available,
    Occupied: styles.occupied,
    Cleaning: styles.cleaning,
  };
  return (
    <span className={`${styles.statusPill} ${statusMap[status]}`}>
      {status}
    </span>
  );
};

const columns = [
  { header: "Room", accessor: "roomNumber" },
  { header: "Room Type", accessor: "type" },
  { header: "Floor", accessor: "floor" },
  { header: "Amenities", accessor: "amenities" },
  { header: "Status", accessor: "status" },
];

// Rooms page for managing room details
const Rooms = () => {
  const { theme } = useAppContext();
  const [floor, setFloor] = useState("All");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    roomId: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const roomsData = await roomsApi.getRooms();
        setRooms(roomsData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch rooms.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const openDeleteDialog = (roomId) => {
    setDialogState({ isOpen: true, roomId });
  };

  const closeDeleteDialog = () => {
    setDialogState({ isOpen: false, roomId: null });
  };

  const handleDelete = async () => {
    const { roomId } = dialogState;
    if (!roomId) return;

    try {
      await roomsApi.deleteRoom(roomId);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
      // In a real app, show a success toast here
    } catch (err) {
      setError("Failed to delete room.");
      console.error(err);
      // In a real app, show an error toast here
    } finally {
      closeDeleteDialog();
    }
  };

  const filteredData = useMemo(() => {
    if (floor === "All") return rooms;
    return rooms.filter((r) => r.floor === floor);
  }, [floor, rooms]);

  if (loading) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <InfoMessage icon={IoWarningOutline} title="Error" message={error} />
    );
  }

  return (
    <motion.div
      data-theme={theme}
      className={styles.page}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.headerRow}>
        <h1 className={styles.header}>Rooms & Suites</h1>
        <button
          className={styles.addRoomBtn}
          onClick={() => navigate("/rooms/add")}
        >
          + Add Room
        </button>
      </div>
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab}
            className={floor === tab ? styles.activeTab : ""}
            onClick={() => setFloor(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {filteredData.length > 0 ? (
        <DataTable
          columns={columns}
          data={filteredData}
          renderers={{
            status: (val) => getStatusPill(val),
            amenities: (val) => (Array.isArray(val) ? val.join(", ") : ""),
          }}
          actions={(row) => (
            <div className={styles.actionBtns}>
              <IoEyeOutline
                size={20}
                className={styles.iconBtn}
                onClick={() => navigate(`/rooms/${row.id}`)}
              />
              <MdOutlineEdit
                size={20}
                className={`${styles.iconBtn} ${styles.editBtn}`}
                onClick={() => navigate(`/rooms/${row.id}/edit`)}
              />
              <IoTrashOutline
                size={20}
                className={`${styles.iconBtn} ${styles.deleteBtn}`}
                onClick={() => openDeleteDialog(row.id)}
              />
            </div>
          )}
        />
      ) : (
        <InfoMessage
          icon={IoBedOutline}
          title="No Rooms Found"
          message={
            floor === "All"
              ? "There are currently no rooms available."
              : "No rooms found for the selected floor. Try a different one."
          }
        />
      )}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Room"
      >
        Are you sure you want to permanently delete this room? This action
        cannot be undone.
      </ConfirmDialog>
    </motion.div>
  );
};

export default Rooms;
