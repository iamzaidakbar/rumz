// src/pages/dashboardData.js
// Mock API-style data for Dashboard

export const metrics = [
  { label: "Bookings", value: 120, change: 15 },
  { label: "Revenue", value: 15000, change: 10 },
  { label: "Occupancy Rate", value: 75, change: 0 },
];

export const bookingsTrend = [
  { month: "Jan", value: 30 },
  { month: "Feb", value: 40 },
  { month: "Mar", value: 35 },
  { month: "Apr", value: 50 },
  { month: "May", value: 45 },
  { month: "Jun", value: 60 },
  { month: "Jul", value: 55 },
];

export const revenueTrend = [
  { month: "Jan", value: 12000 },
  { month: "Feb", value: 15000 },
  { month: "Mar", value: 10000 },
  { month: "Apr", value: 17000 },
];

export const roomTypeData = [
  { name: "Standard", value: 40 },
  { name: "Deluxe", value: 60 },
  { name: "Suite", value: 80 },
  { name: "Penthouse", value: 50 },
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
