import React, { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import LoadingFallback from "./components/LoadingFallback";
import "./styles/App.module.scss";
import EditRoom from "./pages/EditRoom";
import RoomDetail from "./pages/RoomDetail";
import AddBooking from "./pages/AddBooking";
import BookingDetail from "./pages/BookingDetail";
import EditBooking from "./pages/EditBooking";
import NotFound from "./pages/NotFound";

// Lazy load pages for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Rooms = lazy(() => import("./pages/Rooms"));
const Booking = lazy(() => import("./pages/Booking"));
const Guests = lazy(() => import("./pages/Guests"));
const Settings = lazy(() => import("./pages/Settings"));
const Owner = lazy(() => import("./pages/Owner"));
const AddRoom = lazy(() => import("./pages/AddRoom"));

function App() {
  return (
    <AppProvider>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/add" element={<AddRoom />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/owner" element={<Owner />} />
            <Route path="/rooms/:roomId" element={<RoomDetail />} />
            <Route path="/rooms/:roomId/edit" element={<EditRoom />} />
            <Route path="/bookings/add" element={<AddBooking />} />
            <Route path="/bookings/:bookingId" element={<BookingDetail />} />
            <Route path="/bookings/:bookingId/edit" element={<EditBooking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </AppProvider>
  );
}

export default App;
