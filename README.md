# Rumz Frontend

## Overview

Rumz Frontend is a modern hotel management dashboard built with React. It provides a comprehensive interface for managing hotel bookings, rooms, guests, and dashboard analytics. The app is designed for hotel owners and staff to efficiently handle daily operations, track metrics, and provide a seamless guest experience.

---

## Features

### Authentication

- Secure login and registration for hotel staff/owners
- Token-based authentication with automatic validation and logout on expiry

### Dashboard

- Visual summary of key hotel metrics (revenue, bookings, guests, rooms)
- Trend charts, pie charts, and bar charts for analytics
- Ongoing bookings and calendar view

### Bookings Management

- View, add, edit, and delete bookings
- Booking details with guest info, room assignment, payment status, and booking status
- Date pickers for check-in/check-out with fully booked date logic
- Cancel bookings with payment status update
- Search, filter, and tab navigation for bookings

### Rooms Management

- View, add, edit, and delete rooms
- Room details: number, type, floor, status, amenities, price, photo
- Amenities selection and photo upload (Cloudinary integration)
- Filter rooms by floor and status

### Guests Management

- View all guests, current guests, and past guests
- Guest profiles with booking history
- Search and filter guests

### Settings & Owner Profile

- Update hotel/owner details
- Theme toggle (light/dark mode)

### Notifications

- Toast notifications for all major actions (success, error, warning)
- Confirmation dialogs for destructive actions (delete, cancel)

### Responsive Design

- Fully responsive UI for desktop and mobile
- Uses MUI X Date Pickers and custom SCSS modules

---

## Architecture & Code Structure

- **React Context API** is used for all global data (bookings, rooms, guests, dashboard)
- **No custom data hooks** for global state (all logic is in context providers)
- **Form state** is managed with custom hooks (`useBookingForm`, `useRoomForm`, `useForm`)
- **API layer** in `src/api/` for all backend communication
- **Components** are modular and reusable, organized by domain
- **Pages** in `src/pages/` for each main route/view
- **Styles** use SCSS modules for encapsulation

### Context Providers

- `AppContext` — App-wide state (theme, auth, etc.)
- `BookingsContext` — Bookings data and CRUD methods
- `RoomsContext` — Rooms data and CRUD methods
- `GuestsContext` — Guests data and fetch method
- `DashboardContext` — Dashboard summary and analytics
- All providers are composed in `App.js` for global access

### Data Flow

- On login, all data is fetched and stored in context
- Components consume data from context, never call APIs directly
- All CRUD actions update context and trigger refetches as needed

---

## Recent Refactor & Improvements

- **Removed all custom data hooks** (e.g., `useBookings`, `useRooms`) in favor of context-only architecture
- **Centralized all CRUD logic** in context providers
- **Improved error handling** and loading states in context
- **Ensured all API calls are only made after login and token validation**
- **Added confirmation dialogs** for delete/cancel actions
- **Fixed amenities update logic in Edit Room**
- **Added debugging and better success/error messages**
- **Ensured all date pickers are wrapped in MUI LocalizationProvider**
- **Refactored all pages to use context consumers**

---

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd rumz-frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment variables:**
   - Create a `.env` file and set `REACT_APP_BACKEND_URL` to your backend API URL
4. **Run the app:**
   ```bash
   npm start
   ```
5. **Build for production:**
   ```bash
   npm run build
   ```

---

## File Structure

```
rumz-frontend/
  src/
    api/           # API clients for backend
    components/    # Reusable UI components
    contexts/      # React context providers
    hooks/         # Form and auth hooks
    pages/         # Main app pages/routes
    styles/        # SCSS modules
    utils/         # Utility functions
    data/          # Sample/mock data
```

---

## Tech Stack

- React
- React Router
- React Context API
- SCSS Modules
- MUI X Date Pickers
- Cloudinary (for image upload)
- Framer Motion (animations)

---

## Contributors

- [Your Name]

---

## License

[MIT]
