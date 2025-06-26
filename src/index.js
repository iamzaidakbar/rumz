import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Wrap with ThemeProvider for global theme state */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
