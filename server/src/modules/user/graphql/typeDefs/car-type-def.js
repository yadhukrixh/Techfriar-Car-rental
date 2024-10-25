import { gql } from "apollo-server-express";

const handleCarTypeDefs = gql`
  type Query {
    fetchAvailableCars(
      startDate: String!,
      endDate: String!,
      fuelTypes: [String],
      transmissionTypes: [String],
      capacities: [Int],
      maxPrice: Int,
      sortType: String,
      searchQuery: String
    ): FetchAvailableCarsResponse!
  }

  type FetchAvailableCarsResponse {
    status: Boolean!
    message: String!
    data: [CarData]!
  }

  type CarData {
    id: Int!
    name: String!
    description: String!
    brandName: String!
    brandLogo: String!
    primaryImage: String!
    secondaryImages: [String]!
    year: Int!
    fuelType: String!
    transmissionType: String!
    numberOfSeats: Int!
    numberOfDoors: Int!
    pricePerDay: Int!
  }


  type Query {
    fetchCarById(id: Int!): FetchCarByIdResponse!
  }

  type FetchCarByIdResponse{
    status: Boolean!
    message:String!
    data:CarData
  }
`;

export default handleCarTypeDefs;
