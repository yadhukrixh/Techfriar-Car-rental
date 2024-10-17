import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// Firebase Admin SDK Configuration from environment variables


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert("src/user/config/service-account.json"),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export const adminAuth = admin.auth();
