import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./contexts/AppContext";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
