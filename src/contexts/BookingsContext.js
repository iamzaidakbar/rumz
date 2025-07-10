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
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async ({ refresh = false } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsApi.getBookings({ refresh });
      setBookings(data);
    } catch (error) {
      if (error.message === "Unauthorized. Please sign in again.") {
        // Suppress error UI for unauthorized
        return;
      }
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBookings = useCallback(
    () => fetchBookings({ refresh: true }),
    [fetchBookings]
  );

  const addBooking = useCallback(async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const newBooking = await bookingsApi.addBooking(bookingData);
      refreshBookings(); // Refresh bookings after addingß
      return newBooking;
    } catch (err) {
      setError("Failed to add booking");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBooking = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await bookingsApi.updateBooking(id, updates);
      setBookings((prev) =>
        prev.map((b) => (b.booking_reference_id === id ? updated : b))
      );
      refreshBookings(); // Refresh bookings after updating
      return updated;
    } catch (err) {
      setError("Failed to update booking");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBooking = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await bookingsApi.deleteBooking(id);
      refreshBookings(); // Refresh bookings after deletion
    } catch (err) {
      setError("Failed to delete booking");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBooking = useCallback(async (id, { refresh = false } = {}) => {
    setLoading(true);
    setError(null);
    try {
      return await bookingsApi.getBooking(id, { refresh });
    } catch (err) {
      setError("Failed to fetch booking");
      throw err;
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
    <BookingsContext.Provider
      value={{
        bookings,
        loading,
        error,
        fetchBookings,
        refreshBookings,
        addBooking,
        updateBooking,
        deleteBooking,
        getBooking,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookingsContext = () => useContext(BookingsContext);
