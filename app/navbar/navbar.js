"use client";
import { useState } from "react";
import { FaCog, FaUser, FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import { IoHelpOutline, IoHomeSharp } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="flex justify-between items-center px-6 py-5 shadow-lg">
      <div className="text-3xl md:text-4xl font-bold">
        <a href="/home">Sporty<span className="text-blue-500">India</span></a>
      </div>


      {/* Search Bar */}
      <div className="hidden md:flex items-center flex-grow max-w-xs space-x-3 mr-[100px]">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Profile Section */}
      <div className="relative">
        <button onClick={toggleDropdown} className="flex items-center space-x-2">
          <img
            src="/logo.png" // Replace with dynamic profile pic
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
        </button>
        {showDropdown && (
          <motion.div
            className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="py-2">
              {/* Search Bar inside Dropdown for Small Screens */}
              <li className="px-4 py-2 hover:bg-gray-700 md:hidden">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </li>
              <li className="px-4 py-2 hover:bg-gray-700 flex items-center space-x-2">
                <IoHomeSharp />
                <a href="/"><span>Home</span></a>
              </li>
              <li className="px-4 py-2 hover:bg-gray-700 flex items-center space-x-2">
                <MdDashboard />
                <a href="/dashboard"><span>Dashboard</span></a>
              </li>
              <li className="px-4 py-2 hover:bg-gray-700 flex items-center space-x-2">
                <FaUser />
                <a href="/user"><span>Profile</span></a>
              </li>
              <li className="px-4 py-2 hover:bg-gray-700 flex items-center space-x-2">
                <FaCog />
                <span>Settings</span>
              </li>
              <li className="px-4 py-2 hover:bg-gray-700 flex items-center space-x-2" onClick={()=>localStorage.removeItem("userInfo")}>
                <FiLogOut className="text-[22px]"/>
                <a href="/home"><span>LogOut</span></a>
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </header>
  );
}
