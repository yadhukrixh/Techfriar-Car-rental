import mime from "mime-types";
import dotenv from "dotenv";
import BrandsRepository from "../repositories/brands-repo.js";
import { v4 as uuidv4 } from "uuid";
import minioClient from "../../../config/minio.js";
import { FormatImageUrl } from "../../../utils/format-image-url.js";

dotenv.config();

class BrandController {
  // Fetch countries to assign the brands
  static async fetchCountries() {
    try {
      const countries = await BrandsRepository.fetchCountries();
      return {
        status: true,
        message: "Countries fetched successfully",
        data: countries, // Ensure you're returning this data
      };
    } catch (error) {
      return {
        status: false,
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

      if (isBrandExist) {
        return {
          status: false,
          message: "Brand already exist",
        };
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
      const imageUrl = `${uniqueFilename}`;

      // Store the brand details in the repository
      const brand = await BrandsRepository.addBrand(
        name,
        country,
        imageUrl // Store the unique filename or URL in the database
      );

      // Return success response
      return {
        status: brand.status, // Check if this is null or undefined
        message: brand.message, // Check if this is null or undefined
      };
    } catch (error) {
      console.error("Error in handleAddBrand:", error);
      return {
        status: false,
        message: "Failed to add brand",
      };
    }
  }

  // fetch brands
  static async fetchBrands() {
    try {
      const brands = await BrandsRepository.fetchBrands();

      if (brands) {
        // Format the image URLs for each brand
        const formattedBrands = brands.map((brand) => ({
          ...brand,
          id: brand.id,
          name: brand.name,
          country: brand.country,
          imageUrl: FormatImageUrl.formatImageUrl(brand.imageUrl), // Format the image URL
          numberOfCars: brand.dataValues.numberOfCars,
        }));

        return {
          status: true,
          message: "Brands fetched successfully",
          data: formattedBrands, // Return formatted brands
        };
      }
    } catch (error) {
      return {
        status: false,
        message: "Failed to fetch data",
      };
    }
  }

  // fetch single brand
  static async getBrand(id) {
    try {
      const brand = await BrandsRepository.getBrand(id);
      if (brand) {
        return {
          status: true,
          message: "Succesfully fetched Brand Data",
          data: brand,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: "Failed to fetch brand Data",
      };
    }
  }

  // delete brands
  static async deleteBrand(id) {
    try {
      const brand = await this.getBrand(id);

      // Ensure the brand exists
      if (!brand) {
        throw new Error("Brand not found");
      }

      // Delete the image from MinIO
      await new Promise((resolve, reject) => {
        minioClient.removeObject(
          process.env.MINIO_BUCKET_NAME,
          brand.data.imageUrl,
          function (err) {
            if (err) {
              console.log(
                "Error occurred while deleting the image from MinIO:",
                err
              );
              return reject(new Error("MinIO deletion failed"));
            } else {
              return resolve(); // Resolve after successful deletion
            }
          }
        );
      });

      const deleteBrand = await BrandsRepository.deleteBrand(id);
      return deleteBrand;

      // delete from the db after deletion from minio
    } catch (error) {
      console.error(error);
    }
  }

  static async updateBrand(id, name, country, image) {
    try {
      const brand = await this.getBrand(id);

      // set image url into an another variable, it may or may not change according to the Image that we get from the backend
      let imageUrl = brand.data.imageUrl;

      if (brand.status) {

        // if there i an new logo, we have to delete the old logo and insert a new one
        if (image !== null) {

          // delete the image first
          await new Promise((resolve, reject) => {
            minioClient.removeObject(
              process.env.MINIO_BUCKET_NAME,
              brand.data.imageUrl,
              function (err) {
                if (err) {
                  console.log(
                    "Error occurred while deleting the image from MinIO:",
                    err
                  );
                  return reject(new Error("MinIO deletion failed"));
                } else {
                  return resolve(); // Resolve after successful deletion
                }
              }
            );
          });

          // Now add new image
          const { createReadStream, filename } = await image;
          const stream = createReadStream();
          const uniqueFilename = `brands/${uuidv4()}-${filename}`; // Generate a unique filename
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
          imageUrl = `${uniqueFilename}`;
        }

        const updateBrand = await BrandsRepository.updateBrand(id,name,country,imageUrl);
        return{
          status:updateBrand.status,
          message:updateBrand.message
        }

      }
      else{
        return{
          status:false,
          message:"There is no brand present on this id"
        }
      }
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "Failed to update Brand",
      };
    }
  }
}

export default BrandController;
