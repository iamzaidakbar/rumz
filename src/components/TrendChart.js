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
import { motion } from "framer-motion";
import styles from "../styles/TrendChart.module.scss";
import { useAppContext } from "../contexts/AppContext";

const TrendChart = ({ data }) => {
  const { theme } = useAppContext();
  return (
    <motion.div
      className={styles.trendCard}
      data-theme={theme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      aria-label="Revenue Trend"
    >
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={theme === "dark" ? "#444" : "#eee"}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: theme === "dark" ? "#aaa" : "#666" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: theme === "dark" ? "#aaa" : "#666" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: theme === "dark" ? "#333" : "#fff",
              border: "1px solid",
              borderColor: theme === "dark" ? "#555" : "#ddd",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TrendChart;
