"use client";

import React, { useState } from 'react';
import Navbar from '@/app/navbar/navbar';
import Footer from '@/app/footer/footer';

export default function Form() {
  const [formData, setFormData] = useState({
    sport: '',
    date: '',
    match: '',
    performance: '',
    photo: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    const file = files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevState => ({
          ...prevState,
          photo: reader.result.split(',')[1]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const athleteID = 1;

    const formDataToSubmit = {
      sport: formData.sport,
      date: formData.date,
      match: formData.match,
      performance: formData.performance,
      photo: formData.photo || null
    };

    try {
      const response = await fetch(`/api/${athleteID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSubmit)
      });

      const result = await response.json();

      if (result.success) {
        alert('Submission successful!');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b101a] flex flex-col justify-start">
      <Navbar />
      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-[#161b26] rounded-2xl shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden transform transition-all hover:scale-105 duration-500 ease-in-out">
          <div className="px-10 py-12">
            <h1 className="text-center text-3xl font-extrabold text-[#fefefe] mb-6 tracking-tight hover:tracking-wide transition-all duration-300">
              Submit Your Performance
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="sport" className="block text-sm font-semibold text-[#9ea4b0] mb-1">Sport</label>
                <select 
                  id="sport" 
                  name="sport" 
                  value={formData.sport}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out"
                  required
                >
                  <option value="">Select Sport</option>
                  <option value="Football">Football</option>
                  <option value="Hockey">Hockey</option>
                  <option value="Athletics">Athletics</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Javelin">Javelin</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Shooting">Shooting</option>
                  <option value="Weight-lifting">Weight-lifting</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-[#9ea4b0] mb-1">Date</label>
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out" 
                  required
                />
              </div>

              <div>
                <label htmlFor="match" className="block text-sm font-semibold text-[#9ea4b0] mb-1">Match/Event</label>
                <input 
                  type="text" 
                  id="match" 
                  name="match" 
                  value={formData.match}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out" 
                  placeholder="Enter match or event name"
                  required
                />
              </div>

              <div>
                <label htmlFor="performance" className="block text-sm font-semibold text-[#9ea4b0] mb-1">Performance</label>
                <textarea 
                  id="performance" 
                  name="performance" 
                  value={formData.performance}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out" 
                  placeholder="Describe your performance" 
                  rows="4"
                  required
                ></textarea>
              </div>

              <div>
                <label htmlFor="photo" className="block text-sm font-semibold text-[#9ea4b0] mb-1">Upload Photo</label>
                <input 
                  type="file" 
                  id="photo" 
                  name="photo" 
                  onChange={handleFileChange}
                  className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out"
                />
              </div>

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
      <Footer />
    </div>
  );
}
