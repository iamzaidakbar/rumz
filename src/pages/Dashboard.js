import React, { Suspense, useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import MetricCard from "../components/MetricCard";
import QuickActions from "../components/QuickActions";
import Calendar from "../components/Calendar";
import { revenueTrend, roomTypeData } from "../data/dashboardData";
import { motion } from "framer-motion";
import LoadingFallback from "../components/LoadingFallback";
import OngoingBookings from "../components/OngoingBookings";
import GuestActivity from "../components/GuestActivity";
import { useAppContext } from "../contexts/AppContext";
import { bookingsApi } from "../api/bookingsApi";
import { roomsApi } from "../api/roomsApi";

const TrendChart = React.lazy(() => import("../components/TrendChart"));
const PieChart = React.lazy(() => import("../components/PieChart"));

const Dashboard = () => {
  const { theme } = useAppContext();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const [bookings, rooms] = await Promise.all([
          bookingsApi.getBookings(),
          roomsApi.getRooms(),
        ]);
        // Total Revenue: sum of all booking payment_info.amount (as number)
        const totalRevenue = bookings.reduce((sum, b) => {
          const amt = Number(b.payment_info?.amount || 0);
          return sum + (isNaN(amt) ? 0 : amt);
        }, 0);
        // Occupancy Rate: occupied rooms / total rooms * 100
        const occupiedRooms = rooms.filter(
          (r) => r.status === "Occupied"
        ).length;
        const occupancyRate =
          rooms.length > 0
            ? ((occupiedRooms / rooms.length) * 100).toFixed(1)
            : "0";
        // Available Rooms: rooms with status === "Available"
        const availableRooms = rooms.filter(
          (r) => r.status === "Available"
        ).length;
        // Total Bookings: bookings count
        const totalBookings = bookings.length;
        setMetrics([
          {
            label: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
          },
          { label: "Occupancy Rate", value: `${occupancyRate}%` },
          { label: "Available Rooms", value: availableRooms },
          { label: "Total Bookings", value: totalBookings },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <motion.div
      className={styles.page}
      data-theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <h1>Hotel Dashboard</h1>
        <QuickActions />
      </div>

      {/* Metric Cards */}
      <motion.div
        className={styles.metricsRow}
        aria-label="Key metrics overview"
      >
        {loading || !metrics ? (
          <LoadingFallback />
        ) : (
          metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
            >
              <MetricCard label={m.label} value={m.value} change={m.change} />
            </motion.div>
          ))
        )}
      </motion.div>

      <div className={styles.mainGrid}>
        <motion.div
          className={styles.gridItem}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <OngoingBookings />
        </motion.div>
        <motion.div
          className={styles.gridItem}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <GuestActivity />
        </motion.div>
        <motion.div
          className={styles.gridItem}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className={styles.chartWrapper}>
            <h2 className={styles.chartTitle}>Revenue Trend</h2>
            <Suspense fallback={<LoadingFallback />}>
              <TrendChart data={revenueTrend} />
            </Suspense>
          </div>
        </motion.div>
        <motion.div
          className={styles.gridItem}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className={styles.chartWrapper}>
            <h2 className={styles.chartTitle}>Room Popularity</h2>
            <Suspense fallback={<LoadingFallback />}>
              <PieChart data={roomTypeData} />
            </Suspense>
          </div>
        </motion.div>
        <motion.div
          className={styles.gridItemWide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className={styles.calendarWrapper}>
            <h2 className={styles.chartTitle}>Booking Calendar</h2>
            <Calendar />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
