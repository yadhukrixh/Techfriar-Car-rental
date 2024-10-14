import express from 'express';
import dotenv from 'dotenv';
import corsConfig from './config/cors.js';
import sequelize from './config/postgres.js';
import { runSeed } from './config/seed.js';
import { startApolloServer } from './config/apollo-server.js';
import { graphqlUploadExpress } from 'graphql-upload';

import  './config/typesense.js';

dotenv.config();



const app = express();

app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

app.use(express.json());
app.use(corsConfig);

app.get('/', (req, res) => {
  res.send("Backend");
});

const PORT = process.env.PORT || 3400;

startApolloServer(app); // Start Apollo Server

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

