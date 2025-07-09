import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { bookingsApi } from "../api/bookingsApi";

const BookingsContext = createContext();

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async ({ refresh = false } = {}) => {
    setLoading(true);
    try {
      const data = await bookingsApi.getBookings({ refresh });
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <BookingsContext.Provider value={{ bookings, loading, fetchBookings }}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookingsContext = () => useContext(BookingsContext);
