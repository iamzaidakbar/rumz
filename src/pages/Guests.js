import React, { useState, useMemo, useEffect } from "react";
import styles from "../styles/Guests.module.scss";
import DataTable from "../components/DataTable";
import { guestsApi } from "../api/guestsApi";
import { IoEyeOutline } from "react-icons/io5";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";
import InfoMessage from "../components/InfoMessage";
import ConfirmDialog from "../components/ConfirmDialog";
import { IoWarningOutline } from "react-icons/io5";
import { bookingsApi } from "../api/bookingsApi";

const TABS = ["All Guests", "Current Guests", "Past Guests"];

const columns = [
  { header: "Guest Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Phone No", accessor: "phone" },
  { header: "Bookings", accessor: "bookings" },
  { header: "Status", accessor: "status" },
];

const guestBookingsColumns = [
  { header: "Check-In", accessor: (b) => b.booking_details.check_in_date },
  { header: "Check-Out", accessor: (b) => b.booking_details.check_out_date },
  { header: "Room Type", accessor: (b) => b.booking_details.room_type },
  { header: "Status", accessor: (b) => b.status?.booking_status || "-" },
  { header: "Email", accessor: (b) => b.guest_info.email },
  { header: "Phone No", accessor: (b) => b.guest_info.phone_number },
];

const Guests = () => {
  const { theme } = useAppContext();
  const [tab, setTab] = useState("All Guests");
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    guest: null,
  });
  const [guestBookings, setGuestBookings] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await guestsApi.getGuests();
      setGuests(data);
    } catch (err) {
      setError("Failed to fetch guests.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = () => {
    setSelectedGuest(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.guest) return;
    try {
      await guestsApi.deleteGuest(deleteDialog.guest.id);
      fetchGuests();
    } catch (err) {
      setError("Failed to delete guest.");
    } finally {
      setDeleteDialog({ isOpen: false, guest: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ isOpen: false, guest: null });
  };

  const handleViewGuest = async (guest) => {
    setSelectedGuest(guest);
    setViewLoading(true);
    setShowViewModal(true);
    try {
      const bookings = await bookingsApi.getBookingsForGuest(guest.phone);
      setGuestBookings(bookings);
    } catch (err) {
      setGuestBookings([]);
    } finally {
      setViewLoading(false);
    }
  };

  const getStatusPill = (status) => (
    <span
      className={`${styles.statusPill} ${
        status === "Active" ? styles.statusActive : styles.statusInactive
      }`}
    >
      {status}
    </span>
  );

  const filteredData = useMemo(() => {
    if (tab === "Current Guests")
      return guests.filter((g) => g.status === "Active");
    if (tab === "Past Guests")
      return guests.filter((g) => g.status === "Inactive");
    return guests;
  }, [tab, guests]);

  const mappedGuests = useMemo(
    () =>
      guests.map((g) => ({
        ...g,
        email: g.email || g.contact, // fallback if not present
        phone: g.phone || g.contact, // fallback if not present
      })),
    [guests]
  );

  if (loading) return null;
  if (error)
    return (
      <InfoMessage icon={IoWarningOutline} title="Error" message={error} />
    );

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
        <button className={styles.addGuestBtn} onClick={handleAddGuest}>
          + Add New Guest
        </button>
      </div>
      <p className={styles.subtitle}>
        Manage guest profiles, view booking history, and update information.
      </p>
      <DataTable
        columns={columns}
        data={filteredData.map(
          (g) => mappedGuests.find((mg) => mg.id === g.id) || g
        )}
        search
        searchPlaceholder="Search guests by name or contact..."
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
        renderers={{
          status: (val) => getStatusPill(val),
        }}
        actions={(row) => (
          <div className={styles.actionBtns}>
            <IoEyeOutline
              size={20}
              className={styles.viewBtn}
              onClick={() => handleViewGuest(row)}
            />
          </div>
        )}
        noDataInfo={{
          icon: IoWarningOutline,
          title: "No Guests Found",
          message: "No guests found. Add a new guest to get started.",
        }}
      />
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Guest"
      >
        Are you sure you want to permanently delete this guest? This action
        cannot be undone.
      </ConfirmDialog>
      {/* Add/Edit Guest Form Modal (to be implemented) */}
      {/* {showForm && (
        <GuestForm
          guest={selectedGuest}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )} */}
      {/* View Guest Bookings Modal */}
      {showViewModal && selectedGuest && (
        <div className={styles.viewModal}>
          <div className={styles.modalContent}>
            <h2>Bookings for {selectedGuest.name}</h2>
            {viewLoading ? (
              <p>Loading...</p>
            ) : guestBookings.length === 0 ? (
              <p>No bookings found for this guest.</p>
            ) : (
              <DataTable
                columns={guestBookingsColumns}
                data={guestBookings}
                search={false}
              />
            )}
            <button
              className={styles.closeModalBtn}
              onClick={() => setShowViewModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Guests;
