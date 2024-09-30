import cors from 'cors';
import dotenv from 'dotenv';

// Configure dotenv to load environment variables
dotenv.config();

// Configure CORS settings
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Allow requests from frontend
  methods: 'GET, PUT, POST, DELETE, OPTIONS', // Include OPTIONS for preflight
  credentials: true, // Allow credentials (cookies, headers)
  exposedHeaders: ['Authorization', 'X-Total-Count'], // Optional: Expose custom headers
};

// Export the CORS configuration
export default cors(corsOptions);
