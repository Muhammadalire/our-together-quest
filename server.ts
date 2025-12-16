import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { TaskModel, RewardModel, UserModel } from './api/models.ts';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Routes
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await TaskModel.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const task = await TaskModel.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

app.get('/api/rewards', async (req, res) => {
    try {
        const rewards = await RewardModel.find();
        res.json(rewards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rewards' });
    }
});

app.post('/api/rewards', async (req, res) => {
    try {
        const reward = await RewardModel.create(req.body);
        res.status(201).json(reward);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create reward' });
    }
});

// User Routes
app.get('/api/user', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    try {
        const user = await UserModel.findOne({ name } as any);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

app.post('/api/user', async (req, res) => {
    try {
        const { name, ...data } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const user = await UserModel.findOneAndUpdate(
            { name } as any,
            { $set: { name, ...data } },
            { new: true, upsert: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

app.listen(PORT, () => {
    console.log(`Local API server running on http://localhost:${PORT}`);
});
