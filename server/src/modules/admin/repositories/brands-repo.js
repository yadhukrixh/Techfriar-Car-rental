import { where } from "sequelize";
import Brands from "../models/brands-models.js";
import Countries from "../models/countries-models.js";

class BrandsRepository {

  // function to fetch countries from db
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


  // function for add manufacturer on db
  static async addBrand({name,country,imageUrl}){
    try{
      const brand = await Brands.find({where:{name}});
      if(brand){
        return{
          success:false,
          message:"Brand alreay exist"
        }
      }
      brand = await Brands.create({
        name,country,imageUrl
      })
    }catch(error){
      throw new Error("Failed to add Brand")
    }
  }
}

export default BrandsRepository;
