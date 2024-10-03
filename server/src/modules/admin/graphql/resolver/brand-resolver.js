import { GraphQLUpload } from 'graphql-upload';
import BrandController from '../../controllers/brands-controller.js';

const brandResolvers = {
    Upload: GraphQLUpload,
 
    Query: {
      getBrands: async () => {
        try{
          return await BrandController.fetchBrands()
        } catch (error) {
          console.error("Error fetching brands:", error);
          throw new Error("Failed to fetch brands");
        }
      }
    },



    Mutation: {

      // addbrand Mutation
      addBrand: async (_, { name, country, image }) => {
        try {
          const brand = await BrandController.addBrands(name, country, image);
          return {
            status: brand.status, // Correct the typo here
            message: brand.message,
          }
        } catch (error) {
          console.error("Error in addBrand mutation:", error);
          return {
            status: false, // Correct the typo here
            message: "Internal server error",
          }
        }
      },

      
      // delete brand Mutation
      deleteBrand: async (_, { id }) => {
        try {
          const brand = await BrandController.deleteBrand(id);
          return {
            status: brand.status,
            message: brand.message,
          };
        } catch (error) {
          console.error("Error during deleting Brand", error);
          return {
            status: false,
            message: "Internal server error",
          };
        }
      },

      // Update brand Mutation
      updateBrand: async(_, { id, name, country, image }) => {
        try{
          const updateBrand = await BrandController.updateBrand(id,name,country,image);
          return{
            status:updateBrand.status,
            message:updateBrand.message
          }
        }catch(error){
          console.error(error);
        }
      }

      
    },
  };
  


export default brandResolvers;