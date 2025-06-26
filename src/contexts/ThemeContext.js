import React, { createContext, useContext, useState } from "react";

// Create ThemeContext
const ThemeContext = createContext();

// Custom hook to use ThemeContext
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider to wrap the app
export const ThemeProvider = ({ children }) => {
  // State for theme, default to 'light'
  const [theme, setTheme] = useState("light");

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Context value
  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
