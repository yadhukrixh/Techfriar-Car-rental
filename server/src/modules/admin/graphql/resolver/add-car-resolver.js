import ManageCarControllers from "../../controllers/manage-cars-controller.js";

const addCarResolver = { 
    Mutation:{
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


                const respononse = await ManageCarControllers.addNewCar(name,description,brandId,primaryImageFile,additionalImagesFiles,quantity,year,fuelType,transmissionType,numberOfSeats,numberOfDoors)


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
        }
    }
};

export default addCarResolver;
