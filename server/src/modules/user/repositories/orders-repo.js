import Brands from "../../admin/models/brands-models.js";
import AllCars from "../../admin/models/cars-models.js";
import OrderStatus from "../../admin/models/order-status-model.js";
import Orders from "../../admin/models/orders-model.js";
import RentableCars from "../../admin/models/rentable-cars-models.js";
import { Transactions } from "../../admin/models/transactions-model.js";
import moment from "moment";
import Users from "../models/user-model.js";

export class OrdersRepository {
  // fetch all orders of user
  static async fetchAllOrdersOfUser(userId) {
    try {
      // Fetch the orders with associations to related models
      const orders = await Orders.findAll({
        where: { userId },
        include: [
          {
            model: RentableCars,
            as: "RentableCar", // Use the correct alias here if it's defined in your association
            include: [
              {
                model: AllCars,
                as: "car", // Ensure this matches the association alias
                include: [
                  {
                    model: Brands,
                    as: "brand", // Ensure this matches the association alias
                    attributes: ["name"], // Fetch brand name only
                  },
                ],
                attributes: ["name", "primaryImageUrl"], // Fetch car name and image
              },
            ],
            attributes: ["registrationNumber"], // Fetch car registration number
          },
          {
            model: OrderStatus,
            attributes: ["status"], // Fetch the completion status
          },
          {
            model: Transactions,
            as: "transaction", // Use the correct alias for Transactions if defined
            attributes: ["status", "amount"],
          },
        ],
        attributes: ["id", "date", "bookedDates"], // Fetch orderId, orderDate, and bookedDates
      });

      const formattedOrders = orders.map((order) => ({
        orderId: order.id,
        carName: order.RentableCar?.car?.name || "N/A",
        image: order.RentableCar?.car?.primaryImageUrl || "N/A",
        registrationNumber:
          order.transaction?.status === "success"
            ? order.RentableCar?.registrationNumber
            : "N/A",
        brandName: order.RentableCar?.car?.brand?.name || "N/A",
        completionStatus: order.OrderStatus?.status || "N/A", // Default to 'unknown' if null
        orderStatus: order.transaction?.status || "N/A", // Assuming orderStatus and completionStatus are the same
        amount: order.transaction?.amount || 0,
        orderDate: moment(order.date).format("YYYY-MM-DD"), // Format order date
        bookedDates: order.bookedDates.map((date) =>
          moment(date).format("YYYY-MM-DD")
        ), // Format each booked date
      }));

      return formattedOrders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  // fetch each order
  static async fetchEachOrder(orderId) {
    try {
      const order = await Orders.findOne({
        where: { id: orderId },
        include: [
          {
            model: Users,
            as: "User", // Ensure alias matches your association definition
            attributes: [
              "id",
              "name",
              "email",
              "phoneNumber",
              "city",
              "state",
              "country",
              "pincode",
            ],
          },
          {
            model: RentableCars,
            as: "RentableCar", // Use the correct alias for RentableCars if defined
            include: [
              {
                model: AllCars,
                as: "car", // Ensure this matches the alias used in the association
                attributes: ["name", "primaryImageUrl", "year","pricePerDay"],
                include: [{ model: Brands, as: "brand", attributes: ["name"] }],
              },
            ],
          },
          {
            model: Transactions,
            as: "transaction", // Use the correct alias for Transactions if defined
            attributes: ["razorpayId", "method", "status", "amount"],
          },
          {
            model: OrderStatus,
            attributes: ["status"],
          },
        ],
      });

      if (!order) {
        throw new Error("Order not found");
      }



      const data = {
        orderedData: {
          id: order.id,
          orderedDate: order.date.toISOString(),
          bookedDates: order.bookedDates.map((date) => date.toISOString()),
          carName: order.RentableCar?.car?.name || "N/A",
          carImage: order.RentableCar?.car?.primaryImageUrl || "N/A",
          carYear: order.RentableCar?.car?.year || "N/A",
          pricePerDay:  order.RentableCar?.car?.pricePerDay,
          brandName: order.RentableCar?.car?.brand?.name || "N/A",
          paymentId: order.transaction?.razorpayId || "N/A",
          method: order.transaction?.method || "N/A",
          status: order.transaction.status || "N/A",
          orderStatus:order.OrderStatus === null?"N/A":order.OrderStatus.status || "N/A",
          amount: order.transaction?.amount || 0,
        },
        userData: {
          id: order.User?.id,
          name: order.User?.name,
          email: order.User?.email,
          phoneNumber: order.User?.phoneNumber,
          city: order.User?.city,
          state: order.User?.state,
          country: order.User?.country,
          pincode: order.User?.pincode,
        },
      };

      return data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }
}
