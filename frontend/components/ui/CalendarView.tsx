'use client';

import React, { useState } from 'react';
import { Task } from '../../lib/types';

interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter tasks with due dates
  const tasksWithDueDates = tasks.filter(task => task.dueDate);

  // Group tasks by date
  const tasksByDate: { [date: string]: Task[] } = {};
  tasksWithDueDates.forEach(task => {
    if (task.dueDate) {
      const dateKey = new Date(task.dueDate).toDateString();
      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = [];
      }
      tasksByDate[dateKey].push(task);
    }
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get days in month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Create calendar days
  const calendarDays = [];
  
  // Previous month days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    calendarDays.push({
      date: new Date(year, month - 1, day),
      isCurrentMonth: false,
      tasks: []
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateKey = date.toDateString();
    calendarDays.push({
      date,
      isCurrentMonth: true,
      tasks: tasksByDate[dateKey] || []
    });
  }

  // Next month days
  const totalCells = 42; // 6 weeks * 7 days
  const nextMonthDays = totalCells - calendarDays.length;
  for (let day = 1; day <= nextMonthDays; day++) {
    calendarDays.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
      tasks: []
    });
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {monthNames[month]} {year}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            &lt;
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayInfo, index) => (
          <div
            key={index}
            className={`min-h-24 p-2 border rounded-lg ${
              dayInfo.isCurrentMonth
                ? isToday(dayInfo.date)
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-white border-gray-200'
                : 'bg-gray-50 border-gray-100 text-gray-400'
            }`}
          >
            <div className={`text-right text-sm font-medium ${
              isToday(dayInfo.date) ? 'text-blue-600 font-bold' : 'text-gray-700'
            }`}>
              {dayInfo.date.getDate()}
            </div>
            <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
              {dayInfo.tasks.slice(0, 3).map((task, idx) => (
                <div 
                  key={`${task.id}-${idx}`} 
                  className={`text-xs p-1 rounded truncate ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : task.priority === 'medium' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                  }`}
                  title={task.title}
                >
                  {task.title}
                </div>
              ))}
              {dayInfo.tasks.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{dayInfo.tasks.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;