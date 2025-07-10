import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { roomsApi } from "../api/roomsApi";
import { useAppContext } from "./AppContext";

const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const { appData } = useAppContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async ({ refresh = false } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomsApi.getRooms({ refresh });
      setRooms(data);
    } catch (error) {
      if (error.message === "Unauthorized. Please sign in again.") {
        // Suppress error UI for unauthorized
        return;
      }
      setError("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRooms = useCallback(
    () => fetchRooms({ refresh: true }),
    [fetchRooms]
  );

  const addRoom = useCallback(async (roomData) => {
    setLoading(true);
    setError(null);
    try {
      const newRoom = await roomsApi.addRoom(roomData);
      refreshRooms();
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
      refreshRooms();

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
      refreshRooms();
    } catch (err) {
      setError("Failed to delete room");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRoom = useCallback(async (id, { refresh = false } = {}) => {
    setLoading(true);
    setError(null);
    try {
      return await roomsApi.getRoom(id, { refresh });
    } catch (err) {
      setError("Failed to fetch room");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (appData) {
      fetchRooms();
    }
  }, [fetchRooms, appData]);

  return (
    <RoomsContext.Provider
      value={{
        rooms,
        loading,
        error,
        fetchRooms,
        refreshRooms,
        addRoom,
        updateRoom,
        deleteRoom,
        getRoom,
      }}
    >
      {children}
    </RoomsContext.Provider>
  );
};

export const useRoomsContext = () => useContext(RoomsContext);
