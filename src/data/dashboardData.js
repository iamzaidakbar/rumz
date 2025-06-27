// src/data/dashboardData.js
// Mock API-style data for Dashboard

export const metrics = [
  { label: "Total Revenue", value: "£45,231", change: "+4.2%" },
  { label: "Occupancy Rate", value: "82%", change: "-1.5%" },
  { label: "Available Rooms", value: "28", change: "" },
  { label: "Total Bookings", value: "124", change: "+8.0%" },
];

export const revenueTrend = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
];

export const roomTypeData = [
  { name: "Standard", value: 400 },
  { name: "Deluxe", value: 300 },
  { name: "Suite", value: 200 },
  { name: "Penthouse", value: 100 },
];

export const guestSources = [
  { name: "Direct", value: 45 },
  { name: "OTA", value: 35 },
  { name: "Corporate", value: 20 },
];

export const percentChange = 15;
export const barPercentChange = 10;

export const bookings = [
  { date: "2024-07-05", guest: "John Doe", room: "Deluxe" },
  { date: "2024-07-05", guest: "Jane Smith", room: "Suite" },
  { date: "2024-07-12", guest: "Alice Brown", room: "Standard" },
  { date: "2024-07-18", guest: "Bob Lee", room: "Penthouse" },
  { date: "2024-07-21", guest: "Chris Green", room: "Deluxe" },
  { date: "2024-08-03", guest: "Diana Prince", room: "Suite" },
  { date: "2024-08-11", guest: "Eve Black", room: "Standard" },
  { date: "2024-08-15", guest: "Frank White", room: "Deluxe" },
  { date: "2024-08-22", guest: "Grace Hopper", room: "Penthouse" },
];
