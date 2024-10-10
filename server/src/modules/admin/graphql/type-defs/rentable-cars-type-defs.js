import { gql } from "apollo-server-express";

const rentableCarsTypeDefs = gql `
  type RentableCars {
    id: Int!
    registrationNumber: String!
    activeStatus: Boolean!
  }

  type MainCarData {
    id: Int!
    name: String!
    brandName: String!
    year: Int!
    brandLogo: String!
    primaryImage: String!
    availableQuantity: Int!
    rentableCars: [RentableCars]
  }

  type FetchRentablecarsResponse {
    status: Boolean!
    message: String!
    data: MainCarData
  }

  type Query {
    fetchRentablecars(id: Int!): FetchRentablecarsResponse
  }
`;

export default rentableCarsTypeDefs;
