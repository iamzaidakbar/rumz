import React, { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import LoadingFallback from "./components/LoadingFallback";
import "./styles/App.module.scss";

// Lazy load pages for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Booking = lazy(() => import("./pages/Booking"));
const Guests = lazy(() => import("./pages/Guests"));
const Rooms = lazy(() => import("./pages/Rooms"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Define routes using createBrowserRouter, all wrapped in Layout
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/booking", element: <Booking /> },
      { path: "/guests", element: <Guests /> },
      { path: "/rooms", element: <Rooms /> },
      { path: "/settings", element: <Settings /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    // Suspense fallback for lazy-loaded routes
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
