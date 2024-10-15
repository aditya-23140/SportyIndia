"use client"
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
const User = () => {
    const [user, setUser] = useState(null);
    const [sports, setSports] = useState(["Football", "Cricket"]);

    useEffect(() => {
        const storedUser = localStorage.getItem("userInfo");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-white">
            <Navbar />
            <main className="flex flex-col md:flex-row p-6 space-x-0 md:space-x-6">
                <div className="w-full md:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg mb-6 md:mb-0">
                    <h2 className="text-xl font-semibold mb-4">Recent Data</h2>
                    <ul className="space-y-4">
                        <li className="p-4 bg-gray-700 rounded-lg">Recent Upload 1</li>
                        <li className="p-4 bg-gray-700 rounded-lg">Recent Upload 2</li>
                    </ul>
                </div>

                <div className="w-full md:w-3/4 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-6">
                        <img
                            src="/logo.png"
                            alt="Profile"
                            className="rounded-full w-24 h-24 border-2 border-gray-700"
                        />
                        <div className="ml-4">
                            <h1 className="text-2xl font-bold">{user ? user.full_name : "Loading..."}</h1>
                            <p className="text-gray-400">{user ? user.email : ""}</p>
                            <p className="mt-1">Some bio about the user goes here.</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Sports Registered</h2>
                        {sports.length > 0 ? (
                            <ul className="space-y-4">
                                {sports.map((sport, index) => (
                                    <li key={index} className="p-4 bg-gray-700 rounded-lg">{sport}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">None</p>
                        )}
                        <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-200">
                            <a href="/user/update">Update Sports</a>
                        </button>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Equipments Accessed</h2>
                        <ul className="space-y-4">
                            <li className="p-4 bg-gray-700 rounded-lg">
                                <h3 className="font-semibold">TreadMill</h3>
                                <p className="text-gray-400">Description of TreadMill.</p>
                            </li>
                            <li className="p-4 bg-gray-700 rounded-lg">
                                <h3 className="font-semibold">DumBell</h3>
                                <p className="text-gray-400">Description of DumBell.</p>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Activity</h2>
                        <div className="p-4 bg-gray-700 rounded-lg">
                            <p className="text-gray-400">No recent activity found.</p>
                            <div className="h-32 bg-gray-600 mt-2 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default User;
