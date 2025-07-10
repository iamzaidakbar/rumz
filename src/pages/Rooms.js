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
import { useRoomsContext } from "../contexts/RoomsContext";
import { useNavigate } from "react-router-dom";
import LoadingFallback from "../components/LoadingFallback";
import InfoMessage from "../components/InfoMessage";
import CustomButton from "../components/CustomButton";
import { IoMdAdd } from "react-icons/io";
import StatusPill from "../components/StatusPill";
import { useToast } from "../contexts/ToastContext";

const TABS = ["All", "Ground", "1st Floor", "2nd Floor"];

const columns = [
  { header: "Room", accessor: "roomNumber" },
  { header: "Room Type", accessor: "type" },
  { header: "Floor", accessor: "floor" },
  {
    header: "Amenities",
    accessor: "amenities",
    cell: (value) => (Array.isArray(value) ? value.join(", ") : ""),
  },
  {
    header: "Status",
    accessor: (row) => <StatusPill status={row.status} type="room" />,
  },
];

// Rooms page for managing room details
const Rooms = () => {
  const { success, error: showError } = useToast();
  const { theme } = useAppContext();
  const [floor, setFloor] = useState("All");
  const navigate = useNavigate();
  const { rooms, loading, error, deleteRoom, fetchRooms } = useRoomsContext();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleDelete = async (room) => {
    if (!room) return;
    try {
      await deleteRoom(room.id);
      success(
        "Room Deleted Successfully!",
        `Room has been permanently deleted.`,
        { duration: 6000 }
      );
      await fetchRooms({ refresh: true }); // Refresh the room list after deletion
    } catch (err) {
      console.error(err);
      showError(
        "Failed to Delete Room",
        "There was an error deleting the room. Please try again or contact support.",
        { duration: 8000 }
      );
    }
  };

  const filteredData = useMemo(() => {
    if (floor === "All") return rooms;
    return rooms.filter((r) => r.floor === floor);
  }, [floor, rooms]);

  if (loading) return <LoadingFallback />;
  if (error)
    return (
      <InfoMessage icon={IoWarningOutline} title="Error" message={error} />
    );

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

        <CustomButton
          variant="primary"
          className={styles.addRoomBtn}
          onClick={() => navigate("/rooms/add")}
        >
          <IoMdAdd /> New Room
        </CustomButton>
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        search={true}
        searchPlaceholder="Search rooms..."
        actions={(row, openDialog) => (
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
              onClick={() => openDialog(row)}
            />
          </div>
        )}
        noDataInfo={{
          icon: IoBedOutline,
          title: "No Rooms Found",
          message:
            "No rooms found matching your criteria. Try adjusting your filters or search term.",
        }}
        deleteDialogInfo={{
          title: "Delete Room",
          message:
            "Are you sure you want to permanently delete this room? This action cannot be undone.",
        }}
        onConfirmDelete={handleDelete}
        tabs={TABS}
        activeTab={floor}
        onTabChange={setFloor}
      />
    </motion.div>
  );
};

export default Rooms;
