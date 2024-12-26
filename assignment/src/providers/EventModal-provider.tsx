"use client";

import { v4 as uuidv4 } from "uuid";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useSupabase } from "./Supabase-provider";
import { useCalendarContext } from "./Calendar-provider";

export interface TestSuite {
  id: string;
  title: string;
  selectedDateTime: string | null;
  selectedDays: string[];
}

const defaultTestSuite: TestSuite = {
  id: "",
  title: "",
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
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventModalContext = createContext<EventModalContextProps | undefined>(
  undefined
);

export const EventModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [testSuite, setTestSuite] = useState<TestSuite>(defaultTestSuite);
  const [editMode, setEditMode] = useState(false); // Add editMode state
  const { supabase } = useSupabase();
  const { events, setEvents } = useCalendarContext();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setTestSuite(defaultTestSuite); // Reset test suite on close
    setEditMode(false); // Reset editMode on close
  };

  const scheduleTest = async () => {
    if (!testSuite.title || !testSuite.selectedDateTime || !testSuite.selectedDays.length) {
      console.error("Incomplete data for scheduling");
      return;
    }

    const newEvent = {
      id: uuidv4(),
      title: testSuite.title,
      start_time: testSuite.selectedDateTime,
      end_time: testSuite.selectedDateTime,
      scheduled_days: testSuite.selectedDays,
    };

    

    if (editMode) {

        console.log('test suite ID is', testSuite.id)
        // Update an existing event
        try {
          // Prepare the updated event data
          const updatedEvent = {
            title: testSuite.title,
            start_time: testSuite.selectedDateTime,
            end_time: testSuite.selectedDateTime,
            scheduled_days: testSuite.selectedDays,
          };
      
          // Update the event in Supabase
          const { error } = await supabase
            .from("events")
            .update(updatedEvent)
            .eq("id", testSuite.id);
      
          if (error) {
            console.error("Error updating test suite:", error);
          } else {
            console.log("Test suite updated successfully!");
      
            // Update the local state for events
            setEvents((prevEvents) =>
              prevEvents.map((event) =>
                event.id === testSuite.id
                  ? {
                      ...event,
                      title: updatedEvent.title,
                      start: updatedEvent.start_time,
                      end: updatedEvent.end_time,
                      scheduledDays: updatedEvent.scheduled_days,
                    }
                  : event
              )
            );
          }
        } catch (err) {
          console.error("Unexpected error while updating:", err);
        } finally {
          closeModal(); // Close the modal after the update
        }
      }
      else {
      // Create a new event
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
        const { error } = await supabase.from("events").insert([newEvent]);
        if (error) {
          console.error("Error scheduling test suite:", error);
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== newEvent.id)
          );
        } else {
          console.log("Test suite scheduled successfully!");
        }
      } catch (err) {
        console.error("Unexpected error while scheduling:", err);
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== newEvent.id)
        );
      } finally {
        closeModal();
      }
    }
  };

  return (
    <EventModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        testSuite,
        setTestSuite,
        scheduleTest,
        editMode,
        setEditMode,
      }}
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
