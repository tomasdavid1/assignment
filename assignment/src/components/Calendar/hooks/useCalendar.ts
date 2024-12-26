"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "../../../providers/Supabase-provider";
import { useCalendarContext } from "../../../providers/Calendar-provider";


interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  scheduledDays: string[];
}
export const useCalendar = () => {
    const { supabase } = useSupabase();
    const { setEvents } = useCalendarContext();
    const deleteEvent = async (id: string) => {
        try {
          // Optimistically remove the event
          setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    
          const { error } = await supabase.from("events").delete().eq("id", id);
    
          if (error) {
            console.error("Error deleting event:", error);
    
            // Rollback if deletion fails
            fetchEvents();
          } else {
            console.log("Event deleted successfully!");
          }
        } catch (err) {
          console.error("Unexpected error while deleting:", err);
    
          // Rollback on unexpected error
          fetchEvents();
        }
      };
  
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from("events").select("*");
        if (error) throw error;

  
        return data.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: event.start_time,
          end: event.end_time,
          scheduledDays: event.scheduled_days,
        }));
      } catch (err: any) {
        console.error("Error fetching events:", err.message);
        throw err;
      }
    };
  
    return { fetchEvents, deleteEvent };
  };
  