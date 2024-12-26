"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { addDays, startOfWeek } from "date-fns";
import { useSupabase } from "./Supabase-provider";

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  scheduledDays: string[];
  


}

interface CalendarContextType {
  currentWeekStart: Date;
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  loading: boolean;
  error: string | null;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>; 
events: Event[];
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { supabase } = useSupabase();

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from("events").select("*");
      if (error) {
        throw error;
      }
      const fetchedEvents = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: event.start_time,
        end: event.end_time,
        scheduledDays: event.scheduled_days,
      }));
      console.log('registered this one', data)
      setEvents(fetchedEvents);
      console.log('but the state didn not change?,' ,events)
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch events when the provider mounts
    fetchEvents();

    // Set up a real-time listener
    const channel = supabase
      .channel("events-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "events" },
        (payload) => {
          setEvents((prevEvents) => [
            ...prevEvents,
            {
              id: payload.new.id,
              title: payload.new.title,
              start: payload.new.start_time,
              end: payload.new.end_time,
              scheduledDays: payload.new.scheduled_days,
            },
          ]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "events" },
        (payload) => {
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === payload.new.id
                ? {
                    id: payload.new.id,
                    title: payload.new.title,
                    start: payload.new.start_time,
                    end: payload.new.end_time,
                    scheduledDays: payload.new.scheduled_days,
                  }
                : event
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "events" },
        (payload) => {
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    // Cleanup listener
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const goToNextWeek = () => setCurrentWeekStart((prev) => addDays(prev, 7));
  const goToPreviousWeek = () => setCurrentWeekStart((prev) => addDays(prev, -7));

  return (
    <CalendarContext.Provider
      value={{
        currentWeekStart,
        goToNextWeek,
        goToPreviousWeek,
        events,
        loading,
        setEvents,
        error,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendarContext must be used within a CalendarProvider");
  }
  return context;
};
