import React, { useState, useMemo } from "react";
import styles from "../styles/Rooms.module.scss";
import { rooms } from "../data/rooms";
import DataTable from "../components/DataTable";
import { IoEyeOutline } from "react-icons/io5";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";

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

  const filteredData = useMemo(() => {
    if (floor === "All") return rooms;
    return rooms.filter((r) => r.floor === floor);
  }, [floor]);

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
      <DataTable
        columns={columns}
        data={filteredData}
        renderers={{
          status: (val) => getStatusPill(val),
          amenities: (val) => val.join(", "),
        }}
        actions={() => <IoEyeOutline size={20} className={styles.iconBtn} />}
      />
    </motion.div>
  );
};

export default Rooms;
