import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/validation.middleware.js';

// Import routers
import authRouter from './modules/auth/auth.router.js';
import eventRouter from './modules/event/event.router.js';
import blogRouter from './modules/blog/blog.router.js';
import memberRouter from './modules/member/member.router.js';
import workshopRouter from './modules/workshop/workshop.router.js';
import projectRouter from './modules/project/project.router.js';
import galleryRouter from './modules/gallery/gallery.router.js';
import contactRouter from './modules/contact/contact.router.js';

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: env.FRONTEND_URL,
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

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/events', eventRouter);
  app.use('/api/blogs', blogRouter);
  app.use('/api/members', memberRouter);
  app.use('/api/workshops', workshopRouter);
  app.use('/api/projects', projectRouter);
  app.use('/api/gallery', galleryRouter);
  app.use('/api/contact', contactRouter);

  // Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
