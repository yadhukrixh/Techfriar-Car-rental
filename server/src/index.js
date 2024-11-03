import express from 'express';
import dotenv from 'dotenv';
import corsConfig from './config/cors.js';
import sequelize from './config/postgres.js';
import { runSeed } from './config/seed.js';
import { startApolloServer } from './config/apollo-server.js';
import { graphqlUploadExpress } from 'graphql-upload';
import orderCleanupCorn from './utils/cron-function.js';
import path from 'path';
import { fileURLToPath } from 'url'; // Import for ES module URL handling

import './config/typesense.js';
import { defineAssociations } from './modules/admin/models/transactions-model.js';

dotenv.config();

defineAssociations();

const app = express();

// Middleware for handling file uploads
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

// Middleware for parsing JSON requests
app.use(express.json());

// CORS configuration
app.use(corsConfig);

// Basic health check route
app.get('/', (req, res) => {
    res.send("Backend is running");
});

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Define __dirname

// Port configuration
const PORT = process.env.PORT || 3400;

// Start Apollo Server
startApolloServer(app);

// Start scheduled tasks
orderCleanupCorn.start();

// Serve static files from the pdfs directory
const pdfDirectory = path.join(__dirname, 'pdfs');
app.use('/pdfs', express.static(pdfDirectory));

// Example route for downloading the PDF
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(pdfDirectory, filename);

    // Send the file to the client
    res.download(filePath, (err) => {
        if (err) {
            console.error("File download error:", err);
            res.status(404).send("File not found");
        }
    });
});

// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    try {
        await sequelize.authenticate(); // Explicitly authenticate before syncing
        console.log('Database connection established successfully.');

        await sequelize.sync(); // Ensure models are synced
        console.log('All models were synchronized successfully.');
        await runSeed(); // Seed the database if needed
    } catch (error) {
        console.error('Error during server initialization:', error);
    }
});
