import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './db';
import { RewardModel } from './models';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const rewards = await RewardModel.find();
            res.status(200).json(rewards);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch rewards' });
        }
    } else if (req.method === 'POST') {
        try {
            const reward = await RewardModel.create(req.body);
            res.status(201).json(reward);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create reward' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
