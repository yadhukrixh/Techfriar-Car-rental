import Typesense from "typesense";
import dotenv from "dotenv";

dotenv.config();

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST, // Typesense Cloud host
      port: process.env.TYPESENSE_PORT, // Default HTTPS port for Typesense Cloud
      protocol: "https",
    },
  ],
  apiKey: process.env.TYPESENSE_ADMIN_KEY, // Typesense Cloud Admin API key
  connectionTimeoutSeconds: 2,
});

const carSchema = {
  name: "cars",
  fields: [
    { name: "id", type: "string", facet: false },
    { name: "name", type: "string", facet: true },
    { name: "year", type: "int32", facet: true },
    { name: "brandName", type: "string", facet: true },
    { name: "fuelType", type: "string", facet: true },
    { name: "transmissionType", type: "string", facet: true },
    { name: "numberOfSeats", type: "int32", facet: true },
    { name: "numberOfDoors", type: "int32", facet: true },
    { name: "price", type: "float", facet: true }, // Include price field
  ],
  default_sorting_field: "price", // Set default sorting by price
};

// Function to create the collection if it doesn't already exist
async function createCollection() {
  try {
    const existingCollections = await typesenseClient.collections().retrieve();
    const collectionExists = existingCollections.some(
      (collection) => collection.name === "cars"
    );

    if (!collectionExists) {
      await typesenseClient.collections().create(carSchema);
      console.log("Cars collection created successfully.");
    } else {
      console.log("Cars collection already exists.");
    }
  } catch (error) {
    console.error("Error creating or checking collection:", error);
  }
}

createCollection();

export const buildQuery = ({
  selectedFuelTypes,
  selectedTransmission,
  selectedCapacities,
  maxPrice,
  searchQuery,
}) => {
  const filterConditions = [];

  // Fuel Type Filter
  if (selectedFuelTypes && selectedFuelTypes.length > 0) {
    const fuelTypeFilter = selectedFuelTypes
      .map((fuelType) => `fuelType: "${fuelType.toLowerCase()}"`)
      .join(" || ");
    filterConditions.push(`(${fuelTypeFilter})`);
  }

  // Transmission Filter
  if (selectedTransmission && selectedTransmission.length > 0) {
    const transmissionFilter = selectedTransmission
      .map((transmission) => `transmissionType: "${transmission.toLowerCase()}"`)
      .join(" || ");
    filterConditions.push(`(${transmissionFilter})`);
  }

  // Capacity Filter
  if (selectedCapacities && selectedCapacities.length > 0) {
    const capacityFilter = selectedCapacities
      .map((capacity) => `numberOfSeats: ${capacity}`)
      .join(" || ");
    filterConditions.push(`(${capacityFilter})`);
  }

  // Price Filter
  if (maxPrice) {
    filterConditions.push(`price: <= ${maxPrice}`);
  }

  return filterConditions.length ? filterConditions.join(" && ") : "";
};

// Search cars
export const searchCarsWithFilters = async ({
  searchQuery = "*",
  filters = "",
}) => {
  try {
    const response = await typesenseClient
      .collections("cars")
      .documents()
      .search({
        q: searchQuery,
        query_by: "name, brandName, fuelType, transmissionType", // Fields to search
        filter_by: filters, // Apply filters here
      });

    return {
      status: true,
      data: response.hits.map((hit) => ({
        id: parseInt(hit.document.id),
        name: hit.document.name,
        brandName: hit.document.brandName,
        fuelType: hit.document.fuelType,
        transmissionType: hit.document.transmissionType,
        price: hit.document.price,
        year: hit.document.year,
        numberOfSeats: hit.document.numberOfSeats,
        numberOfDoors: hit.document.numberOfDoors,
      })),
    };
  } catch (error) {
    console.error("Error searching cars:", error);
    return {
      status: false,
      message: "Error searching cars",
    };
  }
};

export default typesenseClient;
