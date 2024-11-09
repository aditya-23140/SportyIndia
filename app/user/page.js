'use client';
import React, { useEffect, useState, useRef } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { MdAddCall, MdEditNote } from "react-icons/md";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CoachList, AchievementList, SportList, ActivityList, UploadList } from "../../components/Lists";
import { FaInfoCircle } from "react-icons/fa";
import { RiDashboard2Line } from "react-icons/ri";
import { IoIosAddCircle } from "react-icons/io";

const User = () => {
  const [user, setUser] = useState(null);
  const [athlete, setAthlete] = useState(null);
  const [sports, setSports] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentUploads, setRecentUploads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [newCoach, setNewCoach] = useState("");
  const [newSport, setNewSport] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [isAddCoachModalOpen, setIsAddCoachModalOpen] = useState(false);
  const [isAddAchievementModalOpen, setIsAddAchievementModalOpen] = useState(false);
  const [isAddSportModalOpen, setIsAddSportModalOpen] = useState(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [specialization, setSpecialization] = useState('');
  const [addCoachSpecialization, setaddCoachSpecialization] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedDOB, setUpdatedDOB] = useState('');
  const [updatedContactNum, setUpdatedContactNum] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedAddress, setUpdatedAddress] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const fileInputRef = useRef(null);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`/api/${userId}`);
      const data = await response.json();
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

  const handleUpdate = async () => {
    const updatedData = {
      name: updatedName,
      DOB: updatedDOB,
      contactNum: updatedContactNum,
      email: updatedEmail,
      address: updatedAddress,
    };

    try {
      const response = await fetch(`/api/${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      if (data.success) {
        setAthlete({ ...athlete, ...updatedData });
        toast.success("Athlete information updated successfully!");
        setIsUpdateModalOpen(false);
      } else {
        toast.error(data.error || "Failed to update athlete information");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error updating athlete information:", error);
    }
  };

  const handleAddUrl = async () => {
    if (videoUrl) {
      try {
        const response = await fetch(`/api/${user.userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: "add_video", videoUrl: videoUrl }),
        });
        const data = await response.json();
        if (data.success) {
          setRecentUploads([...recentUploads, videoUrl]);
          setVideoUrl("");
          setIsModalOpen(false);
          toast.success("Video added successfully!");
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error adding video URL:", error);
      }
    }
  };

  const handleAddCoach = async () => {
    if (newCoach && addCoachSpecialization) {
      try {
        const response = await fetch(`/api/${user.userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add_coach',
            coachName: newCoach,
            coachSpecialization: addCoachSpecialization
          }),
        });

        const data = await response.json();

        if (data.success) {
          setCoaches([...coaches, `${newCoach} - ${addCoachSpecialization}`]);
          setNewCoach('');
          setaddCoachSpecialization('');
          setIsAddCoachModalOpen(false);
          toast.success('Coach added successfully!');
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error adding coach:', error);
      }
    } else {
      toast.error('Please provide both coach name and specialization');
    }
  };

  const handleAddAchievement = async () => {
    if (newAchievement) {
      try {
        const response = await fetch(`/api/${user.userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: "add_achievement", achievement: newAchievement }),
        });
        const data = await response.json();
        if (data.success) {
          setAchievements([...achievements, newAchievement]);
          setNewAchievement("");
          setIsAddAchievementModalOpen(false);
          toast.success("Achievement added successfully!");
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error adding achievement:", error);
      }
    }
  };

  const handleDelete = async (action, item) => {
    if (!action || !item) return;

    const confirmDeletion = window.confirm(`Are you sure you want to delete this ${action.replace("delete_", "")}?`);

    if (!confirmDeletion) {
      return;
    }

    try {
      const response = await fetch(`/api/${user.userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...item }),
      });

      const data = await response.json();
      if (data.success) {
        if (action === 'delete_video') {
          setRecentUploads(recentUploads.filter(url => url !== item.videoUrl));
        } else if (action === 'delete_coach') {
          setCoaches(coaches.filter(coach => coach !== item.coachName));
        } else if (action === 'delete_achievement') {
          setAchievements(achievements.filter(achievement => achievement !== item.achievement));
        } else if (action === 'delete_sport') {
          setSports(sports.filter(sport => sport !== item.sport));
        } else if (action === 'delete_event') {
          window.location.reload();
          setEvents(events.filter(event => event !== item.EventName));
        }
        toast.success(`${action.replace("delete_", "")} deleted successfully!`);
      } else {
        toast.error(data.error || "Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("An error occurred while deleting.");
    }
  };

  const handleAddSport = async () => {
    if (newSport) {
      try {
        const response = await fetch(`/api/${user.userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: "add_sport", sport: newSport }),
        });
        const data = await response.json();
        if (data.success) {
          setSports([...sports, newSport]);
          setNewSport("");
          setIsAddSportModalOpen(false);
          toast.success("Sport added successfully!");
        } else {
          console.error(data.error);
        }
        window.location.reload();
      } catch (error) {
        console.error("Error adding Sport:", error);
      }
    }
  };

  const handleAddCoachWithSpecialization = async () => {
    if (specialization) {
      try {
        const response = await fetch(`/api/${user.userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: "be_coach", specialization }),
        });
        const data = await response.json();
        if (data.success) {
          setSpecialization("");
          setIsCoachModalOpen(false);
          toast.success(`You are now a Coach with ${specialization} specialization!`);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error adding coach with specialization:", error);
      }
    }
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    const file = files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setProfilePic(reader.result.split(',')[1]);
      };
  
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddProfile = async () => {
    if (!profilePic) {
      toast.error("Please select a profile picture.");
      return;
    }
  
    const formData = new FormData();
    formData.append("profilePic", profilePic);

    try {
      const response = await fetch(`/api/${user.userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: JSON.stringify({action:"add_profilePic",profilePic:profilePic}),
      });
  
      const data = await response.json();
      if (data.success) {
        toast.success("Profile picture updated successfully!");
        setProfilePic(null);
      } else {
        toast.error(data.error || "Failed to update profile picture.");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("An error occurred while uploading the profile picture.");
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
        <UploadList
          recentUploads={recentUploads}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          handleAddUrl={handleAddUrl}
          handleDelete={handleDelete}
        />
  
        <div className="w-full md:w-3/4 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-6 relative">
            <img
              src={profilePic ? `data:image/jpeg;base64,${profilePic}` : "/logo.png"}
              alt="Profile"
              className="rounded-full w-24 h-24 border-2 border-gray-700"
            />
            <IoIosAddCircle
              className="absolute text-3xl top-1 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            />
  
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
  
            {profilePic && (
              <button
                onClick={handleAddProfile}
                className="mt-[5rem] ml-2 px-4 py-2 bg-blue-500 text-white rounded absolute"
              >
                Upload
              </button>
            )}
  

            <div className="ml-4">
              <h1 className="text-2xl font-bold">
                {athlete ? athlete.Name : "Loading..."}&nbsp;&nbsp;
                <MdEditNote
                  className="inline scale-[1.5] cursor-pointer"
                  onClick={() => setIsUpdateModalOpen(true)}
                />
                <FaInfoCircle
                  className="inline scale-[1.1] cursor-pointer absolute right-0"
                  onClick={() => setIsCoachModalOpen(true)}
                />
                <a href="/coach" title="Go to Coach DashBoard"><RiDashboard2Line className="inline scale-[1.35] cursor-pointer absolute right-0 top-10" /></a>
              </h1>
              <p className="text-gray-400">{athlete ? athlete.Address : ""}</p>
              <p className="text-gray-400">{athlete ? athlete.Email : ""}</p>
              <p className="text-gray-400">
                <MdAddCall className="inline mr-2" />
                {athlete ? athlete.ContactNum : "Loading athlete info..."}
              </p>
            </div>
          </div>

          <CoachList
            coaches={coaches}
            isAddCoachModalOpen={isAddCoachModalOpen}
            setIsAddCoachModalOpen={setIsAddCoachModalOpen}
            newCoach={newCoach}
            setNewCoach={setNewCoach}
            addCoachSpecialization={addCoachSpecialization}
            setAddCoachSpecialization={setaddCoachSpecialization}
            handleAddCoach={handleAddCoach}
            handleDelete={handleDelete}
          />


          <AchievementList
            achievements={achievements}
            isAddAchievementModalOpen={isAddAchievementModalOpen}
            setIsAddAchievementModalOpen={setIsAddAchievementModalOpen}
            newAchievement={newAchievement}
            setNewAchievement={setNewAchievement}
            handleAddAchievement={handleAddAchievement}
            handleDelete={handleDelete}
          />

          <SportList
            sports={sports}
            handleDelete={handleDelete}
            handleAddSport={handleAddSport}
            isAddSportModalOpen={isAddSportModalOpen}
            setIsAddSportModalOpen={setIsAddSportModalOpen}
            newSport={newSport}
            setNewSport={setNewSport}
          />

          <ActivityList
            events={events}
            handleDelete={handleDelete}
          />

        </div>
      </main>

      <Footer />
      <ToastContainer theme="dark" position="top-left" />

      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold mb-4">Update Athlete Information</h3>
            <div className="mb-4">
              <label className="block text-gray-400">Name</label>
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Date of Birth</label>
              <input
                type="date"
                value={updatedDOB}
                onChange={(e) => setUpdatedDOB(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Contact Number</label>
              <input
                type="text"
                value={updatedContactNum}
                onChange={(e) => setUpdatedContactNum(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Email</label>
              <input
                type="email"
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Address</label>
              <input
                type="text"
                value={updatedAddress}
                onChange={(e) => setUpdatedAddress(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {isCoachModalOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold mb-4">Be a Coach</h3>
            <div className="mb-4">
              <label className="block text-gray-400">Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsCoachModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCoachWithSpecialization}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Add Specialization
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default User;