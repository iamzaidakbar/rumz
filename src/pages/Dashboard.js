import React, { Suspense } from "react";
import styles from "../styles/Dashboard.module.scss";
import MetricCard from "../components/MetricCard";
import QuickActions from "../components/QuickActions";
import Calendar from "../components/Calendar";
import {
  metrics,
  percentChange,
  barPercentChange,
} from "../data/dashboardData";
import { motion } from "framer-motion";
import LoadingFallback from "../components/LoadingFallback";
import OngoingBookings from "../components/OngoingBookings";

const TrendChart = React.lazy(() => import("../components/TrendChart"));
const BarChart = React.lazy(() => import("../components/BarChart"));

const Dashboard = () => {
  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={styles.header}>Dashboard</h1>
      <OngoingBookings />
      {/* Metric Cards */}
      <motion.div
        className={styles.metricsRow}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        aria-label="Key metrics overview"
      >
        {metrics.map((m) => (
          <MetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            change={m.change}
          />
        ))}
      </motion.div>
      {/* Trends Section */}
      <div className={styles.sectionTitle}>Trends</div>
      <motion.div
        className={styles.trendsRow}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ gap: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr" }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <TrendChart percentChange={percentChange} />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <BarChart percentChange={barPercentChange} />
        </Suspense>
      </motion.div>
      {/* Quick Actions */}
      <div className={styles.sectionTitle}>Quick Actions</div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <QuickActions />
      </motion.div>
      {/* Calendar */}
      <div className={styles.sectionTitle}>Calendar</div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Calendar />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
