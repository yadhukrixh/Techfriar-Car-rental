import { buildOrderQuery } from "../../../config/typesense.js";
import typesenseClient from "../../../config/typesense.js";
import { FormatImageUrl } from "../../../utils/format-image-url.js";
import { OrdersRepository } from "../repositories/orders-repo.js";

export class OrdersControllers {
    static async fetchAllOrdersOfUser(id, timePeriod, searchQuery, orderStatus) {
        try {
            // Build the filter query based on provided filters
            const orderFilters = buildOrderQuery({
                selectedTimePeriod: timePeriod,
                selectedStatus: orderStatus,
                searchQuery: searchQuery,
            });

            // Perform the search on Typesense "orders" collection
            const response = await typesenseClient
                .collections("orders")
                .documents()
                .search({
                    q: searchQuery || "*", // Use '*' if search query is empty
                    query_by: "userId, method, orderStatus, brandName, carName, bookedDates, completionStatus, registrationNumber",
                    filter_by: orderFilters,
                });

            // Extract order IDs from the response and return them
            const orderIds = response.hits.map((hit) => parseInt(hit.document.id));
            

            //fetch orders from the database
            const usersOrders = await OrdersRepository.fetchAllOrdersOfUser(id)
            if (usersOrders.length > 0) {
                const formattedOrders = await Promise.all(
                    usersOrders.map(async (order) => ({
                        ...order,
                        image: await FormatImageUrl.formatImageUrl(order.image),
                    }))
                );

                const orders = formattedOrders.filter((order) =>
                    orderIds.includes(order.orderId)
                  );

                return{
                    status:true,
                    message:"Orders fetched succesffully",
                    data:orders
                }
            }

            return{
                status:false,
                message:"No Ordres found!"
            }
            

        } catch (error) {
            console.error("Error fetching orders:", error);
            return {
                status:false,
                message:"Server Error"
            };
        }
    }
}
