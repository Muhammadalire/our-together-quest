import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './db';
import { TaskModel } from './models';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const tasks = await TaskModel.find();
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    } else if (req.method === 'POST') {
        try {
            const task = await TaskModel.create(req.body);
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create task' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
