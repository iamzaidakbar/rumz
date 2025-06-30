import React from "react";
import { useParams } from "react-router-dom";

const BookingDetail = () => {
  const { bookingId } = useParams();
  return (
    <div>
      <h1>Booking Detail</h1>
      <p>Details for booking ID: {bookingId} will be shown here.</p>
    </div>
  );
};

export default BookingDetail;
