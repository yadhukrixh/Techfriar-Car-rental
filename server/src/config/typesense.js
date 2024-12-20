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

// Car Schema
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
    { name: "price", type: "float", facet: true },
  ],
  default_sorting_field: "price",
};

// Updated Order Schema
const orderSchema = {
  name: "orders",
  fields: [
    { name: "id", type: "string", facet: false },
    { name: "userId", type: "string", facet: true },
    { name: "method", type: "string", facet: true },
    { name: "orderStatus", type: "string", facet: true },
    { name: "completionStatus", type: "string", facet: true },
    { name: "amount", type: "float", facet: true },
    { name: "bookedDates", type: "string[]", facet: true },
    { name: "brandName", type: "string", facet: true },
    { name: "carName", type: "string", facet: true },
    { name: "registrationNumber", type: "string", facet: true },
    { name: "completionDate", type: "int64", facet: false }, // Assuming you have a timestamp field for time period filtering
  ],
  default_sorting_field: "amount",
};

// Function to create collections if they don't already exist
async function createCollections() {
  try {
    const existingCollections = await typesenseClient.collections().retrieve();

    // Check if 'cars' collection exists
    if (!existingCollections.some((collection) => collection.name === "cars")) {
      await typesenseClient.collections().create(carSchema);
      console.log("Cars collection created successfully.");
    } else {
      console.log("Cars collection already exists.");
    }

    // Check if 'orders' collection exists
    if (
      !existingCollections.some((collection) => collection.name === "orders")
    ) {
      await typesenseClient.collections().create(orderSchema);
      console.log("Orders collection created successfully.");
    } else {
      console.log("Orders collection already exists.");
    }
  } catch (error) {
    console.error("Error creating or checking collections:", error);
  }
}

createCollections();

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
      .map(
        (transmission) => `transmissionType: "${transmission.toLowerCase()}"`
      )
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
        query_by: "name, brandName, fuelType, transmissionType",
        filter_by: filters,
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

// cerate order filter
export const buildOrderQuery = ({
  selectedTimePeriod,
  selectedStatus,
  searchQuery = "*",
}) => {
  const filterConditions = [];

  // Time Period Filter (Assuming completionDate is stored as a timestamp in seconds)
  if (selectedTimePeriod) {
    const now = Math.floor(Date.now() / 1000);
    const periodMap = {
      "Last 30 Days": 2592000,
      "In 6 Months": 15552000,
      "In 1 Year": 31104000
    };

    const periodInSeconds = periodMap[selectedTimePeriod];
    if (periodInSeconds) {
      filterConditions.push(`completionDate: >= ${now - periodInSeconds}`);
    }
  }

  // Status Filter
  if (selectedStatus) {
    filterConditions.push(`completionStatus: "${selectedStatus.toLowerCase()}"`);
  }

  return filterConditions.length ? filterConditions.join(" && ") : "";
};

// Search orders with the new filters
export const searchOrdersWithFilters = async ({
  searchQuery = "*",
  filters = "",
}) => {
  try {
    const response = await typesenseClient
      .collections("orders")
      .documents()
      .search({
        q: searchQuery,
        query_by: "userId, method, orderStatus, brandName, carName, bookedDates, completionStatus, registrationNumber",
        filter_by: filters,
      });

    return {
      status: true,
      data: response.hits.map((hit) => ({
        id: hit.document.id,
        userId: hit.document.userId,
        method: hit.document.method,
        orderStatus: hit.document.orderStatus,
        amount: hit.document.amount,
        bookedDates: hit.document.bookedDates,
        brandName: hit.document.brandName,
        carName: hit.document.carName,
        registrationNumber: hit.document.registrationNumber,
      })),
    };
  } catch (error) {
    console.error("Error searching orders:", error);
    return {
      status: false,
      message: "Error searching orders",
    };
  }
};

export default typesenseClient;
