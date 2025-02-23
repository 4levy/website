'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Calendar() {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayNames = [
    { key: 'sun', label: 'S' },
    { key: 'mon', label: 'M' },
    { key: 'tue', label: 'T' },
    { key: 'wed', label: 'W' },
    { key: 'thu', label: 'T' },
    { key: 'fri', label: 'F' },
    { key: 'sat', label: 'S' }
  ];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="glass-card p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-sky-300">
          {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
            className="p-1 hover:bg-sky-500/20 rounded-full transition-colors text-ice-blue/50">
            ←
          </button>
          <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
            className="p-1 hover:bg-sky-500/20 rounded-full transition-colors text-ice-blue/50">
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px]">
        {dayNames.map(day => (
          <div key={day.key} className="text-center text-ice-blue/50 py-1">
            {day.label}
          </div>
        ))}
        {Array(firstDayOfMonth).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map(day => {
          const isToday = day === currentDate.getDate() && 
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();
          return (
            <motion.div key={day} whileHover={{ scale: 1.1 }}
              className={`aspect-square flex items-center justify-center text-xs
                ${isToday ? 'bg-sky-500/20 text-sky-300' : 'text-ice-blue/70'} 
                rounded-full hover:bg-sky-500/10 transition-colors`}>
              {day}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
