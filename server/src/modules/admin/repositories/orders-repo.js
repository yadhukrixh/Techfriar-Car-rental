import { Op } from "sequelize";
import Orders from "../models/orders-model.js";
import RentableCars from "../models/rentable-cars-models.js";
import AllCars from "../models/cars-models.js";
import { Transactions } from "../models/transactions-model.js";
import Brands from "../models/brands-models.js";
import OrderStatus from "../models/order-status-model.js";
import Users from "../../user/models/user-model.js";

export class OrdersRepository {
  // fetch future orders
  static async fetchFutureOrders(id) {
    try {
      const currentDate = new Date();

      // Fetch all orders where the bookedDates array contains dates greater than the current date
      const futureOrders = await Orders.findAll({
        where: {
          bookedCarId: id,
          bookedDates: {
            [Op.and]: [
              { [Op.ne]: null },
              { [Op.contains]: [currentDate] }, // Query where the array contains future dates
            ],
          },
        },
      });

      return {
        status: true,
        message: "Successfully fetched future orders",
        data: futureOrders,
      };
    } catch (error) {
      console.error("Error fetching future orders:", error);
      return {
        status: false,
        message: `Error fetching future orders: ${error.message}`,
      };
    }
  }

  static async updateOrderData(newCarId, orderId) {
    try {
      await Orders.update(
        { bookedCarId: newCarId },
        { where: { id: orderId } }
      );
      return { status: true, message: "Order updated successfully" };
    } catch (error) {
      console.error("Error updating order:", error);
      return {
        status: false,
        message: `Error updating order: ${error.message}`,
      };
    }
  }

  // update orders
  static async updateOrderData(reassignedCarId, orderId) {
    try {
      const updateOrder = await Orders.update(
        { bookedCarId: reassignedCarId }, // Update the order to use the new rentable car
        { where: { id: orderId } }
      );

      if (updateOrder) {
        return {
          status: true,
          message: "Order Updetes successfully.",
        };
      }
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }

  //fetch data to upload orders into typesense
  static async fetchOrdersToTypesense() {
    try {
      const orderDetails = await Orders.findAll({
        include: [
          {
            model: Users,
            attributes: ["id"], // Fetching userId
          },
          {
            model: Transactions,
            as: "transaction", // Specify the alias defined in Orders model
            attributes: ["method", "amount"], // Fetching method and amount
          },
          {
            model: RentableCars,
            attributes: ["registrationNumber"], // Fetching registration number
            include: [
              {
                model: AllCars,
                as:'car',
                attributes: ["name"], // Fetching carName
                include: [
                  {
                    model: Brands,
                    as:'brand',
                    attributes: ["name"], // Fetching brandName
                  },
                ],
              },
            ],
          },
          {
            model: OrderStatus,
            attributes: ["status"], // Fetching orderStatus and completionStatus
          },
        ],
        attributes: ["id", "bookedDates"], // Fetching orderId and bookedDates
      });


      const orders = orderDetails.map((order) => ({
        orderId: order.id,
        userId: order.User.id,
        method: order.transaction.method, // Use the alias here
        orderStatus: order.OrderStatus.status,
        completionStatus: order.OrderStatus.status,
        amount: order.transaction.amount, // Use the alias here
        bookedDates: order.bookedDates,
        brandName: order.RentableCar.car.brand.name,
        carName: order.RentableCar.car.name,
        registrationNumber: order.RentableCar.registrationNumber,
      }));

      return orders;

     
    } catch (error) {
      console.error(error);
    }
  }
}
