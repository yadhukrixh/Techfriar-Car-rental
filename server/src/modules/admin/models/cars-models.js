// models/vehicle-model.js
import { DataTypes } from 'sequelize';
import sequelize from '../../../config/postgres.js';
import Brands from './brands-models.js'; // Import Brands model for association

// Define the AllCars model (representing vehicles)
const AllCars = sequelize.define('AllCars', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Vehicle model name
  },
  description: {
    type: DataTypes.TEXT, // Description of the vehicle
    allowNull: true,
  },
  brandId: {
    type: DataTypes.INTEGER,
    references: {
      model: Brands, // Link to the Brands table
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: false,
  },
  primaryImageUrl: {
    type: DataTypes.STRING(1000),
    allowNull: false, // URL for the primary image
  },
  secondaryImages: {
    type: DataTypes.ARRAY(DataTypes.STRING(1000)), // Array of secondary images
    allowNull: true,
  },
  availableQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Default quantity available
  },
  year: {
    type: DataTypes.INTEGER, // Year of manufacture
    allowNull: false,
  },
  fuelType: {
    type: DataTypes.STRING, // Fuel type (e.g., petrol, diesel, EV)
    allowNull: false,
  },
  transmissionType: {
    type: DataTypes.STRING, // Transmission type (e.g., automatic, manual)
    allowNull: false,
  },
  numberOfSeats: {
    type: DataTypes.INTEGER, // Number of seats
    allowNull: false,
  },
  numberOfDoors: {
    type: DataTypes.INTEGER, // Number of doors
    allowNull: false,
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
  tableName: 'AllCars',
  timestamps: true,
});

// Establish the relationship: A brand can have many vehicles
Brands.hasMany(AllCars, { foreignKey: 'brandId', as: 'AllCars' });
AllCars.belongsTo(Brands, { foreignKey: 'brandId', as: 'brand' });

export default AllCars;
