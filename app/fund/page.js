"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import React, { useState } from "react";

export default function FundGeneration() {
  const [fundingType, setFundingType] = useState("");
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const donationData = {
      name: donorName,
      amount: amount,
      message: message,
      type: fundingType,
    };

    console.log("Donation submitted", donationData);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#0b101a] text-white">
      <Navbar/>

      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full bg-[#161b26] rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-[#fefefe] mb-6 text-center">
            Support Athletes & Events
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Funding Type Selection */}
            <div className="mb-6">
              <label
                htmlFor="fundingType"
                className="block text-sm font-semibold text-[#9ea4b0] mb-1"
              >
                Select Funding Type
              </label>
              <select
                id="fundingType"
                name="fundingType"
                className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none"
                onChange={(e) => setFundingType(e.target.value)}
                value={fundingType}
              >
                <option value="">Choose Funding Option</option>
                <option value="Event">Event Funding</option>
                <option value="Athlete">Athlete Sponsorship</option>
              </select>
            </div>

            {/* Donor Name */}
            <div className="mb-6">
              <label
                htmlFor="donorName"
                className="block text-sm font-semibold text-[#9ea4b0] mb-1"
              >
                Your Name
              </label>
              <input
                type="text"
                id="donorName"
                name="donorName"
                className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none"
                onChange={(e) => setDonorName(e.target.value)}
                value={donorName}
                required
              />
            </div>

            {/* Donation Amount */}
            <div className="mb-6">
              <label
                htmlFor="amount"
                className="block text-sm font-semibold text-[#9ea4b0] mb-1"
              >
                Donation Amount (in INR)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                required
              />
            </div>

            {/* Message (Optional) */}
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-[#9ea4b0] mb-1"
              >
                Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-[#3983fb] text-white px-6 py-2 rounded-lg"
              >
                Submit Donation
              </button>
            </div>
          </form>

          {/* Success Message */}
          {success && (
            <div className="mt-6 text-center text-green-400">
              <h2 className="text-xl font-semibold">Thank you for your support!</h2>
              <p>Your donation is greatly appreciated.</p>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
