import React, { useState, useEffect, Suspense } from "react";
import styles from "../styles/Dashboard.module.scss";
import { motion } from "framer-motion";
import { useAppContext } from "../contexts/AppContext";
import { dashboardApi } from "../api/dashboardApi";
import LoadingFallback from "../components/LoadingFallback";
import MetricCard from "../components/MetricCard";
import QuickActions from "../components/QuickActions";
import OngoingBookings from "../components/OngoingBookings";
import GuestActivity from "../components/GuestActivity";
import Calendar from "../components/Calendar";
import TrendChart from "../components/TrendChart";
import PieChart from "../components/PieChart";

const Dashboard = () => {
  const { theme } = useAppContext();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [roomTypeData, setRoomTypeData] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const summaryData = await dashboardApi.getSummary();
        setSummary(summaryData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Dashboard summary API error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
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
        {loading || !summary ? (
          <LoadingFallback />
        ) : (
          <>
            <MetricCard
              label="Total Revenue"
              value={`₹${summary.totalRevenue.toLocaleString()}`}
            />
            <MetricCard label="Total Rooms" value={summary.totalRooms} />
            <MetricCard
              label="Available Rooms"
              value={summary.totalAvailableRooms}
            />
            <MetricCard label="Total Bookings" value={summary.totalBookings} />
            <MetricCard label="Total Guests" value={summary.totalGuests} />
            <MetricCard
              label="Cancelled Bookings"
              value={summary.totalCancelledBookings}
            />
            <MetricCard
              label="Upcoming Check-ins"
              value={summary.upcomingCheckinsCount}
            />
          </>
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
          className={styles.gridItemWide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className={styles.calendarWrapper}>
            <h2 className={styles.chartTitle}>Scheduled Bookings</h2>
            <Calendar />
          </div>
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
      </div>
    </motion.div>
  );
};

export default Dashboard;
