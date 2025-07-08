import React, { useState, useEffect } from "react";
import styles from "../styles/Dashboard.module.scss";
import { motion } from "framer-motion";
import { useAppContext } from "../contexts/AppContext";
import { dashboardApi } from "../api/dashboardApi";
import LoadingFallback from "../components/LoadingFallback";
import MetricCard from "../components/MetricCard";
import QuickActions from "../components/QuickActions";
import OngoingBookings from "../components/OngoingBookings";
import Calendar from "../components/Calendar";
import TrendChart from "../components/TrendChart";

const Dashboard = () => {
  const { theme } = useAppContext();
  const [summary, setSummary] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [summaryData, trendData] = await Promise.all([
          dashboardApi.getSummary(),
          dashboardApi.getRevenueTrend({ period: "month" }),
        ]);
        setSummary(summaryData);
        setRevenueTrend(trendData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Dashboard API error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
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
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className={styles.headerRow}>
            <h2 className={styles.title}>Monthly Revenue Trend</h2>
            <p className={styles.subtitle}>
              Revenue trend for the current year
            </p>
          </div>
          <TrendChart data={revenueTrend} />
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.gridItem}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Calendar />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
