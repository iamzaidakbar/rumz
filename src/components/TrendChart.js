import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { bookingsTrend } from "../data/dashboardData";
import { motion } from "framer-motion";
import styles from "../styles/TrendChart.module.scss";

const TrendChart = ({ percentChange = 15 }) => (
  <motion.div
    className={styles.trendCard}
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    aria-label="Bookings Over Time"
  >
    <div className={styles.percent}>+{percentChange}%</div>
    <div className={styles.sublabel}>
      Last 30 Days <span className={styles.green}>+{percentChange}%</span>
    </div>
    <ResponsiveContainer width="100%" height={120}>
      <LineChart
        data={bookingsTrend}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 13 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#0056d6"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </motion.div>
);

export default TrendChart;
