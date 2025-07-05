import apiClient, { apiRequest } from "./apiClient";
import { roomsApi } from "./roomsApi";

// Constants
const STORAGE_KEY = "rumz_bookings";
const DELAY_MS = 300;

// Utility functions
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredBookings = async () => {
  try {
    const response = await apiRequest(() => apiClient.get("/api/booking"));
    console.log("Bookings fetched from API:", response);
    return response.bookings || [];
  } catch (error) {
    console.error("Error fetching bookings from API:", error);
    // Fallback to localStorage if API fails
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (localError) {
      console.error("Error reading from localStorage:", localError);
      return [];
    }
  }
};

const saveBookingsToStorage = (bookings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    throw new Error("Failed to save bookings to storage");
  }
};

const generateBookingId = () =>
  `BKNG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const validateBookingData = (booking) => {
  if (!booking) {
    throw new Error("Booking data is required");
  }

  if (!booking.guest_info) {
    throw new Error("Guest information is required");
  }

  if (!booking.booking_details) {
    throw new Error("Booking details are required");
  }

  if (
    !booking.booking_details.room_ids ||
    !Array.isArray(booking.booking_details.room_ids)
  ) {
    throw new Error("Room IDs are required and must be an array");
  }

  return true;
};

const enrichBookingWithRoomNumbers = async (booking) => {
  try {
    const rooms = await roomsApi.getRooms();
    const roomMap = new Map(rooms.map((room) => [room.id, room.roomNumber]));

    const roomNumbers = booking.booking_details.room_ids.map(
      (id) => roomMap.get(id) || "N/A"
    );

    return {
      ...booking.booking_details,
      room_nos: roomNumbers,
    };
  } catch (error) {
    console.error("Error fetching room information:", error);
    return {
      ...booking.booking_details,
      room_nos: booking.booking_details.room_ids.map(() => "N/A"),
    };
  }
};

const createTimestamps = () => {
  const now = new Date().toISOString();
  return { created_at: now, updated_at: now };
};

const updateTimestamp = (existingTimestamps) => {
  return {
    ...existingTimestamps,
    updated_at: new Date().toISOString(),
  };
};

// Main API object
export const bookingsApi = {
  /**
   * Get all bookings
   * @returns {Promise<Array>} Array of bookings
   */
  async getBookings() {
    try {
      await delay(DELAY_MS);
      const bookings = await getStoredBookings();
      return bookings;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw new Error("Failed to fetch bookings");
    }
  },

  /**
   * Get a single booking by ID
   * @param {string} id - Booking reference ID
   * @returns {Promise<Object>} Booking object
   */
  async getBooking(id) {
    try {
      if (!id) {
        throw new Error("Booking ID is required");
      }

      await delay(DELAY_MS);

      // Use backend API to fetch specific booking
      const response = await apiRequest(() =>
        apiClient.get(`/api/booking/${id}`)
      );
      console.log(`Booking ${id} fetched from API:`, response);

      if (!response) {
        throw new Error(`Booking with ID ${id} not found`);
      }

      return response.booking;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Created booking
   */
  async addBooking(bookingData) {
    try {
      validateBookingData(bookingData);

      await delay(DELAY_MS);

      const bookings = await getStoredBookings();
      const enrichedBookingDetails = await enrichBookingWithRoomNumbers(
        bookingData
      );

      const newBooking = {
        ...bookingData,
        booking_reference_id: generateBookingId(),
        booking_details: enrichedBookingDetails,
        timestamps: createTimestamps(),
      };

      bookings.push(newBooking);
      saveBookingsToStorage(bookings);

      return newBooking;
    } catch (error) {
      console.error("Error adding booking:", error);
      throw error;
    }
  },

  /**
   * Update an existing booking
   * @param {string} id - Booking reference ID
   * @param {Object} updates - Updated booking data
   * @returns {Promise<Object>} Updated booking
   */
  async updateBooking(id, updates) {
    try {
      if (!id) {
        throw new Error("Booking ID is required");
      }

      if (!updates || typeof updates !== "object") {
        throw new Error("Updates object is required");
      }

      await delay(DELAY_MS);

      // Use backend API to update booking
      const response = await apiRequest(() =>
        apiClient.put(`/api/booking/${id}`, updates)
      );
      console.log(`Booking ${id} updated via API:`, response);

      if (!response) {
        throw new Error(`Failed to update booking ${id}`);
      }

      return response.booking || response;
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a booking
   * @param {string} id - Booking reference ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteBooking(id) {
    try {
      if (!id) {
        throw new Error("Booking ID is required");
      }

      await delay(DELAY_MS);

      const bookings = await getStoredBookings();
      const initialLength = bookings.length;
      const filteredBookings = bookings.filter(
        (b) => b.booking_reference_id !== id
      );

      if (filteredBookings.length === initialLength) {
        throw new Error(`Booking with ID ${id} not found`);
      }

      saveBookingsToStorage(filteredBookings);
      return true;
    } catch (error) {
      console.error(`Error deleting booking ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get bookings for a specific guest by contact info
   * @param {string} contact - Phone number or email
   * @returns {Promise<Array>} Array of bookings for the guest
   */
  async getBookingsForGuest(contact) {
    try {
      if (!contact) {
        throw new Error("Contact information is required");
      }

      await delay(DELAY_MS);

      const bookings = await getStoredBookings();
      const filteredBookings = bookings.filter(
        (b) =>
          b.guest_info?.phone_number === contact ||
          b.guest_info?.email === contact
      );

      return filteredBookings;
    } catch (error) {
      console.error(`Error fetching bookings for guest ${contact}:`, error);
      throw error;
    }
  },

  /**
   * Get bookings by status
   * @param {string} status - Booking status
   * @returns {Promise<Array>} Array of bookings with the specified status
   */
  async getBookingsByStatus(status) {
    try {
      if (!status) {
        throw new Error("Status is required");
      }

      await delay(DELAY_MS);

      const bookings = await getStoredBookings();
      const filteredBookings = bookings.filter((b) => b.status === status);

      return filteredBookings;
    } catch (error) {
      console.error(`Error fetching bookings by status ${status}:`, error);
      throw error;
    }
  },

  /**
   * Cancel a booking
   * @param {string} id - Booking reference ID
   * @returns {Promise<Object>} Cancelled booking
   */
  async cancelBooking(id) {
    try {
      if (!id) {
        throw new Error("Booking ID is required");
      }

      await delay(DELAY_MS);

      // Use backend API to cancel booking
      const response = await apiRequest(() =>
        apiClient.patch(`/api/booking/${id}/cancel`)
      );
      console.log(`Booking ${id} cancelled via API:`, response);

      if (!response) {
        throw new Error(`Failed to cancel booking ${id}`);
      }

      return response.booking || response;
    } catch (error) {
      console.error(`Error cancelling booking ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search bookings by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching bookings
   */
  async searchBookings(query) {
    try {
      if (!query || typeof query !== "string") {
        throw new Error("Search query is required");
      }

      await delay(DELAY_MS);

      const bookings = await getStoredBookings();
      const searchTerm = query.toLowerCase();

      const filteredBookings = bookings.filter(
        (b) =>
          b.guest_info?.name?.toLowerCase().includes(searchTerm) ||
          b.guest_info?.phone_number?.includes(searchTerm) ||
          b.guest_info?.email?.toLowerCase().includes(searchTerm) ||
          b.booking_reference_id?.toLowerCase().includes(searchTerm)
      );

      return filteredBookings;
    } catch (error) {
      console.error(`Error searching bookings with query ${query}:`, error);
      throw error;
    }
  },
};
