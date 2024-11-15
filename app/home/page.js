"use client";
import React, { useState, useEffect } from "react";
import { FaUsers, FaCheckCircle, FaTasks, FaRocket, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import Footer from "../../components/footer";
import Link from "next/link";
import Loader from "@/components/Loader";

const sportyIndia = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [userInfoExists, setUserInfoExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    postsCount: 0,
    athletesCount: 0,
    eventsCount: 0,
  });

  useEffect(() => {
    const userInfo = localStorage.getItem('loginInfo');
    setUserInfoExists(!!userInfo);

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/home');
        const data = await response.json();
        if (response.ok) {
          setStats({
            postsCount: data.postsCount,
            athletesCount: data.athletesCount,
            eventsCount: data.eventsCount,
          });
        } else {
          console.error('Failed to fetch stats:', data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col text-white relative overflow-hidden">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col text-white relative overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        autoPlay
        loop
        muted
        src="/olympics.mp4"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent"></div>

      <header className="flex justify-between items-center px-6 py-5 shadow-lg relative z-0">
        <div className="text-4xl font-bold">
          <a href="/">Sporty<span className="text-blue-500">india</span></a>
        </div>
        <div className="hidden md:flex">
          <nav>
            <ul className="flex space-x-8">
              {["athletes", "challenges", "dashboard", "resource"].map((item) => (
                <li key={item}>
                  <a
                    href={"/" + item}
                    className="text-white hover:text-blue-500 transition duration-200 text-lg font-medium"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                </li>
              ))}
            </ul>

          </nav>
        </div>
        <div className="hidden md:flex space-x-4">

          <Link href="/fund">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-200 transform hover:scale-105">
              + Sponsor
            </button>
          </Link>
          {!userInfoExists ? (<button className="border border-white hover:border-blue-500 hover:text-blue-500 text-white py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105">
            <Link href="/login" className="text-white hover:text-blue-500 transition duration-200">
              Sign In or Create Account
            </Link>
          </button>) : (<a href="/user"><FaUser className="text-3xl my-2" /></a>)}
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={toggleNav} className="text-white">
            {isNavOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isNavOpen && (
        <div className="md:hidden bg-gray-800 p-4 flex flex-col space-y-4 text-center relative z-10">
          <nav>
            <ul className="space-y-4">
              {["athletes", "challenges", "spotlight", "blog"].map((item) => (
                <li key={item}>
                  <a href={"/" + item} className="text-white hover:text-blue-500 transition duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
            <a href="/admin">
              + Admin</a>
          </button>
          <button className="border border-white hover:border-blue-500 hover:text-blue-500 text-white py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
            <a href="/login">Sign In or Create Account</a>
          </button>
        </div>
      )}

      <main className="text-center mt-16 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center items-center mb-4">
            <p className="text-green-400 text-sm font-medium flex items-center">
              <FaRocket className="mr-2 text-yellow-100" />
              {stats.postsCount} NEW POSTS THIS WEEK!
            </p>
          </div>
          <h1 className="text-6xl font-bold text-gray-300 mb-4">
            The Largest Platform
          </h1>
          <h1 className="text-6xl font-bold text-gray-300 mb-6">
            for Athletes
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-cursive mb-12">
            Community-built platform of Athletes from all over India. Hire as
            Recruiter, Coach, Teacher, and Professionals.
          </p>

          <div className="relative w-full flex justify-center mb-10">
            <div className="flex bg-white rounded-full p-1 w-96 items-center shadow-lg transform translate-y-[-25%] transition duration-300 hover:scale-105">
              <input
                type="text"
                placeholder="Search for name, sport, ratings..."
                className="flex-grow bg-transparent outline-none px-4 py-3 text-gray-900 rounded-l-full focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-500 text-white py-2 px-6 rounded-full transition hover:bg-blue-600">
                Search
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <div className="flex z-1 py-20 px-6 pt-28 items-center justify-center flex-wrap gap-10 relative z-10">
        <StatCard
          icon={<FaUsers className="w-10 h-10 mb-4 text-gray-400" />}
          number={stats.athletesCount}
          description="Athletes Registered"
        />
        <StatCard
          icon={<FaCheckCircle className="w-10 h-10 mb-4 text-gray-400" />}
          number="100%"
          description="Legit for athletes to use and browse"
        />
        <StatCard
          icon={<FaTasks className="w-10 h-10 mb-4 text-gray-400" />}
          number={stats.eventsCount}
          description="Events participation"
        />
      </div>

      <CustomAccordion />
      <Footer />
    </div>
  );
};

const CustomAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const items = [
    {
      "title": "What is Sporty India?",
      "content": "Sporty India is a platform dedicated to storing and showcasing athletes' data across various sports. Our mission is to help athletes get the recognition they deserve by providing them with access to essential resources, data analytics, and exposure to talent scouts, sponsors, and organizations. Sporty India aims to bridge the gap between athletes and opportunities."
    },
    {
      "title": "Why Sporty India?",
      "content": "Sporty India exists to empower athletes by giving them a space to manage their profiles, track their progress, and gain exposure to a broader audience. We believe that every athlete should have the chance to be acknowledged for their talents and achievements. Sporty India helps athletes connect with key stakeholders in the sports industry, opening doors to potential collaborations, sponsorships, and career growth."
    },
    {
      "title": "Is Sporty India Paid?",
      "content": "Sporty India is completely free of cost. We believe that every athlete deserves the opportunity to showcase their skills and achievements without any financial barriers. Our platform provides free access to all athletes, allowing them to create profiles and gain visibility within the sports community."
    }
    ,
  ];

  return (
    <div className="mt-10 relative z-1">
      {items.map((item, index) => (
        <div key={index} className="border-b border-gray-600">
          <button
            className="flex justify-between items-center w-full p-4 bg-gray-800 focus:outline-none hover:bg-gray-700"
            onClick={() => handleToggle(index)}
          >
            <span className="text-lg font-semibold">{item.title}</span>
            <span className={`transition-transform ${openIndex === index ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
          {openIndex === index && (
            <div className="p-4 bg-gray-700">
              <p>{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ icon, number, description }) => {
  return (
    <motion.div
      className="text-center max-w-[220px] flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg transition duration-300 hover:shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {icon}
      <span className="text-5xl font-extrabold md:text-6xl text-white">
        {number}
      </span>
      <p className="mt-2 text-base font-semibold text-gray-400">
        {description}
      </p>
    </motion.div>
  );
};

export default sportyIndia;