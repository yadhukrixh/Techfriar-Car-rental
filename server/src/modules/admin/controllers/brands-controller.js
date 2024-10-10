
import dotenv from "dotenv";
import BrandsRepository from "../repositories/brands-repo.js";
import { FormatImageUrl } from "../../../utils/format-image-url.js";
import { MinioUtils } from "../../../utils/minio-functions.js";

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

  // Add brands to the db
  static async addBrands(name, country, image) {
    try {
      const isBrandExist = await BrandsRepository.checkBrandExist(name);

      if (isBrandExist.status) {
        return {
          status: false,
          message: "Brand already exist",
        };
      }

      const imageUrl = await MinioUtils.uploadFileToMinio(image, "/brands");
      if (!imageUrl) {
        return {
          status: false,
          message: "Failed to upload image on minio.",
        };
      }

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
      await MinioUtils.deleteFileFromMinio(brand.data.imageUrl);

      const deleteBrand = await BrandsRepository.deleteBrand(id);
      return deleteBrand;

      // delete from the db after deletion from minio
    } catch (error) {
      console.error(error);
    }
  }

  // function for update brand
  static async updateBrand(id, name, country, image) {
    try {
      // Check the given brand is already exist
      const isBrandExist = await BrandsRepository.checkBrandExist(name);
      if (isBrandExist.status && isBrandExist.data.id !== id) {
        return {
          status: false,
          message: "This Brand already Exist !",
        };
      }

      const brand = await this.getBrand(id);

      // set image url into an another variable, it may or may not change according to the Image that we get from the backend
      let imageUrl = brand.data.imageUrl;

      if (brand.status) {
        // if there i an new logo, we have to delete the old logo and insert a new one
        if (image !== null) {
          // delete the image first
          await MinioUtils.deleteFileFromMinio(brand.data.imageUrl);

          // Now add new image
          imageUrl = await MinioUtils.uploadFileToMinio(image, "/brands");
        }

        const updateBrand = await BrandsRepository.updateBrand(
          id,
          name,
          country,
          imageUrl
        );
        return {
          status: updateBrand.status,
          message: updateBrand.message,
        };
      } else {
        return {
          status: false,
          message: "There is no brand present on this id",
        };
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
