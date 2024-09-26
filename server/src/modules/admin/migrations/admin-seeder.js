// src/modules/admin/migrations/admin-seeder.js
import bcrypt from 'bcryptjs';
import Admins from '../models/admin-models.js'; // Adjusted import path

const seedAdmin = async () => {
  // Check if the admin user already exists
  const existingAdmin = await Admins.findOne({
    where: {
      email: 'admin@example.com', // Check by email or any unique identifier
    },
  });

  // If the admin user does not exist, create a new one
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admins.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user created successfully.');
  } else {
    console.log('Admin user already exists. No action taken.');
  }
};

export default seedAdmin;
