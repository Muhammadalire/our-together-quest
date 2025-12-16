import { useState, useEffect, useCallback } from 'react';
import { Task, Reward } from '../types';
import { TASKS as MOCK_TASKS, REWARDS as MOCK_REWARDS } from '../data/mockData';

export const useAppData = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [tasksRes, rewardsRes] = await Promise.all([
                fetch('/api/tasks'),
                fetch('/api/rewards')
            ]);

            if (tasksRes.ok && rewardsRes.ok) {
                const tasksData = await tasksRes.json();
                const rewardsData = await rewardsRes.json();

                // If DB is empty, fall back to mock data (or maybe we should seed DB?)
                // For now, let's mix or prefer DB. 
                // If DB returns empty array, it might mean no connection or empty DB.
                // Let's assume if DB works, we use it. If it fails, we use mock.

                if (tasksData.length === 0 && rewardsData.length === 0) {
                    // Optional: Seed DB here or just use mock
                    console.log("DB empty, using mock data");
                    setTasks(MOCK_TASKS);
                    setRewards(MOCK_REWARDS);
                } else {
                    setTasks(tasksData);
                    setRewards(rewardsData);
                }

            } else {
                throw new Error('Failed to fetch from API');
            }
        } catch (err) {
            console.error("API fetch failed, using mock data:", err);
            // Fallback to mock data on error
            setTasks(MOCK_TASKS);
            setRewards(MOCK_REWARDS);
            setError('Using offline mode');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addTask = async (task: Omit<Task, 'id'>) => {
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...task, id: `t${Date.now()}` }), // Generate ID if backend doesn't (backend schema has ID required)
            });
            if (res.ok) {
                const newTask = await res.json();
                setTasks(prev => [...prev, newTask]);
                return true;
            }
        } catch (err) {
            console.error(err);
        }
        return false;
    };

    const addReward = async (reward: Omit<Reward, 'id'>) => {
        try {
            const res = await fetch('/api/rewards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...reward, id: `r${Date.now()}` }),
            });
            if (res.ok) {
                const newReward = await res.json();
                setRewards(prev => [...prev, newReward]);
                return true;
            }
        } catch (err) {
            console.error(err);
        }
        return false;
    };

    return { tasks, rewards, loading, error, addTask, addReward, refresh: fetchData };
};
