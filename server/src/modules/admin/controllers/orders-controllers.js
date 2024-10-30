import typesenseClient from "../../../config/typesense.js";
import { OrdersRepository } from "../repositories/orders-repo.js";

export class AdminOrderControllers {
  static async addOrdersToTypesense() {
    try {
      // Fetch existing documents from Typesense
      const existingOrders = await typesenseClient
        .collections("orders")
        .documents()
        .export();

      // Parse existing orders into a lookup for easy comparison
      const existingOrderIds = new Set();
      existingOrders.split("\n").forEach((line) => {
        if (line) {
          const order = JSON.parse(line);
          existingOrderIds.add(order.orderId);
        }
      });

      // Fetch orders from your repository
      const orders = await OrdersRepository.fetchOrdersToTypesense();

      // Prepare documents, filtering out duplicates
      const documents = orders
        .filter((order) => !existingOrderIds.has(order.orderId)) // Only new orders
        .map((order) => ({
          orderId: order.orderId || 0,
          userId: order.userId?.toString() || "",
          method: order.method || "",
          orderStatus: order.orderStatus || "",
          completionStatus: order.completionStatus || "",
          amount: order.amount || 0,
          bookedDates:
            order.bookedDates?.map((date) => date.toISOString()) || [],
          brandName: order.brandName || "",
          carName: order.carName || "",
          registrationNumber: order.registrationNumber || "",
        }));


      // Upsert new documents
      for (const document of documents) {
        try {
          await typesenseClient
            .collections("orders")
            .documents()
            .upsert(document);
        } catch (error) {
          console.error("Failed to upsert document:", document);
          console.error("Error details:", error);
        }
      }
    } catch (error) {
      console.error("Error adding orders to Typesense:", error);
    }
  }
}
