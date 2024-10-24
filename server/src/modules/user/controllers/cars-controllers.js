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
}
