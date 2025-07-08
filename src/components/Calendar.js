import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { bookingsApi } from "../api/bookingsApi";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useAppContext } from "../contexts/AppContext";
import LoadingFallback from "./LoadingFallback";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, event: null });
  const { theme } = useAppContext();

  useEffect(() => {
    setLoading(true);
    bookingsApi.getBookings().then((data) => {
      const mapped = data.map((b) => {
        // Compose room info: prefer room_nos, fallback to roomType
        let roomInfo = "";
        if (
          b.booking_details?.room_nos &&
          b.booking_details.room_nos.length > 0
        ) {
          roomInfo = b.booking_details.room_nos.join(", ");
        } else if (b.booking_details?.room_type) {
          roomInfo = b.booking_details.room_type;
        } else if (b.roomType) {
          roomInfo = b.roomType;
        }
        const title = `${
          b.guest_info?.full_name ||
          b.guestName ||
          b.booking_reference_id ||
          "Booking"
        }${roomInfo ? ` (${roomInfo})` : ""}`;
        return {
          title,
          start: b.booking_details?.check_in_date || b.checkIn,
          end: b.booking_details?.check_out_date || b.checkOut,
          allDay: true,
          extendedProps: {
            guest: b.guest_info || { name: b.guestName },
            booking: b,
          },
        };
      });
      setEvents(mapped);
      setLoading(false);
    });
  }, []);

  // Tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  // Helper to render guest details
  const renderGuestDetails = (guest, booking) => {
    if (!guest) return null;
    return (
      <div style={{ minWidth: 200 }}>
        <div>
          <strong>Name:</strong> {guest.full_name || guest.name}
        </div>
        {guest.email && (
          <div>
            <strong>Email:</strong> {guest.email}
          </div>
        )}
        {guest.phone && (
          <div>
            <strong>Phone:</strong> {guest.phone}
          </div>
        )}
        {booking?.booking_reference_id && (
          <div>
            <strong>Booking Ref:</strong> {booking.booking_reference_id}
          </div>
        )}
        {booking?.booking_details?.room_nos && (
          <div>
            <strong>Rooms:</strong>{" "}
            {booking.booking_details.room_nos.join(", ")}
          </div>
        )}
        {booking?.booking_details?.room_type && (
          <div>
            <strong>Room Type:</strong> {booking.booking_details.room_type}
          </div>
        )}
        {booking?.booking_details?.check_in_date && (
          <div>
            <strong>Check-in:</strong> {booking.booking_details.check_in_date}
          </div>
        )}
        {booking?.booking_details?.check_out_date && (
          <div>
            <strong>Check-out:</strong> {booking.booking_details.check_out_date}
          </div>
        )}
      </div>
    );
  };

  // Event handlers for tooltip
  const handleEventMouseEnter = (info) => {
    const { guest, booking } = info.event.extendedProps;
    setTooltip({
      visible: true,
      content: renderGuestDetails(guest, booking),
      x: info.jsEvent.clientX,
      y: info.jsEvent.clientY,
    });
  };
  const handleEventMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  // Event click handler for modal
  const handleEventClick = (info) => {
    setModal({ open: true, event: info.event });
  };
  const closeModal = () => setModal({ open: false, event: null });

  // Highlight today style
  const todayStyle =
    theme === "dark"
      ? { background: "#374151", color: "#fff", borderRadius: 6 }
      : { background: "#f3f4f6", color: "#222", borderRadius: 6 };

  if (loading) return <LoadingFallback />;

  return (
    <div
      style={{
        position: "relative",
        background: theme === "dark" ? "#23272f" : undefined,
        color: theme === "dark" ? "#f3f4f6" : undefined,
        minHeight: 400,
      }}
    >
      <div>
        <h2>Calendar View</h2>
        <p>Revenue trend for the current year</p>
      </div>
      {events.length === 0 ? (
        <div style={{ textAlign: "center", margin: "2rem 0", fontSize: 18 }}>
          No bookings or events to display.
        </div>
      ) : (
        <FullCalendar
          plugins={[multiMonthPlugin, dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          duration={{ years: 1 }}
          multiMonthMaxColumns={3}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,dayGridMonth,multiMonthYear",
          }}
          views={{
            timeGridWeek: { buttonText: "Week" },
            dayGridMonth: { buttonText: "Month" },
            multiMonthYear: { buttonText: "Year" },
          }}
          events={events}
          eventMouseEnter={handleEventMouseEnter}
          eventMouseLeave={handleEventMouseLeave}
          eventClick={handleEventClick}
          themeSystem={theme === "dark" ? "standard" : undefined}
          className={theme === "dark" ? "fc-dark" : undefined}
          dayCellContent={(arg) => {
            // Highlight today
            const isToday = arg.isToday;
            return (
              <div style={isToday ? todayStyle : {}}>{arg.dayNumberText}</div>
            );
          }}
        />
      )}
      {tooltip.visible && (
        <Tippy
          content={tooltip.content}
          visible={true}
          interactive={true}
          placement="right"
          getReferenceClientRect={() => ({
            width: 0,
            height: 0,
            top: tooltip.y,
            bottom: tooltip.y,
            left: tooltip.x,
            right: tooltip.x,
          })}
        >
          <span
            style={{
              position: "fixed",
              left: tooltip.x,
              top: tooltip.y,
              pointerEvents: "none",
              background: theme === "dark" ? "#23272f" : "#fff",
              color: theme === "dark" ? "#f3f4f6" : "#222",
              border: "1px solid #36c2cf",
              borderRadius: "8px",
              padding: "10px 14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              zIndex: 9999,
            }}
          />
        </Tippy>
      )}
      {/* Modal for event details */}
      {modal.open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.35)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: theme === "dark" ? "#23272f" : "#fff",
              color: theme === "dark" ? "#f3f4f6" : "#222",
              borderRadius: 12,
              minWidth: 320,
              maxWidth: 400,
              padding: 28,
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "none",
                border: "none",
                color: theme === "dark" ? "#f3f4f6" : "#222",
                fontSize: 22,
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>
              {modal.event.title}
            </h3>
            {renderGuestDetails(
              modal.event.extendedProps.guest,
              modal.event.extendedProps.booking
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
