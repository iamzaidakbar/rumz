const STORAGE_KEY = "rumz_bookings";

const getInitialBookings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return [
    {
      booking_reference_id: "BKNG-20250630-0001",
      guest_info: {
        full_name: "Zaid Akbar Wani",
        phone_number: "+91-9876543210",
        email: "zaid@example.com",
        address: {
          street: "Khayam Chowk",
          city: "Srinagar",
          state: "Jammu and Kashmir",
          pin_code: "190001",
          country: "India",
        },
      },
      id_proof: {
        id_type: "Aadhar Card",
        id_number: "1234-5678-9012",
        id_issue_country: "India",
        id_image_front_url: "https://example.com/id_front.jpg",
        id_image_back_url: "https://example.com/id_back.jpg",
      },
      booking_details: {
        room_ids: ["R1751270744223", "R1751272747337"],
        room_nos: ["201", "202"],
        room_type: "Deluxe Double Room",
        check_in_date: "2025-07-01",
        check_out_date: "2025-07-05",
        number_of_guests: 4,
        number_of_rooms: 2,
        special_requests: "Prefer Dal Lake View, early check-in if possible",
      },
      referral: {
        referred_by_name: "Rajan Kumar",
        referred_by_contact: "+91-9871234567",
      },
      payment_info: {
        amount: 4999,
        payment_method: "UPI",
        payment_status: "Paid",
        transaction_id: "TXN-UPI-7890",
      },
      status: {
        booking_status: "Confirmed",
      },
      timestamps: {
        created_at: "2025-06-30T11:30:00Z",
        updated_at: "2025-06-30T11:30:00Z",
      },
    },
    {
      booking_reference_id: "BKNG-20250628-0002",
      guest_info: {
        full_name: "Jane Smith",
        phone_number: "+1-555-123-4567",
        email: "jane.smith@example.com",
        address: {
          street: "123 Main St",
          city: "Anytown",
          state: "CA",
          pin_code: "12345",
          country: "USA",
        },
      },
      id_proof: {
        id_type: "Passport",
        id_number: "A1B2C3D4",
        id_issue_country: "USA",
        id_image_front_url: "https://example.com/id_front.jpg",
        id_image_back_url: "https://example.com/id_back.jpg",
      },
      booking_details: {
        room_ids: ["STD-101"],
        room_nos: ["301", "302"],
        room_type: "Standard Single",
        check_in_date: "2025-08-10",
        check_out_date: "2025-08-12",
        number_of_guests: 1,
        number_of_rooms: 1,
        special_requests: "",
      },
      referral: {
        referred_by_name: "",
        referred_by_contact: "",
      },
      payment_info: {
        amount: 350,
        payment_method: "Credit Card",
        payment_status: "Pending",
        transaction_id: "TXN-CC-1234",
      },
      status: {
        booking_status: "Pending",
      },
      timestamps: {
        created_at: "2025-06-28T09:00:00Z",
        updated_at: "2025-06-28T09:00:00Z",
      },
    },
  ];
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
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookings = getInitialBookings();
        const now = new Date().toISOString();
        const newBooking = {
          ...booking,
          booking_reference_id: `BKNG-${Date.now()}`,
          timestamps: { created_at: now, updated_at: now },
        };
        bookings.push(newBooking);
        saveBookings(bookings);
        resolve(newBooking);
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
};
