import React, { Suspense } from "react";
import styles from "../styles/Dashboard.module.scss";
import MetricCard from "../components/MetricCard";
import QuickActions from "../components/QuickActions";
import Calendar from "../components/Calendar";
import { metrics, revenueTrend, roomTypeData } from "../data/dashboardData";
import { motion } from "framer-motion";
import LoadingFallback from "../components/LoadingFallback";
import OngoingBookings from "../components/OngoingBookings";
import GuestActivity from "../components/GuestActivity";
import { useAppContext } from "../contexts/AppContext";

const TrendChart = React.lazy(() => import("../components/TrendChart"));
const PieChart = React.lazy(() => import("../components/PieChart"));

const Dashboard = () => {
  const { theme } = useAppContext();
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
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
          >
            <MetricCard label={m.label} value={m.value} change={m.change} />
          </motion.div>
        ))}
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
