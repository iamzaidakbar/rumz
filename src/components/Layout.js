import React from "react";
import Sidebar from "./Sidebar";
import styles from "../styles/Layout.module.scss";
import { Outlet } from "react-router-dom";

// Layout component with Sidebar and main content
const Layout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
