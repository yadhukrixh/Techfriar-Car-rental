import Orders from "../models/orders-model.js";

export class OrdersRepository {
  // fetch future orders
  static async fetchFutureOrders(id) {
    const currentDate = new Date();

    // Fetch all orders where the first date in bookedDates is greater than the current date
    const futureOrders = await Orders.findAll({
      where: {
        bookedCarId: rentableCarId, // Match the rentable car ID
        // Ensure the first date in bookedDates is greater than the current date
        bookedDates: {
          [Op.and]: [
            { [Op.ne]: null }, // Ensure it's not null
            { [Op.gt]: currentDate }, // First element of the array is greater than current date
          ],
        },
      },
    });

    return {
      status: true,
      message: "Successfully fetched futureDates",
      data: futureOrders,
    };
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
