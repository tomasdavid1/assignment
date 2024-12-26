import React from "react";

interface EventProps {
  event: {
    id: string;
    title: string;
    start: string;
    end: string;
  };
}

const Event: React.FC<EventProps> = ({ event }) => {
  return (
    <div className="absolute left-1 right-1 top-1 bg-blue-100 border border-blue-500 text-blue-800 text-sm p-2 rounded-md shadow">
      {/* Event Title */}
      <p className="font-semibold">{event.title}</p>

      {/* Event Time */}
      <p className="text-xs font-medium">{`${event.start} PST`}</p>
    </div>
  );
};

export default Event;
