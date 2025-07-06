# 🍞 Stunning Toast Component

A beautiful, modern, and feature-rich Toast notification component built with React, Framer Motion, and SCSS modules.

## ✨ Features

### 🎨 **Design & Animation**

- **Glass morphism design** with backdrop blur effects
- **Smooth Framer Motion animations** with spring physics
- **Hover effects** and micro-interactions
- **Gradient backgrounds** for different toast types
- **Progress bar** showing auto-dismiss countdown

### 🎯 **Toast Variants**

- **Success** - Green gradient with checkmark icon
- **Error** - Red gradient with error icon
- **Warning** - Yellow gradient with warning icon
- **Info** - Blue gradient with info icon

### 🌙 **Theme Support**

- **Light mode** with clean, modern styling
- **Dark mode** with proper contrast and colors
- **Automatic theme detection** from AppContext

### 📱 **Responsive Design**

- **Mobile-first** approach
- **Adaptive layouts** for different screen sizes
- **Touch-friendly** interactions

### ⚡ **Functionality**

- **Auto-dismiss** with configurable duration
- **Manual close** button
- **Multiple positions** (top-right, top-left, bottom-right, bottom-left, top-center, bottom-center)
- **Accessibility** friendly with proper ARIA labels
- **Keyboard navigation** support

## 🚀 Usage

### Basic Setup

1. **Wrap your app with ToastProvider:**

```jsx
import { ToastProvider } from "./contexts/ToastContext";

function App() {
  return (
    <AppProvider>
      <ToastProvider position="top-right">
        {/* Your app components */}
      </ToastProvider>
    </AppProvider>
  );
}
```

2. **Use the toast hook in any component:**

```jsx
import { useToast } from "../contexts/ToastContext";

function MyComponent() {
  const { success, error, warning, info } = useToast();

  const handleSuccess = () => {
    success("Success!", "Operation completed successfully.");
  };

  const handleError = () => {
    error("Error!", "Something went wrong.", { duration: 8000 });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

### API Reference

#### Toast Methods

```jsx
const { success, error, warning, info, addToast } = useToast();

// Basic usage
success(title, message, options);
error(title, message, options);
warning(title, message, options);
info(title, message, options);

// Advanced usage
addToast({
  type: "success",
  title: "Custom Title",
  message: "Custom message",
  duration: 5000,
});
```

#### Options

| Property   | Type   | Default | Description                                   |
| ---------- | ------ | ------- | --------------------------------------------- |
| `duration` | number | 5000    | Duration in milliseconds                      |
| `type`     | string | 'info'  | Toast variant (success, error, warning, info) |

#### Positions

- `top-right` (default)
- `top-left`
- `bottom-right`
- `bottom-left`
- `top-center`
- `bottom-center`

## 🎨 Customization

### Styling

The component uses SCSS modules for styling. You can customize:

- **Colors**: Modify the gradient colors in `Toast.module.scss`
- **Animations**: Adjust Framer Motion settings in the component
- **Layout**: Change positioning and spacing
- **Typography**: Update font sizes and weights

### Theme Integration

The toast automatically adapts to your app's theme:

```jsx
// In your component
const { theme } = useAppContext();
// Toast will automatically use the correct theme
```

## 📱 Responsive Behavior

- **Desktop**: Full-width toasts with detailed information
- **Tablet**: Optimized spacing and touch targets
- **Mobile**: Compact design with essential information

## ♿ Accessibility

- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **Focus management** for close buttons
- **Reduced motion** support for users with motion sensitivity

## 🔧 Advanced Features

### Custom Duration

```jsx
success("Quick Update", "This will disappear in 2 seconds.", {
  duration: 2000,
});
```

### Long Messages

The toast handles long content gracefully with proper text wrapping and scrolling.

### Multiple Toasts

Multiple toasts stack beautifully with smooth animations and proper spacing.

## 🎪 Demo

Check out the `ToastDemo` component for interactive examples of all toast variants and features.

## 📦 Dependencies

- **React** - UI framework
- **Framer Motion** - Animations
- **React Icons** - Icons
- **SCSS Modules** - Styling

## 🎯 Performance

- **Optimized animations** with Framer Motion
- **Efficient re-renders** with React hooks
- **Memory management** with proper cleanup
- **Lazy loading** ready

---

**Built with ❤️ for modern React applications**
