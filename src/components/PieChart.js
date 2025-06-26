import React from "react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { guestSources } from "../pages/dashboardData";
import { motion } from "framer-motion";
import styles from "../styles/BarChart.module.scss";

const COLORS = ["#0056d6", "#00bcd4", "#ff9800"];

const PieChart = () => (
  <motion.div
    className={styles.pieChart}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    aria-label="Guest Sources Pie Chart"
  >
    <ResponsiveContainer width="100%" height={250}>
      <RePieChart>
        <Pie
          data={guestSources}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {guestSources.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RePieChart>
    </ResponsiveContainer>
  </motion.div>
);

export default PieChart;
