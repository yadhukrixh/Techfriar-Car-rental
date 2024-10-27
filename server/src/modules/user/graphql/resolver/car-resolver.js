import { CarsControllers } from "../../controllers/cars-controllers.js";

const handleCarResolver = {
  Query: {
    fetchAvailableCars: async (
      _,
      {
        startDate,
        endDate,
        fuelTypes,
        transmissionTypes,
        capacities,
        maxPrice,
        sortType,
        searchQuery,
      }
    ) => {
      try {
        const fetchAvailableCars = await CarsControllers.fetchAvailablecars(
          startDate,
          endDate,
          fuelTypes,
          transmissionTypes,
          capacities,
          maxPrice,
          sortType,
          searchQuery
        );
        return fetchAvailableCars;
      } catch (error) {
        console.error(error);
        return {
          status: false,
          message: error,
        };
      }
    },

    //fetch car by id
    fetchCarById: async (_, { id }) => {
      try {
        const car = await CarsControllers.fetchCarById(id);
        return car;
      } catch (error) {
        return {
          status: false,
          message: "Internal server error",
        };
      }
    },
  },

  Mutation: {
    //create booking
    createBooking: async (_, { input }) => {
      try {
        const bookCar = await CarsControllers.createBooking(input);
        return bookCar;
      } catch (error) {
        return {
          status: false,
          message: error,
        };
      }
    },

    //handle razorpay order creation
    createRazorPayOrder: async (_, { amount }) => {
      try {
        const createOrder = await CarsControllers.createRazorPayOrder(amount);
        return createOrder;
      } catch (error) {
        console.error("Error creating order:", error);
        return { status: false, message: "Order creation failed" };
      }
    },

    // verify payment
    verifyPayment: async (_, { orderId, paymentId, signature }) => {
     try{
        const verifyPayment = await CarsControllers.verifyPayment(orderId,paymentId,signature);
        return verifyPayment;
     }catch(error){
        return{
            status:false,
            message:error
        }
     }
    },

    //update booking
    updateBooking: async(_, { bookingId,paymentId,verifiedStatus }) => {
        try{
            const updateBooking = await CarsControllers.updateBooking(bookingId,paymentId,verifiedStatus);
            return updateBooking;
        }catch(error){
            console.error(error)
            return{
                status:false,
                message:error
            }
        }
    }
  },
};

export default handleCarResolver;
