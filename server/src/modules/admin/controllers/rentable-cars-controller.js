import typesenseClient from "../../../config/typesense.js";
import { OrdersRepository } from "../repositories/orders-repo.js";
import { RentableCarsRepository } from "../repositories/rentable-cars-repo.js";
import { RentableRequest } from "../requests/add-rentables-request.js";

export class RentableCarsController {
  // fetch rentable cars on a single model
  static async fetchRentableCars(id) {
    try {
      const car = await RentableCarsRepository.fetchRentableCars(id);
      return {
        status: car.status,
        message: car.message,
        data: car.data,
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "failed to fetch rentable cars",
      };
    }
  }

  // add rentable car to the database
  static async addRentableCar(registrationNumber, carId) {
    try {
      const rentableRequest = new RentableRequest();

      const validateRegistration =
        await rentableRequest.validateRegistrationNumber(registrationNumber);
      if (!validateRegistration.status) {
        return {
          status: false,
          message: `Error in request Validation ${validateRegistration.message}`,
        };
      }

      const rentableExist =
        await RentableCarsRepository.checkRentableAlreadyExist(
          registrationNumber
        );

      if (rentableExist.status) {
        return {
          status: false,
          message: rentableExist.message,
        };
      }

      const typeSenseData = await RentableCarsRepository.fetchDataToTypesense(
        carId
      );

      const result = await typesenseClient
        .collections("cars")
        .documents()
        .upsert(typeSenseData.data); // Use 'upsert' to update if exists, insert if new

      const addRentableCar = await RentableCarsRepository.addRentableCar(
        registrationNumber,
        carId
      );

      return {
        status: addRentableCar.status,
        message: addRentableCar.message,
      };
    } catch (error) {
      throw error;
    }
  }

  // Change active status
  static async changeActiveStatus(id, status) {
    try {
      if (status) {
        const changeActiveStatus = await RentableCarsRepository.changeActiveStatus(id, status);
        return {
          status: changeActiveStatus.status,
          message: changeActiveStatus.message,
        };
      } else {
        // Fetch future orders
        const fetchFutureOrders = await OrdersRepository.fetchFutureOrders(id);
        const futureOrders = fetchFutureOrders.data || [];


        // Directly deactivate the car if there are no future bookings
        if (futureOrders.length === 0) {
          const changeActiveStatus = await RentableCarsRepository.changeActiveStatus(id, status);
          return {
            status: changeActiveStatus.status,
            message: changeActiveStatus.message,
          };
        }

        for (const order of futureOrders) {
          let bookedDates = order.bookedDates;

          // Ensure bookedDates is an array
          if (!Array.isArray(bookedDates)) {
            console.error("Error: bookedDates is not an array!", bookedDates);
            return {
              status: false,
              message: "Invalid data: bookedDates is not an array",
            };
          }

          // Check for available rentable cars for reassignment
          const availableRentableCars = (
            await RentableCarsRepository.fetchAvailableRentableCars(order.carId, id)
          ).data || [];

          let reassignedCarId = null;

          for (const rentableCar of availableRentableCars) {
            const existingBookingDates = Array.isArray(rentableCar.bookingDates)
              ? rentableCar.bookingDates
              : [];

            const overlappingDates = existingBookingDates.filter((date) =>
              bookedDates.includes(date)
            );

            if (overlappingDates.length === 0) {
              reassignedCarId = rentableCar.id;
              break;
            }
          }

          if (reassignedCarId) {
            await OrdersRepository.updateOrderData(reassignedCarId, order.id);

            const targetCar = availableRentableCars.find((car) => car.id === reassignedCarId);
            const newBookingDates = [
              ...(Array.isArray(targetCar.bookingDates) ? targetCar.bookingDates : []),
              ...bookedDates,
            ];

            await RentableCarsRepository.updateBookingDates(reassignedCarId, newBookingDates);
          } else {
            return {
              status: false,
              message: "No available rentable car for future bookings on these dates.",
            };
          }
        }

        const updateStatus = await RentableCarsRepository.changeActiveStatus(id, status);
        return {
          status: updateStatus.status,
          message: updateStatus.message,
        };
      }
    } catch (error) {
      console.error("Error in changeActiveStatus function:", error);
      return {
        status: false,
        message: `Error occurred: ${error.message || error}`,
      };
    }
  }

  // Edit registration number
  static async editRegistrationNumber(id,registrationNumber){
    try{
        const checkRentableAlreadyExist = await RentableCarsRepository.checkRentableAlreadyExist(registrationNumber);
        if((checkRentableAlreadyExist.status) && (id === checkRentableAlreadyExist.data.id)){
            return{
                status:true,
                message:"No action Taken"
            }
        }

        if(checkRentableAlreadyExist.status){
            return{
                status:false,
                message:"This registration number already assigned to another car!"
            }
        }

        const editregistrationNumber = await RentableCarsRepository.editRegistrationNumber(id,registrationNumber);

        return{
            status:editregistrationNumber.status,
            message:editregistrationNumber.message
        }

    }catch(error){
        return{
            status:false,
            message:error
        }
    }
  }
  
  
  
}
