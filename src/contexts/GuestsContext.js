import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { guestsApi } from "../api/guestsApi";
import { useAppContext } from "./AppContext";

const GuestsContext = createContext();

export const GuestsProvider = ({ children }) => {
  const { appData } = useAppContext();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGuests = useCallback(async ({ refresh = false } = {}) => {
    setLoading(true);
    try {
      const data = await guestsApi.getGuests({ refresh });
      setGuests(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (appData) {
      fetchGuests();
    }
  }, [fetchGuests]);

  return (
    <GuestsContext.Provider value={{ guests, loading, fetchGuests }}>
      {children}
    </GuestsContext.Provider>
  );
};

export const useGuestsContext = () => useContext(GuestsContext);
