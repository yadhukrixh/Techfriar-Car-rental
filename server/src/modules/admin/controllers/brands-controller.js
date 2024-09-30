import mime from "mime-types";
import dotenv from "dotenv";
import BrandsRepository from "../repositories/brands-repo.js";
import { v4 as uuidv4 } from 'uuid';
import minioClient from "../../../config/minio.js";

dotenv.config();

class BrandController {
  // Fetch countries to assign the brands
  static async fetchCountries() {
    try {
      const countries = await BrandsRepository.fetchCountries();
      return {
        success: true,
        message: "Countries fetched successfully",
        data: countries, // Ensure you're returning this data
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch data",
      };
    }
  }

  // Assign brands to the db
  static async addBrands(name, country, image) {
    try {
      // Get the file stream and filename
      const { createReadStream, filename } = await image;
      const stream = createReadStream();
      const uniqueFilename = `brands/${uuidv4()}-${filename}`; // Generate a unique filename

      const isBrandExist = await BrandsRepository.checkBrandExist(name);

      if(isBrandExist){
        return{
          success:false,
          message:"Brand already exist"
        }
      }
  
      // Determine the content type of the file (default to application/octet-stream if unknown)
      const contentType = mime.lookup(filename) || "application/octet-stream";
  
      // Upload the file to MinIO
      await new Promise((resolve, reject) => {
        minioClient.putObject(
          process.env.MINIO_BUCKET_NAME,
          uniqueFilename,
          stream,
          {
            "Content-Type": contentType, // Set the content type
          },
          (error) => {
            if (error) {
              console.error("Error uploading to MinIO:", error);
              return reject(new Error("MinIO upload failed"));
            }
            resolve(); // Resolve the promise on successful upload
          }
        );
      });
  
      // Instead of generating a presigned URL, store the unique filename
      const imageUrl = `http://${process.env.MINIO_SERVER}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${uniqueFilename}`;
      console.log(imageUrl); // You can log or further use this URL

      // Store the brand details in the repository
      const brand = await BrandsRepository.addBrand(
        name,
        country,
        imageUrl, // Store the unique filename or URL in the database
      );
  
      // Return success response
      return {
        success: brand.success,
        message: brand.message,
      };
    } catch (error) {
      console.error("Error in handleAddBrand:", error);
      return {
        success: false,
        message: "Failed to add brand",
      };
    }
  }

  static async fetchBrands(){
    try{
      const brands = await BrandsRepository.getBrands();
      if(brands){
        return {
          success: true,
          message: "Countries fetched successfully",
          data: brands, // Ensure you're returning this data
        };
      }
      
    }catch(error){
      return {
        success: false,
        message: "Failed to fetch data",
      };
    }
  }
}

export default BrandController;
