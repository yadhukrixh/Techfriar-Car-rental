import { gql } from "apollo-server-express";

const rentableCarsTypeDefs = gql`
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
    pricePerDay: Int!
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

  type Mutation {
    addRentableCar(registrationNumber: String!, carId: Int!): AddCarResponse!
  }

  type AddRentableCarResponse {
    status: Boolean!
    message: String!
  }

  type Mutation{
    changeActiveStatus(id:Int!,status:Boolean!): ChangeActiveStatusResponse!
  }

  type ChangeActiveStatusResponse{
    status: Boolean!
    message: String!
  }

  type Mutation {
    editRegistrationNumber(id:Int!,registrationNumber:String!): EditRegistrationNumberResponse!
  }

  type EditRegistrationNumberResponse{
    status:Boolean!
    message:String!
  }

  
`;

export default rentableCarsTypeDefs;
