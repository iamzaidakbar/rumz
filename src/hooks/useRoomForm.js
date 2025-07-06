import { useState, useRef, useCallback } from "react";
import { cloudinaryApi } from "../api/cloudinaryApi";

export function useRoomForm({
  initialData,
  onSuccess,
  onError,
  amenitiesList = [],
}) {
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef();

  // Input change handler
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, value]
          : prev.amenities.filter((a) => a !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Dropdown change handler
  const handleDropdownChange = useCallback(
    (name) => (value) => {
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Photo upload handlers
  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoError("");
    setPhotoUploading(true);
    try {
      const urls = await cloudinaryApi.uploadImages([file]);
      setForm((prev) => ({ ...prev, photo: urls[0] }));
      onSuccess && onSuccess("Photo uploaded!", "");
    } catch (err) {
      setPhotoError("Failed to upload photo.");
      onError && onError("Failed to upload photo.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const handlePhotoDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setPhotoError("");
    setPhotoUploading(true);
    try {
      const urls = await cloudinaryApi.uploadImages([file]);
      setForm((prev) => ({ ...prev, photo: urls[0] }));
      onSuccess && onSuccess("Photo uploaded!", "");
    } catch (err) {
      setPhotoError("Failed to upload photo.");
      onError && onError("Failed to upload photo.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    setForm((prev) => ({ ...prev, photo: "" }));
  };

  // Validation
  const validate = useCallback(() => {
    if (!form.roomNumber || !form.roomNumber.trim()) return false;
    if (!form.status) return false;
    // Add more validation as needed
    return true;
  }, [form]);

  return {
    form,
    setForm,
    saving,
    setSaving,
    error,
    setError,
    photoUploading,
    setPhotoUploading,
    photoError,
    setPhotoError,
    fileInputRef,
    handleChange,
    handleDropdownChange,
    handlePhotoSelect,
    handlePhotoDrop,
    handlePhotoClick,
    handleRemovePhoto,
    validate,
  };
}
