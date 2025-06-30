import React from "react";
import styles from "../styles/Layout.module.scss";
import Sidebar from "./Sidebar";
import { useAppContext } from "../contexts/AppContext";

// Main layout for the app, includes Sidebar
const Layout = ({ children }) => {
  const { theme } = useAppContext();

  return (
    <div className={styles.layout} data-theme={theme}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default Layout;
