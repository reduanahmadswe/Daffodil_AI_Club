import { createApp } from '../src/app.js';

// Create the Express app once (reused across invocations)
const app = createApp();

// Vercel serverless function handler
export default async (req: any, res: any) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'https://aiclubdiu.vercel.app',
        ];
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', '86400');
        return res.status(204).end();
    }

    try {
        // Prisma Client handles connections automatically in serverless
        // No need to manually connect/disconnect
        return app(req, res);
    } catch (error) {
        console.error('Error handling request:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
