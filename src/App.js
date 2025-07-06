import React, { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { ToastProvider } from "./contexts/ToastContext";
import LoadingFallback from "./components/LoadingFallback";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/App.module.scss";
import EditRoom from "./pages/EditRoom";
import RoomDetail from "./pages/RoomDetail";
import AddBooking from "./pages/AddBooking";
import BookingDetail from "./pages/BookingDetail";
import EditBooking from "./pages/EditBooking";
import NotFound from "./pages/NotFound";
import Booking from "./pages/Booking";
import Guests from "./pages/Guests";
import Rooms from "./pages/Rooms";
import AddRoom from "./pages/AddRoom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ToastDemo from "./components/ToastDemo";

// Lazy load pages for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const Owner = lazy(() => import("./pages/Owner"));

function App() {
  return (
    <AppProvider>
      <ToastProvider position="top-right">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/rooms" element={<Rooms />} />
                      <Route path="/rooms/add" element={<AddRoom />} />
                      <Route path="/booking" element={<Booking />} />
                      <Route path="/guests" element={<Guests />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/owner" element={<Owner />} />
                      <Route path="/rooms/:roomId" element={<RoomDetail />} />
                      <Route
                        path="/rooms/:roomId/edit"
                        element={<EditRoom />}
                      />
                      <Route path="/bookings" element={<Booking />} />
                      <Route path="/bookings/add" element={<AddBooking />} />
                      <Route
                        path="bookings/:bookingId"
                        element={<BookingDetail />}
                      />
                      <Route
                        path="bookings/:bookingId/edit"
                        element={<EditBooking />}
                      />
                      <Route path="/toast-demo" element={<ToastDemo />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
