import Brands from "../../admin/models/brands-models.js";
import AllCars from "../../admin/models/cars-models.js";
import OrderStatus from "../../admin/models/order-status-model.js";
import Orders from "../../admin/models/orders-model.js";
import RentableCars from "../../admin/models/rentable-cars-models.js";
import { Transactions } from "../../admin/models/transactions-model.js";
import moment from 'moment';


export class OrdersRepository {
  static async fetchAllOrdersOfUser(userId) {
    try {
      // Fetch the orders with associations to related models
      const orders = await Orders.findAll({
        where: { userId },
        include: [
          {
            model: RentableCars,
            include: [
              {
                model: AllCars,
                as: 'car',
                include: [
                  {
                    model: Brands,
                    as: 'brand',
                    attributes: ['name'], // Fetch brand name only
                  },
                ],
                attributes: ['name', 'primaryImageUrl'], // Fetch car name and image
              },
            ],
            attributes: ['registrationNumber'], // Fetch car registration number
          },
          {
            model: OrderStatus,
            attributes: ['status'], // Fetch the completion status
          },
          {
            model:Transactions,
            as: 'transaction',
            attributes: ['status']
          }
        ],
        attributes: ['id', 'date', 'bookedDates'], // Fetch orderId, orderDate, and bookedDates
      });


      const formattedOrders = orders.map(order => ({
        orderId: order.id,
        carName: order.RentableCar.car.dataValues.name,
        image: order.RentableCar.car.dataValues.primaryImageUrl,
        registrationNumber: order.RentableCar.registrationNumber,
        brandName: order.RentableCar.car.dataValues.brand.dataValues.name,
        completionStatus: order.OrderStatus?.status || 'N/A', // Default to 'unknown' if null
        orderStatus: order.transaction.dataValues.status || 'N/A', // Assuming orderStatus and completionStatus are the same
        orderDate: moment(order.date).format('YYYY-MM-DD'), // Format order date
        bookedDates: order.bookedDates.map(date => moment(date).format('YYYY-MM-DD')), // Format each booked date
    }));

      return formattedOrders
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }
}
