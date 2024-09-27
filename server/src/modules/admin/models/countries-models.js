import { DataTypes } from 'sequelize';
import sequelize from '../../../config/postgres.js';


const Countries = sequelize.define('Country', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures no duplicate country names
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
  tableName: 'Countries', // Define the table name explicitly if needed
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

export default Countries;
