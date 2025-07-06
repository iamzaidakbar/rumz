import { useState, useCallback } from "react";
import { bookingsApi } from "../api/bookingsApi";

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsApi.getBookings();
      setBookings(data);
    } catch (err) {
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  const addBooking = useCallback(async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const newBooking = await bookingsApi.addBooking(bookingData);
      setBookings((prev) => [...prev, newBooking]);
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
      setBookings((prev) => prev.filter((b) => b.booking_reference_id !== id));
    } catch (err) {
      setError("Failed to delete booking");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBooking = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await bookingsApi.getBooking(id);
    } catch (err) {
      setError("Failed to fetch booking");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    addBooking,
    updateBooking,
    deleteBooking,
    getBooking,
  };
}
