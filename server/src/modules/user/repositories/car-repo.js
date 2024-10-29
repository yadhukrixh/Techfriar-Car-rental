import Brands from "../../admin/models/brands-models.js";
import AllCars from "../../admin/models/cars-models.js";
import Orders from "../../admin/models/orders-model.js";
import RentableCars from "../../admin/models/rentable-cars-models.js";
import { Op } from "sequelize";
import { Transactions } from "../../admin/models/transactions-model.js";
import OrderStatus from "../../admin/models/order-status-model.js";

export class CarRepository {
  //fech available cars
  static async fetchAvailablecars(startDate, endDate) {
    try {
      // Step 1: Fetch all bookedCarIds that overlap with the given date range
      const overlappingOrders = await Orders.findAll({
        where: {
          [Op.and]: [
            {
              bookedDates: {
                [Op.overlap]: [startDate, endDate], // Check for date overlap
              },
            },
          ],
        },
        include: [
          {
            model: Transactions,
            as: "transaction", // Use alias set in Orders model
            required: true,
            where: {
              status: {
                [Op.in]: ["success", "pending"], // Check for both success and pending statuses
              },
            },
          },
        ],
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

  // fetch car by id
  static async fetchCarById(id) {
    try {
      const car = await AllCars.findByPk(id, {
        include: [
          {
            model: Brands, // Include the associated Brand model
            as: "brand", // Use the alias defined in the model association
            attributes: ["name", "imageUrl"], // Fetch only brand name and logo URL
          },
        ],
      });

      if (!car) {
        return {
          status: false,
          message: "Car not found",
        };
      }

      return {
        status: true, // Changed to true since the car was found
        message: "Car found",
        data: car.dataValues,
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: error.message || "An error occurred", // Provide a default message if error.message is undefined
      };
    }
  }

  // Check if a car model is available on the given dates
  static async checkCarAvailability(carModelId, dates) {
    try {
      // Step 1: Fetch all rentable cars for the given car model ID
      const rentableCars = await RentableCars.findAll({
        where: {
          carId: carModelId,
          activeStatus: true,
        },
        attributes: ["id"],
      });

      // Extract rentable car IDs from the fetched cars
      const rentableCarIds = rentableCars.map((car) => car.id);

      // Step 2: Find bookings for these rentable cars with date overlap and valid status
      const conflictingOrders = await Orders.findAll({
        where: {
          bookedCarId: {
            [Op.in]: rentableCarIds,
          },
          bookedDates: {
            [Op.overlap]: dates, // Check for overlapping dates
          },
        },
        include: [
          {
            model: Transactions,
            as: "transaction",
            required: true,
            where: {
              status: {
                [Op.in]: ["pending", "success"],
              },
            },
          },
        ],
        attributes: ["bookedCarId"], // Only fetch bookedCarId
      });

      // Step 3: Determine available rentable cars by excluding conflicted ones
      const conflictingCarIds = conflictingOrders.map(
        (order) => order.bookedCarId
      );
      const availableRentableCars = rentableCars.filter(
        (car) => !conflictingCarIds.includes(car.id)
      );

      if (availableRentableCars.length === 0) {
        // If all rentable cars have conflicting dates, return as fully booked
        return {
          status: false,
          message: "High traffic, SomeOne else booked your car!",
        };
      }

      // Step 4: Return a randomly available rentable car ID
      const randomAvailableCar =
        availableRentableCars[
          Math.floor(Math.random() * availableRentableCars.length)
        ];
      return {
        status: true,
        message: "Car available",
        rentableCarId: randomAvailableCar.id, // Return the ID of an available rentable car
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message:
          error.message || "An error occurred while checking car availability",
      };
    }
  }

  // create transaction
  static async createTransaction(userId, amount) {
    try {
      // Create a new transaction with status 'pending'
      const transaction = await Transactions.create({
        userId: userId,
        amount: amount,
        status: "pending",
        date: new Date(), // Date defaults to now, but adding explicitly for clarity
      });

      // Return a success response with the created transaction details
      return {
        status: true,
        message: "Transaction created successfully",
        transactionId: transaction.dataValues.id,
      };
    } catch (error) {
      console.error("Error creating transaction:", error);
      return {
        status: false,
        message: error.message || "Error creating transaction",
      };
    }
  }

  // create booking
  static async createBooking(
    userId,
    bookedDates,
    bookedRentableId,
    transactionId,
    deliveryLocation,
    returnLocation,
    secondaryMobileNumber
  ) {
    try {
      const booking = await Orders.create({
        userId: userId,
        bookedDates: bookedDates,
        bookedCarId: bookedRentableId,
        transactionId: transactionId,
        deliveryLocation: deliveryLocation,
        returnLocation: returnLocation,
        secondaryMobileNumber: secondaryMobileNumber,
        date: new Date(), // Explicitly setting the date, but it defaults to now
      });

      return {
        status: true,
        message: "Booking created successfully",
        data: {
          orderId: booking.dataValues.id,
        },
      };
    } catch (error) {
      console.error("Error creating booking:", error);
      return {
        status: false,
        message: error.message || "Failed to create booking",
      };
    }
  }

  // update booking
  static async updateBooking(bookingId, method,orderId, verifiedStatus) {
    try {
      // Find the booking/order by ID
      const order = await Orders.findByPk(bookingId, {
        include: [{ model: Transactions, as: "transaction" }],
      });

      if (!order) {
        return {
          status: false,
          message: "Order not found",
        };
      }

      // Update the transaction associated with this order
      const transaction = await Transactions.findOne({
        where: { id: order.transactionId },
      });

      if (transaction) {
        await transaction.update({
          method,
          razorpayId: orderId, // Assuming 'orderId' refers to 'razorpayId'
          status: verifiedStatus ? "success" : "failed", // Update based on verification status
        });
      }

      if(verifiedStatus){
        const orderStatus = await OrderStatus.create({
          orderId:bookingId,
          status:"upcoming"
        })
      }

      return {
        status: true,
        message: "Order and transaction updated successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "Error updating order and transaction",
      };
    }
  }

  //cancel pending orders
  static async cancelPendingOrders() {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      // Find orders older than 15 minutes
      const ordersToCancel = await Orders.findAll({
        where: {
          date: { [Op.lte]: fifteenMinutesAgo },
        },
        include: [
          {
            model: Transactions,
            as: "transaction",
            where: { status: "pending" },
          },
        ],
      });

      if (ordersToCancel.length === 0) {
        return;
      }

      // Update each associated transaction's status to "canceled"
      const transactionIds = ordersToCancel.map(
        (order) => order.transaction.id
      );
      const [updatedCount] = await Transactions.update(
        { status: "canceled" },
        {
          where: {
            id: { [Op.in]: transactionIds },
            status: "pending",
          },
        }
      );

      if (updatedCount > 0) {
        console.log(
          `Order cleanup: ${updatedCount} pending transactions have been canceled.`
        );
      }
    } catch (error) {
      console.error("Error in cancelPendingOrders:", error);
    }
  }

  //cancelBooking
  static async cancelBooking(bookingId) {
    try {
      // Fetch the order by primary key and include the transaction with pending status
      const order = await Orders.findByPk(bookingId, {
        include: [
          {
            model: Transactions,
            as: "transaction",
            where: { status: "pending" },
          },
        ],
      });
  
      // Check if order and transaction exist
      if (!order || !order.transaction) {
        return {
          status: false,
          message: 'Order or pending transaction not found',
        };
      }
  
      // Update the transaction's status to 'canceled'
      await Transactions.update(
        { status: "canceled" },
        { where: { id: order.transaction.id } }
      );
  
      return {
        status: true,
        message: 'Booking and transaction successfully canceled',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
}
