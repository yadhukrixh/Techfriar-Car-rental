import { Sequelize } from "sequelize";
import Brands from "../models/brands-models.js";
import AllCars from "../models/cars-models.js";
import RentableCars from "../models/rentable-cars-models.js";
import Orders from "../models/orders-model.js";

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
    numberOfDoors,
    pricePerDay
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
        pricePerDay: pricePerDay,
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
          "pricePerDay",
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
        pricePerDay: car.pricePerDay,
      }));

      return formattedCars;
    } catch (error) {
      throw new Error("Failed to fetch Data from the database");
    }
  }

  //   delete car
  static async deleteCar(id) {
    try {
      // Find all rentable cars associated with the car model ID
      const rentableCars = await RentableCars.findAll({
        where: { carId: id },
        attributes: ["id"], // Only select the rentable car IDs
      });

      // Get the rentable car IDs to check for bookings
      const rentableCarIds = rentableCars.map((car) => car.id);

      // Check if any orders exist with booked dates for any of the rentable car IDs
      const bookingsExist = await Orders.findOne({
        where: {
          bookedCarId: {
            [Sequelize.Op.in]: rentableCarIds,
          },
          bookedDates: {
            [Sequelize.Op.ne]: null, // Check if bookedDates is not null
          },
        },
      });

      // If there are bookings, prevent deletion
      if (bookingsExist) {
        return {
          status: false,
          message: "Can't delete this model, as it has active bookings.",
        };
      }

      // No bookings exist, proceed with deletion
      const deleted = await AllCars.destroy({
        where: { id: id }, // Match the car model ID
      });

      if (deleted) {
        return {
          status: true,
          message: "Car model deleted successfully.",
        };
      } else {
        return {
          status: false,
          message: "No car model found with this ID.",
        };
      }
    } catch (error) {
      console.error("Error deleting car model:", error);
      return {
        status: false,
        message: "An error occurred while deleting the car model.",
      };
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
    numberOfDoors,
    pricePerDay
  ) {
    try {
      const car = await AllCars.findByPk(id);
      const updatedCar = await car.update({
        name: name,
        description: description,
        brandId: brandId,
        primaryImageUrl: primaryImage,
        secondaryImages: otherImages,
        availableQuantity: availableQuantity,
        year: year,
        fuelType: fuelType,
        transmissionType: transmissionType,
        numberOfSeats: numberOfSeats,
        numberOfDoors: numberOfDoors,
        pricePerDay: pricePerDay,
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
