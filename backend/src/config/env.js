import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Required environment variables (excluding DB_PASSWORD which can be empty)
const requiredEnvVars = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
];

// Check for missing required environment variables (excluding empty strings for DB_PASSWORD)
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0 && process.env.NODE_ENV !== "test") {
  console.error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
  process.exit(1);
}

// Export a function to get any environment variable
export const getEnv = (key, defaultValue = null) => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === null) {
      throw new Error(
        `Environment variable ${key} is not defined and no default value was provided`
      );
    }
    return defaultValue;
  }
  return value;
};

// Export all environment variables with type conversion and defaults
export const ENV = {
  // App Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 3000,

  // Database Configuration
  DB: {
    HOST: process.env.DB_HOST,
    PORT: parseInt(process.env.DB_PORT, 10) || 3306,
    NAME: process.env.DB_NAME,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    URL:
      process.env.DB_URL ||
      `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`,
    DIALECT: "mysql",
    POOL: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },

  // JWT Configuration
  JWT: {
    SECRET: process.env.JWT_SECRET || "your_jwt_secret_key",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "30d",
  },

  // Clerk Configuration
  CLERK: {
    PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },

  // Inngest Configuration
  INNGEST: {
    API_KEY: getEnv("INGEST_SIGNING_KEY"),
  },

  // Cloudinary Configuration
  CLOUDINARY: {
    CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
    API_KEY: getEnv("CLOUDINARY_API_KEY"),
    API_SECRET: getEnv("CLOUDINARY_API_SECRET"),
  },
};

console.log(getEnv('INGEST_SIGNING_KEY'));

// Export all environment variables as a flat object for direct access
export const env = {
  ...process.env,
  // Add any computed environment variables here
  NODE_ENV: ENV.NODE_ENV,
  PORT: ENV.PORT,
};

// For backward compatibility
export default ENV;
