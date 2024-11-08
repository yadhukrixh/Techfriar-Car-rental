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
          message: "Internal server error couldnt fetch Data",
        };
      }
    },
  },

  Mutation: {
    // add car
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
        pricePerDay,
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
          numberOfDoors,
          pricePerDay
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

    // delete car
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

    // edit car
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
        pricePerDay
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
          numberOfDoors,
          pricePerDay
        );
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

    // upload excel
    excelUpload: async (_, {excelFile}) => {
      try{
        const uploadExcel = await ManageCarControllers.excelUpload(excelFile);
        
      }catch(error){
        return{
          status:false,
          message:error
        }
      }
    }
  },
};

export default allCarsResolver;
