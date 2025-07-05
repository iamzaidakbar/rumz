import { useState, useEffect } from "react";
import { fetchRooms } from "../api/roomsApi";

export function useRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    fetchRooms()
      .then((data) => {
        if (isMounted) setRooms(data);
      })
      .catch((err) => {
        if (isMounted) setError("Could not load rooms");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { rooms, loading, error };
}
