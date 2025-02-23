"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

export default function Calendar() {
  const [date, setDate] = useState(() => new Date()); // Initialize with current date
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [daysUntilBirthday, setDaysUntilBirthday] = useState<number>(0);

  // Add function to sync date across component
  const syncDateTime = useCallback(() => {
    const now = new Date();
    setDate(now);
    setSelectedDate((prev) => {
      const updated = new Date(now);
      updated.setMonth(prev.getMonth(), prev.getDate());
      return updated;
    });
  }, []);

  useEffect(() => {
    // Initial sync
    syncDateTime();

    // Update every minute
    const minuteInterval = setInterval(syncDateTime, 60000);

    // Calculate time until next midnight
    const calculateNextMidnight = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow.getTime() - Date.now();
    };

    // Set up midnight update
    const scheduleNextMidnight = () => {
      const timeUntilMidnight = calculateNextMidnight();
      return setTimeout(() => {
        syncDateTime();
        midnightTimeout = scheduleNextMidnight();
      }, timeUntilMidnight);
    };

    let midnightTimeout = scheduleNextMidnight();

    // Sync on visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncDateTime();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(minuteInterval);
      clearTimeout(midnightTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [syncDateTime]);

  useEffect(() => {
    const calculateDaysUntilBirthday = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const birthday = new Date(currentYear, 3, 7); // April 7th (month is 0-based)

      if (now > birthday) {
        birthday.setFullYear(currentYear + 1);
      }

      const diffTime = birthday.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUntilBirthday(diffDays);
    };

    calculateDaysUntilBirthday();
    const interval = setInterval(calculateDaysUntilBirthday, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayNames = [
    { key: "sun", label: "S" },
    { key: "mon", label: "M" },
    { key: "tue", label: "T" },
    { key: "wed", label: "W" },
    { key: "thu", label: "T" },
    { key: "fri", label: "F" },
    { key: "sat", label: "S" },
  ];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const isBirthday = (day: number) => {
    return selectedDate.getMonth() === 3 && day === 7; // April is month 3 (0-based)
  };

  return (
    <div className="glass-card p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-sky-300">
          {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </h3>
        {/* Add birthday countdown display */}
        {daysUntilBirthday > 0 && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-pink-300"
          >
            {daysUntilBirthday} days until birthday 🎂
          </motion.span>
        )}
        <div className="flex gap-2">
          <button
            onClick={() =>
              setSelectedDate(
                new Date(selectedDate.setMonth(selectedDate.getMonth() - 1))
              )
            }
            className="p-1 hover:bg-sky-500/20 rounded-full transition-colors text-ice-blue/50"
          >
            ←
          </button>
          <button
            onClick={() =>
              setSelectedDate(
                new Date(selectedDate.setMonth(selectedDate.getMonth() + 1))
              )
            }
            className="p-1 hover:bg-sky-500/20 rounded-full transition-colors text-ice-blue/50"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px]">
        {dayNames.map((day) => (
          <div key={day.key} className="text-center text-ice-blue/50 py-1">
            {day.label}
          </div>
        ))}
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
        {days.map((day) => {
          const isToday =
            day === date.getDate() &&
            selectedDate.getMonth() === date.getMonth() &&
            selectedDate.getFullYear() === date.getFullYear();

          const birthday = isBirthday(day);

          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.1 }}
              className={`aspect-square flex items-center justify-center text-xs
                ${
                  isToday
                    ? "bg-sky-500/20 text-sky-300"
                    : birthday
                    ? "bg-pink-500/20 text-pink-300 ring-1 ring-pink-500/30"
                    : "text-ice-blue/70"
                } 
                rounded-full hover:bg-sky-500/10 transition-colors relative`}
            >
              {day}
              {birthday && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
