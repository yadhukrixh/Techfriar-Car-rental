// src/modules/admin/models/transactions-model.js
import { DataTypes } from 'sequelize';
import sequelize from '../../../config/postgres.js';
import Users from '../../user/models/user-model.js';
import Orders from './orders-model.js'; // Import Orders here

const Transactions = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  method: {
    type: DataTypes.ENUM('card', 'upi', 'netbanking', 'wallet', 'other'),
    allowNull: true,
  },
  razorpayId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'canceled', 'refunded'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

// Define associations in a separate function to avoid circular dependency issues
const defineAssociations = () => {
  Orders.hasMany(Transactions, { foreignKey: 'transactionId', as: 'transactions' });
  Transactions.belongsTo(Orders, { foreignKey: 'transactionId', as: 'order' });
};

// Export the model and the function
export { Transactions, defineAssociations };
