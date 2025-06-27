import React, { useState, useMemo } from "react";
import styles from "../styles/Guests.module.scss";
import DataTable from "../components/DataTable";
import { guests as GUESTS_DATA } from "../data/guests";
import { IoEyeOutline } from "react-icons/io5";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";

const TABS = ["All Guests", "Current Guests", "Past Guests"];

const columns = [
  { header: "Guest Name", accessor: "name" },
  { header: "Contact", accessor: "contact" },
  { header: "Bookings", accessor: "bookings" },
  { header: "Status", accessor: "status" },
];

const Guests = () => {
  const { theme } = useAppContext();
  const [tab, setTab] = useState("All Guests");

  const getStatusPill = (status) => {
    return (
      <span
        className={`${styles.statusPill} ${
          status === "Active" ? styles.statusActive : styles.statusInactive
        }`}
      >
        {status}
      </span>
    );
  };

  const filteredData = useMemo(() => {
    if (tab === "Current Guests")
      return GUESTS_DATA.filter((g) => g.status === "Active");
    if (tab === "Past Guests")
      return GUESTS_DATA.filter((g) => g.status === "Inactive");
    return GUESTS_DATA;
  }, [tab]);

  return (
    <motion.div
      className={styles.page}
      data-theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.headerRow}>
        <h1 className={styles.header}>Guest Management</h1>
        <button className={styles.addGuestBtn}>+ Add New Guest</button>
      </div>
      <p className={styles.subtitle}>
        Manage guest profiles, view booking history, and update information.
      </p>
      <DataTable
        columns={columns}
        data={filteredData}
        search
        searchPlaceholder="Search guests by name or contact..."
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
        renderers={{
          status: (val) => getStatusPill(val),
        }}
        actions={() => (
          <button className={styles.viewBtn}>
            <IoEyeOutline size={20} />
          </button>
        )}
      />
    </motion.div>
  );
};

export default Guests;
