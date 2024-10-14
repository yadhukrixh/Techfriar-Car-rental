import { DataTypes } from 'sequelize';
import sequelize from '../../../config/postgres.js';
import Users from '../../user/models/user-model.js';

const Transactions = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Automatically increments the id
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false, // The date when the transaction occurred
    defaultValue: DataTypes.NOW, // Defaults to the current date
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users, // Connects to the Users table
      key: 'id',    // The userId references the 'id' field in Users
    },
    onDelete: 'CASCADE', // If the user is deleted, their transactions are also deleted
  },
  method: {
    type: DataTypes.ENUM('card', 'upi', 'netbanking', 'wallet', 'other'), // List of payment methods
    allowNull: false,
  },
  razorpayId: {
    type: DataTypes.STRING,
    allowNull: false, // Unique Razorpay transaction ID
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'canceled', 'refunded'), // Transaction status
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false, // Transaction amount
  },
});

export default Transactions;
