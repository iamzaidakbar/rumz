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

  const fetchRooms = useCallback(async ({ refresh = false } = {}) => {
    setLoading(true);
    try {
      const data = await roomsApi.getRooms({ refresh });
      setRooms(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (appData) {
      fetchRooms();
    }
  }, [fetchRooms]);

  return (
    <RoomsContext.Provider value={{ rooms, loading, fetchRooms }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRoomsContext = () => useContext(RoomsContext);
