import React, { useState, useMemo } from "react";
import styles from "../styles/Guests.module.scss";
import DataTable from "../components/DataTable";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";
import { IoWarningOutline } from "react-icons/io5";
import { useGuestsContext } from "../contexts/GuestsContext";
import { useBookingsContext } from "../contexts/BookingsContext";

const TABS = ["All Guests", "Current Guests", "Past Guests"];

const columns = [
  { header: "Guest Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Phone No", accessor: "phone" },
  { header: "Check-In", accessor: "checkIn" },
  { header: "Check-Out", accessor: "checkOut" },
  { header: "Bookings", accessor: "bookings" },
];

const Guests = () => {
  const { theme } = useAppContext();
  const [tab, setTab] = useState("All Guests");
  const { guests, loading: guestsLoading } = useGuestsContext();
  const { bookings, loading: bookingsLoading } = useBookingsContext();

  const getStatusPill = (status) => (
    <span
      className={`${styles.statusPill} ${
        status === "Active" ? styles.statusActive : styles.statusInactive
      }`}
    >
      {status}
    </span>
  );

  const getUniqueGuests = (guests) => {
    const seen = new Set();
    return guests.filter((g) => {
      const key = g.email || g.phone;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const mappedGuests = useMemo(
    () =>
      guests.map((g) => {
        let email =
          g.email ||
          (g.contact && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g.contact)
            ? g.contact
            : "");
        let phone =
          g.phone ||
          (g.contact && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g.contact)
            ? g.contact
            : "");
        const guestBookings = bookings.filter(
          (b) =>
            (email && b.guest_info.email === email) ||
            (phone && b.guest_info.phone_number === phone)
        );
        // Sort bookings by check-in date descending
        const sorted = [...guestBookings].sort(
          (a, b) =>
            new Date(b.booking_details?.check_in_date) -
            new Date(a.booking_details?.check_in_date)
        );
        const mostRecent = sorted[0];
        // Compute status: Active if any booking is ongoing, else Inactive
        const today = new Date();
        const isActive = guestBookings.some((b) => {
          const checkIn = new Date(b.booking_details?.check_in_date);
          const checkOut = new Date(b.booking_details?.check_out_date);
          return today >= checkIn && today <= checkOut;
        });
        return {
          ...g,
          email,
          phone,
          bookings: guestBookings.length,
          checkIn: mostRecent?.booking_details?.check_in_date || "-",
          checkOut: mostRecent?.booking_details?.check_out_date || "-",
          status: isActive ? "Active" : "Inactive",
        };
      }),
    [guests, bookings]
  );

  const filteredData = useMemo(() => {
    let filtered = mappedGuests;
    if (tab === "Current Guests")
      filtered = mappedGuests.filter((g) => g.status === "Active");
    if (tab === "Past Guests")
      filtered = mappedGuests.filter((g) => g.status === "Inactive");
    return getUniqueGuests(filtered);
  }, [tab, mappedGuests]);

  if (guestsLoading || bookingsLoading) return null;

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
        noDataInfo={{
          icon: IoWarningOutline,
          title: "No Guests Found",
          message: "No guests found. Add a new guest to get started.",
        }}
      />
    </motion.div>
  );
};

export default Guests;
