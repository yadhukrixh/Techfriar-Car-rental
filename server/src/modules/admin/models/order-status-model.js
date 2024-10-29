import { DataTypes } from 'sequelize';
import sequelize from '../../../config/postgres.js';

const OrderStatus = sequelize.define('OrderStatus', {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Orders', // Use string instead of the model reference
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'returned'),
    allowNull: false,
  },
});

// Export the model
export default OrderStatus;
