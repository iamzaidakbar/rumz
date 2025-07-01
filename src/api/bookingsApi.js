import { roomsApi } from "./roomsApi";

const STORAGE_KEY = "rumz_bookings";

const getInitialBookings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return [];
};

const saveBookings = (bookings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

export const bookingsApi = {
  async getBookings() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getInitialBookings());
      }, 300);
    });
  },

  async getBooking(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const booking = getInitialBookings().find(
          (b) => b.booking_reference_id === id
        );
        if (booking) {
          resolve(booking);
        } else {
          reject(new Error("Booking not found"));
        }
      }, 300);
    });
  },

  async addBooking(booking) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const bookings = getInitialBookings();
          const rooms = await roomsApi.getRooms();
          const roomMap = new Map(
            rooms.map((room) => [room.id, room.roomNumber])
          );

          const room_nos = booking.booking_details.room_ids.map(
            (id) => roomMap.get(id) || "N/A"
          );

          const now = new Date().toISOString();
          const newBooking = {
            ...booking,
            booking_reference_id: `BKNG-${Date.now()}`,
            booking_details: {
              ...booking.booking_details,
              room_nos,
            },
            timestamps: { created_at: now, updated_at: now },
          };

          bookings.push(newBooking);
          saveBookings(bookings);
          resolve(newBooking);
        } catch (error) {
          console.error("Failed to add booking:", error);
          reject(error);
        }
      }, 300);
    });
  },

  async updateBooking(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let bookings = getInitialBookings();
        bookings = bookings.map((b) =>
          b.booking_reference_id === id
            ? {
                ...b,
                ...updates,
                "timestamps.updated_at": new Date().toISOString(),
              }
            : b
        );
        saveBookings(bookings);
        resolve(bookings.find((b) => b.booking_reference_id === id));
      }, 300);
    });
  },

  async deleteBooking(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let bookings = getInitialBookings();
        bookings = bookings.filter((b) => b.booking_reference_id !== id);
        saveBookings(bookings);
        resolve(true);
      }, 300);
    });
  },

  async getBookingsForGuest(contact) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookings = getInitialBookings();
        const filtered = bookings.filter(
          (b) =>
            b.guest_info.phone_number === contact ||
            b.guest_info.email === contact
        );
        resolve(filtered);
      }, 300);
    });
  },
};
