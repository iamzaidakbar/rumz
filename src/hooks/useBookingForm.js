import { useState, useCallback } from "react";

export function useBookingForm(initialData) {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = useCallback((section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }, []);

  const handleAddressChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      guest_info: {
        ...prev.guest_info,
        address: {
          ...prev.guest_info.address,
          [field]: value,
        },
      },
    }));
  }, []);

  const handleRoomSelect = useCallback((selectedRoomIds, rooms) => {
    const selectedRooms = rooms.filter((room) =>
      selectedRoomIds.includes(room.id)
    );
    const roomNos = selectedRooms.map((room) => room.roomNumber);
    setFormData((prev) => ({
      ...prev,
      booking_details: {
        ...prev.booking_details,
        room_ids: selectedRoomIds,
        room_nos: roomNos,
      },
    }));
  }, []);

  // Simple validation (expand as needed)
  const validate = useCallback(() => {
    const { guest_info, booking_details, payment_info } = formData;
    if (!guest_info.full_name || !guest_info.phone_number || !guest_info.email)
      return false;
    if (!booking_details.room_ids || booking_details.room_ids.length === 0)
      return false;
    if (!booking_details.check_in_date || !booking_details.check_out_date)
      return false;
    if (!payment_info.amount || !payment_info.payment_method) return false;
    return true;
  }, [formData]);

  return {
    formData,
    setFormData,
    handleInputChange,
    handleAddressChange,
    handleRoomSelect,
    validate,
  };
}
