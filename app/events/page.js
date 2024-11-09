"use client";

import React, { useState, useEffect } from "react";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Sample event data (could be fetched from an API)
  useEffect(() => {
    const fetchEvents = async () => {
      // Mock event data
      const eventData = [
        {
          id: 1,
          sport: "Football",
          location: "Stadium A, City X",
          date: "2024-11-15",
          time: "10:00 AM",
        },
        {
          id: 2,
          sport: "Swimming",
          location: "Pool B, City Y",
          date: "2024-11-17",
          time: "02:00 PM",
        },
        {
          id: 3,
          sport: "Athletics",
          location: "Track C, City Z",
          date: "2024-11-20",
          time: "04:00 PM",
        },
        // Add more events here
      ];

      setEvents(eventData);
    };

    fetchEvents();
  }, []);

  // Handle participation form
  const handleParticipation = (event) => {
    setSelectedEvent(event);
    // Here you can implement logic to allow an athlete to register for the event (e.g., API call)
  };

  return (
    <div className="min-h-screen bg-[#0b101a] text-white">
      <nav className="bg-[#0b101a] py-4 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-4xl font-bold text-white justify-start">
            {/* SportyIndia Logo */}
            <span className="text-white">Sporty</span>
            <span className="text-[#3983fb]">india</span>
            
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full bg-[#161b26] rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-[#fefefe] mb-6 text-center">Upcoming Events</h1>

          {/* Event Table */}
          <table className="w-full text-sm text-left text-[#d1d5db] mb-6">
            <thead>
              <tr>
                <th className="py-2 px-4">Sport</th>
                <th className="py-2 px-4">Location</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Time</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-[#4f545c]">
                  <td className="py-2 px-4">{event.sport}</td>
                  <td className="py-2 px-4">{event.location}</td>
                  <td className="py-2 px-4">{event.date}</td>
                  <td className="py-2 px-4">{event.time}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-[#3983fb] text-white px-4 py-2 rounded-md"
                      onClick={() => handleParticipation(event)}
                    >
                      Participate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Participation Details */}
          {selectedEvent && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-[#fefefe] mb-3">Event Details</h2>
              <div className="bg-[#2b2f3a] p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-[#3983fb]">{selectedEvent.sport}</h3>
                <p><strong>Location:</strong> {selectedEvent.location}</p>
                <p><strong>Date:</strong> {selectedEvent.date}</p>
                <p><strong>Time:</strong> {selectedEvent.time}</p>
                <p className="mt-4 text-[#fefefe]">
                  You have successfully selected this event. Please follow the guidelines to participate.
                  {/* Here you can provide more detailed instructions or a form for participation */}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
