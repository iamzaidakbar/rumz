// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000,
  BASE_URL: process.env.REACT_APP_BACKEND_URL,
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  HOTEL: "hotel",
  BOOKINGS: "rumz_bookings",
};

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 2 * 1024 * 1024, // 2MB
  ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/gif"],
  MAX_FILE_SIZE_MB: 2,
};

// Toast Configuration
export const TOAST_CONFIG = {
  POSITION: "top-center",
  AUTO_CLOSE: 3000,
};

// Theme Configuration
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

// Route Paths
export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  DASHBOARD: "/",
  ROOMS: "/rooms",
  BOOKINGS: "/booking",
  GUESTS: "/guests",
  SETTINGS: "/settings",
  OWNER: "/owner",
};

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    pattern: /\S+@\S+\.\S+/,
    message: "Please enter a valid email address",
  },
  PASSWORD: {
    minLength: 6,
    message: "Password must be at least 6 characters",
  },
  PHONE: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: "Please enter a valid phone number",
  },
};
