import ManageCarsRepository from "../repositories/manage-cars-repo.js";
import dotenv from "dotenv";
import { FormatImageUrl } from "../../../utils/format-image-url.js";
import { MinioUtils } from "../../../utils/minio-functions.js";
import BrandsRepository from "../repositories/brands-repo.js";
import { parseExcelFile } from "../../../utils/parseExcelFile.js";
import { ImageDownloaderClass } from "../../../utils/image-downloader.js";
dotenv.config();

class ManageCarControllers {
  // Add new Car
  static async addNewCar(
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
  ) {
    try {
      // Check if car already exists
      const carExist = await ManageCarsRepository.checkCarExist(name, year);
      if (carExist.status) {
        return {
          status: false,
          message: "This Car already exists",
        };
      } else {
        // Upload primary image
        const primaryImageUrl = await MinioUtils.uploadFileToMinio(
          primaryImageFile,
          `cars/${name}-${year}/primaryImage`,
          process.env.MINIO_BUCKET_NAME
        );

        // Upload additional images using map and Promise.all
        const otherImages = await Promise.all(
          additionalImagesFiles.map(async (imageFile, index) => {
            return await MinioUtils.uploadFileToMinio(
              imageFile,
              `cars/${name}-${year}/additionalImages`,
              process.env.MINIO_BUCKET_NAME
            );
          })
        );

        const response = await ManageCarsRepository.addCar(
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
        );

        if (response) {
          return {
            status: response.status,
            message: response.message,
          };
        }
      }
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "failed to add car on the database",
      };
    }
  }

  // to fetch data of all car
  static async getAllCars() {
    try {
      const cars = await ManageCarsRepository.getAllCars();
      if (cars) {
        const formattedCars = cars.map((car) => ({
          id: car.id,
          name: car.name,
          description: car.description,
          year: car.year,
          brandName: car.brandName || "", // Safely access brand name
          brandLogo: FormatImageUrl.formatImageUrl(car.brandLogo || ""), // Safely access and format brand logo
          primaryImage: FormatImageUrl.formatImageUrl(car.primaryImage || ""), // Safely format primary image
          otherImages: Array.isArray(car.otherImages)
            ? car.otherImages.map((image) =>
                FormatImageUrl.formatImageUrl(image)
              ) // Format each image if it's an array
            : [], // Default to an empty array if otherImages is not valid
          availableQuantity: car.availableQuantity || 0,
          fuelType: car.fuelType || "",
          transmissionType: car.transmissionType || "",
          numberOfSeats: car.numberOfSeats || 0,
          numberOfDoors: car.numberOfDoors || 0,
          pricePerDay: car.pricePerDay,
        }));
        return {
          status: true,
          message: "Cars Data fetched succesfully",
          data: formattedCars,
        };
      } else {
        return {
          status: false,
          message: "Failed to fetch from data base",
        };
      }
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }

  // fetch car
  static async fetchCar(id) {
    try {
      const car = await ManageCarsRepository.fetchCar(id);
      return car;
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "Failed to fetch Car",
      };
    }
  }

  // delete brand
  static async deleteCar(id) {
    try {
      const car = await this.fetchCar(id);

      // delete the primary image
      await MinioUtils.deleteFileFromMinio(
        car.data.primaryImageUrl,
        process.env.MINIO_BUCKET_NAME
      );

      // Delete the secondary Images
      if (car.data.secondaryImages && car.data.secondaryImages.length > 0) {
        for (const imageUrl of car.data.secondaryImages) {
          await MinioUtils.deleteFileFromMinio(
            imageUrl,
            process.env.MINIO_BUCKET_NAME
          );
        }
      }

      const deleteCar = await ManageCarsRepository.deleteCar(id);

      return {
        status: deleteCar.status,
        message: deleteCar.message,
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "Failed to delete Car",
      };
    }
  }

  // edit Car
  static async editcar(
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
  ) {
    try {
      // Check if the car with the same name and year exists
      const isCarExist = await ManageCarsRepository.checkCarExist(name, year);
      const car = await this.fetchCar(id);

      if (isCarExist.status && name !== car.data.name) {
        return {
          status: false,
          message: "This car already exists!",
        };
      }

      // Get the brand ID from the brand name
      const brandId = (await BrandsRepository.getBrandByName(brandName)).id;

      // Handle primary image upload and deletion
      const handlePrimaryImage = async () => {
        if (primaryImage.image !== null) {
          // Upload the new primary image
          const url = await MinioUtils.uploadFileToMinio(
            primaryImage.image,
            `cars/${name}-${year}/primaryImage`,
            process.env.MINIO_BUCKET_NAME
          );
          // Delete the old primary image
          await MinioUtils.deleteFileFromMinio(
            car.data.primaryImageUrl,
            process.env.MINIO_BUCKET_NAME
          );

          return url;
        } else {
          // Return the existing primary image URL if no new image is provided
          return car.data.primaryImageUrl;
        }
      };

      const newPrimaryImageUrl = await handlePrimaryImage();

      // Get URLs of non-changeable images (those that don't have a new upload)
      const nonChangableUrls = await Promise.all(
        otherImages
          .filter((item) => item.image === null) // Keep the old image if no new upload
          .map((item) => FormatImageUrl.deStructureImage(item.imageUrl)) // Extract the URL
      );

      // Filter and upload the new images
      const newOtherImages = await Promise.all(
        otherImages
          .filter((item) => item.imageUrl === null) // Filter items that need new images
          .map((item) => item.image)
      );

      if (newOtherImages.length > 0) {
        const allImageUrls = car.data.secondaryImages;

        // Find the URLs that need to be deleted
        const deletionUrls = allImageUrls.filter(
          (item) => !nonChangableUrls.includes(item)
        );

        // Delete the images that are no longer needed
        if (deletionUrls.length > 0) {
          await Promise.all(
            deletionUrls.map((item) =>
              MinioUtils.deleteFileFromMinio(
                item,
                process.env.MINIO_BUCKET_NAME
              )
            )
          );
        }
      }

      // Upload new images and collect the URLs
      let newOtherImageUrls = await Promise.all(
        newOtherImages.map(async (imageFile, index) => {
          return await MinioUtils.uploadFileToMinio(
            imageFile,
            `cars/${name}-${year}/additionalImages`,
            process.env.MINIO_BUCKET_NAME
          );
        })
      );

      // Concatenate the non-changeable URLs with the new URLs
      newOtherImageUrls = [...newOtherImageUrls, ...nonChangableUrls]; // Spread operator to concatenate arrays

      // Update the car with new details
      const editCar = await ManageCarsRepository.editcar(
        id,
        name,
        description,
        brandId,
        newPrimaryImageUrl,
        newOtherImageUrls,
        availableQuantity,
        year,
        fuelType,
        transmissionType,
        numberOfSeats,
        numberOfDoors,
        pricePerDay
      );

      return {
        status: editCar.status,
        message: editCar.message,
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "Failed to update car",
      };
    }
  }

  // excel upload
  static async excelUpload(file) {
    try {
      const { createReadStream, filename, mimetype } = await file;

      // check the file format
      if (
        ![
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ].includes(mimetype)
      ) {
        return {
          status: false,
          message: "Invalid File type!",
        };
      }

      const stream = createReadStream();
      // parse excel file
      const vehicleData = await parseExcelFile(stream);

      let alreadyExistingVehicle = [];

      for (const vehicle of vehicleData) {
        //here handle the logic of checking is the
        // first we have to check is there the vehicle already exist
        const isExist = await ManageCarsRepository.checkCarExist(
          vehicle.name,
          vehicle.year
        );
        if (isExist.status) {
          // pushed as already existing
          alreadyExistingVehicle.push(vehicle);
          return{
            status:false,
            message:isExist.message
          }
        } else {
          // minio url
          const primaryImageUrl = await MinioUtils.uploadFileToMinio(
            await ImageDownloaderClass.urlToFIle(vehicle.primaryImageFile),
            `cars/${vehicle.name}-${vehicle.year}/primaryImage`,
            process.env.MINIO_BUCKET_NAME
          );

          // secondary urls
          const otherImageUrls = await Promise.all(
            vehicle.secondaryImageFiles.map(async (url) => {
              await MinioUtils.uploadFileToMinio(
                await ImageDownloaderClass.urlToFIle(url),
                `cars/${vehicle.name}-${vehicle.year}/additionalImages`,
                process.env.MINIO_BUCKET_NAME
              );
            })
          );

          console.log(primaryImageUrl);
          console.log(otherImageUrls);


        }
      }
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }
}

export default ManageCarControllers;
