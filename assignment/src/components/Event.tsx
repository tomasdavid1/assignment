import React from "react";
import { useEventModal } from "../providers/EventModal-provider";

interface EventProps {
  event: {
    id: string; 
    title: string;
    start: string;
    end: string;
    scheduledDays: string[];
  };
}

const Event: React.FC<EventProps> = ({ event }) => {
  const { openModal, setTestSuite, setEditMode } = useEventModal();

  const handleClick = () => {

    console.log('i am setting the id correclty,', event.id)

    setTestSuite({
      id: event.id, 
      title: event.title, 
      selectedDateTime: event.start, 
      selectedDays: event.scheduledDays || [], 
    });
    setEditMode(true); 
    openModal(); 
  };

  return (
    <div
      className="absolute left-1 right-1 top-1 bg-blue-100 border border-blue-500 text-blue-800 text-sm p-2 rounded-md shadow cursor-pointer"
      onClick={handleClick} // Call handleClick on click
    >
      {/* Display event details */}
      <p className="font-semibold">{event.title}</p>
      <p className="text-xs font-medium">{`${event.start} PST`}</p>
    </div>
  );
};

export default Event;
