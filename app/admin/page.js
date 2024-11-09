"use client";

import React, { useState } from "react";

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("athletes");

  // Sample Data
  const athletes = [
    { id: 1, name: "John Doe", sport: "Football", coach: "Coach A", status: "Active" },
    { id: 2, name: "Jane Smith", sport: "Swimming", coach: "Coach B", status: "Inactive" },
  ];

  const coaches = [
    { id: 1, name: "Coach A", sport: "Football" },
    { id: 2, name: "Coach B", sport: "Swimming" },
  ];

  const events = [
    { id: 1, name: "National Football Championship", location: "Stadium A", date: "2024-12-15", time: "10:00 AM" },
    { id: 2, name: "International Swimming Tournament", location: "Pool B", date: "2024-12-20", time: "2:00 PM" },
  ];

  const fundings = [
    { id: 1, name: "Event Funding", amount: 5000, for: "National Football Championship", donor: "John Doe" },
    { id: 2, name: "Athlete Sponsorship", amount: 2000, for: "John Doe", donor: "Jane Smith" },
  ];

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
        <div className="max-w-7xl w-full bg-[#161b26] rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-[#fefefe] mb-6 text-center">
            Admin Dashboard
          </h1>

          <div className="mb-6 flex justify-center space-x-6">
            <button
              onClick={() => setSelectedTab("athletes")}
              className={`py-2 px-6 rounded-lg ${selectedTab === "athletes" ? "bg-[#3983fb]" : "bg-[#2b2f3a]"}`}
            >
              Athletes
            </button>
            <button
              onClick={() => setSelectedTab("coaches")}
              className={`py-2 px-6 rounded-lg ${selectedTab === "coaches" ? "bg-[#3983fb]" : "bg-[#2b2f3a]"}`}
            >
              Coaches
            </button>
            <button
              onClick={() => setSelectedTab("events")}
              className={`py-2 px-6 rounded-lg ${selectedTab === "events" ? "bg-[#3983fb]" : "bg-[#2b2f3a]"}`}
            >
              Events
            </button>
            <button
              onClick={() => setSelectedTab("fundings")}
              className={`py-2 px-6 rounded-lg ${selectedTab === "fundings" ? "bg-[#3983fb]" : "bg-[#2b2f3a]"}`}
            >
              Fundings
            </button>
          </div>

          {selectedTab === "athletes" && (
            <div>
              <h2 className="text-xl font-semibold text-[#fefefe] mb-3">Athletes</h2>
              <table className="min-w-full table-auto text-[#d1d5db]">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">ID</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Sport</th>
                    <th className="py-2 px-4 text-left">Coach</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.map((athlete) => (
                    <tr key={athlete.id}>
                      <td className="py-2 px-4">{athlete.id}</td>
                      <td className="py-2 px-4">{athlete.name}</td>
                      <td className="py-2 px-4">{athlete.sport}</td>
                      <td className="py-2 px-4">{athlete.coach}</td>
                      <td className="py-2 px-4">{athlete.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedTab === "coaches" && (
            <div>
              <h2 className="text-xl font-semibold text-[#fefefe] mb-3">Coaches</h2>
              <table className="min-w-full table-auto text-[#d1d5db]">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">ID</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Sport</th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.map((coach) => (
                    <tr key={coach.id}>
                      <td className="py-2 px-4">{coach.id}</td>
                      <td className="py-2 px-4">{coach.name}</td>
                      <td className="py-2 px-4">{coach.sport}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedTab === "events" && (
            <div>
              <h2 className="text-xl font-semibold text-[#fefefe] mb-3">Events</h2>
              <table className="min-w-full table-auto text-[#d1d5db]">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">ID</th>
                    <th className="py-2 px-4 text-left">Event</th>
                    <th className="py-2 px-4 text-left">Location</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="py-2 px-4">{event.id}</td>
                      <td className="py-2 px-4">{event.name}</td>
                      <td className="py-2 px-4">{event.location}</td>
                      <td className="py-2 px-4">{event.date}</td>
                      <td className="py-2 px-4">{event.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedTab === "fundings" && (
            <div>
              <h2 className="text-xl font-semibold text-[#fefefe] mb-3">Fundings</h2>
              <table className="min-w-full table-auto text-[#d1d5db]">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">ID</th>
                    <th className="py-2 px-4 text-left">Funding Type</th>
                    <th className="py-2 px-4 text-left">Amount</th>
                    <th className="py-2 px-4 text-left">For</th>
                    <th className="py-2 px-4 text-left">Donor</th>
                  </tr>
                </thead>
                <tbody>
                  {fundings.map((funding) => (
                    <tr key={funding.id}>
                      <td className="py-2 px-4">{funding.id}</td>
                      <td className="py-2 px-4">{funding.name}</td>
                      <td className="py-2 px-4">{funding.amount}</td>
                      <td className="py-2 px-4">{funding.for}</td>
                      <td className="py-2 px-4">{funding.donor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
