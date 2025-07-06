import { useState, useCallback } from "react";
import { roomsApi } from "../api/roomsApi";

export function useRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomsApi.getRooms();
      setRooms(data);
    } catch (err) {
      setError("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  const addRoom = useCallback(async (roomData) => {
    setLoading(true);
    setError(null);
    try {
      const newRoom = await roomsApi.addRoom(roomData);
      setRooms((prev) => [...prev, newRoom]);
      return newRoom;
    } catch (err) {
      setError("Failed to add room");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRoom = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await roomsApi.updateRoom(id, updates);
      setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)));
      return updated;
    } catch (err) {
      setError("Failed to update room");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRoom = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await roomsApi.deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError("Failed to delete room");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRoom = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await roomsApi.getRoom(id);
    } catch (err) {
      setError("Failed to fetch room");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    addRoom,
    updateRoom,
    deleteRoom,
    getRoom,
  };
}
