import { Sequelize } from "sequelize";
import Brands from "../models/brands-models.js";
import AllCars from "../models/cars-models.js";
import RentableCars from "../models/rentable-cars-models.js";

class ManageCarsRepository {
  // Check the car exist
  static async checkCarExist(name, year) {
    try {
      const car = await AllCars.findOne({ where: { name, year } });
      if (car) {
        return {
          status: true,
          message: "following car is already exist",
        };
      } else {
        return {
          status: false,
        };
      }
    } catch {
      throw new Error("Failed to fetch data from the database.");
    }
  }

  // repo func for the add new car
  static async addCar(
    name,
    description,
    brandId,
    primaryImageUrl,
    otherImages,
    quantity,
    year,
    fuelType,
    transmissionType,
    numberOfSeats,
    numberOfDoors
  ) {
    try {
      const car = await AllCars.create({
        name: name,
        description: description,
        brandId: brandId,
        primaryImageUrl: primaryImageUrl,
        secondaryImages: otherImages,
        availableQuantity: quantity,
        year: year,
        fuelType: fuelType,
        transmissionType: transmissionType,
        numberOfSeats: numberOfSeats,
        numberOfDoors: numberOfDoors,
      });

      return {
        status: true,
        message: "Car added successfully",
        car,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to add car to database");
    }
  }

  // Fetch car data
  static async fetchCar(id) {
    try {
      // Corrected findByPk call, passing id directly
      const car = await AllCars.findByPk(id);
      if (car) {
        return {
          status: true,
          message: "Car data fetched successfully",
          data: car,
        };
      } else {
        return {
          status: false,
          message: "Failed to fetch Car data",
        };
      }
    } catch (error) {
      throw new Error("Failed to fetch Car from Database");
    }
  }

  // fetch all car data from database
  static async getAllCars() {
    try {
      const cars = await AllCars.findAll({
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
          "description",
          "year",
          "primaryImageUrl",
          "secondaryImages",
          "availableQuantity",
          "fuelType",
          "transmissionType",
          "numberOfSeats",
          "numberOfDoors",
        ],
      });

      // Format the response to match the desired structure
      const formattedCars = cars.map((car) => ({
        id: car.id,
        name: car.name,
        description: car.description,
        year: car.year,
        brandName: car.brand.name, // Brand name from the joined Brands table
        brandLogo: car.brand.imageUrl, // Brand logo from the joined Brands table
        primaryImage: car.primaryImageUrl,
        otherImages: car.secondaryImages,
        availableQuantity: car.availableQuantity,
        fuelType: car.fuelType,
        transmissionType: car.transmissionType,
        numberOfSeats: car.numberOfSeats,
        numberOfDoors: car.numberOfDoors,
      }));

      return formattedCars;
    } catch (error) {
      throw new Error("Failed to fetch Data from the database");
    }
  }

  //   delete car
  static async deleteCar(id) {
    try {
      const car = await RentableCars.findAll({
        where: {
          carId: id,
          bookingDates: {
            [Sequelize.Op.ne]: null, // Check if bookingDates is not null
          },
        },
      });

      if (car.length !== 0) {
        return {
          status: false,
          message:
            "Can't delete this Model, Because lots of bookings has been done on this vehicle",
        };
      } else {
        const deleted = await AllCars.destroy({
          where: { id: id }, // Condition to match the brand's ID
        });

        if (deleted) {
          return {
            status: true,
            message: "Car model deleted succesfully.",
          };
        } else {
          return {
            status: false,
            message: "No car model found in this id",
          };
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // edit car details
  static async editcar(
    id,
    name,
    description,
    brandId,
    primaryImage,
    otherImages,
    availableQuantity,
    year,
    fuelType,
    transmissionType,
    numberOfSeats,
    numberOfDoors
  ) {
    try {
      const car = await AllCars.findByPk(id);
      const updatedCar = await car.update({
        name:name,
        description:description,
        brandId:brandId,
        primaryImageUrl:primaryImage,
        secondaryImages:otherImages,
        availableQuantity:availableQuantity,
        year:year,
        fuelType:fuelType,
        transmissionType:transmissionType,
        numberOfSeats:numberOfSeats,
        numberOfDoors:numberOfDoors,
      });

      if (updatedCar) {
        return {
          status: true,
          message: "Car details updated successfully",
        };
      } else {
        return {
          status: false,
          message: "Error occures while updating car",
        };
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default ManageCarsRepository;
