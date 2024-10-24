import { Op, where } from "sequelize";
import AllCars from "../models/cars-models.js";
import RentableCars from "../models/rentable-cars-models.js";
import Brands from "../models/brands-models.js";
import { FormatImageUrl } from "../../../utils/format-image-url.js";
import Orders from "../models/orders-model.js";

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
          "pricePerDay",
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
        brandLogo: await FormatImageUrl.formatImageUrl(
          car.brand.dataValues.imageUrl
        ),
        primaryImage: await FormatImageUrl.formatImageUrl(car.primaryImageUrl),
        year: car.year,
        availableQuantity: car.availableQuantity,
        pricePerDay: car.pricePerDay,
        rentableCars: rentableCars.map((rentableCar) => ({
          id: rentableCar.id,
          registrationNumber: rentableCar.registrationNumber,
          activeStatus: rentableCar.activeStatus,
        })), // Map over rentableCars to format each item
      };

      if (formattedCarResponse) {
        return {
          status: true,
          message: "Successfully fetched Car data",
          data: formattedCarResponse,
        };
      } else {
        return {
          status: false,
          message: "Failed to fetch data from database",
        };
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  // get rentable car
  static async getRentableCar(id) {
    try {
      const rentableCar = await RentableCars.findByPk(id);
      if (rentableCar) {
        return {
          status: true,
          message: "fetched rentsable car",
          data: rentableCar,
        };
      }
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }

  // Check already a rentable car exist
  static async checkRentableAlreadyExist(registrationNumber) {
    try {
      const rentableCar = await RentableCars.findOne({
        where: { registrationNumber },
      });
      if (rentableCar) {
        return {
          status: true,
          message: "This Registration number already Exist!",
          data:rentableCar
        };
      } else {
        return {
          status: false,
          message: "This Registration number doesnt exist",
        };
      }
    } catch {
      throw new Error("Faild to check the registration number");
    }
  }

  // fetch available rentable ccars
  static async fetchAvailableRentableCars(carId, rentableCarId) {
    try {
      const availableRentableCars = await RentableCars.findAll({
        where: {
          carId: carId, // Same carId/model
          activeStatus: true, // Only active cars
          id: {
            [Op.ne]: rentableCarId, // Exclude the car being deactivated
          },
        },
      });

      return{
        status:true,
        message:"Fetched availabel cars",
        data:availableRentableCars
      }
    } catch (error) {
      return {
        status: false,
        message: "failed to fetch available rentable cars",
      };
    }
  }

  // Add rentable car to the data base
  static async addRentableCar(registrationNumber, carId) {
    try {
      const rentableCar = await RentableCars.create({
        registrationNumber: registrationNumber,
        carId: carId,
      });
      if (rentableCar) {
        return {
          status: true,
          message: "Rentable car added successfully",
        };
      } else {
        return {
          status: false,
          message: "failed to add new rentable Car details",
        };
      }
    } catch (error) {
      throw new Error("Failed to add rentable vehicles");
    }
  }

  // fetch data to the typesense
  static async fetchDataToTypesense(carId) {
    try {
      const typeSenseData = await AllCars.findByPk(carId, {
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
          "year",
          "pricePerDay",
          "fuelType",
          "transmissionType",
          "numberOfSeats",
          "numberOfDoors",
        ],
      });

      if (!typeSenseData) {
        return {
          status: false,
          message: "Failed to fetch data for upload to the Typesense",
        };
      }

      const formattedData = {
        id: typeSenseData.id.toString(),
        name: typeSenseData.name,
        year: typeSenseData.year,
        brandName: typeSenseData.brand.name,
        fuelType: typeSenseData.fuelType,
        transmissionType: typeSenseData.transmissionType,
        numberOfSeats: typeSenseData.numberOfSeats,
        numberOfDoors: typeSenseData.numberOfDoors,
        price: typeSenseData.pricePerDay,
      };


      return {
        statu: true,
        message: "Successfully fetched data",
        data: formattedData,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  // Change active status
  static async changeActiveStatus(id, status) {
    try {
      const changeActiveStatus = await RentableCars.update(
        { activeStatus: status },
        { where: { id: id } }
      );
      if (changeActiveStatus) {
        return {
          status: true,
          message: "Active status updated successfully",
        };
      }
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }

  // edit registration number
  static async editRegistrationNumber(id,registrationNumber){
    try{
        const editRegistrationNumber = await RentableCars.update(
            { registrationNumber: registrationNumber },
            { where: { id: id} } 
        );
        if(editRegistrationNumber){
            return{
                status:true,
                message:"Registration number updated successfully!"
            }
        }else{
            return{
                status:false,
                message:"Failed to fetch Registration number!"
            }
        }
    }catch(error){
        return{
            status:false,
            message:"Failed to update the Registration Number"
        }
    }
  }
}
