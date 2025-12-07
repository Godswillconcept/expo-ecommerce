import { Sequelize } from 'sequelize';
import { ENV } from './env.js';

// Create a new Sequelize instance
const sequelize = new Sequelize(ENV.DB.URL, {
  dialect: ENV.DB.DIALECT,
  logging: ENV.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
  pool: ENV.DB.POOL,
  dialectOptions: {
    ssl: ENV.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, testConnection };
