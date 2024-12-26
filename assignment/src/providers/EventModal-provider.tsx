"use client";

import { v4 as uuidv4 } from "uuid";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useSupabase } from "./Supabase-provider";
import { useCalendarContext } from "./Calendar-provider"; // Import Calendar Context

export interface TestSuite {
  id: string;
  name: string;
  selectedDateTime: string | null;
  selectedDays: string[];
}

const defaultTestSuite: TestSuite = {
  id: "",
  name: "",
  selectedDateTime: null,
  selectedDays: [],
};

interface EventModalContextProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  testSuite: TestSuite;
  setTestSuite: React.Dispatch<React.SetStateAction<TestSuite>>;
  scheduleTest: () => Promise<void>;
}

const EventModalContext = createContext<EventModalContextProps | undefined>(
  undefined
);

export const EventModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [testSuite, setTestSuite] = useState<TestSuite>(defaultTestSuite);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const { supabase } = useSupabase();
  const { events, setEvents } = useCalendarContext(); // Access Calendar Context

  const scheduleTest = async () => {
    if (
      !testSuite.id ||
      !testSuite.selectedDateTime ||
      !testSuite.selectedDays.length
    ) {
      console.error("Incomplete data for scheduling");
      return;
    }

    // Create the event object
    const newEvent = {
      id: uuidv4(),
      title: testSuite.name,
      start_time: testSuite.selectedDateTime,
      end_time: testSuite.selectedDateTime,
      scheduled_days: testSuite.selectedDays,
    };

    //Optimistic update, will change if fails

    setEvents((prevEvents) => [
      ...prevEvents,
      {
        id: newEvent.id,
        title: newEvent.title,
        start: newEvent.start_time,
        end: newEvent.end_time,     
        scheduledDays: newEvent.scheduled_days,
      },
    ]);

    try {
      // Attempt to insert into Supabase
      const { error } = await supabase.from("events").insert([newEvent]);

      if (error) {
        console.error("Error scheduling test suite:", error);

        // Rollback the optimistic update if insertion fails
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== newEvent.id)
        );
      } else {
        console.log("Test suite scheduled successfully!");
      }
    } catch (err) {
      console.error("Unexpected error:", err);

      // Rollback on unexpected error
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== newEvent.id)
      );
    } finally {
      closeModal();
    }
  };

  return (
    <EventModalContext.Provider
      value={{ isOpen, openModal, closeModal, testSuite, setTestSuite, scheduleTest }}
    >
      {children}
    </EventModalContext.Provider>
  );
};

export const useEventModal = (): EventModalContextProps => {
  const context = useContext(EventModalContext);
  if (!context) {
    throw new Error("useEventModal must be used within an EventModalProvider");
  }
  return context;
};
