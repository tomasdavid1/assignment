"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "../../../providers/Supabase-provider";

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  scheduledDays: string[];
}
export const useCalendar = () => {
    const { supabase } = useSupabase();
  
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from("events").select("*");
        if (error) throw error;

        console.log('foind data,', data)
  
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
  
    return { fetchEvents };
  };
  