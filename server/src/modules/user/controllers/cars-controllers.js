import typesenseClient, { buildQuery } from "../../../config/typesense.js";
import { FormatImageUrl } from "../../../utils/format-image-url.js";
import { CarRepository } from "../repositories/car-repo.js";

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
        year:car.data.year,
        fuelType:car.data.fuelType,
        transmissionType:car.data.transmissionType,
        numberOfSeats:car.data.numberOfSeats,
        numberOfDoors:car.data.numberOfDoors,
        pricePerDay:car.data.pricePerDay
      };

      return{
        ...car,
        data:formattedCar
      }
    } catch (error) {
      console.error(error);
      return{
        status:false,
        message:"Failed to fetch car"
      }
    }
  }

  //book cars
  static async createBooking(input){
    try{
      const { userId, bookedDates, carModelId, deliveryLocation, returnLocation, secondaryMobileNumber, amount } = input;
      const formattedDates = bookedDates.map(dateStr => new Date(dateStr));
      const checkAvailablecar = await CarRepository.checkCarAvailability(carModelId,formattedDates);

      //manage concurent bookings
      if(!checkAvailablecar.status){
        return checkAvailablecar
      }

      // create transaction
      const transaction = await CarRepository.createTransaction(userId,amount)
      if(!transaction.status){
        return transaction;
      }

      // create bookings
      const booking = await CarRepository.createBooking(userId,formattedDates,checkAvailablecar.rentableCarId,transaction.transactionId,deliveryLocation,returnLocation,secondaryMobileNumber);
      return booking

    }catch(error){
      return{
        status:false,
        message:error
      }
    }
  }
}
