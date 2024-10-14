import { DataTypes } from 'sequelize';
import sequelize from '../../../config/postgres.js';
import Users from '../../user/models/user-model.js';
import RentableCars from './rentable-cars-models.js';
import Transactions from './transactions-model.js';

const Orders = sequelize.define('Order', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Automatically sets the current date and time when the order is created
  },
  bookedDates: {
    type: DataTypes.ARRAY(DataTypes.DATE), // Store multiple dates as an array
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users, // Reference to Users table
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  bookedCarId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RentableCars, // Reference to RentableCars table
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Transactions, // Reference to Transactions table
      key: 'id',
    },
    onDelete: 'SET NULL', // If transaction is deleted, set the transactionId to NULL
  },
});

export default Orders;