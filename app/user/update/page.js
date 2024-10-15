"use client";

import React, { useState } from 'react';
import Navbar from '@/app/navbar/navbar';
import Footer from '@/app/footer/footer';

export default function form() {
  return (
    <div className="min-h-screen bg-[#0b101a] flex flex-col justify-start">
      {/* Navbar with SportyIndia Logo */}
      <Navbar/>
      
      {/* Form Section */}
      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-[#161b26] rounded-2xl shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden transform transition-all hover:scale-105 duration-500 ease-in-out">
          <div className="px-10 py-12">
            <h1 className="text-center text-3xl font-extrabold text-[#fefefe] mb-6 tracking-tight hover:tracking-wide transition-all duration-300">
              Submit Your Performance
            </h1>

            <form id="submitForm" className="space-y-6">
              {/* Sport Selection */}
              <div>
                <label htmlFor="sport" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                  Sport
                </label>
                <select 
                  id="sport" 
                  name="sport" 
                  className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out"
                  required
                >
                  <option value="" className="text-[#9ea4b0]">Select Sport</option>
                  <option value="Football">Football</option>
                  <option value="Hockey">Hockey</option>
                  <option value="Athletics">Athletics</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Javeline">Javeline</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Shooting">Shooting</option>
                  <option value="Weight-lifting">Weight-lifting</option>
                </select>
              </div>

              {/* Date Input */}
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                  Date
                </label>
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out" 
                  required
                />
              </div>

              {/* Match/Event Input */}
              <div>
                <label htmlFor="match" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                  Match/Event
                </label>
                <input 
                  type="text" 
                  id="match" 
                  name="match" 
                  className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out" 
                  placeholder="Enter match or event name"
                  required
                />
              </div>

              {/* Performance Textarea */}
              <div>
                <label htmlFor="performance" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                  Performance
                </label>
                <textarea 
                  id="performance" 
                  name="performance" 
                  className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out" 
                  placeholder="Describe your performance" 
                  rows="4"
                  required
                ></textarea>
              </div>

              {/* Photo Upload */}
              {/* <div>
                <label htmlFor="photo" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                  Upload Photo
                </label>
                <input 
                  type="file" 
                  id="photo" 
                  name="photo" 
                  className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out"
                />
              </div> */}

              {/* Submit Button */}
              <div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#3983fb] text-white font-bold rounded-lg hover:bg-[#0b101a] hover:text-[#3983fb] hover:shadow-lg transition-all duration-300 ease-in-out"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
