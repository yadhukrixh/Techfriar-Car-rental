import typesenseClient, { buildQuery } from "../../../config/typesense.js";
import { FormatImageUrl } from "../../../utils/format-image-url.js";
import { CarRepository } from "../repositories/car-repo.js";

export class CarsControllers {
  static async fetchAvailablecars(
    startDate,
    endDate,
    fuelTypes,
    transmissionTypes,
    capacities,
    maxPrice,
    sortType
  ) {
    try {

      const query = buildQuery({
        selectedFuelTypes:fuelTypes,
        selectedTransmission:transmissionTypes,
        selectedCapacities:capacities,
        maxPrice: maxPrice,
      });

      const response = await typesenseClient.collections('cars').documents().search({
        q: '*',
        query_by: 'name, brandName,fuelType,transmissionType', // Change this to the fields you want to search
        filter_by: query,
      });

      const carIds = response.hits.map(hit => parseInt(hit.document.id));


      const fetchAvailableCars = await CarRepository.fetchAvailablecars(
        startDate,
        endDate
      );


      const availableCars = fetchAvailableCars.data.filter(car => carIds.includes(car.id));

      if (fetchAvailableCars.status) {
        const availableCarsData = await Promise.all(
          availableCars.map(async (car) => {
            return {
              id: car.id,
              name: car.name,
              description: car.description,
              brandName: car.brand?.name, // Access brand name
              brandLogo: await FormatImageUrl.formatImageUrl(
                car.brand?.imageUrl
              ), // Await the formatted brand logo URL
              primaryImage: await FormatImageUrl.formatImageUrl(
                car.primaryImageUrl
              ), // Await the formatted primary image URL
              secondaryImages: car.secondaryImages
                ? await Promise.all(
                    car.secondaryImages.map(
                      async (imageUrl) =>
                        await FormatImageUrl.formatImageUrl(imageUrl)
                    )
                  )
                : [], // Only map if secondaryImage exists, else return an empty array
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
