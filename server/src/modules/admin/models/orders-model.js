import { DataTypes } from 'sequelize';
import sequelize from '../../../config/postgres.js';
import Users from '../../user/models/user-model.js';
import RentableCars from './rentable-cars-models.js';
import { Transactions } from './transactions-model.js';
import OrderStatus from './order-status-model.js';


const Orders = sequelize.define('Order', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  bookedDates: {
    type: DataTypes.ARRAY(DataTypes.DATE),
    allowNull: false,
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
  bookedCarId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RentableCars,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Transactions,
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  deliveryLocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  returnLocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  secondaryMobileNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Define associations
Orders.belongsTo(Users, { foreignKey: 'userId', onDelete: 'CASCADE' });
Orders.belongsTo(RentableCars, { foreignKey: 'bookedCarId', onDelete: 'CASCADE' });
Orders.belongsTo(Transactions, { foreignKey: 'transactionId', as: 'transaction', onDelete: 'SET NULL' });
Orders.hasOne(OrderStatus, { foreignKey: 'orderId' }); // Establish one-to-one relationship with OrderStatus

// Export the Orders model
export default Orders;
