"use client";

import React, { useEffect } from "react";
import CalendarDates from "./Components/CalendarDates";
import CalendarHeader from "./Components/CalendarHeader";
import Event from "@components/Event";
import { addDays, format } from "date-fns";
import { useCalendarContext } from "../../providers/Calendar-provider";

const Calendar = () => {
  const { events, loading, error, currentWeekStart } = useCalendarContext();

  useEffect(() => {
    console.log('went in here', JSON.stringify(events))
  }, [events]); 

  


  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>Error loading events: {error}</p>;
  }

  // Calculate the current week's days
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  return (
    <div className="flex flex-col p-8 bg-white shadow rounded-lg">
      <CalendarHeader />
      <CalendarDates />

      {/* Main Grid */}
      <div className="flex">
        {/* Hours Column */}
        <div className="flex flex-col text-gray-600 text-sm pr-2">
          <div className="h-16">PST</div>
          {Array.from({ length: 24 }).map((_, i) => {
            const hour = i === 0 ? 12 : i > 12 ? i - 12 : i; // Convert to 12-hour format
            const period = i < 12 ? "AM" : "PM"; // Determine AM or PM
            return (
              <div key={i} className="h-16">
                {`${hour} ${period}`}
              </div>
            );
          })}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7">
          {daysOfWeek.map((day, dayIndex) => (
            <div key={dayIndex} className="border-l border-gray-200">
              {Array.from({ length: 24 }).map((_, hourIndex) => (
                <div
                  key={hourIndex}
                  className="h-16 border-b border-gray-100 relative"
                >
                  {/* Render Events */}
                  {events
                    .filter((event) => {
                      // Filter the scheduled days
                      const currentDay = format(day, "EEE"); // e.g., 'Tue'
                      return event.scheduledDays.includes(currentDay);
                    })
                    .filter((event) => {
                      const eventStartDate = new Date(event.start);
            const currentDate = new Date(
              currentWeekStart.getFullYear(),
              currentWeekStart.getMonth(),
              currentWeekStart.getDate() + dayIndex,
              hourIndex
            );

            // Check if the event's start day matches the day index
            const eventDayMatches =
              event.scheduledDays.includes(currentDate.toLocaleString("en-US", { weekday: "short" }));

            // Check if the current date is on or after the event's start date
            return eventDayMatches && currentDate >= eventStartDate;
                    })
                    .filter((event) => {
                      // Filter the current hour
                      const eventStart = new Date(event.start);
                      return eventStart.getHours() === hourIndex 
                    })
                    
                    .map((event) => (
                      <Event key={`${event.id}-${dayIndex}-${hourIndex}`} event={event} />
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
