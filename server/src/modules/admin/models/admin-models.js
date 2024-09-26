// src/modules/admin/models/admin-models.js
import { DataTypes } from 'sequelize';
import sequelize from '../../../config/postgres.js';

const Admins = sequelize.define('Admin', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure email is unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Export the Admin model
export default Admins;
