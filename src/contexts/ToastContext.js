import React, { createContext, useContext, useState, useCallback } from "react";
import { ToastContainer } from "../components/Toast";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children, position = "top-right" }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: "info",
      duration: 5000,
      ...toast,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (title, message, options = {}) => {
      addToast({
        type: "success",
        title,
        message,
        ...options,
      });
    },
    [addToast]
  );

  const error = useCallback(
    (title, message, options = {}) => {
      addToast({
        type: "error",
        title,
        message,
        ...options,
      });
    },
    [addToast]
  );

  const warning = useCallback(
    (title, message, options = {}) => {
      addToast({
        type: "warning",
        title,
        message,
        ...options,
      });
    },
    [addToast]
  );

  const info = useCallback(
    (title, message, options = {}) => {
      addToast({
        type: "info",
        title,
        message,
        ...options,
      });
    },
    [addToast]
  );

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        toasts={toasts}
        position={position}
        onClose={removeToast}
      />
    </ToastContext.Provider>
  );
};
