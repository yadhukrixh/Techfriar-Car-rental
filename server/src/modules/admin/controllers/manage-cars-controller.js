import ManageCarsRepository from "../repositories/manage-cars-repo.js";
import mime from "mime-types";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import minioClient from "../../../config/minio.js";
dotenv.config();

class ManageCarControllers {
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
    numberOfDoors
  ) {


    try {
      // Check if car already exists
      const carExist = await ManageCarsRepository.checkCarExist(name,year);
      if (carExist.status) {
        return {
          status: false,
          message: "This Car already exists",
        };
      } else {
        // Upload primary image
        const primaryImageUrl = await this.uploadImageToTheMinio(
          `cars/${name}/primaryImage`,
          primaryImageFile
        );

        // Upload additional images using map and Promise.all
        const otherImages = await Promise.all(
          additionalImagesFiles.map(async (imageFile, index) => {
            return await this.uploadImageToTheMinio(
              `cars/${name}/additionalImages`,
              imageFile
            );
          })
        );

        const response = await ManageCarsRepository.addCar(name,description,brandId,primaryImageUrl,otherImages,quantity,year,fuelType,transmissionType,numberOfSeats,numberOfDoors)

        if(response){
            return {
              status: response.status,
              message: response.message,
            };
        }
      }
    } catch (error) {
        console.error(error);
      return{
        status:false,
        message:"failed to add car on the database"
      }
    }
  }

  // Upload imge to the minio
  static async uploadImageToTheMinio(folderName, image) {
    try {
      // Ensure we have the correct fields from the image object
      const { createReadStream, filename } = await image;

      if (!createReadStream || typeof createReadStream !== "function") {
        throw new Error(
          "Invalid image file: createReadStream is not a function."
        );
      }

      if (!filename) {
        throw new Error("File name is missing.");
      }

      // Create a unique filename by appending a UUID
      const uniqueFilename = `${folderName}/${uuidv4()}-${filename}`;
      const stream = createReadStream();
      const contentType = mime.lookup(filename) || "application/octet-stream";

      // Ensure the bucket exists before uploading
      await new Promise((resolve, reject) => {
        minioClient.bucketExists(
          process.env.MINIO_BUCKET_NAME,
          (err, exists) => {
            if (err) {
              console.error("Error checking bucket existence:", err);
              return reject(
                new Error("Failed to check MinIO bucket existence.")
              );
            }
            if (!exists) {
              return reject(new Error("MinIO bucket does not exist."));
            }
            resolve(true);
          }
        );
      });

      // Upload the image to MinIO
      await new Promise((resolve, reject) => {
        minioClient.putObject(
          process.env.MINIO_BUCKET_NAME,
          uniqueFilename,
          stream,
          { "Content-Type": contentType },
          (error) => {
            if (error) {
              console.error("MinIO upload failed:", error);
              return reject(new Error("MinIO upload failed."));
            }
            resolve();
          }
        );
      });

      // Generate a presigned URL after the upload
      return uniqueFilename;
    } catch (error) {
      console.error("Error uploading image to MinIO:", error.message);
      throw new Error(`Failed to upload image to MinIO: ${error.message}`);
    }
  }

}

export default ManageCarControllers;
