import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { bookingsApi } from "../api/bookingsApi";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    bookingsApi.getBookings().then((data) => {
      const mapped = data.map((b) => {
        // Compose room info: prefer room_ids, fallback to roomType
        let roomInfo = "";
        if (
          b.booking_details?.room_ids &&
          b.booking_details.room_ids.length > 0
        ) {
          roomInfo = b.booking_details.room_ids.join(", ");
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
        {booking?.booking_details?.room_ids && (
          <div>
            <strong>Rooms:</strong>{" "}
            {booking.booking_details.room_ids.join(", ")}
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

  return (
    <div style={{ position: "relative" }}>
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
      />
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
            }}
          />
        </Tippy>
      )}
    </div>
  );
};

export default Calendar;
