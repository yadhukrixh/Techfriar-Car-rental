import sequelize from "../../../config/postgres.js";
import Brands from "../models/brands-models.js";
import AllCars from "../models/cars-models.js";
import Countries from "../models/countries-models.js";

class BrandsRepository {
  // Function to fetch countries from the database
  static async fetchCountries() {
    try {
      const countries = await Countries.findAll({
        attributes: ["name"], // Ensure you're fetching the correct field
      });
      return countries.map((country) => ({
        country: country.name, // Map to return the correct structure
      }));
    } catch (error) {
      throw new Error("Failed to fetch Countries");
    }
  }

  static async checkBrandExist(name) {
    const existingBrand = await Brands.findOne({ where: { name } });
    if (existingBrand) {
      return {
        status: true,
        message: "Brand already exists",
      };
    }
  }

  // Function for adding a manufacturer to the database
  static async addBrand(name, country, imageUrl) {
    try {
      // Change from `const` to `let` to allow reassignment
      let brand = await Brands.create({
        name,
        country,
        imageUrl,
      });

      return {
        status: true,
        message: "Brand added successfully"
      };
    } catch (error) {
      console.error(error); // Log the error for debugging
      throw new Error("Failed to add Brand to the database");
    }
  }

  // Function to fetch brands from the database
  static async fetchBrands() {
    try {
      const brands = await Brands.findAll({
        attributes: [
          "id",
          "name",
          "imageUrl",
          "country",
          // Use Sequelize's literal to count the number of associated cars
          [sequelize.fn("COUNT", sequelize.col("AllCars.id")), "numberOfCars"],
        ],
        include: [
          {
            model: AllCars,
            as: "AllCars",
            attributes: [], // No need to retrieve car details, only the count
          },
        ],
        group: ["Brand.id"], // Group by the correct alias "Brand.id"
      });
      return brands;
    } catch (error) {
      throw new Error("Failed to fetch Brands");
    }
  }

  // fetch each brand data
  static async getBrand(id) {
    try {
      const brand = await Brands.findOne({ where: { id } });
      if (brand) {
        return brand.dataValues;
      }
    } catch (error) {
      throw new Error("Failed to fetch Brand data");
    }
  }

  // Delete the brand
  static async deleteBrand(brandId) {
    try {
      // Attempt to delete the brand by its ID
      const deleted = await Brands.destroy({
        where: { id: brandId }, // Condition to match the brand's ID
      });

      if (deleted) {
        return {
          status: true,
          message: `Brand with ID ${brandId} deleted successfully.`,
        };
      } else {
        return {
          status: false,
          message: `Brand with ID ${brandId} not found.`,
        };
      }
    } catch (error) {
      return {
        status: false,
        message: "Failed to delete brand",
        error: error.message, // Add the error message for debugging
      };
    }
  }

  // update the brand data 
  static async updateBrand(id,name,country,imageUrl){
    try{

      const brand = await Brands.findByPk(id);
      const updatedBrand = await brand.update({
        name,
        country,
        imageUrl,
      });
      if(updatedBrand){
        return{
          status:true,
          message:"Brand Updated Successfully"
        }
      }
    }catch(error){
      throw new Error(error);
    }
  }
}

export default BrandsRepository;
