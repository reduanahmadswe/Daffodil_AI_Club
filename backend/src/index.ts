import { createApp } from './app.js';
import { env, validateEnv } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

const startServer = async () => {
  // Validate environment variables
  validateEnv();

  // Connect to database
  await connectDatabase();

  // Create Express app
  const app = createApp();

  // Start server
  const server = app.listen(env.PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════════════════════╗
    ║                                                            ║
    ║   🤖  DAFFODIL AI CLUB API SERVER                          ║
    ║                                                            ║
    ║   🚀  Server running on: http://localhost:${env.PORT}            ║
    ║   📊  Environment: ${env.NODE_ENV.padEnd(36)}║
    ║   🗄️   Database: Connected                                 ║
    ║                                                            ║
    ╚════════════════════════════════════════════════════════════╝
    `);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    
    server.close(async () => {
      await disconnectDatabase();
      console.log('Server closed.');
      process.exit(0);
    });

    // Force close after 10s
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
