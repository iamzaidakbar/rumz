import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { bookingsApi } from "../api/bookingsApi";
import { useAppContext } from "./AppContext";

const BookingsContext = createContext();

export const BookingsProvider = ({ children }) => {
  const { appData } = useAppContext();
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
    if (appData) {
      fetchBookings();
    }
  }, [fetchBookings, appData]);

  return (
    <BookingsContext.Provider value={{ bookings, loading, fetchBookings }}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookingsContext = () => useContext(BookingsContext);
