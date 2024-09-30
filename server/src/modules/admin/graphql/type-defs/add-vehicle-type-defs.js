import { gql } from "apollo-server-express";

const addVehiclesTypeDefs = gql`
  scalar Upload

  type AddVehicleResponse {
    success: Boolean!
    message: String!
  }

  type Mutation {
    addVehicle(
      name: String!
      description: String!
      brandId: Int!
      primaryImage: Upload!
      additionalImages: [Upload!]!
      quantity: Int!
      year: Int
      fuelType: String
      transmissionType: String
      numberOfSeats: Int!
      numberOfDoors: Int!
    ): AddVehicleResponse!
  }
`;

export default addVehiclesTypeDefs;
