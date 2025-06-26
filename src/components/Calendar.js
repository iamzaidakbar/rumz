import React, { useState, useEffect } from "react";
import styles from "../styles/Calendar.module.scss";
import { bookings } from "../data/dashboardData";
import { motion, AnimatePresence } from "framer-motion";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getBookingsForDay(year, month, day) {
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
  return bookings.filter((b) => b.date === dateStr);
}

function renderMonth(month, year, selectedDay, setSelectedDay, setPopupInfo) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];
  let day = 1 - firstDay;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++, day++) {
      if (day < 1 || day > daysInMonth) {
        week.push(<td key={d}></td>);
      } else {
        const currentDay = day;
        const dayBookings = getBookingsForDay(year, month, currentDay);
        week.push(
          <td key={d}>
            <div
              className={
                currentDay === selectedDay ? styles.selected : styles.day
              }
              onClick={() => {
                setSelectedDay(currentDay);
                setPopupInfo(
                  dayBookings.length > 0
                    ? { day: currentDay, month, year, bookings: dayBookings }
                    : null
                );
              }}
              tabIndex={0}
              aria-label={`Day ${currentDay}${
                dayBookings.length > 0 ? ", has bookings" : ""
              }`}
            >
              {currentDay}
              {dayBookings.length > 0 && <span className={styles.bookingDot} />}
            </div>
          </td>
        );
      }
    }
    weeks.push(<tr key={w}>{week}</tr>);
  }
  return weeks;
}

const Calendar = () => {
  const today = new Date();
  const [month, setMonth] = useState(6); // July (0-indexed)
  const [year, setYear] = useState(2024);
  const [selectedDay, setSelectedDay] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);

  // Select current date on mount or when month/year changes
  useEffect(() => {
    let initialDay = null;
    if (today.getFullYear() === year && today.getMonth() === month) {
      initialDay = today.getDate();
    } else {
      initialDay = 1;
    }
    setSelectedDay(initialDay);
    const dayBookings = getBookingsForDay(year, month, initialDay);
    setPopupInfo({ day: initialDay, month, year, bookings: dayBookings });
    // eslint-disable-next-line
  }, [month, year]);

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <div className={styles.calendarWrap}>
      <div className={styles.monthBlock}>
        <div className={styles.monthHeader}>
          <button onClick={prevMonth} aria-label="Previous Month">
            <BiSolidLeftArrow />
          </button>
          <span>
            {months[month]} {year}
          </span>
          <button onClick={nextMonth} aria-label="Next Month">
            <BiSolidRightArrow />
          </button>
        </div>
        <table className={styles.calendar}>
          <thead>
            <tr>
              {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderMonth(
              month,
              year,
              selectedDay,
              (day) => {
                setSelectedDay(day);
                const dayBookings = getBookingsForDay(year, month, day);
                setPopupInfo({ day, month, year, bookings: dayBookings });
              },
              setPopupInfo
            )}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {popupInfo ? (
          <motion.div
            className={styles.bookingPopup}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            tabIndex={0}
            aria-label={`Bookings for ${popupInfo.day} ${
              months[popupInfo.month]
            } ${popupInfo.year}`}
          >
            <div className={styles.popupHeader}>
              Bookings for {popupInfo.day} {months[popupInfo.month]}{" "}
              {popupInfo.year}
              <button onClick={() => setPopupInfo(null)} aria-label="Close">
                ×
              </button>
            </div>
            <ul className={styles.popupList}>
              {popupInfo.bookings.length > 0 ? (
                popupInfo.bookings.map((b, i) => (
                  <li key={i} className={styles.bookingItem}>
                    <b>{b.guest}</b> — {b.room}
                  </li>
                ))
              ) : (
                <li className={styles.noBooking}>No bookings for this day.</li>
              )}
            </ul>
          </motion.div>
        ) : (
          <motion.div
            className={styles.bookingPopup}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            tabIndex={0}
            aria-label="No day selected"
          >
            <div className={styles.popupHeader}>Bookings</div>
            <div className={styles.noBooking}>
              No Nookings! Select another date to view bookings.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
