"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

export default function CoachDashboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Fetch player data from an API or mock data
    const fetchPlayers = async () => {
      // Example mock data
      const playerData = [
        {
          id: 1,
          name: "John Doe",
          sport: "Football",
          performance: "High",
          age: 22,
          position: "Striker",
        },
        {
          id: 2,
          name: "Jane Smith",
          sport: "Swimming",
          performance: "Medium",
          age: 20,
          position: "Freestyle",
        },
        {
          id: 3,
          name: "Michael Brown",
          sport: "Athletics",
          performance: "High",
          age: 24,
          position: "Sprinter",
        },
        // Add more players here
      ];

      setPlayers(playerData);
    };

    fetchPlayers();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b101a] text-white">
      <Navbar/>

      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full bg-[#161b26] rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-[#fefefe] mb-6 text-center">Your Players</h1>

          {/* Player Info Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#fefefe] mb-3">
              Total Players: {players.length}
            </h2>
            <table className="w-full text-sm text-left text-[#d1d5db]">
              <thead>
                <tr>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Sport</th>
                  <th className="py-2 px-4">Position</th>
                  <th className="py-2 px-4">Performance</th>
                  <th className="py-2 px-4">Age</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id} className="border-b border-[#4f545c]">
                    <td className="py-2 px-4">{player.name}</td>
                    <td className="py-2 px-4">{player.sport}</td>
                    <td className="py-2 px-4">{player.position}</td>
                    <td className="py-2 px-4">{player.performance}</td>
                    <td className="py-2 px-4">{player.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Optional Additional Player Details */}
          {players.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-[#fefefe] mb-3">Detailed Player Information</h2>
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-[#2b2f3a] p-4 rounded-lg mb-4"
                >
                  <h3 className="text-lg font-semibold text-[#3983fb]">{player.name}</h3>
                  <p><strong>Sport:</strong> {player.sport}</p>
                  <p><strong>Age:</strong> {player.age}</p>
                  <p><strong>Position:</strong> {player.position}</p>
                  <p><strong>Performance Level:</strong> {player.performance}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
