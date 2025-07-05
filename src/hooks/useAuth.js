import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { hotelsApi } from "../api/hotelsApi";
import { toast } from "react-toastify";

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

          toast.success("Login successful! Redirecting...", {
            position: "top-center",
          });

          return response;
        }

        throw new Error("Invalid login response");
      } catch (error) {
        toast.error(error.message || "Failed to login", {
          position: "top-center",
        });
        throw error;
      }
    },
    [setAppData]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("hotel");
    setAppData(null);

    toast.success("Logged out successfully!", {
      position: "top-center",
    });

    navigate("/signin", { replace: true });
  }, [setAppData, navigate]);

  const register = useCallback(async (hotelData) => {
    try {
      const response = await hotelsApi.registerHotel(hotelData);

      toast.success("Registration successful! Please login.", {
        position: "top-center",
      });

      return response;
    } catch (error) {
      toast.error(error.message || "Failed to register", {
        position: "top-center",
      });
      throw error;
    }
  }, []);

  return {
    login,
    logout,
    register,
  };
};
