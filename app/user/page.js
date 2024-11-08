'use client'

import React, { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { MdAddCall } from "react-icons/md";

const User = () => {
  const [user, setUser] = useState(null);
  const [athlete, setAthlete] = useState(null);
  const [sports, setSports] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentUploads, setRecentUploads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const getYouTubeEmbedUrl = (url) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|(?:v=|e(?:mbed)?\/))([a-zA-Z0-9_-]+)|youtu\.be\/([a-zA-Z0-9_-]+))/;

    const match = url.match(youtubeRegex);

    if (match) {
      const videoId = match[1] || match[2];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return null;
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`/api/${userId}`);
      const data = await response.json();

      if (data.success) {
        if (data.athlete) {
          setAthlete(data.athlete);
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
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("loginInfo");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserData(parsedUser.userId);
    } else {
      setLoading(false);
    }
  }, []);

  const bufferToBase64 = (buffer) => {
    return `data:image/png;base64,${buffer.toString('base64')}`;
  };

  const handleAddUrl = async () => {
    if (videoUrl) {
      try {
        const response = await fetch(`/api/${user.userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: "add_video",
            videoUrl: videoUrl,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setRecentUploads([...recentUploads, videoUrl]);
          setVideoUrl("");
          setIsModalOpen(false);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error adding video URL:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-black to-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-white">
      <Navbar />
      <main className="flex flex-col md:flex-row p-6 space-x-0 md:space-x-6">
        <div className="w-full md:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg mb-6 md:mb-0">
          <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
          <ul className="space-y-4">
            {recentUploads.length > 0 ? (
              recentUploads.map((upload, index) => {
                const youtubeEmbedUrl = getYouTubeEmbedUrl(upload);
                return (
                  <li key={index} className="p-4 bg-gray-700 rounded-lg">
                    {youtubeEmbedUrl ? (
                      <div className="relative" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          width="100%"
                          height="100%"
                          src={youtubeEmbedUrl}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full"
                        ></iframe>
                      </div>
                    ) : (
                      <p className="text-gray-400">Invalid YouTube URL</p>
                    )}
                  </li>
                );
              })
            ) : (
              <p className="text-gray-400">No recent uploads found.</p>
            )}
          </ul>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-200"
          >
            Add Video URL
          </button>
        </div>

        <div className="w-full md:w-3/4 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-6">
            <img
              src="/logo.png"
              alt="Profile"
              className="rounded-full w-24 h-24 border-2 border-gray-700"
            />
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{athlete ? athlete.Name : "Loading..."}</h1>
              <p className="text-gray-400">{athlete ? athlete.Address : ""}</p>
              <p className="text-gray-400">{athlete ? athlete.Email : ""}</p>
              <p className="text-gray-400"><MdAddCall className="inline mr-2" />{athlete ? athlete.ContactNum : "Loading athlete info..."}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Plays Registered</h2>
            {sports.length > 0 ? (
              <ul className="space-y-4">
                {sports.map((sport, index) => (
                  <li key={index} className="p-4 bg-gray-700 rounded-lg">
                    <h3 className="font-semibold">{sport.Name}</h3>
                    <p className="text-gray-400">{sport.Category} Sport</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No sports registered.</p>
            )}
            <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-200">
              <a href="/user/update">Update Plays</a>
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
            {achievements.length > 0 ? (
              <ul className="space-y-4">
                {achievements.map((achievement, index) => (
                  <li key={index} className="p-4 bg-gray-700 rounded-lg">
                    <h3 className="font-semibold">{achievement}</h3>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No achievements recorded.</p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Activity</h2>
            <div className="p-4 bg-gray-700 rounded-lg">
              {events.length > 0 ? (
                <ul className="space-y-4">
                  {events.map((event, index) => (
                    <li key={index} className="p-4 bg-gray-600 rounded-lg">
                      <h3 className="font-semibold">Event Name - {event.EventName}</h3>
                      <p className="text-gray-400">
                        Date - {new Date(event.Date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-300">Venue - {event.Venue}</p>
                      <p className="text-gray-200">Description - {event.Description}</p>
                      <p className="text-gray-200">Experience - {event.performance}</p>

                      {event.AthleteImage ? (
                        <img
                          src={bufferToBase64(event.AthleteImage)} 
                          alt="Athlete Image"
                          className="w-24 h-24 rounded-lg"
                        />
                      ) : (
                        <p>Image not available</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No recent activity found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Enter Video URL</h3>
            <input
              type="url"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg"
              placeholder="https://example.com/video"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUrl}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Add URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
