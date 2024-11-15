"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Loader from "@/components/Loader";

const CoachDashboard = ({ params }) => {
  const { coachEmail } = params;

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!coachEmail) return;

      try {
        const res = await fetch(`/api/coaches/${coachEmail}`);
        const data = await res.json();

        if (res.ok) {
          setPlayers(data.players);

          // const url = window.location.pathname.split('/')[0] + '/coach'; 
          // window.history.replaceState(null, '', url);
        } else {
          setError(data.error || "Failed to fetch players");
        }
      } catch (error) {
        setError("Failed to fetch players");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [coachEmail]);

  const getCoachName = (email) => email.split('%40')[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b101a] text-white">
        <Navbar />
        <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl w-full bg-[#161b26] rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-extrabold text-[#fefefe] mb-6 text-center">
              {error}
            </h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b101a] text-white">
      <Navbar />
      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 min-h-[79vh]">
        <div className="max-w-3xl w-full bg-[#161b26] rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-[#fefefe] mb-6 text-center">
            {getCoachName(coachEmail)} Players
          </h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#fefefe] mb-3">
              Total Registrations: {players.length}
            </h2>
            {players.length === 0 ? (
              <p className="text-center text-lg text-gray-400">No players found.</p>
            ) : (
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
                  {players.map((player, index) => (
                    <tr key={index} className="border-b border-[#4f545c]">
                      <td className="py-2 px-4">{player.AthleteName}</td>
                      <td className="py-2 px-4">{player.SportName}</td>
                      <td className="py-2 px-4">{player.Position}</td>
                      <td className="py-2 px-4">{player.Performance}</td>
                      <td className="py-2 px-4">{player.Age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoachDashboard;
