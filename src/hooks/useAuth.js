import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { hotelsApi } from "../api/hotelsApi";

export const useAuth = () => {
  const { setAppData } = useAppContext();
  const navigate = useNavigate();

  const login = useCallback(
    async (credentials) => {
      try {
        const response = await hotelsApi.loginHotel(credentials);

        if (response?.token && response?.hotel) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("hotel", JSON.stringify(response.hotel));
          setAppData(response.hotel);

          return response;
        }

        throw new Error("Invalid login response");
      } catch (error) {
        throw error;
      }
    },
    [setAppData]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("hotel");
    setAppData(null);

    navigate("/signin", { replace: true });
  }, [setAppData, navigate]);

  const register = useCallback(async (hotelData) => {
    try {
      const response = await hotelsApi.registerHotel(hotelData);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    login,
    logout,
    register,
  };
};
