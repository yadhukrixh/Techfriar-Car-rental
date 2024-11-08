import { gql } from "apollo-server-express";

const allCarsTypeDefs = gql`
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
    pricePerDay: Int
  }

  type AddCarResponse {
    status: Boolean!
    message: String!
  }

  type Mutation {
    addCar(input: AddCarInput!): AddCarResponse!
  }

  type CarData {
    id: Int!
    name: String!
    description: String!
    brandName: String!
    year: Int!
    brandLogo: String!
    primaryImage: String!
    otherImages: [String!]!
    availableQuantity: Int!
    fuelType: String!
    transmissionType: String!
    numberOfSeats: Int!
    numberOfDoors: Int!
    pricePerDay: Int!
  }

  type GetAllCarsResponse {
    status: Boolean!
    message: String!
    data: [CarData!]
  }

  type Query {
    getAllCars: GetAllCarsResponse!
  }

  type DeleteCarResponse {
    status: Boolean!
    message: String!
  }

  type Mutation {
    deleteCar(id: Int!): DeleteCarResponse!
  }

  input UploadOrStringInput {
    image: Upload
    imageUrl: String
  }
    

  type Mutation {
    editCar(
      id: Int!
      name: String!
      description: String!
      brandName: String!
      primaryImage: UploadOrStringInput!
      otherImages: [UploadOrStringInput!]!
      availableQuantity: Int!
      year: Int!
      fuelType: String!
      transmissionType: String!
      numberOfSeats: Int!
      numberOfDoors: Int!
      pricePerDay: Int!
    ): EditCarResponse

    excelUpload(excelFile:Upload!): EditCarResponse!
  }

  type EditCarResponse {
    status: Boolean!
    message: String!
  }
`;

export default allCarsTypeDefs;
