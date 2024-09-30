import { GraphQLUpload } from 'graphql-upload';
import BrandController from '../../controllers/brands-controller.js';

const brandResolvers = {
    Upload: GraphQLUpload,
  
    Mutation: {
      addBrand: async (_, { name, country, image }) => {
        try {
          const brand = await BrandController.addBrands(name, country, image);
          return {
            success: brand.success, // Correct the typo here
            message: brand.message,
          };
        } catch (error) {
          console.error("Error in addBrand mutation:", error);
          throw new Error("Failed to add brand on resolver");
        }
      },
    },

    Query: {
      getBrands: async () => {
        try{
          return await BrandController.fetchBrands()
        } catch (error) {
          console.error("Error fetching brands:", error);
          throw new Error("Failed to fetch brands");
        }
      }
    }
  };
  


export default brandResolvers;