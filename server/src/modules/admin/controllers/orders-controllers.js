import typesenseClient from "../../../config/typesense.js";
import { OrdersRepository } from "../repositories/orders-repo.js";

export class AdminOrderControllers {
  static async addOrdersToTypesense() {
    try {
      const orders = await OrdersRepository.fetchOrdersToTypesense();
      const documents = orders.map((order) => ({
        orderId: order.orderId.toString(), // Ensure orderId is a string
        userId: order.userId.toString(), // Ensure userId is a string
        method: order.method,
        orderStatus: order.orderStatus,
        completionStatus: order.completionStatus,
        amount: order.amount,
        bookedDates: order.bookedDates.map((date) => date.toISOString()), // Convert dates to strings
        brandName: order.brandName,
        carName: order.carName,
        registrationNumber: order.registrationNumber,
      }));

      for (const document of documents) {
          await typesenseClient.collections("orders").documents().upsert(document);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
