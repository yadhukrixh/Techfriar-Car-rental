import { DataTypes } from 'sequelize';
import sequelize from '../../../config/postgres.js';


const Users = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Automatically increments the id
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  secondName: {
    type: DataTypes.STRING,
    allowNull: true, // Optional if second name is not always required
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures usernames are unique
  },
  password: {
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
  address: {
    type: DataTypes.STRING,
    allowNull: true, // This is filled in the additional details step
  },
  street: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  drivingLicence: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  registrationComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Tracks if the user completed the full registration
  }
});

export default Users;
