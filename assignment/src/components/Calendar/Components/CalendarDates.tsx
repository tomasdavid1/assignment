import React, { useMemo } from "react";
import { format, startOfWeek, addDays } from "date-fns";

const CalendarDates = () => {
  // Calculate the current week's days
  const currentWeekStart = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 0 }), []);
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  return (
<div className="ml-[49px] grid grid-cols-7 bg-gray-100 text-center font-semibold rounded-t-lg border-b h-12 border-gray-200">

      {/* Days of the Week */}
      {days.map((day) => (
  <div 
    key={day.toString()} 
    className="flex items-center space-x-2 text-gray-600 pl-4 py-1"
  >
    {/* Date (bold) */}
    <p className="font-semibold text-black">{format(day, "d")}</p>
    {/* Day of the week (slightly gray) */}
    <p className="text-gray-500">{format(day, "EEE")}</p>
  </div>
))}

    </div>
  );
};

export default CalendarDates;
