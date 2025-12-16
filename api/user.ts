import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from './db';
import { UserModel } from './models';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await dbConnect();

    if (req.method === 'GET') {
        const { name } = req.query;
        if (!name || Array.isArray(name)) {
            return res.status(400).json({ error: 'Name is required and must be a string' });
        }
        try {
            const user = await UserModel.findOne({ name } as any);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    } else if (req.method === 'POST') {
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
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update user' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
