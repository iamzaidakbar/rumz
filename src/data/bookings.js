// Get today's date in YYYY-MM-DD format
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const todayStr = `${yyyy}-${mm}-${dd}`;

// 3 days from today
const future = new Date(today);
future.setDate(today.getDate() + 3);
const fyyyy = future.getFullYear();
const fmm = String(future.getMonth() + 1).padStart(2, "0");
const fdd = String(future.getDate()).padStart(2, "0");
const futureStr = `${fyyyy}-${fmm}-${fdd}`;

export const bookings = [
  // Ongoing bookings (today is between checkIn and checkOut)
  {
    bookingId: "#20001",
    guestName: "Mia Turner",
    checkIn: todayStr,
    checkOut: futureStr,
    roomType: "Deluxe Suite",
    status: "Confirmed",
  },
  {
    bookingId: "#20002",
    guestName: "Lucas Kim",
    checkIn: todayStr,
    checkOut: futureStr,
    roomType: "Standard Room",
    status: "Pending",
  },
  // Other bookings
  {
    bookingId: "#12345",
    guestName: "Ethan Harper",
    checkIn: "2024-07-15",
    checkOut: "2024-07-20",
    roomType: "Deluxe Suite",
    status: "Confirmed",
  },
  {
    bookingId: "#12346",
    guestName: "Olivia Bennett",
    checkIn: "2024-07-22",
    checkOut: "2024-07-25",
    roomType: "Standard Room",
    status: "Pending",
  },
  {
    bookingId: "#12347",
    guestName: "Noah Carter",
    checkIn: "2024-08-01",
    checkOut: "2024-08-05",
    roomType: "Family Room",
    status: "Confirmed",
  },
  {
    bookingId: "#12348",
    guestName: "Ava Morgan",
    checkIn: "2024-08-10",
    checkOut: "2024-08-15",
    roomType: "Deluxe Suite",
    status: "Cancelled",
  },
  {
    bookingId: "#12349",
    guestName: "Liam Foster",
    checkIn: "2024-08-20",
    checkOut: "2024-08-25",
    roomType: "Standard Room",
    status: "Confirmed",
  },
  {
    bookingId: "#12344",
    guestName: "Sophia Lee",
    checkIn: "2024-06-10",
    checkOut: "2024-06-15",
    roomType: "Suite",
    status: "Confirmed",
  },
];
