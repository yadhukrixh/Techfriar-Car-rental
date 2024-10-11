// models/rentable-cars-model.js
import { DataTypes } from 'sequelize';
import sequelize from '../../../config/postgres.js';
import AllCars from './cars-models.js';

const RentableCars = sequelize.define('RentableCars', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  registrationNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Each car has a unique registration number
  },
  carId: {
    type: DataTypes.INTEGER,
    references: {
      model: AllCars, // Link to AllCars table
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: false,
  },
  activeStatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Car is active by default
  },
  bookingDates: {
    type: DataTypes.ARRAY(DataTypes.DATEONLY), // Array of dates when the car is booked
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
  tableName: 'RentableCars',
  timestamps: true,
});

// Establish relationship: A vehicle can have many rentable entries (e.g., different registration numbers)
AllCars.hasMany(RentableCars, { foreignKey: 'carId', as: 'rentableCars' });
RentableCars.belongsTo(AllCars, { foreignKey: 'carId', as: 'car' });

export default RentableCars;
