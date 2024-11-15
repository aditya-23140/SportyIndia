"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/router';
import fetchImageData from "@/utils/fetchImageData";
import Loader from "@/components/Loader";
import ViewMore from "@/components/ViewMore";

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sportsData, setSportsData] = useState([]);
  const [coachesData, setCoachesData] = useState([]);
  const [athletesData, setAthletesData] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  const [visibleSports, setVisibleSports] = useState(8);
  const [visibleCoaches, setVisibleCoaches] = useState(8);
  const [visibleAthletes, setVisibleAthletes] = useState(8);
  const [visibleVideos, setVisibleVideos] = useState(8);
  const [imageData, setImageData] = useState({});

  const slides = [
    { src: "/ichigo.jpg", alt: "Slide 1" },
    { src: "/bg.avif", alt: "Slide 2" },
    { src: "/ichigo.jpg", alt: "Slide 3" },
  ];

  const getEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') {
      return null;
    }

    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|(?:v=|e(?:mbed)?\/))([a-zA-Z0-9_-]+)|youtu\.be\/([a-zA-Z0-9_-]+))/;
    const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/reel\/([A-Za-z0-9_-]+)/;

    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1] || youtubeMatch[2];
      return { embedUrl: `https://www.youtube.com/embed/${videoId}`, platform: 'youtube' };
    }

    const instagramMatch = url.match(instagramRegex);
    if (instagramMatch) {
      const reelId = instagramMatch[1];
      return { embedUrl: `https://www.instagram.com/p/${reelId}/embed`, platform: 'instagram' };
    }

    return null;
  };

  const fetchSportsData = async () => {
    try {
      const response = await fetch("/api/sports");
      const data = await response.json();
      setSportsData(data);
    } catch (error) {
      console.error("Error fetching sports data:", error);
    }
  };

  const fetchCoachesData = async () => {
    try {
      const response = await fetch("/api/coaches");
      const data = await response.json();
      setCoachesData(data);
    } catch (error) {
      console.error("Error fetching coaches data:", error);
    }
  };

  const fetchAthletesData = async () => {
    try {
      const response = await fetch("/api/athletes");
      const data = await response.json();
      setAthletesData(data);
    } catch (error) {
      console.error("Error fetching athletes data:", error);
    }
  };

  const fetchRecentVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      setRecentVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchSportsData();
    fetchCoachesData();
    fetchAthletesData();
    fetchRecentVideos();

    setIsClient(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 2000);
    
    setLoading(false);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
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

  const handleViewMoreVideos = () => {
    setVisibleVideos((prev) => prev + 8);
  };

  const hasMoreSports = visibleSports < sportsData.length;
  const hasMoreCoaches = visibleCoaches < coachesData.length;
  const hasMoreAthletes = visibleAthletes < athletesData.length;
  const hasMoreVideos = visibleVideos < recentVideos.length;

  useEffect(() => {
    if (athletesData && athletesData.length > 0) {
      athletesData.forEach((athlete) => {
        if (athlete.profilePicture) {
          fetchImageData(athlete.AthleteID, athlete.profilePicture, imageData, setImageData);
        }
      });
    }
  }, [athletesData]);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white">
        <Navbar/>
        <Loader />
        <Footer/>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white">
      <Navbar />

      {/* Slider Section */}
      <div className="relative w-full bg-gray-800 z-0">
        <div className="relative h-72 overflow-hidden md:h-96 z-0">
          <AnimatePresence>
            {slides.map((slide, index) => (
              index === currentSlide && (
                <motion.div
                  key={index}
                  className="absolute w-full h-full"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    layout="fill"
                    className="object-cover"
                  />
                </motion.div>
              )
            ))}
          </AnimatePresence>
          <div className="absolute z-30 bottom-5 left-1/2 transform -translate-x-1/2 space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-blue-600" : "bg-gray-300"}`}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Videos Section */}
      <div className="px-6 py-10">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Recent Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recentVideos.slice(0, visibleVideos).map((video, index) => {
            const { embedUrl, platform } = getEmbedUrl(video.URL) || {};
            const isInstagram = platform === 'instagram';
            return (
              <motion.div
                key={index}
                className="relative rounded-lg overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {embedUrl ? (
                  <div className="relative" style={{ paddingBottom: isInstagram ? "112.5%" : "56.25%" }}>
                    <iframe
                      width="100%"
                      height="100%"
                      src={embedUrl}
                      title="Video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                  </div>
                ) : (
                  <p className="text-gray-400">Invalid Video URL</p>
                )}
              </motion.div>
            );
          })}
        </div>
        {hasMoreVideos && (
          <div onClick={handleViewMoreVideos} className="w-full flex justify-center">
            <ViewMore />
          </div>
        )}
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
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-white">{athlete.Name}</h3>
              <p className="text-gray-400">{athlete.sport}</p>
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
            <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <Image
                src={imageData[`${coach.AthleteID}_${coach.profilePicture}`]?imageData[`${coach.AthleteID}_${coach.profilePicture}`]:'/logo.png'}
                alt={coach.name}
                width={200}
                height={200}
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-white">{coach.Name}</h3>
              <p className="text-gray-400">{coach.Specialization}</p>
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
          {sportsData.slice(0, visibleSports).map((sport, index) => (
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
          ))}
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

export default Dashboard;
