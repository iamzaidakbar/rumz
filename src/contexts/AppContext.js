import React, { createContext, useState, useContext, useEffect } from "react";
import { validateToken } from "../api/authApi";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load hotel from localStorage if present
  const getInitialHotel = () => {
    try {
      const hotel = localStorage.getItem("hotel");
      if (hotel) return JSON.parse(hotel);
    } catch {}
    return null;
  };

  const [appData, setAppData] = useState(getInitialHotel());
  const [theme, setTheme] = useState("light");
  const [isInitializing, setIsInitializing] = useState(true);

  // Validate token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const hotel = localStorage.getItem("hotel");

      if (token && hotel) {
        try {
          const validationResult = await validateToken(token);
          if (validationResult.valid && validationResult.hotel) {
            setAppData(validationResult.hotel);
            localStorage.setItem(
              "hotel",
              JSON.stringify(validationResult.hotel)
            );
          } else {
            // Token is invalid, clear everything
            localStorage.removeItem("token");
            localStorage.removeItem("hotel");
            setAppData(null);
          }
        } catch (error) {
          console.error("Token validation error:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("hotel");
          setAppData(null);
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    // Keep appData in sync with localStorage changes (e.g., login/logout)
    const handleStorage = () => {
      const hotel = localStorage.getItem("hotel");
      setAppData(hotel ? JSON.parse(hotel) : null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Don't render children until initialization is complete
  if (isInitializing) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Initializing...
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, appData, setAppData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
