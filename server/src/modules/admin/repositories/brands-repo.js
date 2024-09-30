import Brands from "../models/brands-models.js";
import Countries from "../models/countries-models.js";

class BrandsRepository {

  // Function to fetch countries from the database
  static async fetchCountries() {
    try {
      const countries = await Countries.findAll({
        attributes: ['name'], // Ensure you're fetching the correct field
      });
      return countries.map(country => ({
        country: country.name, // Map to return the correct structure
      }));
    } catch (error) {
      throw new Error("Failed to fetch Countries");
    }
  }

  static async checkBrandExist(name){
    const existingBrand = await Brands.findOne({ where: { name } });
      if (existingBrand) {
        return {
          success: true,
          message: "Brand already exists",
        };
      }
  }

  // Function for adding a manufacturer to the database
  static async addBrand(name, country, imageUrl) {
    try {
    
      // Change from `const` to `let` to allow reassignment
      const brand = await Brands.create({
        name,
        country,
        imageUrl,
      });

      return {
        success: true,
        message: "Brand added successfully",
        brand, // Optionally return the created brand object
      };
    } catch (error) {
      console.error(error); // Log the error for debugging
      throw new Error("Failed to add Brand to the database");
    }
  }

  // Function to fetch brands from the database
  static async getBrands(){
    try{
      const brands = await Brands.findAll({
        attributes:['id','name','imageUrl']
      })
      return brands;
    }catch(error){
      throw new Error("Failed to fetch Brands")
    }
  }

  
}

export default BrandsRepository;
