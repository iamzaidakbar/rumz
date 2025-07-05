import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const PrivateRoute = ({ children }) => {
  const { appData } = useAppContext();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Check if user is authenticated
  if (!token || !appData) {
    // Redirect to login with return url
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
