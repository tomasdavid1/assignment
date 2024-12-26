"use client";

import React from "react";
import { Modal } from "../../../ui/Modal";
import { useEventModal } from "../../../providers/EventModal-provider";
import { useCalendar } from "../hooks/useCalendar";

const testSuiteOptions = [
  { title: "Demo Suite 1" },
  { title: "Demo Suite 2" },
  { title: "Demo Suite 3" },
];

export const EventModal = (): React.ReactElement => {
  const { isOpen, closeModal, testSuite, setTestSuite, scheduleTest, editMode } =
    useEventModal();
  const { deleteEvent } = useCalendar();

  const handleDelete = async () => {
    await deleteEvent(testSuite.id);
    closeModal();
  };


  const handleTestSuiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSuite = testSuiteOptions.find(
      (suite) => suite.title === event.target.value
    );
    if (selectedSuite) {
      setTestSuite((prevState) => ({
        ...prevState,
        title: selectedSuite.title,
      }));
    }
  };

  const handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTestSuite((prevState) => ({
      ...prevState,
      selectedDateTime: event.target.value,
    }));
  };

  

  const handleDayToggle = (day: string) => {
    setTestSuite((prevState) => ({
      ...prevState,
      selectedDays: prevState.selectedDays.includes(day)
        ? prevState.selectedDays.filter((d) => d !== day)
        : [...prevState.selectedDays, day],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      setOpen={closeModal}
      CloseTrigger={<div></div>}
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold">
          {editMode ? "Edit Test" : "Schedule Test"}
        </h2>

        {/* Test Suite Dropdown */}
        <div>
          <label className="block font-semibold text-sm font-medium mb-1">
            Test Suite
          </label>
          <select
            value={testSuite.title || ""}
            onChange={handleTestSuiteChange}
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>
              Select a test suite
            </option>
            {testSuiteOptions.map((suite) => (
              <option key={suite.title} value={suite.title}>
                {suite.title}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
          <div className="mb-4">
            <label className="block font-semibold text-sm text-gray-800 mb-2">
              Start Date and Time
            </label>
            <input
              type="datetime-local"
              value={testSuite.selectedDateTime || ""}
              onChange={handleDateTimeChange}
              className="w-full p-2 border rounded bg-white text-gray-800"
            />
          </div>

          {/* Weekly Days Selector */}
          <div>
            <label className="block font-semibold text-sm text-gray-800 mb-2">
              Run Weekly on Every
            </label>
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <button
                  key={day}
                  onClick={() => handleDayToggle(day)}
                  className={`p-2 rounded border text-center ${
                    testSuite.selectedDays.includes(day)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            onClick={editMode ? handleDelete : closeModal}
            className="w-1/2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-red-600 rounded"
          >
            {editMode ? "Delete Event" : "Cancel Schedule"}
            </button>
          <button
            onClick={scheduleTest}
            className="w-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            {editMode ? "Save Changes" : "Schedule Test"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
