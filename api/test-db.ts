import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        return res.status(500).json({
            status: 'error',
            message: 'MONGODB_URI is not defined in environment variables.'
        });
    }

    try {
        if (mongoose.connection.readyState === 1) {
            return res.status(200).json({ status: 'connected', message: 'Already connected to MongoDB.' });
        }

        await mongoose.connect(uri);
        res.status(200).json({ status: 'connected', message: 'Successfully connected to MongoDB.' });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to connect to MongoDB.',
            error: error.message,
            stack: error.stack
        });
    }
}
