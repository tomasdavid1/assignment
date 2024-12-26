import React from "react";
import { useEventModal } from "../../../providers/EventModal-provider";
import { useCalendarContext } from "../../../providers/Calendar-provider";


const CalendarHeader = () => {
  const { openModal } = useEventModal();
  const { currentWeekStart, goToNextWeek, goToPreviousWeek } = useCalendarContext();

  const formattedWeek = `Week of ${currentWeekStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  return (
    <header className="mb-4">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Scheduled Suites</h1>

      {/* Buttons Section */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Schedule Test Button */}
        <button
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
        >
          + Schedule Test
        </button>

        {/* Week Navigation */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPosition = e.clientX - rect.left;

            // Determine whether the left or right part was clicked
            if (clickPosition < rect.width / 2) {
              goToPreviousWeek(); // Go to the previous week
            } else {
              goToNextWeek(); // Go to the next week
            }
          }}
          className="flex items-center justify-between px-4 py-2 border rounded-md shadow-sm text-gray-800 cursor-pointer select-none"
        >
          <span className="text-gray-600 pr-4">‹</span> {/* Left arrow */}
          <p className="text-gray-800 mx-2">{formattedWeek}</p> {/* Week text */}
          <span className="text-gray-600 pl-4">›</span> {/* Right arrow */}
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;
