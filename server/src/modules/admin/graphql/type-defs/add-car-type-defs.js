import { gql } from "apollo-server-express";

const addCarsTypeDefs = gql`
  scalar Upload

  input AddCarInput {
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
  }

  type AddCarResponse {
    status: Boolean!
    message: String!
  }

  type Mutation {
    addCar(input: AddCarInput!): AddCarResponse!
  }
`;

export default addCarsTypeDefs;
