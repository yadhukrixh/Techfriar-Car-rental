import { Op } from "sequelize";
import Orders from "../models/orders-model.js";

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
      return { status: false, message: `Error updating order: ${error.message}` };
    }
  }

  // update orders
  static async updateOrderData(reassignedCarId, orderId) {
    try {
      const updateOrder = await Orders.update(
        { bookedCarId: reassignedCarId }, // Update the order to use the new rentable car
        { where: { id: orderId } }
      );

      if(updateOrder){
        return{
            status:true,
            message:"Order Updetes successfully."
        }
      }
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }
}
