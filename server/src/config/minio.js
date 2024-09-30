// minioConfig.js
import { Client } from 'minio';
import dotenv from 'dotenv';

dotenv.config();

// Create a MinIO client
const minioClient = new Client({
  endPoint: 'localhost', // Change if your MinIO server is hosted elsewhere
  port: 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true', // Set to true if using HTTPS
  accessKey: process.env.MINIO_ACCESS_KEY, // Your MinIO access key
  secretKey: process.env.MINIO_SECRET_KEY, // Your MinIO secret key
});

// Function to create a bucket if it doesn't exist
const createBucketIfNotExists = async (bucketName) => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName); // You can specify a region as needed
      console.log(`Bucket '${bucketName}' created successfully.`);
    } else {
      console.log(`Bucket '${bucketName}' already exists.`);
    }
  } catch (error) {
    console.error('Error creating bucket:', error);
  }
};



// Initialize the bucket (replace with your actual bucket name)
const bucketName = process.env.MINIO_BUCKET_NAME || 'default-bucket';
createBucketIfNotExists(bucketName);

export default minioClient;
