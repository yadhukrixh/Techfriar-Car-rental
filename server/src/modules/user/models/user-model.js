import { DataTypes } from 'sequelize';
import sequelize from '../../../config/postgres.js';

const Users = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Automatically increments the id
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures email is unique
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumberVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Tracks phone number verification status
  },
  profileUrl: { // New column for storing the profile URL
    type: DataTypes.STRING,
    allowNull: true, // Allow null if the user hasn't set a profile image
  }
});

export default Users;
