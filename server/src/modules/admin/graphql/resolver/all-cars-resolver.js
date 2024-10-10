import { FormatImageUrl } from "../../../../utils/format-image-url.js";
import ManageCarControllers from "../../controllers/cars-controller.js";

const allCarsResolver = {
  Query: {
    getAllCars: async () => {
      try {
        const cars = await ManageCarControllers.getAllCars();
        return {
          status: cars.status,
          message: cars.message,
          data: cars.data,
        };
      } catch (error) {
        return {
          status: false,
          message: "Internal server errorm couldnt fetch Data",
        };
      }
    },
  },

  Mutation: {
    addCar: async (_, { input }) => {
      const {
        name,
        description,
        brandId,
        primaryImage,
        additionalImages,
        quantity,
        year,
        fuelType,
        transmissionType,
        numberOfSeats,
        numberOfDoors,
      } = await input;

      try {
        // Resolve primary image
        const primaryImageFile = await primaryImage;

        const additionalImagesFiles = await Promise.all(additionalImages);

        const respononse = await ManageCarControllers.addNewCar(
          name,
          description,
          brandId,
          primaryImageFile,
          additionalImagesFiles,
          quantity,
          year,
          fuelType,
          transmissionType,
          numberOfSeats,
          numberOfDoors
        );

        // Example response indicating success
        return {
          status: respononse.status,
          message: respononse.message,
        };
      } catch (error) {
        console.error(error);
        return {
          status: false,
          message: "An error occurred while adding the vehicle",
        };
      }
    },

    deleteCar: async (_, { id }) => {
      try {
        const deleteBrand = await ManageCarControllers.deleteCar(id);
        return {
          status: deleteBrand.status,
          message: deleteBrand.message,
        };
      } catch (error) {
        return {
          status: false,
          message: "Internal server error",
        };
      }
    },

    editCar: async (
      _,
      {
        id,
        name,
        description,
        brandName,
        primaryImage,
        otherImages,
        availableQuantity,
        year,
        fuelType,
        transmissionType,
        numberOfSeats,
        numberOfDoors,
      }
    ) => {
      try {
        const editCar = await ManageCarControllers.editcar(
          id,
          name,
          description,
          brandName,
          primaryImage,
          otherImages,
          availableQuantity,
          year,
          fuelType,
          transmissionType,
          numberOfSeats,
          numberOfDoors);
          return{
            status:editCar.status,
            message:editCar.message
          }
      } catch (error) {
        console.error(error);
        return {
          status: false,
          message: "Internal server error",
        };
      }
    },
  },
};

export default allCarsResolver;
