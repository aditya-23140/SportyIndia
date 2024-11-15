'use client'
import Link from "next/link";
import { MdDelete } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";
import { AiOutlineUserDelete } from "react-icons/ai";
import { TiDelete } from "react-icons/ti";
import { FcDeleteDatabase } from "react-icons/fc";
import { useState,useEffect } from "react";

const ActivityList = ({ events, handleDelete, shouldModify }) => {
  const [imageData, setImageData] = useState({});

  const fetchImageData = async (imageId) => {
    try {
      const response = await fetch(`/api/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBuffer: imageId,
        }),
      });

      const data = await response.json();
      if (data.imageId) {
        setImageData((prevData) => ({
          ...prevData,
          [imageId]: `/images/${data.imageId}.png`,
        }));
      }
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  };

  useEffect(() => {
    if (events && events.length > 0) {
      events.forEach((event) => {
        if (event.AthleteImage) {
          fetchImageData(event.AthleteImage);
        }
      });
    }
  }, [events]);

  return (
    <div>
      <h2 className="text-2xl mb-4 flex justify-between items-center">
        <div className="font-semibold">Activity</div>
        <Link href="/user/update">
        {shouldModify?
          <button
            className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg scale-[0.8] ${
              !shouldModify ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={!shouldModify}
          >
            Update Activity
          </button>
          :<></>}
        </Link>
      </h2>
      <div className="p-4 bg-gray-700 rounded-lg">
        {events.length > 0 ? (
          <ul className="space-y-4">
            {events.map((event, index) => (
              <li key={index} className="p-4 bg-gray-600 rounded-lg relative">
                {shouldModify && (
                  <FcDeleteDatabase
                    className="absolute right-3 text-2xl top-3 cursor-pointer"
                    onClick={() => handleDelete('delete_event', { eventName: event.EventName })}
                  />
                )}
                <h3 className="font-semibold">Event Name - {event.EventName}</h3>
                <p className="text-gray-400">
                  Date - {new Date(event.Date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-gray-300">Venue - {event.Venue}</p>
                <p className="text-gray-200">Description - {event.Description}</p>
                <p className="text-gray-200">Experience - {event.performance}</p>

                {event.AthleteImage ? (
                  imageData[event.AthleteImage] ? (
                    <img
                      src={imageData[event.AthleteImage]}
                      alt="Athlete Image"
                      className="w-24 h-24 rounded-lg absolute right-16 top-7 scale-[1.5]"
                    />
                  ) : (
                    <p>Loading Image...</p>
                  )
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
  );
};

const getEmbedUrl = (url) => {
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

const UploadList = ({ recentUploads, isModalOpen, setIsModalOpen, videoUrl, setVideoUrl, handleAddUrl, handleDelete, shouldModify }) => {
  return (
    <div className="w-full md:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg mb-6 md:mb-0">
      <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
      <ul className="space-y-4">
        {recentUploads.length > 0 ? (
          recentUploads.map((upload, index) => {
            const { embedUrl, platform } = getEmbedUrl(upload) || {};
            const isInstagram = platform === 'instagram';
            return (
              <li key={index} className="p-4 bg-gray-700 rounded-lg relative">
                {shouldModify && (
                  <MdDelete
                    className="text-red-300 text-3xl absolute z-10 bottom-0 right-0 cursor-pointer"
                    onClick={() => handleDelete('delete_video', { videoUrl: upload })}
                  />
                )}
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
              </li>
            );
          })
        ) : (
          <p className="text-gray-400">No recent uploads found.</p>
        )}
      </ul>
      {shouldModify?
      <button
        onClick={() => setIsModalOpen(true)}
        className={`mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-200 ${
          !shouldModify ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={!shouldModify}
      >
        Add Video URL
      </button>
:<></>}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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

const CoachList = ({
  coaches,
  onAddCoach,
  isAddCoachModalOpen,
  setIsAddCoachModalOpen,
  newCoach,
  setNewCoach,
  addCoachSpecialization,
  setAddCoachSpecialization,
  handleAddCoach,
  handleDelete,
  shouldModify
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl mb-4 flex justify-between items-center">
        <div className="font-semibold">Coaches</div>
        {shouldModify?
        <button
          onClick={() => setIsAddCoachModalOpen(true)}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg scale-[0.8] ${
            !shouldModify ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={!shouldModify}
        >
          Add Coach
        </button>
        :<></>}
      </h2>
      <div className="flex-1">
        {coaches.length > 0 ? (
          <ul className="space-y-4">
            {coaches.map((coach, index) => (
              <li key={index} className="p-4 bg-gray-700 rounded-lg relative">
                {shouldModify && (
                  <AiOutlineUserDelete
                    className="absolute text-3xl right-3 top-3 text-red-300 cursor-pointer"
                    onClick={() => handleDelete('delete_coach', { coachName: coach })}
                  />
                )}
                <h3 className="font-semibold">{coach}</h3>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No coaches assigned.</p>
        )}
      </div>

      {isAddCoachModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Enter Coach Details</h3>
            <input
              type="text"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg"
              placeholder="Enter coach name"
              value={newCoach}
              onChange={(e) => setNewCoach(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg"
              placeholder="Enter coach specialization"
              value={addCoachSpecialization}
              onChange={(e) => setAddCoachSpecialization(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsAddCoachModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCoach}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Add Coach
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AchievementList = ({
  achievements,
  onAddAchievement,
  isAddAchievementModalOpen,
  setIsAddAchievementModalOpen,
  newAchievement,
  setNewAchievement,
  handleAddAchievement,
  handleDelete,
  shouldModify
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl mb-4 flex justify-between items-center">
        <div className="font-semibold">Achievements</div>
        {shouldModify?
        <button
          onClick={() => setIsAddAchievementModalOpen(true)}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg scale-[0.8] ${
            !shouldModify ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={!shouldModify}
        >
          Add Achievement
        </button>
        :<></>}
      </h2>
      <div className="flex-1">
        {achievements.length > 0 ? (
          <ul className="space-y-4">
            {achievements.map((achievement, index) => (
              <li key={index} className="p-4 bg-gray-700 rounded-lg relative">
                {shouldModify && (
                  <MdDeleteSweep
                    className="absolute right-3 top-3 text-3xl text-red-300 cursor-pointer"
                    onClick={() => handleDelete('delete_achievement', { achievement })}
                  />
                )}
                <h3 className="font-semibold">{achievement}</h3>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No achievements added.</p>
        )}
      </div>

      {isAddAchievementModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Enter Achievement</h3>
            <input
              type="text"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg"
              placeholder="Enter achievement"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsAddAchievementModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAchievement}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Add Achievement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SportList = ({
  sports,
  isAddSportModalOpen,
  setIsAddSportModalOpen,
  newSport,
  setNewSport,
  handleAddSport,
  handleDelete,
  shouldModify
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl mb-4 flex justify-between items-center">
        <div className="font-semibold">Sports</div>
        {shouldModify?
        <button
          onClick={() => setIsAddSportModalOpen(true)}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg scale-[0.8] ${
            !shouldModify ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={!shouldModify}
        >
          Add Sports
        </button>
        :<></>}
      </h2>
      <div className="flex-1">
        {sports.length > 0 ? (
          <ul className="space-y-4">
            {sports.map((sport, index) => (
              <li key={index} className="p-4 bg-gray-700 rounded-lg flex justify-between relative">
                {shouldModify && (
                  <TiDelete
                    className="absolute text-3xl right-3 top-3 text-red-300 cursor-pointer"
                    onClick={() => handleDelete('delete_sport', { sport })}
                  />
                )}
                <h3 className="font-semibold">{sport.Name}</h3>
                <span className="text-sm text-gray-400 mr-10">{sport.Category} Sport</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No achievements added.</p>
        )}
      </div>
      {isAddSportModalOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold mb-4">Add New Sport</h3>
            <div className="mb-4">
              <label className="block text-gray-400">Sport Name</label>
              <input
                type="text"
                value={newSport}
                onChange={(e) => setNewSport(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
                placeholder="Enter Sport Name"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsAddSportModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSport}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Add Sport
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { CoachList, AchievementList, SportList, ActivityList, UploadList };