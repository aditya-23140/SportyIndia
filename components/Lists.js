const CoachList = ({ coaches, onAddCoach, isAddCoachModalOpen, setIsAddCoachModalOpen, newCoach, setNewCoach, handleAddCoach }) => {
    return (
      <div className="mb-6">
        <h2 className="text-2xl mb-4 flex justify-between items-center">
          <div className="font-semibold">Coaches</div>
          <button
            onClick={() => setIsAddCoachModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg scale-[0.8]"
          >
            Add Coach
          </button>
        </h2>
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
  
        {isAddCoachModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-xl font-semibold mb-4">Enter Coach Name</h3>
              <input
                type="text"
                className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg"
                placeholder="Enter coach name"
                value={newCoach}
                onChange={(e) => setNewCoach(e.target.value)}
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
  
  const AchievementList = ({ achievements, onAddAchievement, isAddAchievementModalOpen, setIsAddAchievementModalOpen, newAchievement, setNewAchievement, handleAddAchievement }) => {
    return (
      <div className="mb-6">
        <h2 className="text-2xl mb-4 flex justify-between items-center">
          <div className="font-semibold">Achievements</div>
          <button
            onClick={() => setIsAddAchievementModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg scale-[0.8]"
          >
            Add Achievement
          </button>
        </h2>
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
            <p className="text-gray-400">No achievements added.</p>
          )}
        </div>
  
        {isAddAchievementModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
  
  export const SportList = ({ sports }) => {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Sports</h2>
        {sports.length > 0 ? (
          <ul className="space-y-2">
            {sports.map((sport, index) => (
              <li key={index} className="text-gray-400">{sport}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No sports registered.</p>
        )}
      </div>
    );
  };

  export { CoachList, AchievementList, SportList };