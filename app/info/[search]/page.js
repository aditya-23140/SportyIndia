"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Loader from "@/components/Loader";
import ViewMore from "@/components/ViewMore";
import fetchImageData from "@/utils/fetchImageData";

const SearchPage = ({ params }) => {
    const { search } = params;

    const [sportsData, setSportsData] = useState([]);
    const [coachesData, setCoachesData] = useState([]);
    const [athletesData, setAthletesData] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);

    const [visibleSports, setVisibleSports] = useState(8);
    const [visibleCoaches, setVisibleCoaches] = useState(8);
    const [visibleAthletes, setVisibleAthletes] = useState(8);
    const [imageData, setImageData] = useState({});
    const router = useRouter();

    const fetchSearchResults = async (query) => {
        if (!query) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/search/${query}`);
            const data = await response.json();
            setSportsData(data.sports || []);
            setCoachesData(data.coaches || []);
            setAthletesData(data.athletes || []);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (search) {
            fetchSearchResults(search);
        }
        setIsClient(true);
    }, [search]);

    useEffect(() => {
        if (athletesData && athletesData.length > 0) {
            athletesData.forEach((athlete) => {
                if (athlete.profilePicture) {
                    fetchImageData(athlete.AthleteID, athlete.profilePicture, imageData, setImageData);
                }
            });
        }
    }, [athletesData]);

    const getImageUrl = (athleteID, profilePicture) => {
        const imageKey = `${athleteID}_${profilePicture}`;
        return imageData[imageKey] || '/logo.png';
    };

    const handleLearnMore = (sportName) => {
        if (isClient) {
            const router = useRouter();
            router.push(`/sports/${sportName}`);
        }
    };

    const handleViewMoreSports = () => {
        setVisibleSports((prev) => prev + 8);
    };

    const handleViewMoreCoaches = () => {
        setVisibleCoaches((prev) => prev + 8);
    };

    const handleViewMoreAthletes = () => {
        setVisibleAthletes((prev) => prev + 8);
    };

    const hasMoreSports = Array.isArray(sportsData) && visibleSports < sportsData.length;
    const hasMoreCoaches = Array.isArray(coachesData) && visibleCoaches < coachesData.length;
    const hasMoreAthletes = Array.isArray(athletesData) && visibleAthletes < athletesData.length;

    if (loading) {
        return (
            <div className="bg-gray-900 text-white">
                <Navbar />
                <Loader />
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-white">
            <Navbar />

            {/* Search Query Display */}
            <div className="px-6 py-10 bg-gray-800 flex justify-center">
                <h1 className="text-2xl text-white">
                    Results for: <span className="font-bold">{search}</span>
                </h1>
            </div>

            {/* Athletes Section */}
            <div className="px-6 py-10 bg-gray-800">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Athletes</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {athletesData.slice(0, visibleAthletes).map((athlete, index) => (
            <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <Image
                src={imageData[`${athlete.AthleteID}_${athlete.profilePicture}`]?imageData[`${athlete.AthleteID}_${athlete.profilePicture}`]:'/logo.png'}
                alt={athlete.name}
                width={200}
                height={200}
                className="rounded-full mx-auto mb-4 cursor-pointer"
                onClick={()=>router.push(`/athletes/${athlete.AthleteID}`)}
              />
              {console.log(athlete)}
              <h3 className="text-xl font-bold text-white">{athlete.Name}</h3>
              <p className="text-gray-400">{athlete.sports}</p>
            </div>
          ))}
                </div>
                {hasMoreAthletes && (
                    <div onClick={handleViewMoreAthletes} className="w-full flex justify-center">
                        <ViewMore />
                    </div>
                )}
            </div>

            {/* Coaches Section */}
            <div className="px-6 py-10 bg-gray-800">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Coaches</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {coachesData.slice(0, visibleCoaches).map((coach, index) => (
            <div key={coach.CoachID} className="bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <Image
                src={imageData[`${coach.AthleteID}_${coach.profilePicture}`]?imageData[`${coach.AthleteID}_${coach.profilePicture}`]:'/logo.png'}
                alt={coach.name}
                width={200}
                height={200}
                className="rounded-full mx-auto mb-4 cursor-pointer"
                onClick={()=>router.push(`/coach/${coach.Email}`)}
              />
              <h3 className="text-xl font-bold text-white">{coach.Name}</h3>
              <p className="text-gray-400 cursor-pointer" onClick={()=>router.push(`/info/${coach.Specialization}`)}>{coach.Specialization}</p>
            </div>
          ))}
                </div>
                {hasMoreCoaches && (
                    <div onClick={handleViewMoreCoaches} className="w-full flex justify-center">
                        <ViewMore />
                    </div>
                )}
            </div>

            {/* Sports Section */}
            <div className="accordion-container px-6 py-10 bg-gray-800">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Sports</h2>
                <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {sportsData.length>0?sportsData.slice(0, visibleSports).map((sport, index) => (
                        <div key={index} className="accordion-item bg-gray-700 p-6 mb-4 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold">{sport.Name}</h3>
                            <p className="text-sm text-gray-400">Category: {sport.Category}</p>
                            <p className="text-gray-300 mt-2">Explore resources tailored for {sport.Name} sport.</p>
                            <button
                                onClick={() => handleLearnMore(sport.Name)}
                                className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Learn more
                            </button>
                        </div>
                    )):""}
                </div>
                {hasMoreSports && (
                    <div onClick={handleViewMoreSports} className="w-full flex justify-center">
                        <ViewMore />
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default SearchPage;
