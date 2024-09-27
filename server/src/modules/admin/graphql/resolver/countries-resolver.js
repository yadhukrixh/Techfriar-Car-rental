import BrandController from "../../controllers/brands-controller.js";


const countriesResolvers = {


  Query: {
    getCountries: async () => {
      try {
        return await BrandController.fetchCountries(); 
      } catch (error) {
        console.error("Error fetching countries:", error);
        throw new Error("Failed to fetch countries");
      }
    },
  },

  
};

export default countriesResolvers;