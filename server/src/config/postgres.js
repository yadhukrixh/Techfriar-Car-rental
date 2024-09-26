// src/config/postgres.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Configure dotenv to load environment variables
dotenv.config();

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'postgres', // Specify your database dialect
  logging: false, // Disable logging; default: console.log
});



// Export the sequelize instance
export default sequelize;
