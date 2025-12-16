import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['daily', 'once'], required: true },
    duration: { type: Number, required: true },
    points: { type: Number, required: true },
});

const RewardSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'gemini-story'], required: true },
    content: { type: String, required: true },
    cost: { type: Number, required: true },
});

// Prevent overwriting models during hot reload
export const TaskModel = mongoose.models.Task || mongoose.model('Task', TaskSchema);
export const RewardModel = mongoose.models.Reward || mongoose.model('Reward', RewardSchema);

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    completedTasks: [{ type: String }],
    unlockedRewards: [{ type: String }],
    dailyProgress: {
        type: Map,
        of: new mongoose.Schema({
            completedDates: [{ type: String }],
            currentProgress: { type: Number, default: 0 }
        }, { _id: false })
    }
});

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
