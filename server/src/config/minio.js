// minioConfig.js
import { Client } from 'minio';
import dotenv from 'dotenv';
dotenv.config();

// Create a MinIO client
const minioClient = new Client({
  endPoint: 'localhost', // Change if your MinIO server is hosted elsewhere
  port: 9000,
  useSSL: false, // Set to true if using HTTPS
  accessKey: process.env.MINIO_ACCESS_KEY, // Your MinIO access key
  secretKey: process.env.MINIO_SECRET_KEY, // Your MinIO secret key
});

// Function to create a bucket if it doesn't exist


export default minioClient;
