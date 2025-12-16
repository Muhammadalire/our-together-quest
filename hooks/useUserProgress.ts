import { useState, useEffect, useCallback } from 'react';
import { UserProgress } from '../types';

const useUserProgress = (userName: string | null) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    if (!userName) {
      setProgress(null);
      return;
    }

    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/user?name=${encodeURIComponent(userName)}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            // Ensure points exist
            if (typeof data.points !== 'number') {
              data.points = 0;
            }
            // Ensure dailyProgress is an object
            if (!data.dailyProgress || typeof data.dailyProgress !== 'object') {
              data.dailyProgress = {};
            }
            setProgress(data);
            // Sync to local storage for backup
            localStorage.setItem(`userProgress_${userName}`, JSON.stringify(data));
          } else {
            initializeUser(userName);
          }
        } else {
          console.error('Failed to fetch user progress, falling back to local storage');
          loadFromLocalStorage(userName);
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
        loadFromLocalStorage(userName);
      }
    };

    const loadFromLocalStorage = (name: string) => {
      try {
        const item = window.localStorage.getItem(`userProgress_${name}`);
        if (item) {
          const parsed = JSON.parse(item);
          if (typeof parsed.points !== 'number') parsed.points = 0;
          setProgress(parsed);
        } else {
          initializeUser(name);
        }
      } catch (e) {
        console.error("Local storage error", e);
        initializeUser(name);
      }
    };

    const initializeUser = async (name: string) => {
      const newUser: UserProgress = {
        name,
        points: 0,
        completedTasks: [],
        unlockedRewards: [],
        dailyProgress: {},
      };
      // We don't await this here to avoid blocking, but we could
      saveProgress(newUser);
    };

    fetchProgress();
  }, [userName]);

  const saveProgress = useCallback(async (newProgress: UserProgress) => {
    // Always save to local storage first for immediate UI update and backup
    try {
      if (newProgress.name) {
        window.localStorage.setItem(`userProgress_${newProgress.name}`, JSON.stringify(newProgress));
        setProgress(newProgress);
      }
    } catch (e) {
      console.error("Local storage save error", e);
    }

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgress),
      });
      if (!res.ok) {
        console.error('Failed to save progress to backend');
      }
    } catch (error) {
      console.error('Error saving progress to backend:', error);
    }
  }, []);

  return [progress, saveProgress] as const;
};

export default useUserProgress;
