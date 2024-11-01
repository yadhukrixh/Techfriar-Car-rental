import typesenseClient, { buildQuery } from "../../../config/typesense.js";
import { FormatImageUrl } from "../../../utils/format-image-url.js";
import { CarRepository } from "../repositories/car-repo.js";
import crypto from "crypto";
import { razorpay } from "../../../config/razorpay.js";
import { AdminOrderControllers } from "../../admin/controllers/orders-controllers.js";


export class CarsControllers {
  // Fetch available cars
  static async fetchAvailablecars(
    startDate,
    endDate,
    fuelTypes,
    transmissionTypes,
    capacities,
    maxPrice,
    sortType,
    searchQuery
  ) {
    try {
      const filters = buildQuery({
        selectedFuelTypes: fuelTypes,
        selectedTransmission: transmissionTypes,
        selectedCapacities: capacities,
        maxPrice: maxPrice,
      });

      const response = await typesenseClient
        .collections("cars")
        .documents()
        .search({
          q: searchQuery || "*", // Use the searchQuery or default to "*"
          query_by: "name, brandName, fuelType, transmissionType",
          filter_by: filters, // Apply filters
        });

      const carIds = response.hits.map((hit) => parseInt(hit.document.id));

      const fetchAvailableCars = await CarRepository.fetchAvailablecars(
        startDate,
        endDate
      );

      const availableCars = fetchAvailableCars.data.filter((car) =>
        carIds.includes(car.id)
      );

      if (fetchAvailableCars.status) {
        const availableCarsData = await Promise.all(
          availableCars.map(async (car) => {
            return {
              id: car.id,
              name: car.name,
              description: car.description,
              brandName: car.brand?.name,
              brandLogo: await FormatImageUrl.formatImageUrl(
                car.brand?.imageUrl
              ),
              primaryImage: await FormatImageUrl.formatImageUrl(
                car.primaryImageUrl
              ),
              secondaryImages: car.secondaryImages
                ? await Promise.all(
                    car.secondaryImages.map(
                      async (imageUrl) =>
                        await FormatImageUrl.formatImageUrl(imageUrl)
                    )
                  )
                : [],
              year: car.year,
              fuelType: car.fuelType,
              transmissionType: car.transmissionType,
              numberOfSeats: car.numberOfSeats,
              numberOfDoors: car.numberOfDoors,
              pricePerDay: car.pricePerDay,
            };
          })
        );
        
        return {
          status: fetchAvailableCars.status,
          message: fetchAvailableCars.message,
          data: availableCarsData,
        };
      } else {
        return {
          status: false,
          message: "Failed to fetch available cars",
        };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //fetch car by id
  static async fetchCarById(id) {
    try {
      const car = await CarRepository.fetchCarById(id);
      if (!car.status) {
        return car;
      }

      const formattedCar = {
        id: car.data.id,
        name: car.data.name,
        description: car.data.description,
        brandName: car.data.brand.name,
        brandLogo: await FormatImageUrl.formatImageUrl(car.data.brand.imageUrl),
        primaryImage: await FormatImageUrl.formatImageUrl(
          car.data.primaryImageUrl
        ),
        secondaryImages: car.data.secondaryImages
          ? await Promise.all(
              car.data.secondaryImages.map(
                async (imageUrl) =>
                  await FormatImageUrl.formatImageUrl(imageUrl)
              )
            )
          : [],
        year: car.data.year,
        fuelType: car.data.fuelType,
        transmissionType: car.data.transmissionType,
        numberOfSeats: car.data.numberOfSeats,
        numberOfDoors: car.data.numberOfDoors,
        pricePerDay: car.data.pricePerDay,
      };

      return {
        ...car,
        data: formattedCar,
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "Failed to fetch car",
      };
    }
  }

  //book cars
  static async createBooking(input) {
    try {
      const {
        userId,
        bookedDates,
        carModelId,
        deliveryLocation,
        returnLocation,
        secondaryMobileNumber,
        amount,
      } = input;
      const formattedDates = bookedDates.map((dateStr) => new Date(dateStr));
      const checkAvailablecar = await CarRepository.checkCarAvailability(
        carModelId,
        formattedDates
      );

      //manage concurent bookings
      if (!checkAvailablecar.status) {
        return checkAvailablecar;
      }

      // create transaction
      const transaction = await CarRepository.createTransaction(userId, amount);
      if (!transaction.status) {
        return transaction;
      }

      // create bookings
      const booking = await CarRepository.createBooking(
        userId,
        formattedDates,
        checkAvailablecar.rentableCarId,
        transaction.transactionId,
        deliveryLocation,
        returnLocation,
        secondaryMobileNumber
      );

      // add to typesense
      await AdminOrderControllers.addOrdersToTypesense(booking.data.orderId)

      return booking;
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }

  //create razor pay order
  static async createRazorPayOrder(amount) {
    try {

      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        payment_capture: 1, // Auto-capture payment
      });

      return {
        status: true,
        message: "Razorpay order created",
        data: {
          orderId: order.id,
        },
      };
    } catch (error) {
      return { status: false, message: "Order creation failed" };
    }
  }

  //verify the razor pay order
  static async verifyPayment(orderId, paymentId, signature) {
    try {
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(orderId + "|" + paymentId)
        .digest("hex");

      if (generatedSignature === signature) {
        // Update payment status in your database
        const payment = await this.fetchPaymentDetails(paymentId);
        return { status: true, message: "Payment verified successfully" };
      } else {
        return { status: false, message: "Payment verification failed" };
      }
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }

  //fetch payment details
  static async fetchPaymentDetails(paymentId) {
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      return payment; // Return the payment details
    } catch (error) {
      console.error("Error fetching payment details:", error);
      throw new Error("Failed to fetch payment details");
    }
  }

  //update booking
  static async updateBooking(bookingId,paymentId,verifiedStatus){
    try{
      const paymentDetails = await this.fetchPaymentDetails(paymentId);
      const updateBooking = await CarRepository.updateBooking(bookingId,paymentDetails.method,paymentDetails.order_id,verifiedStatus);

      // add to typesense
      await AdminOrderControllers.addOrdersToTypesense(bookingId);

      return updateBooking;
    }catch(error){
      return{
        status:false,
        message:error
      }
    }
  }

  //cancel booking
  static async cancelBooking(bookingId){
    try{
      const cancelBooking = await CarRepository.cancelBooking(bookingId);

      // add to typesense
      await AdminOrderControllers.addOrdersToTypesense(bookingId)

      return cancelBooking;
    }catch(error){
      return{
        status:false,
        message:error
      }
    }
  }
}
