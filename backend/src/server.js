import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { ENV } from './config/env';

const app = express();
const __dirname = path.resolve();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Server is healthy', 
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    message: 'Internal Server Error',
    ...(ENV.NODE_ENV === 'development' && { error: err.message })
  });
});

// Serve static files in production
if (ENV.NODE_ENV === 'production') {
  // Serve static files from the admin app
  app.use(express.static(path.join(__dirname, '../admin/dist'), {
    maxAge: '1y',
    etag: true,
    lastModified: true
  }));

  // Handle SPA routing - return the index.html for all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/dist/index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
    path: req.path
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${ENV.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM (for Heroku)
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});
