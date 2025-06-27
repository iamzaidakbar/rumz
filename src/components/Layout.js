import React from "react";
import { useAppContext } from "../contexts/AppContext";
import Sidebar from "./Sidebar";
import styles from "../styles/Layout.module.scss";

// Main layout for the app, includes Sidebar
const Layout = ({ children }) => {
  const { theme } = useAppContext();
  return (
    <div className={styles.layout} data-theme={theme}>
      <Sidebar />
      <main style={{ width: "100%" }} className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
