import React from "react";
import { useParams } from "react-router-dom";

const EditBooking = () => {
  const { bookingId } = useParams();
  return (
    <div>
      <h1>Edit Booking</h1>
      <p>Form to edit booking ID: {bookingId} will be here.</p>
    </div>
  );
};

export default EditBooking;
