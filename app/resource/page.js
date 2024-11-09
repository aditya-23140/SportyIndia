"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

export default function Resource() {
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [diet, setDiet] = useState("");
  const [fitness, setFitness] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSports = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/sports");
        if (response.ok) {
          const data = await response.json();
          setSports(data);
        } else {
          setError("Failed to load sports.");
        }
      } catch (error) {
        setError("An error occurred while fetching sports.");
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  useEffect(() => {
    const fetchSportData = async () => {
      if (selectedSport) {
        setLoading(true);
        try {
          const response = await fetch(`/api/sports/${selectedSport}`);
          if (response.ok) {
            const { diet, fitness } = await response.json();
            setDiet(diet);
            setFitness(fitness);
          } else {
            setError("Failed to load diet and fitness data.");
          }
        } catch (error) {
          setError("An error occurred while fetching diet and fitness data.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSportData();
  }, [selectedSport]);

  const handleSportChange = (event) => {
    setSelectedSport(event.target.value);
  };

  return (
    <div className="min-h-screen bg-[#0b101a] text-white">
      <Navbar />

      <div className="flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 min-h-[79vh]">
        <div className="max-w-3xl w-full bg-[#161b26] rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-[#fefefe] mb-6 text-center">
            Diet & Fitness for Athletes
          </h1>

          {loading && <p className="text-center text-[#fefefe]">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          <div>
            <label
              htmlFor="sport"
              className="block text-sm font-semibold text-[#9ea4b0] mb-1"
            >
              Select Sport
            </label>
            <select
              id="sport"
              name="sport"
              className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none"
              onChange={handleSportChange}
            >
              <option value="">Select Sport</option>
              {sports.map((sport) => (
                <option key={sport.SportID} value={sport.Name}>
                  {sport.Name}
                </option>
              ))}
            </select>
          </div>

          {diet && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-[#fefefe] mb-3">Diet Recommendations</h2>
              <p className="text-[#d1d5db] whitespace-pre-line border-l-4 border-[#3983fb] pl-4 leading-relaxed">
                {diet}
              </p>
            </div>
          )}

          {fitness && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-[#fefefe] mb-3">Fitness Recommendations</h2>
              <p className="text-[#d1d5db] whitespace-pre-line border-l-4 border-[#3983fb] pl-4 leading-relaxed">
                {fitness}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
