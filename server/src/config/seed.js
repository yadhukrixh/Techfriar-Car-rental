// src/config/seed.js
import seedAdmin from '../modules/admin/migrations/admin-seeder.js'; // Adjusted import path
import sequelize from './postgres.js';

export const runSeed = async () => {
  try {
    await sequelize.sync(); // Sync your models with the database

    await seedAdmin(); // Call the seed function
    
    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};
