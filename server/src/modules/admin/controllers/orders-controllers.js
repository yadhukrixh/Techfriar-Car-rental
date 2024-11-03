import typesenseClient from "../../../config/typesense.js";
import { OrdersRepository } from "../repositories/orders-repo.js";

export class AdminOrderControllers {

  // add orders to type sense
  static async addOrdersToTypesense(id) {
    try {
      // Fetch orders from your repository
      const order = await OrdersRepository.fetchOrdersToTypesense(id);

      // Prepare document with 'orderId' as the 'id' field to avoid duplication
      const document = {
        id: (order.orderId).toString(), // Set 'orderId' as 'id' for Typesense
        userId: order.userId?.toString() || "",
        method: order.method || "",
        orderStatus: order.orderStatus || "",
        completionStatus: order.completionStatus || "",
        amount: order.amount || 0,
        bookedDates: order.bookedDates?.map((date) => date.toISOString()) || [],
        brandName: order.brandName || "",
        carName: order.carName || "",
        registrationNumber: order.registrationNumber || "",
        completionDate:Math.floor(Date.now() / 1000)
      };

      // Upsert the document
      await typesenseClient
        .collections("orders")
        .documents()
        .upsert(document);
    } catch (error) {
      console.error("Error adding order to Typesense:", error);
    }
  }

  // update order status
  static async updateOrderStatuses(){
    try{
      const currentDate = new Date();
      await OrdersRepository.updateOrderStatuses(currentDate);

    }catch(error){
      console.error
    }
  }

  // update typesense status
  static async updateStatusOnTypesense(orderId,newStatus){
    try {
      await typesenseClient.collections('orders').documents(orderId).update({
        completionStatus: newStatus
      });
    } catch (error) {
      console.error(`Error updating Typesense for Order ${orderId}:`, error);
    }
  }
}
