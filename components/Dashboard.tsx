import React, { useState, useCallback, useMemo } from 'react';
import { Task, Reward, UserProgress, TaskType } from '../types';
import useUserProgress from '../hooks/useUserProgress';
import { useAppData } from '../hooks/useAppData';
import RewardModal from './RewardModal';
import RewardShop from './RewardShop';
import AdminPanel from './AdminPanel';
import { CheckCircleIcon, LockIcon, GiftIcon, SyncIcon, LogoutIcon, HeartIcon } from './icons';
import SyncProgressModal from './SyncProgressModal';

interface DashboardProps {
  userName: string;
  onLogout: () => void;
}

const isToday = (someDate: string) => {
  const today = new Date();
  const date = new Date(someDate);
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const Header: React.FC<{ userName: string, points: number, isOffline: boolean, onOpenSync: () => void, onLogout: () => void, onTitleClick: () => void }> = ({ userName, points, isOffline, onOpenSync, onLogout, onTitleClick }) => (
  <header className="bg-blush/80 backdrop-blur-sm p-4 rounded-b-2xl shadow-lg sticky top-0 z-10">
    <div className="max-w-4xl mx-auto flex justify-between items-center">
      <div onClick={onTitleClick} className="cursor-pointer select-none">
        <h1 className="font-serif text-2xl md:text-3xl text-rose-gold">For {userName}</h1>
        <div className="flex items-center space-x-2 text-rose-gold">
          <HeartIcon className="w-5 h-5" />
          <span className="font-bold text-lg">{points} Hearts</span>
          {isOffline && (
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full ml-2">Offline Mode</span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <button onClick={onOpenSync} title="Sync Progress" className="font-sans bg-rose-gold text-white p-2 rounded-full hover:bg-opacity-80 transition">
          <SyncIcon className="w-5 h-5" />
        </button>
        <button onClick={onLogout} title="Logout" className="font-sans bg-charcoal text-white p-2 rounded-full hover:bg-opacity-80 transition">
          <LogoutIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
);

const TaskItem: React.FC<{ task: Task, progress: UserProgress, onComplete: (taskId: string) => void }> = ({ task, progress, onComplete }) => {
  const taskProgress = progress.dailyProgress[task.id] || { currentProgress: 0, completedDates: [] };
  const isCompleted = progress.completedTasks.includes(task.id);
  const todayStr = new Date().toDateString();
  const completedToday = taskProgress.completedDates.includes(todayStr);

  return (
    <div className={`bg-white/80 p-5 rounded-xl shadow-md transition-all duration-300 ${isCompleted ? 'bg-green-100/80' : 'hover:shadow-lg hover:scale-[1.02]'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-serif text-xl text-charcoal">{task.title}</h3>
          <p className="font-sans text-sm text-gray-600 mt-1">{task.description}</p>
          <div className="flex items-center mt-2 text-rose-gold font-bold text-sm">
            <HeartIcon className="w-4 h-4 mr-1" />
            <span>+{task.points} Hearts</span>
          </div>
        </div>
        {isCompleted && <CheckCircleIcon className="w-8 h-8 text-green-500 flex-shrink-0 ml-2" />}
      </div>

      {task.type === TaskType.DAILY && !isCompleted && (
        <div className="mt-4">
          <div className="w-full bg-blush rounded-full h-2.5">
            <div className="bg-rose-gold h-2.5 rounded-full" style={{ width: `${(taskProgress.currentProgress / task.duration) * 100}%` }}></div>
          </div>
          <p className="text-right text-xs font-sans text-rose-gold mt-1">Day {taskProgress.currentProgress} of {task.duration}</p>
        </div>
      )}

      {!isCompleted && (
        <button
          onClick={() => onComplete(task.id)}
          disabled={completedToday}
          className="mt-4 w-full bg-rose-gold text-white font-bold py-2 px-4 rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:ring-opacity-50"
        >
          {completedToday ? "Done for Today!" : "I did this!"}
        </button>
      )}
    </div>
  );
};




const Dashboard: React.FC<DashboardProps> = ({ userName, onLogout }) => {
  const [userProgress, saveProgress] = useUserProgress(userName);
  const { tasks, rewards, loading: dataLoading, isOffline, addTask, addReward } = useAppData();

  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Admin Mode State
  const [titleClicks, setTitleClicks] = useState(0);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleTitleClick = () => {
    setTitleClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowAdminLogin(true);
        return 0;
      }
      return newCount;
    });
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'love123') { // Simple hardcoded password
      setIsAdminOpen(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('Wrong password!');
    }
  };

  const handleTaskCompletion = useCallback((taskId: string) => {
    if (!userProgress) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newProgress = { ...userProgress, dailyProgress: { ...userProgress.dailyProgress } };
    let taskProgress = newProgress.dailyProgress[taskId] || { currentProgress: 0, completedDates: [] };
    const todayStr = new Date().toDateString();

    if (taskProgress.completedDates.includes(todayStr)) return;

    taskProgress.completedDates.push(todayStr);

    if (task.type === TaskType.ONCE) {
      newProgress.completedTasks = [...newProgress.completedTasks, taskId];
      newProgress.points = (newProgress.points || 0) + task.points;
    } else if (task.type === TaskType.DAILY) {
      taskProgress.currentProgress += 1;
      if (taskProgress.currentProgress >= task.duration) {
        newProgress.completedTasks = [...newProgress.completedTasks, taskId];
        newProgress.points = (newProgress.points || 0) + task.points;
      }
    }

    newProgress.dailyProgress[taskId] = taskProgress;
    saveProgress(newProgress);
  }, [userProgress, saveProgress, tasks]);

  const handlePurchase = useCallback((reward: Reward) => {
    if (!userProgress) return;
    if ((userProgress.points || 0) >= reward.cost) {
      const newProgress = { ...userProgress };
      newProgress.points = (newProgress.points || 0) - reward.cost;
      newProgress.unlockedRewards = [...newProgress.unlockedRewards, reward.id];
      saveProgress(newProgress);
    }
  }, [userProgress, saveProgress]);

  if (!userProgress) {
    return <div className="flex items-center justify-center h-screen text-rose-gold font-serif text-2xl">Loading your love story...</div>;
  }

  return (
    <div className="min-h-screen bg-cream font-sans text-charcoal">
      <Header
        userName={userName}
        points={userProgress.points}
        isOffline={isOffline}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onLogout={onLogout}
        onTitleClick={handleTitleClick}
      />

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
        <section>
          <h2 className="font-serif text-3xl text-rose-gold mb-4">Your Quests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} progress={userProgress} onComplete={handleTaskCompletion} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-rose-gold mb-4">Reward Shop</h2>
          <RewardShop
            rewards={rewards}
            userProgress={userProgress}
            onPurchase={handlePurchase}
            onOpen={setSelectedReward}
          />
        </section>
      </main>

      <RewardModal
        reward={selectedReward}
        onClose={() => setSelectedReward(null)}
        userProgress={userProgress}
      />
      <SyncProgressModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        userNameToLoad={userName}
        onLoadSuccess={() => {
          // This is mainly for the login screen, but we close the modal here
          setIsSyncModalOpen(false);
        }}
      />

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold mb-4">Admin Access</h3>
            <input
              type="password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              placeholder="Password"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowAdminLogin(false)} className="px-4 py-2 text-gray-500">Cancel</button>
              <button onClick={handleAdminLogin} className="px-4 py-2 bg-rose-gold text-white rounded">Login</button>
            </div>
          </div>
        </div>
      )}

      {isAdminOpen && (
        <AdminPanel
          onAddTask={addTask}
          onAddReward={addReward}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
