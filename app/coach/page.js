"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { MdDeleteForever } from "react-icons/md";
import { MdEditDocument } from "react-icons/md";

export default function CoachDashboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [newPosition, setNewPosition] = useState('');
  const [newPerformance, setNewPerformance] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const storedUser = localStorage.getItem("loginInfo");
        if (!storedUser) {
          setError("No user data found in localStorage");
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const email = parsedUser.email;

        if (!email) {
          setError("No coach email found in localStorage");
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/coaches/${email}`);
        const data = await res.json();

        if (res.ok) {
          setPlayers(data.players);
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
  }, []);

  const handleDelete = async (athleteID) => {
    try {
      const storedUser = localStorage.getItem("loginInfo");
      if (!storedUser) {
        setError("No user data found in localStorage");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const email = parsedUser.email;

      if (!email) {
        setError("No coach email found in localStorage");
        return;
      }

      const res = await fetch(`/api/coaches/${email}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ athleteID }),
      });

      const data = await res.json();

      if (res.ok) {
        setPlayers(players.filter(player => player.AthleteID !== athleteID));
      } else {
        setError(data.error || "Failed to delete player");
      }
    } catch (error) {
      setError("Failed to delete player");
    }
  };

  const handleEdit = async () => {
    if (!editingPlayer || !newPosition || !newPerformance) {
      setError("Position and Performance are required");
      return;
    }

    try {
      const storedUser = localStorage.getItem("loginInfo");
      if (!storedUser) {
        setError("No user data found in localStorage");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const email = parsedUser.email;

      if (!email) {
        setError("No coach email found in localStorage");
        return;
      }
      const { AthleteID, SportName } = editingPlayer;
      const res = await fetch(`/api/coaches/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          athleteID: AthleteID,
          SportName: SportName,
          position: newPosition,
          performance: newPerformance,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPlayers(players.map(player => 
          player.AthleteID === AthleteID ? { ...player, Position: newPosition, Performance: newPerformance } : player
        ));
        setEditingPlayer(null);
        setNewPosition('');
        setNewPerformance('');
      } else {
        setError(data.error || "Failed to update player");
      }
    } catch (error) {
      setError("Failed to update player");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b101a] text-white">
        <Navbar />
        <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl w-full bg-[#161b26] rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-extrabold text-[#fefefe] mb-6 text-center">
              Loading Players...
            </h1>
          </div>
        </div>
        <Footer />
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
            Your Players
          </h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#fefefe] mb-3">
              Total Registerations: {players.length}
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
                  {players.map((player,index) => (
                    <tr key={index} className="border-b border-[#4f545c] relative">
                      <td className="py-2 px-4">{player.AthleteName}</td>
                      <td className="py-2 px-4">{player.SportName}</td>
                      <td className="py-2 px-4">{player.Position}</td>
                      <td className="py-2 px-4">{player.Performance}</td>
                      <td className="py-2 px-4">{player.Age}
                        <MdEditDocument 
                          className="absolute inline top-[6px] right-3 text-[22px] text-red-100 cursor-pointer" 
                          onClick={() => setEditingPlayer(player)} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {players.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-[#fefefe] mb-3">
                Detailed Player Information
              </h2>
              {players.map((player,index) => (
                <div key={index} className="bg-[#2b2f3a] p-4 rounded-lg mb-4 relative">
                  <MdDeleteForever 
                    className="absolute right-3 top-3 text-2xl text-red-300 cursor-pointer" 
                    onClick={() => handleDelete(player.AthleteID)} 
                  />
                  <h3 className="text-lg font-semibold text-[#3983fb]">{player.AthleteName}</h3>
                  <p>
                    <strong>Sport:</strong> {player.SportName}
                  </p>
                  <p>
                    <strong>Age:</strong> {player.Age}
                  </p>
                  <p>
                    <strong>Position:</strong> {player.Position}
                  </p>
                  <p>
                    <strong>Performance Level:</strong> {player.Performance}
                  </p>
                  <p>
                    <strong>Athlete Email:</strong> {player.AthleteEmail}
                  </p>
                  <p>
                    <strong>Contact Number:</strong> {player.ContactNum}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editingPlayer && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-[#161b26] rounded-lg p-8 w-96">
            <h3 className="text-xl font-semibold text-[#fefefe] mb-4">Edit Player Info</h3>
            <div>
              <label className="text-[#fefefe]">Position</label>
              <input 
                type="text" 
                value={newPosition} 
                onChange={(e) => setNewPosition(e.target.value)} 
                className="w-full bg-[#2b2f3a] text-[#d1d5db] py-2 px-4 mb-4 rounded-lg" 
              />
            </div>
            <div>
              <label className="text-[#fefefe]">Performance</label>
              <input 
                type="text" 
                value={newPerformance} 
                onChange={(e) => setNewPerformance(e.target.value)} 
                className="w-full bg-[#2b2f3a] text-[#d1d5db] py-2 px-4 mb-4 rounded-lg" 
              />
            </div>
            <button onClick={handleEdit} className="bg-[#3983fb] text-white py-2 px-4 rounded-lg">Save Changes</button>
            <button onClick={() => setEditingPlayer(null)} className="bg-red-500 text-white py-2 px-4 rounded-lg mt-2 ml-[6rem]">Cancel</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
