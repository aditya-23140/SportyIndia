"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function Challenges() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const eventData = await response.json();

        const now = new Date();
        const upcoming = [];
        const past = [];

        eventData.forEach((event) => {
          const eventDate = new Date(event.Date);

          if (eventDate >= now) {
            upcoming.push(event);
          } else {
            past.push(event);
          }
        });

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleParticipation = (event) => {
    setSelectedEvent(event);
  };

  const generateEventLink = (eventName) => {
    return `https://${eventName.replace(/\s+/g, '')}.com`;
  };

  return (
    <div className="min-h-screen bg-[#0b101a] text-white">
      <Navbar />

      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 min-h-[79vh]">
        <div className="max-w-3xl w-full bg-[#161b26] rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-[#fefefe] mb-6 text-center">Contests</h1>
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-[#fefefe] mb-4">Upcoming Contests</h2>
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
                  {upcomingEvents.map((event) => (
                    <tr key={event.EventID} className="border-b border-[#4f545c]">
                      <td className="py-2 px-4">{event.EventName}</td>
                      <td className="py-2 px-4">{event.Venue}</td>
                      <td className="py-2 px-4">{new Date(event.Date).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{new Date(event.Date).toLocaleTimeString()}</td>
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
            </div>
          )}
          {selectedEvent && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#fefefe] mb-3">Event Details</h2>
              <div className="bg-[#2b2f3a] p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-[#3983fb]">{selectedEvent.EventName}</h3>
                <p><strong>Location:</strong> {selectedEvent.Venue}</p>
                <p><strong>Date:</strong> {new Date(selectedEvent.Date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(selectedEvent.Date).toLocaleTimeString()}</p>
                <p className="mt-4 text-[#fefefe]">
                  You have successfully selected this event. Please follow the guidelines to participate.
                </p>
                <a
                  href={generateEventLink(selectedEvent.EventName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block bg-[#3983fb] text-white px-4 py-2 rounded-md"
                >
                  Visit Event Page
                </a>
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-[#fefefe] mb-4">Past Contests</h2>
              <table className="w-full text-sm text-left text-[#d1d5db] mb-6">
                <thead>
                  <tr>
                    <th className="py-2 px-4">Sport</th>
                    <th className="py-2 px-4">Location</th>
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {pastEvents.map((event) => (
                    <tr key={event.EventID} className="border-b border-[#4f545c]">
                      <td className="py-2 px-4">{event.EventName}</td>
                      <td className="py-2 px-4">{event.Venue}</td>
                      <td className="py-2 px-4">{new Date(event.Date).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{new Date(event.Date).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
        </div>
      </div>

      <Footer />
    </div>
  );
}
