import { GraphQLUpload } from 'graphql-upload';
import BrandController from '../../controllers/brands-controller.js';

const brandResolvers = {
    Upload:GraphQLUpload,

    Mutation: {
        addBrand: async (_, { name, country, image }) => {
          try {
            // Call the helper method to handle the image upload and manufacturer creation
            const brand = await BrandController.addBrands(name,country,image);
            return{
                succes:brand.success,
                message:brand.message,
            }
          } catch (error) {
            console.error('Error in addManufacturer mutation:', error);
            throw new Error('Failed to add manufacturer');
          }
        },
      },
}


export default brandResolvers;