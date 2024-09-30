// models/vehicle-model.js
import { DataTypes } from 'sequelize';
import sequelize from '../../../config/postgres.js';
import Brands from './brands-model.js'; // Import Brands model for association

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Vehicle model name
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
    allowNull: false,
  },
  secondaryImages: {
    type: DataTypes.ARRAY(DataTypes.STRING(1000)), // Array of secondary images
    allowNull: true,
  },
  availableQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
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
  tableName: 'Vehicles',
  timestamps: true,
});

// Establish the relationship: A brand can have many vehicles
Brands.hasMany(Vehicle, { foreignKey: 'brandId', as: 'vehicles' });
Vehicle.belongsTo(Brands, { foreignKey: 'brandId', as: 'brand' });

export default Vehicle;
