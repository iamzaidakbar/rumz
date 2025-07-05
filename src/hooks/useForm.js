import { useState, useCallback } from "react";

export const useForm = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const setFieldValue = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setIsSubmitting(false);
  }, [initialState]);

  const validateForm = useCallback(
    (validationRules) => {
      const newErrors = {};

      Object.keys(validationRules).forEach((field) => {
        const value = formData[field];
        const rules = validationRules[field];

        if (rules.required && (!value || value.trim() === "")) {
          newErrors[field] = `${field} is required`;
        } else if (rules.email && value && !/\S+@\S+\.\S+/.test(value)) {
          newErrors[field] = "Please enter a valid email address";
        } else if (rules.minLength && value && value.length < rules.minLength) {
          newErrors[
            field
          ] = `${field} must be at least ${rules.minLength} characters`;
        } else if (rules.pattern && value && !rules.pattern.test(value)) {
          newErrors[field] = rules.message || `Invalid ${field} format`;
        }
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    setFieldValue,
    resetForm,
    validateForm,
  };
};
