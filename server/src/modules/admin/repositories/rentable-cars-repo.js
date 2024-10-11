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
          "pricePerDay"
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
        pricePerDay: car.pricePerDay,
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

  // Check already a rentable car exist
  static async checkRentableAlreadyExist(registrationNumber){
    try{
        const rentableCar = await RentableCars.findOne({where: { registrationNumber }});
        if(rentableCar){
            return{
                status:true,
                message:"This Registration number already Exist!"
            }
        }
        else{
            return{
                status:false,
                message:"This Registration number doesnt exist"
            }
        }
    }catch{
        throw new Error("Faild to check the registration number")
    }
  }

  // Add rentable car to the data base
  static async addRentableCar(registrationNumber,carId){
    try{
        const rentableCar = await RentableCars.create({
            registrationNumber:registrationNumber,
            carId:carId,
        })
        if(rentableCar){
            return{
                status:true,
                message:"Rentable car added successfully"
            }
        }else{
            return{
                status:false,
                message:"failed to add new rentable Car details"
            }
        }
    }catch(error){
        throw new Error("Failed to add rentable vehicles")
    }
  }
}
