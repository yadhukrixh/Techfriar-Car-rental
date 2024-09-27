// models/brands-model.js
import { DataTypes } from 'sequelize';
import sequelize from '../../../config/postgres.js';

const Brands = sequelize.define('Brand', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures no duplicate brand names
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING(1000), // Increase length to 1000 or use DataTypes.TEXT
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Brands', // Define the table name explicitly if needed
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

export default Brands;
