import { useState, useEffect, useCallback } from 'react';
import { Task, Reward } from '../types';
import { TASKS as MOCK_TASKS, REWARDS as MOCK_REWARDS } from '../data/mockData';

export const useAppData = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isOffline, setIsOffline] = useState(false);

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
                    // Do NOT set isOffline(true) here. Empty DB is valid online state.
                    // We just use mock data as a starter pack.
                } else {
                    setTasks(tasksData);
                    setRewards(rewardsData);
                    setIsOffline(false);
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
            setIsOffline(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addTask = async (task: Omit<Task, 'id'>) => {
        const tempId = `t${Date.now()}`;
        const newTask = { ...task, id: tempId };

        // Optimistic update
        setTasks(prev => [...prev, newTask]);

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask),
            });
            if (res.ok) {
                const savedTask = await res.json();
                // Replace temp task with saved one (though IDs should match if we send ID)
                setTasks(prev => prev.map(t => t.id === tempId ? savedTask : t));
                setIsOffline(false); // We successfully talked to the backend
                return true;
            } else {
                console.error("Failed to save task to backend, keeping local copy");
                // We keep the local copy so the user sees it
                return true;
            }
        } catch (err) {
            console.error("Error saving task, keeping local copy:", err);
            return true;
        }
    };

    const addReward = async (reward: Omit<Reward, 'id'>) => {
        const tempId = `r${Date.now()}`;
        const newReward = { ...reward, id: tempId };

        // Optimistic update
        setRewards(prev => [...prev, newReward]);

        try {
            const res = await fetch('/api/rewards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReward),
            });
            if (res.ok) {
                const savedReward = await res.json();
                setRewards(prev => prev.map(r => r.id === tempId ? savedReward : r));
                setIsOffline(false);
                return true;
            } else {
                console.error("Failed to save reward to backend, keeping local copy");
                return true;
            }
        } catch (err) {
            console.error("Error saving reward, keeping local copy:", err);
            return true;
        }
    };

    return { tasks, rewards, loading, error, isOffline, addTask, addReward, refresh: fetchData };
};
