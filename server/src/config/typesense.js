import Typesense from 'typesense';
import dotenv from 'dotenv';

dotenv.config();

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST,  // Typesense Cloud host
      port: process.env.TYPESENSE_PORT,  // Default HTTPS port for Typesense Cloud
      protocol: 'https',
    },
  ],
  apiKey: process.env.TYPESENSE_ADMIN_KEY,  // Typesense Cloud Admin API key
  connectionTimeoutSeconds: 2,
});

const carSchema = {
  name: 'cars',
  fields: [
    { name: 'id', type: 'int32', facet: false },
    { name: 'name', type: 'string', facet: true },
    { name: 'description', type: 'string', facet: false },
    { name: 'brandName', type: 'string', facet: true },  // Use brandName instead of brandId
    { name: 'primaryImageUrl', type: 'string', facet: false },
    { name: 'secondaryImages', type: 'string[]', facet: false },
    { name: 'availableQuantity', type: 'int32', facet: false },
    { name: 'year', type: 'int32', facet: true },
    { name: 'fuelType', type: 'string', facet: true },
    { name: 'transmissionType', type: 'string', facet: true },
    { name: 'numberOfSeats', type: 'int32', facet: true },
    { name: 'numberOfDoors', type: 'int32', facet: true },
    { name: 'price', type: 'float', facet: true },  // Include price field
  ],
  default_sorting_field: 'price',  // Set default sorting by price
};

// Function to create the collection if it doesn't already exist
async function createCollection() {
  try {
    const existingCollections = await typesenseClient.collections().retrieve();
    const collectionExists = existingCollections.some(
      (collection) => collection.name === 'cars'
    );

    if (!collectionExists) {
      await typesenseClient.collections().create(carSchema);
      console.log('Cars collection created successfully.');
    } else {
      console.log('Cars collection already exists.');
    }
  } catch (error) {
    console.error('Error creating or checking collection:', error);
  }
}

createCollection();

export default typesenseClient;
