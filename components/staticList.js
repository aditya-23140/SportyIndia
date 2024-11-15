'use client';
import { useState, useEffect } from "react";
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

const ActivityList = ({ events = [] }) => {
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
      <h2 className="text-2xl mb-4">Activity</h2>
      <div className="p-4 bg-gray-700 rounded-lg">
        {events.length > 0 ? (
          <ul className="space-y-4">
            {events.map((event, index) => (
              <li key={index} className="p-4 bg-gray-600 rounded-lg relative">
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
                      className="w-24 h-24 rounded-lg absolute right-7 top-7 scale-[1.5]"
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

const UploadList = ({ recentUploads = [] }) => {
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
    </div>
  );
};

const CoachList = ({ coaches = [] }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl mb-4">Coaches</h2>
      <div className="flex-1">
        {coaches.length > 0 ? (
          <ul className="space-y-4">
            {coaches.map((coach, index) => (
              <li key={index} className="p-4 bg-gray-700 rounded-lg">
                <h3 className="font-semibold">{coach}</h3>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No coaches assigned.</p>
        )}
      </div>
    </div>
  );
};

const AchievementList = ({ achievements = [] }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl mb-4">Achievements</h2>
      <div className="flex-1">
        {achievements.length > 0 ? (
          <ul className="space-y-4">
            {achievements.map((achievement, index) => (
              <li key={index} className="p-4 bg-gray-700 rounded-lg">
                <h3 className="font-semibold">{achievement}</h3>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No achievements found.</p>
        )}
      </div>
    </div>
  );
};


const SportList = ({ sports = [] }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl mb-4">Sports</h2>
      <div className="flex-1">
        {Array.isArray(sports) && sports.length > 0 ? (
          <ul className="space-y-4">
            {sports.map((sport, index) => (
              <li key={index} className="p-4 bg-gray-700 rounded-lg flex justify-between">
                <h3 className="font-semibold">{sport?.Name || "No Name"}</h3>
                <span className="text-sm text-gray-400 mr-10">{sport?.Category || "No Category"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No sports added.</p>
        )}
      </div>
    </div>
  );
};


export { CoachList, AchievementList, SportList, ActivityList, UploadList };