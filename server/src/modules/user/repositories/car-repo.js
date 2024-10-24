import Brands from "../../admin/models/brands-models.js";
import AllCars from "../../admin/models/cars-models.js";
import Orders from "../../admin/models/orders-model.js";
import RentableCars from "../../admin/models/rentable-cars-models.js";
import { Op } from 'sequelize';

export class CarRepository {
  //fech available cars
  static async fetchAvailablecars(startDate, endDate) {
    try {
      // Step 1: Fetch all bookedCarIds that overlap with the given date range
      const overlappingOrders = await Orders.findAll({
        where: {
          [Op.or]: [
            {
              bookedDates: {
                [Op.overlap]: [startDate, endDate], // Check for date overlap
              },
            },
          ],
        },
        attributes: ["bookedCarId"], // Only fetch bookedCarId field
      });

      // Step 2: Extract bookedCarIds from the orders
      const bookedCarIds = overlappingOrders.map((order) => order.bookedCarId);

      // Step 3: Fetch rentable cars that are NOT in the bookedCarIds list
      const availableRentableCars = await RentableCars.findAll({
        where: {
          id: {
            [Op.notIn]: bookedCarIds, // Exclude the booked car IDs
          },
          activeStatus: true, // Optionally, only return cars that are active
        },
        attributes: ["carId"], // Only fetch carId (to avoid fetching all rentable car details)
        group: ["carId"], // Group by carId to get unique car entries
      });

      // Step 4: Extract unique carIds from the available rentable cars
      const uniqueCarIds = availableRentableCars.map(
        (rentableCar) => rentableCar.carId
      );

      // Step 5: Fetch car data from AllCars including brand details (brand name and logoUrl)
      const availableCars = await AllCars.findAll({
        where: {
          id: {
            [Op.in]: uniqueCarIds, // Fetch only cars that match the unique carIds
          },
        },
        include: [
          {
            model: Brands, // Include the associated Brand model
            as: "brand", // Use the alias defined in the model association
            attributes: ["name", "imageUrl"], // Fetch only brand name and logo URL
          },
        ],
      });

      //return fetched cars
      if (availableCars) {
        return {
          status: true,
          message: "Cars Found on corresponding Date",
          data: availableCars,
        };
      } else {
        return {
          status: false,
          message: "Failed to fetch Cars from the Datebase",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}
