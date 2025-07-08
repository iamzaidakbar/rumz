import React from "react";
import { Line } from "react-chartjs-2";
import styles from "../styles/TrendChart.module.scss";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useAppContext } from "../contexts/AppContext";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const TrendChart = ({ data }) => {
  const { theme } = useAppContext();
  // Map data to all months, fill missing with null for gaps
  const revenueByMonth = MONTHS.map((month) => {
    const found = data.find(
      (d) => d.month === month || d.month === month.slice(0, 3)
    );
    return found ? found.revenue : null;
  });
  // Color palette for light/dark
  const isDark = theme === "dark";
  const axisColor = isDark ? "#e5e7eb" : "#222";
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const tooltipBg = isDark ? "#23272f" : "#fff";
  const tooltipText = isDark ? "#f3f4f6" : "#222";
  const borderColor = "#36c2cf";
  const chartData = {
    labels: MONTHS,
    datasets: [
      {
        label: "",
        data: revenueByMonth,
        borderColor,
        backgroundColor: borderColor,
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          boxWidth: 24,
          font: { size: 14, weight: 400 },
          color: axisColor,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: tooltipBg,
        borderColor: borderColor,
        borderWidth: 1,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        titleFont: { weight: "bold", size: 15 },
        bodyFont: { weight: "bold", size: 15 },
        callbacks: {
          title: (items) => {
            // Show the month as the title
            return items[0].label;
          },
          label: (ctx) => {
            // Show 'Revenue: ₹value' in bold
            return `Revenue: ₹${ctx.parsed.y?.toLocaleString()}`;
          },
        },
        displayColors: false,
        padding: 14,
        caretSize: 7,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: { display: true, color: gridColor },
        ticks: {
          font: { size: 13 },
          color: axisColor,
        },
      },
      y: {
        grid: { display: true, color: gridColor },
        beginAtZero: false,
        ticks: {
          font: { size: 13 },
          color: axisColor,
        },
      },
    },
  };
  return (
    <section data-theme={theme} aria-label="Ongoing Bookings">
      <Line data={chartData} options={options} height={400} />
    </section>
  );
};

export default TrendChart;
