import React from "react";
import styles from "../styles/Layout.module.scss";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAppContext } from "../contexts/AppContext";

// Main layout for the app, includes Sidebar
const Layout = ({ children }) => {
  const { theme } = useAppContext();

  return (
    <div className={styles.layout} data-theme={theme}>
      <Topbar />
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default Layout;
