import React, { useState } from 'react';
import { TaskType, RewardType } from '../types';

interface AdminPanelProps {
    onAddTask: (task: any) => Promise<boolean>;
    onAddReward: (reward: any) => Promise<boolean>;
    onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddTask, onAddReward, onClose }) => {
    const [activeTab, setActiveTab] = useState<'task' | 'reward'>('task');

    // Task Form State
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskType, setTaskType] = useState<TaskType>(TaskType.DAILY);
    const [taskDuration, setTaskDuration] = useState(1);
    const [taskPoints, setTaskPoints] = useState(10);

    // Reward Form State
    const [rewardTitle, setRewardTitle] = useState('');
    const [rewardType, setRewardType] = useState<RewardType>(RewardType.TEXT);
    const [rewardContent, setRewardContent] = useState('');
    const [rewardCost, setRewardCost] = useState(50);

    const handleTaskSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await onAddTask({
            title: taskTitle,
            description: taskDesc,
            type: taskType,
            duration: Number(taskDuration),
            points: Number(taskPoints)
        });
        if (success) {
            alert('Task added!');
            setTaskTitle('');
            setTaskDesc('');
        } else {
            alert('Failed to add task');
        }
    };

    const handleRewardSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await onAddReward({
            title: rewardTitle,
            type: rewardType,
            content: rewardContent,
            cost: Number(rewardCost)
        });
        if (success) {
            alert('Reward added!');
            setRewardTitle('');
            setRewardContent('');
        } else {
            alert('Failed to add reward');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-serif text-rose-gold">Admin Panel</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
                    </div>

                    <div className="flex space-x-4 mb-6 border-b">
                        <button
                            className={`pb-2 px-4 ${activeTab === 'task' ? 'border-b-2 border-rose-gold text-rose-gold font-bold' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('task')}
                        >
                            Add Task
                        </button>
                        <button
                            className={`pb-2 px-4 ${activeTab === 'reward' ? 'border-b-2 border-rose-gold text-rose-gold font-bold' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('reward')}
                        >
                            Add Reward
                        </button>
                    </div>

                    {activeTab === 'task' ? (
                        <form onSubmit={handleTaskSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input required type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-gold focus:ring-rose-gold border p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea required value={taskDesc} onChange={e => setTaskDesc(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-gold focus:ring-rose-gold border p-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select value={taskType} onChange={e => setTaskType(e.target.value as TaskType)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-gold focus:ring-rose-gold border p-2">
                                        <option value={TaskType.DAILY}>Daily</option>
                                        <option value={TaskType.ONCE}>One-time</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Points</label>
                                    <input required type="number" value={taskPoints} onChange={e => setTaskPoints(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-gold focus:ring-rose-gold border p-2" />
                                </div>
                            </div>
                            {taskType === TaskType.DAILY && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Duration (Days)</label>
                                    <input required type="number" value={taskDuration} onChange={e => setTaskDuration(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-gold focus:ring-rose-gold border p-2" />
                                </div>
                            )}
                            <button type="submit" className="w-full bg-rose-gold text-white py-2 px-4 rounded-md hover:bg-opacity-90">Add Task</button>
                        </form>
                    ) : (
                        <form onSubmit={handleRewardSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input required type="text" value={rewardTitle} onChange={e => setRewardTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-gold focus:ring-rose-gold border p-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select value={rewardType} onChange={e => setRewardType(e.target.value as RewardType)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-gold focus:ring-rose-gold border p-2">
                                        <option value={RewardType.TEXT}>Text</option>
                                        <option value={RewardType.IMAGE}>Image</option>
                                        <option value={RewardType.GEMINI_STORY}>Story</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cost</label>
                                    <input required type="number" value={rewardCost} onChange={e => setRewardCost(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-gold focus:ring-rose-gold border p-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea required value={rewardContent} onChange={e => setRewardContent(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-gold focus:ring-rose-gold border p-2" placeholder="Text message, Image URL, or Story Prompt" />
                            </div>
                            <button type="submit" className="w-full bg-rose-gold text-white py-2 px-4 rounded-md hover:bg-opacity-90">Add Reward</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
