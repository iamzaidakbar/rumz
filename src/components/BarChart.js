import React from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { roomTypeData } from "../data/dashboardData";
import { motion } from "framer-motion";
import styles from "../styles/BarChart.module.scss";
import { useAppContext } from "../contexts/AppContext";

const BarChart = ({ percentChange = 10 }) => {
  const { theme } = useAppContext();
  return (
    <motion.div
      className={styles.barCard}
      data-theme={theme}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      aria-label="Revenue by Room Type"
    >
      <div className={styles.percent}>+{percentChange}%</div>
      <div className={styles.sublabel}>
        Last Month <span className={styles.green}>+{percentChange}%</span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <ReBarChart
          data={roomTypeData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          barCategoryGap={30}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="value" fill="#b0c4fa" radius={[6, 6, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default BarChart;
