import React, { createContext, useState, useContext } from "react";
import { ownerDetails as initialOwnerDetails } from "../data/owner";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [appData, setAppData] = useState(initialOwnerDetails);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const updateAppData = (newDetails) => {
    setAppData(newDetails);
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, appData, updateAppData }}>
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
