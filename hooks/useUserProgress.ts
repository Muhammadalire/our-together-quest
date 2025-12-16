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
          } else {
            initializeUser(userName);
          }
        } else if (res.status === 404 || res.status === 400) {
          // User not found or bad request (if name missing), create new
          initializeUser(userName);
        } else {
          console.error('Failed to fetch user progress');
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
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
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgress),
      });
      if (res.ok) {
        const savedUser = await res.json();
        setProgress(savedUser);
      } else {
        console.error('Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, []);

  return [progress, saveProgress] as const;
};

export default useUserProgress;
