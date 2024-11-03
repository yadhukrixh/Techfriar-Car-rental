import { Op } from "sequelize";
import Orders from "../models/orders-model.js";
import RentableCars from "../models/rentable-cars-models.js";
import AllCars from "../models/cars-models.js";
import { Transactions } from "../models/transactions-model.js";
import Brands from "../models/brands-models.js";
import OrderStatus from "../models/order-status-model.js";
import Users from "../../user/models/user-model.js";
import { AdminOrderControllers } from "../controllers/orders-controllers.js";

export class OrdersRepository {
  // fetch future orders
  static async fetchFutureOrders(id) {
    try {
      const currentDate = new Date();

      // Fetch all orders for the given car ID
      const orders = await Orders.findAll({
        where: {
          bookedCarId: id,
          bookedDates: { [Op.ne]: null }, // Ensure bookedDates is not null
        },
        include: [
          {
            model: RentableCars,
            attributes: ["carId"], // Fetch only carId from RentableCars
          },
        ],
      });

      // Filter orders to include only those with future dates in bookedDates
      const futureOrders = orders.filter((order) =>
        order.bookedDates.some((date) => new Date(date) > currentDate)
      );

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
  static async fetchOrdersToTypesense(id) {
    try {
      const order = await Orders.findByPk(id, {
        include: [
          {
            model: Users,
            attributes: ["id"], // Fetching userId
          },
          {
            model: Transactions,
            as: "transaction", // Specify the alias defined in Orders model
            attributes: ["method", "amount", "status"], // Fetching method, amount, and status
          },
          {
            model: RentableCars,
            attributes: ["registrationNumber"], // Fetching registration number
            include: [
              {
                model: AllCars,
                as: "car",
                attributes: ["name"], // Fetching carName
                include: [
                  {
                    model: Brands,
                    as: "brand",
                    attributes: ["name"], // Fetching brandName
                  },
                ],
              },
            ],
          },
          {
            model: OrderStatus,
            attributes: ["status"], // Fetching orderStatus
          },
        ],
        attributes: ["id", "bookedDates"], // Fetching orderId and bookedDates
      });

      if (!order) {
        throw new Error("Order not found");
      }

      const FormattedOrder = {
        orderId: order.id,
        userId: order.User.id,
        method: order.transaction.method,
        orderStatus: order.transaction.status,
        completionStatus: order.OrderStatus ? order.OrderStatus.status : "N/A",
        amount: order.transaction.amount,
        bookedDates: order.bookedDates,
        brandName: order.RentableCar.car.brand.name,
        carName: order.RentableCar.car.name,
        registrationNumber: order.RentableCar.registrationNumber,
      };

      return FormattedOrder;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  }

  // update order status
  static async updateOrderStatuses(currentDate) {
    const updatedOrderIds = [];
      const orders = await Orders.findAll({
        include: [
          {
            model: Transactions,
            as: "transaction",
            where: { status: "success" },
          },
          {
            model: OrderStatus,
            attributes: ["status"], // Include the current status for checking
          },
        ],
      });

      for (const order of orders) {
        const { bookedDates, id } = order;
        const firstBookedDate = new Date(bookedDates[0]);
        const lastBookedDate = new Date(bookedDates[bookedDates.length - 1]);

        let newStatus;

        if (currentDate < firstBookedDate) {
          newStatus = "upcoming";
        } else if (
          currentDate >= firstBookedDate &&
          currentDate <= lastBookedDate
        ) {
          newStatus = "ongoing";
        } else {
          newStatus = "returned?";
        }

        // Only update if the status has changed
        if (order.OrderStatus.status !== newStatus) {
          await OrderStatus.update(
            { status: newStatus },
            { where: { orderId: id } }
          );
         

          // Add updated order ID to the array
          updatedOrderIds.push(id);

          // Update the status in Typesense
          await AdminOrderControllers.updateStatusOnTypesense(id,newStatus);
        }
      }
      // Return the updated order IDs for debugging or further processing
      return updatedOrderIds;
  }
}
