import { createApp } from '../src/app.js';

// Create the Express app once (reused across invocations)
const app = createApp();

// Vercel serverless function handler
export default async (req: any, res: any) => {
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
