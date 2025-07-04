import React, { createContext, useState, useContext, useEffect } from "react";

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
