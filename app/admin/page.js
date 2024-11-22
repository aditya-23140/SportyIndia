"use client";

import Footer from "@/components/footer";
import Loader from "@/components/Loader";
import Navbar from "@/components/navbar";
import React, { useState, useEffect } from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  const monthDiff = new Date().getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && new Date().getDate() < birthDate.getDate())) {
    return age - 1;
  }
  return age;
};

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("athletes");
  const [athletes, setAthletes] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [events, setEvents] = useState([]);
  const [fundings, setFundings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const athletesResponse = await fetch("/api/athletes");
        if (!athletesResponse.ok) throw new Error("Failed to fetch athletes data.");
        const athletesData = await athletesResponse.json();
        setAthletes(athletesData);

        const coachesResponse = await fetch("/api/coaches");
        if (!coachesResponse.ok) throw new Error("Failed to fetch coaches data.");
        const coachesData = await coachesResponse.json();
        setCoaches(coachesData);

        const eventsResponse = await fetch("/api/events");
        if (!eventsResponse.ok) throw new Error("Failed to fetch events data.");
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);

        const fundingsResponse = await fetch("/api/sponsorFund");
        if (!fundingsResponse.ok) throw new Error("Failed to fetch fundings data.");
        const fundingsData = await fundingsResponse.json();
        setFundings(fundingsData.sponsors);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleNameClick = (data, type) => {
    if (type === "athlete") {
      if (localStorage.getItem("loginInfo")) localStorage.removeItem("loginInfo");
      localStorage.setItem("loginInfo", JSON.stringify({ email: data.Email, userId: data.AthleteID }));
      window.location.href = "/user";
    } else if (type === "sponsor") {
      if (localStorage.getItem("sponsorLoginInfo")) localStorage.removeItem("sponsorLoginInfo");
      localStorage.setItem("sponsorLoginInfo", JSON.stringify({ email: data.email, userId: data.id }));
      window.location.href = "/sponsor";
    } else if(type === "coach") {
      if (localStorage.getItem("loginInfo")) localStorage.removeItem("loginInfo");
      localStorage.setItem("loginInfo", JSON.stringify({ email: data.Email, userId: data.CoachID }));
      window.location.href = "/coach";
    }
  };

  if (loading) return <div><Loader /></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Navbar />
      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 min-h-[79vh]">
        <div className="max-w-7xl w-full bg-[#161b26] rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-[#fefefe] mb-6 text-center">
            Admin Dashboard
          </h1>

          <div className="mb-6 flex justify-center space-x-6">
            <button
              onClick={() => handleTabClick("athletes")}
              className={`py-2 px-6 rounded-lg ${selectedTab === "athletes" ? "bg-[#3983fb]" : "bg-[#2b2f3a]"}`}
            >
              Athletes
            </button>
            <button
              onClick={() => handleTabClick("coaches")}
              className={`py-2 px-6 rounded-lg ${selectedTab === "coaches" ? "bg-[#3983fb]" : "bg-[#2b2f3a]"}`}
            >
              Coaches
            </button>
            <button
              onClick={() => handleTabClick("events")}
              className={`py-2 px-6 rounded-lg ${selectedTab === "events" ? "bg-[#3983fb]" : "bg-[#2b2f3a]"}`}
            >
              Events
            </button>
            <button
              onClick={() => handleTabClick("fundings")}
              className={`py-2 px-6 rounded-lg ${selectedTab === "fundings" ? "bg-[#3983fb]" : "bg-[#2b2f3a]"}`}
            >
              Fundings
            </button>
            <button
              onClick={() => handleTabClick("sponsors")}
              className={`py-2 px-6 rounded-lg ${selectedTab === "sponsors" ? "bg-[#3983fb]" : "bg-[#2b2f3a]"}`}
            >
              Sponsors
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
                    <th className="py-2 px-4 text-left">Age</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">ContactNum</th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.map((athlete) => (
                    <tr key={athlete.id} className="hover:underline cursor-pointer" onClick={() => handleNameClick(athlete, "athlete")}>
                      <td className="py-2 px-4">{athlete.AthleteID}</td>
                      <td className="py-2 px-4">{athlete.Name}</td>
                      <td className="py-2 px-4">{athlete.sports}</td>
                      <td className="py-2 px-4">{calculateAge(athlete.DOB)}</td>
                      <td className="py-2 px-4">{athlete.Email}</td>
                      <td className="py-2 px-4">{athlete.ContactNum}</td>
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
                    <th className="py-2 px-4 text-left">Specialization</th>
                    <th className="py-2 px-4 text-left">Guides</th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.map((coach) => (
                    <tr key={coach.CoachID} className="hover:underline cursor-pointer" onClick={() => handleNameClick(coach, "coach")}>
                      <td className="py-2 px-4">{coach.CoachID}</td>
                      <td className="py-2 px-4">{coach.Name}</td>
                      <td className="py-2 px-4">{coach.Specialization}</td>
                      <td className="py-2 px-4">{coach.AthleteNames}</td>
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
                    <th className="py-2 px-4 text-left">Venue</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="py-2 px-4">{event.EventID}</td>
                      <td className="py-2 px-4">{event.EventName}</td>
                      <td className="py-2 px-4">{event.Venue}</td>
                      <td className="py-2 px-4">{formatDate(event.Date)}</td>
                      <td className="py-2 px-4">{event.EventTime}</td>
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
                  {fundings.map((funding, index) => (
                    <>
                      {funding.sponsoredItems.map((items, index) => (
                        <tr key={index}>
                          <td className="py-2 px-4">{items.id}</td>
                          <td className="py-2 px-4">{items.funding_type}</td>
                          <td className="py-2 px-4">{items.sponsor_amount}</td>
                          <td className="py-2 px-4">{items.details.Name || items.details.EventName}</td>
                          <td className="py-2 px-4">{items.name}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {selectedTab === "sponsors" && (
            <div>
              <h2 className="text-xl font-semibold text-[#fefefe] mb-3">Sponsors</h2>
              <table className="min-w-full table-auto text-[#d1d5db]">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">ID</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">ContactNum</th>
                  </tr>
                </thead>
                <tbody>
                  {fundings.map((sponsor, index) => (
                    <tr key={index} className="hover:underline cursor-pointer" onClick={() => handleNameClick(sponsor.sponsor, "sponsor")}>
                      <td className="py-2 px-4">{sponsor.sponsor.id}</td>
                      <td className="py-2 px-4">{sponsor.sponsor.name}</td>
                      <td className="py-2 px-4">{sponsor.sponsor.email}</td>
                      <td className="py-2 px-4">{sponsor.sponsor.contactNum}</td>
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
