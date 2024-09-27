import mime from "mime-types";
import dotenv from "dotenv";
import BrandsRepository from "../repositories/brands-repo.js";
dotenv.config();

class BrandController {
  // fetch countries to assign the brands
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

  //   assign brands to the db
  static async addBrands(name, country, image) {
    try {
      const { createReadStream, filename } = await image; // Get filename
      const stream = createReadStream();
      const uniqueFilename = `manufacturer/${uuidv4()}-${filename}`; // Generate a unique filename

      const contentType = mime.lookup(filename) || "application/octet-stream"; // Default to octet-stream

      await new Promise((resolve, reject) => {
        minioClient.putObject(
          process.env.MINIO_BUCKET_NAME,
          uniqueFilename,
          stream,
          {
            "Content-Type": contentType, // Set the content type for the uploaded file
            "Content-Disposition": "inline", // Allow inline rendering in the browser
          },
          (error) => {
            if (error) {
              console.error("Error uploading to MinIO:", error);
              return reject(new Error("MinIO upload failed"));
            }

            resolve();
          }
        );
      });

      const imageUrl = await minioClient.presignedGetObject(
        process.env.MINIO_BUCKET_NAME,
        uniqueFilename
      );

      const brand = await BrandsRepository.addBrand({name,country,imageUrl})
      return{
        success:brand.success,
        message:brand.message
      }


      
    } catch (error) {
      return{
        success:false,
        message:"Failed to Add Brand"
      }
    }
  }
}

export default BrandController;
