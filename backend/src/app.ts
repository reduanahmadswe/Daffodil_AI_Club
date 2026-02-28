import express, { Express, Router } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/validation.middleware.js';

// Import routers
import authRouter from './modules/auth/auth.router.js';
import eventRouter from './modules/event/event.router.js';
import blogRouter from './modules/blog/blog.router.js';
import memberRouter from './modules/member/member.router.js';
import projectRouter from './modules/project/project.router.js';
import galleryRouter from './modules/gallery/gallery.router.js';
import contactRouter from './modules/contact/contact.router.js';
import mediaRouter from './modules/media/media.router.js';
import membershipRouter from './modules/membership/membership.router.js';

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        env.FRONTEND_URL,
        'http://localhost:3000',
        'https://aiclubdiu.vercel.app',
      ];
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Home Route
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to Daffodil AI Club Backend API" });
  }); 

  // Create API router with all module routes
  const apiRouter = Router();
  apiRouter.use('/auth', authRouter);
  apiRouter.use('/events', eventRouter);
  apiRouter.use('/blogs', blogRouter);
  apiRouter.use('/members', memberRouter);
  apiRouter.use('/projects', projectRouter);
  apiRouter.use('/gallery', galleryRouter);
  apiRouter.use('/contact', contactRouter);
  apiRouter.use('/media', mediaRouter);
  apiRouter.use('/membership', membershipRouter);

  // Mount at /api (for local dev) and / (for Vercel serverless where /api is stripped)
  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  // Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
