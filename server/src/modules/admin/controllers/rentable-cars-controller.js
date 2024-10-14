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
        // set from false status to the true
      } else {
        // check is there any dates in future booking
        const fetchFutureOrders =
          await OrdersRepository.fetchFutureOrders(id);
        const futureOrders = fetchFutureOrders.data;

        // if there is no any future bookings directly deactivate
        if (futureOrders.length === 0) {
          const changeActiveStatus =
            await RentableCarsRepository.changeActiveStatus(id, status);
          return {
            status: changeActiveStatus.status,
            message: changeActiveStatus.message,
          };
        }

        // handle future bookings
        const car = (await RentableCarsRepository.getRentableCar(id)).data;
        for (const order of futureOrders) {
          const bookedDates = order.bookedDates;

          //Find other rentable cars with the same carId, excluding the current one
          const availableRentableCars = (
            await RentableCarsRepository.fetchAvailablerentableCars(
              car.carId,
              id
            )
          ).data;

          let reassignedCarId = null;

          // check each rentable car to avoid conflict
          for (const rentableCar of availableRentableCars) {
            const overlappingDates = rentableCar.bookingDates?.filter((date) =>
              bookedDates.includes(date)
            );

            if (overlappingDates.length === 0) {
              // Car is available for these dates
              reassignedCarId = rentableCar.id;
              break; // Exit loop as we found an available car
            }
          }

          if (reassignedCarId) {
            // Step 5: Reassign the order to the new rentable car
            const updateOrders = await OrdersRepository.updateOrderData(reassignedCarId,order.id)
            

            // Step 6: Update the booking dates for the newly assigned rentable car
            const newBookingDates = [
              ...availableRentableCars.find((car) => car.id === reassignedCarId)
                .bookingDates,
              ...bookedDates,
            ];
            await RentableCars.update(
              { bookingDates: newBookingDates },
              { where: { id: reassignedCarId } }
            );
          } else {
            // No available car with the same model for the requested dates
            return {
              status: false,
              message:
                "No available rentable car for future bookings on these dates.",
            };
          }
        }

        //update status of rentable car
        const updateStatus = await RentableCarsRepository.changeActiveStatus(id,status);
        return{
            status:updateStatus.status,
            message:updateStatus.message
        }
      }
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }
}
