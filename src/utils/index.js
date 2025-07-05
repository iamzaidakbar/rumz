import { STORAGE_KEYS } from "../constants";

// Storage utilities
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
  },
};

// Authentication utilities
export const auth = {
  getToken: () => storage.get(STORAGE_KEYS.TOKEN),
  setToken: (token) => storage.set(STORAGE_KEYS.TOKEN, token),
  removeToken: () => storage.remove(STORAGE_KEYS.TOKEN),

  getHotel: () => storage.get(STORAGE_KEYS.HOTEL),
  setHotel: (hotel) => storage.set(STORAGE_KEYS.HOTEL, hotel),
  removeHotel: () => storage.remove(STORAGE_KEYS.HOTEL),

  clearAuth: () => {
    storage.remove(STORAGE_KEYS.TOKEN);
    storage.remove(STORAGE_KEYS.HOTEL);
  },

  isAuthenticated: () => {
    const token = storage.get(STORAGE_KEYS.TOKEN);
    const hotel = storage.get(STORAGE_KEYS.HOTEL);
    return !!(token && hotel);
  },
};

// Date utilities
export const dateUtils = {
  formatDate: (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString();
  },

  formatDateTime: (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString();
  },

  isToday: (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return (
      today.getDate() === checkDate.getDate() &&
      today.getMonth() === checkDate.getMonth() &&
      today.getFullYear() === checkDate.getFullYear()
    );
  },

  isPast: (date) => {
    return new Date(date) < new Date();
  },

  isFuture: (date) => {
    return new Date(date) > new Date();
  },
};

// String utilities
export const stringUtils = {
  capitalize: (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate: (str, length = 50) => {
    if (!str) return "";
    return str.length > length ? `${str.substring(0, length)}...` : str;
  },

  formatPhoneNumber: (phone) => {
    if (!phone) return "";
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, "");
    // Format as (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },
};

// Validation utilities
export const validation = {
  isValidEmail: (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  },

  isValidPhone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  },

  isValidPassword: (password) => {
    return password && password.length >= 6;
  },

  isRequired: (value) => {
    return value && value.toString().trim().length > 0;
  },
};

// File utilities
export const fileUtils = {
  isValidImageFile: (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    return validTypes.includes(file.type);
  },

  isValidFileSize: (file, maxSize = 2 * 1024 * 1024) => {
    return file.size <= maxSize;
  },

  getFileExtension: (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  },
};
