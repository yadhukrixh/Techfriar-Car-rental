import { where } from "sequelize";
import AllCars from "../models/cars-models.js";
import RentableCars from "../models/rentable-cars-models.js";
import Brands from "../models/brands-models.js";
import { FormatImageUrl } from "../../../utils/format-image-url.js";

export class RentableCarsRepository {
  // fetch rentable cars from the single model
  static async fetchRentableCars(id) {
    try {
      const car = await AllCars.findByPk(id, {
        include: [
          {
            model: Brands,
            as: "brand", // Alias used in your relationship definition
            attributes: ["name", "imageUrl"], // Only fetch brand name and logo (imageUrl)
          },
        ],
        attributes: [
          "id",
          "name",
          "primaryImageUrl",
          "availableQuantity",
          "year",
        ],
      });
      const rentableCars = await RentableCars.findAll({
        where: { carId: id },
        attributes: ["id", "registrationNumber", "activeStatus"],
      });

      const formattedCarResponse = {
        id: car.id,
        name: car.name, // Make sure to get the name property correctly
        brandName: car.brand.dataValues.name,
        brandLogo: await FormatImageUrl.formatImageUrl(car.brand.dataValues.imageUrl),
        primaryImage: await FormatImageUrl.formatImageUrl(car.primaryImageUrl),
        year: car.year,
        availableQuantity: car.availableQuantity,
        rentableCars: rentableCars.map(rentableCar => ({
          id: rentableCar.id,
          registrationNumber: rentableCar.registrationNumber,
          activeStatus: rentableCar.activeStatus,
        })), // Map over rentableCars to format each item
      };

      if(formattedCarResponse){
        return{
            status:true,
            message:"Successfully fetched Car data",
            data:formattedCarResponse
        }
      }else{
        return{
            status:false,
            message:"Failed to fetch data from database"
        }
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
