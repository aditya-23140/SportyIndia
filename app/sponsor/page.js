'use client';

import { useState, useEffect } from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";

export default function SponsorPage() {
  const [sponsorInfo, setSponsorInfo] = useState(null);
  const [sponsoredItems, setSponsoredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fundingType, setFundingType] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [sponsorAmount, setSponsorAmount] = useState("");
  const [sponsorMessage, setSponsorMessage] = useState("");  // New state for sponsor message
  const [athletes, setAthletes] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const sponsorLoginInfo = localStorage.getItem('sponsorLoginInfo');

    if (!sponsorLoginInfo) {
      router.push('/login');
      return;
    }

    const fetchSponsorData = async () => {
      const parsedLoginInfo = JSON.parse(sponsorLoginInfo);
      const response = await fetch('/api/sponsor', {
        method: 'GET',
        headers: {
          'Authorization': JSON.stringify({ id: parsedLoginInfo.userId }),
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSponsorInfo(data.sponsor);
        setSponsoredItems(data.sponsoredItems);
      } else {
        console.error("Error fetching sponsor data:", data.message);
      }
      setLoading(false);
    };

    fetchSponsorData();
  }, [router]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short", 
      year: "numeric",
      month: "short", 
      day: "numeric",
    });
  };

  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    const fetchOptions = async () => {
      if (!fundingType) return;

      let apiUrl = "";
      if (fundingType === "athlete") {
        apiUrl = "/api/athletes";
      } else if (fundingType === "coach") {
        apiUrl = "/api/coaches";
      } else if (fundingType === "event") {
        apiUrl = "/api/events";
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        if (fundingType === "athlete") setAthletes(data);
        if (fundingType === "coach") setCoaches(data);
        if (fundingType === "event") setEvents(data);
      } else {
        console.error("Error fetching options:", data.message);
      }
      setSelectedOptionId(null);
    };

    fetchOptions();
  }, [fundingType]);

  const handleAddSponsor = async () => {
    if (!fundingType || !selectedOptionId || !sponsorAmount) {
      alert("Please select both funding type, option, and amount");
      return;
    }
    
    const sponsorLoginInfo = localStorage.getItem('sponsorLoginInfo');
    const parsedLoginInfo = JSON.parse(sponsorLoginInfo);
    const response = await fetch("/api/sponsor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': JSON.stringify({ id: parsedLoginInfo.userId }),
      },
      body: JSON.stringify({
        fundingType,
        typeId: selectedOptionId,
        sponsorAmount,
        sponsorMessage, 
      }),
    });

    if (response.ok) {
      alert("Sponsor added successfully!");
      setIsModalOpen(false);
      setSponsorAmount("");
      setSponsorMessage("");  
    } else {
      alert("Error adding sponsor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b101a] text-white">
        <Navbar />
        <div className="flex justify-center items-center h-full">
          <span className="text-xl text-white">Loading...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b101a] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto bg-[#161b26] rounded-2xl shadow-lg p-8 m-4 min-h-[74.5vh]">
        <h1 className="text-3xl font-extrabold text-[#fefefe] mb-6 text-center">
          Sponsor Profile
        </h1>

        <div className="mb-6">
          <h2 className="text-2xl text-[#9ea4b0]">Name: {sponsorInfo?.name}</h2>
          <p className="text-sm text-[#9ea4b0]">Email: {sponsorInfo?.email}</p>
          <p className="text-sm text-[#9ea4b0]">Contact: {sponsorInfo?.contactNum}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#9ea4b0]">Sponsored</h3>
          <ul>
            {sponsoredItems.length === 0 ? (
              <p className="text-sm text-[#9ea4b0]">No sponsorships found.</p>
            ) : (
              sponsoredItems.map((item, index) => (
                <li key={index} className="text-[#fefefe] mb-4">
                  {item.funding_type === "athlete" && (
                    <div>
                      <h4>Athlete: {item.details.Name}</h4>
                      <p>Age: {calculateAge(item.details.DOB)}</p>
                    </div>
                  )}
                  {item.funding_type === "coach" && (
                    <div>
                      <h4>Coach: {item.details.Name}</h4>
                      <p>Email: {item.details.Email} years</p>
                    </div>
                  )}
                  {item.funding_type === "event" && (
                    <div>
                      <h4>Event: {item.details.EventName}</h4>
                      <p>Date: {formatDate(item.details.Date)}</p>
                      <p>Time: {item.details.EventTime}</p>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 px-6 py-2 bg-[#1f7a8c] rounded-lg text-white"
        >
          Add Sponsor
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 bg-black flex justify-center items-center">
            <div className="bg-[#161b26] p-6 rounded-lg w-96">
              <h3 className="text-xl font-semibold text-[#fefefe] mb-4">Add Sponsor</h3>

              <div className="mb-4">
                <label className="block text-[#9ea4b0]">Funding Type</label>
                <select
                  value={fundingType}
                  onChange={(e) => setFundingType(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[#1c1f25] text-white"
                >
                  <option value="">Select Funding Type</option>
                  <option value="athlete">Athlete</option>
                  <option value="coach">Coach</option>
                  <option value="event">Event</option>
                </select>
              </div>

              {fundingType && (
                <div className="mb-4">
                  <label className="block text-[#9ea4b0]">Select {fundingType.charAt(0).toUpperCase() + fundingType.slice(1)}</label>
                  <select
                    value={selectedOptionId || ""}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setSelectedOptionId(selectedId);
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-[#1c1f25] text-white"
                  >
                    <option value="">Select {fundingType.charAt(0).toUpperCase() + fundingType.slice(1)}</option>
                    {(fundingType === "athlete" ? athletes : fundingType === "coach" ? coaches : events).map((option,index) => (
                      <option key={index} value={option.AthleteID || option.CoachID || option.EventID}>
                        {option.Name || option.EventName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-[#9ea4b0]">Amount</label>
                <input
                  type="number"
                  value={sponsorAmount}
                  onChange={(e) => setSponsorAmount(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[#1c1f25] text-white"
                  placeholder="Enter amount"
                />
              </div>

              {/* New Sponsor Message Input */}
              <div className="mb-4">
                <label className="block text-[#9ea4b0]">Sponsor Message</label>
                <textarea
                  value={sponsorMessage}
                  onChange={(e) => setSponsorMessage(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[#1c1f25] text-white"
                  placeholder="Enter a message (optional)"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAddSponsor}
                  className="px-6 py-2 bg-[#1f7a8c] rounded-lg text-white"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
