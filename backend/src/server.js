import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { ENV } from "./config/env.js";
import { clerkMiddleware } from "@clerk/express";
import { sequelize, testConnection } from "./config/database.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./config/inngest.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
  });
});

// Serve static files in production
if (ENV.NODE_ENV === "production") {
  // Path from backend/src/server.js to admin/dist
  const adminDistPath = path.join(__dirname, "../../admin/dist");
  console.log("Admin dist path:", adminDistPath);

  // Serve static files from the admin app
  app.use(
    express.static(adminDistPath, {
      maxAge: "1y",
      etag: true,
      lastModified: true,
    })
  );

  // Handle SPA routing - Express 5.x syntax for catch-all routes
  app.get("/{*any}", (req, res) => {
    const indexPath = path.join(adminDistPath, "index.html");
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({
          status: "error",
          message: "Internal Server Error",
          error: err.message,
        });
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    ...(ENV.NODE_ENV === "development" && { error: err.message }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Not Found",
    path: req.path,
  });
});

const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync all models
    await sequelize.sync({ alter: ENV.NODE_ENV !== "production" });
    console.log("Database synced");

    // Start the server
    const server = app.listen(PORT, HOST, () => {
      console.log(`Server running in ${ENV.NODE_ENV} mode on ${HOST}:${PORT}`);
    });

    return server;
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Initialize the server
const server = startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated!");
  });
});
