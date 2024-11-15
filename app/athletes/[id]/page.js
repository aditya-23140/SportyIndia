"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { MdAddCall, MdEditNote } from "react-icons/md";
import Loader from "@/components/Loader";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CoachList, AchievementList, SportList, ActivityList, UploadList } from "@/components/staticList";
import fetchImageData from "@/utils/fetchImageData";

const AthletePage = ({ params }) => {
    const { id } = params;

    const [athlete, setAthlete] = useState(null);
    const [sports, setSports] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [events, setEvents] = useState([]);
    const [videos, setRecentUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageData, setImageData] = useState({});

    const fetchAthleteData = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`;
            const url = `${baseUrl}/api/${id}`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('Failed to fetch athlete data');
            }
            const data = await res.json();

            if (data.success) {
                if (data.athlete) {
                    setAthlete(data.athlete);
                    setCoaches(data.athlete.Coaches ? data.athlete.Coaches.split(",") : []);
                    setAchievements(data.athlete.Achievements ? data.athlete.Achievements.split(",") : []);
                }
                if (data.sports) {
                    setSports(data.sports);
                }
                if (data.events) {
                    setEvents(data.events);
                }
                if (data.videos) {
                    setRecentUploads(data.videos.map(video => video.url));
                }
            }

            // const urlWithoutId = window.location.pathname.split('/').slice(0, -1).join('/');
            // window.history.replaceState(null, '', urlWithoutId);
        } catch (error) {
            console.error("Error fetching athlete data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAthleteData();
    }, [id]);

    useEffect(() => {
        if (athlete && athlete.profilePicture) {
            console.log(imageData)
            fetchImageData(athlete.AthleteID, athlete.profilePicture, imageData, setImageData);
            console.log(imageData)
        }
    }, [athlete]);
    

    if (loading || !athlete) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-white">
                <Navbar />
                <Loader />
                <Footer />
            </div>
        );
    }

    const coachList = coaches.length ? coaches : ["No coaches assigned"];
    const achievementList = achievements.length ? achievements : ["No achievements found"];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-white">
            <Navbar />
            <main className="flex flex-col md:flex-row p-6 space-x-0 md:space-x-6">
                <UploadList
                    recentUploads={videos}
                    shouldModify={false}
                />
                <div className="w-full md:w-3/4 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-6 relative">
                        <img
                            src={imageData[`${athlete.AthleteID}_${athlete.profilePicture}`] ? imageData[`${athlete.AthleteID}_${athlete.profilePicture}`] : '/logo.png'}
                            alt="Profile"
                            className="rounded-full w-24 h-24 border-2 border-gray-700"
                        />
                        <div className="ml-4">
                            <h1 className="text-2xl font-bold">{athlete.Name}</h1>
                            <p className="text-gray-400">{athlete.Address}</p>
                            <p className="text-gray-400">{athlete.Email}</p>
                            <p className="text-gray-400">
                                <MdAddCall className="inline mr-2" />
                                {athlete.ContactNum}
                            </p>
                        </div>
                    </div>

                    <CoachList coaches={coachList} shouldModify={false} />
                    <AchievementList achievements={achievementList} shouldModify={false} />
                    <SportList sports={sports} shouldModify={false} />
                    <ActivityList events={events} shouldModify={false} />
                </div>
            </main>

            <Footer />
            <ToastContainer theme="dark" position="top-left" />
        </div>
    );
};

export default AthletePage;
